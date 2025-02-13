'use client';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';

export const Result = () => {
  const router = useRouter();
  const score = useGameStore((state) => state.score);
  const reset = useGameStore((state) => state.reset);

  const handleRestart = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl mb-4">Game Over!</h1>
      <p className="text-2xl mb-8">score: {score}</p>
      <Button onClick={handleRestart}>Back</Button>
    </div>
  );
};