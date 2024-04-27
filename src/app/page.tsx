import Link from 'next/link';

const GAMES = [
  { name: 'Pacman', href: '/pacman' },
  { name: 'Tic Tac Toe', href: '/tic-tac-toe' },
];

export default function Home() {
  return (
    <main className="aurora-flex aurora-flex-col aurora-items-center aurora-justify-center aurora-min-h-screen">
      <h1 className="aurora-text-3xl aurora-font-bold aurora-underline">
        Games
      </h1>

      <div className="aurora-grid aurora-grid-cols-4 aurora-gap-4 aurora-mt-10">
        {GAMES.map(({ name, href }) => (
          <Link
            key={name}
            href={href}
            className="aurora-border aurora-p-2 aurora-rounded-lg aurora-font-semibold hover:aurora-border-transparent hover:aurora-shadow-md aurora-transition-all aurora-duration-300 aurora-text-center"
          >
            {name}
          </Link>
        ))}
      </div>
    </main>
  );
}
