import React, { useRef } from 'react';
import { useInView } from 'framer-motion';

const Section = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Determine the transform direction based on the type of child
  const transformStyle = (child) => {
    if (child.type === 'h2') {
      return isInView ? 'none' : 'translateX(200px)'; // Animate from left
    }
    return isInView ? 'none' : 'translateX(200px)'; // Animate from right for h4 and p
  };

  return (
    <section ref={ref}>
      <div
        style={{
          transform: transformStyle(children[0]),
          opacity: isInView ? 1 : 0,
          transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
          marginBottom: '2rem',
          padding: '2rem',
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
