import api from '.';

export const createQAPortalUser =
  async (data: { name: string; email: string; password: string; paymentId: string }) =>
  (await api().post('/users/create', data));
