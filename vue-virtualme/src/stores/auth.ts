import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { stringOrNull } from '@/types/types'
import axios from 'axios'

// export const useAuthStore = defineStore('auth', () => {
//     // ref - state variables
//     const jwt = ref<stringOrNull>(null)
//     const refreshToken = ref<stringOrNull>(null)
    
//     // computed - getters
//     const isAuthenticated = computed<boolean>(() => !!jwt.value);

//     // functions - actions
//     console.log('jwt token is: ' + jwt);

//     // return your refs, computeds and functions
//     return { jwt, refreshToken, isAuthenticated }
// })

export const useAuthStore = defineStore('auth', {
    // ref - state variables
    state: () => ({
        userId: null as stringOrNull,
        jwt: null as stringOrNull,
        refreshToken: null as stringOrNull
    }),
    // computed - getters
    getters: {
        isAuthenticated: (state) => !!state.jwt
    },
    // plugins
    persist: true,
    // functions - actions
    actions: {
        consoleLog(){
            console.log('jwt token is: ' + this.jwt)
        },

        logOut(){
            this.jwt = null;
            this.refreshToken = null;
            this.userId = null;
        },

        async refreshTokens(){
            // console.log("Inside pinia");
            let httpRequest = axios.create({
                baseURL: "http://localhost:5043/api/v1/Identity/Account/",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    'Authorization': 'Bearer ' + this.jwt,
                    'RefreshToken': this.refreshToken,
                    'Access-Control-Allow-Origin': '*'
                },
            })
            try{
                const response = await httpRequest.post('RefreshTokenData', {
                    Jwt: this.jwt,
                    RefreshToken: this.refreshToken,
                }, {params: {expiresInSeconds: 120}});
                // console.log("Refresh response: ");
                // console.log(response);
                this.jwt = response.data.jwt;
                this.refreshToken = response.data.refreshToken;
                this.userId = response.data.userId;

            } catch (error: any){
                console.log("Cant refresh jwt");
                console.log(error);
            }
        }
    }
})
