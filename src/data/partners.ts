import { z } from 'zod';
import aeroflotLogo from '../assets/partners/aeroflot.png';
import ekaterunaBelukaaLogo from '../assets/partners/ekateruna-belukaa.png';
import smartVestLogo from '../assets/partners/smart-vest.png';
import xxlStudiosLogo from '../assets/partners/xxl-studios.png';

const partnerSchema = z.object({
  name: z.string().min(1),
  logoSrc: z.string().min(1),
  href: z.url().optional(),
});

const partnersSchema = z.array(partnerSchema);

export const partners = partnersSchema.parse([
  {
    name: 'XXL Studios',
    logoSrc: xxlStudiosLogo.src,
    href: 'https://t.me/xxlstudios',
  },
  {
    name: 'Аэрофлот',
    logoSrc: aeroflotLogo.src,
    href: 'https://t.me/Airlines698',
  },
  {
    name: 'Ekateruna Belukaa',
    logoSrc: ekaterunaBelukaaLogo.src,
    href: 'https://t.me/EkaterunaBelukaa',
  },
  {
    name: 'SmartVest',
    logoSrc: smartVestLogo.src,
    href: 'https://t.me/SmartVestA',
  },
]);

export type Partner = z.infer<typeof partnerSchema>;
