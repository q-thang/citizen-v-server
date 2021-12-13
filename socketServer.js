let users = [];

const SocketServer = (socket) => {
  socket.on("joinUser", (onUser) => {
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
};

module.exports = SocketServer;
