import { Router, Request, Response } from 'express';
import db from '../services/db.service';
import { authenticateToken } from '../middleware/auth';

export const router = Router();
router.use(authenticateToken);

// project CRUD operations
router.get('/', (request: Request, response: Response) => {
	try {
		const projects = db.query('SELECT * FROM projects');
		response.status(200).json({
			success: true,
			data: projects,
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to fetch projects',
		});
	}
});

router.get('/:id', (request: Request, response: Response) => {
	try {
		const report = db.query('SELECT * FROM projects WHERE id= :id', {
			id: request.params.id,
		});
		if (!report || report.length == 0) {
			return response.status(404).json({
				success: false,
				error: 'Project not found.',
			});
		}
		response.status(200).json({
			success: true,
			data: report[0],
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to fetch project',
		});
	}
});

router.put('/', (request: Request, response: Response) => {
	try {
		const { id, name, description } = request.body;
		console.log('Update request body:', { id, name, description });

		// Convert id to string to match table schema
		const stringId = id.toString();
		const stringdescription = description.toString();

		// First verify the report exists
		const existingProject = db.query(
			'SELECT * FROM projects WHERE id = :id',
			{
				id: stringId,
			},
		);
		console.log('Existing report:', existingProject);

		if (!existingProject || existingProject.length === 0) {
			return response.status(404).json({
				success: false,
				error: 'Project not found.',
			});
		}

		const result = db.run(
			'UPDATE projects SET name = :name, description = :description WHERE id = :id',
			{
				id: stringId,
				name,
				description: stringdescription,
			},
		);
		console.log('Update result:', result);

		response.status(200).json({
			success: true,
			data: 'Project updated successfully.',
		});
	} catch (error) {
		console.error('Error updating Project:', error);
		response.status(500).json({
			success: false,
			error: 'Failed to update Project',
		});
	}
});

router.post('/', (request: Request, response: Response) => {
	try {
		const { name, description } = request.body;

		// Define interface for the query result
		interface MaxIdResult {
			maxId: number | null;
		}

		// Get the maximum ID from projects table with proper typing
		const maxIdResult = db.query(
			'SELECT MAX(CAST(id AS INTEGER)) as maxId FROM projects',
		) as MaxIdResult[];
		const nextId = ((maxIdResult[0]?.maxId ?? 0) + 1).toString();

		db.run(
			'INSERT INTO projects (id, name, description) VALUES (:id, :name, :description)',
			{
				id: nextId,
				name,
				description: description,
			},
		);
		response.status(201).json({
			success: true,
			data: {
				id: nextId,
				name,
				description: description,
				message: 'Project created successfully.',
			},
		});
	} catch (error) {
		console.error('Error creating Project:', error);
		response.status(500).json({
			success: false,
			error: 'Failed to create project',
		});
	}
});

router.delete('/:id', (request: Request, response: Response) => {
	try {
		// First verify project exists
		const project = db.query('SELECT * FROM projects WHERE id = :id', {
			id: request.params.id,
		});

		if (!project || project.length === 0) {
			return response.status(404).json({
				success: false,
				error: 'Project not found.',
			});
		}

		// Delete associated reports (if any exist)
		db.run('DELETE FROM reports WHERE projectid = :id', {
			id: request.params.id,
		});

		// Delete the project
		db.run('DELETE FROM projects WHERE id = :id', {
			id: request.params.id,
		});

		response.status(200).json({
			success: true,
			data: 'Project and associated reports deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting project:', error);
		response.status(500).json({
			success: false,
			error: 'Failed to delete project from the database.',
		});
	}
});
