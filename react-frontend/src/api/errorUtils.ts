import { AxiosError } from 'axios';

interface FieldError {
  objectName: string;
  fieldName: string;
  fieldValue: string;
  errorMessage: string;
}

export function extractErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const headersVal = err.response?.headers?.['errors'];
    if (headersVal) {
      try {
        const parsed: FieldError[] = JSON.parse(headersVal);
        if (parsed.length > 0) {
          return parsed[0].errorMessage;
        }
      } catch {
        // fall through
      }
    }
    if (err.response) {
      const body = err.response.data;
      if (typeof body === 'string' && body.length > 0) return body;
      if (typeof body === 'object' && body !== null && 'message' in body) {
        return String((body as Record<string, unknown>).message);
      }
      return `Error ${err.response.status}`;
    }
    return err.message;
  }
  return String(err);
}
