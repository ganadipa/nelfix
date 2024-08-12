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
      } else if (this.isErrorResponseExpected(jsonData)) {
        return jsonData;
      } else {
        return {
          error: 'Invalid Response',
          message: ['Invalid response from the server'],
          statusCode: 500,
        };
      }
    } catch (error) {
      return {
        error: 'Fetch Error',
        message: error instanceof Error ? [error.message] : ['Unknown error'],
        statusCode: 500,
      };
    }
  }

  private isValidSuccessResponse(data: any): data is U {
    return 'status' in data && data.status === 'success' && 'data' in data;
  }

  private isErrorResponseExpected(data: any): data is IErrorResponse {
    return (
      ('error' in data && 'message' in data && 'statusCode' in data) ||
      ('status' in data && data.status === 'error')
    );
  }
}
