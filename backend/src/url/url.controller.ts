import { Body, Controller, Delete, Get, Param, Post, Query, Redirect, Req, UseGuards } from '@nestjs/common';
import type { CreateShortUrlDTO } from './Dto/create-short-url.dto';
import { UrlService } from './url.service';
import { UrlCreationGuard } from '@/guards/UrlCreation.guard';

@Controller('url')
export class UrlController {
    constructor(private urlService : UrlService) { }

    @Get(':shortUrl')
    @Redirect()
    async RedirectToOriginalUrl(@Param('shortUrl') shortUrl: string, @Query('password') password? : string) {
        const originalUrl = await this.urlService.RedirectToOriginalUrl(shortUrl,password);

        return {
            url: originalUrl,
            statusCode: 302,
        };
    }

    @Get('details/:shortUrl')
    async GetShortUrlDetails(@Param('shortUrl') shortUrl: string) {
        return await this.urlService.GetShortUrlDetails(shortUrl);
    }

    @UseGuards(UrlCreationGuard)
    @Post('create')
    async CreateShortUrl(@Req() req, @Body() dto: CreateShortUrlDTO) {
        return await this.urlService.CreateShortUrl(req,dto);
    }

    @Delete(':shortUrl')
    async DeleteShortUrl(@Req() req,@Param('shortUrl') shortUrl : string) {
        return await this.urlService.DeleteShortUrl(req,shortUrl);
    }

}
