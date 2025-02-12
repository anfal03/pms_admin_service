import { Controller, Body, Post, UseGuards, Request, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginAuthDto, RefreshAuthDto} from '../../dto'
import {UNAUTHORIZED, BAD_REQUEST} from '../../helpers/responseHelper'
import {JwtRefreshAuthGuard} from '../../middleware/guards/JwtAuthGuard'
import { winstonLog } from '../../config/winstonLog'
import { ShebaRilacService } from './auth.sheba-rilac-merchant.service'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private shebaRilacService: ShebaRilacService,
        ) {}

    @Post('v1/setToken')
    async login(@Request() req, @Body() body :any) {
        return await this.authService.login(body)
    }

    @Post('v1/sheba-rilac-merchant-login')
    async shebaRilacMerchantlogin(@Request() req, @Body() body :any) {
        return await this.shebaRilacService.shebaRilacMerchantlogin(body)
    }

    // @Post('v1/login')
    // async login(@Request() req, @Body() body :any) {
    //     return await this.authService.login(body)
    // }

    /*
    Request Header : {
        module : "developermodule" //provide by redtecnologies
    }

    Request Body : {
        refresh_token : "", //which one provided in auth/v1/login
        phone_os : "", //take information from device
        phone_brand : "", //take information from device
        device_id : "", //take information from device
        phone_model : "" //take information from device
    } 

    Response Body : {
        "id": "9",
        "email": "suj9763@gmail.com",
        "mobile": "9849131399",
        "firstname": "test",
        "lastname": "test",
        "pointBalance": 0,
        "device_id": "q",
        "access_token": "",
        "access_token_expires": 1679991855,
        "refresh_token": "",
        "refresh_token_expires": 1687595056
    }
    */
    // @UseGuards(JwtRefreshAuthGuard)
    // @Post('v1/refresh-token')
    // async refreshToken(@Request() req, @Body() refreshBody :RefreshAuthDto) {

    //     winstonLog.log('info', 'Request Userinfo %o', req.user, { label: 'refresh-token' })

    //     if (refreshBody.device_id != req.user['device_id']) {
    //         // customer login from one device and then try to refresh from another device
    //         winstonLog.log('warn', 'Customer login from one device and then try to refresh from another device', req.user, { label: 'refresh-token' })
    //         throw new BadRequestException(req.i18n.__('invalidusercredentials'),'4003')
    //     }

    //     const customer = await this.customerService.customerAuthCheck({...refreshBody, cus_mobileno: req.user['mobile']})

    //     if (!customer) {
    //         // customer does not exist......
    //         throw new BadRequestException(req.i18n.__('invalidusercredentials'),'4001')
    //     }
    //     else if(customer == -1){
    //         // customer device id does not match..
    //         throw new BadRequestException(req.i18n.__('invalidusercredentials'),'4002')
    //     }
    //     this.authService. removeJwtRefreshTokenInRedis(req.user['id'],req.user['jti'])

    //     return await this.authService.login({...customer, device_id: refreshBody.device_id})
        
    // }

}