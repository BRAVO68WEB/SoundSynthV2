import { Issuer } from 'openid-client';
import { env } from '@/utils/env';

const auth0Issuer = await Issuer.discover(
    `https://${env.AUTH0_DOMAIN}/.well-known/openid-configuration`,
);

export const auth0Client = new auth0Issuer.Client({
    client_id: env.AUTH0_CLIENT_ID,
    client_secret: env.AUTH0_CLIENT_SECRET,
    redirect_uris: [env.AUTH0_REDIRECT_URI],
    response_types: ['code'],
    token_endpoint_auth_signing_alg: 'RS256',
    token_endpoint_auth_method: 'client_secret_post',
    id_token_signed_response_alg: 'RS256',
    authorization_signed_response_alg: 'RS256',
});