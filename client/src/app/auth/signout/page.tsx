"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOut() {
  const router = useRouter();
  const signOutFnCall = () => {
    const requestOptions = {
      method: "GET",
    };

    return fetch("http://ticketing.com/api/users/sign-out", requestOptions);
  };

  useEffect(() => {
    signOutFnCall().then(() => router.push("/"));
  });
  return <h3>Signing you out...</h3>;
}
