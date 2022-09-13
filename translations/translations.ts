import { Translations } from "../Types/types";
import eng from "./eng";
import fr from "./fr";

const langToText = (a: Translations) => {
  switch (a) {
    case (eng): return 'English';
    case (fr): return 'Français';
    default: return 'English';
  }
}

export {
  eng,
  fr,
  langToText
};
