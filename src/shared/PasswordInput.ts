import { MaxLength, MinLength } from 'class-validator';
import { ClassType, Field, InputType } from 'type-graphql';

export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType()
  class PasswordInput extends BaseClass {
    @MinLength(6, {
      message: 'password must be at least 6 characters long',
    })
    @MaxLength(50, {
      message: 'password must not be longer than 50 characters',
    })
    @Field(() => String)
    password: string;
  }

  return PasswordInput;
};
