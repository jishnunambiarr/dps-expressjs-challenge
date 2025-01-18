import { Router, Request, Response } from 'express';
export const router = Router();

// project CRUD operations
router.get('/', (request: Request, response: Response) => {
	response.send('Display Project Details...');
});

router.put('/', (request: Request, response: Response) => {
	response.send('Update Project Details...');
});

router.post('/', (request: Request, response: Response) => {
	response.send('Post New Project...');
});

router.delete('/', (request: Request, response: Response) => {
	response.send('Delete Project...');
});
