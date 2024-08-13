export interface TResponseStatus<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export type TLoginPostData = {
  id: string;
  username: string;
  email: string;
  token: string;
};

export type TUser = {
  id: string;
  username: string;
  email: string;
  role: TRole;
  firstName: string;
  lastName: string;
  token: string;
};

export type TSelfGetData = {
  username: string;
  token: string;
};

export type TRole = 'ADMIN' | 'USER';
