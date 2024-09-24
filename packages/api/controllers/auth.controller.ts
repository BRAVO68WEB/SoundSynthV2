import { Context } from "hono";
import { AuthService } from "../services/auth.service";
import { env } from "@/utils/env";
import { setCookie } from "hono/cookie";

export class AuthController {
    public static async login(c: Context) {
        const url = await AuthService.genLoginURL();
        return c.redirect(url);
    }

    public static async callback(c: Context) {
        try {
            const { code } = c.req.query();
            if (!code) {
                throw new Error('No code');
            }
            const token = await AuthService.getToken(code);

            if (!token.id_token) {
                throw new Error('No token');
            }

            setCookie(c, 'access_token', token.id_token, {
                path: '/',
                secure: true,
                maxAge: 60 * 60, // 1 hour
            });
            return c.redirect(env.APP_URI + '/dashboard');
        }
        catch (e) {
            return c.json({
                error: e,
            });
        }
    }
    public static async me(c: Context) {
        return c.json({
            message: 'Hello World',
        });
    }
}