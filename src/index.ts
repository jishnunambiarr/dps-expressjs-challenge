import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/', (request: Request, response: Response) => {
	response.send('Hello World!');
});

// project CRUD operations
app.get('/projects', (request: Request, response: Response) => {
	response.send('Display Project Details...');
});

app.put('/projects', (request: Request, response: Response) => {
	response.send('Update Project Details...');
});

app.post('/projects', (request: Request, response: Response) => {
	response.send('Post New Project...');
});

app.delete('/projects', (request: Request, response: Response) => {
	response.send('Delete Project...');
});

// reports CRUD operations
app.get('/reports', (request: Request, response: Response) => {
	response.send('Display report Details...');
});

app.put('/reports', (request: Request, response: Response) => {
	response.send('Update report Details...');
});

app.post('/reports', (request: Request, response: Response) => {
	response.send('Post new Project...');
});

app.delete('/reports', (request: Request, response: Response) => {
	response.send('Delete Report...');
});
