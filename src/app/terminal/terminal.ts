import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from "@angular/core";
import { Command } from "../command/command";
import { version, repository } from "../../../package.json";
import { CommandHistoryStore } from "../store/command-history.store";
import { ConfigService } from "../core/services/config.service";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-terminal",
  imports: [Command],
  templateUrl: "./terminal.html",
  styleUrl: "./terminal.css",
})
export class Terminal implements OnInit, OnDestroy {
  readonly store = inject(CommandHistoryStore);
  private readonly changeDetectionRef = inject(ChangeDetectorRef);

  readonly configService = inject(ConfigService);
  readonly version: string = version;
  readonly repoUrl = repository.url;

  readonly config = toSignal(this.configService.config$);

  private readonly commandHistory$ = toObservable(this.store.history);
  private readonly ngUnsubscribe = new Subject<void>();

  private readonly contentDiv = viewChild<ElementRef<HTMLDivElement>>("content");

  ngOnInit(): void {
    this.commandHistory$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(async (_history) => {
      // Ensure the new element is added before attempting scroll
      this.changeDetectionRef.detectChanges();

      const element = this.contentDiv()?.nativeElement;
      if (element !== undefined) {
        element.scroll(0, element.scrollHeight);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
