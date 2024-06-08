import { useAuthStore } from "@/stores/auth";
import type { Axios } from "axios";
import axios from "axios";

export default class HttpClient{
    public Axios: Axios;

    private store = useAuthStore();
    private controllerName: string = '';

    constructor(controllerName: string){
        this.Axios = axios.create({
            baseURL: "https://jupetrvirtualme.azurewebsites.net/api/v1/" + controllerName + "/",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                'Authorization': 'Bearer ' + this.store.jwt,
                'RefreshToken': this.store.refreshToken,
                'Access-Control-Allow-Origin': '*'
            }
        }),
        this.controllerName = controllerName;
    }

    public async refreshTokens(){
        await this.store.refreshTokens()
        this.Axios = axios.create({
            baseURL: "https://jupetrvirtualme.azurewebsites.net/api/v1/" + this.controllerName + "/",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                'Authorization': 'Bearer ' + this.store.jwt,
                'RefreshToken': this.store.refreshToken,
                'Access-Control-Allow-Origin': '*'
            }
        })
    }
}