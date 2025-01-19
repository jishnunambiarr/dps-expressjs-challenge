import { Router, Request, Response } from 'express';
import db from '../services/db.service';
export const router = Router();

interface Report {
	id: string;
	text: string | null;
	projectid: string;
}

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

router.get('/special', (request: Request, response: Response) => {
	try {
		const reports = db.query('SELECT * FROM reports');
		const filteredReports = (reports as Report[]).filter((report) => {
			if (!report.text) return false;
			const words = report.text
				.toLowerCase()
				.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
				.split(/\s+/)
				.filter((word) => word.length > 0);

			const wordCount = new Map();
			for (const word of words) {
				wordCount.set(word, (wordCount.get(word) || 0) + 1);
			}

			for (const count of wordCount.values()) {
				if (count >= 3) {
					return true;
				}
			}
			return false;
		});

		if (filteredReports.length === 0) {
			return response.status(404).json({
				success: false,
				error: 'No reports found with words repeated 3 or more times',
			});
		}

		response.status(200).json({
			success: true,
			data: filteredReports,
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			error: 'Failed to fetch special reports',
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
