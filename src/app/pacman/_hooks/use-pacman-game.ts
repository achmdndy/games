import { useCallback, useEffect, useRef, useState } from 'react';
import { resetPacmanMap } from '../_actions/reset-pacman-map';
import Ghost from '../_class/ghost';
import Pacman from '../_class/pacman';
import {
  DIRECTION_BOTTOM,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  FOOD_COLOR,
  FPS,
  GHOST_COUNT,
  GHOST_IMAGE_LOCATIONS,
  ONE_BLOCK_SIZE,
  WALL_COLOR,
  WALL_INNER_COLOR,
  WALL_OFFSET,
  WALL_SPACE_WIDTH,
} from '../_lib/constants';
import { PACMAN_MAP } from '../_lib/map';

export const usePacmanGame = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const pacmanRef = useRef<HTMLImageElement | null>(null);
  const ghostRef = useRef<HTMLImageElement | null>(null);

  const [start, setStart] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);

  const removeComponent = () => {
    if (canvasRef.current) {
      parentRef.current?.removeChild(canvasRef.current);
      canvasRef.current = null;
    }
    if (divRef.current) {
      parentRef.current?.removeChild(divRef.current);
      divRef.current = null;
      pacmanRef.current = null;
      ghostRef.current = null;
    }
  };

  const createComponent = () => {
    const parent = parentRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 421;
    canvas.height = 461;
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

    const div = document.createElement('div');
    div.className = 'aurora-hidden';
    parent?.appendChild(div);
    divRef.current = div;

    const pacman = document.createElement('img');
    pacman.src = '/pacman/animations.gif';
    pacman.alt = 'Pacman GIF';
    divRef.current.appendChild(pacman);
    pacmanRef.current = pacman;

    const ghost = document.createElement('img');
    ghost.src = '/pacman/ghost.png';
    ghost.alt = 'Ghost PNG';
    divRef.current.appendChild(ghost);
    ghostRef.current = ghost;
  };

  const pacmanGame = useCallback(() => {
    createComponent();

    const canvasContext = canvasRef.current?.getContext('2d');
    const context = canvasContext ?? undefined;

    if (context) {
      let pacman: Pacman;
      const ghosts: Ghost[] = [];
      let localScore: number = 0;
      let localLives: number = 3;
      let foodCount: number = 0;

      for (let i = 0; i < PACMAN_MAP.length; i++) {
        for (let j = 0; j < PACMAN_MAP[0].length; j++) {
          if (PACMAN_MAP[i][j] == 2) {
            foodCount++;
          }
        }
      }

      const randomTargetsForGhosts = [
        { x: 1 * ONE_BLOCK_SIZE, y: 1 * ONE_BLOCK_SIZE },
        {
          x: 1 * ONE_BLOCK_SIZE,
          y: (PACMAN_MAP.length - 2) * ONE_BLOCK_SIZE,
        },
        { x: (PACMAN_MAP[0].length - 2) * ONE_BLOCK_SIZE, y: ONE_BLOCK_SIZE },
        {
          x: (PACMAN_MAP[0].length - 2) * ONE_BLOCK_SIZE,
          y: (PACMAN_MAP.length - 2) * ONE_BLOCK_SIZE,
        },
      ];

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

      const drawGameOver = () => {
        context.font = '30px __Pixelify_Sans_bb86cf';
        context.fillStyle = 'white';
        context.fillText('Game Over!', 130, 230);
      };

      const drawWin = () => {
        context.font = '30px __Pixelify_Sans_bb86cf';
        context.fillStyle = 'white';
        context.fillText('WIN!', 180, 230);
      };

      const gameOver = () => {
        drawGameOver();
        clearInterval(gameInterval);
      };

      const restartGame = () => {
        createNewPacman();
        createNewGhosts();

        setLives(prevLives => prevLives - 1);
        localLives--;

        if (localLives == 0) {
          gameOver();
        }
      };

      const update = () => {
        pacman.moveProcess();
        pacman.eat(() => {
          localScore++;
          setScore(prevScore => prevScore + 1);
        });

        for (let i = 0; i < ghosts.length; i++) {
          ghosts[i].moveProcess();
        }

        if (pacman.checkGhostCollision()) {
          restartGame();
        }

        if (localScore >= foodCount) {
          drawWin();
          clearInterval(gameInterval);
        }
      };

      const drawWalls = () => {
        for (let i = 0; i < PACMAN_MAP.length; i++) {
          for (let j = 0; j < PACMAN_MAP[0].length; j++) {
            if (PACMAN_MAP[i][j] == 1) {
              createRect(
                j * ONE_BLOCK_SIZE,
                i * ONE_BLOCK_SIZE,
                ONE_BLOCK_SIZE,
                ONE_BLOCK_SIZE,
                WALL_COLOR,
              );

              if (j > 0 && PACMAN_MAP[i][j - 1] == 1) {
                createRect(
                  j * ONE_BLOCK_SIZE,
                  i * ONE_BLOCK_SIZE + WALL_OFFSET,
                  WALL_SPACE_WIDTH + WALL_OFFSET,
                  WALL_SPACE_WIDTH,
                  WALL_INNER_COLOR,
                );
              }

              if (j < PACMAN_MAP[0].length - 1 && PACMAN_MAP[i][j + 1] == 1) {
                createRect(
                  j * ONE_BLOCK_SIZE + WALL_OFFSET,
                  i * ONE_BLOCK_SIZE + WALL_OFFSET,
                  WALL_SPACE_WIDTH + WALL_OFFSET,
                  WALL_SPACE_WIDTH,
                  WALL_INNER_COLOR,
                );
              }

              if (i > 0 && PACMAN_MAP[i - 1][j] == 1) {
                createRect(
                  j * ONE_BLOCK_SIZE + WALL_OFFSET,
                  i * ONE_BLOCK_SIZE,
                  WALL_SPACE_WIDTH,
                  WALL_SPACE_WIDTH + WALL_OFFSET,
                  WALL_INNER_COLOR,
                );
              }

              if (i < PACMAN_MAP.length - 1 && PACMAN_MAP[i + 1][j] == 1) {
                createRect(
                  j * ONE_BLOCK_SIZE + WALL_OFFSET,
                  i * ONE_BLOCK_SIZE + WALL_OFFSET,
                  WALL_SPACE_WIDTH,
                  WALL_SPACE_WIDTH + WALL_OFFSET,
                  WALL_INNER_COLOR,
                );
              }
            }
          }
        }
      };

      const drawFoods = () => {
        for (let i = 0; i < PACMAN_MAP.length; i++) {
          for (let j = 0; j < PACMAN_MAP[0].length; j++) {
            if (PACMAN_MAP[i][j] == 2) {
              createRect(
                j * ONE_BLOCK_SIZE + ONE_BLOCK_SIZE / 3,
                i * ONE_BLOCK_SIZE + ONE_BLOCK_SIZE / 3,
                ONE_BLOCK_SIZE / 3,
                ONE_BLOCK_SIZE / 3,
                FOOD_COLOR,
              );
            }
          }
        }
      };

      const drawGhosts = () => {
        for (let i = 0; i < ghosts.length; i++) {
          ghosts[i].draw();
        }
      };

      const draw = () => {
        createRect(
          0,
          0,
          canvasRef.current?.width || 500,
          canvasRef.current?.height || 500,
          'black',
        );
        drawWalls();
        drawFoods();
        pacman.draw();
        drawGhosts();
      };

      const gameLoop = () => {
        draw();
        update();
      };

      const gameInterval = setInterval(gameLoop, 1000 / FPS);

      const createNewGhosts = () => {
        ghosts.splice(0, ghosts.length);
        for (let i = 0; i < GHOST_COUNT; i++) {
          const newGhost = new Ghost(
            context,
            ghostRef,
            pacman!,
            randomTargetsForGhosts,
            9 * ONE_BLOCK_SIZE + (i % 2 == 0 ? 0 : 1) * ONE_BLOCK_SIZE,
            10 * ONE_BLOCK_SIZE + (i % 2 == 0 ? 0 : 1) * ONE_BLOCK_SIZE,
            ONE_BLOCK_SIZE,
            ONE_BLOCK_SIZE,
            ONE_BLOCK_SIZE / 5 / 2,
            GHOST_IMAGE_LOCATIONS[i % 4].x,
            GHOST_IMAGE_LOCATIONS[i % 4].y,
            124,
            116,
            6 + i,
          );

          ghosts.push(newGhost);
        }
      };

      const createNewPacman = () => {
        pacman = new Pacman(
          context,
          pacmanRef,
          ghosts,
          ONE_BLOCK_SIZE,
          ONE_BLOCK_SIZE,
          ONE_BLOCK_SIZE,
          ONE_BLOCK_SIZE,
          ONE_BLOCK_SIZE / 5,
        );
      };

      createNewPacman();
      createNewGhosts();
      gameLoop();

      window.addEventListener('keydown', event => {
        const key = event.keyCode;

        if (key == 37 || key == 65) {
          pacman.nextDirection = DIRECTION_LEFT;
        } else if (key == 38 || key == 87) {
          pacman.nextDirection = DIRECTION_UP;
        } else if (key == 39 || key == 68) {
          pacman.nextDirection = DIRECTION_RIGHT;
        } else if (key == 40 || key == 83) {
          pacman.nextDirection = DIRECTION_BOTTOM;
        }
      });
    }
  }, []);

  useEffect(() => {
    if (start) {
      pacmanGame();
    }

    return () => {
      if (!start) {
        removeComponent();
      }
    };
  }, [pacmanGame, start]);

  const resetGame = () => {
    setScore(0);
    setLives(3);
    resetPacmanMap();
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

  return {
    parentRef,
    start,
    score,
    lives,
    handleStartGame,
  };
};
