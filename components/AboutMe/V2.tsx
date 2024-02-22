import React from "react";
import Image from "next/image";
import Github from "/public/svg/github.svg";
import Linkedin from "/public/svg/linkedin.svg";

function AboutMe() {
  return (
    <div className="mt-20 flex w-full flex-col items-center justify-center">
      <div className="mx-auto mx-6 flex w-full flex-col items-center justify-center">
        <h2 className="mb-2 text-4xl font-bold">Hi, Daffa Aditya Rahman</h2>
        <p className="mb-4 text-xl">Software Developer | Web Enthusiast</p>
        <p className="text-md">
          I build pixel-perfect design, costume Tooling and Efficient Code
        </p>
        <div className=" mx-auto mt-10 max-w-prose text-justify text-lg leading-relaxed">
          {/* <h1 className="pr-3 text-2xl font-bold">
            Enginner who have passion on Technology
          </h1> */}
          <p className="text-1xl pb-5 font-normal">
            Hey there! I&apos;m
            <span className="font-bold text-blue-400">
              <a
                href="https://www.linkedin.com/in/daffaadityarahman-14b588192/"
                rel="noreferrer"
                target="_blank"
              >
                {" "}
                Daffa Aditya Rahman
              </a>
            </span>
            , Back in 2019, I started my journey as a programmer. Before I start
            my college, I&apos;ve been learning about programming at home by
            myself. and my friend recommended me to join a
            <span className="font-bold text-amber-500">
              <a
                href="https://pll.harvard.edu/course/cs50-introduction-computer-science"
                rel="noreferrer"
                target="_blank"
              >
                {" "}
                Harvard CS50 Introduction to Computer Science.{" "}
              </a>
            </span>
            Fast-forward to today, and I’ve had finished many projects and
            kampus merdeka program, Like a
            <span className="font-bold text-red-500">
              <a
                href="https://grow.google/intl/id_id/bangkit/?tab=mobile-development"
                rel="noreferrer"
                target="_blank"
              >
                {" "}
                Bangkit Academy 2023{" "}
              </a>
            </span>
            {/* as Mobile Development Cohort. Also, I've had the privilege of
            building software for an */}
            <span className="font-bold text-teal-400 ">
              <a
                href="https://ombudsman.go.id/"
                rel="noreferrer"
                target="_blank"
              >
                {" "}
                Government
              </a>
            </span>
            , and a
            <span className="font-bold text-green-400">
              <a
                href="https://www.dicoding.com/certificates/JMZV91O1RPN9"
                rel="noreferrer"
                target="_blank"
              >
                {" "}
                IT Consultant Company
              </a>
            </span>
          </p>
          <div className=" flex-1 md:ml-0">
            <p className="text-1xl pb-5 font-normal">
              My main focus these days is exploring the world of web development
              and mobile development. In my free time, I like to learn about new
              technology, reading about programming and doing experiment with my
              code.
            </p>

            <div>
              <p className="text-1xl pb-5 font-normal">
                Let&apos;s connect and collaborate together
              </p>
              <div className="flex flex-row">
                <a
                  href="https://github.com/DaffaAdityaDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-2 flex flex-row items-center gap-2 font-bold"
                >
                  <Image src={Github} alt="Github" width={30} height={30} />
                  Github
                </a>
                <a
                  href="https://www.linkedin.com/in/daffaadityarahman-14b588192/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-2 flex flex-row items-center gap-2 font-bold"
                >
                  <Image
                    src={Linkedin}
                    alt="Linkedin"
                    width={30}
                    height={30}
                    className="bg-white"
                  />
                  Linkedin
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-fit"></div>
    </div>
  );
}

export default AboutMe;
