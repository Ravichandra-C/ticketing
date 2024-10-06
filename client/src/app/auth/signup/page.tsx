"use client";
import { signup } from "@/app/actions/auth";
import { EventHandler, FormEvent, MouseEvent } from "react";
import { useFormState } from "react-dom";
import { IoMdClose } from "react-icons/io";

export default function Signup() {
  const [state, action] = useFormState(signup, undefined);

  console.log({ state, action });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    console.log({ valid: form.checkValidity() });

    if (form.checkValidity() === false) {
      form.classList.add("validated");
    }

    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(form);
    action(formData);
  }

  function handleErrorClose(event: MouseEvent<HTMLDivElement>) {
    event.currentTarget.parentElement?.classList.add("hidden");
    event.stopPropagation();
    event.preventDefault();
  }
  return (
    <div className="flex-1">
      <div className="bg-blue h-full flex-1 flex">
        <div className="basis-2/3"></div>
        <div className=" basis-1/3 flex-1 flex justify-center items-center w-full">
          <div className="w-8/12 rounded-md p-5 m-auto">
            <h3 className="text-center text-3xl py-5">Signup</h3>
            {state?.email && (
              <p className="text-green-400">
                {" "}
                Signup successfull. please <a href="/signin"> signin</a> now
              </p>
            )}
            <form className="w-full flex flex-col" onSubmit={handleSubmit}>
              <div className="my-2 mx-4">
                <label
                  className="p-2 after:content-['*'] after:text-red-600"
                  htmlFor="username"
                >
                  Username{" "}
                </label>
                <input
                  className="p-2 w-full rounded-lg border bg-inherit border-slate-600 focus:outline-none required:invalid:border-slate-600 invalid:border-red-500 focus:ring-2"
                  type="email"
                  tabIndex={1}
                  id="username"
                  name="username"
                  placeholder="Enter Username"
                />
              </div>
              <div className="my-2 mx-4">
                <label
                  className="p-2 after:content-['*'] after:text-red-600"
                  htmlFor="password"
                >
                  Password{" "}
                </label>
                <input
                  className="p-2 w-full rounded-lg border-1 bg-inherit border focus:outline-none required:border-slate-600"
                  name="password"
                  id="password"
                  type="password"
                  minLength={4}
                  maxLength={25}
                  tabIndex={2}
                  placeholder="Enter Password"
                />
              </div>

              <div className="my-2 mx-4 flex justify-between">
                <button
                  type="reset"
                  className="basis-1/3 px-3 py-2 border-2 rounded-md hover:bg-slate-500  "
                  tabIndex={3}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  tabIndex={4}
                  className="basis-1/3 px-2 border-2 rounded-md hover:bg-slate-500  "
                >
                  Sign-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="w-full fixed bottom-2 left-0 flex flex-col justify-center items-center">
        {state?.messages &&
          state?.messages.map((message: { message: string }, index: number) => (
            <p
              key={index}
              className="rounded-sm w-fit p-2 bg-red-500 flex items-center"
            >
              {message.message}
              <div
                className="ml-2 hover:bg-red-950 cursor-pointer"
                onClick={handleErrorClose}
              >
                <IoMdClose />
              </div>
            </p>
          ))}
      </div>
    </div>
  );
}
