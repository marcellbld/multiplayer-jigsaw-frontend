import { Graphics, Point } from "pixi.js";

export function createShape(centerX: number, centerY: number, width: number, height: number, tabs: number[],
    fillColor?:number, lineWidth?:number, lineColor?:number, lineAlpha?:number): Graphics {
  let shape = new Graphics();

  if(fillColor){
      shape.beginFill(fillColor);
  }

  if(lineWidth && lineColor && lineAlpha){
      shape.lineStyle(lineWidth, lineColor, lineAlpha);
  }
  
  let topTab = tabs[0];
  let rightTab = tabs[1];
  let bottomTab = tabs[2];
  let leftTab = tabs[3];
  let tileWidth = width;
  let tileHeight = height;
  let tileRatio = (tileHeight)/100;
  let widthRatio = tileWidth/tileHeight;
  let topLeftEdge = new Point(centerX-tileWidth/2, centerY-tileHeight/2);
  
  shape.moveTo(topLeftEdge.x, topLeftEdge.y);
  
  let curvyCoords = [
      0, 0, 35, 15, 37, 5,
      37, 5, 40, 0, 38, -5,
      38, -5, 20, -20, 50, -20,
      80, -20, 62, -5, 62, -5,
      60, 0, 63, 5, 63, 5,
      65, 15, 100, 0, 100, 0
      ];

  //Top
  for (var i = 0; i < curvyCoords.length / 6; i++) {
      var p1 = new Point (topLeftEdge.x + curvyCoords[i * 6 + 0] * tileRatio * widthRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 1] * tileRatio);
      var p2 = new Point (topLeftEdge.x + curvyCoords[i * 6 + 2] * tileRatio * widthRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 3] * tileRatio);
      var p3 = new Point (topLeftEdge.x + curvyCoords[i * 6 + 4] * tileRatio * widthRatio,
      topLeftEdge.y + topTab * curvyCoords[i * 6 + 5] * tileRatio);

      shape.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }
  //Right
  let topRightEdge = new Point(topLeftEdge.x + tileWidth, topLeftEdge.y);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
      let p1 = new Point (topRightEdge.x + -rightTab * curvyCoords[i * 6 + 1] * tileRatio * widthRatio,
      topRightEdge.y + curvyCoords[i * 6 + 0] * tileRatio);
      let p2 = new Point(topRightEdge.x + -rightTab * curvyCoords[i * 6 + 3] * tileRatio * widthRatio,
      topRightEdge.y + curvyCoords[i * 6 + 2] * tileRatio);
      let p3 = new Point (topRightEdge.x + -rightTab * curvyCoords[i * 6 + 5] * tileRatio * widthRatio,
      topRightEdge.y + curvyCoords[i * 6 + 4] * tileRatio);

      shape.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }
  
  //Bottom
  let bottomRightEdge = new Point(topRightEdge.x, topRightEdge.y + tileHeight);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
      let p1 = new Point (bottomRightEdge.x - curvyCoords[i * 6 + 0] * tileRatio * widthRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 1] * tileRatio);
      let p2 = new Point (bottomRightEdge.x - curvyCoords[i * 6 + 2] * tileRatio * widthRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 3] * tileRatio);
      let p3 = new Point (bottomRightEdge.x - curvyCoords[i * 6 + 4] * tileRatio * widthRatio,
      bottomRightEdge.y - bottomTab * curvyCoords[i * 6 + 5] * tileRatio);

      shape.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }
  //Left
  let bottomLeftEdge = new Point(bottomRightEdge.x - tileWidth, bottomRightEdge.y);
  for (let i = 0; i < curvyCoords.length / 6; i++) {
      let p1 = new Point (bottomLeftEdge.x - -leftTab * curvyCoords[i * 6 + 1] * tileRatio * widthRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 0] * tileRatio);
      let p2 = new Point (bottomLeftEdge.x - -leftTab * curvyCoords[i * 6 + 3] * tileRatio * widthRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 2] * tileRatio);
      let p3 = new Point (bottomLeftEdge.x - -leftTab * curvyCoords[i * 6 + 5] * tileRatio * widthRatio,
      bottomLeftEdge.y - curvyCoords[i * 6 + 4] * tileRatio);

      shape.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }

  return shape;
}