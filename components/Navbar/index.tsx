import type { NextPage } from 'next'
import Link from 'next/link'

const Navbar: NextPage = () => {
  return (
    <div className='p-4 pb-6'>
      <ul className="flex justify-end gap-x-5">
        <li className=''>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        {/* <li>
          <Link href="/blog">
            <a>Blog</a>
          </Link>
        </li> */}
        <li>
          <Link href="/blog/hello-world">
            <a>QnA</a>
          </Link>
        </li>
        <li>
            <a href="https://drive.google.com/file/d/1hXrrN-IEVPQ4P0I5UjXNXMtmr1zBKo5G/view?usp=sharing"
            className='bg-sky-500/10 rounded-md text-sky-400 border-solid border-2 p-2'>Resume</a>
        </li>
      </ul>
    </div>
  )
}

export default Navbar