import { Injectable } from "@angular/core";
import CONFIG from "../../../../config.json";
import { DeepOmit } from "deep-utility-types";
import { AsyncSubject } from "rxjs";

export type CustomCommand = { enabled: boolean; content: string };

export type ConfigStrippedFields =
  | {
      stripped: true;

      defaultCommands: {
        email: {
          username: number[];
          usernameIv: number[];
          domainLevels: number[][];
          domainLevelsIv: number[][];
          key: number[];
        };
      };
    }
  | {
      stripped: false | undefined;
    };

export type Config = DeepOmit<
  Omit<typeof CONFIG, "customCommands">,
  // Unfortunately does not work as expected due to a bug with DeepOmit
  // Issue is posted - https://github.com/tobloef/deep-utility-types/issues/5
  // TODO - Check in on the fix for "[Bug] DeepOmit does not work with template literal types"
  //
  // Error - TS2344: Type `__comment${string}` does not satisfy the constraint....
  // @ts-expect-error
  `__comment${string}`
> & {
  customCommands: { [name: string]: CustomCommand };
} & ConfigStrippedFields;

@Injectable({ providedIn: "root" })
export class ConfigService {
  public readonly config$ = new AsyncSubject<Config>();

  constructor() {
    new Promise<void>(async (resolve) => {
      const config = await this.constructConfig();

      this.config$.next(config);
      this.config$.complete();

      resolve();
    }).then();
  }

  async constructConfig(): Promise<Config> {
    const config = CONFIG as unknown as Config;

    // WARNING - This is not secure
    //
    // This is solely intended to essentially obfuscate email addresses in the source code as a mitigation against email
    // scraping. In my testing, other methods including splitting up the domain levels and encoding with base64 were not
    // sufficient to prevent LLMs from reconstructing the original email. In this sense, the use of encryption can be
    // seen as a loose proof of work
    if (config.stripped) {
      const key = await crypto.subtle.importKey(
        "raw",
        new Uint8Array(config.defaultCommands.email.key),
        "AES-GCM",
        false,
        ["encrypt", "decrypt"],
      );

      const decoder = new TextDecoder();

      async function decrypt(cipherText: number[], iv: number[]): Promise<string> {
        const result = await crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv: new Uint8Array(iv),
          },
          key,
          new Uint8Array(cipherText),
        );

        return decoder.decode(result);
      }

      const username = await decrypt(
        config.defaultCommands.email.username,
        config.defaultCommands.email.usernameIv,
      );
      const domainLevels: string[] = [];

      for (let i = 0; i < config.defaultCommands.email.domainLevels.length; i++) {
        domainLevels[i] = await decrypt(
          config.defaultCommands.email.domainLevels[i],
          config.defaultCommands.email.domainLevelsIv[i],
        );
      }

      return {
        ...config,
        stripped: false,
        defaultCommands: {
          ...config.defaultCommands,
          email: {
            ...config.defaultCommands.email,
            // @ts-ignore
            username,
            // @ts-ignore
            domainLevels,
          },
        },
      };
    }

    return config;
  }
}
