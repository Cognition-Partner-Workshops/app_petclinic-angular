import axios from 'axios';

const API_BASE_URL = 'http://localhost:9966/petclinic/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface FieldError {
  errorMessage: string;
}

export function parseError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errorsHeader = error.response?.headers?.['errors'];
    if (errorsHeader) {
      try {
        const errors: FieldError[] = JSON.parse(errorsHeader);
        if (Array.isArray(errors) && errors.length > 0 && errors[0].errorMessage) {
          return errors[0].errorMessage;
        }
      } catch {
        // fall through
      }
    }
    if (error.response) {
      return `server returned code ${error.response.status} with body "${JSON.stringify(error.response.data)}"`;
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'An unexpected error occurred';
}

export default api;
