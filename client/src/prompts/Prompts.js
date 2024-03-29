import React, { useState, useEffect } from "react";
import auth from "./../auth/auth-helper";
import { Navigate, Link, useParams } from "react-router-dom";
import { list } from "./api-prompts";
import CreatePrompt from "./CreatePrompt";
import ListView from "../elements/ListView";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function Prompts() {
  const params = useParams();
  const [prompts, setPrompts] = useState([]);
  const [noPrompts, setNoPrompts] = useState(false);
  const [open, setOpen] = useState(false);
  const jwt = auth.isAuthenticated();
  dayjs.extend(relativeTime);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    // console.log(params);
    // list(
    //   {
    //     userId: params.userId,
    //   },
    //   { t: jwt.token },
    //   signal
    // ).then((data) => {
    //   // console.log(data);
    //   if (data && data.error) {
    //     console.log(data.error);
    //   } else {
    //     if (!data.length) setNoPrompts(true);
    //     data.map((prompt, i) => {
    //       prompt.created = `Created ${dayjs(prompt.created).fromNow(true)} ago`;
    //       prompt.linkPath = `/prompt/${params.userId}/prompt/${prompt._id}`;
    //     });
    //     setPrompts(data);
    //   }
    // });
    return function cleanup() {
      abortController.abort();
    };
  }, [params.userId]);

  const onPromptCreated = () => {
    // list(
    //   {
    //     userId: params.userId,
    //   },
    //   { t: jwt.token },
    //   undefined
    // ).then((data) => {
    //   // console.log(data);
    //   if (data && data.error) {
    //     console.log(data.error);
    //   } else {
    //     if (!data.length) setNoPrompts(true);
    //     else setNoPrompts(false);
    //     data.map((prompt, i) => {
    //       prompt.created = `Created ${dayjs(prompt.created).fromNow(true)} ago`;
    //       prompt.linkPath = `/prompt/${params.userId}/prompt/${prompt._id}`;
    //     });
    //     setPrompts(data);
    //   }
    // });
  };
  return (
    <>
      <div className="flex mb-6 justify-between items-center">
        <h2 className="text-center text-2xl  leading-9 tracking-tight text-gray-900 dark:text-white">
          Prompts
        </h2>
        <button
          type="button"
          className="basis-30 flex gap-2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setOpen(true)}
          //   ref={cancelButtonRef}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#fff"
            className="w-5 h-5"
          >
            <path d="M2 4.25A2.25 2.25 0 014.25 2h2.5A2.25 2.25 0 019 4.25v2.5A2.25 2.25 0 016.75 9h-2.5A2.25 2.25 0 012 6.75v-2.5zM2 13.25A2.25 2.25 0 014.25 11h2.5A2.25 2.25 0 019 13.25v2.5A2.25 2.25 0 016.75 18h-2.5A2.25 2.25 0 012 15.75v-2.5zM11 4.25A2.25 2.25 0 0113.25 2h2.5A2.25 2.25 0 0118 4.25v2.5A2.25 2.25 0 0115.75 9h-2.5A2.25 2.25 0 0111 6.75v-2.5zM15.25 11.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" />
          </svg>
          New
        </button>
      </div>
      <CreatePrompt
        className="mb-10"
        params={params}
        credentials={{ t: jwt.token }}
        cb={onPromptCreated}
        open={open}
        setOpen={setOpen}
      />
      <ListView
        data={prompts}
        noData={noPrompts}
        contentKeys={["text", "model", "created"]}
        linkKey="linkPath"
      />
    </>
  );
}
