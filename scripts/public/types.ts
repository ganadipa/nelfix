export interface TResponseStatus<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export type TAuthPostData = {
  id: string;
  username: string;
  email: string;
  token: string;
};

export type TUser = {
  id: string;
  username: string;
};

export type TSelfGetData = {
  username: string;
  token: string;
};

export type TLoginForm = {
  username: string;
  password: string;
};

export type TRegisterForm = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

export interface IApiResponseBase {
  status: 'success' | 'error';
  message: string;
}

export interface ISuccessResponse extends IApiResponseBase {
  status: 'success';
  data: any;
}

export interface IErrorResponse {
  error: string;
  message: string[];
  statusCode: number;
}
