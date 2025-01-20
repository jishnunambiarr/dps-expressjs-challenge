import { Router, Request, Response } from 'express';
import db from '../services/db.service';
import { authenticateToken } from '../middleware/auth';

export const router = Router();
router.use(authenticateToken);

interface Report {
	id: string;
	text: string | null;
	projectid: string;
}

// reports CRUD operations
router.get('/', (request: Request, response: Response) => {
	try {
		const queryWord = request.query.query?.toString().toLowerCase();

		// If no query parameter, return all reports (keeping original functionality)
		if (!queryWord) {
			const reports = db.query('SELECT * FROM reports');
			return response.status(200).json({
				success: true,
				data: reports,
			});
		}

		// If query parameter exists, filter reports for word occurrence
		const reports = db.query('SELECT * FROM reports');
		const filteredReports = (reports as Report[]).filter((report) => {
			if (!report.text) return false;

			// Clean and split the text
			const words = report.text
				.toLowerCase()
				.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
				.split(/\s+/)
				.filter((word) => word.length > 0);

			// Count occurrences of the specific word
			const wordCount = words.filter((word) => word === queryWord).length;
			return wordCount >= 3;
		});

		if (filteredReports.length === 0) {
			return response.status(404).json({
				success: false,
				error: `No reports found where "${queryWord}" appears 3 or more times`,
			});
		}

		response.status(200).json({
			success: true,
			data: filteredReports,
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
		const { id, text, projectid } = request.body;
		console.log('Update request body:', { id, text, projectid });

		// Convert id to string to match table schema
		const stringId = id.toString();
		const stringProjectId = projectid.toString();

		// First verify the report exists
		const existingReport = db.query(
			'SELECT * FROM reports WHERE id = :id',
			{
				id: stringId,
			},
		);
		console.log('Existing report:', existingReport);

		if (!existingReport || existingReport.length === 0) {
			return response.status(404).json({
				success: false,
				error: 'Report not found.',
			});
		}

		const result = db.run(
			'UPDATE reports SET text = :text, projectid = :projectid WHERE id = :id',
			{
				id: stringId,
				text,
				projectid: stringProjectId,
			},
		);
		console.log('Update result:', result);

		response.status(200).json({
			success: true,
			data: 'Report updated successfully.',
		});
	} catch (error) {
		console.error('Error updating report:', error);
		response.status(500).json({
			success: false,
			error: 'Failed to update report',
		});
	}
});

router.post('/', (request: Request, response: Response) => {
	try {
		const { text, projectid } = request.body;
		const stringProjectId = projectid.toString();

		// Check if project exists
		const project = db.query(
			'SELECT id FROM projects WHERE id = :projectid',
			{
				projectid: stringProjectId,
			},
		);

		if (!project || project.length === 0) {
			return response.status(400).json({
				success: false,
				error: 'Project ID does not exist',
			});
		}

		// Define interface for the query result
		interface MaxIdResult {
			maxId: number | null;
		}

		// Get the maximum ID from reports table with proper typing
		const maxIdResult = db.query(
			'SELECT MAX(CAST(id AS INTEGER)) as maxId FROM reports',
		) as MaxIdResult[];
		const nextId = ((maxIdResult[0]?.maxId ?? 0) + 1).toString();

		db.run(
			'INSERT INTO reports (id, text, projectid) VALUES (:id, :text, :projectid)',
			{
				id: nextId,
				text,
				projectid: stringProjectId,
			},
		);

		response.status(201).json({
			success: true,
			data: {
				id: nextId,
				text,
				projectid: stringProjectId,
				message: 'Report created successfully.',
			},
		});
	} catch (error) {
		console.error('Error creating report:', error);
		response.status(500).json({
			success: false,
			error: 'Failed to create report',
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
