import { Controller, UseGuards, Request, Get, Query, Post, Body } from '@nestjs/common';
import {JwtAuthGuard} from '../../middleware/guards/JwtAuthGuard'
import { VoucherBulkPurchaseService } from './voucher-bulk-purchase.service'
import { getUserType } from '../../helpers/utils'

@UseGuards(JwtAuthGuard)
@Controller('voucher-bulk-purchase')
export class VoucherBulkPurchaseController {
    constructor(
        private readonly voucherBulkPurchaseService: VoucherBulkPurchaseService,
    ) {}

    @Get('v1/list')
    async voucherBulkPurchaseList(@Request() req ) {

        const { created_user_type, created_by} = getUserType(req.user)

        return await this.voucherBulkPurchaseService.voucherBulkPurchaseList({created_by, created_user_type})

    }

    @Post('v1/request')
    async voucherBulkPurchaseRequest(@Request() req, @Body() body ) {

        const { created_user_type, created_by} = getUserType(req.user)

        return await this.voucherBulkPurchaseService.voucherBulkPurchaseRequest({created_by, created_user_type, ...body})

    }

    @Post('v1/action')
    async voucherBulkPurchaseRequestAction(@Request() req, @Body() body ) {

        const { created_user_type, created_by} = getUserType(req.user)
        
        return await this.voucherBulkPurchaseService.voucherBulkPurchaseRequestAction({created_by, created_user_type, ...body})
    }
}
