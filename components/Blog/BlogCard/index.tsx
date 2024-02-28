import Link from "next/link";
import React, { useState, useEffect } from "react";
import Date from "../../Date";
import { IBlogProps } from "../../types";

function BlogCard({
  id,
  image,
  title,
  description,
  date,
  timeToRead,
}: IBlogProps) {
  const [rotation, setRotation] = useState(0);
  const timeToReadFormated = formatTimeToRead(timeToRead);

  function formatTimeToRead(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  }

  function handleMouseEnter() {
    setRotation(360);
  }

  function handleMouseLeave() {
    setRotation(0);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((rotation) => rotation + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href={`blog/post/${id}`}>
      <div className=" rounded-lg bg-neutral-900">
        <div className="relative flex justify-center">
          <div
            className="sm:text-md  absolute top-0 left-0 flex h-full w-full 
            items-center justify-center rounded-t-lg bg-gradient-to-r bg-clip-padding 
            text-2xl font-bold opacity-0 backdrop-blur-lg backdrop-filter transition-opacity duration-300 hover:opacity-100"
          >
            Read More
          </div>
          {/* <p className="absolute my-10 mx-4 rounded-full p-4 text-center text-3xl font-bold backdrop-blur-xl">
            {title}
          </p> */}
          <img
            className="h-full w-full rounded-t-lg"
            src={image}
            alt="profile"
          />
        </div>
        <div className="flex flex-col p-3">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p
            className="text-md my-2 h-[3em] overflow-hidden font-thin"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {description}
          </p>
          <div className="flex justify-between">
            <div>
              <Date dateString={date} />
              <p>{timeToReadFormated}</p>
            </div>

            <button
              className="group relative inline-flex h-12 overflow-hidden rounded-lg p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span
                className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#000000_70%,#ffffff_100%)]"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 1s",
                  animationFillMode: "forwards",
                }}
              />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl ">
                Read more
              </span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
