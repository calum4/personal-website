import {Component, OnDestroy, OnInit} from "@angular/core";

const COMMANDS = [
  "help",
  "whoami",
  "acknowledgements",
];

@Component({
  selector: 'app-command',
  imports: [],
  templateUrl: './command.html',
  styleUrl: './command.css'
})
export class Command implements OnInit, OnDestroy {
  readonly COMMANDS = COMMANDS;
  readonly command: string|null = "help";

  ngOnInit() {
    document.addEventListener("click", this.onClickEvent);

    const element = document.getElementById("commandInput");
    if (element !== null) {
      element.focus();
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


  }
}
