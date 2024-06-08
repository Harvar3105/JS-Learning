import type { IAppUser } from "./IAppUser"

export interface IAvatar{
    id: string
    appUserId: string
    appUser: IAppUser | undefined
    isActive: boolean
    health: number
    stamina: number
    hunger: number
    stress: number
    strength: number
    dexterity: number
    intelligence: number
    money: number
    sex: number
    level: number
    exp: number
    expToLevelUp: number
    image: string | null
    lastChanges: string
}