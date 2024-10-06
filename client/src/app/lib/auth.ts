import axios from "axios";
import { cookies } from "next/headers";
import { json } from "stream/consumers";

export async function getCurrentUserInMiddleware(cookie: string) {
  const myHeaders = new Headers();
  myHeaders.set("Cookie", "session=" + cookie);
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "http://ticketing.com/api/users/current-user",
      requestOptions
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  const value = cookies().get("session")?.value;
  console.log({ value, cook: cookies().toString() });

  if (!value) {
    return { currentUser: null };
  }
  const myHeaders = new Headers();
  myHeaders.set("Cookie", "session=" + value);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Host", "ticketing.com");
  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current-user",
    headers: {
      Cookie: "session=" + value,
      Host: "ticketing.com",
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request(config);
    console.log({ status: response.status });
    const result = response.data;
    return result;
  } catch (error) {
    console.log({ error });
    return { currentUser: null };
  }
}
