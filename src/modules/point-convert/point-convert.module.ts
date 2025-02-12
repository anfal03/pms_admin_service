import { Module } from '@nestjs/common';
import { PointConvertService } from './point-convert.service';
import { PointConvertController } from './point-convert.controller';
import { DatabaseModule } from '../../config/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [PointConvertService],
  controllers: [PointConvertController]
})
export class PointConvertModule {}
