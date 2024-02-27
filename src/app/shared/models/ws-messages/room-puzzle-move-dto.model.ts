import { PuzzlePiece } from "../puzzle-piece.model";

export interface RoomPuzzleMoveDto {
  username: string;
  puzzlePiece: PuzzlePiece;
}