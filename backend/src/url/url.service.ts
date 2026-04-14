import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateShortUrlDTO } from './Dto/create-short-url.dto';
import Redis from "ioredis";

@Injectable()
export class UrlService {
    constructor(private prisma: PrismaService, private redis: Redis) { }

    async RedirectToOriginalUrl(shortUrl: string, password?: string) {
        const cacheKey = `url:${shortUrl}`;
        let urlData: any;

        const cached = await this.redis.get(cacheKey);
        if (cached) {
            urlData = JSON.parse(cached);
        } else {
            urlData = await this.prisma.url.findFirst({ where: { customUrl: shortUrl } });

            if (!urlData) throw new NotFoundException();

            if (!this.isExpired(new Date(urlData.expireDate))) {
                await this.redis.set(cacheKey, JSON.stringify(urlData), 'EX', 60);
            }
        }

        if (this.isExpired(new Date(urlData.expireDate))) {
            throw new NotFoundException("URL expired.");
        }

        if (!urlData.isPublic && urlData.password !== password) {
            throw new UnauthorizedException("Wrong password.");
        }

        return urlData.originalUrl;
    }

    async GetShortUrlDetails(shortUrl: string) {
        const shortUrlDetails = await this.prisma.url.findFirst({ where: { customUrl: shortUrl } });

        if (!shortUrlDetails) {
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
                customUrl: customUrl ?? await this.generateShortCode(),
                isPublic: dto.isPublic,
                password: dto.password,
                expireDate: expireDate,
                authorId: userId ?? null,
            },
        });

        return createdUrl;
    }

    async DeleteShortUrl(req, shortUrl: string) {
        const userId = req.user?.id;
        const cacheKey = `url:${shortUrl}`;

        if (!userId) {
            throw new UnauthorizedException("You can't do it.")
        }

        if (!await this.checkIfOwns(shortUrl, userId)) {
            throw new UnauthorizedException("You can't do it.")
        }

        await this.prisma.url.delete({ where: { customUrl: shortUrl } });
        await this.redis.del(cacheKey)

        return "Url " + shortUrl + " deleted successfully."
    }

    private async generateShortCode(): Promise<string> {
        let isExists = true;
        let shortCode = "";

        while (isExists) {
            shortCode = Math.random().toString(36).substring(2, 8);
            const found = await this.checkIfAlreadyExists("customUrl", shortCode);
            if (!found) isExists = false;
        }

        return shortCode;
    }

    private async checkIfAlreadyExists(fieldName: string, value: any) {
        const isFound = await this.prisma.url.findFirst({
            where: {
                [fieldName]: value
            }
        });
        return isFound;
    }

    private async checkIfOwns(shortUrl: string, userId: number) {
        const url = await this.prisma.url.findFirst({ where: { customUrl: shortUrl } })

        if (url?.authorId != userId) {
            return false
        }

        return true
    }

    private isExpired(expireDate: Date): boolean {
        return expireDate.getTime() < Date.now();
    }
}
