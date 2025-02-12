import { Module, NestModule,MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module'
import {LoggerMiddleware} from './middleware'

import {interceptorProviders} from './helpers/interceptor'
import { AuthModule } from './modules/auth/auth.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { RedisModule } from './config/redis/redis.module'
import { PointRuleModule } from './modules/point-rule/point-rule.module';
import { AddressModule } from './modules/address/address.module';
import { VoucherBulkPurchaseModule } from './modules/voucher-bulk-purchase/voucher-bulk-purchase.module';
import { PointConvertModule } from './modules/point-convert/point-convert.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    DatabaseModule,
    RedisModule,
    AuthModule,
    VoucherModule,
    PointRuleModule,
    AddressModule,
    VoucherBulkPurchaseModule,
    PointConvertModule,
    ReportModule
  ],
  controllers: [

  ],
  providers: [

     ...interceptorProviders
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

