<template>
  <!--Componente card che verrà utilizzato per ogni domanda generata dal modello-->
  <div class="card">
    <!--Come header inseriamo la domanda-->
    <div class="card-header">
      {{question}}
    </div>
    <div class="card-body">
      <!--Quando la variabile loading è a false mostraimo degli elementi per inserire e comparare la risposta-->
      <template v-if="!loading">
        <div class="input-group">
          <textarea v-model="risposta" class="form-control" aria-label="With textarea"></textarea>
          <!--Se la richiesta deve essere ancora inviata viene mostrato questo button per comparare le due risposte-->
          <button v-if="!typeBtn" type="button" class="btn btn-primary" @click="compare(risposta, answer)">Giusta?</button>
          <!--Se invece la richiesta è già stata inviata questo button consente di cancellare e inserire una nuova risposta-->
          <button v-else type="button" class="btn btn-primary" @click="remove()">Cancella</button>
        </div>
        <br />
        <!--Se l'utente non ha inserito la risposta e preme il pulsante viene mostrato l'alert-->
        <div v-if="mancanza" class="alert alert-danger" role="alert">
          Inserisci la tua risposta!
        </div>
      </template>
      <!--Inviata la richiesta al server mostriamo il componente di loading-->
      <div v-else class="d-flex align-items-center">
        <strong role="status">Loading...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
      <!--Quando il server restituisce il risultato viene mostrato tramite una progress bar-->
      <template v-if="result">
        <label for="progressBar" class="form-label">Correttezza della risposta:</label>
        <div class="progress" role="progressbar" id="progressBar" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" :style="{ width: similarity + '%' }">{{similarity}}%</div>
        </div>
        <br />
        <!--Inoltre viene anche mostrata la risposta corretta che ha generato il modello-->
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
  //Definiamo le due variabili passate dalla pagina Question.vue
  props: {
    question: String,
    answer: String,
  },
  data() {
    return {
      similarity: 0, //Varibile a cui verrà assegnato il valore di similarità
      risposta: "", //Risposta inserita dall'utente
      loading: false, //Boolean di caricamento
      result: false, //Boolean che controlla se è presente il risultato
      typeBtn: false, //Boolean per determinare quale button mostrare
      mancanza: false, //Boolean per controllare se l'utente ha inserito la risposta
    };
  },
  methods: {
    //Funzione per cancellare la risposta già data
    remove(){
      this.result = false;
      this.typeBtn = false;
      this.risposta = "";
    },
    //Funzione per comparare la due risposte
    compare(utente, sistema) {
      //Controlliamo che l'utente abbia inserito la risposta
      if(utente !== ""){
        //Quando viene inviata la richiesta facciamo partire il caricamento
        this.loading = true;
        this.mancanza = false;
        //Definiamo il payload con che conterrà la risposta dell'utente e quella del sistema
        const payload = {
              userA: utente.toString(),
              answer: sistema.toString()
            };
        //Percorso a cui puntare per la richiesta
        const path = 'https://38af-35-204-54-48.ngrok-free.app/similar';
        //Utilizziamo axios per fare una richiesta di tipo post passando il percorso e il payload
        axios.post(path, payload)
        .then((res) => {
          //Se la richiesta va a buon fine e il server restituisce la risposta la assegnamo alla variabile relativa, inoltre arrotondiamo il decimale a due cifre
          this.similarity = (res.data.sim * 100).toFixed(2);
          //Fermiamo il caricamento, definiamo la presenza del risultato e infine modifichiamo il button
          this.loading = false;
          this.result = true;
          this.typeBtn = true;
        })  
        .catch((error) => {
          //Se la richiesta non va a buon fine mostriamo l'errore e fermiamo il caricamento
          console.error(error);
          this.loading = false;
        });
      }else{
        //Se l'utente non ha inserito la sua risposta verrà mostrato l'alert relativo a questa variabile
        this.mancanza = true;
      }
    },
  },
};
</script>

<style>

</style>