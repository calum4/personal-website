import { Component } from '@angular/core';
import { Command } from '../command/command';
import { version, repository } from "../../../package.json";

@Component({
  selector: 'app-terminal',
  imports: [
    Command
  ],
  templateUrl: './terminal.html',
  styleUrl: './terminal.css'
})
export class Terminal {
  readonly version: string = version;
  readonly repoUrl = repository.url;
}
