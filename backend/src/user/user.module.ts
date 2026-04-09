import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports : [PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),],
  exports : [UserService],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
