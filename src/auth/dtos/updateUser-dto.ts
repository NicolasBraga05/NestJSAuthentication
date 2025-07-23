import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { IUserTable } from '../interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto implements Partial<IUserTable> {
	@ApiProperty({ example: 'John Doe', description: 'Nome completo do usuário' })
	@IsString()
	@MinLength(3)
	@MaxLength(50)
	user_name?: string;

	@ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
	@IsEmail()
	user_email?: string;

	@IsOptional()
	@IsString()
	@MinLength(6)
	@Matches(/^(?=.*[0-9])/, { message: 'Password must contain at lesat one number!' })
	user_password?: string;
}
