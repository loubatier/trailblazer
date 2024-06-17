import { deleteCookie, setCookie } from "cookies-next";
import NextAuth, { Session } from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";
import { QueryData } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabaseClient";

export interface SupabaseUser {
  id: string;
  name: string;
  battlenet_id: string;
}

export const authOptions = (req, res) => {
  return {
    secret: process.env.NEXTAUTH_SECRET,
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
      async signIn({ user, account }) {
        try {
          setCookie("accessToken", account.access_token, {
            req,
            res,
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });

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
            const { data: newUser, error: insertError } = await supabase
              .from("users")
              .insert([
                {
                  name: user.name,
                  battlenet_id: user.id,
                },
              ])
              .select("*")
              .single();

            if (insertError) {
              console.error("Error creating user:", insertError);
              return false;
            }
            user.supabaseId = newUser.id;
          } else {
            user.supabaseId = existingUser.id;
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      },
      async jwt({ token, user }) {
        if (user) {
          token.supabaseId = user.supabaseId;
        }
        return token;
      },
      async session({ session, token }) {
        return {
          ...session,
          user: { name: session.user.name, supabaseId: token.supabaseId },
        } as Session;
      },
      events: {
        async signOut() {
          deleteCookie("accessToken", { path: "/" });
        },
      },
    },
  };
};

export default (req, res) => {
  return NextAuth(req, res, authOptions(req, res));
};
