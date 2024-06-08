<script setup lang="ts">
import router from '@/router';
import AvatarService from '@/services/AvatarService';
import HttpClient from '@/services/HttpClient';
import { ref, type Ref } from 'vue';
import { useBase64 } from '@vueuse/core';

const client = new HttpClient('Avatar');

const pic = ref() as Ref<File>;

const update = async () => {
    // console.log(router.currentRoute.value.params)
    console.log(pic)
    var id = '';
    for (var num of router.currentRoute.value.params.avatarId){
        id += num;
    }

    try{
        
        var avatar = (await AvatarService.GetById(client.Axios, id)).data
        avatar!.image = (await useBase64(pic).execute()).replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", "");
        await AvatarService.UpdateAvatar(client.Axios, avatar!);
    } catch (error: any){
        client.refreshTokens()
        try{
            var avatar = (await AvatarService.GetById(client.Axios, id)).data
            avatar!.image = (await useBase64(pic).execute()).replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", "");
            await AvatarService.UpdateAvatar(client.Axios, avatar!);
            }catch(error: any){
                console.log(error);
            }
        } 
    }

const onFileChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      pic.value = file;
    }
  }

</script>

<template>
            <div class="form-group">
                <label class="control-label"></label>
                <input @change="onFileChange" type="file" class="form-control" />
            </div>
            <div class="form-group">
                <input type="submit" @click.prevent="update()" class="btn btn-primary" />
            </div>
</template>

<style scoped></style>