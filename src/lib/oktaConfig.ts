export const oktaConfig = {
    clientId: '0oai4bvv99p1Jl5rH5d7',
    issuer: 'https://dev-25583427.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}