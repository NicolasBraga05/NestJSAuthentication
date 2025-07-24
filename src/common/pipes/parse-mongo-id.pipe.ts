import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
	transform(value: string) {
		if (!isValidObjectId(value)) {
			throw new BadRequestException({
				status: 400,
				message: { errors: ['Invalid user ID format'] },
			});
		}
		return value;
	}
}
