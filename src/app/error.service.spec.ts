import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler } from './error.service';

describe('HttpErrorHandler', () => {
  let handler: HttpErrorHandler;

  beforeEach(() => {
    handler = new HttpErrorHandler();
    spyOn(console, 'error');
  });

  describe('createHandleError', () => {
    it('should return a curried function bound to the service name', () => {
      const handleError = handler.createHandleError('TestService');
      expect(typeof handleError).toBe('function');
    });
  });

  describe('handleError', () => {
    it('should handle a client-side ErrorEvent', (done) => {
      const errorEvent = new ErrorEvent('Network error', {
        message: 'simulated network error',
      });
      const errorResponse = new HttpErrorResponse({
        error: errorEvent,
        status: 0,
        statusText: 'Unknown Error',
      });

      const errorFn = handler.handleError('TestService', 'testOp', []);
      errorFn(errorResponse).subscribe({
        error: (msg) => {
          expect(msg).toBe('simulated network error');
          expect(console.error).toHaveBeenCalledWith(errorResponse);
          expect(console.error).toHaveBeenCalledWith(
            'TestService::testOp failed: simulated network error'
          );
          done();
        },
      });
    });

    it('should handle a server-side error with status code', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: 'Not Found',
        status: 404,
        statusText: 'Not Found',
      });

      const errorFn = handler.handleError('TestService', 'testOp', []);
      errorFn(errorResponse).subscribe({
        error: (msg) => {
          expect(msg).toBe('server returned code 404 with body "Not Found"');
          expect(console.error).toHaveBeenCalledWith(errorResponse);
          done();
        },
      });
    });

    it('should extract Spring MVC errorMessage from errors header', (done) => {
      const headers = new HttpHeaders().set(
        'errors',
        JSON.stringify([{ errorMessage: 'lastName must not be empty' }])
      );
      const errorResponse = new HttpErrorResponse({
        error: 'Bad Request',
        status: 400,
        statusText: 'Bad Request',
        headers,
      });

      const errorFn = handler.handleError('TestService', 'testOp', []);
      errorFn(errorResponse).subscribe({
        error: (msg) => {
          expect(msg).toBe('lastName must not be empty');
          done();
        },
      });
    });

    it('should fall back to default message when errors header has no errorMessage', (done) => {
      const headers = new HttpHeaders().set(
        'errors',
        JSON.stringify([{ field: 'lastName' }])
      );
      const errorResponse = new HttpErrorResponse({
        error: 'Bad Request',
        status: 400,
        statusText: 'Bad Request',
        headers,
      });

      const errorFn = handler.handleError('TestService', 'testOp', []);
      errorFn(errorResponse).subscribe({
        error: (msg) => {
          expect(msg).toBe('server returned code 400 with body "Bad Request"');
          done();
        },
      });
    });

    it('should fall back to default message when errors header is an empty array', (done) => {
      const headers = new HttpHeaders().set('errors', JSON.stringify([]));
      const errorResponse = new HttpErrorResponse({
        error: 'Bad Request',
        status: 400,
        statusText: 'Bad Request',
        headers,
      });

      const errorFn = handler.handleError('TestService', 'testOp', []);
      errorFn(errorResponse).subscribe({
        error: (msg) => {
          expect(msg).toBe('server returned code 400 with body "Bad Request"');
          done();
        },
      });
    });

    it('should use default parameter values when none are provided', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
        statusText: 'Internal Server Error',
      });

      const errorFn = handler.handleError();
      errorFn(errorResponse).subscribe({
        error: (msg) => {
          expect(console.error).toHaveBeenCalledWith(
            '::operation failed: server returned code 500 with body "Server Error"'
          );
          done();
        },
      });
    });
  });
});
