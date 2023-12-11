import { model, Schema } from 'mongoose';
import validator from 'validator';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    default: 'Jacques Yves Cousteau',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Explorer',
    minLength: 2,
    maxLength: 200,
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    validate: {
      validator: (v: string) => {
        const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
        return (!v || !v.trim().length) || exp.test(v);
      },
      message: 'Avatar is not a valid url',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => {
        return validator.isEmail(v);
      },
      message: 'Email is not a valid email address',
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    select: false,
  },
});

export default model<IUser>('user', userSchema);
