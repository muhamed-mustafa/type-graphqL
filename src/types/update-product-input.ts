import { MinLength, MaxLength, IsNumber, Min } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  name?: string;

  @MinLength(50, {
    message: 'Description must be at least 50 characters',
  })
  @MaxLength(1000, {
    message: 'Description must not be more than 1000 characters',
  })
  @Field({ nullable: true })
  description?: string;

  @IsNumber()
  @Min(1)
  @Field({ nullable: true })
  price?: number;
}
