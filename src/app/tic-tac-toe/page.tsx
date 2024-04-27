import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import TicTacToeGame from './_components/tic-tac-toe-game';

export const metadata: Metadata = {
  title: 'Tic Tac Toe - Games',
  description: 'Tic Tac Toe with NextJs',
};

export default function TicTacToe() {
  return (
    <div
      className={cn(
        'aurora-flex aurora-items-center aurora-justify-center aurora-min-h-screen aurora-overflow-hidden aurora-flex-col',
      )}
    >
      <TicTacToeGame />
    </div>
  );
}
