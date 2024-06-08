import type { IItem } from "@/types/IItem";
import type { IResultObject } from "@/types/IResultObject";
import type { Axios } from "axios";

export default class ItemServices{
    static async Create(httpClient: Axios, item: IItem) : Promise<IResultObject<void>>{
        try{
            console.log(item);
            let response = await httpClient.post("AddItem", item);
            return {};
        } catch (error: any){
            throw error;
        }
    }

    static async GetAll(httpClient: Axios) : Promise<IResultObject<IItem[]>>{
        try{
            let response = await httpClient.get("GetAll");
            return {data: response.data}
        } catch (error: any){
            throw error;
        }
    }

    static async GetById(httpClient: Axios, id: string) : Promise<IResultObject<IItem>>{
        try{
            let response = await httpClient.get("GetById/" + id);
            return {data: response.data}
        } catch (error: any){
            throw error;
        }
    }

    static async UpdateItem(httpClient: Axios, item: IItem) : Promise<IResultObject<void>>{
        try{
            let response = await httpClient.patch("UpdateItem", {
                id: item.id,
                name: item.name,
                description: item.description,
                isConsumable: item.isConsumable,
                statToUpgrade: item.statToUpgrade,
                itemRarity: item.itemRarity,
                slot: item.slot,
                price: item.price,
                image: item.image,
                object: item.object
            })
            return {}
        } catch (error: any){
            throw error;
        }
    }

    static async BuyItem(httpClient: Axios, id: string) : Promise<IResultObject<void>>{
        try{
            let response = await httpClient.post("BuyItem", id);
            return {};
        } catch (error: any){
            throw error;
        }
    }

    static async UseItem(httpClient: Axios, id: string) : Promise<IResultObject<void>>{
        try{
            let response = await httpClient.post("UseItem", id);
            return {};
        } catch (error: any){
            throw error;
        }
    }

    static async SellItem(httpClient: Axios, id: string) : Promise<IResultObject<void>>{
        try{
            let response = await httpClient.post("SellItem/" + id);
            return {};
        } catch (error: any){
            throw error;
        }
    }

    static async DeleteById(httpClient: Axios, id: string) : Promise<IResultObject<void>>{
        try{
            let response = await httpClient.delete("DeleteItem/" + id);
            return {};
        } catch (error: any){
            throw error;
        }
    }
}