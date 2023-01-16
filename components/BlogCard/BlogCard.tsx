import React from 'react'
import Link from 'next/link'

const BlogCard = ({title, datePublished, slug, timeRead, description}: any) => {
  return (
    <Link href={'/blog/' + slug}>
      <div className='flex mt-5 cursor-pointer hover:border border-inherit'>
        <div className='pr-8'>
          <p>{datePublished}</p>
          <p>{timeRead}</p>
        </div>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
          {/* <p className='mt-4'>Read more -></p> */}
        </div>
      </div>
    </Link>
  )
}

export default BlogCard