import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { IUserTable } from '../interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto implements Partial<IUserTable> {
	@ApiProperty({ example: 'John Doe', description: 'User name', required: true })
	@IsString()
	@MinLength(3)
	@MaxLength(50)
	user_name: string;

	@ApiProperty({ example: 'user@example.com', description: 'User email', required: true })
	@IsEmail()
	user_email: string;

	@ApiProperty({ example: 'password123', description: 'User password', required: true })
	@IsString()
	@MinLength(6)
	@Matches(/^(?=.*[0-9])/, { message: 'Password must contain at lesat one number!' })
	user_password: string;
}
