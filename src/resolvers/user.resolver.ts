import {
  Arg,
  Mutation,
  Query,
  Ctx,
  Resolver,
  Authorized,
  UseMiddleware,
} from 'type-graphql';
import { isAuth } from '../middlewares/isAuth';
import { logger } from '../middlewares/logger';
import { User } from '../schema/user.schema';
import UserService from '../service/user.service';
import { ChangePasswordInput } from '../types/change-password-input';
import Context from '../types/context';
import { CreateUserInput } from '../types/create-user-input';
import { LoginInput } from '../types/login-user-input';
import { UpdateUserInput } from '../types/update-user-input';

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User)
  createUser(@Arg('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => User)
  login(@Arg('input') input: LoginInput, @Ctx() context: Context) {
    return this.userService.login(input, context);
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: Context) {
    return context.user;
  }

  @Mutation(() => Boolean)
  confirmUser(@Arg('token') token: string) {
    return this.userService.confirmUser(token);
  }

  @UseMiddleware(isAuth, logger)
  @Mutation(() => User)
  updateUser(@Arg('input') input: UpdateUserInput, @Ctx() context: Context) {
    return this.userService.updateUser(input, context);
  }

  @Authorized()
  @Mutation(() => Boolean)
  deleteUser(@Ctx() context: Context) {
    return this.userService.deleteUser(context);
  }

  @Mutation(() => Boolean)
  forgetPassword(@Arg('email') email: string) {
    return this.userService.forgetPassword(email);
  }

  @Mutation(() => User, { nullable: true })
  changePassword(
    @Arg('input') input: ChangePasswordInput,
    @Ctx() context: Context
  ) {
    return this.userService.changePassword(input, context);
  }

  @Mutation(() => Boolean)
  logOut(@Ctx() context: Context) {
    return this.userService.logOut(context);
  }
}
