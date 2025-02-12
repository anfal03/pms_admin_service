import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { VoucherProviders } from './voucher.providers'
import { DatabaseModule } from '../../config/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [VoucherService, ...VoucherProviders],
  controllers: [VoucherController],
  exports: [VoucherService]
})
export class VoucherModule {}
