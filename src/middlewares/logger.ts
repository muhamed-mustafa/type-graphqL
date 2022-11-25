import { MiddlewareFn } from 'type-graphql';
import Context from '../types/context';

export const logger: MiddlewareFn<Context> = async ({ args }, next) => {
  console.log('args: ', args);
  return next();
};
