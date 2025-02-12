import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { winstonLog } from '../../config/winstonLog'
import { PointRuleViewModel, PointRuleMapListViewModel, PointRuleTempViewModel, PointRuleMapTempListViewModel } from '../../models'
import { PMSPOINTRULEVIEW_REPOSITORY, PMSPOINTRULEMAPVIEW_REPOSITORY, PMSPOINTRULETEMPVIEW_REPOSITORY, PMSPOINTRULEMAPTEMPVIEW_REPOSITORY, DATABASE_CONNECTION } from '../../config/constants'
import { Op, fn as DBFN, literal as DBLiteral } from 'sequelize'

@Injectable()
export class PointRuleService {
    constructor(
        @Inject(DATABASE_CONNECTION) private DB: Sequelize,
        @Inject(PMSPOINTRULEVIEW_REPOSITORY) private readonly PointRuleViewRepo: typeof PointRuleViewModel,
        @Inject(PMSPOINTRULEMAPVIEW_REPOSITORY) private readonly PointRuleMapViewRepo: typeof PointRuleMapListViewModel,
        @Inject(PMSPOINTRULETEMPVIEW_REPOSITORY) private readonly PointRuleTempViewRepo: typeof PointRuleTempViewModel,
        @Inject(PMSPOINTRULEMAPTEMPVIEW_REPOSITORY) private readonly PointRuleMapTempViewRepo: typeof PointRuleMapTempListViewModel,
    ) { }

    async ruleList({rule_type,merchantid, created_by, created_user_type}) {

        let common_conditions = {}
        switch(rule_type) {
            case 1 :
                common_conditions = { is_sku_rule : true}
                break
            case 2 :
                common_conditions = { is_global_rule : true}
                break
            default :
                common_conditions = { is_service_rule : true}
        }

        if(merchantid) {
            common_conditions['bussiness_id'] = merchantid
        }

         const [response, mypendingresponse, approvependingresponse] = await Promise.all([
            this.PointRuleViewRepo.findAll({
                where: common_conditions,
                include: [
                    {
                        model: PointRuleMapListViewModel
                    }
                ],
                 order: [['id','DESC']]
            }),
            this.PointRuleTempViewRepo.findAll({

                where: { created_by, created_user_type, ...common_conditions}, 
                include: [
                    {
                        model: PointRuleMapTempListViewModel
                    }
                ],
                order: [['id','DESC']]
            }),
            this.PointRuleTempViewRepo.findAll({

                where: { created_by:{[Op.ne]: created_by}, created_user_type, ...common_conditions}, 
                include: [
                    {
                        model: PointRuleMapTempListViewModel
                    }
                ],
                order: [['id','DESC']]
            })
         ])

        return {list: response, mypending: mypendingresponse, approvepending:approvependingresponse}
    }

    async ruleDetails({rule_id}) {

        return  this.PointRuleViewRepo.findOne({
            where: { id: rule_id },
            include: [
                {
                    model: PointRuleMapListViewModel
                }
            ]
        })
    }

    async tempruleDetails({rule_id}) {

        return  this.PointRuleTempViewRepo.findOne({
            where: { id: rule_id },
            include: [
                {
                    model: PointRuleMapTempListViewModel
                }
            ]
        })
    }

    /*
    pmspointruleitem_type as
        (
            _product_id            bigint,
            _service_id            varchar(255),
            _start_range           double precision,
            _end_range             double precision,
            _point_receiver_type   varchar(10),
            _sender_reward_point   integer,
            _receiver_reward_point integer
        );


        select * from pointrulesetup(_rule_id=> null, _action => 'Insert', _created_user_type => 1::smallint, _createdby => 'meena1',
        _rule_name => 'test', _is_sku_rule=> false, _is_service_rule=> false,
        _is_global_rule => true, _is_range => false, _is_active=> false,
        _start_date => now():: timestamp, _end_date => now()::timestamp, _point_expiry_interval_days => 5,
        _tire_id=> 1, _bussiness_id=> null,
        _items => array[row(null,'55',0,0,'sender', 15, 400),row(null,'55',0,0,'both', 15, 400)] ::pmspointruleitem_type[]
        );
    */
    async createRule(body) {

        const { created_by, created_user_type, rule_name, is_sku_rule,  is_global_rule, is_service_rule, is_range, is_active, start_date, end_date, point_expiry_interval_days,
            tire_id=null, bussiness_id=null,  items } = body

        const modifiedItems = items.map(item => {

            return [item.product_id,item.service_id,item.start_range,item.end_range,item.point_receiver_type, item.sender_reward_point, item.receiver_reward_point]
        })

        let query = `select * from pointrulesetup(_rule_id=> null, _action => 'Insert', _created_user_type => :created_user_type::smallint, _createdby => :created_by,_rule_name => :rule_name, _is_sku_rule=> :is_sku_rule, _is_service_rule=> :is_service_rule,_is_global_rule => :is_global_rule, _is_range => :is_range, _is_active=> :is_active,_start_date => :start_date:: timestamp, _end_date => :end_date::timestamp, _point_expiry_interval_days => :point_expiry_interval_days,_tire_id=> :tire_id, _bussiness_id=> :bussiness_id,_items => array[:modifiedItems] ::pmspointruleitem_type[] )`

        const response = await this.DB.query(query, {
            replacements: {
                created_by, created_user_type, rule_name, is_sku_rule,  is_global_rule, is_service_rule, is_range, is_active, start_date, end_date, point_expiry_interval_days,
               tire_id, bussiness_id,  modifiedItems
            }
        })

        winstonLog.log('info', 'Rule Create Response: %o', response[0][0], { label: 'rule-create' })

        if (response[0][0]['code'] != 100) {

            throw new BadRequestException(response[0][0]['msg'])
        }
        else {

            return response[0][0]
        }
    }

    /*
    
        select * from pointrulesetup(_rule_id=> 8, _action => 'Update', _created_user_type => 1::smallint, _createdby => 'meena1',
        _rule_name => 'test2', _is_sku_rule=> false, _is_service_rule=> false,
        _is_global_rule => true, _is_range => false, _is_active=> false,
        _start_date => now():: timestamp, _end_date => now()::timestamp, _point_expiry_interval_days => 5,
        _tire_id=> 1, _bussiness_id=> null,
        _items => array[row(null,'55',0,0,'sender', 15, 400),row(null,'55',0,0,'both', 50, 400)] ::pmspointruleitem_type[]
        );
    */
    async updateRule(body) {

        const { rule_id, created_by, created_user_type, rule_name, is_sku_rule,  is_global_rule, is_service_rule, is_range, is_active, start_date, end_date, point_expiry_interval_days,
            tire_id=null, bussiness_id=null,  items } = body

        const modifiedItems = items.map(item => {

            return [item.product_id,item.service_id,item.start_range,item.end_range,item.point_receiver_type, item.sender_reward_point, item.receiver_reward_point]
        })

        let query = `select * from pointrulesetup(_rule_id=> :rule_id, _action => 'Update', _created_user_type => :created_user_type::smallint, _createdby => :created_by,_rule_name => :rule_name, _is_sku_rule=> :is_sku_rule, _is_service_rule=> :is_service_rule,_is_global_rule => :is_global_rule, _is_range => :is_range, _is_active=> :is_active,_start_date => :start_date:: timestamp, _end_date => :end_date::timestamp, _point_expiry_interval_days => :point_expiry_interval_days,_tire_id=> :tire_id, _bussiness_id=> :bussiness_id,_items => array[:modifiedItems] ::pmspointruleitem_type[] )`

        const response = await this.DB.query(query, {
            replacements: {
                rule_id, created_by, created_user_type, rule_name, is_sku_rule,  is_global_rule, is_service_rule, is_range, is_active, start_date, end_date, point_expiry_interval_days,
               tire_id, bussiness_id,  modifiedItems
            }
        })

        winstonLog.log('info', 'Rule Update Response: %o', response[0][0], { label: 'rule-update' })

        if (response[0][0]['code'] != 100) {

            throw new BadRequestException(response[0][0]['msg'])
        }
        else {

            return response[0][0]
        }
    }

    /*
    
    select * from pointrulesetup(_rule_id=> 9, _action => 'Delete', _created_user_type => 1::smallint, _createdby => 'meena1', _rule_name => null);

    */
    async deleteRule({rule_id, created_by, created_user_type}) {

        let query = `select * from pointrulesetup(_rule_id=> ${rule_id}, _action => 'Delete', _created_user_type => ${created_user_type}::smallint, _createdby => '${created_by}', _rule_name => null)`

        const response = await this.DB.query(query)

        const data = response[0][0]

        if(data['code'] == 100) {

            return {code: data['code'], res_message: data['msg']}
        }
        else {
         
            throw new BadRequestException(data['msg'])
        }
 
    }

    /*
    
        -- _rule_id = temp table id

        select * from pointrulesetup(_rule_id=> 45, _action => 'Approve', _created_user_type => 1::smallint, _approvedby=> 'meena2', _createdby => null, _rule_name => null);

        select * from pointrulesetup(_rule_id=> 45, _action => 'Reject', _created_user_type => 1::smallint, _approvedby=> 'meena2', _createdby => null, _rule_name => null);

    */
    async ruleAction({rule_id, action_type, created_by, created_user_type}) {
        
        let _action = 'Reject'

        if(action_type == 1){
            
            _action = 'Approve'
        }

        let query = `select * from pointrulesetup(_rule_id=> ${rule_id}, _action => '${_action}', _created_user_type => ${created_user_type}::smallint, _approvedby=> '${created_by}', _createdby => null, _rule_name => null)`

        const response = await this.DB.query(query)

        const data = response[0][0]

        if(data['code'] == 100) {

            return {code: data['code'], res_message: data['msg']}
        }
        else {
         
            throw new BadRequestException(data['msg'])
        }
    }
}
