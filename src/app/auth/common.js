export const getUser = () => {
  const userStr = localStorage.getItem("email");
  if (userStr) return JSON.parse(userStr);
  else return null;
};

// return the token from the session storage
export const getToken = () => {
  return localStorage.getItem("authToken") || null;
};

// remove the token and user from the session storage
export const removeUserSession = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("email");
};

// set the token and user from the session storage
export const setUserSession = (token, user) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("email", JSON.stringify(user));
};
