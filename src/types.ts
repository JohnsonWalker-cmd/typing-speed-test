export type Difficulty = "easy" | "medium" | "hard";
export type Mode = "timed" | "passage";

export interface Passage {
  id: string;
  text: string;
}

export interface PassageData {
  easy: Passage[];
  medium: Passage[];
  hard: Passage[];
}
