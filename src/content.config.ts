import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const artwork = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artwork' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      date: z.date(),
    }),
});

export const collections = { artwork };
