import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { DATABASE_CONNECTION} from '../../config/constants'
import { QueryTypes, Sequelize } from 'sequelize';
import { winstonLog } from '../../config/winstonLog'
import { AuthService } from './auth.service'


@Injectable()
export class ShebaRilacService {
    constructor(
        @Inject(DATABASE_CONNECTION) private DB: Sequelize,
        private authService: AuthService
    ) { }

    async shebaRilacMerchantlogin(reqBody) {
        const {MSISDN, SystemUserName, SystemPassword} = reqBody
        if(SystemUserName != 'ShebaXYZ@' || SystemPassword != 'PassShebaXYZ@Pass'){
            throw new UnauthorizedException()
        }
        const query =  'select * from shebaRilacMerchantAuthInfo(:MSISDN)'
        const getCustInfoQuery = `select id from oms_customer_profile where mobile =:MSISDN`
        const [result, result2] = await Promise.all([
            this.DB.query(query, {
                type: QueryTypes.SELECT,
                replacements: { MSISDN },
            }),

            this.DB.query(getCustInfoQuery, {
                type: QueryTypes.SELECT,
                replacements: { MSISDN },
            })
        ]);

        let login_datetime = new Date();
        const {id,idx,mobile,email}  = result[0]['customerprofile_data']
        /**
         * 
         *   "id": "9",
         */
        const payload = { 
            subusertype: 0, 
            id: result2.length ? result2[0]['id'] : id, 
            idx, 
            mobile, 
            device_id: 'q',
            email, 
            login_datetime, 
            isparentcustomer: true, 
            auth_type: "merchent", 
            UID: `${id}`,
            business_id:  result[0]['business_id']  
        }

        let { access_token: token = null, access_token_expires = null, refresh_token = null, refresh_token_expires = null} = await this.authService.login(payload)

        let responseData = { 
            isalreadycheckin:true,
            checkininfo:{},
            storeinfo:{},
            user_info: { ...result[0]['customerprofile_data'], isparentcustomer: true, login_datetime }, 
            token,
            is_need_login_approval: false, 
            subusertype: 0,
            business_id:  result[0]['business_id']
        }

        return responseData

    }
}