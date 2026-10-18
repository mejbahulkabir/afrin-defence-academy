export interface SiteSettings {
    name: string;
    shortName?: string;
    tagline?: string;
    description?: string;
    phone?: string;
    phoneRaw?: string;
    email?: string;
    whatsapp?: string;
    address?: string;
    mapsEmbed?: string;
    socials?: {
        facebook?: string;
        instagram?: string;
        youtube?: string;
        twitter?: string;
        linkedin?: string;
    };
}