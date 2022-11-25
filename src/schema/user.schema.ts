import {
  getModelForClass,
  prop,
  pre,
  index,
  ReturnModelType,
  queryMethod,
} from '@typegoose/typegoose';
import { AsQueryMethod } from '@typegoose/typegoose/lib/types';
import bcrypt from 'bcrypt';
import { Field, ObjectType } from 'type-graphql';

function findByEmail(
  this: ReturnModelType<typeof User, QueryHelpers>,
  email: User['email']
) {
  return this.findOne({ email });
}

interface QueryHelpers {
  findByEmail: AsQueryMethod<typeof findByEmail>;
}

@pre<User>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const hasPassword = await bcrypt.hash(this.password, salt);

  this.password = hasPassword;
})
@index({ email: 1 })
@queryMethod(findByEmail)
@ObjectType({ description: 'The User Model' })
export class User {
  @Field(() => String)
  _id: string;

  @Field()
  @prop({ required: true })
  firstName: string;

  @Field()
  @prop({ required: true })
  lastName: string;

  @Field(() => String)
  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;

  @Field(() => Boolean)
  @prop({ default: false })
  confirmed: boolean;
  id: string | undefined;
}

export const UserModel = getModelForClass<typeof User>(User);
