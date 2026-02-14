import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { Card, CardBody, Divider, Button } from '@nextui-org/react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const Experience = ({ ExperienceData }: { ExperienceData: any }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Separate first 3 items and additional items
  const initialItems = ExperienceData.slice(0, 3);
  const additionalItems = ExperienceData.slice(3);

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
    <div className="mt-10 w-full max-w-[1024px] mx-auto px-4">
      {/* Section Header with gradient line */}
      <div className="mb-2 mt-20 h-1 w-1/6 rounded-full bg-gradient-to-r from-blue-500 to-transparent"></div>
      <Fade triggerOnce>
        <h2 className="mb-5 text-3xl font-bold text-default-900">Experience</h2>
      </Fade>
      
      {/* Static First 3 Items */}
      <div className="w-full">
        {initialItems.map((data: any) => (
          <Fade triggerOnce key={data.title}>
            <Card className="bg-transparent shadow-none">
              <CardBody className="group px-0">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{data.title}</h3>
                    <p className="text-1xl font-semibold">{data.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-semibold group-hover:bg-gradient-to-r 
                      group-hover:from-sky-400 group-hover:to-violet-500 
                      group-hover:bg-clip-text group-hover:text-transparent">
                      {data.time}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Divider 
              className="mb-2 mt-5 h-1 rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-blue-500" 
            />
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
            {additionalItems.map((data: any) => (
              <motion.div
                key={data.title}
                variants={itemVariants}
              >
                <Card className="bg-transparent shadow-none">
                  <CardBody className="group px-0">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">{data.title}</h3>
                        <p className="text-1xl font-semibold">{data.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-semibold group-hover:bg-gradient-to-r 
                          group-hover:from-sky-400 group-hover:to-violet-500 
                          group-hover:bg-clip-text group-hover:text-transparent">
                          {data.time}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Divider 
                  className="mb-2 mt-5 h-1 rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-blue-500" 
                />
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
};

export default Experience;
