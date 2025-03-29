import React from "react";

const PostLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-xl text-gray-600 animate-pulse">Loading posts...</div>
    </div>
  );
};

export default PostLoading;
