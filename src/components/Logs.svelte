<script>
   import { format } from "date-fns";
   import axios from "axios";
   import { onMount } from "svelte";
   import Loading from "./Loading.svelte";
   import Header from "./Header.svelte";
   import AppShell from "./AppShell.svelte";
   import { user } from "../stores";

   const { API_URL } = __myapp.env;

   let logs = null;
   let currentUser;

   async function fetchLogs() {
      const response = await axios.get(`${API_URL}/logs`, { params: { id: $user.id } });
      logs = response.data;
   }

   function formatTimestamp(ts) {
      return format(new Date(ts), "EEEE LLL d, yyyy h:mm a");
   }

   onMount(() => fetchLogs());
</script>

<AppShell>
   <Header title="My Private Lifelog">
      <a href="/#/menu" id="gearLink">
         <div class="hamgburgerMenuLine"></div>
         <div class="hamgburgerMenuLine"></div>
         <div class="hamgburgerMenuLine"></div>
      </a>
   </Header>
   {#if !$user.phone}
      <a href="/#/confirm-phone" id="linkPhoneCTAContainer"><button id="linkPhoneCTA">Add new log entries by texting us</button></a>
   {/if}
   {#if !logs}
      <Loading>Syncing your lifelog...</Loading>
   {:else}
      {#each logs as log}
         <div class="log_container">
            <p>{log.text}</p>
            {#if log.attachmentUrl}<img src="{log.attachmentUrl}" />{/if}
            <caption>{formatTimestamp(log.created)}</caption>
         </div>
      {:else}
         <h4>You don't have any logs yet!</h4>
      {/each}
   {/if}
   <a id="add_log" href="/#/new-entry" class="floatingCircleBtn"><span>+</span></a>
</AppShell>

<style>
   img {
      width: 90%;
      max-width: 300px;
      margin-bottom: 10px;
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.05);
   }

   #linkPhoneCTAContainer {
      padding: 0px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
   }

   caption {
      font-size: 0.5rem;
      color: rgba(255, 255, 255, 0.5);
      text-align: left;
   }

   h4 {
      width: 100%;
      text-align: center;
      color: #fff;
   }

   .log_container {
      display: flex;
      flex-direction: column;
      padding: 30px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      /*width: 100%;*/
   }

   /*.log_container:nth-child(even) {*/
   /*   background-color: rgba(255, 255, 255, 0.03);*/
   /*}*/

   .log_container p {
      color: rgba(255, 255, 255, 1);
      font-weight: 400;
      letter-spacing: 0.03em;
      line-height: 1.3;
      margin: 0px 0px 10px 0px;
      font-size: 1rem;
   }

   #add_log {
      position: fixed;
      bottom: 20px;
      right: 20px;
   }

   #add_log:hover {
      text-decoration: none;
   }

   #gearLink {
      width: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0.8;
   }

   #gearLink:hover {
      opacity: 1;
   }

   .hamgburgerMenuLine {
      width: 100%;
      height: 2px;
      background-color: rgba(255, 255, 255, 1);
      margin: 1.5px 0px;
   }

   #linkPhoneCTA {
      margin: 20px auto;
      width: 100%;
      border-radius: 20px;
      color: rgba(255, 255, 255, 0.8);
      border: 2px solid rgba(255, 255, 255, 0.1);
      background-color: rgba(255, 255, 255, 0.1);
      cursor: pointer;
   }
</style>
