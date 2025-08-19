import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Command } from './command';
import {COMMANDS} from './command.model';

const SKIP_COMMANDS = ["clear", "", "reset"];

describe('Command', () => {
  let component: Command;
  let fixture: ComponentFixture<Command>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Command]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Command);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("template commands should handle all commands", async () => {
    const templateCommands = await getHtmlTemplateCommands();

    for (const command of COMMANDS) {
      if (SKIP_COMMANDS.includes(command)) continue;

      if (!templateCommands.includes(command)) {
        throw new Error(`template commands does not contain command "${command}"`);
      }
    }

    expect(true).toBeTrue();
  });

  it("commands should handle all template commands", async () => {
    const templateCommands = await getHtmlTemplateCommands();

    for (const command of templateCommands) {
      if (SKIP_COMMANDS.includes(command)) continue;

      if (!COMMANDS.includes(command)) {
        throw new Error(`COMMANDS does not contain template command "${command}"`);
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
