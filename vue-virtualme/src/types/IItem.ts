import type { ERarity } from "./ERarity";
import type { ESlot } from "./ESlot";
import type { EStat } from "./EStat";

export interface IItem{
    id: string,
    name: string,
    description: string,
    isConsumable: boolean,
    statToUpgrade: EStat | null,
    itemRarity: ERarity,
    slot: ESlot | null,
    price: number,
    image: string | null,
    object: string | null
}