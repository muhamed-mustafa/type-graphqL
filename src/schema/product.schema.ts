import { getModelForClass, index, prop, Ref } from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';
import { User } from './user.schema';
import { alphaNumeric } from '../utils/custom-alphabet';

@ObjectType({ description: 'The Product Model' })
@index({ productId: 1 })
export class Product {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  description: string;

  @Field(() => String)
  @prop({ required: true })
  price: string;

  @Field(() => String)
  @prop({ required: true, default: `product_${alphaNumeric(10)}` })
  productId: string;

  @Field(() => String)
  @prop({ required: true })
  image: string;
}

export const ProductModel = getModelForClass<typeof Product>(Product);
