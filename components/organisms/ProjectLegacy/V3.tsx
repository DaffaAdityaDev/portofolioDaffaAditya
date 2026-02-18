import React, { useRef, useState } from 'react'
import Image from 'next/image'
import {Card, CardBody, CardFooter, Button, Tabs, Tab} from '@nextui-org/react'
import Personal from '@/data/Personal'

const projectTypes = ['Web', 'Mobile', 'UI/UX']

interface Project {
  id: number;
  image: string;
  video: string;
  title: string;
  description: string;
  link: string;
  github: string;
  tech: string[];
  type: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Card 
      isPressable
      className="bg-content1 dark:bg-content1"
      isHoverable
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardBody className="p-0 overflow-hidden">
        <div className="relative group h-60">
          {/* Static Image */}
          <img
            alt={project.title}
            className="object-cover w-full h-full"
            src={project.image}
          />
          {/* Hover Video - Absolute positioned */}
          <img
            className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            src={project.video}
            alt={`${project.title} animation`}
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-small text-default-500 mt-1">{project.tech.join(', ')}</p>
          <p className="text-default-700 mt-2">
            {project.description.split('.')[0]}.
          </p>
        </div>
      </CardBody>
      <CardFooter className="gap-4">
        <Button 
          as="a" 
          href={project.link}
          variant="flat" 
          color="primary"
          className="flex-1"
        >
          Visit Website
        </Button>
        <Button
          as="a"
          href={project.github}
          variant="bordered"
          className="flex-1"
        >
          Github
        </Button>
      </CardFooter>
    </Card>
  );
};

function Project() {
  return (
    <section className="bg-black py-16 w-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="space-y-4 mb-12">
          <h2 className="text-4xl font-bold">Selected Work</h2>
          <p className="text-xl text-default-500">
            A showcase of my software engineering projects, highlighting innovation, 
            efficiency, and technical expertise across various platforms.
          </p>
        </div>

        <Tabs 
          aria-label="Project categories"
          className="mb-8"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          {projectTypes.map((type) => (
            <Tab key={type} title={type}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {Personal
                  .filter(project => project.type.toLowerCase() === type.toLowerCase())
                  .slice(0, 6)
                  .map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                }
              </div>
            </Tab>
          ))}
        </Tabs>

        <div className="flex justify-center mt-12">
          <Button
            size="lg"
            variant="bordered"
            radius="full"
            className='text-white'
          >
            See More
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Project
