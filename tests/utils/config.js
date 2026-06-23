import 'dotenv/config';

export const config = {
  baseURL: process.env.BASE_URL,
  users: {
    admin: {
      name: 'John Doe',
      email: process.env.TEST_ADMIN_EMAIL,
      password: process.env.TEST_ADMIN_PASSWORD,
      wrongPassword: 'WrongPass123!',
    },
    worker: {
      name: 'Jane Smith',
      email: process.env.TEST_WORKER_EMAIL,
      password: process.env.TEST_WORKER_PASSWORD,
      wrongPassword: 'WrongPass123!',
    },
  },
  timeouts: {
    default: 5000,
    navigation: 10000
  },
};