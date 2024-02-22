import Link from 'next/link'
import React from 'react'

function BlogCard({
    id,
}) {
  return (
    <div>
        <div className='w'>
            <img className='w-full h-full' src="https://networkertheme.com/networker/wp-content/uploads/sites/2/demo-image-00001-1920x1024.jpg" alt="profile" />
        </div>
        <div>
            <h1 className='text-2xl font-bold'>Blog Title</h1>
            <p className='text-md font-thin'>Blog Description</p>
            <p>Published Date</p>
            <p>Time to read</p>
            <button>
                <Link href={`blog/post/${id}`}>Read more</Link>
            </button>
        </div>
    </div>
  )
}

export default BlogCard