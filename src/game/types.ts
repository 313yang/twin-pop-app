export type Pair = [number, number];
export type Direction = 0 | 1 | 2 | 3;
export type Mode = 'campaign' | 'daily';
export type Level = { n: number; boards: [number[], number[]]; start: Pair; goals: Pair; reverse: boolean; par: number };
export type Session = { mode: Mode; index: number; date: string; position: Pair; history: Pair[] };
export type Progress = { version: 1; nextStage: number; wins: Record<string, number>; swipeLearned: boolean; resume: Session | null };
