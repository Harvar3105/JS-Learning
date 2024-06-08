<script setup lang="ts">
import AccountService from '@/services/AccountService';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();

let registerName = ref('');
let registerEmail = ref('');
let registerPassword = ref('');
let registerConfirmPassword = ref('');

let registerIsOngoing = ref(false);
let errors = ref<string[]>([]);

const doRegister = async () => {
    registerIsOngoing.value = true;

    const res = await AccountService.registerAsync(registerName.value, registerEmail.value, registerPassword.value, registerConfirmPassword.value);

    if (res.data) {
        authStore.jwt = res.data.jwt;
        authStore.refreshToken = res.data.refreshToken;
        authStore.refreshTokens();
        errors.value = [];
    } else {
        errors.value = res.errors!;
    }

    registerIsOngoing.value = false;
}

</script>

<template>
<div class="row">
    <div class="col-md-4">
        <form id="registerForm" asp-route-returnUrl="@Model.ReturnUrl" method="post">
            <h2>Create a new account</h2>
            <hr />
            
            <div>{{ errors.join(',') }}</div>
            
            <div class="form-floating mb-3">
                <input v-model="registerName" id="Input_NickName" class="form-control"  aria-required="true" placeholder="NickName" />
                <label for="Input_NickName" >NickName</label>
            </div>
            
            <div class="form-floating mb-3">
                <input v-model="registerEmail" id="Input_Email" class="form-control" autocomplete="username" aria-required="true" placeholder="name@example.com" />
                <label for="Input_Email" >Email</label>
            </div>
            <div class="form-floating mb-3">
                <input v-model="registerPassword" id="Input_Password" class="form-control" autocomplete="new-password" aria-required="true" placeholder="password" />
                <label for="Input_Password" >Password</label>
            </div>
            <div class="form-floating mb-3">
                <input v-model="registerConfirmPassword" id="Input_PasswordConfirm" class="form-control" autocomplete="new-password" aria-required="true" placeholder="password" />
                <label for="Input_PasswordConfirm" >Password</label>
            </div>
            <button @click.prevent="doRegister" id="registerSubmit" type="submit" class="w-100 btn btn-lg btn-primary">
                {{ registerIsOngoing ? 'Wait...' : 'Do login' }}</button>
        </form>
    </div>
</div>
</template>

<style scoped></style>