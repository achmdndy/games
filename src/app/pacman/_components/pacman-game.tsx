'use client';

import { cn } from '@/lib/utils';
/* eslint-disable @next/next/no-img-element */
import { usePacmanGame } from '../_hooks/use-pacman-game';

export default function PacmanGame() {
  const { canvasRef, pacmanRef, ghostRef, start, setStart, score, lives } =
    usePacmanGame();

  return (
    <div>
      <span
        onClick={() => setStart(!start)}
        className={cn(
          'aurora-flex aurora-items-center aurora-justify-center aurora-text-white aurora-text-center aurora-text-3xl aurora-cursor-pointer',
          start && 'aurora-mb-4',
        )}
      >
        {start ? 'Stop' : 'Start'}
      </span>
      {start && <canvas ref={canvasRef} width={421} height={461}></canvas>}
      <div className="aurora-hidden">
        <img ref={pacmanRef} src="/pacman/animations.gif" alt="" />
        <img ref={ghostRef} src="/pacman/ghost.png" alt="" />
      </div>
      {start && (
        <div className="aurora-flex aurora-items-center aurora-justify-between aurora-mt-4">
          <div className="aurora-flex aurora-items-center aurora-gap-x-2 aurora-text-white aurora-text-3xl">
            <span>Score :</span>
            <span>{score}</span>
          </div>
          <div className="aurora-flex aurora-items-center aurora-gap-x-2 aurora-text-white aurora-text-3xl">
            <span>Lives :</span>
            <span>{lives}</span>
          </div>
        </div>
      )}
    </div>
  );
}
