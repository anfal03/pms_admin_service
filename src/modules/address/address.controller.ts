import { Controller, UseGuards, Request, Get, Query, Post, Body } from '@nestjs/common';
import {JwtAuthGuard} from '../../middleware/guards/JwtAuthGuard'
import { AddressService } from './address.service'

@Controller('address')
export class AddressController {
    constructor(
        private readonly addressService: AddressService,
    ) {}

    @Get('country/list')
    async countryList(@Request() req, @Query() query) {

        return this.addressService.countryList()

    }

    @Post('city/list')
    async cityList(@Request() req, @Body() body) {

        return this.addressService.cityList(body['country_id'])

    }
}
