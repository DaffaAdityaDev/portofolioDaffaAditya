import React, { useState, useRef, Ref } from "react";
import emailjs from "@emailjs/browser";
import { eventNames } from "process";
import spiner from "../../public/svg/spinner.svg";
import spinerOneThird from "../../public/svg/spinner-one-third.svg";
import confirm from "../../public/svg/confirm.svg";
import alert from "../../public/svg/alert.svg";
import emailsvg from "../../public/svg/email.svg";
import Image from "next/image";

function PopUpForm({
  popUpHandler,
  popUp,
  setPopUp,
}: {
  popUpHandler: () => void;
  popUp: boolean;
  setPopUp: (arg0: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useRef<any>(null);

  // console.log(form.current.name.value)

  function handleForm(event: any) {
    setLoading(false);
    setError(false);
    setSuccess(false);
    //send email directly to gmail
    event.preventDefault();
    setLoading(true);
    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_SERVICE_ID as string,
        "template_mgesihk",
        form.current,
        process.env.NEXT_PUBLIC_PUBLIC_KEY,
      )
      .then(
        (result) => {
          setSuccess(true);
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          setError(true);
        },
      );

    event.target.reset();
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-20 h-full w-full
        text-white backdrop-blur-sm"
    >
      <div
        className="absolute top-1/2 left-1/2 w-1/2 min-w-[35rem] max-w-[50rem] -translate-y-1/2
        -translate-x-1/2 rounded-lg md:min-w-[25rem]"
      >
        <div className="h-full w-full rounded-lg bg-gradient-to-tr from-sky-500 via-violet-500 to-blue-500 p-1">
          <div className="h-full w-full rounded-lg bg-slate-800 py-10 px-10">
            <h1 className="pb-5 text-center text-3xl font-bold">Contact</h1>
            <p className="pb-5 text-center text-2xl">
              Feel free to get in touch and talk more about your projects.
            </p>
            <div>
              <form
                className="mb-4 flex flex-col"
                ref={form}
                onSubmit={(event) => handleForm(event)}
              >
                <label htmlFor="name" className="pb-1 text-lg font-bold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="rounded-lg border-2 
                  border-solid border-sky-500 p-2 text-black"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="email" className="pb-1 text-lg font-bold ">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="rounded-lg border-2 
                  border-solid border-sky-500 p-2 text-black"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="message" className="pb-1 text-lg font-bold">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  cols={30}
                  rows={10}
                  className="rounded-lg border-2 
                  border-solid border-sky-500 p-2 text-black"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {loading ? (
                  <button
                    className="disabled mt-8 animate-pulse cursor-wait rounded-lg border-2
                    border-solid border-sky-500 p-3"
                    type="submit"
                    disabled
                  >
                    Send
                  </button>
                ) : (
                  <button
                    className="mt-8 rounded-lg border-2 
                    border-solid border-sky-500 p-3"
                    type="submit"
                  >
                    Send
                  </button>
                )}
              </form>
              <div className="h-15 flex w-full justify-center">
                {error && (
                  <div className="flex items-center">
                    <Image
                      src={alert}
                      width={30}
                      height={30}
                      alt="svg"
                      className="animate-pulse"
                    />
                    <p className="ml-1 text-center">Failed Send</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-center">
                    <Image
                      src={confirm}
                      width={30}
                      height={30}
                      alt="svg"
                      className=""
                    />
                    <p className="ml-1 text-center">Sent</p>
                  </div>
                )}

                {loading && (
                  <div className="flex items-center">
                    <Image
                      src={spinerOneThird}
                      width={50}
                      height={50}
                      alt="svg"
                      className="animate-spin"
                    />
                    <p className="ml-1 text-center">Sending Message</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-full items-center rounded-lg rounded-br-lg p-2 duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-sky-900/50">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=daffaaditya.me@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center"
                >
                  <div className="h-10 w-10">
                    <Image
                      src={emailsvg}
                      alt="github"
                      width={50}
                      height={50}
                      className="saturate-750 hue-rotate-137 brightness-101 contrast-105 h-10 w-10 invert sepia-0"
                    />
                  </div>
                  <p className="pl-1 text-2xl">Email</p>
                </a>
              </div>
              <div className="flex w-full items-center justify-end">
                <button
                  className="w-32 rounded-lg border-2 border-solid border-sky-500
                  py-3 text-center"
                  onClick={popUpHandler}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopUpForm;
