import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUserTable } from '../interfaces/user.interface';

export type UserDocument = User & Document;

@Schema()
export class User implements Partial<IUserTable> {
	@Prop({ required: true })
	user_name: string;

	@Prop({ required: true, unique: true })
	user_email: string;

	@Prop({ required: true })
	user_password: string;

	@Prop({ default: 3 })
	user_role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
