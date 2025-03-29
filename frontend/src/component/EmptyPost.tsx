
import React from "react";
import { Plus } from "lucide-react";

interface EmptyPostProps {
  onCreateNew: () => void;
}

const EmptyPost: React.FC<EmptyPostProps> = ({ onCreateNew }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <Plus className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Create your first post to get started. Share your thoughts, ideas, or stories with the world.
      </p>
      <button
        onClick={onCreateNew}
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        <Plus className="mr-2" />
        Create New Post
      </button>
    </div>
  );
};

export default EmptyPost;
