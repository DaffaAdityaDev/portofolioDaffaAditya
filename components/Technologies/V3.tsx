import React from 'react'
import { Card, CardBody } from "@nextui-org/react"
import { 
  FaCode, 
  FaMobile, 
  FaServer, 
  FaCloud, 
  FaRobot, 
  FaLightbulb,
  FaReact,
  FaNodeJs,
  FaMobileAlt,
  FaPaintBrush,
  FaGitAlt
} from "react-icons/fa"

const TechnologyCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <Card 
    className="col-span-12 md:col-span-12 lg:col-span-4 bg-gray-900"
    radius="lg"
  >
    <CardBody className="flex flex-col items-center text-center p-6">
      <Icon className="w-12 h-12 mb-4 text-white" />
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </CardBody>
  </Card>
)

function Technologies() {
  const technologies = [
    {
      icon: FaCode,
      title: "Software Design & Architecture",
      description: "Developing efficient, scalable software architectures tailored to your business needs. With a focus on best practices and cutting-edge design patterns, I ensure that every solution is future-proof."
    },
    {
      icon: FaMobile,
      title: "Web & Mobile Development",
      description: "Creating high-performance, cross-platform applications using modern technologies like React, Vue, and Kotlin. Whether it's a responsive web app or a mobile solution, I deliver user-friendly and optimized experiences."
    },
    {
      icon: FaServer,
      title: "API Development & Integration",
      description: "Building robust, secure APIs that seamlessly connect different systems. I specialize in RESTful API development and third-party service integration to extend the functionality of your apps."
    },
    {
      icon: FaCloud,
      title: "Cloud Solutions & DevOps",
      description: "Utilizing cloud platforms and containerization tools like Docker, I ensure your application is scalable, reliable, and secure. With expertise in DevOps, I streamline the CI/CD process for efficient deployments."
    },
    {
      icon: FaRobot,
      title: "Automation & Optimization",
      description: "Creating automated workflows and performance optimizations to save time and resources, while enhancing the overall efficiency of your systems."
    },
    {
      icon: FaLightbulb,
      title: "Technical Research & Problem Solving",
      description: "Employing deep technical research and cutting-edge solutions to address ambiguous software challenges, fostering continuous growth and technical innovation."
    }
  ]

  const toolCategories = [
    {
      icon: FaReact,
      name: "Frontend",
      tools: ["React.JS", "Next.JS", "Vue.JS", "Laravel", "Astro", "Tailwind"]
    },
    {
      icon: FaNodeJs,
      name: "Backend",
      tools: ["Node.JS", "Express.JS", "PostgreSQL", "Linux", "Firebase", "MongoDB"]
    },
    {
      icon: FaMobileAlt,
      name: "Mobile",
      tools: ["Kotlin", "Room", "Retrofit", "Jetpack Compose", "React Native"]
    },
    {
      icon: FaPaintBrush,
      name: "UI/UX",
      tools: ["Photoshop", "Figma", "Web Vital", "Responsive Design", "Blender"]
    },
    {
      icon: FaGitAlt,
      name: "DevOps",
      tools: ["Github", "Git", "Docker", "Microservice"]
    }
  ];

  return (
    <div className="text-white py-16 bg-black min-h-screen w-screen max-w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 ">Software Engineer in</h1>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Jakarta</h2>
        <p className="text-lg sm:text-xl mb-12">
          I offer a range of top-quality software engineering services designed to help you
          optimize your systems and applications. From full-cycle development to
          deployment and support, I've got you covered.
        </p>

        <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8 mt-8">
          {technologies.slice(0, 3).map((tech, index) => (
            <TechnologyCard key={index} {...tech} />
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8 mt-8">
          {technologies.slice(3).map((tech, index) => (
            <TechnologyCard key={index + 3} {...tech} />
          ))}
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Tools Used</h2>
          <p className="text-lg sm:text-xl mb-8">
            I've worked with a range of technologies in software development, from
            front-end design to backend solutions and cloud infrastructure.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {toolCategories.map((category, index) => (
              <Card 
                key={index} 
                className="bg-gray-900"
                radius="lg"
              >
                <CardBody className="flex flex-col p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <category.icon className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold dark:text-white text-white">{category.name}</h3>
                  </div>
                  <ul className="list-none">
                    {category.tools.map((tool, toolIndex) => (
                      <li key={toolIndex} className="text-gray-400 mb-1 hover:text-white transition-colors duration-300">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Technologies
