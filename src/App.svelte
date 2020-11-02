<!-- App.svelte with styles omitted -->
<script>
   import firebase from "firebase/app";
   import Router from "svelte-spa-router";
   import Auth from "./components/Auth.svelte";

   import routes from "./routes";
   import { user } from "./stores";

   const firebaseConfig = {
      apiKey: "AIzaSyAOr4hsZVKnhWPM2i5Lt-O6Ybjbrbuf6Dc",
      authDomain: "lifelogs-55be4.firebaseapp.com",
      databaseURL: "https://lifelogs-55be4.firebaseio.com",
      projectId: "lifelogs-55be4",
      storageBucket: "lifelogs-55be4.appspot.com",
      messagingSenderId: "627005059943",
      appId: "1:627005059943:web:e8ee7ad2b1d427349c35c2",
      measurementId: "G-GEMXBTF0MX",
   };

   firebase.initializeApp(firebaseConfig);

   let isLoggedIn;
   user.subscribe((val) => {
      isLoggedIn = !!val;
   });
</script>

<Auth useRedirect="{true}" let:user let:loggedIn let:loginWithEmail let:logout>
   {#if !isLoggedIn}
      <Router routes="{routes.noAuth}" />
   {:else}
      <Router routes="{routes.authed}" />
   {/if}
</Auth>
