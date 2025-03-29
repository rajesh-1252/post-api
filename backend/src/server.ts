import express from 'express';
import "express-async-errors";
import cors from 'cors';
import dotenv from 'dotenv';
import AppRouter from './route';
import morgan from 'morgan'
import path from 'path';
import errorHandlerMiddleware from './middleware/error-handler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan('tiny'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(path.join(__dirname, 'uploads'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1', AppRouter)
app.use(errorHandlerMiddleware)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
