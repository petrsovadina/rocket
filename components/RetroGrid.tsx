import React from 'react';

export const RetroGrid: React.FC = () => {
  return (
    <div className="absolute top-0 -z-10 h-full w-full bg-background">
      <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/20 opacity-50 blur-[80px]"></div>
    </div>
  );
};

export default RetroGrid;