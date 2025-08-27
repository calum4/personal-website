import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Command } from "./command";
import { DEFAULT_COMMANDS } from "../core/services/commands.service";

const SKIP_COMMANDS = ["clear", "", "reset"];

describe("Command", () => {
  let component: Command;
  let fixture: ComponentFixture<Command>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Command],
    }).compileComponents();

    fixture = TestBed.createComponent(Command);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("template commands should handle all default commands", async () => {
    const templateCommands = await getHtmlTemplateCommands();

    for (const command of DEFAULT_COMMANDS) {
      if (SKIP_COMMANDS.includes(command)) continue;

      if (!templateCommands.includes(command)) {
        throw new Error(`template commands does not contain default command "${command}"`);
      }
    }

    expect(false).toBeTrue();
  });

  it("default commands should handle all template commands", async () => {
    const templateCommands = await getHtmlTemplateCommands();

    for (const command of templateCommands) {
      if (SKIP_COMMANDS.includes(command)) continue;

      if (!DEFAULT_COMMANDS.includes(command)) {
        throw new Error(`default commands do not contain template command "${command}"`);
      }
    }

    expect(true).toBeTrue();
  });
});

async function getHtmlTemplateCommands(): Promise<string[]> {
  const test = await fetch("/html/app/command/command.html");
  const template = await test.text();

  const startIndex = template.search("<!-- START COMMAND CHECK -->");
  const endIndex = template.search("<!-- END COMMAND CHECK -->");

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("Unable to find the COMMAND CHECK area");
  }

  const commandCheck = template.substring(startIndex, endIndex);
  const templateCommands: string[] = [];

  for (const match of commandCheck.matchAll(/(@case\s*\(["'])(.*)(["']\)\s*{)/g)) {
    templateCommands.push(match[2]);
  }

  return templateCommands;
}
