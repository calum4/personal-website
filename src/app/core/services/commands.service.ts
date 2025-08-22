import { inject, Injectable } from "@angular/core";
import { ConfigService, Config, CustomCommand } from "./config.service";

export const DEFAULT_COMMANDS = [
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

export enum CommandStatus {
  Enabled,
  Disabled,
  Unknown,
}

@Injectable({ providedIn: "root" })
export class CommandsService {
  private readonly configService = inject(ConfigService);
  private readonly config = this.configService.config();

  private _enabledCommands: string[] | undefined;

  enabledCommands(): string[] {
    if (this._enabledCommands === undefined) {
      const commands: string[] = [];

      for (const command of DEFAULT_COMMANDS) {
        const commandConfig: { enabled?: boolean } =
          this.config.defaultCommands[command as keyof Config["defaultCommands"]];

        if (!commandConfig || commandConfig?.enabled) {
          commands.push(command);
        }
      }

      for (const [name, data] of Object.entries(this.config.customCommands)) {
        if (!data.enabled) continue;

        commands.push(name);
      }

      this._enabledCommands = commands;
    }

    return this._enabledCommands!;
  }

  commandStatus(command: string): CommandStatus {
    if (this.enabledCommands().includes(command)) {
      return CommandStatus.Enabled;
    } else if (
      DEFAULT_COMMANDS.includes(command) ||
      this.config.defaultCommands[command as keyof Config["defaultCommands"]]
    ) {
      return CommandStatus.Disabled;
    } else {
      return CommandStatus.Unknown;
    }
  }

  customCommand(command: string): null | CustomCommand {
    const data = this.config.customCommands[command];
    if (!data) return null;
    return data;
  }
}
