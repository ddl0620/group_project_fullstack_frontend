import APIServices from '@/services/APIServices.js';

export const signInUser = async (userInput) => {
  const response = await APIServices.post('/api/v1/auth/sign-in', userInput);
  return response.data;
};

export const SignUpUser = async (userData) => {
  const response = await APIServices.post('/api/v1/auth/sign-up', userData);
  return response.data;
};

export const VerifySignUpAPI = async (data) => {
  const response = await APIServices.post('/api/v1/auth/verify-sign-up', data);
  return response.data;
};

export const SignOutAPI = async () => {
  const response = await APIServices.post('/api/v1/auth/sign-out');
  return response.data;
}
