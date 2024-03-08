import React from 'react';
import { Fade } from 'react-awesome-reveal';

const index = ({ ExperienceData }: { ExperienceData: any }) => {
  return (
    <div className="mt-10 w-full">
      <div className="mb-2 mt-20 h-1 w-1/6 rounded-full bg-gradient-to-r from-blue-500 to-transparent"></div>
      <Fade triggerOnce>
        <h2 className="mb-5 text-3xl font-bold">Experience</h2>
      </Fade>
      {ExperienceData.map((data: any, index: number) => {
        const { title, company, time } = data;
        return (
          <>
            <Fade triggerOnce>
              <div className="group flex justify-between">
                <div>
                  <h3 className="group text-2xl font-bold">{title}</h3>
                  <p className="text-1xl font-semibold">{company}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* <div className='w-1 h-1 bg-green-500 rounded-full'></div> */}
                  <p
                    className="text-2xl font-semibold group-hover:bg-gradient-to-r 
              group-hover:from-sky-400  group-hover:to-violet-500 group-hover:bg-clip-text 
              group-hover:text-transparent"
                  >
                    {time}
                  </p>
                </div>
              </div>
              <div className="mb-2 mt-5 h-1 w-full rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-blue-500"></div>
            </Fade>
          </>
        );
      })}
    </div>
  );
};

export default index;
