import { Router, Request, Response } from 'express';
import db from '../services/db.service';

export const router = Router();

router.get(
	'/projects/:projectId/reports',
	(request: Request, response: Response) => {
		try {
			const reports = db.query(
				'SELECT * FROM reports WHERE project_id= :projectId',
				{ projectId: request.params.projectId },
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
	},
);

router.get(
	'/projects/:projectId/reports/:reportId',
	(request: Request, response: Response) => {
		try {
			const report = db.query(
				'SELECT * FROM reports WHERE project_id= :projectId AND id= :reportId',
				{
					projectId: request.params.projectId,
					id: request.params.reportId,
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
