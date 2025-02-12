import { Controller, UseGuards, Request, Get, Query, Post, Body } from '@nestjs/common';
import {JwtAuthGuard} from '../../middleware/guards/JwtAuthGuard'
import { PointRuleService } from './point-rule.service'
import { getUserType } from '../../helpers/utils'
import { RuleDetailsDto, RuleDto, RuleUpdateDto } from '../../dto'

@UseGuards(JwtAuthGuard)
@Controller('point-rule')
export class PointRuleController {
    constructor(
        private readonly pointRuleService: PointRuleService,
    ) {}

    /*
      is_sku_rule = true then rule_type = 1
      is_global_rule = true then rule_type = 2
      is_service_rule = true then rule_type = 3

    */
    @Get('v1/list')
    async pointRuleList(@Request() req, @Query() query) {

        const { created_user_type, created_by} = getUserType(req.user)
        const merchantid = +(query['merchantid'] || 0)
        const rule_type = +(query['rule_type'] || 1)

        return this.pointRuleService.ruleList({rule_type,merchantid, created_by, created_user_type})

    }

    @Get('v1/details')
    async ruleDetails(@Request() req, @Query() query: RuleDetailsDto) {
        const rule_id = query['rule_id']
        return await this.pointRuleService.ruleDetails({rule_id})

    }

    @Get('v1/tempdetails')
    async tempruleDetails(@Request() req, @Query() query: RuleDetailsDto) {
        const rule_id = query['rule_id']
        return await this.pointRuleService.tempruleDetails({rule_id})

    }

    /*
    
      select * from pointrulesetup(_rule_id=> null, _action => 'Insert', _created_user_type => 1::smallint, _createdby => 'meena1',
        _rule_name => 'test', _is_sku_rule=> false, _is_service_rule=> false,
        _is_global_rule => true, _is_range => false, _is_active=> false,
        _start_date => now():: timestamp, _end_date => now()::timestamp, _point_expiry_interval_days => 5,
        _tire_id=> 1, _bussiness_id=> null,
        _items => array[row(null,'55',0,0,'sender', 15, 400),row(null,'55',0,0,'both', 15, 400)] ::pmspointruleitem_type[]
        );

        rule_name, is_sku_rule, is_global_rule, is_service_rule, is_range,is_active, start_date, end_date, point_expiry_interval_days, tire_id, bussiness_id
    */
    @Post('v1/create')
    async create(@Request() req, @Body() body: RuleDto) {

      const { created_user_type, created_by} = getUserType(req.user)

      return await this.pointRuleService.createRule({...body, created_by, created_user_type})

    }

    /*
    
      rule_id = main table id
    */
       /*
    
        select * from pointrulesetup(_rule_id=> 8, _action => 'Update', _created_user_type => 1::smallint, _createdby => 'meena1',
        _rule_name => 'test2', _is_sku_rule=> false, _is_service_rule=> false,
        _is_global_rule => true, _is_range => false, _is_active=> false,
        _start_date => now():: timestamp, _end_date => now()::timestamp, _point_expiry_interval_days => 5,
        _tire_id=> 1, _bussiness_id=> null,
        _items => array[row(null,'55',0,0,'sender', 15, 400),row(null,'55',0,0,'both', 50, 400)] ::pmspointruleitem_type[]
        );
    */
    @Post('v1/update')
    async update(@Request() req, @Body() body: RuleUpdateDto) {

      const { created_user_type, created_by} = getUserType(req.user)

      return await this.pointRuleService.updateRule({...body, created_by, created_user_type})

    }


    /*
    
      rule_id = main table id
    */

    @Post('v1/delete')
    async deleteRule(@Request() req, @Body() body: RuleDetailsDto) {
        const { created_user_type, created_by} = getUserType(req.user)
        const rule_id = body['rule_id']
        return await this.pointRuleService.deleteRule({rule_id, created_by, created_user_type}) 

    }

    /*
    
      rule_id = main table id
    */

      @Post('v1/action')
      async ruleAction(@Request() req, @Body() body: RuleDetailsDto) {
          const { created_user_type, created_by} = getUserType(req.user)
          const rule_id = body['rule_id']
          const action_type = body['action_type']
          return await this.pointRuleService.ruleAction({rule_id, action_type, created_by, created_user_type})
  
      }

}
