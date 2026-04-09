import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './Dto/register.dto';
import { LoginDTO } from './Dto/login.dto';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async Register(registerDto: RegisterDTO) {
        return await this.userService.createUser({
            username: registerDto.username,
            password: registerDto.password,
            email: registerDto.email,
        });
    }

    async Login(loginDto: LoginDTO) {
        return await this.userService.login(loginDto);
    }
}