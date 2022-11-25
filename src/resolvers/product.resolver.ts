import {
  Arg,
  Mutation,
  Query,
  Ctx,
  Resolver,
  Authorized,
  UseMiddleware,
} from 'type-graphql';
import { Product } from '../schema/product.schema';
import ProductService from '../service/product.service';
import Context from '../types/context';
import { isAuth } from '../middlewares/isAuth';
import { logger } from '../middlewares/logger';
import { CreateProductInput } from '../types/create-product-input';
import { GetProductInput } from '../types/get-product-input';
import { UpdateProductInput } from '../types/update-product-input';

@Resolver()
export default class ProductResolver {
  constructor(private productService: ProductService) {
    this.productService = new ProductService();
  }

  @Authorized()
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Product)
  createProduct(
    @Arg('input') input: CreateProductInput,
    @Ctx() context: Context
  ) {
    const user = context.user;
    return this.productService.createProduct({ ...input, user: user!._id });
  }

  @Authorized()
  @UseMiddleware(isAuth, logger)
  @Query(() => [Product])
  products() {
    return this.productService.findProducts();
  }

  @Authorized()
  @UseMiddleware(isAuth, logger)
  @Query(() => Product)
  product(@Arg('input') input: GetProductInput) {
    return this.productService.findSingleProduct(input);
  }

  @Authorized()
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Product)
  updateProduct(
    @Arg('inputOne') inputOne: GetProductInput,
    @Arg('inputTwo') inputTwo: UpdateProductInput
  ) {
    return this.productService.updateProduct(inputOne, inputTwo);
  }

  @Authorized()
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Boolean)
  deleteProduct(@Arg('input') input: GetProductInput) {
    return this.productService.deleteProduct(input);
  }
}
