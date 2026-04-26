import { z } from 'zod';

const partnerSchema = z.object({
  name: z.string().min(1),
  logoSrc: z.string().min(1),
  href: z.url().optional(),
});

const partnersSchema = z.array(partnerSchema);

export const partners = partnersSchema.parse([]);

export type Partner = z.infer<typeof partnerSchema>;
