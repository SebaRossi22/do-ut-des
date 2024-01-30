<template>
    <div class="container">
      <!--Questo template viene mostrato quando la variabile loading è a false-->
      <template v-if="!loading">
        <!--Input per caricare il file txt-->
        <div class="input-group mb-3">
          <input type="file" accept=".txt" class="form-control" ref="fileInput">
          <button type="button" class="btn btn-primary" @click="sendFile()">Genera</button>
        </div>
        <!--Se si preme il pulsante soprastante e il file non è selezionato mostriamo l'alert-->
        <div v-if="mancanza" class="alert alert-danger" role="alert">
          Inserisci file .txt!
        </div>
        <!--Quando il vettore questions viene riempito lo scorriamo con un ciclo for-->
        <div v-for="(q, i) in questions">
          <!--Per ogni domanda presente generiamo un componente da noi creato a cui passiamo la domanda e la risposta del sistema-->
          <qaCard :question="q" :answer="answers[i]"></qaCard>
          <br />
          <br />
        </div>
      </template>
      <!--Inviata la richiesta al server mostriamo il componente di loading-->
      <div v-else class="d-flex align-items-center">
        <strong role="status">Loading...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
      <!--Alert per la gestione degli errori nella richiesta al server-->
      <div v-if="errore" class="alert alert-danger" role="alert">
        Errore nella richiesta al server (Vedi console)!
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'; //Importiamo axios per le richieste al server
  import qaCard from '../components/Q&Acard.vue'; //Importiamo il nostro componente

  export default {
    data() {
      return {
        selectedFile: null, //Variabile che conterrà il file caricato
        fileContent: "", //Stringa che conterrà il testo presente nel file
        questions: [], //Vettore che conterrà le domande del modello
        answers: [], //Vettore che conterrà le risposte del modello
        loading: false, //Boolean per la gestione del caricamento della richiesta
        mancanza: false, //Boolean per la presenza del file
        errore: false, //Boolean per gestire gli errori nella richiesta al server
      };
    },
    //Definiamo il componente
    components: {
      qaCard
    },
    methods: {
      //Funzione per caricare e inviare il file txt
      sendFile() {
        //Assegnamo il nuovo file
        this.selectedFile = this.$refs.fileInput.files[0];
        //Controlliamo se il file è stato selezionato
        if (this.selectedFile) {
          this.mancanza = false;
          //Creiamo un nuovo oggetto per leggere i file
          const fileReader = new FileReader();
          //Quando il file è stato completamente letto, l'evento onload viene attivato e la funzione di callback assegnata viene eseguita
          fileReader.onload = (e) => {
            this.fileContent = e.target.result;
            //Definiamo il payload con il testo del file
            const payload = {
              text: this.fileContent.toString()
            };
            //Utilizziamo la funzione addfile a cui passiamo il payload appena creato
            this.addFile(payload);
          };
          //Avvia la lettura del contenuto del file come stringa di testo
          fileReader.readAsText(this.selectedFile);
        } else {
          //Se il file non è stato selezionato metto a true la variabile che mostrerà l'alert
          this.mancanza = true;
        }
      },
      //Funzione per eseguire la richiesta al server
      addFile(payload) {
        //Inviata la richiesta verrà mostrato il componente di loading
        this.loading = true;
        //Percorso a cui puntare per la richiesta
        const path = 'https://502c-34-31-69-109.ngrok-free.app/questions';
        //Utilizziamo axios per fare una richiesta di tipo post passando il percorso e il payload
        axios.post(path, payload)
        .then((res) => {
          //Se la richiesta va a buon fine e il server restituisce la risposta la passiamo alla funzione insertQA, non mostriamo l'alert di errore e fermiamo il caricamento
          this.insertQA(res.data.msg);
          this.errore = false;
          this.loading = false;
        })  
        .catch((error) => {
          //Se la richiesta non va a buon fine mostriamo l'errore in console, mostriamo l'alert di errore e fermiamo il caricamento
          this.errore = true;
          console.error(error);
          this.loading = false;
        });
      },
      //Funzione per scomporre la risposta del modello in domande e risposte
      insertQA(text){
        //Svuotiamo i due vettori
        this.questions = [];
        this.answers = [];
        //Separiamo il testo in base al carattere Q
        let stringhe = text.split("Q");
        //Utilizziamo un ciclo for per scorrere tutte le stringhe generate prima
        for (let i = 1; i < stringhe.length; i++) {
          //Ogni stringa viene poi divisa in base al carattere A
          let qa = stringhe[i].split("A");
          //Il primo elemento corrisponderà alla domanda che inseriremo nel vettore relativo
          this.questions.push(qa[0]);
          //Il secondo elemento sarà la risposta a cui però dobbiamo togliere la prima parte
          let answer = qa[1].split(": ")[1]
          //Inseriamo la risposta nel relativo vettore
          this.answers.push(answer);
        }
      },
    },
  };
  </script>