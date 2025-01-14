<template>
  <div class="container d-flex flex-column justify-content-center align-items-center m-5">
    <!-- Immagine logo -->
    <img src="../image/logo.png" height="100" alt="Logo" class="mb-4">
    
    <!-- Gruppo di bottoni per la scelta della modalità -->
    <div class="btn-group" data-toggle="buttons">
      <input type="radio" class="btn-check" name="options-base" id="domande" autocomplete="off" @click="domande" checked>
      <label class="btn btn-outline-primary" for="domande">Genera domande</label>

      <input type="radio" class="btn-check" name="options-base" id="risposte" autocomplete="off" @click="risposte">
      <label class="btn btn-outline-primary" for="risposte">Genera risposte</label>
    </div>
  </div>
  <!-- Questo comando è quello che consente di far funzionare il router -->
  <RouterView />
</template>

<script>
import { RouterView } from 'vue-router'

export default {
  //Per cambiare la modalità utilizziamo queste due funzioni che tramite il router ci consentono di vedere le due differenti pagine
  methods: {
    domande(){
      this.$router.replace("/");
    },
    risposte() {
      this.$router.replace("/answer");
    },
  },
};
</script>

<style>
#app {
  margin-top: 60px
}
</style>
