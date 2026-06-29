import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <Suspense fallback={<Loader fullPage={true} />}>
        {children}
      </Suspense>
    </motion.div>
  );
};

export default PageWrapper;
