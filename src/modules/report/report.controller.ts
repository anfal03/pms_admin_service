import { Controller, UseGuards, Request, Get, Query, Post, Body } from '@nestjs/common';
import {JwtAuthGuard} from '../../middleware/guards/JwtAuthGuard'
import { ReportService } from './report.service'
import { SingleVoucherReportDto, VoucherReportDto } from '../../dto'
import { getUserType } from '../../helpers/utils'

@Controller('report')
export class ReportController {

    constructor(
        private readonly reportService: ReportService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('v1/voucher/single')
    async singleVoucherReport(@Request() req, @Body() body: SingleVoucherReportDto) {

        return await this.reportService.singleVoucherReport(body)

    }

    @UseGuards(JwtAuthGuard)
    @Post('v1/voucher')
    async allVoucherReport(@Request() req, @Body() body: VoucherReportDto) {

        return await this.reportService.allVoucherReport(body)

    }

    @UseGuards(JwtAuthGuard)
    @Post('v1/point/earn')
    async pointEarnReport(@Request() req, @Body() body: VoucherReportDto) {

        return await this.reportService.pointEarnReport(body)

    }

    @UseGuards(JwtAuthGuard)
    @Post('v1/point/expence')
    async pointExpenceReport(@Request() req, @Body() body: VoucherReportDto) {

        return await this.reportService.pointExpenceReport(body)

    }
}
