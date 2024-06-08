<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';

const authStore = useAuthStore();
// console.log(authStore.isAuthenticated);

const forceUpdate = ref(true);
onMounted(() => {
      const intervalId = setInterval(() => {
        forceUpdate ? false : true;
        intervalId;
      }, 1000);
    });

const logout = () => {authStore.logOut()};

</script>

<template>
  <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm mb-3">
                <div className="container">
                    <Link href="/" className="header-text">Vue App</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1 -text">

                                    <li class="nav-item">
                                        <RouterLink class="nav-link header-text" :to="{ name: 'Home' }">Home</RouterLink>
                                    </li>
                                    <li class="nav-item">
                                        <RouterLink class="nav-link header-text" :to="{ name: 'Avatar' }">Avatar</RouterLink>
                                    </li>
                                    <li class="nav-item">
                                        <RouterLink class="nav-link header-text" :to="{ name: 'Item' }">Items</RouterLink>
                                    </li>
                                    <li class="nav-item">
                                        <RouterLink class="nav-link header-text" :to="{ name: 'Owns' }">Owns</RouterLink>
                                    </li>
                            
                        </ul>

                        <ul v-if="!authStore.isAuthenticated" class="navbar-nav footer-text">
                            <li class="nav-item ">
                                <RouterLink class="nav-link text-dark" :to="{name: 'Register'}">Register</RouterLink>
                            </li>
                            <li class="nav-item">
                                <RouterLink class="nav-link text-dark" :to="{ name: 'Login' }">Login</RouterLink>
                            </li>
                        </ul>
                        <ul v-else class="navbar-nav footer-text">
                            <li class="nav-item">
                                <a class="nav-link text-dark" href="#" @click.prevent="logout">Logout</a>
                            </li>
                        </ul>


                    </div>
                </div>
            </nav>
    </header>
</template>

<style scoped>
</style>
