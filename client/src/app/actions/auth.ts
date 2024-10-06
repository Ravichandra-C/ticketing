"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
export async function signup(state: any, formdata: FormData) {
  const username = formdata.get("username");
  const password = formdata.get("password");

  console.log({ username, password });

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Host", "ticketing.com");
  const raw = JSON.stringify({
    email: username,
    password: password,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/signup",
    headers: {
      "Content-Type": "application/json",
      Host: "ticketing.com",
    },
    data: raw,
  };

  try {
    const response = await axios.request(config);

    console.log({ status: response.status, text: response.data });

    return response.data;
  } catch (err) {
    console.log({ err });

    return err;
  }
}

export async function signin(state: any, formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const redirectPath = "/";
  console.log({ username, password });

  const raw = JSON.stringify({
    email: username,
    password: password,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/sign-in",
    headers: {
      "Content-Type": "application/json",
      Host: "ticketing.com",
    },
    data: raw,
  };

  try {
    const response = await axios.request(config);

    console.log({ status: response.status, text: response.data });

    const cookie = response.headers["set-cookie"];
    console.log({ cookie });
    if (cookie && cookie?.length > 0) {
      const cookieValue = cookie[0].match(/^session=(.+);/);
      if (cookieValue && cookieValue?.length > 0) {
        console.log({ cookieValue });

        cookies().set("session", cookieValue[1]);
      }
      console.log({ data: response.data });
    } else {
      console.log("No Cookies found");
    }
  } catch (err) {
    console.log({ err });
  } finally {
    redirect(redirectPath);
  }
}
