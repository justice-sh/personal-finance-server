import { Color } from "@/shared/enum/color";
import { PublicTheme } from "../types/public.theme";

export const ThemePresets: PublicTheme[] = Object.values(Color).map((color) => ({
  color,
  isUsed: false,
}));
