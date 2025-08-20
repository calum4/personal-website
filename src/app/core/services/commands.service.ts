import {Injectable} from "@angular/core";
import config from "../../../../config.json";

export const DEFAULT_COMMANDS = [
  "help",
  "whoami",
  "clear",
  "github",
  "linkedin",
  "repo",
  "acknowledgement",
  "reset",
  "email"
];

export enum CommandStatus {
  Enabled,
  Disabled,
  Unknown,
}

@Injectable({providedIn: "root"})
export class CommandsService {
  private _enabledCommands: string[]|undefined;

  enabledCommands(): string[] {
    if (this._enabledCommands === undefined) {
      const commands: string[] = [];

      for (const command of DEFAULT_COMMANDS) {
        const commandConfig: {enabled?: boolean} = config.defaultCommands[command as keyof typeof config.defaultCommands];

        if (!commandConfig || commandConfig?.enabled) {
          commands.push(command);
        }
      }

      this._enabledCommands = commands;
    }

    return this._enabledCommands!;
  }

  commandStatus(command: string): CommandStatus {
    if (this.enabledCommands().includes(command)) {
      return CommandStatus.Enabled;
    } else if (DEFAULT_COMMANDS.includes(command)) {
      return CommandStatus.Disabled;
    } else {
      return CommandStatus.Unknown;
    }
  }
}
