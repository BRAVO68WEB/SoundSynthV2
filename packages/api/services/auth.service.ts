import { generators } from "openid-client";
import { auth0Client } from "../helpers/oidc_client";
import { env } from '@/utils/env';

const code_verifier  = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier);

export class AuthService {
    public static async genLoginURL() {
        const url = auth0Client.authorizationUrl({
            scope: 'openid profile email',
            redirect_uri: env.AUTH0_REDIRECT_URI,
            code_challenge,
            code_challenge_method: 'S256',
        });

        return url;
    }

    public static async getToken(code: string) {
        const tokenSet = await auth0Client.callback(
            env.AUTH0_REDIRECT_URI,
            {
                code,
                code_verifier,
            },
            {
                code_verifier
            }
        );

        if (!tokenSet.access_token) {
            throw new Error('No access token');
        }

        return tokenSet;
    }


    public static async getUser(access_token: string) {
        const user = await auth0Client.userinfo(access_token);
        return user;
    }
}