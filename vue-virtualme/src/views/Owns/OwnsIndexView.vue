<script setup lang="ts">
import router from '@/router';
import HttpClient from '@/services/HttpClient';
import OwnsService from '@/services/OwnsService';
import type IOwns from '@/types/IOwns';
import type { IResultObject } from '@/types/IResultObject';
import { ref } from 'vue';



const client = new HttpClient("Owns");

let owns = ref<IResultObject<IOwns[]> | null>(null);

const fetchData = async () => {
    try{
        owns.value = await OwnsService.GetAll(client.Axios);
    } catch (error: any){
        client.refreshTokens();
        try{
            owns.value = await OwnsService.GetAll(client.Axios);
        } catch(error: any){
            console.log(error);
        }
    }
    console.log(owns);
}
fetchData();

const deleteItem = async (id: string) => {
    try{
        await OwnsService.Delete(client.Axios, id);
    } catch(error: any){
        console.log("trying refresh JWT")
        try{
            client.refreshTokens();
            await OwnsService.Delete(client.Axios, id);
        } catch(error: any){
            console.log(error);
        }
    }
    router.go(0);
}

</script>

<template>
    <h1>All owns</h1>

    <RouterLink :to="{name: 'OwnsCreate'}">Create new</RouterLink>

    <table class="table">
        <thead>
            <tr>
                <th>id</th>
                <th>avatarId</th>
                <th>itemId</th>
                <th>amount</th>
                <th>isEquiped</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item of owns?.data">
                <th>{{item!.id}}</th>
                <th>{{item!.avatarId}}</th>
                <th>{{item!.itemId}}</th>
                <th>{{item!.amount}}</th>
                <th>{{item!.isEquiped}}</th>
                <th>
                    <RouterLink :to="{name: 'OwnsUpdate', params: {ownsId: item.id}}" >Update</RouterLink> | 
                    <a href="#" @click.prevent="deleteItem(item.id!)">Delete</a>
                </th>
            </tr>
        </tbody>
    </table>
</template>

<style scoped></style>