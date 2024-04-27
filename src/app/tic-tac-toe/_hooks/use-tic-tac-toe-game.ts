import { useCallback, useEffect, useRef, useState } from 'react';
import { resetTicTacToeBoard } from '../_actions/reset-tic-tac-toe-board';
import { TICTACTOE_BOARD } from '../_lib/board';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../_lib/constants';

export const useTicTacToeGame = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [start, setStart] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(5);

  const removeComponent = () => {
    if (canvasRef.current) {
      parentRef.current?.removeChild(canvasRef.current);
      canvasRef.current = null;
    }
  };

  const createComponent = () => {
    const parent = parentRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = BOARD_WIDTH;
    canvas.height = BOARD_HEIGHT;
    parent?.appendChild(canvas);
    canvasRef.current = canvas;

    if (parent) {
      const firstChild = parent.firstChild;
      if (firstChild) {
        parent.insertBefore(canvas, firstChild.nextSibling);
      } else {
        parent.appendChild(canvas);
      }
      canvasRef.current = canvas;
    }
  };

  const tictactoeGame = useCallback(() => {
    createComponent();

    const canvasContext = canvasRef.current?.getContext('2d');
    const context = canvasContext ?? undefined;

    if (context) {
      const players: string[] = ['X', 'O'];

      let currentPlayer: number;
      const available: number[][] = [];

      const setup = () => {
        const randomIndex = Math.floor(Math.random() * players.length);
        currentPlayer = randomIndex;

        for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
          for (let j = 0; j < TICTACTOE_BOARD[0].length; j++) {
            available.push([j, i]);
          }
        }
      };

      const equals3 = (a: string, b: string, c: string): boolean => {
        return a === b && b === c && a !== '';
      };

      const checkWinner = () => {
        let winner = null;

        // Horizontal
        for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
          if (
            equals3(
              TICTACTOE_BOARD[i][0],
              TICTACTOE_BOARD[i][1],
              TICTACTOE_BOARD[i][2],
            )
          ) {
            winner = TICTACTOE_BOARD[i][0];
          }
        }

        // Vertical
        for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
          if (
            equals3(
              TICTACTOE_BOARD[0][i],
              TICTACTOE_BOARD[1][i],
              TICTACTOE_BOARD[2][i],
            )
          ) {
            winner = TICTACTOE_BOARD[0][i];
          }
        }

        // Diagonal
        for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
          if (
            equals3(
              TICTACTOE_BOARD[0][0],
              TICTACTOE_BOARD[1][1],
              TICTACTOE_BOARD[2][2],
            )
          ) {
            winner = TICTACTOE_BOARD[0][0];
          }
        }
        for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
          if (
            equals3(
              TICTACTOE_BOARD[2][0],
              TICTACTOE_BOARD[1][1],
              TICTACTOE_BOARD[0][2],
            )
          ) {
            winner = TICTACTOE_BOARD[2][0];
          }
        }

        let openSpots = 0;
        for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
          for (let j = 0; j < TICTACTOE_BOARD[0].length; j++) {
            if (TICTACTOE_BOARD[i][j] === '') {
              openSpots++;
            }
          }
        }

        if (winner == null && openSpots == 0) {
          return 'Tie';
        } else {
          return winner;
        }
      };

      const nextTurn = () => {
        const index = Math.floor(Math.random() * available.length);
        const spot = available.splice(index, 1)[0];
        const i = spot[0];
        const j = spot[1];
        TICTACTOE_BOARD[i][j] = players[currentPlayer];
        currentPlayer = (currentPlayer + 1) % players.length;
      };

      const createRect = (
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
      ) => {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
      };

      const drawBoard = () => {
        const w = BOARD_WIDTH / 3;
        const h = BOARD_HEIGHT / 3;

        context.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
        context.strokeStyle = 'black';
        context.lineWidth = 3;

        for (let i = 1; i < 3; i++) {
          context.beginPath();
          context.moveTo(w * i, 0);
          context.lineTo(w * i, BOARD_HEIGHT);
          context.stroke();

          context.beginPath();
          context.moveTo(0, h * i);
          context.lineTo(BOARD_WIDTH, h * i);
          context.stroke();
        }

        for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
          for (let j = 0; j < TICTACTOE_BOARD[0].length; j++) {
            const x = w * j + w / 2;
            const y = h * i + h / 2;

            const spot = TICTACTOE_BOARD[i][j];
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = '32px Arial';

            if (spot === players[1]) {
              context.beginPath();
              context.arc(x, y, w / 4, 0, Math.PI * 2);
              context.stroke();
            } else if (spot === players[0]) {
              context.beginPath();
              context.moveTo(x - w / 4, y - h / 4);
              context.lineTo(x + w / 4, y + h / 4);
              context.moveTo(x + w / 4, y - h / 4);
              context.lineTo(x - w / 4, y + h / 4);
              context.stroke();
            }
          }
        }
      };

      const draw = () => {
        createRect(
          0,
          0,
          canvasRef.current?.width || BOARD_WIDTH,
          canvasRef.current?.height || BOARD_HEIGHT,
          'black',
        );
        drawBoard();
      };

      const drawGameOver = () => {
        context.font = '30px Arial';
        context.fillStyle = 'black';
        context.fillText('Game Over!', 130, 230);
      };

      const drawWin = (result: string) => {
        context.font = '30px Arial';
        context.fillStyle = 'black';
        context.fillText(`${result.toUpperCase()} WIN!`, 180, 230);
      };

      const gameOver = () => {
        drawGameOver();
        clearInterval(gameInterval);
      };

      const update = () => {
        const result = checkWinner();
        if (result != null) {
          if (result == 'Tie') {
            gameOver();
          } else {
            drawWin(result);
            clearInterval(gameInterval);
          }
        } else {
          nextTurn();
        }
      };

      const gameLoop = () => {
        draw();
        update();
      };

      const gameInterval = setInterval(gameLoop, 1000);

      setup();
      gameLoop();
    }
  }, []);

  useEffect(() => {
    if (start) {
      tictactoeGame();
    }

    return () => {
      if (!start) {
        removeComponent();
      }
    };
  }, [start, tictactoeGame]);

  const resetGame = () => {
    setScore(0);
    setLives(5);
    resetTicTacToeBoard();
    removeComponent();
  };

  const handleStartGame = () => {
    if (start) {
      setStart(false);
      resetGame();
      return;
    }

    setStart(true);
  };

  return { parentRef, start, score, lives, handleStartGame };
};
