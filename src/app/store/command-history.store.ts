import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {CommandModel} from '../command/command.model';

type CommandHistoryState = {
  nextId: number,
  history: CommandModel[],
  hasBeenCleared: boolean,
};

const initialState: CommandHistoryState = {
  nextId: 0,
  history: [],
  hasBeenCleared: false,
};

export const CommandHistoryStore = signalStore(
  {providedIn: "root"},
  withState(initialState),
  withMethods((store) => ({
    newCommand(name: string): void {
      patchState(store, (state) => ({
        nextId: state.nextId + 1,
        history: [...state.history, {id: state.nextId, name}],
      }));
    },
    newSuggestion(name: string, suggestions: string[]): void {
      patchState(store, (state) => ({
        nextId: state.nextId + 1,
        history: [...state.history, {id: state.nextId, name, suggestions}],
      }));
    },
    clearHistory(): void {
      patchState(store, () => ({history: [], hasBeenCleared: true}));
    },
    reset(): void {
      patchState(store, initialState);
    }
  })),
);
