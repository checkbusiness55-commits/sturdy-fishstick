export const appParams = {
  appId: 'range-pilot-offline',
  token: localStorage.getItem('auth_token') || null,
  userId: localStorage.getItem('current_user_id') || null
};