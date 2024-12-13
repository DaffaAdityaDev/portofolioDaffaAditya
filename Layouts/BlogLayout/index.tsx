import { motion } from 'framer-motion';

function BlogLayout({ children }: { children: React.ReactNode }) {
  console.log("BlogLayout")
  return (
    <motion.div 
      className="min-h-screen bg-content1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
    >

      <main className="flex-grow">
        {children}
      </main>
    </motion.div>
  );
}

export default BlogLayout;
