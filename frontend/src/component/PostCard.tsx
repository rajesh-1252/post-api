import { forwardRef } from "react";
import { Edit, Delete } from "lucide-react";
import { Post } from "../types/types";

export interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const PostCard = forwardRef<HTMLDivElement, PostCardProps>(({ post, onEdit, onDelete }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-102 hover:shadow-xl"
    >
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.text}</p>
        <div className="flex justify-between space-x-2">
          <button
            onClick={() => onEdit(post)}
            className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors"
          >
            <Edit className="mr-2 w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="flex items-center text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
          >
            <Delete className="mr-2 w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

export default PostCard;
