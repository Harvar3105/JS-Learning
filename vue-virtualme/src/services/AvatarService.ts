import type { IResultObject } from "@/types/IResultObject";
import axios, { Axios } from "axios";
import type { IAvatar } from "@/types/IAvatar";
import { ESex } from "@/types/ESex";

export default class AvatarService{

    static async Create(httpClient: Axios, sex: ESex, pic: string) : Promise<IResultObject<void>>{
        try{
            const response = await httpClient.post("AddAvatar", {
                Sex: ESex[sex],
                UploadedImage: pic
            });
            return {};
        } catch (error: any){
            throw error;
        }
    }

    static async getAll(httpClient: Axios) : Promise<IResultObject<IAvatar[]>> {
        try{
            const response = await httpClient.get<IAvatar[]>("GetAll");
            console.log(response);
            return {
                data: response.data
            }
        } catch (error: any){
            throw error;
        }
    }

    static async deleteById(httpClient: Axios, id: string) : Promise<IResultObject<void>>{
        try{
            const response = await httpClient.delete("DeleteAvatar/" + id);
            console.log(response);
            return {};
        } catch (error: any){
            throw error;
        }
    }

    static async GetById(httpClient: Axios, id: string) : Promise<IResultObject<IAvatar>>{
        try{
            const response = await httpClient.get<IAvatar>('GetById/' + id);
            console.log(response);
            return {
                data: response.data};
        } catch (error: any){
            throw error;
        }
    }

    static async UpdateAvatar(httpClient: Axios, avatar: IAvatar) : Promise<IResultObject<void>>{
        try{
            const response = await httpClient.patch('UpdateAvatar', {
                id: avatar.id,
                appUserId: avatar.appUserId,
                appUser: null,
                isActive: avatar.isActive,
                health: avatar.health,
                stamina: avatar.stamina,
                hunger: avatar.hunger,
                stress: avatar.stress,
                strength: avatar.strength,
                dexterity: avatar.dexterity,
                intelligence: avatar.intelligence,
                money: avatar.money,
                sex: avatar.sex,
                level: avatar.level,
                exp: avatar.exp,
                expToLEvelUp: avatar.expToLevelUp,
                image: avatar.image,
                uploadedImage: null,
                lastChanges: avatar.lastChanges
            });
            return {};
        } catch (error: any){
            throw error;
        }
    }
}