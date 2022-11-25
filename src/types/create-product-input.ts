import { MinLength, MaxLength, IsNumber, Min } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @MinLength(50, {
    message: 'Description must be at least 50 characters',
  })
  @MaxLength(1000, {
    message: 'Description must not be more than 1000 characters',
  })
  @Field()
  description: string;

  @IsNumber()
  @Min(1)
  @Field()
  price: number;

  @Field()
  image: string;
}
