import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy, RefreshTokenStrategy } from './jwt.strategy';
import { AuthProviders } from './auth.providers'
import { RedisModule } from '../../config/redis/redis.module'
import { DatabaseModule } from '../../config/database/database.module'
import { ShebaRilacService } from './auth.sheba-rilac-merchant.service'

@Module({
    imports: [
        RedisModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWTKEY,
            signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
        }),
        DatabaseModule
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        RefreshTokenStrategy,
        ShebaRilacService,
        ...AuthProviders
    ],
    controllers: [AuthController],
    
})
export class AuthModule { }