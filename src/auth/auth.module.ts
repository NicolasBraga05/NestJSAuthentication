import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { Role, RoleSchema } from './schemas/roles.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
			{
				name: RefreshToken.name,
				schema: RefreshTokenSchema,
			},
			{
				name: Role.name,
				schema: RoleSchema,
			},
		]),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
