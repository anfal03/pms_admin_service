import { Module } from '@nestjs/common';
import { VoucherBulkPurchaseService } from './voucher-bulk-purchase.service';
import { VoucherBulkPurchaseController } from './voucher-bulk-purchase.controller';
import { DatabaseModule } from '../../config/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [VoucherBulkPurchaseService],
  controllers: [VoucherBulkPurchaseController]
})
export class VoucherBulkPurchaseModule {}
