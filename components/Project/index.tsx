import React, { useState } from "react";
import Card from "./Card";
import { Fade } from "react-awesome-reveal";
const Project = ({ data }: { data: any }) => {
  const [selectedProjectType, setSelectedProjectType] = useState("web");

  function setProjectType(type: string) {
    setSelectedProjectType(type);
  }

  return (
    <div className="pt-20">
      <Fade triggerOnce>
        <div className="mb-2 h-1 w-1/6 rounded-full bg-gradient-to-r from-blue-500 to-transparent"></div>
        <h2 className="text-4xl font-bold">Project</h2>
        <p className="pb-4 text-2xl opacity-80">Side project</p>
        <div className="flex w-full justify-center gap-4">
          {selectedProjectType === "web" ? (
            <>
              <button
                className="w-26 h-9 rounded-full bg-blue-700 px-6"
                onClick={(e) => setProjectType("web")}
              >
                Web
              </button>
              <button
                className="w-26 h-9 rounded-full bg-blue-500 px-6"
                onClick={(e) => setProjectType("mobile")}
              >
                Mobile
              </button>
            </>
          ) : (
            <>
              <button
                className="w-26 h-9 rounded-full bg-blue-500 px-6"
                onClick={(e) => setProjectType("web")}
              >
                Web
              </button>
              <button
                className="w-26 h-9 rounded-full bg-blue-700 px-6"
                onClick={(e) => setProjectType("mobile")}
              >
                Mobile
              </button>
            </>
          )}
        </div>
      </Fade>
      <div className="flex w-full flex-wrap justify-center">
        {data.map((data: any, index: number) => {
          const { title, description, image, link, github, id, tech, type } =
            data;
          if (type === selectedProjectType) {
            return (
              <Card
                title={title}
                description={description}
                image={image}
                link={link}
                github={github}
                id={id}
                tech={tech}
                key={index}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default Project;
