import { PuzzlePiece } from "../puzzle-piece.model";

export interface RoomPuzzleReleaseDto {
  puzzlePiece: PuzzlePiece;
  changedPieces: PuzzlePiece[];
}