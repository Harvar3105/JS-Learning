<script setup lang="ts">
import router from '@/router';
import AvatarService from '@/services/AvatarService';
import HttpClient from '@/services/HttpClient';
import ItemServices from '@/services/ItemServices';
import OwnsService from '@/services/OwnsService';
import type { IAvatar } from '@/types/IAvatar';
import type { IItem } from '@/types/IItem';
import type IOwns from '@/types/IOwns';
import { ref, type Ref } from 'vue';



const ItemsClient = new HttpClient("Item");
const AvatarsClient = new HttpClient("Avatar");
const OwnsClient = new HttpClient("Owns");

const items = ref() as Ref<IItem[]>;
const avatars = ref() as Ref<IAvatar[]>;

let choosenAvatar = ref() as Ref<string>;
let choosenItem = ref() as Ref<string>;
let amount = ref() as Ref<number>;
let givenItem = ref() as Ref<IOwns>;

const Update = async () => {
    let owns: IOwns = {
        id: givenItem.value.id,
        avatarId: choosenAvatar.value,
        itemId:  choosenItem.value,
        amount:  amount.value,
        isEquiped: false
    }

    try{
        await OwnsService.Update(OwnsClient.Axios, owns);
    } catch (error: any){
        await OwnsClient.refreshTokens();
        try {
            await OwnsService.Update(OwnsClient.Axios, owns);
        } catch (error: any){
            console.log(error);
        }
    }
    router.push('/Owns');
}

const fetchItem = async () => {
    let id = '';
    for (let num of router.currentRoute.value.params.ownsId){
        id += num;
    }

    try{
        givenItem.value = (await OwnsService.GetById(OwnsClient.Axios, id)).data!;
        choosenAvatar.value = givenItem.value.avatarId;
        choosenItem.value = givenItem.value.itemId;
        amount.value = givenItem.value.amount!;
    } catch (error: any){
        await OwnsClient.refreshTokens();
        try{
            givenItem.value = (await OwnsService.GetById(OwnsClient.Axios, id)).data!;
        } catch (error: any){
            console.log(error);
        }
    }
}

const fetchItems = async () => {
    try{
        items.value = (await ItemServices.GetAll(ItemsClient.Axios)).data!;
    } catch (error: any){
        await ItemsClient.refreshTokens();
        try{
            items.value = (await ItemServices.GetAll(ItemsClient.Axios)).data!;
        } catch (error: any){
            console.log(error);
        }
    }
    console.log("Items: ");
    console.log(items);
}

const fetchAvatars = async () => {
    try{
        avatars.value = (await AvatarService.getAll(AvatarsClient.Axios)).data!;
    } catch (error: any){
        ItemsClient.refreshTokens();
        try{
            avatars.value = (await AvatarService.getAll(AvatarsClient.Axios)).data!;
        } catch (error: any){
            console.log(error);
        }
    }
    console.log("Avatars: ");
    console.log(avatars);
}

const fetchData = async () => {
    await fetchItem();
    await fetchItems();
    await fetchAvatars();
}
fetchData();
</script>

<template>
    <div class="form-group">
        <label class="control-label">Avatar</label>
        <select v-model="choosenAvatar" class ="form-control" >
            <option v-for="avatar in avatars" :key="avatar.id" :value="avatar.id">{{ avatar.id }}</option>
        </select>
    </div>
    <div class="form-group">
        <label class="control-label">Item</label>
        <select v-model="choosenItem" class ="form-control">
            <option v-for="item in items" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
    </div>
    <div class="form-group">
        <label class="control-label">Amount</label>
        <input v-model="amount" type="number">
    </div>
    <div class="form-group">
        <input type="submit" @click.prevent="Update()" class="btn btn-primary" />
    </div>
</template>

<style scoped></style>