import { Controller, UseGuards, Request, Get, Query, Post, Body } from '@nestjs/common';
import {JwtAuthGuard} from '../../middleware/guards/JwtAuthGuard'
import { PointConvertService } from './point-convert.service'
import { PointConvertRuleActionDto, PointConvertRuleUpdateDto } from '../../dto'
import { getUserType } from '../../helpers/utils'

@Controller('point-convert')
export class PointConvertController {

    constructor(
        private readonly pointConvertService: PointConvertService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('v1/details')
    async dettails() {

        return await this.pointConvertService.details()

    }


    @UseGuards(JwtAuthGuard)
    @Post('v1/update')
    async update(@Request() req, @Body() body: PointConvertRuleUpdateDto) {

        const { created_user_type, created_by} = getUserType(req.user)

        return await this.pointConvertService.updateRule({...body, created_by})

    }

    @UseGuards(JwtAuthGuard)
    @Post('v1/action')
    async ruleAction(@Request() req, @Body() body: PointConvertRuleActionDto) {

        const { created_user_type, created_by} = getUserType(req.user)

        return await this.pointConvertService.action({...body, created_by})

    }

}
