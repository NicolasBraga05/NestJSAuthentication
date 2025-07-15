import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message: any = {
			errors: ['Internal server error'],
		};

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
				message = (exceptionResponse as any).message
					? (exceptionResponse as any)
					: { errors: [exceptionResponse] };
			} else {
				message = { errors: [exceptionResponse] };
			}
		} else if (exception instanceof Error) {
			message = { errors: [exception.message] };
		}

		response.status(status).json({
			status,
			message,
		});
	}
}
