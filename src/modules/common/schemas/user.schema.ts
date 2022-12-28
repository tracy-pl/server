import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Exclude, Transform, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Role } from '~modules/users/roles/role.enum';
import { Provider } from '~modules/users/providers/providers.enum';
import {
  PublicFile,
  PublicFileSchema,
} from '~modules/common/schemas/publicFile.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Transform((params) => params.obj._id.toString())
  _id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: [Role.User] })
  roles: Role[];

  @Prop({ required: true })
  providers: Provider[];

  @Prop({ default: false })
  emailIsConfirmed: boolean;

  @Prop()
  @Exclude()
  refreshToken: string;

  @Prop({ type: PublicFileSchema })
  @Type(() => PublicFile)
  avatar: PublicFile;
}

export const UserSchema =
  SchemaFactory.createForClass(User).plugin(uniqueValidator);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await bcrypt.hash(this.password, 14);
    this.set('password', hashed);
  }

  next();
});
