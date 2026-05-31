import {HttpErrorHandler} from './error.service';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';

describe('HttpErrorHandler', () => {
  let handler: HttpErrorHandler;

  beforeEach(() => {
    handler = new HttpErrorHandler();
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  it('should create a handle error function', () => {
    const handleError = handler.createHandleError('TestService');
    expect(handleError).toBeDefined();
    expect(typeof handleError).toBe('function');
  });

  it('should handle client-side ErrorEvent', () => {
    const handleError = handler.createHandleError('TestService');
    const errorHandler = handleError('getItems', []);

    const errorEvent = new ErrorEvent('Network error', {message: 'client error'});
    const httpError = new HttpErrorResponse({
      error: errorEvent,
      status: 0,
      statusText: 'Unknown',
      headers: new HttpHeaders()
    });

    spyOn(console, 'error');
    errorHandler(httpError).subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toContain('client error')
    });
  });

  it('should handle server-side error', () => {
    const handleError = handler.createHandleError('TestService');
    const errorHandler = handleError('getItems', []);

    const httpError = new HttpErrorResponse({
      error: 'Not Found',
      status: 404,
      statusText: 'Not Found',
      headers: new HttpHeaders()
    });

    spyOn(console, 'error');
    errorHandler(httpError).subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toContain('server returned code 404')
    });
  });

  it('should parse errors header with errorMessage', () => {
    const handleError = handler.createHandleError('TestService');
    const errorHandler = handleError('getItems', []);

    const headers = new HttpHeaders().set('errors', JSON.stringify([{errorMessage: 'Field is required'}]));
    const httpError = new HttpErrorResponse({
      error: 'Validation Error',
      status: 400,
      statusText: 'Bad Request',
      headers: headers
    });

    spyOn(console, 'error');
    errorHandler(httpError).subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toBe('Field is required')
    });
  });

  it('should handle errors header without errorMessage', () => {
    const handleError = handler.createHandleError('TestService');
    const errorHandler = handleError('getItems', []);

    const headers = new HttpHeaders().set('errors', JSON.stringify([{field: 'name'}]));
    const httpError = new HttpErrorResponse({
      error: 'Validation Error',
      status: 400,
      statusText: 'Bad Request',
      headers: headers
    });

    spyOn(console, 'error');
    errorHandler(httpError).subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toContain('server returned code 400')
    });
  });

  it('should handle empty errors header array', () => {
    const handleError = handler.createHandleError('TestService');
    const errorHandler = handleError('getItems', []);

    const headers = new HttpHeaders().set('errors', JSON.stringify([]));
    const httpError = new HttpErrorResponse({
      error: 'Error',
      status: 500,
      statusText: 'Server Error',
      headers: headers
    });

    spyOn(console, 'error');
    errorHandler(httpError).subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toContain('server returned code 500')
    });
  });

  it('should use default values for handleError params', () => {
    spyOn(console, 'error');
    const errorFn = handler.handleError();
    expect(errorFn).toBeDefined();

    const httpError = new HttpErrorResponse({
      error: 'test',
      status: 500,
      statusText: 'Error',
      headers: new HttpHeaders()
    });

    errorFn(httpError).subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toContain('server returned code 500')
    });
  });
});
