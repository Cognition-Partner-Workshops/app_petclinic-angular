import axios from 'axios';

const API_BASE = 'http://localhost:9966/petclinic/api/';

const client = axios.create({
  baseURL: API_BASE,
});

export default client;
