import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { Pixelify_Sans } from 'next/font/google';
import PacmanGame from './_components/pacman-game';

const pixelifySans = Pixelify_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pacman - Games',
  description: 'Pacman with NextJs',
};

export default function Pacman() {
  return (
    <div
      className={cn(
        'aurora-flex aurora-items-center aurora-justify-center aurora-min-h-screen aurora-bg-black aurora-overflow-hidden aurora-flex-col',
        pixelifySans.className,
      )}
    >
      <PacmanGame />
    </div>
  );
}
