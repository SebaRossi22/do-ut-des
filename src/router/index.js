import { createRouter, createWebHistory } from 'vue-router'
import project from '../components/Project.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'project',
      component: project
    },
  ]
})

export default router
