import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue'
import AvatarIndexView from '@/views/Avatar/AvatarIndexView.vue'
import { useAuthStore } from '@/stores/auth'
import AvatarCreateView from '@/views/Avatar/AvatarCreateView.vue'
import AvatarUpdateView from '@/views/Avatar/AvatarUpdateView.vue'
import ItemIndexView from '@/views/Item/ItemIndexView.vue'
import ItemUpdateView from '@/views/Item/ItemUpdateView.vue'
import ItemCreateView from '@/views/Item/ItemCreateView.vue'
import OwnsIndexView from '@/views/Owns/OwnsIndexView.vue'
import OwnsCreateView from '@/views/Owns/OwnsCreateView.vue'
import OwnsUpdateView from '@/views/Owns/OwnsUpdateView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/', name: 'Home', component: HomeView
        },
        {
            path: '/Login', name: 'Login', component: LoginView
        },
        {
            path: '/Register', name: 'Register', component: RegisterView
        },
        {
            path: '/Avatar', name: 'Avatar', component: AvatarIndexView
        },
        {
            path: '/Avatar/Create', name: 'Create', component: AvatarCreateView
        },
        {
            path: '/Avatar/Update/:avatarId', name: 'Update', component: AvatarUpdateView, props: true
        },
        {
            path: '/Item', name: 'Item', component: ItemIndexView
        },
        {
            path: '/Item/Create', name: 'ItemCreate', component:ItemCreateView
        },
        {
            path: '/Item/Update/:itemId', name: 'ItemUpdate', component: ItemUpdateView, props: true
        },
        {
            path: '/Owns', name: 'Owns', component: OwnsIndexView
        },
        {
            path: '/Owns/Create', name: 'OwnsCreate', component: OwnsCreateView
        },
        {
            path: '/Owns/Update/:ownsId', name: 'OwnsUpdate', component: OwnsUpdateView, props: true
        }
    ]
})

// router.beforeEach((to) =>{
//     const store = useAuthStore;
// })

export default router
