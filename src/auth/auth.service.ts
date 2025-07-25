import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/signup-dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import IResponseHttpApi from './interfaces/responseObject.interface';
import { LoginDto } from './dtos/login-dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dtos/updateUser-dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private UserModel: Model<User>,
		@InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
		private jwtService: JwtService,
	) {}

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

		const token = await this.generateUserTokens(user._id);

		return {
			status: HttpStatus.OK,
			message: {
				success: 'Login successful!',
			},
			data: {
				user: user._id,
				token,
			},
		};
	}

	async getUser(userId: number): Promise<IResponseHttpApi<object>> {
		const user = await this.UserModel.findById(userId).select('-user_password');

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					message: {
						errors: ['User not found!'],
					},
				},
				HttpStatus.NOT_FOUND,
			);
		}

		return {
			status: HttpStatus.OK,
			message: {
				success: 'User profile retrieved successfully',
			},
			data: user,
		};
	}

	async getAllUsers(userId: number): Promise<IResponseHttpApi<object>> {
		const users = await this.UserModel.find().select('-user_password');

		if (!users) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					message: {
						errors: ['User not found!'],
					},
				},
				HttpStatus.NOT_FOUND,
			);
		}

		return {
			status: HttpStatus.OK,
			message: {
				success: 'User profile retrieved successfully',
			},
			data: users,
		};
	}

	async update(userId: number, updateAuthDto: UpdateUserDto): Promise<IResponseHttpApi<object>> {
		const user = await this.UserModel.findById(userId);

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					message: {
						errors: ['User not found!'],
					},
				},
				HttpStatus.NOT_FOUND,
			);
		}

		const updatedUser = await this.UserModel.findByIdAndUpdate(userId, updateAuthDto, { new: true }).select(
			'-user_password',
		);

		return {
			status: HttpStatus.OK,
			message: {
				success: 'User updated with success!',
			},
			data: {
				user: updateAuthDto,
			},
		};
	}

	async delete(userId: string): Promise<IResponseHttpApi<object>> {
		const deletedUser = await this.UserModel.findByIdAndDelete(userId);

		if (!deletedUser) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					message: {
						errors: ['User not found!'],
					},
				},
				HttpStatus.NOT_FOUND,
			);
		}

		return {
			status: HttpStatus.OK,
			message: {
				success: 'User deleted with success!',
			},
		};
	}

	async refreshTokens(userId: number, refreshToken: string): Promise<object> {
		const token = await this.RefreshTokenModel.findOneAndDelete({
			token: refreshToken,
			expiryDate: { $gte: new Date() },
		});

		if (!token) {
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
				},
				HttpStatus.UNAUTHORIZED,
			);
		}

		return this.generateUserTokens(token.userId);
	}

	async generateUserTokens(userId): Promise<object> {
		const accessToken: string = this.jwtService.sign({ userId }, { expiresIn: '30d' });
		const refreshToken = uuidv4();
		await this.storeRefreshToken(refreshToken, userId);
		return {
			accessToken,
			refreshToken,
		};
	}

	async storeRefreshToken(token: string, userId) {
		const expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + 60);

		await this.RefreshTokenModel.create({ token, userId, expiryDate });
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
