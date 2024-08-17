import { IApiResponseBase, IErrorResponse } from './types';

export class AjaxRequest<U extends IApiResponseBase> {
  constructor(private url: string) {}

  async post(data: Object): Promise<U | IErrorResponse> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const jsonData = await response.json();
      if (this.isValidSuccessResponse(jsonData)) {
        return jsonData as U;
      } else {
        return {
          status: 'error',
          message: jsonData.message,
          data: null,
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async get(): Promise<U | IErrorResponse> {
    try {
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const jsonData = await response.json();
      if (this.isValidSuccessResponse(jsonData)) {
        return jsonData as U;
      } else {
        return {
          status: 'error',
          message: jsonData.message,
          data: null,
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  private isValidSuccessResponse(data: any): data is U {
    return 'status' in data && data.status === 'success' && 'data' in data;
  }
}
