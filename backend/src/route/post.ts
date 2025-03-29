import express from 'express';
import multer from 'multer';
import { getAllPosts, createPost, updatePost, deletePost } from '../controllers/post';

const PostRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

PostRouter.get('/', getAllPosts);
PostRouter.post('/', upload.single('image'), createPost);
PostRouter.put('/:id', upload.single('image'), updatePost);
PostRouter.delete('/:id', deletePost);

export default PostRouter;
