import { createShape } from "@app/utils/puzzle-shape-creator";
import { Container, Point, Texture, TilingSprite } from "pixi.js";
import { PixiBoardComponent } from "../components/pixi-board/pixi-board.component";
import { BevelFilter } from "@pixi/filter-bevel";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { OutlineFilter } from "@pixi/filter-outline";
import { RoomUser } from "@app/shared/models/room-user.model";

export class PuzzlePieceSprite extends Container {
  public static readonly SHAPE_OFFSET: number = 0.25;

  private sprite: TilingSprite;
  public tabs: number[] = [];
  
  private shadowFilter: DropShadowFilter;
  private outlineFilter: OutlineFilter;

  private interactedUser: RoomUser | null =  null;
  private completed: boolean = false;

  public idX: number;
  public idY: number;
  public group: number;

  constructor(private pixiBoard: PixiBoardComponent, puzzleTexture: Texture, tPieceWidth: number, tPieceHeight: number,
    tIdX: number, tIdY: number, scaleX: number, scaleY: number, piecesDimensions: number[]) {
    super();

    this.idX = tIdX;
    this.idY = tIdY;


    const offsetX = tPieceWidth*PuzzlePieceSprite.SHAPE_OFFSET;
    const offsetY = tPieceHeight*PuzzlePieceSprite.SHAPE_OFFSET;

    this.sprite = new TilingSprite(puzzleTexture);
    this.sprite.tileScale.set(scaleX, scaleY);
    this.sprite.width = tPieceWidth + offsetX*2;
    this.sprite.height = tPieceHeight + offsetY*2;

    this.width = this.sprite.width;
    this.height = this.sprite.height;
    this.sprite.pivot.set(this.width/2, this.height/2);
    this.pivot.set(this.width/2+offsetX, this.height/2+offsetY);

    const topPiece = pixiBoard.getPuzzlePiece(tIdX, tIdY-1);
    const leftPiece = pixiBoard.getPuzzlePiece(tIdX - 1, tIdY);

    const topTab = tIdY === 0 ? 0 : -topPiece!.tabs[2];
    const rightTab = tIdX === (piecesDimensions[0]-1) ? 0 : Math.random() < 0.5 ? 1 : -1;
    const bottomTab = tIdY === (piecesDimensions[1]-1) ? 0 : Math.random() < 0.5 ? 1 : -1;
    const leftTab = tIdX === 0 ? 0 : -leftPiece!.tabs[1];

    this.tabs = [topTab, rightTab, bottomTab,  leftTab];

    this.sprite.tilePosition.x = 0 - (tIdX) * tPieceWidth + offsetX;
    this.sprite.tilePosition.y = 0 - tIdY * tPieceHeight + offsetY;
    this.zIndex = 1;

    this.sprite.cacheAsBitmap = true;
    this.shadowFilter = new DropShadowFilter({pixelSize: 1, blur:1, alpha: 0.3});
    this.sprite.filters = [new BevelFilter(
      {thickness: Math.max(tPieceWidth*0.0175,1), lightAlpha: 0.15, shadowAlpha: 0.3, lightColor: 0xF7EFDA, rotation: 45, shadowColor: 0x000000
    })];
    this.outlineFilter = new OutlineFilter(2, 0xFF0000);

    const shape = createShape(this.sprite.width/2, this.sprite.height/2, tPieceWidth, tPieceHeight, this.tabs, 0x3498db);

    shape.alpha= 0.8;
    this.sprite.mask = shape;

    this.addChild(this.sprite);
    
    this.eventMode = "static";
    this.on('pointerdown', this.onDragStart)
    .on('pointerup', this.onDragEnd)
    .on('pointerupoutside', this.onDragEnd);
  }

  public setPosition(x: number, y: number): void {
    this.position.set(x,y);
  }

  private dragging: boolean = false;
  private dragOffset: Point = new Point(0,0);
  
  private onDragStart(event:any):void {
    if(this.interactedUser || this.completed) return;

    const target = event.currentTarget;

    const newPosition = event.data.getLocalPosition(target);
    this.dragOffset.set(newPosition.x * target.scale.x, newPosition.y * target.scale.y);

    this.dragging = true;
    this.pixiBoard.setActivePuzzlePiece(this);
    this.pixiBoard.dragPieceSprite(this);
    this.filters = [this.shadowFilter];
    this.zIndex = 999;
  }

  private onDragEnd(event:any):void {
    if(this.interactedUser || this.completed) return;

    const target = event.currentTarget;

    this.dragging = false;
    this.pixiBoard.releasePieceSprite(this);
    this.pixiBoard.setActivePuzzlePiece(null);

    this.zIndex = target.position.y-target.height/2;
    this.filters = [];
  }

  public onDragMove(event:any):void {
    if(!this.dragging || this.interactedUser || this.completed)
      return;

    const target = event.currentTarget;

    const newPosition = event.data.getLocalPosition(target.parent);
    newPosition.x = newPosition.x - this.dragOffset.x + this.pivot.x;
    newPosition.y = newPosition.y - this.dragOffset.y + this.pivot.y;

    this.setPosition(newPosition.x, newPosition.y);
    
    this.pixiBoard.dragPieceSprite(this);
    
    this.zIndex = target.position.y+target.height/2;
  }

  public setInteractedUser(interactedUser: RoomUser | null): void  {
    this.interactedUser = interactedUser;
    this.dragging = false;

    if(interactedUser){
      this.outlineFilter.color = interactedUser.getColorNumber();
      this.filters = [this.outlineFilter];
    } else {
      this.filters = [];
    }
  }

  public getInteractedUser(): RoomUser | null {
    return this.interactedUser;
  }

  public setGroup(group: number) {
    this.group = group;
  }

  public setCompleted(completed: boolean) {
    this.completed = completed;

    if(completed) {
      this.eventMode = 'none';
      this.zIndex = -999;
    }
  }
}