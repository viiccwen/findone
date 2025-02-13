"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useGameStore } from "@/store/game-store";
import { useRouter } from "next/navigation";

export const Home = () => {
  const router = useRouter();
  const { reset, setDuration } = useGameStore();

  const handleStart = (duration: number) => {
    reset();
    setDuration(duration);
    router.push("/check");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl mb-8 text">Find One!</h1>
      <div className="flex gap-4">
        <Button onClick={() => handleStart(30)}>30 s</Button>
        <Button onClick={() => handleStart(60)}>60 s</Button>
        <Button onClick={() => handleStart(90)}>90 s</Button>
      </div>
    </div>
  );
};
