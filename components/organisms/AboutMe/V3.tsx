import React from 'react'
import { Card, CardBody, Image, Spacer } from "@nextui-org/react"

function V3() {
  return (
    <div className="w-full text-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Card className="flex-1">
            <CardBody className=''>
              <h2 className="text-3xl font-bold mb-2">Daffa Aditya Rahman</h2>
              <p className="text-xl mb-4">Software Engineer</p>
              <div className="w-full mx-auto flex justify-center">
                <Image
                src="/image/Profile.jpg"
                alt="Daffa Aditya Rahman"
                width={200}
                height={300}
                  className="rounded-lg w-full object-cover"
                />
              </div>
            </CardBody>
          </Card>
          
          <Card className="flex-[2]">
            <CardBody>
              <h3 className="text-2xl font-semibold mb-4">
                Well rounded Software Engineer, from designing software to deployment, ready to handle ambiguous problems, with wide range of technology
              </h3>
              <p className="mb-4">Jakarta, Indonesia</p>
              <Spacer y={2} />
              <p className="mb-4">
                I'm a well-rounded Software Engineer with a passion for solving complex and ambiguous problems. With experience
                across the full software development life cycle—from design to deployment—I thrive in environments that challenge me
                to think critically and innovate. My expertise spans a wide range of technologies, allowing me to adapt and tackle
                projects of varying complexity with precision and efficiency.
              </p>
              <Spacer y={2} />
              <p>
                Currently based in Jakarta, Indonesia, I aim to push the boundaries of software development, continuously expanding my
                knowledge and contributing to impactful projects. Whether it's optimizing code performance or building user-friendly
                applications, I am dedicated to delivering high-quality solutions that meet and exceed expectations.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default V3
