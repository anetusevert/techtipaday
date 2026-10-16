import { catalogA } from "./catalog-a";
import { catalogB } from "./catalog-b";
import type { TipDraft } from "./taxonomy";

export const catalog: TipDraft[] = [...catalogA, ...catalogB];
