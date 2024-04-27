import { TICTACTOE_BOARD } from '../_lib/board';

const initialTicTacToeBoard = [...TICTACTOE_BOARD.map(row => [...row])];

export const resetTicTacToeBoard = () => {
  for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
    for (let j = 0; j < TICTACTOE_BOARD[0].length; j++) {
      TICTACTOE_BOARD[i][j] = initialTicTacToeBoard[i][j];
    }
  }
};
