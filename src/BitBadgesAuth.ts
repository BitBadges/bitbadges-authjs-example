/**
 * <div style={{backgroundColor: "#24292f", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>BitBadges</b> integration.</span>
 * <a href="https://bitbadges.io">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/bitbadges.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/bitbadges
 */

import { OAuthUserConfig, OAuthConfig } from 'next-auth/providers';

export interface BitBadgesProfile {
    name: string;
    address: string;
}

/**
 * Add BitBadges login to your page to allow authentication with BitBadges and any supported blockchain (Ethereum, Bitcoin, Cosmos, Solana, etc).
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/bitbadges
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import BitBadges from "@auth/core/providers/bitbadges"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [BitBadges({ clientId: BITBADGES_CLIENT_ID, clientSecret: BITBADGES_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 * - [BitBadges - Configure your OAuth Apps](https://bitbadges.io/developer)
 * - [BitBadges - Sign In with BitBadges Reference](https://docs.bitbadges.io/for-developers/authenticating-with-bitbadges/overview)
 * - [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 * - [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/bitbadges.ts)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the BitBadges provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The BitBadges provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/github.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function BitBadges(
    config: OAuthUserConfig<BitBadgesProfile> & {
        expectAttestationsPresentations?: boolean;
        ownershipRequirements?: any;
        expectVerifySuccess?: boolean;
        issuedAtTimeWindowMs?: number;
        name?: string;
        image?: string;
        description?: string;
    }
): OAuthConfig<BitBadgesProfile> {
    return {
        id: 'bitbadges',
        name: 'BitBadges',
        type: 'oauth',
        clientId: process.env.BITBADGES_CLIENT_ID, // from the provider's dashboard
        clientSecret: process.env.BITBADGES_CLIENT_SECRET, // from the provider's dashboard
        authorization: {
            url: `${'https://bitbadges.io/auth/codegen'}`,
            params: {
                expectAttestationsPresentations:
                    config.expectAttestationsPresentations,
                ownershipRequirements: config.ownershipRequirements,
                expectVerifySuccess: config.expectVerifySuccess,
                name: config.name,
                image: config.image,
                description: config.description,
            },
        },
        token: {
            url: `${'https://api.bitbadges.io/api/v0/siwbbRequest/fetch'}`,
            params: {
                options: JSON.stringify({
                    ownershipRequirements: config.ownershipRequirements,
                    issuedAtTimeWindowMs: config.issuedAtTimeWindowMs,
                }),
            },
        },
        userinfo: {
            url: 'https://bitbadges.io',
            async request({ tokens }: { tokens: { access_token: string } }) {
                console.log(tokens);
                return {
                    name: tokens.access_token,
                    user_id: tokens.access_token,
                    address: tokens.access_token,
                };
            },
        },
        style: { bg: '#24292f', text: '#fff' },
    };
}