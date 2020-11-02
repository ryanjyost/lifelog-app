<script>
   import firebase from "firebase/app";
   import "firebase/auth";
   import { push } from "svelte-spa-router";
   import Header from "./Header.svelte";
   import AppShell from "./AppShell.svelte";
   import { user } from "../stores";

   const auth = firebase.auth();

   export const logout = () => {
      console.log("logout");
      window.location.reload();
      auth.signOut();
   };

   $: console.log($user);
   $: phone = $user ? $user.phone : null;
</script>

<AppShell>
   <Header title="Menu" showBackButton="{true}" />

   <div class="linksContainer">
      <a href="/#/confirm-phone">Link your phone number</a>
      <a href="/" on:click="{logout}">Logout</a>
   </div>
</AppShell>

<style>
   a {
      width: 100%;
      font-size: 1.5rem;
      margin-bottom: 20px;
   }

   .linksContainer {
      width: 100%;
      text-align: center;
      padding-top: 50px;
      display: flex;
      flex-direction: column;
   }
</style>
