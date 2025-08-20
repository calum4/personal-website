import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Terminal } from './terminal/terminal';
import {Title} from "@angular/platform-browser";
import {pageTitle} from "../../config.json";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Terminal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private readonly titleService: Title) {
    this.titleService.setTitle(pageTitle);
  }
}
