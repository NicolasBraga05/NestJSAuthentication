import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/signup-dto';
import { InjectModel } from '@nestjs/mongoose';
import { privateDecrypt } from 'crypto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { single } from 'rxjs';
import * as bcrypt from 'bcrypt';
import IResponseHttpApi from './interfaces/responseObject.interface';
import { LoginDto } from './dtos/login-dto';

@Injectable()
export class AuthService {
	constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

	async createUser(userData: SignUpDto): Promise<IResponseHttpApi<string>> {
		const { user_email, user_name, user_password } = userData;

		const emailInUse = await this.UserModel.findOne({ email: user_email });

		if (emailInUse) {
			throw new HttpException(
				{
					status: HttpStatus.CONFLICT,
					message: {
						errors: ['User with this email already exists'],
					},
				},
				HttpStatus.CONFLICT,
			);
		}

		const hashedPassword = await bcrypt.hash(user_password, 10);

		try {
			await this.UserModel.create({
				user_name,
				user_email,
				user_password: hashedPassword,
			});
		} catch (error) {
			if (error.code === 11000) {
				throw new HttpException(
					{
						status: HttpStatus.CONFLICT,
						message: {
							errors: ['User with this email already exists (duplicate key)'],
						},
					},
					HttpStatus.CONFLICT,
				);
			}

			throw new HttpException(
				{
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					message: {
						errors: ['Internal server error while creating user'],
					},
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		return {
			status: HttpStatus.CREATED,
			message: {
				success: 'User created with success!',
			},
			data: user_name,
		};
	}

	async login(userCredentials: LoginDto): Promise<IResponseHttpApi<any>> {
		const { user_email, user_password } = userCredentials;

		const user = await this.UserModel.findOne({ user_email });

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					message: {
						errors: ['User with this email was not found!'],
					},
				},
				HttpStatus.NOT_FOUND,
			);
		}

		const isPasswordValid = await bcrypt.compare(user_password, user.user_password);

		if (!isPasswordValid) {
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					message: {
						errors: ['User email or password is incorrect!'],
					},
				},
				HttpStatus.UNAUTHORIZED,
			);
		}

		const token = 'mocked_token_here';

		return {
			status: HttpStatus.OK,
			message: {
				success: 'Login successful!',
			},
			data: {
				user: user_email,
				token,
			},
		};
	}

	/* findAll() {
		return `This action returns all auth`;
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`;
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
		return `This action updates a #${id} auth`;
	}

	remove(id: number) {
		return `This action removes a #${id} auth`;
	} */
}
