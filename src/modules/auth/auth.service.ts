import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { REDIS_CONNECTION} from '../../config/constants'


@Injectable()
export class AuthService {
    constructor(
        @Inject(REDIS_CONNECTION) private redisClient: any,
        private readonly jwtService: JwtService    
        ) { }

    async validateUser(username: string, password: string) {
        
        // const app = await this.pmsapiauthRepository.findOne({ where : { username }})

        // if(!app) {

        //     return false
        // }
        // else if(await this.comparePassword(password, app.password)) {

        //     return true
        // }
        // else {

        //     return false
        // }

        return true
    }

    private generateId(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // here username and mobileno will be pass UID key
    //key = auth:admin:username:token:jti
    //key = auth:merchent:mobileno:token:jti

    // private async generateToken(user) {
    //     const jti =  `${Date.now()}_${this.generateId(10)}`
    //     const token = await this.jwtService.signAsync({...user,jti});
    //     const decoded = await this.jwtService.decode(token);
    //     const key = `enduser_auth:${user.id}:token:` + jti;
    //     if (decoded['exp']) { 
    //          await  this.redisClient.setEx(key, Math.floor(decoded['exp'] - Date.now() / 1000), JSON.stringify(user));
    //     } else{
    //         await this.redisClient.set(key,  JSON.stringify(user));
    //     }
    //     return token;
    // }

    private async generateToken(user) {
        const jti =  `${Date.now()}_${this.generateId(10)}`
        const token = await this.jwtService.signAsync({...user,jti});
        const decoded = await this.jwtService.decode(token);
        const key = `auth:${user['auth_type']}:${user['UID']}:token:` + jti;
        const key2 = `enduser_auth:${user.id}:token:` + jti;

        if (decoded['exp']) { 
             await  this.redisClient.setEx(key, Math.floor(decoded['exp'] - Date.now() / 1000), JSON.stringify(user));
             await  this.redisClient.setEx(key2, Math.floor(decoded['exp'] - Date.now() / 1000), JSON.stringify(user));

        } else{
            await this.redisClient.set(key,  JSON.stringify(user));
            await this.redisClient.set(key2,  JSON.stringify(user));
        }
        return token;
    }

    private async generateRefreshToken(user) {
        const jti =  `${Date.now()}_${this.generateId(10)}`
        const token = await this.jwtService.signAsync({...user,jti}, { secret: process.env.REFRESH_KEY, expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
        const decoded = await this.jwtService.decode(token);
        const key = `auth:${user['auth_type']}:${user['UID']}:refreshToken:` + jti;
        const key2 = `enduser_auth:${user.id}:refreshToken:` + jti;
        if (decoded['exp']) { 
             await  this.redisClient.setEx(key, Math.floor(decoded['exp'] - Date.now() / 1000), JSON.stringify(user));
             await  this.redisClient.setEx(key2, Math.floor(decoded['exp'] - Date.now() / 1000), JSON.stringify(user));

        } else{
            await this.redisClient.set(key,  JSON.stringify(user));
            await this.redisClient.set(key2,  JSON.stringify(user));

        }
        return token;
    }

    public async checkJwtTokenInRedis(payload,jti) {

        const key = `auth:${payload['auth_type']}:${payload['UID']}:token:` + jti;
        const user = await this.redisClient.get(key)
        return user ? JSON.parse(user) : null
    }

    public async checkJwtRefreshTokenInRedis(payload,jti) {

        const key = `auth:${payload['auth_type']}:${payload['UID']}:refreshToken:` + jti;
        const user = await this.redisClient.get(key)
        return user ? JSON.parse(user) : null
    }

    public async removeJwtRefreshTokenInRedis(payload,jti) {

        const key = `auth:${payload['auth_type']}:${payload['UID']}:refreshToken:` + jti;
        return this.redisClient.del(key)
    }

    public async login(user) {

        const {id, roleid, username, auth_type='unknown', UID='0', business_id=null, mobile=null, device_id=null, email = null} = user
        const tokenData = { id, roleid, username, auth_type, UID, business_id, mobile, device_id, email}

        const [access_token, refresh_token] = await Promise.all([ await this.generateToken(tokenData), await this.generateRefreshToken(tokenData)]);
        const [decoded, decoded2] = await Promise.all([await this.jwtService.decode(access_token), await this.jwtService.decode(refresh_token)])
        return { ...user, access_token, access_token_expires: decoded['exp'] || 7991326775, refresh_token, refresh_token_expires: decoded2['exp'] || 7991326775 };
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }

}