import Link from 'next/link'
import React from 'react'
import Date from '../../Date'
import { IBlogProps } from '../../types';

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
        <div className=' bg-neutral-900 rounded-lg'>
            <div className='relative'>
                <div className='absolute  top-0 left-0 w-full h-full rounded-t-lg bg-gradient-to-r 
                    bg-clip-padding backdrop-filter backdrop-blur-lg opacity-0 hover:opacity-100 
                    transition-opacity duration-300 flex justify-center items-center text-2xl sm:text-md font-bold'>
                        Read More
                    </div>
                <img className='w-full h-full rounded-t-lg' src={image} alt="profile" />
            </div>
            <div className='flex flex-col p-2'>
                <p className='text-2xl font-bold my-2 overflow-hidden h-[1.6em]' style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp:  1
                }}>{title}</p> 
                <p className='text-md font-thin my-2 overflow-hidden h-[3em]' style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp:  2
                }}>{description}</p> 
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
        </div>
    </Link>
  )
}

export default BlogCard