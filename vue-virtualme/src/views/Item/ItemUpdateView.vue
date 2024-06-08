<script setup lang="ts">
import { ref, onMounted, type VNodeRef, type Ref } from 'vue';
import {ERarity} from '@/types/ERarity';
import { EStat } from '@/types/EStat';
import { ESlot } from '@/types/ESlot';
import type { IItem } from '@/types/IItem';
import { useBase64 } from '@vueuse/core';
import ItemServices from '@/services/ItemServices';
import HttpClient from '@/services/HttpClient';
import router from '@/router';

const client = new HttpClient("Item");

let selectedItem = ref() as Ref<IItem>;

const checkBox = ref<VNodeRef | undefined>(undefined);
const stat = ref<VNodeRef | undefined>(undefined);
const slot = ref<VNodeRef | undefined>(undefined);
const obj = ref<VNodeRef | undefined>(undefined);

onMounted(async () => {
    try {
        let id = "";
        for (let num  of router.currentRoute.value.params.itemId){
            id += num;
        }
        selectedItem.value = (await ItemServices.GetById(client.Axios, id)).data!;

        if (selectedItem.value) {
            iName.value = selectedItem.value.name;
            iDescription.value = selectedItem.value.description;
            iRarity.value = selectedItem.value.itemRarity;
            iPrice.value = selectedItem.value.price;
            iIsConsumable.value = selectedItem.value.isConsumable;
            iStat.value = selectedItem.value.statToUpgrade!;
            iSlot.value = selectedItem.value.slot!;
            // Note: For iImage and iObj, you might want to handle them differently since they are files.
        }
    } catch (error) {
        console.error('Failed to fetch selected item', error);
    }
    
    if (checkBox.value && stat.value && slot.value && obj.value) {
        checkBox.value.onclick = () => {
            const visibility = checkBox.value!.checked ? "hidden" : "visible";
            stat.value!.style.visibility = visibility;
            slot.value!.style.visibility = visibility;
            obj.value!.style.visibility = visibility;
        };
    } else {
        console.error('One or more elements are not found');
        console.log(checkBox);
        console.log(stat);
        console.log(slot);
        console.log(obj);
    }
    let id = '';
})

const iName = ref() as Ref<string>;
const iDescription = ref() as Ref<string>;
const iRarity = ref() as Ref<ERarity>;
const iImage = ref() as Ref<File>;
const iPrice = ref() as Ref<number>;
const iIsConsumable = ref() as Ref<boolean>;
const iStat = ref() as Ref<EStat>;
const iSlot = ref() as Ref<ESlot>;
const iObj = ref() as Ref<File>;

const onImageChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];
        iImage.value = file;
    }
    console.log(iImage);
}
const onObjChange = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      iObj.value = file;
    }
  }


const update = async () =>{

    let item :IItem = {
            id: selectedItem.value.id,
            name: iName.value,
            description: iDescription.value,
            isConsumable: iIsConsumable.value,
            statToUpgrade: iStat.value,
            itemRarity: iRarity.value,
            slot: iSlot.value,
            price: iPrice.value,
            image: (await useBase64(iImage).execute()).replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", ""),
            object: await useBase64(iObj).execute()
        }
    if (item.image == undefined) item.image = selectedItem.value.image;
    if (item.object == undefined) item.object = selectedItem.value.object;

    try{
        await ItemServices.UpdateItem(client.Axios, item)
    } catch (error: any){
        await client.refreshTokens();
        try{
        await ItemServices.UpdateItem(client.Axios, item)
        } catch (error: any){
            console.log(error);
        }
    }
}

</script>

<template>
    <div class="form-group">
        <label class="control-label">Name</label>
        <input v-model="iName" class="form-control" />
    </div>
    <div class="form-group">
        <label class="control-label">Description</label>
        <input v-model="iDescription" class="form-control" />
    </div>
    <div class="form-group">
        <label class="control-label">Rarity</label>
        <select v-model="iRarity" class="form-control">
            <option :value="ERarity.Common" selected>Common</option>
            <option :value="ERarity.Rare">Rare</option>
            <option :value="ERarity.Mythical">Mythical</option>
            <option :value="ERarity.Legendary">Legendary</option>
        </select>
    </div>
    <div class="form-group">
        <label class="control-label">Image</label>
        <input @change="onImageChange" type="file" class="form-control" />
    </div>
    <div class="form-group">
        <label class="control-label">Price</label>
        <input v-model="iPrice" class="form-control"/>
    </div>
    <div class="form-group form-check">
        <label class="form-check-label">IsConsumable</label>
        <input v-model="iIsConsumable" ref="checkBox" id="checkBox" type="checkbox" class="form-check-input" checked="true"/>
    </div>
    <div ref="stat" id="stat" class="form-group" style="visibility: hidden">
        <label class="control-label">StatToUpgrade</label>
        <select v-model="iStat" class="form-control">
            <option :value="EStat.strength" selected>strength</option>
            <option :value="EStat.dexterity">dexterity</option>
            <option :value="EStat.intelligence">intelligence</option>
        </select>
    </div>
    <div ref="slot" id="slot" class="form-group" style="visibility: hidden">
        <label class="control-label">Slot</label>
        <select v-model="iSlot" class="form-control">
            <oprion :value="ESlot.Head" selected></oprion>
            <oprion :value="ESlot.Face"></oprion>
            <oprion :value="ESlot.Body"></oprion>
            <oprion :value="ESlot.Legs"></oprion>
            <oprion :value="ESlot.Special"></oprion>
        </select>
    </div>
    <div ref="obj" id="obj" class="form-group" style="visibility: hidden">
        <label class="control-label">Object</label>
        <input @change="onObjChange" type="file" class="form-control" />
    </div>
    <div class="form-group">
        <input type="submit" @click.prevent="update()" class="btn btn-primary" />
    </div>
</template>

<style scoped></style>