import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import UploadService from '../service/upload';
import { BadRequestError } from '../errors';
import { apiResponse } from '../utils/apiResponse';

const prisma = new PrismaClient();


export const getAllPosts = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.post.count(),
  ]);

  const hasMore = skip + Number(limit) < totalPosts;

  apiResponse(res, { posts, hasMore });
};

export const createPost = async (req: Request, res: Response) => {
  const { title, text } = req.body;
  if (!title || !text) throw new BadRequestError('Title and text are required');
  let imageUrl;
  if (req.file) {
    imageUrl = await UploadService.uploadFile(req.file);
  }

  const post = await prisma.post.create({
    data: { title, text, imageUrl },
  });


  apiResponse(res, post);
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, text } = req.body;
  if (!id) throw new BadRequestError('Post ID is required');

  let imageUrl;
  if (req.file) {
    imageUrl = await UploadService.uploadFile(req.file);
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: { title, text, ...(imageUrl && { imageUrl }) },
  });

  apiResponse(res, updatedPost);
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new BadRequestError('Post ID is required');

  await prisma.post.delete({ where: { id } });

  apiResponse(res);
};
