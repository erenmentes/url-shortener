export interface CreateShortUrlDTO {
    originalUrl: string;
    customUrl?: string;
    isPublic: boolean;
    password?: string;
    expireDate?: string;
}