import axios from "axios";
import { IUserInfo } from "../state/AppContext";
import { IResultObject } from "./IResultObject";
import { IAvatar } from "./IAvatar";
import httpClient from "./httpclient";

export default class AvatarService{
    private constructor(){

    }


    static async Create(sex: string, uploadedImage: string): Promise<IResultObject<IUserInfo>>{
      const avatarData = {
        sex: sex,
        uploadedImage: uploadedImage.replace("data:image/png;base64,", ""),
      }
      try {
        
        const response = await httpClient.post<IUserInfo>("Avatar/AddAvatar", avatarData);
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

    static async Update(avatar: IAvatar): Promise<IResultObject<IUserInfo>>{
        try {
          const data = {
            id: avatar.id,
            appUserId: avatar.appUserId,
            appUser: null,
            health: avatar.health,
            stamina: avatar.stamina,
            hunger: avatar.hunger,
            stress: avatar.stress,
            isActive: avatar.isActive,
            strength: avatar.strength,
            dexterity: avatar.dexterity,
            intelligence: avatar.intelligence,
            money: avatar.money,
            sex: avatar.sex,
            level: avatar.level,
            exp: avatar.exp,
            expToLevelUp: avatar.expToLevelUp,
            image: avatar.image,
            uploadedImage: null,
            lastChanges: avatar.lastChanges
          }
          const response = await httpClient.patch("Avatar/UpdateAvatar", data);
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


      static async GetById(avatarId: string): Promise<IResultObject<IAvatar>>{
        try {
          
          const response = await httpClient.get<IAvatar>("Avatar/GetById/" + avatarId);
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

      static async Delete(avatarId: string): Promise<IResultObject<IUserInfo>>{
        try {
          
          const response = await httpClient.delete("Avatar/DeleteAvatar/" + avatarId);
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

      static async GetAllUserAvatars(userId: string): Promise<IResultObject<IAvatar[]>>{
        try{
            const response = await httpClient.get("Avatar/GetByUserId/" + userId);
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

      static async GetAll(): Promise<IResultObject<IAvatar[]>>{
        try{
            const response = await httpClient.get("Avatar/GetAll");
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

}