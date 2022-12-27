import { User } from '../common/schemas/user.schema';

const userResponseSerializer = (user: User) => {
  delete user.password;
};

export default userResponseSerializer;
