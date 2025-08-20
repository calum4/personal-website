import {Injectable} from "@angular/core";
import CONFIG from "../../../../config.json";

export type CustomCommand = {enabled: boolean, content: string};

export type Config = Omit<typeof CONFIG, "customCommands"> & {
  customCommands: {[name: string]: CustomCommand}
};

@Injectable({providedIn: "root"})
export class ConfigService {
  public static Config: Config = CONFIG;
}
