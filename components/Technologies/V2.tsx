import React from "react";

function Technologies() {
  return (
    <div className="relative mt-32 h-[800px]">
      <div className="relative left-0 top-32 z-10">
        <h2 className="w-full text-center text-5xl font-bold ">Technologies</h2>
        <p className="z-10 w-full text-center text-2xl ">
          {/* I'm a Full Stack Developer */}
        </p>
      </div>
      <div className="-mt-20 flex h-full items-center justify-center gap-4">
        <div className="relative z-10 w-60 rounded-lg bg-white/10 bg-opacity-50 p-5 backdrop-blur-xl">
          <h2 className="mb-10 text-2xl font-bold">Framework</h2>
          <ul>
            <li>React</li>
            <li>Next</li>
            <li>Vue</li>
            <li>Laravel</li>
            <li>Tailwind</li>
          </ul>
          <p className="mt-20 text-end text-xl text-white">1</p>
        </div>
        <div className="relative z-10 w-60 rounded-lg bg-white/10 bg-opacity-50 p-5 backdrop-blur-xl">
          <h2 className="mb-10 text-2xl font-bold">Backend</h2>
          <ul>
            <li>Express.js</li>
            <li>Node.js</li>
            <li>Linux</li>
            <li>Firebase</li>
            <li>Postgresql</li>
          </ul>
          <p className="mt-20 text-end text-xl text-white">2</p>
        </div>
        <div className="relative z-10 w-60 rounded-lg bg-white/10 bg-opacity-50 p-5 backdrop-blur-xl">
          <h2 className="mb-10 text-2xl font-bold">Mobile</h2>
          <ul>
            <li>Intent and Fragment</li>
            <li>Kotlin</li>
            <li>Room</li>
            <li>Retrofit</li>
            <li>Jetpack Compose</li>
          </ul>
          <p className="mt-20 text-end text-xl text-white">3</p>
        </div>
        <div className="relative z-10 w-60 rounded-lg bg-white/10 bg-opacity-50 p-5 backdrop-blur-xl">
          <h2 className="mb-10 text-2xl font-bold">UI/UX</h2>
          <ul>
            <li>Photoshop</li>
            <li>Next</li>
            <li>Web Vital</li>
            <li>Responsive Design</li>
            <li>Mobile First</li>
          </ul>
          <p className="mt-20 text-end text-xl text-white">4</p>
        </div>
        <div className="relative z-10 w-60 rounded-lg bg-white/10 bg-opacity-50 p-5 backdrop-blur-xl">
          <h2 className="mb-10 text-2xl font-bold">DevOps</h2>
          <ul>
            <li>Github</li>
            <li>Git</li>
            <li>Cloud</li>
            <li>Docker</li>
            <li>Microservice</li>
          </ul>
          <p className="mt-20 text-end text-xl text-white">5</p>
        </div>
      </div>

      <div
        className='absolute bottom-0 right-0 z-0 h-full w-full
        bg-black bg-[url("https://img.freepik.com/free-photo/gradient-3d-fluid-background_23-2150499029.jpg?w=1480&t=st=1704688258~exp=1704688858~hmac=a348fb00c787107fb2d180fd9085bbce713877ab3db8e17da92c9d4d6185683b")] bg-cover bg-center'
      />
      <div
        className="absolute right-0 top-0 z-0 h-1/3 w-full
        bg-gradient-to-b from-black"
      />
      <div
        className="absolute bottom-0 right-0 z-0 h-full w-full
        bg-gradient-to-t from-black opacity-20"
      />
      <div
        className="absolute bottom-0 right-0 z-0 h-1/3 w-full
        bg-gradient-to-t from-black"
      />
    </div>
  );
}

export default Technologies;
