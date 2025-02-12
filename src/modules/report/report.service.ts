import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {  DATABASE_CONNECTION } from '../../config/constants'
import { Sequelize } from 'sequelize-typescript';
import { winstonLog } from '../../config/winstonLog'


@Injectable()
export class ReportService {

    constructor(
        @Inject(DATABASE_CONNECTION) private DB: Sequelize,
    ) { }

    /*
        1. voucher purchase report by voucher id with offset limit
        2. all voucher purchase report with offset limit and startdate end date
        3. loylty report => earn and expense with offset limit and startdate end date

        startDate = '2023-04-24'
        endDate = '2023-04-24'
    */

        async singleVoucherReport({voucherid, page, limit, startDate, endDate}) {

            const offset = limit * (page - 1);

            let query = `select * from pmsvoucherpurchase where voucherid = :voucherid order by reedemat DESC offset :offset limit :limit`

            if (startDate && endDate) {
                startDate = `${startDate} 00:00:00`
                endDate = `${endDate} 23:59:59`
                query = `select * from pmsvoucherpurchase where voucherid = :voucherid and reedemat >= :startDate and reedemat <= :endDate order by reedemat DESC offset :offset limit :limit`
            }

            const response = await this.DB.query(query, { replacements: { voucherid, offset, limit, startDate, endDate }})

            return response[0]

        }

        async allVoucherReport({page, limit, startDate, endDate}) {

            const offset = limit * (page - 1);

            let query = `select * from pmsvoucherpurchase order by reedemat DESC offset :offset limit :limit`

            if (startDate && endDate) {
                startDate = `${startDate} 00:00:00`
                endDate = `${endDate} 23:59:59`
                query = `select * from pmsvoucherpurchase where  reedemat >= :startDate and reedemat <= :endDate order by reedemat DESC offset :offset limit :limit`
            }

            const response = await this.DB.query(query, { replacements: {offset, limit, startDate, endDate }})

            return response[0]

        }

        async pointEarnReport({page, limit, startDate, endDate}) {
            const offset = limit * (page - 1);

            let query = `select * from pmspointearnhistoryview offset :offset limit :limit`

            if (startDate && endDate) {
                startDate = `${startDate} 00:00:00`
                endDate = `${endDate} 23:59:59`
                query = `select * from pmspointearnhistoryview where  point_received_at >= :startDate and point_received_at <= :endDate offset :offset limit :limit`
            }

            const response = await this.DB.query(query, { replacements: {offset, limit, startDate, endDate }})

            return response[0]
        }

        async pointExpenceReport({page, limit, startDate, endDate}) {
            const offset = limit * (page - 1);

            let query = `select * from pmspointexpencehistoryview offset :offset limit :limit`

            if (startDate && endDate) {
                startDate = `${startDate} 00:00:00`
                endDate = `${endDate} 23:59:59`
                query = `select * from pmspointexpencehistoryview where  createdat >= :startDate and createdat <= :endDate offset :offset limit :limit`
            }

            const response = await this.DB.query(query, { replacements: {offset, limit, startDate, endDate }})

            return response[0]
        }
}
