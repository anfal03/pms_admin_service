import { IsEnum, ValidateIf, IsNumberString, IsOptional,ArrayMinSize, IsLatitude, IsLongitude, IsString, IsNotEmpty, IsBoolean, IsNumber, IsDateString, IsIn, Min, IsArray,ValidateNested } from 'class-validator';
import { Type } from 'class-transformer'
import {IntersectionType } from  '@nestjs/mapped-types';

export class RuleDetailsDto {

    @IsNotEmpty()
    readonly rule_id: bigint;

    @IsOptional()
    @IsIn([1,2])
    readonly action_type: number;

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
*/
export class RuleItem {

    //depend on is_sku_rule = true
    @IsOptional()
    @IsNumber()
    readonly product_id: bigint = null;

    //depend on is_service_rule = true
    @IsOptional()
    @IsString()
    readonly service_id: string = null;

    @IsNotEmpty()
    readonly start_range: number;

    //depend on is_range = true
    @IsOptional()
    readonly end_range : number = null;

    @IsString()
    @IsIn(['sender','receiver','both'])
    readonly point_receiver_type: string;

    //depend on point_receiver_type = sender or both
    @ValidateIf(o => o.point_receiver_type === 'sender' || o.point_receiver_type === 'both' )
    @IsNotEmpty()
    readonly sender_reward_point: number = 0;

    //depend on point_receiver_type = receiver or both
    @ValidateIf(o => o.point_receiver_type === 'receiver' || o.point_receiver_type === 'both' )
    @IsNotEmpty()
    readonly receiver_reward_point: number = 0;
}

//rule_name, is_sku_rule, is_global_rule, is_service_rule, is_range,is_active, start_date, end_date, point_expiry_interval_days, tire_id, bussiness_id

export class RuleDto {

    @IsNotEmpty()
    @IsString()
    readonly rule_name: string;

    @IsBoolean()
    @IsNotEmpty()
    readonly is_sku_rule: boolean;

    @IsBoolean()
    @IsNotEmpty()
    readonly is_global_rule: boolean;

    @IsBoolean()
    @IsNotEmpty()
    readonly is_service_rule: boolean;

    @IsBoolean()
    @IsNotEmpty()
    readonly is_range: boolean;

    @IsBoolean()
    @IsNotEmpty()
    readonly is_active: boolean;

    @IsNotEmpty()
    @IsDateString()
    readonly start_date: string;

    @IsNotEmpty()
    @IsDateString()
    readonly end_date: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    readonly point_expiry_interval_days: number;

    @ValidateIf(o => o.tire_id != null )
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    readonly tire_id: number;

    //depend on is_sku_rule=true or is_global_rule=true
    @ValidateIf(o => o.is_sku_rule === true || o.is_global_rule === true )
    @IsNotEmpty()
    @IsNumber()
    readonly bussiness_id: bigint;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => RuleItem)
    items: RuleItem[];
}

export class RuleUpdateDto extends IntersectionType(RuleDetailsDto, RuleDto) {

}
//point, cash_amount, minimum_required_point
export class PointConvertRuleUpdateDto {

    @IsNotEmpty()
    readonly point: number;

    @IsNotEmpty()
    readonly cash_amount: number;

    @IsNotEmpty()
    readonly minimum_required_point: number;

}

export class PointConvertRuleActionDto {

    @IsIn([1,2])
    readonly action_type: number;

}