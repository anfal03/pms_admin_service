import { Test, TestingModule } from '@nestjs/testing';
import { PointConvertController } from './point-convert.controller';

describe('PointConvertController', () => {
  let controller: PointConvertController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointConvertController],
    }).compile();

    controller = module.get<PointConvertController>(PointConvertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
