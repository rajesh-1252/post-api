import React, { useEffect, useState, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchPosts, deletePost, Post } from "../redux/slice/postSlice";
import Navbar from "../component/NavBar";
import PostCard from "../component/PostCard";
import PostForm from "../component/PostForm";
import PostLoading from "../component/PostLoading";
import Modal from "../component/Modal";
import EmptyPost from "../component/EmptyPost";

const PostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, hasMore } = useAppSelector((state) => state.posts);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const initialFetchDone = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!initialFetchDone.current || page > 1) {
      dispatch(fetchPosts({ page, append: page > 1 }));
      initialFetchDone.current = true;
    }
  }, [dispatch, page]);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleEdit = (post: Post) => {
    setEditPost(post);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deletePost(id));
  };

  const handleCloseDialog = () => {
    setEditPost(null);
    setOpenDialog(false);
  };

  const handleCreateNew = () => {
    setEditPost(null);
    setOpenDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Posts</h1>
          {posts.length > 0 && (
            <button
              onClick={handleCreateNew}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2" />
              Create New Post
            </button>
          )}
        </div>
        {loading && page === 1 ? (
          <PostLoading />
        ) : posts.length === 0 ? (
          <EmptyPost onCreateNew={handleCreateNew} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
                ref={index === posts.length - 1 ? lastPostRef : null}
              />
            ))}
          </div>
        )}
        {loading && page > 1 && <PostLoading />}
      </div>
      <Modal isOpen={openDialog} title={editPost ? "Edit Post" : "Create New Post"} onClose={handleCloseDialog}>
        <PostForm initialPost={editPost} onClose={handleCloseDialog} />
        <div className="mt-4 flex justify-end">
          <button onClick={handleCloseDialog} className="text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PostList;
