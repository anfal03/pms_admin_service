import { Test, TestingModule } from '@nestjs/testing';
import { PointConvertService } from './point-convert.service';

describe('PointConvertService', () => {
  let service: PointConvertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointConvertService],
    }).compile();

    service = module.get<PointConvertService>(PointConvertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
