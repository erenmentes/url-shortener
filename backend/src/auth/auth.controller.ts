import { Body, Controller, Post } from '@nestjs/common';
import type { RegisterDTO } from './Dto/register.dto';
import { AuthService } from './auth.service';
import type { LoginDTO } from './Dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService) {}

    @Post('register')
    async Register(@Body() registerDto : RegisterDTO) {
        return this.authService.Register(registerDto);
    }

    @Post('login')
    async Login(@Body() loginDto : LoginDTO) {
        return this.authService.Login(loginDto);
    }

}
