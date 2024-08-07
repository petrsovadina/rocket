import { AuthOptions } from '@auth0/nextjs-auth0';

export const authOptions: AuthOptions = {
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  routes: {
    callback: '/api/auth/callback',
    postLogoutRedirect: 'https://rocket-sovadina.vercel.app/',
  },
};