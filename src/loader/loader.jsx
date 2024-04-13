import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="spinner-border h-12 w-12 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
