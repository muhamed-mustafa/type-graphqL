import { IsEmail, Length } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { PasswordMixin } from '../shared/PasswordInput';
import { IsEmailAlreadyExist } from '../utils/email';

@InputType()
export class CreateUserInput extends PasswordMixin(class {}) {
  @Field(() => String)
  @Length(1, 255)
  firstName: string;

  @Field(() => String)
  @Length(1, 255)
  lastName: string;

  @IsEmail()
  @Field(() => String)
  @IsEmailAlreadyExist({ message: 'email already exists' })
  email: string;
}
