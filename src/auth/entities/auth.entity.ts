import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Auth extends Document {

    @Prop({ required: [true, "El nombre es necesario y unico"], type: String })
    name: string;

    @Prop({required: [false, "El correo es necesario y unico"], type: String })
    email: string;

    @Prop({ required: [true, "El password es necesario"], type: String })
    password: string;

    @Prop({ type: Array, default: ['ADMIN'] })
    roles: string[];

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    update_at: Date | number;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Prop({ type: Number, default: 0 })
    retry: number;
}


export const UserShema = SchemaFactory.createForClass(Auth);