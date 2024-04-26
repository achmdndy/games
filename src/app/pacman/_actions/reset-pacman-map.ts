import { PACMAN_MAP } from '../_lib/map';

const initialPacmanMap = [...PACMAN_MAP.map(row => [...row])];

export const resetPacmanMap = () => {
  for (let i = 0; i < PACMAN_MAP.length; i++) {
    for (let j = 0; j < PACMAN_MAP[0].length; j++) {
      PACMAN_MAP[i][j] = initialPacmanMap[i][j];
    }
  }
};
