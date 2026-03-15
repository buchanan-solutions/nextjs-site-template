"use client"; // Required for Context
// ./src/components/layout/DebuggableDiv.tsx
import React, { forwardRef, useContext } from 'react';

import CopyableText from '@/components/copyable-text';

import { DEBUG_COLORS } from './utils';
import { DepthContext } from './depth-context';

type DebuggableBodyProps = React.ComponentPropsWithRef<"body"> & {
  debug?: boolean | number;
};

const DebuggableBody = forwardRef<HTMLBodyElement, DebuggableBodyProps>(
  ({
    debug = false, className = "", children, id, ...rest 
  }, ref) => {
    const depth = useContext(DepthContext);

    // Select color based on depth (looping back if we exceed array length)
    const colorSet = DEBUG_COLORS[depth % DEBUG_COLORS.length];

    if (!debug) {
      return (
        <body ref={ref} id={id} className={className} {...rest}>
          {children}
        </body>
      );
    }

    return (
      <DepthContext.Provider value={depth + 1}>
        <body
          ref={ref}
          id={id}
          className={`border-2 relative p-4 ${colorSet.border} ${className}`}
          {...rest}
        >
          <div className={`absolute top-0 right-0 text-white whitespace-nowrap text-xs px-1 font-mono z-50 ${colorSet.bg}`}>
            <CopyableText value={id ?? "unknown"} variant="text" /> (d:{depth})
          </div>
          {children}
        </body>
      </DepthContext.Provider>
    );
  },
);

DebuggableBody.displayName = "DebuggableBody";

export default DebuggableBody;