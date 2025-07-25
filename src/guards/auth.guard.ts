import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					message: {
						errors: ['Invalid token!'],
					},
				},
				HttpStatus.UNAUTHORIZED,
			);
		}

		try {
			const payload = this.jwtService.verify(token);
			request.userId = payload.userId;
		} catch (error) {
			Logger.error(error.message);
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					message: {
						errors: ['Invalid token!'],
					},
				},
				HttpStatus.UNAUTHORIZED,
			);
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		return request.headers.authorization?.split(' ')[1];
	}
}
