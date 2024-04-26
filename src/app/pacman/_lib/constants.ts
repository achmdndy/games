export const DIRECTION_RIGHT = 4;
export const DIRECTION_UP = 3;
export const DIRECTION_LEFT = 2;
export const DIRECTION_BOTTOM = 1;

export const GHOST_COUNT = 4;
export const GHOST_IMAGE_LOCATIONS = [
  { x: 0, y: 0 },
  { x: 176, y: 0 },
  { x: 0, y: 121 },
  { x: 176, y: 121 },
];

export const FPS: number = 30;
export const ONE_BLOCK_SIZE: number = 20;
export const WALL_COLOR: string = '#342DCA';
export const WALL_SPACE_WIDTH: number = ONE_BLOCK_SIZE / 1.5;
export const WALL_OFFSET: number = (ONE_BLOCK_SIZE - WALL_SPACE_WIDTH) / 2;
export const WALL_INNER_COLOR: string = 'black';
export const FOOD_COLOR = '#FEB897';
