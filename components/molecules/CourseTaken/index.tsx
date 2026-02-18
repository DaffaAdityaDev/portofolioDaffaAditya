import React, { useState } from 'react';
import { Card, CardBody, Link, Divider, Button } from '@nextui-org/react';
import Course from '@/data/Course';
import Arrow from '@/public/svg/arrow.svg';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Fade } from 'react-awesome-reveal';

function CourseTaken() {
  const [showAll, setShowAll] = useState(false);
  
  // Separate first 3 items and additional items
  const initialItems = Course.slice(0, 3);
  const additionalItems = Course.slice(3);

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      height: 0,
      transition: {
        duration: 0.3
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      height: 'auto',
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const containerVariants: Variants = {
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    },
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  return (
    <div className="mt-10 w-full max-w-[1024px] mx-auto px-4 mb-4">
      {/* Header Section with Animation */}
      <motion.div 
        className="mb-4 mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="bg-gradient-to-r from-red-500 to-violet-500 
          bg-clip-text text-6xl font-bold uppercase text-transparent">
          Course
        </h2>
        <h2 className="text-6xl uppercase text-default-900">Taken</h2>
      </motion.div>

      {/* Static First 3 Items */}
      <div className="w-full">
        {initialItems.map((data, index) => (
          <Fade triggerOnce key={data.course}>
            <Card className="bg-transparent shadow-none">
              <CardBody className="px-0 py-2">
                <Link
                  href={data.source}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-full items-center justify-between text-lg"
                >
                  <div>
                    <h2 className="font-bold text-default-900">{data.course}</h2>
                    <div className="flex">
                      <p className="mr-1 duration-300 ease-in-out group-hover:translate-x-6 text-foreground">
                        {data.organization}
                      </p>
                      <Image
                        src={Arrow}
                        alt="arrow"
                        width={20}
                        height={20}
                        className="duration-300 ease-in-out group-hover:translate-x-6 invert dark:invert-0"
                      />
                    </div>
                  </div>
                  <p className="font-semibold text-foreground">{data.year}</p>
                </Link>
              </CardBody>
              <Divider 
                className="mb-2 mt-5 h-1 w-full rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-blue-500"
              />
            </Card>
          </Fade>
        ))}
      </div>

      {/* Animated Additional Items */}
      <AnimatePresence mode="wait">
        {showAll && additionalItems.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            {additionalItems.map((data) => (
              <motion.div
                key={data.course}
                variants={itemVariants}
              >
                <Card className="bg-transparent shadow-none">
                  <CardBody className="px-0 py-2">
                    <Link
                      href={data.source}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex w-full items-center justify-between text-lg"
                    >
                      <div>
                        <h2 className="font-bold text-default-900">{data.course}</h2>
                        <div className="flex">
                          <p className="mr-1 duration-300 ease-in-out group-hover:translate-x-6 text-foreground">
                            {data.organization}
                          </p>
                          <Image
                            src={Arrow}
                            alt="arrow"
                            width={20}
                            height={20}
                            className="duration-300 ease-in-out group-hover:translate-x-6 invert dark:invert-0"
                          />
                        </div>
                      </div>
                      <p className="font-semibold text-foreground">{data.year}</p>
                    </Link>
                  </CardBody>
                  <Divider 
                    className="mb-2 mt-5 h-1 w-full rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-blue-500"
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show More/Less Button with Animation */}
      {additionalItems.length > 0 && (
        <motion.div 
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            className="group bg-transparent"
            onClick={() => setShowAll(!showAll)}
          >
            <motion.span 
              className="text-lg font-semibold group-hover:bg-gradient-to-r 
                group-hover:from-sky-400 group-hover:to-violet-500 
                group-hover:bg-clip-text group-hover:text-transparent"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAll ? 'Show Less' : 'Show More'}
            </motion.span>
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export default CourseTaken;
