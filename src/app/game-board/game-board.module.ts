import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { PixiBoardComponent } from './components/pixi-board/pixi-board.component';

@NgModule({
  declarations: [
    GameBoardComponent,
    PixiBoardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GameBoardComponent
  ]
})
export class GameBoardModule { }
