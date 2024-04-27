import { useCallback, useEffect, useRef, useState } from 'react';
import { resetTicTacToeBoard } from '../_actions/reset-tic-tac-toe-board';
import { TICTACTOE_BOARD } from '../_lib/board';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../_lib/constants';

export const useTicTacToeGame = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [start, setStart] = useState<boolean>(false);
  const [restart, setRestart] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
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
      let localScore: number = 0;
      let localLives: number = 5;

      const ai: string = 'X';
      const human: string = 'O';
      let currentPlayer: string = human;

      const w = BOARD_WIDTH / 3;
      const h = BOARD_HEIGHT / 3;

      const equals3 = (a: string, b: string, c: string): boolean => {
        return a == b && b == c && a !== '';
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
            if (TICTACTOE_BOARD[i][j] == '') {
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

            if (spot == human) {
              context.beginPath();
              context.arc(x, y, w / 4, 0, Math.PI * 2);
              context.stroke();
            } else if (spot == ai) {
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
        context.fillText('GAME OVER!', 130, 230);
      };

      const drawGameDraw = () => {
        context.font = '30px Arial';
        context.fillStyle = 'black';
        context.fillText('DRAW!', 130, 230);
      };

      const drawWin = () => {
        context.font = '30px Arial';
        context.fillStyle = 'black';
        context.fillText('WIN!', 180, 230);
      };

      const drawLose = () => {
        context.font = '30px Arial';
        context.fillStyle = 'black';
        context.fillText('YOU LOSE!', 180, 230);
      };

      const update = () => {
        const result = checkWinner();
        if (result != null) {
          if (result == 'Tie') {
            drawGameDraw();
            clearInterval(gameInterval);
          } else if (result == human) {
            drawWin();
            setScore(prevScore => prevScore + 10);
            localScore = localScore + 10;
            clearInterval(gameInterval);
          } else if (result == ai) {
            drawLose();
            setLives(prevLives => prevLives - 1);
            localLives--;
            clearInterval(gameInterval);
          }
          setRestart(false);
          setReset(true);
          if (localLives == 0) {
            drawGameOver();
            clearInterval(gameInterval);
          }
        }
      };

      const gameLoop = () => {
        draw();
        update();
      };

      const scores: Record<string, number> = {
        X: 10,
        O: -10,
        tie: 0,
      };

      const minimax = (
        board: string[][],
        depth: number,
        isMaximizing: boolean,
      ): number => {
        const result = checkWinner();
        if (result !== null) {
          return scores[result];
        }

        if (isMaximizing) {
          let bestScore = -Infinity;
          for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
            for (let j = 0; j < TICTACTOE_BOARD[0].length; j++) {
              if (board[i][j] == '') {
                board[i][j] = ai;
                const scoreMinimax = minimax(board, depth + 1, false);
                board[i][j] = '';
                bestScore = Math.max(scoreMinimax, bestScore);
              }
            }
          }
          return bestScore;
        } else {
          let bestScore = Infinity;
          for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
            for (let j = 0; j < TICTACTOE_BOARD[0].length; j++) {
              if (board[i][j] == '') {
                board[i][j] = human;
                const scoreMinimax = minimax(board, depth + 1, true);
                board[i][j] = '';
                bestScore = Math.min(scoreMinimax, bestScore);
              }
            }
          }
          return bestScore;
        }
      };

      const bestMove = () => {
        let bestScore = -Infinity;
        let move: { i: number; j: number } = {
          i: Math.floor(Math.random() * 3),
          j: Math.floor(Math.random() * 3),
        };
        for (let i = 0; i < TICTACTOE_BOARD.length; i++) {
          for (let j = 0; j < TICTACTOE_BOARD[0].length; j++) {
            if (TICTACTOE_BOARD[i][j] == '') {
              TICTACTOE_BOARD[i][j] = ai;
              const scoreMinimax = minimax(TICTACTOE_BOARD, 0, false);
              TICTACTOE_BOARD[i][j] = '';
              if (scoreMinimax > bestScore) {
                bestScore = scoreMinimax;
                move = { i, j };
              }
            }
          }
        }

        TICTACTOE_BOARD[move.i][move.j] = ai;
        currentPlayer = human;
      };

      const handleClickCanvas = (event: MouseEvent) => {
        if (currentPlayer === human) {
          const rect = canvasRef.current?.getBoundingClientRect();
          const x = event.clientX - rect!.left;
          const y = event.clientY - rect!.top;

          const i = Math.floor(x / w);
          const j = Math.floor(y / h);

          if (TICTACTOE_BOARD[j][i] == '') {
            TICTACTOE_BOARD[j][i] = human;
            currentPlayer = ai;
            bestMove();
          }
        }
      };

      const gameInterval = setInterval(gameLoop, 1000 / 30);

      bestMove();
      gameLoop();

      canvasRef.current?.addEventListener('click', handleClickCanvas);

      return () => {
        canvasRef.current?.removeEventListener('click', handleClickCanvas);
      };
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

  useEffect(() => {
    if (restart) {
      tictactoeGame();
    }

    return () => {
      if (!restart) {
        removeComponent();
      }
    };
  }, [restart, tictactoeGame]);

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

  const handleRestart = () => {
    resetGame();
    setRestart(true);
  };

  const handleReset = () => {
    resetTicTacToeBoard();
    removeComponent();
    setRestart(true);
    setReset(false);
  };

  return {
    parentRef,
    start,
    score,
    lives,
    reset,
    handleStartGame,
    handleRestart,
    handleReset,
  };
};
