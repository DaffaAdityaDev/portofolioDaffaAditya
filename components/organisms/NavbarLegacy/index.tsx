import type { NextPage } from 'next';
import Link from 'next/link';

const Navbar: NextPage = () => {
  return (
    <div className="border-2 border-slate-900 border-b-sky-600 bg-slate-900 p-4 pb-6 ">
      <ul className="flex justify-end gap-x-5">
        <li className="">
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/blog">Blog</Link>
        </li>
        <li>
          <Link href="/tutorial">Tutorial</Link>
        </li>
        <li className="cursor-pointer">QnA</li>
        <li>
          <a
            href="https://drive.google.com/file/d/16bp1lgGaVHe670IO1bR7khk01h6GaXdC/view?usp=share_link"
            className="rounded-md border-2 border-solid bg-sky-500/10 p-2 text-sky-400"
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
