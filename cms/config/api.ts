import type { Core } from '@strapi/strapi';

const config: Core.Config.Api = {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
    strictParams: false,
  },
  documents: {
    strictParams: false,
    strictRelations: false,
  },
};

export default config;
