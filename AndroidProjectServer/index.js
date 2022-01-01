const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const UserService = require("./src/services/UserService");
const io = new Server(server);

app.use("*", (req, res) => {
  return res.json({
    status: "error",
    code: "not_found",
  });
});

let userService = new UserService();

io.on("connection", (socket) => {
  console.log("unknown socket connected");

  socket.on("login", ({ username }, callback) => {
    try {
      userService.addUser(username);
      socket.username = username;

      console.log(`${username} connected`);

      socket.emit("user.update", { user: userService.getUser(username) });
      io.emit("users.update", { users: userService.getUsers() });

      return callback({ status: "ok" });
    } catch (e) {
      return callback({ status: "error", code: e.message });
    }
  });

  socket.on("location.update", ({ location }) => {
    userService.updateLocation(socket.username, location);
    socket.emit("user.update", { user: userService.getUser(socket.username) });
    io.emit("users.update", { users: userService.getUsers() });
  });

  socket.on("call.initiate", ({ to }) => {
    let call = {
      from: socket.username,
      to: to,
      status: "requesting",
    };
    io.emit("call.update", { call: call });
  });

  socket.on("call.decline", ({ from }) => {
    let call = {
      from: from,
      to: socket.username,
      status: "declined",
    };
    io.emit("call.update", { call: call });
  });

  socket.on("call.accept", ({ from }) => {
    let call = {
      from: from,
      to: socket.username,
      status: "accepted",
    };
    io.emit("call.update", { call: call });
  });

  socket.on("call.cancel", ({ to }) => {
    let call = {
      from: socket.username,
      to: to,
      status: "canceled",
    };
    io.emit("call.update", { call: call });
  });

  socket.on("signaling", (data) => {
    io.emit("signaling", data);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      console.log(`${socket.username} socket disconnected`);
      userService.removeUser(socket.username);
      io.emit("users.update", { users: userService.getUsers() });
    } else {
      console.log("unknown socket disconnected");
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
