import {Component, inject, Input, OnDestroy, OnInit} from "@angular/core";
import {CommandHistoryStore} from '../store/command-history.store';
import { repository } from "../../../package.json";
import {CommandModel, COMMANDS} from './command.model';

@Component({
  selector: 'app-command',
  imports: [],
  templateUrl: './command.html',
  styleUrl: './command.css'
})
export class Command implements OnInit, OnDestroy {
  @Input() command: CommandModel|null = null;

  readonly store = inject(CommandHistoryStore);
  readonly COMMANDS = COMMANDS;
  readonly repoUrl = repository.url;

  ngOnInit() {
    if (this.command === null) {
      document.addEventListener("click", this.onClickEvent);

      const element = document.getElementById("commandInput");
      if (element !== null) {
        element.focus();
      }
    }
  }

  ngOnDestroy() {
    document.removeEventListener("click", this.onClickEvent);
  }

  onClickEvent = (_event: MouseEvent) => {
    const element = document.getElementById("commandInput");
    if (element !== null) {
      element.focus();
    }
  }

  onKeyDownEvent(event: KeyboardEvent) {
    const element = document.getElementById("commandInput") as HTMLInputElement | null;
    if (element === null) return;

    if (event.key === "Enter") {
      if (element.value == "clear") {
        this.store.clearHistory();
      } else if (element.value == "reset") {
        this.store.reset();
      } else {
        this.store.newCommand(element.value);
      }

      element.value = "";
    } else if (event.key === "Tab") {
      event.preventDefault();

      if (element.value === "") return;

      const similar = this.similarCommands(element.value);
      if (similar.length === 0) {
        return;
      } else if (similar.length === 1) {
        element.value = similar[0];
      } else {
        this.store.newSuggestion(element.value, similar);
        element.value = "";
      }
    }
  }

  similarCommands(command: string): string[] {
    const similar = [];

    for (const name of COMMANDS) {
      if (name.startsWith(command)) {
        similar.push(name);
      }
    }

    return similar;
  }
}
