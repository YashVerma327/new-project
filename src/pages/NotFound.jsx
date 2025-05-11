
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CloudOff, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CloudOff className="h-24 w-24 text-blue-500 mb-6" />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
      >
        404 - Page Not Found
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md"
      >
        Oops! The page you're looking for seems to have drifted away like a cloud.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button asChild size="lg">
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Return Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
