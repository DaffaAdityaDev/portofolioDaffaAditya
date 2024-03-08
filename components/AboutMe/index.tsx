import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';

const AboutMe: NextPage = () => {
  return (
    <div className="flex flex-wrap rounded-lg border-2 border-sky-700 bg-sky-700 bg-opacity-20 p-5 md:flex-col ">
      <div className="flex-1 ">
        <h2 className="text-4xl font-bold">About Me</h2>
        <h1 className="pr-3 text-2xl font-bold">
          Enginner who have passion on Technology
        </h1>
        <p className="text-1xl pb-5 font-normal">
          Hey there! I&apos;m
          <span className="font-bold text-blue-400">
            <a
              href="https://www.linkedin.com/in/daffaadityarahman-14b588192/"
              rel="noreferrer"
              target="_blank"
            >
              {' '}
              Daffa Aditya Rahman
            </a>
          </span>
          , a third-year Software Engineering student with a strong passion for
          technology and programming. I&apos;m constantly driven to expand my
          knowledge and stay ahead in this rapidly evolving field. Currently, my
          primary areas of focus are
          <span className="font-bold text-teal-400">
            <a
              href="https://www.dicoding.com/certificates/JMZV91O1RPN9"
              rel="noreferrer"
              target="_blank"
            >
              {' '}
              mobile app development{' '}
            </a>
          </span>
          and
          <span className="font-bold text-green-400">
            <a
              href="https://www.freecodecamp.org/certification/fcc69fbe3fe-5900-4d24-b19e-a24be1c50320/front-end-development-libraries"
              rel="noreferrer"
              target="_blank"
            >
              {' '}
              web development.
            </a>
          </span>{' '}
          I&apos;m enthusiastic about honing my skills in these areas and
          staying up to date with the latest advancements.
        </p>
      </div>
      <div className="ml-3 flex-1 md:ml-0">
        <h1 className="text-2xl font-bold">My Journey</h1>
        <p className="text-1xl pb-5 font-normal">
          I started my journey as a programmer when i Graduated From Vocational
          High School, When My best friend recommended me to join a
          <span className="font-bold text-amber-500">
            <a
              href="https://pll.harvard.edu/course/cs50-introduction-computer-science"
              rel="noreferrer"
              target="_blank"
            >
              {' '}
              Harvard CS50{' '}
            </a>
          </span>
          Introduction to Computer Science. Intrigued by programming, I decided
          to pursue a Software Engineering major at the
          <span className="font-bold text-blue-400">
            <a
              href="https://pddikti.kemdikbud.go.id/data_pt/MUE4NEE5QUQtNzVGOS00NENELUJFQkEtNUE1RDIzQzdGNjEz"
              rel="noreferrer"
              target="_blank"
            >
              {' '}
              Bina Sarana Informatika University.{' '}
            </a>
          </span>
          Alongside my studies, I also explored mobile app development and web
          development. Recently, I was accepted into the prestigious
          <span className="font-bold text-red-500">
            <a
              href="https://grow.google/intl/id_id/bangkit/?tab=mobile-development"
              rel="noreferrer"
              target="_blank"
            >
              {' '}
              Bangkit Academy 2023{' '}
            </a>
          </span>
          as Mobile Development cohort, where I continue to learn and stay up to
          date with the latest technology.
        </p>
        <p className="text-1xl pb-5 font-normal">
          Let&apos;s connect and collaborate together
        </p>
      </div>
    </div>
  );
};

export default AboutMe;
