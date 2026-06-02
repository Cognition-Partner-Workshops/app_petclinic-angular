import axios from 'axios';
import type { FieldError } from '../types';

const httpClient = axios.create({
  baseURL: '/petclinic/api/',
});

export function extractErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return String(error);
  }
  const response = error.response;
  if (!response) {
    return error.message;
  }
  const errorsHeader = response.headers['errors'];
  if (errorsHeader) {
    try {
      const errors: FieldError[] = typeof errorsHeader === 'string'
        ? JSON.parse(errorsHeader)
        : errorsHeader;
      if (Array.isArray(errors) && errors.length > 0 && errors[0].errorMessage) {
        return errors[0].errorMessage;
      }
    } catch {
      // ignore parse failure
    }
  }
  return `server returned code ${response.status} with body "${JSON.stringify(response.data)}"`;
}

export default httpClient;
