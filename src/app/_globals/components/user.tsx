export const User = {
  getLoggedInUserDisplayName,
  getLoggedInUserRole,
  isAdmin,
  getLoggedInUserEmailId,
  isManager

};

function getLoggedInUserDisplayName() {
  let user = JSON.parse(localStorage.getItem("current_user")!);
  return user.name;
}

function getLoggedInUserEmailId() {
  let user = JSON.parse(localStorage.getItem("current_user")!);
  return user.email;
}

function getLoggedInUserRole() {
  let user = JSON.parse(localStorage.getItem("current_user")!);
  if (user) {
    return user.role;
  }
  return undefined;
}

function isEmployee() {
  let user = JSON.parse(localStorage.getItem("current_user")!);
  if (user) {
    if (user.role === "Employee") {
      return true;
    }
  }
  return false;
}

function isAdmin() {
  let user = JSON.parse(localStorage.getItem("current_user")!);
  if (user) {
    if (
      user.role === "Admin" || user.role === "Super Admin"
    ) {
      return true;
    }
  }
  return false;
}
function isManager() {
  let user = JSON.parse(localStorage.getItem("current_user")!);
  if (user) {
    if (
      user.role === "Admin" || user.role === "Super Admin" || user.role === "Manager"
    ) {
      return true;
    }
  }
  return false;
}

