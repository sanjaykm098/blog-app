import { Module } from '@nestjs/common';
import { FrontService } from './front.service';
import { FrontController } from './front.controller';

@Module({
  providers: [FrontService],
  controllers: [FrontController]
})
export class FrontModule {}
