import {Component, inject} from '@angular/core';
import { Command } from '../command/command';
import { version, repository } from "../../../package.json";
import {CommandHistoryStore} from '../store/command-history.store';
import {ConfigService} from "../core/services/config.service";

@Component({
  selector: 'app-terminal',
  imports: [
    Command
  ],
  templateUrl: './terminal.html',
  styleUrl: './terminal.css'
})
export class Terminal {
  readonly store = inject(CommandHistoryStore);
  readonly configService = inject(ConfigService);
  readonly version: string = version;
  readonly repoUrl = repository.url;

  readonly config = this.configService.config();
}
