import { Router, Request, Response } from 'express';
import db from '../services/db.service';
export const router = Router();

// reports CRUD operations
router.get('/', (request: Request, response: Response) => {
	try {
		const reports = db.query('SELECT * FROM reports');
		response.status(200).json({
			success: true,
			data: reports,
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to fetch reports',
		});
	}
});

router.get('/:id', (request: Request, response: Response) => {
	try {
		const report = db.query('SELECT * FROM reports WHERE id= :id', {
			id: request.params.id,
		});
		if (!report || report.length == 0) {
			return response.status(404).json({
				success: false,
				error: 'Report not found.',
			});
		}
		response.status(200).json({
			success: true,
			data: report[0],
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to fetch report',
		});
	}
});

router.put('/', (request: Request, response: Response) => {
	try {
		const { id, name, description } = request.body;
		const result = db.run(
			'UPDATE reports SET name= :name, description= :description WHERE id= :id',
			{ id: id, name: name, description: description },
		);
		if (result.changes == 0) {
			return response.status(404).json({
				success: false,
				error: 'Report not found.',
			});
		}
		response.status(200).json({
			success: true,
			data: 'Report updated successfully.',
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to update report',
		});
	}
});

router.post('/', (request: Request, response: Response) => {
	try {
		const { name, description } = request.body;
		const result = db.run(
			'INSERT INTO reports (name, description) VALUES (:name, :description)',
			{ name: name, description: description },
		);
		response.status(201).json({
			success: true,
			data: {
				id: result.lastInsertRowid,
				message: 'Report created successfully.',
			},
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to create report.',
		});
	}
});

router.delete('/:id', (request: Request, response: Response) => {
	try {
		const result = db.run('DELETE FROM reports WHERE id= :id', {
			id: request.params.id,
		});

		if (result.changes == 0) {
			return response.status(404).json({
				success: false,
				error: 'Report not found.',
			});
		}
		response.status(200).json({
			success: true,
			data: 'Report deleted successfully',
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to delete report from the database.',
		});
	}
});
