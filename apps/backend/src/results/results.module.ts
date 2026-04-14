import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { PublicResultsController } from './public-results.controller';

@Module({
  providers: [ResultsService],
  controllers: [PublicResultsController, ResultsController],
})
export class ResultsModule {}
