import axios from "axios";
import { IUserInfo } from "../state/AppContext";
import { IResultObject } from "./IResultObject";
import { IItem } from "./IItem";
import httpClient from "./httpclient";

export default class ItemService{
    private constructor(){

    }


    static async Create(item: IItem): Promise<IResultObject<IUserInfo>>{
      try {
        
        const response = await httpClient.post("Item/AddItem", item);
        if(response.status < 300){
            return {
              data: response.data
            } 
        }
        return {
          errors: [response.status.toString() + " " + response.statusText]
        }
      } catch (error: any) {
          return {
            errors: [JSON.stringify(error)]
          };
      }
    }

    static async GetById(itemId: string): Promise<IResultObject<IItem>>{
      try {
        
        const response = await httpClient.get<IItem>("Item/GetById/" + itemId);
        if(response.status < 300){
          return {
            data: response.data
          };
        }
        return {
          errors: [response.status.toString() + " " + response.statusText]
        }
      } catch (error: any) {
        return {
          errors: [JSON.stringify(error)]
        };
      }
    }

    static async Update(item: IItem): Promise<IResultObject<IUserInfo>>{

        try {
          
          const response = await httpClient.patch("Item/UpdateItem", item);
          if(response.status < 300){
              return {
                data: response.data
              } 
          }
          return {
            errors: [response.status.toString() + " " + response.statusText]
          }
        } catch (error: any) {
            return {
              errors: [JSON.stringify(error)]
            };
        }
      }

      static async Delete(itemId: string): Promise<IResultObject<IItem>>{
        try {
          
          const response = await httpClient.delete("Item/DeleteItem/" + itemId);
          if(response.status < 300){
              return {
                data: response.data
              } 
          }
          return {
            errors: [response.status.toString() + " " + response.statusText]
          }
        } catch (error: any) {
            return {
              errors: [JSON.stringify(error)]
            };
        }
      }
      

      static async GetAll(): Promise<IResultObject<IItem[]>>{
        try {
          
          const response = await httpClient.get("Item/GetAll/");
          if(response.status < 300){
              return {
                data: response.data
              } 
          }
          return {
            errors: [response.status.toString() + " " + response.statusText]
          }
        } catch (error: any) {
            return {
              errors: [JSON.stringify(error)]
            };
        }
      }
}