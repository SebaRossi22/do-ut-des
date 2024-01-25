<template>
  <!--Creiamo due radio button per spostarci tra le due diverse modalità di utilizzo dell'interfaccia-->
  <div class="btn-group start-50 translate-middle" data-toggle="buttons">
      <input type="radio" class="btn-check" name="options-base" id="domande" autocomplete="off" @click="domande" checked>
      <label class="btn btn-outline-primary" for="domande">Genera domande</label>

      <input type="radio" class="btn-check" name="options-base" id="risposte" autocomplete="off" @click="risposte">
      <label class="btn btn-outline-primary" for="risposte">Genera risposte</label>
  </div>
  <!--Questo comando è quello che consente di far funzionare il router-->
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
