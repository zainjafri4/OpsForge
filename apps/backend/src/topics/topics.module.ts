import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { PublicTopicsController } from './public-topics.controller';

@Module({
  providers: [TopicsService],
  controllers: [PublicTopicsController, TopicsController],
  exports: [TopicsService],
})
export class TopicsModule {}
