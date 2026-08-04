export const getAuthReturnPath = () => {
  return localStorage.getItem('authReturnTo') || '/';
};

export const setAuthReturnPath = (path) => {
  localStorage.setItem('authReturnTo', path);
};

export const clearAuthReturnPath = () => {
  localStorage.removeItem('authReturnTo');
};
export const safeReturnTo = (path) => path;
