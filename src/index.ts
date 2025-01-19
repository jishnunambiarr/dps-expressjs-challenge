import express, { Express, Request, Response } from 'express';
import { projectsRouter, reportsRouter, projectReportRouter } from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/projects', projectsRouter);
app.use('/reports', reportsRouter);
app.use('/projectReports', projectReportRouter);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/', (request: Request, response: Response) => {
	response.send('Hello World!');
});
