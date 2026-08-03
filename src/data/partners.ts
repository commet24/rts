import { z } from 'zod';
import aeroflotLogo from '../assets/partners/aeroflot.png';
import smartVestLogo from '../assets/partners/smart-vest.png';
import roTvLogo from '../assets/partners/ro-tv.png';
import rpforgeLogo from '../assets/partners/rpforge.png';
import vladivostokAviaLogo from '../assets/partners/vladivostok-avia.png';
import emiratesLogo from '../assets/partners/emirates.png';
import klnLogo from '../assets/partners/kln.png';
import rtrsLogo from '../assets/partners/rtrs.png';
import aeroflotSovietLogo from '../assets/partners/aeroflot-soviet.png';

const partnerSchema = z.object({
  name: z.string().min(1),
  logoSrc: z.string().min(1),
  href: z.string().url().optional(),
});

const partnersSchema = z.array(partnerSchema);

export const partners = partnersSchema.parse([
  {
    name: 'Телеканал Ro-TV',
    logoSrc: roTvLogo.src,
    href: 'https://t.me/ro_tv_news',
  },
  {
    name: 'Аэрофлот в PTFS',
    logoSrc: aeroflotLogo.src,
    href: 'https://t.me/RBLXaeroflot',
  },
  {
    name: 'Промышленно Air',
    logoSrc: smartVestLogo.src,
    href: 'https://t.me/promyshlenoair',
  },
  {
    name: 'Пресс-служба Промышленно Air',
    logoSrc: smartVestLogo.src,
    href: 'https://t.me/presspromyshlenoair',
  },
  {
    name: 'KLN Ru PTFS Official',
    logoSrc: klnLogo.src,
    href: 'https://t.me/KLNRuPTFSofficial',
  },
  {
    name: 'Радиостанция РТРС',
    logoSrc: rtrsLogo.src,
    href: 'https://t.me/RTRS_of',
  },
  {
    name: 'Emirates in PTFS',
    logoSrc: emiratesLogo.src,
    href: 'https://t.me/Emirates2026PTFS',
  },
  {
    name: 'Федеральный совет Аэрофлота',
    logoSrc: aeroflotSovietLogo.src,
    href: 'https://t.me/gruppasalut',
  },
  {
    name: 'Vladivostok Avia',
    logoSrc: vladivostokAviaLogo.src,
    href: 'https://t.me/vladivostokandavia',
  },
  {
    name: 'RPforge Studio',
    logoSrc: rpforgeLogo.src,
    href: 'https://t.me/rpforge',
  },
]);

export type Partner = z.infer<typeof partnerSchema>;
