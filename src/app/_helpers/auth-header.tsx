export function authHeader() {
  // return authorization header with jwt token
  let current_user = localStorage.getItem("current_user");
  let user;
  if (current_user) {
    user = JSON.parse(current_user);
  }
  if (user && user.authToken) {
    return {
      Authorization: "Bearer " + user.authToken,
      "Content-Type": "application/json",
      dataType: "jsonp" + user.authToken,
    };
  } else {
    return {};
  }
}
