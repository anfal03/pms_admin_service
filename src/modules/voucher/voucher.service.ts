import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { VoucherModel } from '../../models';
import {
  VOUCHER_REPOSITORY,
  DATABASE_CONNECTION,
} from '../../config/constants';
import { Sequelize } from 'sequelize-typescript';
import { winstonLog } from '../../config/winstonLog';
import axios from 'axios';

@Injectable()
export class VoucherService {
  constructor(
    @Inject(DATABASE_CONNECTION) private DB: Sequelize,
    @Inject(VOUCHER_REPOSITORY)
    private readonly voucherRepository: typeof VoucherModel,
  ) {}

  // async voucherReedem({user_id, voucherid, purchase_by_cash, transectionid,accountid, transection_datetime, amount}) {

  //     /*
  //       voucherid check if exist or not
  //       voucher quota avilable or not
  //       is voucher status active or not
  //       today is in inside startdate and expirydate ?
  //       if (purchase_by_cash ==true) then
  //             pick customer point balance and check voucher reedem needed point is avilable or not
  //       else then
  //             no need to check customer point

  //      if voucher have minexpamount then also need to check customer total shopping amount of this
  //      specific merchent is >= minexpamount

  //       check is there have any uploaded custom voucher code or not
  //       if (custom code avilable) then
  //              pick voucher code and insert purchase table as a purchase code
  //       else then
  //              generate a system code and insert purchase table as a purchase code

  //     */
  //     winstonLog.log('info', 'Voucher Reedem Request %o', {user_id, voucherid, purchase_by_cash, transectionid,accountid, transection_datetime, amount}, { label: 'voucher-reedem' })

  //     const response = await this.DB.query(`select * from voucher_reedem(${user_id},'${voucherid}', ${purchase_by_cash}, '${transectionid}','${accountid}','${transection_datetime}',${amount})`)

  //     const responseObj = response[0][0]

  //     winstonLog.log('info', 'Voucher Reedem Response %o', responseObj, { label: 'voucher-reedem' })

  //     if(responseObj['code'] != 100) {

  //         throw new BadRequestException(responseObj['msg'],'4004')
  //     }

  //     // send message....

  //     return {
  //         voucher_code : responseObj['_vouchercode'],
  //         res_message : responseObj['msg']
  //     }

  // }

  async voucherCustomCodeProcess(voucherid) {
    winstonLog.log(
      'info',
      'Voucher customcode processor Request: %o',
      { voucherid },
      { label: 'voucher-customcode-api' },
    );

    axios({
      url: `${process.env.VOUCHER_CUSTOMCODE_PROCESSOR_URL}`,
      method: 'POST',
      data: { voucherid },
      headers: {
        module: process.env.VOUCHER_CUSTOMCODE_PROCESSOR_MODULE_KEY,
        'Content-type': 'application/json',
      },
    })
      .then((response) => {
        winstonLog.log(
          'info',
          'Voucher customcode processor Response: %o',
          response.data,
          { label: 'voucher-customcode-api' },
        );
      })
      .catch((e) => {
        winstonLog.log(
          'error',
          'Voucher customcode processor Response: %o',
          e['response'] || e,
          { label: 'voucher-customcode-api' },
        );
      });
  }

  async voucherList({ merchantid, created_by, created_user_type }) {
    let query = `select * from pmsvoucherlistview order by createdat DESC`;
    let mypendingquery = `select * from pmsvoucherpendinglistview where createdby = '${created_by}' order by createdat DESC`;
    let approvependingquery = `select * from pmsvoucherpendinglistview where createdby != '${created_by}' order by createdat DESC`;

    if (merchantid) {
      query = `select * from pmsvoucherlistview where merchantid = ${merchantid} order by createdat DESC`;
      mypendingquery = `select * from pmsvoucherpendinglistview where merchantid = ${merchantid} and createdby = '${created_by}' order by createdat DESC`;
      approvependingquery = `select * from pmsvoucherpendinglistview where merchantid = ${merchantid} and createdby != '${created_by}' order by createdat DESC`;
    }

    winstonLog.log(
      'info',
      'Voucher List Request: %s',
      { query },
      { label: 'voucher-list' },
    );

    const [response, mypendingresponse, approvependingresponse] =
      await Promise.all([
        this.DB.query(query),
        this.DB.query(mypendingquery),
        this.DB.query(approvependingquery),
      ]);

    return {
      list: response[0],
      mypending: mypendingresponse[0],
      approvepending: approvependingresponse[0],
    };
  }

  async systemVoucherList() {
    let query = `select * from pmsvoucherlistview where is_system_voucher = true and isonedit = false and status = 1 and startdate <= CURRENT_DATE and expirydate >= CURRENT_DATE order by createdat DESC`;

    const data = await this.DB.query(query);

    return data[0];
  }

  /**
     * 
      get single voucher details by voucher ID
     */
  async voucherDetails({ voucherid }) {
    let query = `SELECT
        pvlv.*,
        (
            SELECT json_agg(pvc.*)
            FROM pmsvouchercode pvc
            WHERE pvc.voucherid = pvlv.voucherid
        ) AS voucher_codes
    FROM
        pmsvoucherlistview pvlv where pvlv.voucherid ='${voucherid}'`;

    const response = await this.DB.query(query);

    return response[0][0];
  }

  async voucherTempDetails({ voucherid }) {
    let query = `select * from pmsvoucherpendinglistview where voucherid='${voucherid}'`;

    const response = await this.DB.query(query);

    return response[0][0];
  }

  /*
     insert into voucher temp table with action CREATE
     after checker check it will move voucher main table.

     every time insert into histroy table..

     status = 1 => active
     quota = any number amount => decrese after purchase and when 0 then no one can purchase.
     startdate, expirydate = any date => voucher valid date 
     minexpamount = any amount => customer total product purchase amount
     vouchervalidity = number of days => how many days this voucher will valid to use after purchase
     vouchertype = product/cash/discount => string, only this 3 type
     vouchervalue = product ==> how many items
                    cash ==> how many cash amount customer will get
                    discount ==> how many percentage discount will get on the transection
    productid = if vouchertype == product => select any product which will get customer if this voucher he/she use
                else keep it null
    rewardpoint = point amount => how many point need to purchase this voucher..
    price = purchase cash amount => if anyone purchase this voucher by cash. like gift voucher
    tier_id = id number => which segment customer will be able to buy this voucher.

    islocationwise= true ==> 

    select * from voucher_profile(_created_user_type => 1::smallint,_action => 'Insert', _merchantid => 1, _vouchertype => 'cash', _vouchervalue => 1, _productid => 1, _terms => '2', _vouchervalidity => 1, _minexpamount => 0, _expirydate => '2023-12-05', _startdate => '2023-12-05', _voucherimage => null, _rewardpoint => 14, _description => 'description', _quota => 5, _status => 1, _price => 11, _tier_id => 1, _islocationwise => false, _lat => 0.33, _long => 0.55, _town => null, _isglobal => true, _country => null, _distancecover => 12,  _createdby => 'meena');

    */
  async createVoucher(body) {
    const {
      title,
      customcode = false,
      customcode_url = null,
      merchantid,
      vouchertype,
      vouchervalue,
      productid = null,
      terms,
      vouchervalidity,
      minexpamount = 0,
      startdate,
      expirydate,
      voucherimage,
      rewardpoint = 0,
      description,
      quota,
      status,
      price = 0,
      tier_id = null,
      islocationwise = false,
      lat = 0,
      long = 0,
      town = [],
      country = null,
      distancecover = 0,
      isglobal,
      is_system_voucher = false,
      created_by,
      created_user_type,
      message = null,
    } = body;

    let query = `select * from voucher_profile(_title => :title, _customcode => :customcode, _customcode_url => :customcode_url, _created_user_type => :created_user_type::smallint,_action => 'Insert', _merchantid => :merchantid, _vouchertype => :vouchertype, _vouchervalue => :vouchervalue, _productid => :productid, _terms => :terms, _vouchervalidity => :vouchervalidity, _minexpamount => :minexpamount, _expirydate => :expirydate, _startdate => :startdate, _voucherimage => :voucherimage, _rewardpoint => :rewardpoint, _description => :description, _quota => :quota, _status => :status, _price => :price, _tier_id => :tier_id, _islocationwise => :islocationwise, _lat => :lat, _long => :long, _town => ARRAY [:town]::bigint[], _isglobal => :isglobal, _country => :country, _distancecover => :distancecover,  _createdby => :created_by, _is_system_voucher=> :is_system_voucher, _message=>:message)`;

    const response = await this.DB.query(query, {
      replacements: {
        title,
        customcode,
        customcode_url,
        merchantid,
        vouchertype,
        vouchervalue,
        productid,
        terms,
        vouchervalidity,
        minexpamount,
        startdate,
        expirydate,
        voucherimage,
        rewardpoint,
        description,
        quota,
        status,
        price,
        tier_id,
        islocationwise,
        lat,
        long,
        town,
        country,
        distancecover,
        isglobal,
        created_by,
        created_user_type,
        is_system_voucher,
        message,
      },
    });

    winstonLog.log('info', 'Voucher Create Response: %o', response[0][0], {
      label: 'voucher-create',
    });

    if (response[0][0]['code'] != 100) {
      throw new BadRequestException(response[0][0]['msg']);
    } else {
      if (customcode) {
        this.voucherCustomCodeProcess(response[0][0]['v_id']);
      }

      return response[0][0];
    }
  }

  /*
     insert into voucher temp table with action UPDATE
     after checker check it will move voucher main table.

     every time insert into histroy table..

     select * from voucher_profile(_voucher_id=>'PD0014',_created_user_type => 1::smallint,_action => 'Update', _merchantid => 11, _vouchertype => 'cash', _vouchervalue => 1, _productid => 1, _terms => '2', _vouchervalidity => 1, _minexpamount => 0, _expirydate => '2023-12-05', _startdate => '2023-12-05', _voucherimage => null, _rewardpoint => 14, _description => 'description', _quota => 5, _status => 1, _price => 11, _tier_id => 1, _islocationwise => false, _lat => 0.33, _long => 0.55, _town => null, _isglobal => true, _country => null, _distancecover => 12,  _createdby => 'meena');

    */
  async updateVoucher(body) {
    const {
      title,
      customcode = false,
      customcode_url = null,
      voucherid,
      merchantid,
      vouchertype,
      vouchervalue,
      productid = null,
      terms,
      vouchervalidity,
      minexpamount = 0,
      startdate,
      expirydate,
      voucherimage,
      rewardpoint = 0,
      description,
      quota,
      status,
      price = 0,
      tier_id = null,
      islocationwise = false,
      lat = 0,
      long = 0,
      town = [],
      country = null,
      distancecover = 0,
      isglobal,
      is_system_voucher = false,
      created_by,
      created_user_type,
      message = null,
    } = body;

    let query = `select * from voucher_profile(_title => :title, _customcode => :customcode, _customcode_url => :customcode_url,_voucher_id=>:voucherid,_created_user_type => :created_user_type::smallint,_action => 'Update', _merchantid => :merchantid, _vouchertype => :vouchertype, _vouchervalue => :vouchervalue, _productid => :productid, _terms => :terms, _vouchervalidity => :vouchervalidity, _minexpamount => :minexpamount, _expirydate => :expirydate, _startdate => :startdate, _voucherimage => :voucherimage, _rewardpoint => :rewardpoint, _description => :description, _quota => :quota, _status => :status, _price => :price, _tier_id => :tier_id, _islocationwise => :islocationwise, _lat => :lat, _long => :long, _town => ARRAY [:town]::bigint[], _isglobal => :isglobal, _country => :country, _distancecover => :distancecover,  _createdby => :created_by, _is_system_voucher=> :is_system_voucher, _message=>:message)`;

    const response = await this.DB.query(query, {
      replacements: {
        title,
        customcode,
        customcode_url,
        voucherid,
        merchantid,
        vouchertype,
        vouchervalue,
        productid,
        terms,
        vouchervalidity,
        minexpamount,
        startdate,
        expirydate,
        voucherimage,
        rewardpoint,
        description,
        quota,
        status,
        price,
        tier_id,
        islocationwise,
        lat,
        long,
        town,
        country,
        distancecover,
        isglobal,
        created_by,
        created_user_type,
        is_system_voucher,
        message,
      },
    });

    winstonLog.log('info', 'Voucher Update Response: %o', response[0][0], {
      label: 'voucher-update',
    });

    if (response[0][0]['code'] != 100) {
      throw new BadRequestException(response[0][0]['msg']);
    } else {
      if (customcode) {
        this.voucherCustomCodeProcess(voucherid);
      }

      return response[0][0];
    }
  }

  /*
     insert into voucher temp table with action DELETE
     after checker check it will move voucher main table.

     every time insert into histroy table..

     select * from voucher_profile(_action => 'Delete',  _voucher_id=>'PD0014', _createdby=>'meena',_created_user_type => 1::smallint);

    */
  async deleteVoucher(body) {
    const { voucherid, created_by, created_user_type } = body;

    let query = `select * from voucher_profile(_voucher_id=> :voucherid ,_created_user_type => :created_user_type::smallint,_action => 'Delete',  _createdby => :created_by)`;

    const response = await this.DB.query(query, {
      replacements: {
        voucherid,
        created_by,
        created_user_type,
      },
    });

    winstonLog.log('info', 'Voucher Delete Response: %o', response[0][0], {
      label: 'voucher-delete',
    });

    if (response[0][0]['code'] != 100) {
      throw new BadRequestException(response[0][0]['msg']);
    } else {
      return response[0][0];
    }
  }

  /*
     after checker check it will move voucher main table.
     move if approve => if action is DELETE then delete from main table
     if reject then only delete from temp table

     every time insert into histroy table..

     select * from voucher_profile(_action => 'Approve',  _voucher_id=>'PD0014', _approvedby=>'pmsadmin');

     select * from voucher_profile(_action => 'Reject',  _voucher_id=>'PD0014', _approvedby=>'pmsadmin');

     action = Approve/Reject
    */
  async voucherAction(body) {
    const { voucherid, created_by, created_user_type, action } = body;

    let query = `select * from voucher_profile(_voucher_id=> :voucherid ,_created_user_type => :created_user_type::smallint,_action => :action,  _approvedby => :created_by)`;

    const response = await this.DB.query(query, {
      replacements: {
        voucherid,
        created_by,
        created_user_type,
        action,
      },
    });

    winstonLog.log('info', 'Voucher Action Response: %o', response[0][0], {
      label: 'voucher-action',
    });

    if (response[0][0]['code'] != 100) {
      throw new BadRequestException(response[0][0]['msg']);
    } else {
      return response[0][0];
    }
  }

  async unusedVoucherCodesRelease(voucherid) {
    if (!voucherid) {
      throw new BadRequestException('No Voucher ID Provided');
    }

    let query = `DELETE FROM pmsvouchercode WHERE voucherid = :voucherid AND isused = false;`;

    const [rows, _] = await this.DB.query(query, {
      replacements: {
        voucherid,
      },
    });

    winstonLog.log('info', 'Voucher Unused Codes Release Response: %o', rows, {
      label: 'voucher-code-release',
    });

    // Check if unused voucher codes found
    if (!rows || rows.length === 0) {
      throw new BadRequestException('No Unused Voucher Codes Found');
    } else {
      return rows;
    }
  }

  async unusedVoucherCodesReuse(voucherid: string) {
    if (!voucherid) {
      throw new BadRequestException('No Voucher ID Provided');
    }

    const query = `
      SELECT voucher_code 
      FROM pmsvouchercode 
      WHERE voucherid = :voucherid 
        AND isused = true;`;

    const [rows, _] = await this.DB.query(query, {
      replacements: { voucherid },
    });

    // Check if unused voucher codes found
    if (!rows || rows.length === 0) {
      throw new BadRequestException('No Unused Voucher Codes Found');
    }

    // Send data to generate CSV
    try {
      const response = await axios.post(
        process.env.VOUCHER_UNUSED_CUSTOMCODE_CSV_GENERATE_URL,
        { voucherid, voucher_codes: rows },
        {
          headers: {
            module:
              process.env.VOUCHER_UNUSED_CUSTOMCODE_CSV_GENERATE_MODULE_KEY,
            'Content-type': 'application/json',
          },
        },
      );

      winstonLog.log(
        'info',
        'Voucher Unused Codes Reuse API Response: %o',
        response.data,
        { label: 'voucher-code-reuse-api' },
      );

      return {
        csv_file: response.data.payload,
      };
    } catch (error) {
      winstonLog.log(
        'error',
        'Voucher Unused Codes Reuse API Error: %o',
        error.response || error,
        { label: 'voucher-code-reuse-api' },
      );

      throw new Error('Failed to generate CSV file');
    }
  }

  async voucherReport() {
    let query = `select * from pmsvoucherlistview order by createdat DESC`;

    winstonLog.log(
      'info',
      'Voucher List Request: %s',
      { query },
      { label: 'voucher-list' },
    );

    const response = await this.DB.query(query);

    return response[0];
  }

  async voucherPurchaseReport(voucherid) {
    let query = `select vp.*, cp.mobile from pmsvoucherpurchase vp left join oms_customer_profile cp on cp.id = vp.customerid
        where voucherid = :voucherid order by reedemat DESC`;

    const response = await this.DB.query(query, {
      replacements: { voucherid },
      logging: true,
    });

    return response[0];
  }
}
