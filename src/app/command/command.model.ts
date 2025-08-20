export const COMMANDS = [
  "help",
  "whoami",
  "clear",
  "github",
  "linkedin",
  "repo",
  "acknowledgement",
  "reset",
  "email",
];

export type CommandModel = {
  id: number,
  name: string,
  suggestions?: string[],
};
