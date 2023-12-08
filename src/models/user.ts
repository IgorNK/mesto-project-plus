import { model, Schema } from 'mongoose';

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
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 30,
    select: false,
  }
});

export default model<IUser>('user', userSchema);
