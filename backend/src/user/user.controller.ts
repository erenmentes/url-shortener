import type { RegisterDTO } from '@/auth/Dto/register.dto';
import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import type { LoginDTO } from '@/auth/Dto/login.dto';

@Controller('user')
export class UserController {
    constructor(private userService : UserService) {}

    @Post('register')
    async createUser(userInformations: RegisterDTO) {
        return await this.userService.createUser(userInformations);
    }

    @Post('login')
    async login(loginDto : LoginDTO) {
        return await this.userService.login(loginDto);
    }
}
