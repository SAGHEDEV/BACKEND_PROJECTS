import cors from 'cors';
import express from 'express';
import { errorHandler, notFound } from './middleware/error.middleware';
import authRouter from './modules/auth/auth.router';
import taskRouter from './modules/tasks/task.router';
import { sendResponse } from './utils/response';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  sendResponse(res, 200, 'OK', { status: 'ok' });
});
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
