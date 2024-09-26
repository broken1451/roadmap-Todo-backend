import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Todolist extends Document {

    @Prop({ required: [true, "Title is required"], type: String })
    title: string;

    @Prop({required: [true, "Description is required"], type: String })
    description: string;

    @Prop({required: [true, "Description is required"], type: Boolean, default: false })
    completed: boolean;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ type: Date, default: Date.now })
    update_at: Date;

}
export const TodoShema = SchemaFactory.createForClass(Todolist);