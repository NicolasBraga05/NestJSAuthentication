import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [MongooseModule.forRoot('mongodb://localhost:27017/auth'), AuthModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
