import {Component, inject, OnInit} from '@angular/core';
import { Command } from '../command/command';
import { version, repository } from "../../../package.json";
import {CommandHistoryStore} from '../store/command-history.store';

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
  readonly version: string = version;
  readonly repoUrl = repository.url;
}
