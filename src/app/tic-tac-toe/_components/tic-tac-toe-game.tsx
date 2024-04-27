'use client';

import { cn } from '@/lib/utils';
import { useTicTacToeGame } from '../_hooks/use-tic-tac-toe-game';

export default function TicTacToeGame() {
  const {
    parentRef,
    start,
    score,
    lives,
    reset,
    handleStartGame,
    handleRestart,
    handleReset,
  } = useTicTacToeGame();

  return (
    <div ref={parentRef}>
      <div
        className={cn(
          'aurora-flex aurora-items-center aurora-justify-center aurora-gap-x-4',
          start && 'aurora-mb-4',
        )}
      >
        {!start && (
          <button
            onClick={handleStartGame}
            className="aurora-flex aurora-items-center aurora-justify-center aurora-text-center aurora-text-3xl aurora-cursor-pointer"
          >
            Start
          </button>
        )}
        {lives == 0 && (
          <button
            onClick={handleStartGame}
            className="aurora-flex aurora-items-center aurora-justify-center aurora-text-center aurora-text-3xl aurora-cursor-pointer"
          >
            Exit
          </button>
        )}
        {lives == 0 && (
          <button
            onClick={handleRestart}
            className="aurora-flex aurora-items-center aurora-justify-center aurora-text-center aurora-text-3xl aurora-cursor-pointer"
          >
            Restart
          </button>
        )}
        {reset && (
          <button
            onClick={handleReset}
            className="aurora-flex aurora-items-center aurora-justify-center aurora-text-center aurora-text-3xl aurora-cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {start && (
        <div className="aurora-flex aurora-items-center aurora-justify-between aurora-mt-4">
          <div className="aurora-flex aurora-items-center aurora-gap-x-2 aurora-text-3xl">
            <span>Score :</span>
            <span>{score}</span>
          </div>
          <div className="aurora-flex aurora-items-center aurora-gap-x-2 aurora-text-3xl">
            <span>Lives :</span>
            <span>{lives}</span>
          </div>
        </div>
      )}
    </div>
  );
}
