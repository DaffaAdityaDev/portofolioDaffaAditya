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
            <div className='flex flex-col p-3'>
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
                    
                    <button className="relative group inline-flex h-12 overflow-hidden rounded-lg p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                        <span className="absolute inset-[-1000%] group-hover:animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0891b2_0%,#393BB2_50%,#e11d48_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl ">
                        Read more
                        </span>
                    </button>
                    
                </div>
            </div>
        </div>
    </Link>
  )
}


export default BlogCard

