<script setup lang="ts">
import router from '@/router';
import HttpClient from '@/services/HttpClient';
import ItemServices from '@/services/ItemServices';
import type { IItem } from '@/types/IItem';
import type { IResultObject } from '@/types/IResultObject';
import { ref } from 'vue';


const client = new HttpClient("Item");

let items = ref<IResultObject<IItem[]> | null>(null);

const fetchData = async () => {
    try{
        items.value = await ItemServices.GetAll(client.Axios);
    } catch (error: any){
        client.refreshTokens();
        try{
            items.value = await ItemServices.GetAll(client.Axios);
        } catch(error: any){
            console.log(error);
        }
    }
    console.log(items);
}
fetchData();

const deleteItem = async (id: string) => {
    try{
        await ItemServices.DeleteById(client.Axios, id);
    } catch(error: any){
        console.log("trying refresh JWT")
        try{
            client.refreshTokens();
            await ItemServices.DeleteById(client.Axios, id);
        } catch(error: any){
            console.log(error);
        }
    }
    router.go(0);
}

</script>

<template>
    <h1>All items</h1>

    <RouterLink :to="{name: 'ItemCreate'}">Create new</RouterLink>

    <table class="table">
        <thead>
            <tr>
                <th>id</th>
                <th>image</th>
                <th>name</th>
                <th>description</th>
                <th>isConsumable</th>
                <th>statToUpgrade</th>
                <th>itemRarity</th>
                <th>slot</th>
                <th>price</th>
                <th>object</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item of items?.data">
                <th>{{item!.id}}</th>
                <th v-if="item!.image?.startsWith('/9j')"><img width="50%" height="50%" :src="`data:image/jpg;base64,${item!.image}`"></th>
                <th v-else><img width="50%" height="50%" :src="`data:image/png;base64,${item!.image}`"></th>
                <th>{{item!.name}}</th>
                <th>{{item!.description}}</th>
                <th>{{item!.isConsumable}}</th>
                <th>{{item!.statToUpgrade}}</th>
                <th>{{item!.itemRarity}}</th>
                <th>{{item!.slot}}</th>
                <th>{{item!.price}}</th>
                <th v-if="item.image != undefined">true</th>
                <th v-else>false</th>
                <th>
                    <RouterLink :to="{name: 'ItemUpdate', params: {itemId: item.id}}" >Update</RouterLink> | 
                    <a href="#" @click.prevent="deleteItem(item.id)">Delete</a>
                </th>
            </tr>
        </tbody>
    </table>
</template>
<style scoped></style>