<script>
   import firebase from "firebase/app";
   import "firebase/auth";
   import qs from "query-string";
   import { push } from "svelte-spa-router";
   import { fade } from "svelte/transition";
   import Loading from "./Loading.svelte";

   let isSendingEmailLink;
   let emailLinkSent = false;
   let emailForLogin = window.localStorage.getItem("email");
   let emailInput = "";

   const params = qs.parse(window.location.search);
   const auth = firebase.auth();
   const { CLIENT_URL } = __myapp.env;
   const actionCodeSettings = {
      url: `${CLIENT_URL}`,
      handleCodeInApp: true,
   };

   const loginWithEmail = async (email, actionCodeSettings) => {
      await auth.sendSignInLinkToEmail(email, actionCodeSettings);
   };

   async function handleSubmit(event) {
      isSendingEmailLink = true;

      const { email: emailInput } = event.target.elements;
      await loginWithEmail(emailInput.value, actionCodeSettings);

      window.localStorage.setItem("email", emailInput.value);
      emailForLogin = emailInput.value;
      emailLinkSent = true;
      isSendingEmailLink = false;
   }

   $: disableLogin = !emailInput.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
</script>

<div in:fade="{{ duration: 500 }}">
   {#if emailLinkSent}
      <div id="emailLinkSentContainer" class="fullCentered">
         <h3>Magic link sent!</h3>
         <p>Check your <strong>{emailForLogin}</strong> inbox for the verification email.</p>
      </div>
   {:else if isSendingEmailLink}
      <Loading>Sending magic link...</Loading>
   {:else}
      <div>
         <form on:submit|preventDefault="{handleSubmit}" class="fullCentered">
            <h2>My Private Lifelog</h2>
            <h4>Keep a personal record <br />of anything you want</h4>

            <div class="formInput">
               <label for="email">Email</label>
               <input
                  class="input-field"
                  id="email"
                  type="email"
                  placeholder="jsnow@winterfell.gov"
                  bind:value="{emailInput}"
               />
            </div>

            <button disabled="{disableLogin}" type="submit">Start logging my life</button>
         </form>
      </div>
   {/if}
</div>

<style>
   h2 {
      color: #fff;
      margin-bottom: 0px;
   }

   h4 {
      margin-top: 5px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
   }

   button {
      width: 300px;
      height: 50px;
      border-radius: 30px;
      cursor: pointer;
      background-color: rgba(179, 66, 204, 1);
      border: 0px solid #fff;
      color: #fff;
   }

   button:disabled {
      opacity: 0.5;
      cursor: default;
   }

   .fullCentered {
      display: flex;
      flex-direction: column;
      align-items: center;
      /*justify-content: center;*/
      height: 100vh;
      text-align: center;
   }

   label {
      font-size: 14px;
      text-align: left;
      padding: 0px 10px;
      width: 100%;
   }

   input {
      width: 100%;
      margin-bottom: 0px;
      background-color: transparent;
      border: none;
      outline: none;
      padding: 10px 10px;
      color: #fff;
   }

   form {
      padding: 100px 30px 50px 30px;
   }

   .formInput {
      background-color: rgba(255, 255, 255, 0.04);
      width: 300px;
      padding-top: 3px;
      margin: 20px 0px;
      border-radius: 3px;
      border-bottom: 3px solid rgba(179, 66, 204, 0.5);
      color: rgba(255, 255, 255, 0.6);
   }

   .formInput:focus-within {
      border-bottom: 3px solid rgba(179, 66, 204, 1);
      color: rgba(255, 255, 255, 0.8);
   }

   #emailLinkSentContainer {
      color: #fff;
      text-align: center;
      justify-content: center;
      padding: 0px 30px 0px 30px;
   }

   #emailLinkSentContainer.h3 {
      margin: 10px 0px;
      color: #fff;
   }

   #emailLinkSentContainer.p {
   }
</style>
