import { NuxtAuthHandler } from "#auth";
import AzureADProvider from "next-auth/providers/azure-ad";

async function refreshAccessToken(accessToken: any) {
  try {
    const url = `https://login.microsoftonline.com/${process.env.ENTRA_ID_TENANT_ID}/oauth2/v2.0/token`;
    const req = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        `grant_type=refresh_token` +
        `&client_secret=${process.env.ENTRA_ID_CLIENT_SECRET}` +
        `&refresh_token=${accessToken.refreshToken}` +
        `&client_id=${process.env.ENTRA_ID_CLIENT_ID}`,
    });
    const res = await req.json();
    return {
      ...accessToken,
      accessToken: res.access_token,
      accessTokenExpires: Date.now() + res.expires_in * 1000,
      refreshToken: res.refresh_token ?? accessToken.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);
    return {
      ...accessToken,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NuxtAuthHandler({
  secret: process.env.NUXT_AUTH_SECRET,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR.
    AzureADProvider.default({
      clientId: process.env.ENTRA_ID_CLIENT_ID,
      clientSecret: process.env.ENTRA_ID_CLIENT_SECRET,
      tenantId: process.env.ENTRA_ID_TENANT_ID,
      authorization: {
        params: {
          scope: `offline_access openid profile email ${process.env.ENTRA_ID_CLIENT_ID}/access_as_user`,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the access_token in the encrypted JWT.
      if (account && profile) {
        token.accessToken = account.access_token;
        // @ts-expect-error
        token.accessTokenExpires = account.expires_at * 1000;
        token.refreshToken = account.refresh_token;
      }
      // @ts-expect-error
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
    },
  },
});
