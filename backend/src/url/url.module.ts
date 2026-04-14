import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UrlCreationGuard } from '@/guards/UrlCreation.guard';

@Module({
  providers: [UrlService,UrlCreationGuard],
  controllers: [UrlController]
})
export class UrlModule {}
