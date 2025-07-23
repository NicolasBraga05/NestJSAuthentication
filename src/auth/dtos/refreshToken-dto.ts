import { IsString } from 'class-validator';
import { IRefreshTokenTable } from '../interfaces/refreshToken.interface';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto implements Partial<IRefreshTokenTable> {
	@ApiProperty({
		example: '123e4567-e89b-12d3-a456-426614174000',
		description: 'Refresh token',
		required: true,
	})
	@IsString()
	refreshToken: string;
}
