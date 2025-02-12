import { ValidateIf, IsNumberString, IsOptional, IsLatitude, IsLongitude, IsString, IsNotEmpty, IsBoolean, IsNumber, IsDateString, IsEnum, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer'
import {IntersectionType } from  '@nestjs/mapped-types';

enum Vouchertypekeyword {
    cash = 'cash',
    product = 'product',
    discount = 'discount',
}

enum Action {
    Approve = 'Approve',
    Reject = 'Reject'
}


export class VoucherDto {

    @IsOptional()
    @IsNumberString()
    readonly page: number;

    @IsOptional()
    @IsNumberString()
    readonly limit: number;

    @IsOptional()
    @IsNumberString()
    readonly merchantid: number;

    @IsLatitude()
    readonly lat: number;

    @IsLongitude()
    readonly long: number;

}

export class VoucherDetailsDto {

    @IsString()
    @IsNotEmpty()
    readonly voucherid: string;
}


export class VoucherPurchaseDto {


    @IsString()
    @IsNotEmpty()
    readonly voucherid: string;

    @IsBoolean()
    readonly purchase_by_cash: boolean

    @ValidateIf(o => o.purchase_by_cash === true)
    @IsNotEmpty()
    readonly transectionid: string

    @ValidateIf(o => o.purchase_by_cash === true)
    @IsNotEmpty()
    readonly accountid: string

    @ValidateIf(o => o.purchase_by_cash === true)
    @IsNotEmpty()
    readonly transection_datetime: string

    @ValidateIf(o => o.purchase_by_cash === true)
    @IsNotEmpty()
    @IsNumber() 
    readonly amount: number

}

export class VoucherPurchaseListDto {

    @IsOptional()
    @IsNumberString()
    readonly page: number;

    @IsOptional()
    @IsNumberString()
    readonly limit: number;

    @IsOptional()
    @IsNumberString()
    readonly merchantid: number;

}

export class VoucherReportLimitDto {

    @IsOptional()
    readonly page: number=1;

    @IsOptional()
    readonly limit: number=100;
}

export class VoucherPurchaseDetailsDto {

    @IsString()
    @IsNotEmpty()
    readonly voucher_code: string;
}

export class VoucherShareDto {

    @IsString()
    @IsNotEmpty()
    readonly voucher_code: string;

    @IsNotEmpty()
    readonly to_mobile_no: string;
}

export class VoucherCreateDto {

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNumber()
    @IsNotEmpty()
    readonly merchantid: bigint;

    @IsNotEmpty()
    @IsString()
    @IsEnum(Vouchertypekeyword, {
        message: 'vouchertype must be either cash or discount or product',
    })
    readonly vouchertype: string;

    @IsNotEmpty()
    @IsNumber()
    readonly vouchervalue: Number;

    @ValidateIf(o => o.vouchertype === 'product')
    @IsNumber()
    @IsNotEmpty()
    readonly productid: bigint = null;

    @IsNotEmpty()
    @IsString()
    readonly terms: string;

    @IsNotEmpty()
    @IsNumber()
    readonly vouchervalidity: Number;

    @IsNotEmpty()
    @IsDateString()
    readonly startdate: string;

    @IsNotEmpty()
    @IsDateString()
    readonly expirydate: string;

    @IsNotEmpty()
    @IsString()
    readonly voucherimage: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsNumber()
    readonly quota: Number;

    @IsNotEmpty()
    @IsNumber()
    readonly status: Number;

    @ValidateIf((object, value) => value !== null)
    @IsNumber()
    readonly tier_id!: Number | null;

    @IsNotEmpty()
    @IsBoolean()
    readonly is_system_voucher: Boolean ;

    @ValidateIf(o => o.is_system_voucher === false)
    @IsNotEmpty()
    @IsNumber()
    readonly minexpamount: Number 
    
    @ValidateIf(o => o.is_system_voucher === false)
    @IsNotEmpty()
    @IsNumber()
    readonly rewardpoint: Number 

    @ValidateIf(o => o.is_system_voucher === false)
    @IsNotEmpty()
    @IsNumber()
    readonly price: Number 

    /*
    
        if _isglobal = true then
        _country := null;
        _town := null;
        end if;
    --
        if _islocationwise = false then
            _lat := null;
            _long := null;
        end if;
    
    */

    @ValidateIf(o => o.is_system_voucher === false)
    @IsNotEmpty()
    @IsBoolean()
    readonly islocationwise: Boolean = false;

    @ValidateIf(o => (o.is_system_voucher === false && o.islocationwise === true))
    @IsNotEmpty()
    @IsNumber()
    readonly lat: Number 

    @ValidateIf(o => (o.is_system_voucher === false && o.islocationwise === true))
    @IsNotEmpty()
    @IsNumber()
    readonly long: Number 

    @ValidateIf(o => (o.is_system_voucher === false && o.islocationwise === true))
    @IsNotEmpty()
    @IsNumber()
    readonly distancecover: Number

    @ValidateIf(o => o.is_system_voucher === false)
    @IsNotEmpty()
    @IsBoolean()
    readonly isglobal: Boolean = true;

    @ValidateIf(o => (o.is_system_voucher === false && o.isglobal === false && o.islocationwise === false))
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    readonly town: Number[] = [];

    @ValidateIf(o => (o.is_system_voucher === false && o.isglobal === false && o.islocationwise === false))
    @IsNotEmpty()
    @IsNumber()
    readonly country: Number 

    @IsNotEmpty()
    @IsBoolean()
    readonly customcode: Boolean = true;

    @ValidateIf(o => o.customcode === true)
    @IsNotEmpty()
    @IsString()
    readonly customcode_url: string;

    @IsOptional()
    @IsString()
    readonly message: string;

}

export class VoucherUpdateDto extends IntersectionType(VoucherDetailsDto,VoucherCreateDto) { }

export class VActionDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(Action, {
        message: 'action must be either Approve or Reject',
    })
    readonly action: string;
}

export class VoucherActionDto extends IntersectionType(VoucherDetailsDto, VActionDto) {

}

export class VoucherSearch {

    @IsOptional()
    @IsDateString()
    readonly startDate: Date;

    @IsOptional()
    @IsDateString()
    readonly endDate: Date;
}

export class SingleVoucherReportDto extends IntersectionType(VoucherSearch, VoucherDetailsDto,VoucherReportLimitDto ) {

}

export class VoucherReportDto extends IntersectionType(VoucherSearch, VoucherReportLimitDto ) {

}