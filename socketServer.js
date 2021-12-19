const User = require("./models/User")

let users = [];

const SocketServer = (socket) => {
  socket.on("joinUser", (onUser) => {
    users = users.filter(u => u.id != onUser.id)
    users.push({
      id: onUser.id,
      regencyOn: onUser.regencyOn,
      location: onUser.location,
      socketId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    users.filter((user) => user.socketId !== socket.id);
  });

  // Citizen input
  socket.on("increaseCitizen", (currentUser) => {
    const { regencyCur, locationCur, check } = currentUser;
    const rank = {
      A2: "city",
      A3: "district",
      B1: "ward",
      B2: "village",
    };
    if (users.length > 0) {
      users.forEach((user) => {
        const rankName = rank[user.regencyOn];
        if (
          regencyCur === "B2" &&
          user.regencyOn !== "B2" &&
          user.location[rankName] === locationCur[rankName]
        ) {
          socket.to(user.socketId).emit("getCountCitizen", check);
        }

        if (
          regencyCur === "B1" &&
          !["B1", "B2"].includes(user.regencyOn) &&
          user.location[rankName] === locationCur[rankName]
        ) {
          socket.to(user.socketId).emit("getCountCitizen", check);
        }
      });
    }
  });

  //  Notification
  socket.on("pushNotification", async ({ _user, type }) => {
    if (_user.regency === 'A1') {
      _user.username = ''
    }
    if (type === 'NOTI_TO_PARENT') {
      let p_user = await User.findOne({ username: _user.username.slice(0, 4) })
      let socket_id = users.filter(u => u.id == p_user._id)[0]
      if (socket_id) {
        console.log('socket_id', socket_id.socketId)
        socket.to(socket_id.socketId).emit("newNotification", p_user._id)
      }
    } else if (type === 'NOTI_TO_CHILDS') {
      let childsUser = await User.find({
        username: { $regex: _user.username + '\\d{2}+' }
      })
      childsUser.map(child => {
        let socket_id = users.filter(u => u.id == child._id)[0]
        if (socket_id) {
          socket.to(socket_id.socketId).emit("newNotification", child._id)
        }
      })
    }
  })
};

module.exports = SocketServer;
