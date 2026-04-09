import { LoginDTO } from '@/auth/Dto/login.dto';
import { RegisterDTO } from '@/auth/Dto/register.dto';
import { PrismaService } from '@/prisma.service';
import { ConflictException, HttpCode, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async createUser(userInformations: RegisterDTO) {

        const existingUser = await this.prisma.user.findFirst({
            where: { username: userInformations.username }
        });

        if (existingUser) {
            throw new ConflictException("User already exists");
        }

        const saltOrRounds = 10;
        const password = userInformations.password;
        const hash = await bcrypt.hash(password, saltOrRounds);

        await this.prisma.user.create({ data: { username: userInformations.username, password: hash, email: userInformations.email } })

        return "User " + userInformations.username + " created successfully."
    }

    async login(loginDto: LoginDTO) {
        const user = await this.findByUsername(loginDto.username);

        const isMatch = await bcrypt.compare(
            loginDto.password,
            user.password
        );

        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = { sub: user.id, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async findByUsername(username: string) {
        let User = await this.prisma.user.findFirst({ where: { username } })
        if (User) {
            return User
        } else {
            throw new NotFoundException("User not found.")
        }
    }
}
