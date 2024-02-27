import { RoomUserDto } from "./dto/room-user-dto.model";
import { Puzzle } from "./puzzle.model";
import { RoomUser } from "./room-user.model";
import { User } from "./user.model";

export class Room {
  id: string;
  userCapacity: number;
  users: RoomUser[];
  puzzle: Puzzle;

  constructor(id: string, userCapacity: number, users: RoomUser[], puzzle: Puzzle) {
    this.id = id;
    this.userCapacity = userCapacity;
    this.users = users;
    this.puzzle = puzzle;
  }
}