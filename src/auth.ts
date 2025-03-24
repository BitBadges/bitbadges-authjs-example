import NextAuth from 'next-auth';
import { BitBadgesNextAuth as BitBadges } from 'bitbadgesjs-sdk';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        //Default
        // BitBadges,

        //Custom parameters
        BitBadges({
            // Create your claim in the developer portal and attach it here
            // claimId: '',
            // onlyCheckClaimBehindTheScenes: true, // If false, we display on frontend as well
        }),
    ],
});
