import React from "react";
import Image from "next/image";
import githubSvg from "../../../public/svg/github.svg";
import weblinkSvg from "../../../public/svg/weblink.svg";
import { Fade } from "react-awesome-reveal";
function index({
  title,
  description,
  image,
  link,
  github,
  id,
  tech,
}: {
  title: string;
  description: string;
  image: string;
  link: string;
  github: string;
  id: number;
  tech: string[];
}) {
  return (
    <Fade triggerOnce>
      <div
        className="m-3 h-[600px] max-w-[30rem] rounded-lg bg-slate-800 px-10 py-10"
        key={id}
      >
        <div className="flex h-full flex-col flex-wrap justify-between">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="normal min-h-16 text-white opacity-80">
              {description}
            </p>
            <div className="mt-3 h-1 w-1/3 rounded-full bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>
          <div className="relative h-60 w-full overflow-hidden rounded-xl">
            <a href={link} target="_blank" rel="noreferrer">
              <div
                className="peer absolute z-10 flex h-full 
            w-full items-center justify-center text-lg font-bold text-transparent hover:bg-black hover:bg-opacity-60 hover:text-white"
              >
                Open Page
              </div>
              <img
                className="z-0 h-60 w-full rounded-xl object-scale-down duration-500 ease-in-out peer-hover:scale-150 peer-hover:blur-sm"
                src={image}
                alt="project"
                loading="lazy"
              />
            </a>
          </div>
          <div>
            <p className="text-center font-bold">Tech Stack</p>
            <div className="flex flex-row items-center justify-center justify-items-center">
              {tech.map((tech: any, index: number) => {
                return (
                  <p
                    className="mx-2 text-center font-medium text-gray-300"
                    key={index}
                  >
                    {tech}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="flex flex-row justify-center gap-10">
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="duration-300 ease-out hover:scale-125"
            >
              <div className="flex h-full flex-row content-center items-center justify-center">
                <Image src={weblinkSvg} alt="weblink" width={30} height={30} />
                <p className="pl-2">Page</p>
              </div>
            </a>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="duration-300 ease-out hover:scale-125"
            >
              <div className="flex h-full flex-row content-center items-center justify-center">
                <Image src={githubSvg} alt="github" width={30} height={30} />
                <p className="pl-2">Code</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Fade>
  );
}

export default index;
