<script>
   import axios from "axios";
   import { onMount, onDestroy } from "svelte";
   import Loading from "./Loading.svelte";
   import Header from "./Header.svelte";
   import AppShell from "./AppShell.svelte";
   import { showNotification } from "./Notification.svelte";
   import { user, notification } from "../stores";

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
   let newLogText = window.localStorage.getItem("newLogEntry") || "";
   let ref;
   let isLoading = false;
   let snackbar;

   async function createLogEntry() {
      return axios.post(`${API_URL}/logs`, { user: $user.id, text: newLogText });
   }

   async function handleCreateLogEntry() {
      try {
         isLoading = true;
         await createLogEntry();
         newLogText = "";
         showNotification({ msg: "Lifelog entry saved!", type: "success" });
      } catch (e) {
         showNotification({ msg: "Uh oh! Failed to create lifelog entry", type: "error" });
      } finally {
         isLoading = false;
      }
   }

   function focusTextarea() {
      setTimeout(() => {
         ref.focus();
      }, 100);
   }

   onMount(() => {
      focusTextarea();
   });

   onDestroy(() => {
      window.localStorage.setItem("newLogEntry", newLogText);
   });
</script>

<AppShell>
   <Header showBackButton="{true}" disableAction="{!newLogText.length}" onAction="{handleCreateLogEntry}" />

   <textarea
      disabled="{isLoading}"
      bind:value="{newLogText}"
      placeholder="{placeholders[Math.floor(Math.random() * placeholders.length)]}"
      bind:this="{ref}"
   ></textarea>

   {#if isLoading}
      <Loading />
   {/if}
</AppShell>

<style>
   textarea {
      width: 100%;
      background-color: rgba(255, 255, 255, 0.05);
      caret-color: rgba(255, 255, 255, 0.9);
      font-size: 20px;
      border: none;
      resize: vertical;
      line-height: 1.3;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 0.03em;
      min-height: calc(100vh - 50px);
      padding: 20px;
   }

   textarea:focus {
      border: none;
      outline: none;
   }
</style>
