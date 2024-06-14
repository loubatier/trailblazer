import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent: React.FC) => {
  const Auth = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/");
      }
    }, [status, router]);

    if (status === "loading") {
      return <div>Loading...</div>; // Show a loading indicator
    }

    if (!session) {
      return null; // Prevent rendering until redirect occurs
    }

    return <WrappedComponent {...props} />;
  };

  return Auth;
};

export default withAuth;
