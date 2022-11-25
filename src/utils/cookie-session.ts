import { User } from '../schema/user.schema';
import Context from '../types/context';
import { signJwt } from './jwt';

export const handleCookieSession = async (context: Context, user: User) => {
  const accessToken = signJwt(user);

  context.res.cookie('accessToken', accessToken, {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
  });

  context.req.session!.userId = user._id;
};
