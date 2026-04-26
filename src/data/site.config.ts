import { z } from 'zod';
import may9DayBackground from '../assets/backgrounds/9mayday.png';
import may9NightBackground from '../assets/backgrounds/9maynight.png';
import rtsLogo from '../assets/brand/rts-logo.png';
import rtsLogoLight from '../assets/brand/rts-logo-light.png';

const trustedHosts = ['ctvroblox.com', 'www.ctvroblox.com'] as const;

const trustedUrlSchema = z.url().refine(
  (value) => {
    const { hostname } = new URL(value);
    return trustedHosts.includes(hostname as (typeof trustedHosts)[number]);
  },
  {
    message: `URL должен вести на доверенный хост: ${trustedHosts.join(', ')}`,
  },
);

const visualSchema = z.object({
  skin: z.enum(['regular', 'may9']),
  backgrounds: z.object({
    may9: z.object({
      light: z.string().min(1),
      dark: z.string().min(1),
    }),
  }),
});

const siteConfigSchema = z.object({
  siteName: z.string().min(1),
  description: z.string().min(1),
  brand: z.object({
    logoLightSrc: z.string().min(1),
    logoDarkSrc: z.string().min(1),
    logoAlt: z.string().min(1),
  }),
  visual: visualSchema,
  live: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    sourcePageUrl: trustedUrlSchema,
    allowedEmbedHosts: z.array(z.string().min(1)).nonempty(),
  }),
  footer: z.object({
    copyrightOwner: z.string().min(1),
    contactEmail: z.email().optional(),
  }),
});

export const siteConfig = siteConfigSchema.parse({
  siteName: 'РТС',
  description: 'Прямой эфир телеканала РТС и партнёрские материалы.',
  brand: {
    logoLightSrc: rtsLogoLight.src,
    logoDarkSrc: rtsLogo.src,
    logoAlt: 'Логотип РТС',
  },
  visual: {
    skin: 'may9',
    backgrounds: {
      may9: {
        light: may9DayBackground.src,
        dark: may9NightBackground.src,
      },
    },
  },
  live: {
    title: 'Прямой эфир',
    description: 'Смотрите трансляцию телеканала в адаптивном плеере.',
    sourcePageUrl:
      'https://ctvroblox.com/channel.html?channel_id=9ac0570e701c4172a1e2d5c1edd62188',
    allowedEmbedHosts: [...trustedHosts],
  },
  footer: {
    copyrightOwner: 'РТС',
  },
});

export type SiteConfig = typeof siteConfig;
