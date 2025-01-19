import { Router, Request, Response } from 'express';
import db from '../services/db.service';

export const router = Router();

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
		const result = db.run(
			'UPDATE projects SET name= :name, description= :description WHERE id= :id',
			{ id: id, name: name, description: description },
		);
		if (result.changes == 0) {
			return response.status(404).json({
				success: false,
				error: 'Project not found.',
			});
		}
		response.status(200).json({
			success: true,
			data: 'Project updated successfully.',
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to update project',
		});
	}
});

router.post('/', (request: Request, response: Response) => {
	try {
		const { name, description } = request.body;
		const result = db.run(
			'INSERT INTO projects (name, description) VALUES (:name, :description)',
			{ name: name, description: description },
		);
		response.status(201).json({
			success: true,
			data: {
				id: result.lastInsertRowid,
				message: 'Project created successfully.',
			},
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to create project.',
		});
	}
});

router.delete('/:id', (request: Request, response: Response) => {
	try {
		// first delete the associated reports
		db.run('DELETE FROM reports WHERE project_id= :id', {
			id: request.params.id,
		});

		const result = db.run('DELETE FROM projects WHERE id= :id', {
			id: request.params.id,
		});

		if (result.changes == 0) {
			return response.status(404).json({
				success: false,
				error: 'Project not found.',
			});
		}
		response.status(200).json({
			success: true,
			data: 'Project deleted successfully',
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to delete project from the database.',
		});
	}
});
