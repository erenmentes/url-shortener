import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateShortUrlDTO } from './Dto/create-short-url.dto';

@Injectable()
export class UrlService {
    constructor(private prisma: PrismaService) { }

    async RedirectToOriginalUrl(shortUrl: string, password?: string) {
        const url = await this.prisma.url.findFirst({ where: { customUrl: shortUrl } })

        if (!url) throw new NotFoundException();

        if (this.isExpired(url.expireDate)) {
            throw new NotFoundException("URL expired.");
        }

        if (!url.isPublic) {
            if (url.password == password) {
                return url.originalUrl
            } else {
                throw new UnauthorizedException("Wrong password.")
            }
        } else {
            return url.originalUrl
        }
    }

    async GetShortUrlDetails(shortUrl: string) {
        const shortUrlDetails = await this.prisma.url.findFirst({ where: { customUrl: shortUrl } });

        if(!shortUrlDetails) {
            throw new NotFoundException("Url not found.")
        }

        return shortUrlDetails
    }

    async CreateShortUrl(req, dto: CreateShortUrlDTO) {
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

    async DeleteShortUrl(req, shortUrl : string) {
        const userId = req.user?.id;

        if (!userId) {
            throw new UnauthorizedException("You can't do it.")
        }

        if(!this.checkIfOwns(shortUrl,userId)) {
            throw new UnauthorizedException("You can't do it.")
        }

        this.prisma.url.delete({where : {customUrl : shortUrl}});

        return "Url " + shortUrl + " deleted successfully."
    }

    private generateShortCode(): string {
        return Math.random().toString(36).substring(2, 8);
    }

    private async checkIfOwns(shortUrl : string,userId : number) {
        const url = await this.prisma.url.findFirst({where : {customUrl : shortUrl}})

        if (url?.authorId != userId) {
            return false
        }

        return true
    }

    private isExpired(expireDate: Date): boolean {
        return expireDate.getTime() < Date.now();
    }
}
