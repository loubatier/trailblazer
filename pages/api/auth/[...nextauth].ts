import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";
import { supabase } from "../../../lib/supabaseClient";

export const authOptions = {
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLENET_CLIENT_ID,
      clientSecret: process.env.BATTLENET_CLIENT_SECRET,
      issuer: "https://eu.battle.net/oauth", // process.env.BATTLENET_ISSUER,
      authorization: {
        params: { scope: "openid profile email" },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        // Check if the user exists in Supabase
        const { data: existingUser, error } = await supabase
          .from("users")
          .select("*")
          .eq("battlenet_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking user existence:", error);
          return false;
        }

        if (!existingUser) {
          // Create a new user in Supabase
          const { error: insertError } = await supabase
            .from("users")
            .insert([
              {
                name: user.name,
                battlenet_id: user.id,
              },
            ])
            .single();

          if (insertError) {
            console.error("Error creating user:", insertError);
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, account }) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
