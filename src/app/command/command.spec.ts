import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Command } from './command';

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
});
