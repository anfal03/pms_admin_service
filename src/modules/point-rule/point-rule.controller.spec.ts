import { Test, TestingModule } from '@nestjs/testing';
import { PointRuleController } from './point-rule.controller';

describe('PointRuleController', () => {
  let controller: PointRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointRuleController],
    }).compile();

    controller = module.get<PointRuleController>(PointRuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
