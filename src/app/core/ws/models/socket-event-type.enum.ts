export enum SocketEventType {
  Lobby_InitialData = "Lobby_InitialData",
  Lobby_RoomCreated = "Lobby_RoomCreated",
  Lobby_RoomRemoved = "Lobby_RoomRemoved",
  UserLobby_FailedToJoinToRoom = "UserLobby_FailedToJoinToRoom",
  Room_InitialData = "Room_InitialData",
  Room_UserJoined = "Room_UserJoined",
  Room_UserLeft = "Room_UserLeft",
  Room_Puzzle_Move = "Room_Puzzle_Move",
  Room_Puzzle_Release = "Room_Puzzle_Release"
}