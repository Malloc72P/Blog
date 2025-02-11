import { IRequester } from '@src/util/user-decorator';
import { User } from './user.entity';

//-------------------------------------------------------------------------
// findByEmail
//-------------------------------------------------------------------------
export interface UserServiceFindByEmailOrThrowInput {
  email: string;
}
export interface UserServiceFindByEmailOrThrowOutput {
  user: User;
}

//-------------------------------------------------------------------------
// findByIdOrThrow
//-------------------------------------------------------------------------
export interface UserServiceFindByIdOrThrowInput {
  id: string;
}
export interface UserServiceFindByIdOrThrowOutput {
  user: User;
}

//-------------------------------------------------------------------------
// findByEmail
//-------------------------------------------------------------------------
export interface UserServiceFindByEmailInput {
  email: string;
}
export interface UserServiceFindByEmailOutput {
  user: User | null;
}

//-------------------------------------------------------------------------
// create
//-------------------------------------------------------------------------
export interface UserServiceCreateInput {
  email: string;
  name: string;
  password: string;
}
export interface UserServiceCreateOutput {
  user: User;
}

//-------------------------------------------------------------------------
// updateProfile
//-------------------------------------------------------------------------
export interface UserServiceUpdateProfileInput {
  id: string;
  name: string;
  requester: IRequester;
}
export interface UserServiceUpdateProfileOutput {
  user: User;
}
