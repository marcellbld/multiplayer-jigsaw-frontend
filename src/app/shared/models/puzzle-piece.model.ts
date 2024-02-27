export class PuzzlePiece {
  idX: number;
  idY: number;
  position: number[];
  group: number;

  constructor(idX: number, idY: number, position: number[], group: number) {
    this.idX = idX;
    this.idY = idY;
    this.position = position;
    this.group = group;
  }
}