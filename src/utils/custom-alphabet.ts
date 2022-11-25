import { customAlphabet } from 'nanoid';

export const alphaNumeric = (length: number) => {
  return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWQYZ', length)();
};
