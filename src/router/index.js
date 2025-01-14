//Importiamo una serie di elementi di vue e bootstrap
import { createApp } from "vue";
import 'bootstrap/dist/css/bootstrap.css'
import App from "../App.vue";
import { createRouter, createWebHistory } from "vue-router";

//Importiamo le due pagine create
import question from '../pages/Question.vue'
import answer from '../pages/Answer.vue'

//Creiamo l'applicazione
const app = createApp(App);

//Definiamo le rotte per cambiare pagina
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'question',
      component: question
    },
    {
      path: '/answer',
      name: 'answer',
      component: answer
    },
  ],
});

//Montiamo l'applicazione
app.use(router).mount("#app");