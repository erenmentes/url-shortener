import { Body, Controller, Delete, Get, Param, Post, Redirect, Req } from '@nestjs/common';
import type { CreateShortUrlDTO } from './Dto/create-short-url.dto';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
    constructor(private urlService : UrlService) { }

    @Get(':shortUrl')
    @Redirect()
    async RedirectToOriginalUrl(@Param('shortUrl') shortUrl: string, @Body('password') password? : string) {
        const originalUrl = await this.urlService.RedirectToOriginalUrl(shortUrl);

        return {
            url: originalUrl,
            statusCode: 302,
        };
    }

    @Get('details/:shortUrl')
    async GetShortUrlDetails(@Param('shortUrl') shortUrl: string) {
        return await this.urlService.GetShortUrlDetails(shortUrl);
    }

    @Post('create')
    async CreateShortUrl(@Req() req, @Body() dto: CreateShortUrlDTO) {
        return await this.urlService.CreateShortUrl(req,dto);
    }

    @Delete(':shortUrl')
    async DeleteShortUrl(@Req() req,@Param('shortUrl') shortUrl : string) {
        return await this.urlService.DeleteShortUrl(req,shortUrl);
    }

}
