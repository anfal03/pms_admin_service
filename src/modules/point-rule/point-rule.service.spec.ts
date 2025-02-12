import { Test, TestingModule } from '@nestjs/testing';
import { PointRuleService } from './point-rule.service';

describe('PointRuleService', () => {
  let service: PointRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointRuleService],
    }).compile();

    service = module.get<PointRuleService>(PointRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
