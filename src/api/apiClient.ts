import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_REST_API_URL || 'http://localhost:9966/petclinic/api/',
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const errorsHeader = error.response.headers['errors'];
      if (errorsHeader) {
        try {
          const errors = JSON.parse(errorsHeader);
          if (Array.isArray(errors) && errors.length > 0 && errors[0].errorMessage) {
            console.error(errors[0].errorMessage);
          }
        } catch {
          // ignore parse error
        }
      }
      console.error(`Request failed with status ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
