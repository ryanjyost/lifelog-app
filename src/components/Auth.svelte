<!-- Auth.svelte -->
<script>
   import firebase from "firebase/app";
   import "firebase/auth";
   import { user } from "../stores";

   let currentUser;

   export let useRedirect = false;

   const auth = firebase.auth();
   const userMapper = (claims) => ({
      id: claims.user_id,
      name: claims.name,
      email: claims.email,
      picture: claims.picture,
   });

   user.subscribe((val) => {
      currentUser = val;
   });

   export const loginWithEmail = (email, actionCodeSettings) => {
      return auth.sendSignInLinkToEmail(email, actionCodeSettings);
   };

   export const logout = () => auth.signOut();

   // will be fired every time auth state changes
   auth.onAuthStateChanged(async (fireUser) => {
      if (fireUser) {
         console.log({ fireUser });
         // in here you might want to do some further actions
         // such as loading more data, etc.

         // if you want to set custom claims such as roles on a user
         // this is how to get them because they will be present
         // on the token.claims object
         const token = await fireUser.getIdTokenResult();
         user.set(userMapper(token.claims));
      } else {
         user.set(null);
      }
   });

   // reactive helper variable
   $: loggedIn = currentUser !== null;
   $: console.log({ currentUser });
</script>

<!-- we will expose all required methods and properties on our slot -->
<main>
   <slot user="{user}" loggedIn="{loggedIn}" loginWithEmail="{loginWithEmail}" logout="{logout}" />
</main>

<style>
   main {
      max-width: 500px;
      width: 100%;
      padding-bottom: 20px;
      /*height: 100%;*/
   }
</style>
