import {Component, inject, Input, OnDestroy, OnInit} from "@angular/core";
import {CommandHistoryStore} from '../store/command-history.store';

const COMMANDS = [
  "help",
  "whoami",
  "clear",
];

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
    if (event.key !== "Enter") return;

    const element = document.getElementById("commandInput") as HTMLInputElement | null;
    if (element === null) return;

    if (element.value == "clear") {
      this.store.clearHistory();
    } else {
      this.store.newCommand(element.value);
    }

    element.value = "";
  }
}
