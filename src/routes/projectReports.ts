import { Router, Request, Response } from 'express';
import db from '../services/db.service';
import { authenticateToken } from '../middleware/auth';

export const router = Router();
router.use(authenticateToken);

router.get('/:projectid/reports', (request: Request, response: Response) => {
	try {
		const stringProjectId = request.params.projectid.toString();
		const reports = db.query(
			'SELECT * FROM reports WHERE projectid= :projectid',
			{ projectid: stringProjectId },
		);

		if (!reports || reports.length == 0) {
			return response.status(404).json({
				success: false,
				data: 'No reports found for this project',
			});
		}

		response.status(200).json({
			success: true,
			data: reports,
		});
	} catch (error) {
		response.status(500).json({
			success: false,
			data: 'Failed to fetch reports for this project',
		});
	}
});

router.get(
	'/:projectid/reports/:id',
	(request: Request, response: Response) => {
		try {
			const stringId = request.params.id.toString();
			const stringProjectId = request.params.projectid.toString();

			const report = db.query(
				'SELECT * FROM reports WHERE projectid= :projectid AND id= :id',
				{
					projectid: stringProjectId,
					id: stringId,
				},
			);

			if (!report || report.length == 0) {
				return response.status(404).json({
					success: false,
					data: 'No report found for this project',
				});
			}

			response.status(200).json({
				success: true,
				data: report,
			});
		} catch (error) {
			response.status(500).json({
				success: false,
				data: 'Failed to fetch report',
			});
		}
	},
);
