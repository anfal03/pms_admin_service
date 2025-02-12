import { Test, TestingModule } from '@nestjs/testing';
import { VoucherBulkPurchaseService } from './voucher-bulk-purchase.service';

describe('VoucherBulkPurchaseService', () => {
  let service: VoucherBulkPurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoucherBulkPurchaseService],
    }).compile();

    service = module.get<VoucherBulkPurchaseService>(VoucherBulkPurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
