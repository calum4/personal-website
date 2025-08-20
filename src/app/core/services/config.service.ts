import {Injectable} from "@angular/core";
import CONFIG from "../../../../config.json";
import {DeepOmit} from "deep-utility-types";

export type CustomCommand = {enabled: boolean, content: string};


export type Config = DeepOmit<Omit<typeof CONFIG, "customCommands">,
  // Unfortunately does not work as expected due to a bug with DeepOmit
  // Issue is posted - https://github.com/tobloef/deep-utility-types/issues/5
  // TODO - Check in on the fix for "[Bug] DeepOmit does not work with template literal types"
  //
  // Error - TS2344: Type `__comment${string}` does not satisfy the constraint....
  // @ts-expect-error
  `__comment${string}`> & {
  stripped?: boolean,
  customCommands: {[name: string]: CustomCommand},
};

@Injectable({providedIn: "root"})
export class ConfigService {
  private _config: Config | null = null;

  config(): Config {
    if (this._config !== null) {
      return this._config;
    }

    let config: Config = CONFIG;

    if (config.stripped) {

      // Decode Base64 encoded email
      config.defaultCommands.email.username = atob(config.defaultCommands.email.username);

      for (let i = 0; i < config.defaultCommands.email.domainLevels.length; i++) {
        config.defaultCommands.email.domainLevels[i] = atob(config.defaultCommands.email.domainLevels[i]);
      }
    }

    this._config = config;
    return config;
  }
}
