"use client";
import { signin } from "@/app/actions/auth";
import { FormEvent } from "react";
import { useFormState } from "react-dom";

export default function Signin() {
  const [state, action] = useFormState(signin, null);

  return (
    <div className="flex-1">
      <div className="bg-blue h-full flex-1 flex">
        <div className="basis-2/3"></div>
        <div className=" basis-1/3 flex-1 flex justify-center items-center w-full">
          <div className="w-8/12 rounded-md p-5 m-auto">
            <h3 className="text-center text-3xl py-5">Signin</h3>
            <form className="w-full flex flex-col" action={action}>
              <div className="my-2 mx-4">
                <label className="p-2" htmlFor="username">
                  Username :{" "}
                </label>
                <input
                  className="p-2 rounded-lg bg-inherit border-1 invalid:border-red-500"
                  type="email"
                  required
                  name="username"
                  placeholder="Enter Username"
                />
              </div>
              <div className="my-2 mx-4">
                <label className="p-2" htmlFor="password">
                  Password :{" "}
                </label>
                <input
                  className="p-2 rounded-lg border-1 bg-inherit invalid:border-red-500 in-range:border-green-300 "
                  name="password"
                  type="password"
                  minLength={4}
                  maxLength={25}
                  placeholder="Enter Password"
                />
              </div>
              <div className="my-2 mx-8 flex justify-between">
                <button
                  type="reset"
                  className="basis-1/3 px-3 py-2 border-2 rounded-md hover:bg-slate-500  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="basis-1/3 px-2 border-2 rounded-md hover:bg-slate-500  "
                >
                  Sign-in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
