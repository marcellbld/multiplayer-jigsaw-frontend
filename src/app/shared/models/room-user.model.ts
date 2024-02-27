import { UserColor } from "@app/room/enums/user-color.enum";

export class RoomUser {
  username: string;
  colorId: number;

  constructor(username: string, colorId: number) {
    this.username = username;
    this.colorId = colorId;
  }

  public getColor() : string {
    const colorName: string = `COLOR_${this.colorId}`;
    
    return "#" + (UserColor as any)[colorName];
  }

  public getColorNumber() : number {
    const colorName: string = `COLOR_${this.colorId}`;
    
    return (UserColor as any)[colorName];
  }
}