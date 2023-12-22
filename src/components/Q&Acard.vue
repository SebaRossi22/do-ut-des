<template>
    <div class="card">
  <div class="card-header">
    {{question}}
  </div>
  <div class="card-body">
    <template v-if="!loading">
      <div class="input-group">
        <textarea v-model="risposta" class="form-control" aria-label="With textarea"></textarea>
        <button v-if="!typeBtn" type="button" class="btn btn-primary" @click="compare(risposta, answer)">Giusta?</button>
        <button v-else type="button" class="btn btn-primary" @click="remove()">Cancella</button>
      </div>
      <br />
      <div v-if="mancanza" class="alert alert-danger" role="alert">
        Inserisci la tua risposta!
      </div>
    </template>
    <div v-else class="d-flex align-items-center">
        <strong role="status">Loading...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
    </div>
    <template v-if="result">
      <label for="progressBar" class="form-label">Correttezza della risposta:</label>
      <div class="progress" role="progressbar" id="progressBar" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" :style="{ width: similarity + '%' }">{{similarity}}%</div>
      </div>
      <br />
      <div class="input-group">
        <span class="input-group-text" id="basic-addon3">La risposta corretta è:</span>
        <input :value="answer" type="text" class="form-control" aria-describedby="answer" readonly>
      </div>
    </template>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    question: String,
    answer: String,
  },
  data() {
    return {
      similarity: 0,
      risposta: "",
      loading: false,
      result: false,
      typeBtn: false,
      mancanza: false,
    };
  },
  methods: {
    remove(){
      this.result = false;
      this.typeBtn = false;
      this.risposta = "";
    },
    compare(utente, sistema) {
      if(utente !== ""){
        this.loading = true;
        this.mancanza = false;
        const payload = {
              userA: utente.toString(),
              answer: sistema.toString()
            };
        //Cambiare la parte dopo // e prima di .app con il percorso fornito dal server in Colab
        const path = 'https://2765-34-68-114-167.ngrok-free.app/similar';
        axios.post(path, payload)
        .then((res) => {
          this.similarity = res.data.sim * 100;
          this.loading = false;
          this.result = true;
          this.typeBtn = true;
        })  
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
      }else{
        this.mancanza = true;
      }
    },
  },
};
</script>

<style>

</style>