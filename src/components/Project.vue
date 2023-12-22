<template>
    <div class="container">
      <div v-if="!loading" class="input-group mb-3">
        <input type="file" accept=".txt" class="form-control" ref="fileInput">
        <button type="button" class="btn btn-primary" @click="sendFile()">Upload</button>
      </div>
      <div v-else class="d-flex align-items-center">
        <strong role="status">Loading...</strong>
        <div class="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
      <div v-if="mancanza" class="alert alert-danger" role="alert">
        Inserisci file .txt!
      </div>
      <template v-for="(q, i) in questions">
        <qaCard :question="q" :answer="answers[i]"></qaCard>
      <br />
      <br />
      </template>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import qaCard from './Q&Acard.vue';
  
  export default {
    data() {
      return {
        selectedFile: null,
        fileContent: "",
        questions: [],
        answers: [],
        loading: false,
        mancanza: false,
      };
    },
    components: {
      qaCard
    },
    methods: {
      sendFile() {
        this.selectedFile = this.$refs.fileInput.files[0];
        if (this.selectedFile) {
          this.mancanza = false;
          const fileReader = new FileReader();

          fileReader.onload = (e) => {
            this.fileContent = e.target.result;

            const payload = {
              text: this.fileContent.toString()
            };
            this.addFile(payload);
          };

          fileReader.readAsText(this.selectedFile);
        } else {
          this.mancanza = true;
        }
      },
      addFile(payload) {
        this.loading = true;
        //Cambiare la parte dopo // e prima di .app con il percorso fornito dal server in Colab
        const path = 'https://2765-34-68-114-167.ngrok-free.app/upload';
        axios.post(path, payload)
        .then((res) => {
          this.insertQA(res.data.msg);
          this.loading = false;
        })  
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
      },
      insertQA(text){
        this.questions = [];
        this.answers = [];
        let stringhe = text.split("Q");
        for (let i = 1; i < stringhe.length; i++) {
            let qa = stringhe[i].split("A");
            this.questions.push(qa[0]);
            let answer = qa[1].split(": ")[1]
            this.answers.push(answer);
        }
      },
    },
  };
  </script>