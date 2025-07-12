// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://trunktail.pages.dev',
  redirects: {
    '/': '/commands',
  },
  integrations: [
    starlight({
      title: 'Apple Container Docs',
      description: 'Documentation for the @apple/container by trunktail.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/elliothux/trunktail' },
        { icon: 'x.com', label: 'X', href: 'https://x.com/elliothux' },
      ],
      sidebar: [
        {
          label: 'Container CLI',
          items: [
            { label: 'Overview', slug: 'commands' },
            { label: 'Container', slug: 'commands/container' },
            { label: 'Image', slug: 'commands/image' },
            { label: 'Registry', slug: 'commands/registry' },
            { label: 'System', slug: 'commands/system' },
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
