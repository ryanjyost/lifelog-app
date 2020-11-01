<!-- Auth.svelte -->
<script>
   import firebase from "firebase/app";
   import "firebase/auth";
   import axios from "axios";
   import qs from "query-string";
   import { user } from "../stores";

   const { API_URL } = __myapp.env;
   const query = qs.parse(window.location.search.replace("?", ""));
   const isMagicLink = !!query.magicLink;

   let firebaseUser;

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
      console.log("create user", data);
      const { data: newOrExistingUser } = await axios.post(`${API_URL}/users`, data);
      user.set(newOrExistingUser);
   }

   async function fetchUser(filter = {}) {
      const { data } = await axios.get(`${API_URL}/users`, { params: filter });

      if (!data.user) {
         await logout();
      }

      user.set(data.user);
   }

   // will be fired every time auth state changes
   auth.onAuthStateChanged(async (fireUser) => {
      if (fireUser) {
         const token = await fireUser.getIdTokenResult();
         const userInfo = userMapper(token.claims);

         firebaseUser = userInfo;
      } else {
         user.set(null);
      }
   });

   // reactive helper variable
   $: loggedIn = $user !== null;

   $: if ($user) {
   } else if (isMagicLink && firebaseUser) {
      createUser(firebaseUser);
   } else if (firebaseUser) {
      fetchUser({ firebase_id: firebaseUser.id });
   }
</script>

<!-- we will expose all required methods and properties on our slot -->
<main>
   <slot user="{$user}" loggedIn="{loggedIn}" logout="{logout}" />
</main>

<style>
   main {
      max-width: 500px;
      width: 100%;
      padding-bottom: 20px;
      /*height: 100%;*/
   }
</style>
