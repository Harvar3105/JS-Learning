import type { IResultObject } from "@/types/IResultObject";
import type { IUserInfo } from "@/types/IUserInfo";
import axios from "axios";
import router from "@/router"
// import { useAuthStore } from "@/stores/auth";
// import type { Pinia } from "pinia";

export default class AccountService {
    // private store;
    private constructor() {
        // this.store = useAuthStore(pinia);
    }


    private static httpClient = axios.create({
        baseURL: 'https://jupetrvirtualme.azurewebsites.net/api/v1/identity/Account/',
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            'Access-Control-Allow-Origin': '*'
        }
    });

    static async loginAsync(email: string, pwd: string): Promise<IResultObject<IUserInfo>> {
        const loginData = {
            email: email,
            password: pwd
        }
        try {
            const response = await AccountService.httpClient.post<IUserInfo>("Login", loginData);
            console.log(response);
            if (response.status < 300) {

                router.push("/");
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

    static async registerAsync(nickname: string, email: string, password: string, confirmPassword: string): Promise<IResultObject<IUserInfo>> {
        const registerData = {
            nickname: nickname,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
        }

        try{
            const response = await AccountService.httpClient.post<IUserInfo>("Register", registerData);
            // console.log(response);
            if (response.status < 300){
                localStorage.setItem('jwtToken', response.data.jwt);
                localStorage.setItem('refreshToken', response.data.refreshToken)

                router.push("/");
                return {
                    data: response.data
                }
            }
            return{
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error: any){
            return {
                errors: [JSON.stringify(error)]
            }
        }
    }

}