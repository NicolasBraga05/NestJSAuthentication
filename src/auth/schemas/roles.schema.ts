import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ collection: 'roles' })
export class Role {
	@Prop({ required: true })
	role_level: number;

	@Prop({ required: true, unique: true })
	role_description: string;

	@Prop({ required: true })
	role_name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
