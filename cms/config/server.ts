import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => {
  const railwayDomain = env('RAILWAY_PUBLIC_DOMAIN');
  const publicUrl =
    env('PUBLIC_URL') ||
    (railwayDomain ? `https://${railwayDomain}` : `http://localhost:${env.int('PORT', 1337)}`);

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: publicUrl.replace(/\/$/, ''),
    app: {
      keys: env.array('APP_KEYS')!,
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
  };
};

export default config;
