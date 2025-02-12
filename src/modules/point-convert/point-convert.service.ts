import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {  DATABASE_CONNECTION } from '../../config/constants'
import { Sequelize } from 'sequelize-typescript';
import { winstonLog } from '../../config/winstonLog'

@Injectable()
export class PointConvertService {

    constructor(
        @Inject(DATABASE_CONNECTION) private DB: Sequelize,
    ) { }

    async details() {

        let query = `select * from pmspointconvertrule order by id desc limit 1`
        let query2 = `select * from pmspointconvertruletemp order by id desc limit 1`

        const [data, data2] = await Promise.all([this.DB.query(query), this.DB.query(query2)])

        return {main: data[0][0], temp: data2[0][0]}
    }

    async updateRule({ point, cash_amount, minimum_required_point, created_by}) {

        let query = `select * from point_conversation(
            _point => :point,
            _cash_amount => :cash_amount,
            _minimum_required_point => :minimum_required_point,
            _created_by => :created_by,
            _action => 'Update'
        )`

        const response = await this.DB.query(query, { replacements: { point, cash_amount, minimum_required_point, created_by }})

        winstonLog.log('info', 'Point Convert Update Response: %o', response[0][0], { label: 'point-convert-rule' })

        if (response[0][0]['code'] != 100) {

            throw new BadRequestException(response[0][0]['msg'])
        }
        
        return response[0][0]

    }

    async action({ created_by, action_type}) {

        let action = 'Reject'

        if(action_type == 1){
            
            action = 'Approve'
        }

        let query = `select * from point_conversation( _created_by => :created_by, _action => :action )`

        const response = await this.DB.query(query, { replacements: { created_by, action }})

        winstonLog.log('info', 'Point Convert action Response: %o', response[0][0], { label: 'point-convert-rule' })

        if (response[0][0]['code'] != 100) {

            throw new BadRequestException(response[0][0]['msg'])
        }
        
        return response[0][0]
    }
}
