import { ApolloError } from 'apollo-server';
import { User, UserModel } from '../schema/user.schema';
import Context from '../types/context';
import { signJwt } from '../utils/jwt';
import { CreateUserInput } from '../types/create-user-input';
import { LoginInput } from '../types/login-user-input';
import bcrypt from 'bcrypt';
import { createConfirmationUrl } from '../utils/createConfirmationUrl';
import { sendEmail } from '../utils/sendEmail';
import { Arg, Ctx } from 'type-graphql';
import { redis } from '../utils/redis';
import { UpdateUserInput } from '../types/update-user-input';
import {
  mustBeConfirmedUser,
  userNotFound,
  invalidEmailOrPassword,
  forgotPasswordPrefix,
  confirmUserPrefix,
} from '../constants/constant';
import { v4 } from 'uuid';
import { ChangePasswordInput } from '../types/change-password-input';
import { handleCookieSession } from '../utils/cookie-session';

class UserService {
  async createUser(input: CreateUserInput) {
    const user = await UserModel.create(input);
    await sendEmail(user.email, await createConfirmationUrl(user.id));
    return user;
  }

  async login({ email, password }: LoginInput, context: Context) {
    const user = await UserModel.find().findByEmail(email).lean();

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.confirmed) return new ApolloError(mustBeConfirmedUser);

      await handleCookieSession(context, user);
      return user;
    } else {
      throw new ApolloError(invalidEmailOrPassword);
    }
  }

  async logOut(context: Context) {
    return new Promise((resolve, reject) => {
      context.req.session.destroy((err) => {
        if (err) return reject(err);

        context.res.clearCookie('qid');
        context.res.cookie('accessToken', '', { maxAge: 1 });
        return resolve(true);
      });
    });
  }

  async confirmUser(@Arg('token') token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);
    if (!userId) return false;

    await UserModel.updateOne({ _id: userId }, { $set: { confirmed: true } });
    await redis.del(token);

    return true;
  }

  async updateUser(@Arg('input') input: UpdateUserInput, { req }: Context) {
    let user = await UserModel.findById(req.session.userId);

    if (!user) throw new ApolloError(userNotFound);

    await UserModel.updateOne(
      { _id: req.session.userId },
      { $set: { ...input } },
      { new: true }
    );

    return user;
  }

  async deleteUser(context: Context) {
    return (await UserModel.deleteOne({ _id: context.user?._id })).deletedCount;
  }

  async forgetPassword(@Arg('email') email: string): Promise<Boolean> {
    const user = await UserModel.findOne({ email });

    if (!user) throw new ApolloError(userNotFound);

    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, 'EX', 60 * 60 * 24);

    await sendEmail(
      email,
      `http://localhost:4000/graphql/user/change-password/${token}`
    );

    return true;
  }

  async changePassword(
    { password, token }: ChangePasswordInput,
    context: Context
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);
    if (!userId) return null;

    const user = await UserModel.findById(userId);
    if (!user) throw new ApolloError(userNotFound);

    await redis.del(forgotPasswordPrefix + token);
    user.password = password;
    await user.save();

    await handleCookieSession(context, { ...user });
    return user;
  }
}

export default UserService;
