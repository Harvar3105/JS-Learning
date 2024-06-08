<script setup lang="ts">
import AccountService from '@/services/AccountService';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();

let loginName = ref('');
let loginPassword = ref('');

let loginIsOngoing = ref(false);
let errors = ref<string[]>([]);

const doLogin = async () => {
    loginIsOngoing.value = true;

    const res = await AccountService.loginAsync(loginName.value, loginPassword.value);

    if (res.data) {
        authStore.jwt = res.data.jwt;
        authStore.refreshToken = res.data.refreshToken;
        authStore.userId = res.data.userId;
        errors.value = [];
    } else {
        errors.value = res.errors!;
    }

    loginIsOngoing.value = false;
}

</script>

<template>
    <h1>Log in</h1>
    <div class="row">
        <div class="col-md-6">
            <section>
                <form id="account" method="post">
                    <hr />

                    <div>{{ errors.join(',') }}</div>
                    <div class="form-floating mb-3">
                        <input v-model="loginName" class="form-control" autocomplete="username" aria-required="true"
                            placeholder="name@example.com" type="email" id="Input_Email" name="Input.Email" value="" />
                        <label class="form-label" for="Input_Email">Email</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input v-model="loginPassword" class="form-control" autocomplete="current-password"
                            aria-required="true" placeholder="password" type="password" id="Input_Password"
                            name="Input.Password" />
                        <label class="form-label" for="Input_Password">Password</label>
                    </div>

                    <div>
                        <button @click.prevent="doLogin" id="login-submit" type="submit"
                            class="w-100 btn btn-lg btn-primary">{{ loginIsOngoing ? 'Wait...' : 'Do login' }}</button>
                    </div>
                </form>
            </section>
        </div>

    </div>

</template>

<style scoped></style>
