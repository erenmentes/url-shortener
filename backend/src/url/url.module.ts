import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UrlCreationGuard } from '@/guards/UrlCreation.guard';
import { RedisModule } from '@/redis/redis.module';

@Module({
  imports : [RedisModule],
  providers: [UrlService,UrlCreationGuard],
  controllers: [UrlController]
})
export class UrlModule {}
