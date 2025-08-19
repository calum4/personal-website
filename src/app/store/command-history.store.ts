import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

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
    newCommand(command: string): void {
      patchState(store, (state) => ({
        nextId: state.nextId + 1,
        history: [...state.history, {id: state.nextId, name: command}],
      }));
    },
    clearHistory(): void {
      patchState(store, () => ({history: [], hasBeenCleared: true}));
    }
  })),
);
