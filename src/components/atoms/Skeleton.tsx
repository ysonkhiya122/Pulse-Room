import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={clsx('animate-pulse bg-panel-subtle/80 rounded-md', className)}
      aria-hidden="true"
    />
  );
};
