import Link from 'next/link'
import React from 'react'
import Date from '../../Date'

function BlogCard({
    id,
    image,
    title,
    description,
    date,
    timeToRead,
} : IBlogProps)  {
    const timeToReadFormated = formatTimeToRead(timeToRead);

    function formatTimeToRead(minutes: number): string {
        if (minutes >=  60) {
            const hours = Math.floor(minutes /  60);
            return `${hours} hour${hours >  1 ? 's' : ''}`;
        } else {
            return `${minutes} minute${minutes >  1 ? 's' : ''}`;
        }
    }
  return (
    <Link href={`blog/post/${id}`}>
        <div className='w'>
            <img className='w-full h-full' src={image} alt="profile" />
        </div>
        <div className='flex flex-col'>
            <h1 className='text-2xl font-bold line-clamp-2 h-[3em]'>{title}</h1>
            <p className='text-md font-thin my-2 line-clamp-2 h-[3em]'>{description}</p>  
            <div className='flex justify-between'>
                <div>
                    <p>{timeToReadFormated}</p>
                    <Date dateString={date} />
                </div>
                <button className='w-fit self-end border-2 border-sky-500 p-2 rounded-lg hover:bg-sky-700'>
                    Read more
                </button>
            </div>
        </div>
    </Link>
  )
}

export default BlogCard