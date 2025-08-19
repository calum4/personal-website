export const COMMANDS = [
  "help",
  "whoami",
  "clear",
  "github",
  "linkedin",
  "repo",
  "acknowledgement",
  "reset"
];

export type CommandModel = {
  id: number,
  name: string,
  suggestions?: string[],
};
