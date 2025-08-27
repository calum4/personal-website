import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Terminal } from "./terminal/terminal";
import { Title } from "@angular/platform-browser";
import { ConfigService } from "./core/services/config.service";
import { take } from "rxjs";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Terminal],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App implements OnInit {
  readonly titleService = inject(Title);
  readonly configService = inject(ConfigService);

  ngOnInit() {
    this.configService.config$.pipe(take(1)).subscribe((config) => {
      this.titleService.setTitle(config.pageTitle);
    });
  }
}
