import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Redis from "ioredis";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const redis = new Redis({
    host: "localhost",
    port: 6379,
  });
}
bootstrap();
