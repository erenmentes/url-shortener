import { PrismaService } from '@/prisma.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('url')
export class UrlController {
    constructor(private prisma : PrismaService) {}

    @Get(':shortUrl')
    async GetShortUrl(@Param('shortUrl') shortUrl : string) {
        console.log(shortUrl)
        return shortUrl
    }

}
