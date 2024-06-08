<script setup lang="ts">
import router from '@/router';
import AvatarService from '@/services/AvatarService';
import HttpClient from '@/services/HttpClient';
import { useAuthStore } from '@/stores/auth';
import type { IAvatar } from '@/types/IAvatar';
import type { IResultObject } from '@/types/IResultObject';
import { ref } from 'vue';

const client = new HttpClient("Avatar");

let avatars = ref<IResultObject<IAvatar[]> | null>(null);


const fetchData = async () => {
    try{
        avatars.value = await AvatarService.getAll(client.Axios);
    } catch (error: any){
        console.log("trying refresh JWT")
        try{
            client.refreshTokens();
            avatars.value = await AvatarService.getAll(client.Axios);
        } catch(error: any){
            console.log(error);
        }
    }
    console.log(avatars);
}
fetchData();

const deleteAvatar = async (id: string) => {
    try{
        await AvatarService.deleteById(client.Axios, id);
    } catch(error: any){
        console.log("trying refresh JWT")
        try{
            client.refreshTokens();
            await AvatarService.deleteById(client.Axios, id);
        } catch(error: any){
            console.log(error);
        }
    }
    router.go(0);
}

</script>

<template>
    <h1>All avatars</h1>

    <RouterLink :to="{ name: 'Create' }">Create new</RouterLink>

    <table class="table">
        <thead>
            <tr>
                <th>id</th>
                <th>picture</th>
                <th>isActive</th>
                <th>health</th>
                <th>stamina</th>
                <th>hunger</th>
                <th>stress</th>
                <th>strength</th>
                <th>dexterity</th>
                <th>intelligance</th>
                <th>money</th>
                <th>sex</th>
                <th>level</th>
                <th>exp</th>
                <th>expToLevelUp</th>
                <th>lastChanges</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="avatar of avatars?.data">
                <th>{{avatar!.id}}</th>
                <th v-if="avatar.image?.startsWith('/9j')"><img width="100%" height="100%" :src="`data:image/jpeg;base64,${avatar.image}`"></th>
                <th v-else><img width="100%" height="100%" :src="`data:image/png;base64,${avatar.image}`"></th>
                <th>{{avatar.isActive}}</th>
                <th>{{avatar.health}}</th>
                <th>{{avatar.stamina}}</th>
                <th>{{avatar.hunger}}</th>
                <th>{{avatar.stress}}</th>
                <th>{{avatar.strength}}</th>
                <th>{{avatar.dexterity}}</th>
                <th>{{avatar.intelligence}}</th>
                <th>{{avatar.money}}</th>
                <th>{{avatar.sex}}</th>
                <th>{{avatar.level}}</th>
                <th>{{avatar.exp}}</th>
                <th>{{avatar.expToLevelUp}}</th>
                <th>{{avatar.lastChanges}}</th>
                <th>
                    <RouterLink :to="{name: 'Update', params: {avatarId: avatar.id}}" >Update</RouterLink> | 
                    <a href="#" @click.prevent="deleteAvatar(avatar.id)">Delete</a>
                </th>
            </tr>
        </tbody>
    </table>
</template>

<style scoped></style>