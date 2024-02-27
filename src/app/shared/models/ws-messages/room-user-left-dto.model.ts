import { RoomUserDto } from "@app/shared/models/dto/room-user-dto.model";
import { RoomUser } from "../room-user.model";

export interface RoomUserLeftDto {
  user: RoomUser;
}