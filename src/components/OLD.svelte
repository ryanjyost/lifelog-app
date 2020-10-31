<script>
   import axios from "axios";
   import Router from "svelte-spa-router";
   import routes from "../routes";
   import Logs from "../components/Logs.svelte";
   import Header from "../components/Header.svelte";
   import Loading from "../components/Loading.svelte";

   const { API_URL } = __myapp.env;
   let isNewLogFormOpen = false;
   let newLogEntry;
   let newLogText = "";
   let ref;
   let isLoading = false;
   let snackbar;

   const pages = [];

   const placeholders = [
      "What's up?",
      "How's it going?",
      "I've been thinking that...",
      "I feel like...",
      "I just had the most delicious...",
      "Just hopped off a call with...",
      "I heard the funniest story today...",
      "Lately, I've been...",
      "That movie was freakin'...",
      "What did you just do?",
      "Anything cool coming up?",
   ];

   async function createLogEntry() {
      return axios.post(`${API_URL}/logs`, { phone: "+14128411697", text: newLogText });
   }

   function showMessage({ msg, type }) {
      snackbar = { msg, type };
      setTimeout(() => {
         snackbar = null;
      }, 4001);
   }

   async function handleCreateLogEntry() {
      try {
         isLoading = true;
         await createLogEntry();
         newLogText = "";
         showMessage({ msg: "Lifelog entry saved!", type: "success" });
      } catch (e) {
         showMessage({ msg: "Uh oh! Failed to create lifelog entry", type: "error" });
      } finally {
         isLoading = false;
      }
   }

   function handleOpenNewLogForm() {
      isNewLogFormOpen = true;
   }

   function handleCancelNewLogEntry() {
      isNewLogFormOpen = false;
   }

   function focusTextarea() {
      setTimeout(() => {
         ref.focus();
      }, 10);
   }

   // $: console.log({
   //    isNewLogFormOpen,
   //    newLogText,
   //    // logs,
   // });

   $: if (isNewLogFormOpen) {
      focusTextarea();
   }
</script>

<main>
   {#if isNewLogFormOpen}
      <Header>
         <a id="cancelNewLogEntry" on:click="{handleCancelNewLogEntry}">&larr;</a>
         <button id="save_log_entry" disabled="{!newLogText.length}" on:click="{handleCreateLogEntry}">Save</button>
      </Header>
   {:else}
      <Header />
   {/if}

   {#if isLoading}
      <Loading />
   {/if}

   {#if isNewLogFormOpen}
      <textarea
         disabled="{isLoading}"
         bind:value="{newLogText}"
         placeholder="{placeholders[Math.floor(Math.random() * placeholders.length)]}"
         bind:this="{ref}"
      ></textarea>
   {:else}
      <Logs />
      <button id="add_log" on:click="{handleOpenNewLogForm}" disabled="{isLoading}"><span id="plus">+</span></button>
   {/if}

   <div class="snackbar {snackbar ? 'show' : null} {snackbar ? snackbar.type : null}">
      {snackbar ? snackbar.msg : null}
   </div>
</main>

<style>
   a {
      cursor: pointer;
   }

   textarea {
      width: 100%;
      background-color: transparent;
      caret-color: rgba(255, 255, 255, 0.9);
      font-size: 20px;
      border: none;
      resize: vertical;
      line-height: 1.3;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 0.03em;
      height: 100%;
      padding: 20px;
   }

   textarea:focus {
      border: none;
      outline: none;
   }

   #add_log {
      position: fixed;
      bottom: 20px;
      right: 20px;
      border-radius: 50%;
      height: 60px;
      width: 60px;
      line-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(179, 66, 204, 1);
      border: 0px solid rgba(179, 66, 204, 1);
      box-shadow: 0 2px 5px rgba(255, 255, 255, 0.06), 0 2px 5px rgba(255, 255, 255, 0.14);
      cursor: pointer;
   }

   #plus {
      margin-bottom: 6px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 40px;
   }

   #cancelNewLogEntry {
      opacity: 0.8;
      font-weight: 900;
      font-size: 1.5rem;
   }

   #save_log_entry {
      margin: 0px;
      border-radius: 20px;
      width: 90px;
      background-color: rgba(179, 66, 204, 0.9);
      border: 0px solid rgba(179, 66, 204, 0.9);
      color: #fff;
      font-weight: bold;
      cursor: pointer;
   }

   #save_log_entry:disabled {
      background-color: rgba(179, 66, 204, 0.5);
      border: 0px solid rgba(179, 66, 204, 0.5);
      color: rgba(255, 255, 255, 0.5);
      cursor: default;
   }

   .snackbar {
      visibility: hidden; /* Hidden by default. Visible on click */
      width: 250px; /* Set a default minimum width */
      max-width: 100%;
      background-color: #333; /* Black background color */
      color: #fff; /* White text color */
      border-radius: 4px; /* Rounded borders */
      padding: 14px 16px;
      position: fixed; /* Sit on top of the screen */
      z-index: 2; /* Add a z-index if needed */
      left: 20px; /* Center the snackbar */
      bottom: 20px; /* 30px from the bottom */
      text-align: left;
      box-shadow: 0 2px 5px rgba(255, 255, 255, 0.06), 0 2px 5px rgba(255, 255, 255, 0.14);
      font-size: 1rem;
      line-height: 1.2;
   }

   /* Show the snackbar when clicking on a button (class added with JavaScript) */
   .snackbar.show {
      visibility: visible; /* Show the snackbar */
      -webkit-animation: fadein 0.5s, fadeout 0.5s 4s;
      animation: fadein 0.5s, fadeout 0.5s 4s;
   }

   .snackbar.error {
      background-color: #e74343;
   }

   .snackbar.success {
      background-color: #41cf43;
   }

   /* Animations to fade the snackbar in and out */
   @-webkit-keyframes fadein {
      from {
         bottom: 0;
         opacity: 0;
      }
      to {
         bottom: 30px;
         opacity: 1;
      }
   }

   @keyframes fadein {
      from {
         bottom: 0;
         opacity: 0;
      }
      to {
         bottom: 30px;
         opacity: 1;
      }
   }

   @-webkit-keyframes fadeout {
      from {
         bottom: 30px;
         opacity: 1;
      }
      to {
         bottom: 0;
         opacity: 0;
      }
   }

   @keyframes fadeout {
      from {
         bottom: 30px;
         opacity: 1;
      }
      to {
         bottom: 0;
         opacity: 0;
      }
   }
</style>
