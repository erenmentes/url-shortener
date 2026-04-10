import { PrismaService } from '@/prisma.service';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { CreateShortUrlDTO } from './Dto/create-short-url.dto';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
    constructor(private urlService : UrlService) { }

    // this endpoint is for redirecting user to the original url when they request to the custom url.
    @Get(':shortUrl')
    async GetShortUrl(@Param('shortUrl') shortUrl: string) {
        console.log(shortUrl)
        return shortUrl
    }

    @Get('details/:shortUrl')
    async GetShortUrlDetails(@Param('shortUrl') shortUrl: string) {
        
    }

    @Post('create')
    async CreateShortUrl(@Req() req, @Body() dto: CreateShortUrlDTO) {
        return await this.urlService.CreateShortUrl(req,dto)
    }

}
