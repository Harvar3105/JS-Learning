import axios from "axios";
import { IUserInfo } from "../state/AppContext";
import { IResultObject } from "./IResultObject";
import httpClient from "./httpclient";
import { IOwns } from "./IOwns";

export default class OwnsService{
    private constructor(){

    }


    static async Create(owns: IOwns): Promise<IResultObject<IOwns>>{
      try {
        
        const response = await httpClient.post<IOwns>("Owns/AddOwns", owns);
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

    static async Update(owns: IOwns): Promise<IResultObject<IUserInfo>>{

        try {
          
          const response = await httpClient.patch("Owns/UpdateOwns/", owns);
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

      static async Delete(ownsId: string): Promise<IResultObject<IUserInfo>>{
        try {
          
          const response = await httpClient.delete("Owns/DeleteOwns/" + ownsId);
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

      static async GetAllOwns(): Promise<IResultObject<IOwns[]>>{
        try{
            const response = await httpClient.get("Owns/GetAll");
            if(response.status < 300){
                const avatars = response.data;
                return {
                    data: avatars
                }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch(error: any){
            return {
                errors: [JSON.stringify(error)]
            };
        }
      }

      static async GetById(ownsId: string): Promise<IResultObject<IOwns>>{
        try {
          
          const response = await httpClient.get<IOwns>("Owns/GetById/" + ownsId);
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

}