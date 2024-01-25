<template>
    <div class="container">
      <!--Questo template viene mostrato quando la variabile loading è a false-->
      <template v-if="!loading">
        <!--Componente che consente di caricare un file txt dal computer-->
        <div class="input-group mb-3">
          <input type="file" accept=".txt" class="form-control" ref="fileInput">
          <button type="button" class="btn btn-secondary" @click="selectFile()">Seleziona</button>
        </div>
        <!--Se si preme il pulante soprastante ma non è stato selezionato un file, viene mostrato questo alert-->
        <div v-if="mancanza" class="alert alert-danger" role="alert">
          Inserisci file .txt!
        </div>
        <!--Quando il file è caricato viene mostrato alert di successo-->
        <template v-if="fileContent">
          <div class="alert alert-success" role="alert">
            Il file {{nomeTxt}} è caricato!
          </div>
          <!--Inoltre, se il file è presente, viene mostrato un input dove l'utente può inserire la sua domanda-->
          <div class="input-group mb-3">
            <input v-model="domanda" type="text" class="form-control" placeholder="Inserisci la tua domanda" aria-describedby="button">
            <button class="btn btn-primary" type="button" id="button" @click="question()">Rispondi</button>
          </div>
          <!--Se si preme il pulsante soprastante ma non viene inserita una domanda da fare al modello, viene mostrato questo alert-->
          <div v-if="mancanzaD" class="alert alert-danger" role="alert">
            Inserisci la tua domanda!
          </div>
          <!--Quando il server avrà restituito la risposta verrà mostrata in questa card-->
          <div v-if="risposta" class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Risposta</h5>
              {{risposta}}
            </div>
          </div>
        </template>
      </template>
      <!--Quando l'utente invia la richiesta al server viene mostrato il componente di caricamento-->
      <div v-else class="d-flex align-items-center">
        <strong role="status">Loading...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    </div>
  </template>
  
  <script>
  //Importiamo axios che servirà per le richieste al server
  import axios from 'axios';

  export default {
    data() {
      return {
        selectedFile: null, //Variabile che conterrà il file caricato
        fileContent: "", //Stringa che conterrà il testo presente nel file
        loading: false, //Boolean per la gestione del caricamento della richiesta
        mancanzaD: false, //Boolean per la presenza della domanda
        mancanza: false, //Boolean per la presenza del file
        domanda: "", //Variabile che conterrà la domanda dell'utente
        risposta: "", //Variabile che conterrà la risposta fornita dal modello
        nomeTxt: "", //Varibile che conterrà il nome del file txt
      };
    },
    methods: {
      //Funzione per caricare il file txt
      selectFile() {
        //Svuotiamo le due varibili
        this.fileContent = "";
        this.risposta = "";
        this.selectedFile = null;
        //Assegnamo il nuovo file
        this.selectedFile = this.$refs.fileInput.files[0];
        //Prendiamo il nome del file
        if(this.selectedFile != null){
          this.nomeTxt = this.$refs.fileInput.files[0].name;
        }
        //Controlliamo se il file è stato selezionato
        if (this.selectedFile) {
          this.mancanza = false;
          //Creiamo un nuovo oggetto per leggere i file
          const fileReader = new FileReader();
          //Quando il file è stato completamente letto, l'evento onload viene attivato e la funzione di callback assegnata viene eseguita
          fileReader.onload = (e) => {
            this.fileContent = e.target.result;
          };
          //Leggiamo il contenuto del file come stringa di testo
          fileReader.readAsText(this.selectedFile);
        } else {
          //Se il file non è stato selezionato metto a true la variabile che mostrerà l'alert
          this.mancanza = true;
        }
      },
      //Funzione che genera il payload utilizzato per fare la richiesta
      question() {
        //Controlliamo che l'utente abbia inserito più di 10 caratteri
        if (this.domanda.length > 10) {
            this.mancanzaD = false;
            //Definiamo il payload con il testo del file e la domanda dell'utente
            const payload = {
                text: this.fileContent.toString(),
                domanda: this.domanda.toString()
            };
            //Utilizziamo la funzione addfile a cui passiamo il payload appena creato
            this.addFile(payload);
            //Svuotiamo la domanda
            this.domanda = "";
        } else {
          //Se l'utente non ha inserito la domanda mettendo a true questa variabile verrà mostrato l'alert
          this.mancanzaD = true;
        }
      },
      //Funzione per eseguire la richiesta al server
      addFile(payload) {
        //Inviata la richiesta verrà mostrato il componente di loading
        this.loading = true;
        //Percorso a cui puntare per la richiesta
        const path = 'https://38af-35-204-54-48.ngrok-free.app/answers';
        //Utilizziamo axios per fare una richiesta di tipo post passando il percorso e il payload
        axios.post(path, payload)
        .then((res) => {
          //Se la richiesta va a buon fine e il server restituisce la risposta la assegnamo alla variabile relativa e fermiamo il caricamento
          this.risposta = res.data.msg;
          this.loading = false;
        })  
        .catch((error) => {
          //Se la richiesta non va a buon fine mostriamo l'errore e fermiamo il caricamento
          console.error(error);
          this.loading = false;
        });
      },
    },
  };
  </script>