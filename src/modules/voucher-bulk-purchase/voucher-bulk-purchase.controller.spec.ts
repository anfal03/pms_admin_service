import { Test, TestingModule } from '@nestjs/testing';
import { VoucherBulkPurchaseController } from './voucher-bulk-purchase.controller';

describe('VoucherBulkPurchaseController', () => {
  let controller: VoucherBulkPurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherBulkPurchaseController],
    }).compile();

    controller = module.get<VoucherBulkPurchaseController>(VoucherBulkPurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
