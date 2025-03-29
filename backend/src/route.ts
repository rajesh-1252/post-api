import { Router } from 'express'
import express from 'express';
import PostRouter from './route/post';


const AppRouter = Router()


AppRouter.use('/posts', PostRouter);


export default AppRouter;
