<!-- Auth.svelte -->
<script>
   import firebase from "firebase/app";
   import "firebase/auth";
   import axios from "axios";
   import qs from "query-string";
   import { onMount } from "svelte";
   import { push } from "svelte-spa-router";
   import Loading from "./Loading.svelte";
   import Notification, { showNotification } from "./Notification.svelte";
   import { user, notification } from "../stores";

   const { API_URL, CLIENT_URL } = __myapp.env;
   const query = qs.parse(window.location.search.replace("?", ""));
   const isMagicLink = !!query.magicLink;

   let firebaseUser;
   let attemptedAuth;

   export let useRedirect = false;

   const auth = firebase.auth();
   const userMapper = (claims) => ({
      id: claims.user_id,
      name: claims.name,
      email: claims.email,
      picture: claims.picture,
   });

   export const logout = () => auth.signOut();

   async function createUser(data) {
      const { data: newOrExistingUser } = await axios.post(`${API_URL}/users`, data);
      user.set(newOrExistingUser);
      attemptedAuth = true;
   }

   async function handleMagicLink() {
      console.log("handle magic lingk");
      let emailForLogin = window.localStorage.getItem("email");
      const { continueUrl } = query;
      console.log({ continueUrl }, window.location.origin);

      if (window.location.origin !== continueUrl) {
         console.log(`Redirecting to ${continueUrl}`);
         window.location.href = `${continueUrl}${window.location.search}`;
      } else {
         if (!emailForLogin) {
            emailForLogin = window.prompt("Please confirm your email.");
         }

         try {
            await auth.signInWithEmailLink(emailForLogin, window.location.href);
         } catch (e) {
            showNotification({ type: "error", msg: "Error signing in. Please try again." });
         }

         emailForLogin = null;
      }
   }

   async function fetchUser(filter = {}) {
      const { data } = await axios.get(`${API_URL}/users`, { params: filter });

      if (!data.user) {
         await logout();
      }

      user.set(data.user);
      attemptedAuth = true;
   }

   // will be fired every time auth state changes
   auth.onAuthStateChanged(async (fireUser) => {
      if (fireUser) {
         const token = await fireUser.getIdTokenResult();
         firebaseUser = userMapper(token.claims);
      } else {
         user.set(null);
      }
   });

   onMount(async () => {
      if (!!query.magicLink) {
         if (!auth.isSignInWithEmailLink(window.location.href)) {
            showNotification({ type: "error", msg: "Error signing in. Please try again." });
            window.location.href = CLIENT_URL;
            return;
         }

         await handleMagicLink();
      }
   });

   // reactive helper variable
   $: loggedIn = $user !== null;
   // $: console.log("User", $user);

   $: if (isMagicLink && firebaseUser) {
      createUser(firebaseUser);
   } else if (firebaseUser) {
      fetchUser({ firebase_id: firebaseUser.id });
   } else {
      attemptedAuth = true;
   }
</script>

<!-- we will expose all required methods and properties on our slot -->
<main>
   {#if !attemptedAuth}
      <Loading />
   {:else}
      <slot user="{$user}" loggedIn="{loggedIn}" logout="{logout}" />
   {/if}
   <Notification />
</main>

<style>
   main {
      max-width: 500px;
      width: 100%;
      min-height: 100vh;
   }
</style>
