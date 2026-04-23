import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler } from './error.service';

describe('HttpErrorHandler', () => {
  let service: HttpErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpErrorHandler]
    });
    service = TestBed.inject(HttpErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a curried handleError function via createHandleError', () => {
    const handler = service.createHandleError('TestService');
    expect(handler).toBeTruthy();
    expect(typeof handler).toBe('function');
  });

  it('should handle client-side ErrorEvent', () => {
    const handler = service.createHandleError('TestService');
    const errorHandler = handler('testOp', 'fallback');
    const errorEvent = new ErrorEvent('Network error', { message: 'client error' });
    const httpError = new HttpErrorResponse({ error: errorEvent, status: 0 });

    errorHandler(httpError).subscribe({
      error: (msg: string) => {
        expect(msg).toBe('client error');
      }
    });
  });

  it('should handle server-side error', () => {
    const handler = service.createHandleError('TestService');
    const errorHandler = handler('testOp', 'fallback');
    const httpError = new HttpErrorResponse({ error: 'Not Found', status: 404 });

    errorHandler(httpError).subscribe({
      error: (msg: string) => {
        expect(msg).toContain('server returned code 404');
      }
    });
  });

  it('should extract errorMessage from errors header', () => {
    const handler = service.createHandleError('TestService');
    const errorHandler = handler('testOp', 'fallback');
    const headers = new HttpHeaders().set('errors', JSON.stringify([{ errorMessage: 'Field is required' }]));
    const httpError = new HttpErrorResponse({ error: 'Bad Request', status: 400, headers });

    errorHandler(httpError).subscribe({
      error: (msg: string) => {
        expect(msg).toBe('Field is required');
      }
    });
  });

  it('should use server error message when errors header has no errorMessage', () => {
    const handler = service.createHandleError('TestService');
    const errorHandler = handler('testOp', 'fallback');
    const headers = new HttpHeaders().set('errors', JSON.stringify([{ field: 'name' }]));
    const httpError = new HttpErrorResponse({ error: 'Bad Request', status: 400, headers });

    errorHandler(httpError).subscribe({
      error: (msg: string) => {
        expect(msg).toContain('server returned code 400');
      }
    });
  });

  it('should use server error message when errors header is empty array', () => {
    const handler = service.createHandleError('TestService');
    const errorHandler = handler('testOp', 'fallback');
    const headers = new HttpHeaders().set('errors', JSON.stringify([]));
    const httpError = new HttpErrorResponse({ error: 'Bad Request', status: 400, headers });

    errorHandler(httpError).subscribe({
      error: (msg: string) => {
        expect(msg).toContain('server returned code 400');
      }
    });
  });

  it('should use server error message when errors header is not an array', () => {
    const handler = service.createHandleError('TestService');
    const errorHandler = handler('testOp', 'fallback');
    const headers = new HttpHeaders().set('errors', JSON.stringify({ errorMessage: 'not array' }));
    const httpError = new HttpErrorResponse({ error: 'Bad Request', status: 400, headers });

    errorHandler(httpError).subscribe({
      error: (msg: string) => {
        expect(msg).toContain('server returned code 400');
      }
    });
  });

  it('should use default parameters when none provided', () => {
    const errorFn = service.handleError();
    const httpError = new HttpErrorResponse({ error: 'Server Error', status: 500 });

    errorFn(httpError).subscribe({
      error: (msg: string) => {
        expect(msg).toContain('server returned code 500');
      }
    });
  });

  it('should use default serviceName when createHandleError called without args', () => {
    const handler = service.createHandleError();
    const errorHandler = handler();
    const httpError = new HttpErrorResponse({ error: 'Server Error', status: 500 });

    errorHandler(httpError).subscribe({
      error: (msg: string) => {
        expect(msg).toContain('server returned code 500');
      }
    });
  });
});
