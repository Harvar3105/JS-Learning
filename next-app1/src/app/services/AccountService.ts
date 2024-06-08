import axios from "axios";
import { AppContext, IUserInfo } from "../state/AppContext";
import { IResultObject } from "./IResultObject";
import httpClient from "./httpclient";

export default class AccountService{
    private constructor(){ }


    static async login(email: string, pwd: string): Promise<IResultObject<IUserInfo>>{
      const loginData = {
        email: email,
        password: pwd
      }
      try {
  
        const response = await httpClient.post<IUserInfo>("identity/Account/login", loginData);
        if(response.status < 300){
          const {userId, jwt, refreshToken} = response.data;
          localStorage.setItem('userId', userId);
          localStorage.setItem('jwt', jwt);
          localStorage.setItem('refreshToken', refreshToken);
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

    static async register(nickname: string, email: string, pwd: string): Promise<IResultObject<IUserInfo>> {
      const data = {
        nickname: nickname,
        email: email,
        password: pwd
      }
      try {
        const res = await httpClient.post<IUserInfo>("identity/Account/register", data);
        if (res.status < 300){
          const{userId, jwt, refreshToken} = res.data;
          localStorage.setItem('userId', userId);
          localStorage.setItem('jwt', jwt);
          localStorage.setItem('refreshToken', refreshToken);
          return {
            data: res.data
          }
        }
        return {
          errors: [res.status.toString() + ": " + res.statusText]
        }
      }
      catch (error: any){
        return {
          errors: [JSON.stringify(error)]
        }
      }
    }

    static async refreshJwt(): Promise<IResultObject<IUserInfo> | null> {
      const jwt = localStorage.getItem('jwt');
      const refreshToken = localStorage.getItem('refreshToken');
      if(!jwt || !refreshToken){
        throw new Error("No tokens available");
      }

      const refreshData = {jwt, refreshToken};
      try{
        const response = await httpClient.post("identity/Account/RefreshTokenData", refreshData);
        if(response.status < 300){
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('jwt', response.data.jwt);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          return response;
        } else {
          throw new Error(response.status + " " + response.statusText);
        }
      } catch(error){ 
        console.error('Token refresh failed:', error);
        return null;
      }
    }


}