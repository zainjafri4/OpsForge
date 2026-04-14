import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { PublicTestsController } from './public-tests.controller';

@Module({
  providers: [TestsService],
  controllers: [TestsController, PublicTestsController],
})
export class TestsModule {}
