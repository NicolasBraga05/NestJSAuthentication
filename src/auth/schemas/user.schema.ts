import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUserTable } from '../interfaces/user.interface';

@Schema()
export class User extends Document implements Partial<IUserTable> {
	@Prop({ required: true })
	user_name: string;

	@Prop({ required: true, unique: true })
	user_email: string;

	@Prop({ required: true })
	user_password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
