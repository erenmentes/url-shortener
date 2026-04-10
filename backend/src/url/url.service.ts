import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateShortUrlDTO } from './Dto/create-short-url.dto';

@Injectable()
export class UrlService {
    constructor(private prisma: PrismaService) { }

    async CreateShortUrl(req, dto : CreateShortUrlDTO) {
        const userId = req.user?.id;

        let customUrl = dto.customUrl;
        let expireDate: Date;

        if (!userId) {
            if (customUrl) {
                throw new Error('You can not use custom url without logging in.');
            }

            expireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        } else {

            expireDate = dto.expireDate
                ? new Date(dto.expireDate)
                : new Date(Date.now() + 24 * 60 * 60 * 1000);
        }

        const createdUrl = await this.prisma.url.create({
            data: {
                originalUrl: dto.originalUrl,
                customUrl: customUrl ?? this.generateShortCode(),
                isPublic: dto.isPublic,
                password: dto.password,
                expireDate: expireDate,
                authorId: userId ?? null,
            },
        });

        return createdUrl;
    }

    private generateShortCode(): string {
        return Math.random().toString(36).substring(2, 8);
    }
}
