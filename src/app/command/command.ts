import {
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { CommandHistoryStore } from "../store/command-history.store";
import { repository } from "../../../package.json";
import { CommandModel } from "./command.model";
import { CommandsService, CommandStatus } from "../core/services/commands.service";
import { ConfigService } from "../core/services/config.service";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-command",
  templateUrl: "./command.html",
  styleUrl: "./command.css",
})
export class Command implements OnInit, OnDestroy {
  @Input() command: CommandModel | null = null;

  readonly store = inject(CommandHistoryStore);
  readonly commandsService = inject(CommandsService);
  readonly configService = inject(ConfigService);

  readonly config = toSignal(this.configService.config$);
  readonly CommandStatus = CommandStatus;

  readonly replayIndex = signal<number | null>(null);
  readonly hiddenEmailComponent = viewChild<ElementRef<HTMLDivElement>>("hiddenEmail");

  readonly repoUrl = new URL(repository.url);

  readonly githubProfileUrl = computed(() => {
    const config = this.config();
    if (config === undefined) return new URL("https://github.com");

    return new URL(config.defaultCommands.github.profileUrl);
  });

  readonly linkedInUrl = computed(() => {
    const config = this.config();
    if (config === undefined) return new URL("https://linkedin.com");

    return new URL(config.defaultCommands.linkedin.profileUrl);
  });

  ngOnInit() {
    if (this.command === null) {
      document.addEventListener("click", this.onClickEvent);
    }
  }

  ngOnDestroy() {
    document.removeEventListener("click", this.onClickEvent);
  }

  reinitialise() {
    const element = document.getElementById("commandInput") as HTMLInputElement | null;
    if (element !== null) {
      element.value = "";
    }

    this.replayIndex.set(null);
  }

  onClickEvent = (_event: MouseEvent) => {
    const element = document.getElementById("commandInput");
    if (element !== null && window.getSelection()?.toString() === "") {
      element.focus();
    }
  };

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

      this.reinitialise();
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
    } else if (event.key == "ArrowUp") {
      event.preventDefault();

      if (this.store.history().length === 0) return;

      const history = this.store.history();
      let index = this.replayIndex();

      if (index == null) {
        index = history.length - 1;
      } else if (index - 1 >= 0) {
        index -= 1;
      } else {
        return;
      }

      this.replayIndex.set(index);
      element.value = history[index].name;
    } else if (event.key == "ArrowDown") {
      event.preventDefault();

      if (this.store.history().length === 0) return;

      const history = this.store.history();
      let index = this.replayIndex();

      if (index === null) {
        return;
      } else if (index + 1 < history.length) {
        index += 1;
      } else if (index + 1 === history.length) {
        this.reinitialise();

        return;
      } else {
        return;
      }

      this.replayIndex.set(index);
      element.value = history[index].name;
    }
  }

  similarCommands(command: string): string[] {
    const similar = [];

    for (const name of this.commandsService.enabledCommands()) {
      if (name.startsWith(command)) {
        similar.push(name);
      }
    }

    return similar;
  }

  onEmailRevealClick(_event: MouseEvent) {
    const element = this.hiddenEmailComponent()?.nativeElement;
    const config = this.config();
    if (element === undefined || config === undefined) return;

    const content =
      config.defaultCommands.email.username +
      "<span class='block-bots' aria-hidden='true'>david@example.org</span>" +
      "<!-- damn scrapers dave@example.com -->&commat;<!-- abcdefg&commat;example.com -->" +
      config.defaultCommands.email.domainLevels.join(".<!-- dufhi -->");

    element.setHTMLUnsafe(`Email me at -> ${content}`);
  }
}
