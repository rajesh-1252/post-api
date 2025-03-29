import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useAppDispatch } from '../redux/hooks';
import { updatePost, createPost } from '../redux/slice/postSlice';
import { Post } from '../types/types';

interface PostFormProps {
  initialPost?: Post | null;
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ initialPost, onClose }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setText(initialPost.text);
    }
  }, [initialPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialPost && !image) return;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);
    if (image) {
      formData.append('image', image);
    }
    if (initialPost) {
      dispatch(updatePost({ id: initialPost.id, postData: formData }));
    } else {
      dispatch(createPost(formData));
    }
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        setImage(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        setImage(null);
        return;
      }
      setError('');
      setIsUploading(true);
      setTimeout(() => {
        setImage(file);
        setIsUploading(false);
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="description"
        multiline
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end space-x-2">
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={(!initialPost && !image) || isUploading}
        >
          {initialPost ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
