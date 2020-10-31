<script>
   import { format } from "date-fns";
   import axios from "axios";
   import { onMount } from "svelte";
   import Loading from "./Loading.svelte";
   import Header from "./Header.svelte";
   import AppShell from "./AppShell.svelte";

   const { API_URL } = __myapp.env;
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

   let newLogEntry;
   let newLogText = "";
   let ref;
   let isLoading = false;
   let snackbar;

   async function createLogEntry() {
      return axios.post(`${API_URL}/logs`, { phone: "+14128411697", text: newLogText });
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

   function showMessage({ msg, type }) {
      snackbar = { msg, type };
      setTimeout(() => {
         snackbar = null;
      }, 4001);
   }

   function focusTextarea() {
      setTimeout(() => {
         console.log("focus");
         ref.focus();
      }, 100);
   }

   onMount(() => {
      focusTextarea();
   });
</script>

<AppShell>
   <Header>
      <a id="cancelNewLogEntry" href="/#/logs">&larr;</a>
      <button id="save_log_entry" disabled="{!newLogText.length}" on:click="{handleCreateLogEntry}">Save</button>
   </Header>
   <textarea
      disabled="{isLoading}"
      bind:value="{newLogText}"
      placeholder="{placeholders[Math.floor(Math.random() * placeholders.length)]}"
      bind:this="{ref}"
   ></textarea>

   <div class="snackbar {snackbar ? 'show' : null} {snackbar ? snackbar.type : null}">
      {snackbar ? snackbar.msg : null}
   </div>

   {#if isLoading}
      <Loading />
   {/if}
</AppShell>

<style>
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
      width: 100%; /* Set a default minimum width */
      max-width: 500px;
      background-color: #333; /* Black background color */
      color: #fff; /* White text color */
      border-radius: 4px; /* Rounded borders */
      padding: 14px 16px;
      position: fixed; /* Sit on top of the screen */
      z-index: 11; /* Add a z-index if needed */
      left: 0px; /* Center the snackbar */
      bottom: 0px; /* 30px from the bottom */
      text-align: left;
      box-shadow: 0 2px 5px rgba(255, 255, 255, 0.06), 0 2px 5px rgba(255, 255, 255, 0.14);
      font-size: 1rem;
      line-height: 1.2;
      display: flex;
      align-items: center;
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
      background-color: rgba(179, 66, 204, 0.9);
   }

   /* Animations to fade the snackbar in and out */
   @-webkit-keyframes fadein {
      from {
         bottom: 0;
         opacity: 0;
      }
      to {
         bottom: 0;
         opacity: 1;
      }
   }

   @keyframes fadein {
      from {
         bottom: 0;
         opacity: 0;
      }
      to {
         bottom: 0;
         opacity: 1;
      }
   }

   @-webkit-keyframes fadeout {
      from {
         bottom: 0;
         opacity: 1;
      }
      to {
         bottom: 0;
         opacity: 0;
      }
   }

   @keyframes fadeout {
      from {
         bottom: 0;
         opacity: 1;
      }
      to {
         bottom: 0;
         opacity: 0;
      }
   }
</style>
