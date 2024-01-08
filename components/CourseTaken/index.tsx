import React from "react";
import Course from "../../data/Course";
import Arrow from "../../public/svg/arrow.svg";
import Image from "next/image";

function CourseTaken() {
  return (
    <div className="mt-20 flex w-full flex-wrap justify-between">
      <div className="mb-6 ml-1">
        <h2
          className="bg-gradient-to-r from-red-500 to-violet-500 
            bg-clip-text text-6xl font-bold uppercase text-transparent"
        >
          Course
        </h2>
        <h2 className="text-6xl uppercase">Taken</h2>
      </div>
      <div className="w-1/2 sm:w-full">
        {Course.map((data, index) => {
          return (
            <div key={index.toString()}>
              <a href={data.source} target="_blank" rel="noreferrer">
                <div className="group flex w-full items-center justify-between text-lg">
                  <div>
                    <h2 className="font-bold">{data.course}</h2>
                    <div className="flex">
                      <p className="mr-1 duration-100 ease-in group-hover:translate-x-6">
                        {data.organization}
                      </p>
                      <Image
                        src={Arrow}
                        alt="arrow"
                        width={20}
                        height={20}
                        className="duration-100 ease-in group-hover:translate-x-6"
                      />
                    </div>
                  </div>
                  <p className="font-semibold">{data.year}</p>
                </div>
              </a>
              <div className="mt-5 mb-2 h-1 w-full rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-blue-500"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CourseTaken;
