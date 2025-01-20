import { Request, Response, NextFunction } from 'express';

export function authenticateToken(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	const authHeader = request.headers.authorization;
	const token = authHeader?.split(' ')[1];

	if (token !== 'Password123') {
		return response.status(401).json({
			success: false,
			error: 'Invalid authentication token',
		});
	}

	next();
}
