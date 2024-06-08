<script setup lang="ts">
import AvatarService from '@/services/AvatarService';
import HttpClient from '@/services/HttpClient';
import { ref, type Ref } from 'vue';
import { useBase64 } from '@vueuse/core';
import { ESex } from '@/types/ESex';
import type { IAvatar } from '@/types/IAvatar';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const client = new HttpClient('Avatar');

const avatarSex = ref() as Ref<ESex>;
const avatarPic = ref() as Ref<File>;

const eSexValues = Object.entries(ESex);

const store = useAuthStore();

const create = async () => {
    try{
        const image = (await useBase64(avatarPic).execute()).replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", "");
        await AvatarService.Create(client.Axios, avatarSex.value, image);
    } catch (error: any){
        client.refreshTokens();
        try{
            const image = (await useBase64(avatarPic).execute()).replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", "");
            await AvatarService.Create(client.Axios, avatarSex.value, image);
        }catch(error: any){
            console.log(error);
        }
    }
    router.push("/Avatar");
};

const onFileChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      avatarPic.value = file;
    }
  }

</script>

<template>
    <div class="form-group">
        <label class="control-label">Select avatars sex:</label>
        <select v-model="avatarSex" class="form-control">
            <option :value="ESex.Male" selected>Male</option>
            <option :value="ESex.Female">Female</option>
        </select>
    </div>
    <div class="form-group">
        <label class="control-label">Set avatars image:</label>
        <input type="file" @change="onFileChange" class="form-control" />
    </div>
    <div class="form-group">
        <input type="submit" @click.prevent="create()" class="btn btn-primary" />
    </div>
</template>

<style scoped></style>