import { Module } from '@nestjs/common';
import { PointRuleController } from './point-rule.controller';
import { PointRuleService } from './point-rule.service';
import { DatabaseModule } from '../../config/database/database.module'
import { PointRuleProviders } from './point-rule.providers'


@Module({
  imports: [DatabaseModule],
  controllers: [PointRuleController],
  providers: [PointRuleService, ...PointRuleProviders]
})
export class PointRuleModule {}
