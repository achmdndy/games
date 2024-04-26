import { RefObject } from 'react';
import {
  DIRECTION_BOTTOM,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  ONE_BLOCK_SIZE,
} from '../_lib/constants';
import { PACMAN_MAP } from '../_lib/map';
import Ghost from './ghost';

export default class Pacman {
  canvasContext: CanvasRenderingContext2D;

  pacmanRef: RefObject<HTMLImageElement>;

  ghosts: Ghost[];

  x: number;

  y: number;

  width: number;

  height: number;

  speed: number;

  direction: number;

  nextDirection: number;

  currentFrame: number;

  frameCount: number;

  constructor(
    canvasContext: CanvasRenderingContext2D,
    pacmanRef: RefObject<HTMLImageElement>,
    ghosts: Ghost[],
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
  ) {
    this.canvasContext = canvasContext;
    this.pacmanRef = pacmanRef;
    this.ghosts = ghosts;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    this.direction = DIRECTION_RIGHT;
    this.nextDirection = this.direction;
    this.currentFrame = 1;
    this.frameCount = 7;

    setInterval(() => {
      this.changeAnimation();
    }, 100);
  }

  moveProcess() {
    this.changeDirectionIfPossible();
    this.moveForwards();

    if (this.checkCollision()) {
      this.moveBackwards();
    }
  }

  eat(setScore: () => void) {
    for (let i = 0; i < PACMAN_MAP.length; i++) {
      for (let j = 0; j < PACMAN_MAP[0].length; j++) {
        if (
          PACMAN_MAP[i][j] == 2 &&
          this.getMapX() == j &&
          this.getMapY() == i
        ) {
          PACMAN_MAP[i][j] = 3;
          setScore();
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

  checkGhostCollision() {
    for (let i = 0; i < this.ghosts?.length; i++) {
      const ghost = this.ghosts[i];

      if (
        ghost.getMapX() == this.getMapX() &&
        ghost.getMapY() == this.getMapY()
      ) {
        return true;
      }
    }

    return false;
  }

  changeDirectionIfPossible() {
    if (this.direction == this.nextDirection) return;

    const tempDirection = this.direction;
    this.direction = this.nextDirection;
    this.moveForwards();
    if (this.checkCollision()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  changeAnimation() {
    this.currentFrame =
      this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
  }

  draw() {
    this.canvasContext.save();
    this.canvasContext.translate(
      this.x + ONE_BLOCK_SIZE / 2,
      this.y + ONE_BLOCK_SIZE / 2,
    );
    this.canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
    this.canvasContext.translate(
      -this.x - ONE_BLOCK_SIZE / 2,
      -this.y - ONE_BLOCK_SIZE / 2,
    );
    this.canvasContext.drawImage(
      this.pacmanRef.current!,
      (this.currentFrame - 1) * ONE_BLOCK_SIZE,
      0,
      ONE_BLOCK_SIZE,
      ONE_BLOCK_SIZE,
      this.x,
      this.y,
      this.width,
      this.height,
    );
    this.canvasContext.restore();
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
