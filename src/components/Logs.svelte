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
   <Header title="My Private Lifelog"><a href="/#/menu" id="gearLink">&#9881;</a></Header>
   {#if !logs}
      <Loading>Syncing your lifelog...</Loading>
   {:else}
      {#each logs as log}
         <div class="log_container">
            <p>{log.text}</p>
            <caption>{formatTimestamp(log.created)}</caption>
         </div>
      {:else}
         <h4>You don't have any logs yet!</h4>
      {/each}
   {/if}
   <a id="add_log" href="/#/new-entry"><span id="plus">+</span></a>
</AppShell>

<style>
   caption {
      font-size: 0.5rem;
      color: rgba(255, 255, 255, 0.7);
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
   #plus:hover {
      margin-bottom: 6px;
      color: rgba(255, 255, 255, 1);
      font-size: 40px;
   }

   #add_log:hover {
      text-decoration: none;
   }

   #gearLink {
      font-size: 2rem;
   }
</style>
