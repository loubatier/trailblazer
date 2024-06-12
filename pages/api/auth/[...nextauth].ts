import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLENET_CLIENT_ID,
      clientSecret: process.env.BATTLENET_CLIENT_SECRET,
      issuer: "https://eu.battle.net/oauth", // process.env.BATTLENET_ISSUER
    }),
  ],
};

export default NextAuth(authOptions);
