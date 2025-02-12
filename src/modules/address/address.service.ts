import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { DATABASE_CONNECTION } from '../../config/constants'

@Injectable()
export class AddressService {

    constructor(
        @Inject(DATABASE_CONNECTION) private DB: Sequelize
    ) { }

    async countryList() {

        const response = await this.DB.query(`select * from country order by name ASC`)
        return response[0]
    }

    async cityList(country_id) {

        const response = await this.DB.query(`select * from city where country_id = :country_id order by name ASC`, { replacements : { country_id }})
        return response[0]
    }
}
