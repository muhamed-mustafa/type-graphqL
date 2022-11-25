import { IsEmail, Length } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { IsEmailAlreadyExist } from '../utils/email';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @Length(1, 255)
  firstName?: string;

  @Field({ nullable: true })
  @Length(1, 255)
  lastName?: string;

  @IsEmail()
  @Field({ nullable: true })
  @IsEmailAlreadyExist({ message: 'email already exists' })
  email?: string;
}
