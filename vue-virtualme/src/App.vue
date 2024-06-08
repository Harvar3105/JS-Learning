<script setup lang="ts">
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import LoginView from './views/LoginView.vue';

</script>

<template>
  <HeaderComponent/>
    <div class="container">
        <main role="main" class="pb-3">
            <router-view></router-view>
        </main>
    </div>
  
  <FooterComponent/>
</template>

<style scoped>
</style>
