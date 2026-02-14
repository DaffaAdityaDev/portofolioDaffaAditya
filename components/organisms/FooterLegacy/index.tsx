import React from 'react';
import { Link } from '@nextui-org/react';

function Footer() {
  return (
    <footer className="flex w-full flex-col pb-5 text-center antialiased text-default-900">
      <p>
        Designed and Developed by Daffa Aditya Rahman
      </p>
      <p>
        Build With
        <Link 
          href="#" 
          className="mx-1 dark:text-cyan-500 text-cyan-400 cursor-default"
          underline="none"
        >
          Next.JS
        </Link>
        &
        <Link 
          href="#" 
          className="mx-1 dark:text-sky-500 text-sky-400 cursor-default"
          underline="none"
        >
          NextUI.
        </Link>
        Hosted on
        <Link 
          href="#" 
          className="mx-1 dark:text-emerald-500 text-emerald-400 cursor-default"
          underline="none"
        >
          Vercel
        </Link>
      </p>
    </footer>
  );
}

export default Footer;
