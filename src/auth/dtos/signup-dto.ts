import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignUpDto {
	@IsString()
	user_name: string;

	@IsEmail()
	user_email: string;

	@IsString()
	@MinLength(6)
	@Matches(/^(?=.*[0-9])/, { message: 'Password must contain at lesat one number!' })
	user_password: string;
}
