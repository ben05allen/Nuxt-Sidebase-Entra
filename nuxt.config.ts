// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@sidebase/nuxt-auth"],
  experimental: {
    renderJsonPayloads: true,
  },
  auth: {
    provider: {
      type: "authjs",
    },
  },
  runtimeConfig: {
    entraId: {
      clientId: process.env.ENTRA_ID_CLIENT_ID,
      clientSecret: process.env.ENTRA_ID_CLIENT_SECRET,
      tenantId: process.env.ENTRA_ID_TENANT_ID,
    },
  },
});
