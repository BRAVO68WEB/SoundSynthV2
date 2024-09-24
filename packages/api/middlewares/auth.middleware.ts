import { Context, Next } from "hono";
import { createRemoteJWKSet, jwtVerify } from "jose"
import { env } from '@/utils/env';
import { getCookie } from "hono/cookie";

export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization") ?? c.req.header("authorization") ?? getCookie(c, "access_token");

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const tokenWithoutBearer = token.replace("Bearer ", "");

  const jwks = createRemoteJWKSet(new URL(
    "https://" + env.AUTH0_DOMAIN + "/.well-known/jwks.json"
  ));

  const { payload } = await jwtVerify(tokenWithoutBearer, jwks, {
    issuer: `https://${env.AUTH0_DOMAIN}/`,
  });

  const decodedToken = payload;

  if (!decodedToken) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("user", decodedToken);
  
  await next();
}