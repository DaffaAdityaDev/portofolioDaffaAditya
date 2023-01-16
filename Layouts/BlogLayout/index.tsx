import React, { PropsWithChildren } from 'react'

const BlogLayout = (props: PropsWithChildren) => {
  return (
    <div className=''>
      <h1 className='font-bold text-3xl'>Blog</h1>
      {props.children}
    </div>
  )
}

export default BlogLayout