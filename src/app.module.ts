import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './auth/config/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [config],
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config) => ({
				secret: config.get('jwt.secret'),
			}),
			global: true,
			inject: [ConfigService],
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config) => ({
				uri: config.get('database.connectionString'),
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		/* RolesModule */
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
