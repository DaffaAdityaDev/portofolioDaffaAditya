'use client';

import React from 'react'
import { Button, Link } from "@nextui-org/react";
import ContactButton from '@/components/ui/ContactButton';

function Index() {
  return (
    <div className="h-screen min-h-[500px] text-foreground">
      <div className="h-screen mx-auto max-w-7xl px-6 py-12 ">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full short:mt-20">
          {/* Left column - Text content */}
          <div className="lg:col-span-7 flex flex-col gap-4 text-center lg:text-left">
            <p className="text-xl sm:text-2xl lg:text-3xl text-default-500">
              Hello my name is,
            </p>
            
            <div className="space-y-2">
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Daffa Aditya Rahman
              </p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                I'm a Software Engineer
              </p>
            </div>
            
            <p className="text-sm sm:text-base lg:text-lg text-default-500 max-w-[600px] mx-auto lg:mx-0">
              With a passion for creating functional, user-centric web solutions, I bring together 
              technical expertise, creativity, and practical experience to deliver impactful projects. 
              Whether it's building sleek, responsive websites or architecting robust back-end systems, 
              I ensure that every project aligns with the highest standards of innovation and efficiency.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 flex-wrap">
              <ContactButton />
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square max-w-[500px] mx-auto hidden md:hidden lg:block">
              <img
                src="/svg/selflogo.svg"
                alt="Profile logo"
                className="w-full h-full object-contain z-0"
              />
              {/* Decorative background */}
              <div 
                className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
