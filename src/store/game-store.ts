// store/useGameStore.ts
import { create } from "zustand";

interface GameState {
  // duration of the game in seconds (30, 60, 90)
  duration: number;
  // current round (1~5)
  round: number;
  // player's score
  score: number;
  // current target item
  target: string;
  // default target list
  targets: string[];
  // set the duration of the game
  setDuration: (duration: number) => void;
  // go to the next round
  nextRound: () => void;
  // add 1 to the score
  addScore: () => void;
  // reset the game
  reset: () => void;
  // set the target item
  setTarget: (target: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  duration: 30,
  round: 1,
  score: 0,
  target: "",
  targets: ["phone", "shirt", "pants", "shoes", "pencil"],
  setDuration: (duration) => set({ duration }),
  nextRound: () => set((state) => ({ round: state.round + 1 })),
  addScore: () => set((state) => ({ score: state.score + 1 })),
  reset: () => set({ round: 1, score: 0, target: "" }),
  setTarget: (target) => set({ target }),
}));
