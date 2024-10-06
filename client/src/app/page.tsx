import Image from "next/image";
import { FormEvent } from "react";
import { getCurrentUser } from "./lib/auth";

export default async function Home() {
  const result = await getCurrentUser();

  if (result.currentUser) {
    return <h1>Welcome {result.currentUser.email}</h1>;
  } else {
    return <h1>Welcome</h1>;
  }
}
