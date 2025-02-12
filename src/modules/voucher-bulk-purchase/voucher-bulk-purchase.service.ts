import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/constants'
import { Sequelize } from 'sequelize-typescript';
import { winstonLog } from '../../config/winstonLog'

@Injectable()
export class VoucherBulkPurchaseService {
    constructor(
        @Inject(DATABASE_CONNECTION) private DB: Sequelize
    ) { }

    async voucherBulkPurchaseList({created_by, created_user_type}) {

        let query = `select * from pmsvoucherbulkpurchaselistview order by created_at DESC`
        let mypendingquery = `select * from pmsvoucherbulkpurchasetemplistview where created_by = '${created_by}' order by created_at DESC`
        let approvependingquery = `select * from pmsvoucherbulkpurchasetemplistview where created_by != '${created_by}' order by created_at DESC`

        winstonLog.log('info', 'Voucher bulk purchase List Request: %s', {query}, { label: 'voucher-bulk-purchase-list' })

        const [response, mypendingresponse, approvependingresponse] = await Promise.all([ this.DB.query(query), this.DB.query(mypendingquery), this.DB.query(approvependingquery)])

        return {list: response[0], mypending: mypendingresponse[0], approvepending:approvependingresponse[0]}
    }

    //select * from voucher_bulkpurchase(_created_user_type => 1::smallint, _createdby => 'meena', _action => 'Insert', _voucher_id => 'PD00204', _group_id => 1, _title => 'Test-title', _description => 'test-des' )

    async voucherBulkPurchaseRequest(body) {

        const {created_by, created_user_type, voucherid, group_id, title, description} = body

        let query = `select * from voucher_bulkpurchase(_created_user_type => :created_user_type::smallint, _createdby => :created_by, _action => 'Insert', _voucher_id => :voucherid, _group_id => :group_id, _title => :title, _description => :description )`

        const response = await this.DB.query(query, {
            replacements: {
                created_by, created_user_type, voucherid, group_id, title, description
            }
        })

        winstonLog.log('info', 'Voucher bulk-purchase Response: %o', response[0][0], { label: 'voucher-bulk-purchase' })

        if (response[0][0]['code'] != 100) {

            throw new BadRequestException(response[0][0]['msg'])
        }
        else {

            return response[0][0]
        }
    }

    async voucherBulkPurchaseRequestAction(body) {

        const {created_by, created_user_type, voucherid, action} = body

        let query = `select * from voucher_bulkpurchase(_created_user_type => :created_user_type::smallint, _action => :action, _voucher_id => :voucherid, _approvedby => :created_by )`

        const response = await this.DB.query(query, {
            replacements: {
                created_by, created_user_type, voucherid, action
            }
        })

        winstonLog.log('info', 'Voucher bulk-purchase-Action Response: %o', response[0][0], { label: 'voucher-bulk-purchase-action' })

        if (response[0][0]['code'] != 100) {

            throw new BadRequestException(response[0][0]['msg'])
        }
        else {

            return response[0][0]
        }
    }
}
