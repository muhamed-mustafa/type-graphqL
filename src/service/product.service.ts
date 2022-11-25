import { ProductModel } from '../schema/product.schema';
import { User } from '../schema/user.schema';
import { CreateProductInput } from '../types/create-product-input';
import { GetProductInput } from '../types/get-product-input';
import { UpdateProductInput } from '../types/update-product-input';
import { productNotFound } from '../constants/constant';
import { uplaodImage } from '../utils/cloudinary';

class ProductService {
  async createProduct(input: CreateProductInput & { user: User['_id'] }) {
    const product = new ProductModel(input);

    await uplaodImage(product.image);
    await product.save();

    return product;
  }

  async findProducts() {
    return ProductModel.find().lean();
  }

  async findSingleProduct({ productId }: GetProductInput) {
    const product = await ProductModel.findOne({ productId }).lean();

    if (!product) {
      throw new Error(productNotFound);
    }

    return product;
  }

  async updateProduct(
    { productId }: GetProductInput,
    input: UpdateProductInput
  ) {
    const product = await ProductModel.findOne({ productId }).lean();

    if (!product) {
      throw new Error(productNotFound);
    }

    await ProductModel.updateOne(
      {
        _id: product._id,
      },
      { $set: { ...input } },
      { new: true }
    );

    return product;
  }

  async deleteProduct({ productId }: GetProductInput): Promise<Boolean> {
    const product = await ProductModel.findOne({ productId }).lean();

    if (!product) {
      throw new Error(productNotFound);
    }

    (await ProductModel.deleteOne({ _id: product._id })).deletedCount;

    return true;
  }
}

export default ProductService;
