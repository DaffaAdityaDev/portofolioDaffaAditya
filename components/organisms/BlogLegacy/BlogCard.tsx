import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Button, Image } from '@nextui-org/react';
import { useRouter } from 'next/router';
import Date from '@/components/atoms/Date';
import { IBlogProps } from '@/components/atoms/types';
import Link from 'next/link';
import PageTransition from '@/components/molecules/PageTransition';
import { useAnimation } from '@/contexts/AnimationContext';

function BlogCard({
  id,
  image,
  title,
  description,
  date,
  timeToRead,

}: IBlogProps) {
  const [isMounted, setIsMounted] = useState(false);
  

  function formatTimeToRead(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);
  

  return (
   <>
      <div 
        className="bg-default-100 h-full"
      >
      <div className="relative group">
        <Image
          removeWrapper
          alt={title}
          className="z-0 w-full h-full object-cover rounded-t-xl"
          src={image}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl">
          <span className="text-2xl font-bold sm:text-md text-white">Read More</span>
        </div>
      </div>
      
      <div className="p-3">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex flex-col justify-between h-full">
          <p
            className="text-md my-2 h-[3em] overflow-hidden font-thin text-foreground/80"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {description}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="text-foreground/80">
              <Date dateString={date} />
              <p>{formatTimeToRead(timeToRead)}</p>
            </div>

            {isMounted && (
              <div
                className="group relative inline-flex h-12 overflow-hidden rounded-lg p-[2px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
                role="button"
                aria-label="Read more about this post"
              >
                <div
                  className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#000000_70%,#ffffff_100%)] group-hover:animate-[spin_2s_linear_infinite]"
                  aria-hidden="true"
                />
                <span className="relative z-10 inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-default-100 px-3 py-1 text-sm font-medium text-foreground backdrop-blur-3xl">
                  Read more
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default BlogCard;