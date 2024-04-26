import { RefObject } from 'react';
import {
  DIRECTION_BOTTOM,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  ONE_BLOCK_SIZE,
} from '../_lib/constants';
import { PACMAN_MAP } from '../_lib/map';
import Pacman from './pacman';

export default class Ghost {
  canvasContext: CanvasRenderingContext2D;

  ghostRef: RefObject<HTMLImageElement>;

  pacman: Pacman;

  randomTargetsForGhosts: { x: number; y: number }[];

  x: number;

  y: number;

  width: number;

  height: number;

  speed: number;

  imageX: number;

  imageY: number;

  imageWidth: number;

  imageHeight: number;

  range: number;

  direction: number;

  randomTargetIndex: number;

  target: { x: number; y: number };

  constructor(
    canvasContext: CanvasRenderingContext2D,
    ghostRef: RefObject<HTMLImageElement>,
    pacman: Pacman,
    randomTargetsForGhosts: { x: number; y: number }[],
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
    imageX: number,
    imageY: number,
    imageWidth: number,
    imageHeight: number,
    range: number,
  ) {
    this.canvasContext = canvasContext;
    this.ghostRef = ghostRef;
    this.pacman = pacman;
    this.randomTargetsForGhosts = randomTargetsForGhosts;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    this.direction = DIRECTION_RIGHT;
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.range = range;

    this.randomTargetIndex = parseInt((Math.random() * 4).toString());
    this.target = randomTargetsForGhosts[this.randomTargetIndex];
    setInterval(() => {
      this.changeRandomDirection();
    }, 10000);
  }

  changeRandomDirection() {
    this.randomTargetIndex += parseInt((Math.random() * 4).toString());
    this.randomTargetIndex = this.randomTargetIndex % 4;
  }

  moveProcess() {
    if (this.isInRangeOfPacman()) {
      this.target = this.pacman;
    } else {
      this.target = this.randomTargetsForGhosts[this.randomTargetIndex];
    }

    this.changeDirectionIfPossible();
    this.moveForwards();

    if (this.checkCollision()) {
      this.moveBackwards();
    }
  }

  eat() {
    for (let i = 0; i < PACMAN_MAP.length; i++) {
      for (let j = 0; j < PACMAN_MAP[0].length; j++) {
        if (
          PACMAN_MAP[i][j] == 2 &&
          this.getMapX() == j &&
          this.getMapY() == i
        ) {
          PACMAN_MAP[i][j] = 3;
        }
      }
    }
  }

  moveForwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x += this.speed;
        break;
      case DIRECTION_LEFT:
        this.x -= this.speed;
        break;
      case DIRECTION_UP:
        this.y -= this.speed;
        break;
      case DIRECTION_BOTTOM:
        this.y += this.speed;
        break;
    }
  }

  moveBackwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x -= this.speed;
        break;
      case DIRECTION_LEFT:
        this.x += this.speed;
        break;
      case DIRECTION_UP:
        this.y += this.speed;
        break;
      case DIRECTION_BOTTOM:
        this.y -= this.speed;
        break;
    }
  }

  checkCollision() {
    if (
      PACMAN_MAP[this.getMapY()][this.getMapX()] == 1 ||
      PACMAN_MAP[this.getMapYRightSide()][this.getMapX()] == 1 ||
      PACMAN_MAP[this.getMapY()][this.getMapXRightSide()] == 1 ||
      PACMAN_MAP[this.getMapYRightSide()][this.getMapXRightSide()] == 1
    ) {
      return true;
    }

    return false;
  }

  addNeighbors(
    poped: { x: number; y: number; moves: number[] },
    mp: number[][],
  ) {
    const queue = [];
    const numOfRows = mp.length;

    if (
      poped.x - 1 >= 0 &&
      poped.x - 1 < numOfRows &&
      mp[poped.y][poped.x - 1] != 1
    ) {
      const tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_LEFT);
      queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
    }

    if (
      poped.x + 1 >= 0 &&
      poped.x + 1 < numOfRows &&
      mp[poped.y][poped.x + 1] != 1
    ) {
      const tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_RIGHT);
      queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
    }

    if (
      poped.y - 1 >= 0 &&
      poped.y - 1 < numOfRows &&
      mp[poped.y - 1][poped.x] != 1
    ) {
      const tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_UP);
      queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
    }

    if (
      poped.y + 1 >= 0 &&
      poped.y + 1 < numOfRows &&
      mp[poped.y + 1][poped.x] != 1
    ) {
      const tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_BOTTOM);
      queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
    }

    return queue;
  }

  calculateNewDirection(map: number[][], destX: number, destY: number) {
    const mp: number[][] = [];

    for (let i = 0; i < map.length; i++) {
      mp[i] = map[i].slice();
    }

    const queue: { x: number; y: number; moves: number[] }[] = [
      { x: this.getMapX(), y: this.getMapY(), moves: [] },
    ];

    while (queue.length > 0) {
      const poped: { x: number; y: number; moves: number[] } =
        queue.shift() || queue[0];
      if (poped?.x == destX && poped?.y == destY) {
        return poped?.moves[0];
      } else {
        mp[poped.y][poped.x] = 1;
        const neighborList = this.addNeighbors(poped, mp);

        for (let i = 0; i < neighborList.length; i++) {
          queue.push(neighborList[i]);
        }
      }
    }

    return DIRECTION_UP;
  }

  isInRangeOfPacman() {
    const xDistance = Math.abs(this.pacman.getMapX() - this.getMapX());
    const yDistance = Math.abs(this.pacman.getMapY() - this.getMapY());

    if (
      Math.sqrt(xDistance * yDistance + yDistance * yDistance) <= this.range
    ) {
      return true;
    }

    return false;
  }

  changeDirectionIfPossible() {
    const tempDirection = this.direction;

    this.direction = this.calculateNewDirection(
      PACMAN_MAP,
      parseInt((this.target.x / ONE_BLOCK_SIZE).toString()),
      parseInt((this.target.y / ONE_BLOCK_SIZE).toString()),
    );

    this.moveForwards();

    if (this.checkCollision()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  draw() {
    this.canvasContext.save();
    this.canvasContext.drawImage(
      this.ghostRef.current!,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.x,
      this.y,
      this.width,
      this.height,
    );
    this.canvasContext.restore();
    this.canvasContext.beginPath();
    this.canvasContext.strokeStyle = 'red';
    this.canvasContext.arc(
      this.x + ONE_BLOCK_SIZE / 2,
      this.y + ONE_BLOCK_SIZE / 2,
      this.range * ONE_BLOCK_SIZE,
      0,
      2 * Math.PI,
    );
    this.canvasContext.stroke();
  }

  getMapX() {
    return parseInt((this.x / ONE_BLOCK_SIZE).toString());
  }

  getMapY() {
    return parseInt((this.y / ONE_BLOCK_SIZE).toString());
  }

  getMapXRightSide() {
    return parseInt(
      ((this.x * 0.9999 + ONE_BLOCK_SIZE) / ONE_BLOCK_SIZE).toString(),
    );
  }

  getMapYRightSide() {
    return parseInt(
      ((this.y * 0.9999 + ONE_BLOCK_SIZE) / ONE_BLOCK_SIZE).toString(),
    );
  }
}
