import { IsEmail, IsString, MinLength } from 'class-validator';
import { IUserTable } from '../interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto implements Partial<IUserTable> {
	@ApiProperty({ example: 'user@example.com', description: 'User email' })
	@IsEmail()
	user_email: string;

	@ApiProperty({ example: 'password123', description: 'User password', required: true })
	@IsString()
	@MinLength(6)
	user_password: string;
}
