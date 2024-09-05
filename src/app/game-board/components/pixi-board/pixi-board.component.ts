import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PuzzlePieceSprite } from '@app/game-board/models/PuzzlePieceSprite.model';
import { PuzzlePiece } from '@app/shared/models/puzzle-piece.model';
import { Puzzle } from '@app/shared/models/puzzle.model';
import { Viewport } from 'pixi-viewport';
import { Application, Assets, Container, Sprite, Texture } from 'pixi.js';
import { GameBoardComponent } from '../game-board/game-board.component';
import { RoomUser } from '@app/shared/models/room-user.model';

@Component({
  selector: 'app-pixi-board',
  templateUrl: './pixi-board.component.html',
  styleUrls: ['./pixi-board.component.scss']
})
export class PixiBoardComponent implements OnInit {
  @ViewChild('pixiContainer', { static: true }) pixiContainer: ElementRef;

  private pixiApp: Application;
  private pixiViewport: Viewport;

  private worldWidth = 2000;
  private worldHeight = 1500;

  private puzzleTexture: Texture;

  private pieceContainer: Container = new Container();

  private puzzlePieces: PuzzlePieceSprite[][] = [];

  private pieceMap: Map<number, PuzzlePieceSprite[]> = new Map();

  private puzzle: Puzzle;
  private activePuzzlePiece: PuzzlePieceSprite | null = null;

  constructor(private hostRef: ElementRef, private gameBoard: GameBoardComponent) {

  }

  ngOnInit(): void {
    this.pixiApp = new Application(
      {
        antialias: true,
        backgroundAlpha: 0,
        resolution: 1,
        resizeTo: this.hostRef.nativeElement
      }
    );

    this.pixiViewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: this.worldWidth,
      worldHeight: this.worldHeight,
      events: this.pixiApp.renderer.events
    });

    this.pixiApp.stage.addChild(this.pixiViewport);
    this.pixiViewport
      .drag()
      .pinch()
      .wheel()
      .decelerate();

    this.pieceContainer.sortableChildren = true;
    this.pieceContainer.eventMode = 'static';
    this.pieceContainer.on('globalpointermove', (e: any) => this.onDragMove(e));
  }

  ngAfterViewInit() {
    this.pixiContainer.nativeElement.appendChild(this.pixiApp.view);
  }


  private setWorldSize(worldWidth: number, worldHeight: number) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;

    this.pixiViewport.worldWidth = this.worldWidth;
    this.pixiViewport.worldHeight = this.worldHeight;

    this.pixiViewport?.clamp({ direction: 'all' });
    this.pixiViewport?.clampZoom({
      minWidth: this.pixiViewport.screenWidth / 3,
      minHeight: this.pixiViewport.screenHeight / 3,
      maxWidth: this.pixiViewport.worldWidth,
      maxHeight: this.pixiViewport.worldHeight,
    });
    this.pixiViewport.setZoom(0.01, true);
  }

  public init(puzzle: Puzzle): void {
    this.reset();

    this.puzzle = puzzle;

    this.setWorldSize(puzzle.worldSize[0], puzzle.worldSize[1]);

    console.log(puzzle.imageBase64);

    Assets.load(puzzle.imageBase64).then((texture: Texture) => {
      console.log(texture);

      const bgOffsetX = puzzle.pieceSize[0] * PuzzlePieceSprite.SHAPE_OFFSET;
      const bgOffsetY = puzzle.pieceSize[1] * PuzzlePieceSprite.SHAPE_OFFSET;
      const bgSprite = new Sprite(texture);
      bgSprite.width = puzzle.imageSize[0];
      bgSprite.height = puzzle.imageSize[1];
      bgSprite.alpha = 0.5;

      bgSprite.position.set(this.worldWidth / 2 - bgSprite.width / 2 - bgOffsetX,
        this.worldHeight / 2 - bgSprite.height / 2 - bgOffsetY);

      this.pixiViewport.addChild(bgSprite);
      this.pixiViewport.addChild(this.pieceContainer);

      this.pixiViewport.moveCenter(
        bgSprite.position.x + bgSprite.width / 2,
        bgSprite.position.y + bgSprite.height / 2);


      this.puzzleTexture = texture;
      this.createPieces(puzzle.pieceSize, puzzle.piecesDimensions, puzzle.puzzlePieces);

      this.pixiApp.resize();
    });
  }

  private reset() {
    this.pieceMap = new Map();
    this.puzzlePieces = [];
    this.pixiViewport.removeChildren();
    this.pieceContainer.removeChildren();
  }

  private createPieces(pieceSize: number[], piecesDimensions: number[], pieces: PuzzlePiece[]) {
    const scaleX = this.puzzle.imageSize[0] / this.puzzleTexture.width;
    const scaleY = this.puzzle.imageSize[1] / this.puzzleTexture.height;

    const pieceWidth = pieceSize[0];
    const pieceHeight = pieceSize[1];
    const piecesX = piecesDimensions[0];
    const piecesY = piecesDimensions[1];

    this.puzzlePieces = new Array(piecesX)
      .fill(undefined)
      .map(() => new Array(piecesY)
        .fill(undefined));

    for (let i = 0; i < piecesY; i++) {
      for (let j = 0; j < piecesX; j++) {

        const piece = pieces[i * piecesX + j];

        const pieceSprite = new PuzzlePieceSprite(this, this.puzzleTexture, pieceWidth, pieceHeight, j, i, scaleX, scaleY, piecesDimensions);
        pieceSprite.setPosition(piece.position[0], piece.position[1]);
        this.setGroup(pieceSprite, piece.group);

        if (piece.group === -9999) {
          pieceSprite.setCompleted(true);
        }

        this.puzzlePieces[j][i] = pieceSprite;

        this.pieceContainer.addChild(pieceSprite);
      }
    }
  }

  public dragPieceSprite(pieceSprite: PuzzlePieceSprite) {
    this.gameBoard.dragPiece(pieceSprite.idX, pieceSprite.idY, [pieceSprite.position.x, pieceSprite.position.y]);
    this.stopPanning();

    this.movePieceGroup(pieceSprite);
  }

  public releasePieceSprite(pieceSprite: PuzzlePieceSprite) {

    this.gameBoard.releasePiece(pieceSprite.idX, pieceSprite.idY, [pieceSprite.position.x, pieceSprite.position.y]);
    this.startPanning();
  }

  public movePiece(user: RoomUser, piece: PuzzlePiece) {
    const pieceSprite: PuzzlePieceSprite = this.puzzlePieces[piece.idX][piece.idY];

    pieceSprite.setPosition(piece.position[0], piece.position[1]);
    pieceSprite.setInteractedUser(user);

    this.movePieceGroup(pieceSprite);
  }

  private movePieceGroup(keyPieceSprite: PuzzlePieceSprite) {
    if (this.pieceMap.has(keyPieceSprite.group)) {
      for (let ps of this.pieceMap.get(keyPieceSprite.group)!) {

        if (ps !== keyPieceSprite) {
          const newX = keyPieceSprite.x + this.getRealX(ps.idX) - this.getRealX(keyPieceSprite.idX);
          const newY = keyPieceSprite.y + this.getRealY(ps.idY) - this.getRealY(keyPieceSprite.idY);

          ps.setPosition(newX, newY);
        }
      }
    }
  }

  public releasePiece(piece: PuzzlePiece, changedPieces: PuzzlePiece[] = []) {
    const pieceSprite: PuzzlePieceSprite = this.puzzlePieces[piece.idX][piece.idY];

    console.log("RELEASE " + piece.idX + " " + piece.idY);
    console.log(changedPieces);

    this.setGroup(pieceSprite, piece.group);
    pieceSprite.setPosition(piece.position[0], piece.position[1]);
    pieceSprite.setInteractedUser(null);
    if (piece.group === -9999) {
      pieceSprite.setCompleted(true);
    }

    for (let i = 0; i < changedPieces.length; i++) {
      const p = changedPieces[i];
      const pSprite = this.puzzlePieces[p.idX][p.idY];
      this.setGroup(pSprite, piece.group);

      if (piece.group === -9999) {
        pSprite.setCompleted(true);
      }
    }

    this.movePieceGroup(pieceSprite);
  }

  public setGroup(pieceSprite: PuzzlePieceSprite, group: number) {
    if (pieceSprite.group !== group && this.pieceMap.has(pieceSprite.group)) {
      this.pieceMap.set(pieceSprite.group, this.pieceMap.get(pieceSprite.group)!.filter(ps => ps !== pieceSprite));
    }

    pieceSprite.setGroup(group);

    if (this.pieceMap.has(group)) {
      if (!this.pieceMap.get(group)?.includes(pieceSprite)) {
        this.pieceMap.set(group, [...this.pieceMap.get(group)!, pieceSprite]);
      }
    } else {
      this.pieceMap.set(group, [pieceSprite]);
    }
  }

  public removeInteractionFromPieces(user: RoomUser) {
    for (let i = 0; i < this.puzzlePieces.length; i++) {
      for (let j = 0; j < this.puzzlePieces[0].length; j++) {
        const pieceSprite = this.puzzlePieces[i][j];
        if (pieceSprite.getInteractedUser()?.username == user.username) {
          pieceSprite.setInteractedUser(null);
        }
      }
    }
  }

  private onDragMove(event: any): void {
    if (this.activePuzzlePiece != null) {
      this.activePuzzlePiece.onDragMove(event);
    }
  }

  private stopPanning(): void {
    this.pixiViewport.plugins.pause('drag');
  }
  private startPanning(): void {
    this.pixiViewport.plugins.resume('drag');
  }

  public zoom(strength: number) {
    this.pixiViewport.zoom(strength, true);
  }

  public setActivePuzzlePiece(piece: PuzzlePieceSprite | null) {
    this.activePuzzlePiece = piece;
  }

  public getPuzzlePiece(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.puzzlePieces.length || y >= this.puzzlePieces[0].length)
      return null;
    return this.puzzlePieces[x][y];
  }

  private getRealX(idX: number): number {
    return this.puzzle.worldSize[0] / 2. - this.puzzle.imageSize[0] / 2. - this.puzzle.pieceSize[0] / 4. + idX * this.puzzle.pieceSize[0];
  }

  private getRealY(idY: number): number {
    return this.puzzle.worldSize[1] / 2. - this.puzzle.imageSize[1] / 2. - this.puzzle.pieceSize[1] / 4. + idY * this.puzzle.pieceSize[1];
  }
}
