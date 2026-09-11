import type { Core } from "@strapi/strapi";
import { bootstrapCms } from "./bootstrap";

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await bootstrapCms(strapi);
  },
};
