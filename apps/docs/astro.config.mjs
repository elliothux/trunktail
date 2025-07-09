// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Container Docs',
      description: 'Documentation for the @apple/container by trunktail.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/elliothux/trunktail' },
        { icon: 'x.com', label: 'X', href: 'https://x.com/elliothux' },
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Example Guide', slug: 'guides/example' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
    }),
  ],
});
