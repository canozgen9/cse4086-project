class UserService {
  users = [];

  addUser(username) {
    username = username.trim();

    if (this.doesUsernameExist(username)) {
      throw new Error("username already exists.");
    }

    this.users.push({
      username: username,
      location: null,
    });
  }

  updateLocation(username, location) {
    this.users = this.users.map((u) => {
      return u.username === username ? { ...u, location: location } : u;
    });
  }

  removeUser(username) {
    this.users = this.users.filter((u) => u.username !== username);
  }

  getUser(username) {
    return this.users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  }

  doesUsernameExist(username) {
    return !!this.getUser(username);
  }

  getUsers() {
    return this.users;
  }
}

module.exports = UserService;