import type IOwns from "@/types/IOwns";
import type { IResultObject } from "@/types/IResultObject";
import type { Axios } from "axios";

export default class OwnsService{
    static async Create(httpClient: Axios, owns: IOwns) : Promise<IResultObject<void>>{
        try {
            let response = await httpClient.post("AddOwns", owns);
            return {}
        } catch (error: any){
            throw error;
        }
    }

    static async GetById(httpClient: Axios, id: string) : Promise<IResultObject<IOwns>>{
        try{
            let response = await httpClient.get<IOwns>("GetById/" + id);
            return { data: response.data }
        } catch (error: any){
            throw error;
        }
    }

    static async GetByAvatarsId(httpClient: Axios, avatarsId: string) : Promise<IResultObject<IOwns>>{
        try{
            let result = await httpClient.get<IOwns>("GetByAvatarsId/" + avatarsId);
            return { data: result.data}
        } catch (error: any){
            throw error;
        }
    }

    static async GetAll(httpClient: Axios) : Promise<IResultObject<IOwns[]>>{
        try {
            let result = await httpClient.get<IOwns[]>("GetAll");
            return {
                data: result.data
            }
        } catch (error: any){
            throw error;
        }
    }

    static async Update(httpClient: Axios, owns: IOwns) : Promise<IResultObject<void>>{
        try {
            let response = await httpClient.patch("UpdateOwns", owns);
            return {}
        } catch (error: any){
            throw error;
        }
    }

    static async Delete(httpClient: Axios, id: string) : Promise<IResultObject<void>>{
        try{
            let response = await httpClient.delete("DeleteOwns/" + id);
            return {}
        } catch (error: any){
            throw error;
        }
    }
}