import { v4 } from 'uuid';
import { redis } from './redis';
import { confirmUserPrefix } from '../constants/constant';

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(confirmUserPrefix + token, userId, 'EX', 60 * 60 * 24);

  return `http://localhost:4000/graphql/user/confirm/${token}`;
};
