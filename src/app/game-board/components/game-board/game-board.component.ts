import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Room } from '@app/shared/models/room.model';
import { PixiBoardComponent } from '../pixi-board/pixi-board.component';
import { Subscription } from 'rxjs';
import { RoomService } from '@app/core/services/room.service';
import { SocketMessage } from '@app/core/ws/models/socket-message.model';
import { SocketEventType } from '@app/core/ws/models/socket-event-type.enum';
import { RoomPuzzleMoveDto } from '@app/shared/models/ws-messages/room-puzzle-move-dto.model';
import { RoomPuzzleReleaseDto } from '@app/shared/models/ws-messages/room-puzzle-release-dto.model';
import { SocketGameService } from '@app/core/ws/socket-game.service';
import { RoomUser } from '@app/shared/models/room-user.model';
import { RoomUserLeftDto } from '@app/shared/models/ws-messages/room-user-left-dto.model';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(PixiBoardComponent) pixiBoard: PixiBoardComponent;

  private subscriptions: Subscription[] = [];

  constructor(private roomService: RoomService, private socketGameService: SocketGameService) {

  }
  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.roomService.roomSubject.subscribe(
        room => {
          if (room.id) {
            this.init(room);
            this.subscriptions[0].unsubscribe();
          }
        }
      ),
      this.roomService.roomEvent.subscribe((message) => this.handleRoomEvent(message))
    );
    if (this.roomService.roomSubject.value.id) {
      this.init(this.roomService.roomSubject.value);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  private handleRoomEvent(message: SocketMessage) {
    if (message.event === SocketEventType.Room_Puzzle_Move) {
      const body: RoomPuzzleMoveDto = message.body;
      this.puzzleMoveEvent(body);
    } else if (message.event === SocketEventType.Room_Puzzle_Release) {
      const body: RoomPuzzleReleaseDto = message.body;

      this.puzzleReleaseEvent(body);
    } else if (message.event === SocketEventType.Room_UserLeft) {
      const body: RoomUserLeftDto = message.body;
      this.pixiBoard.removeInteractionFromPieces(body.user);
    }
  }

  private puzzleMoveEvent(roomPuzzleMove: RoomPuzzleMoveDto): void {
    console.log("PUZZLE MOVE EVENT ");
    console.log(roomPuzzleMove);


    if (roomPuzzleMove.username === this.socketGameService.getUsername())
      return;

    const user: RoomUser | undefined = this.roomService.getUserByUsername(roomPuzzleMove.username);

    if (!user) {
      return;
    }

    this.pixiBoard.movePiece(user, roomPuzzleMove.puzzlePiece);
  }

  private puzzleReleaseEvent(roomPuzzleRelease: RoomPuzzleReleaseDto): void {
    this.pixiBoard.releasePiece(roomPuzzleRelease.puzzlePiece, roomPuzzleRelease.changedPieces);
  }

  public dragPiece(idX: number, idY: number, position: number[]) {
    this.roomService.sendMovePuzzlePiece({ idX, idY, position, group: 0 });
  }

  public releasePiece(idX: number, idY: number, position: number[]) {
    this.roomService.sendReleasePuzzlePiece({ idX, idY, position, group: 0 });
  }

  public zoom(strength: number) {
    this.pixiBoard.zoom(strength);
  }

  public init(room: Room): void {
    this.pixiBoard.init(room.puzzle);
  }

}
