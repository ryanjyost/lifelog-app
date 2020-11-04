<script>
   import axios from "axios";
   import { onDestroy } from "svelte";
   import { push } from "svelte-spa-router";
   import Header from "./Header.svelte";
   import AppShell from "./AppShell.svelte";
   import { showNotification } from "./Notification.svelte";
   import { user } from "../stores";

   const { TWILIO_PHONE, API_URL } = __myapp.env;
   let codeInputs = [0, 1, 2, 3, 4, 5];

   let areaCode = window.localStorage.areaCode || "";
   let firstThree = window.localStorage.firstThree || "";
   let lastFour = window.localStorage.lastFour || "";
   let codeSent = false;
   let code0 = "";
   let code1 = "";
   let code2 = "";
   let code3 = "";
   let code4 = "";
   let code5 = "";
   let isLoading;

   async function handleSubmit() {
      isLoading = true;
      try {
         const { data } = await axios.post(`${API_URL}/verify`, {
            user: $user.id,
            phone: `+1${areaCode}${firstThree}${lastFour}`,
         });

         codeSent = true;
      } catch (e) {
         showNotification({ type: "error", msg: "Error trying to send verification code." });
      } finally {
         isLoading = false;
      }
   }

   async function handleCodeSubmit() {
      isLoading = true;
      try {
         console.log("CODE", code0 + code1 + code2 + code3 + code4 + code5);
         const { data } = await axios.post(`${API_URL}/confirm`, {
            user: $user.id,
            phone: `+1${areaCode}${firstThree}${lastFour}`,
            code: code0 + code1 + code2 + code3 + code4 + code5,
         });

         console.log({ data });

         if (data.status) {
            const updatedUser = await axios.get(`${API_URL}/users`, { params: { id: $user.id } });
            showNotification({ type: "success", msg: "Phone verified!" });
            user.set(updatedUser);
         }
      } catch (e) {
         showNotification({ type: "error", msg: "Error confirming verification code." });
      } finally {
         codeSent = false;
         isLoading = false;
      }
   }

   const handleCodeChange = (e) => {
      let next = e.srcElement || e.target;
      while ((next = next.nextElementSibling)) {
         if (next == null || !e.target.value) break;

         if (next.tagName.toLowerCase() === "input" && next) {
            next.focus();
            break;
         }
      }
   };

   onDestroy(() => {
      window.localStorage.setItem("areaCode", areaCode || "");
      window.localStorage.setItem("firstThree", firstThree || "");
      window.localStorage.setItem("lastFour", lastFour || "");
   });

   $: phoneText = areaCode + firstThree + lastFour;
   $: fullCode = code0 + code1 + code2 + code3 + code4 + code5;
   $: actionText = $user.phone ? "Update" : "Confirm";
   $: disableAction = !$user.phone
      ? phoneText.length !== 10
      : phoneText.length !== 10 || $user.phone === `+1${phoneText}`;
</script>

<AppShell>
   <Header
      showBackButton="{true}"
      disableAction="{disableAction}"
      onAction="{!codeSent && handleSubmit}"
      actionText="{actionText}"
   />
   {#if isLoading}

   {:else if codeSent}
      <h4>Check your text messages for the verification code.</h4>
      <h4>Enter the verification code below.</h4>
      <div class="phoneContainer">
         <input class="phoneInput-1" bind:value="{code0}" placeholder="0" on:input="{handleCodeChange}" maxLength="1" />
         <input class="phoneInput-1" bind:value="{code1}" placeholder="0" on:input="{handleCodeChange}" maxLength="1" />
         <input class="phoneInput-1" bind:value="{code2}" placeholder="0" on:input="{handleCodeChange}" maxLength="1" />
         <input class="phoneInput-1" bind:value="{code3}" placeholder="0" on:input="{handleCodeChange}" maxLength="1" />
         <input class="phoneInput-1" bind:value="{code4}" placeholder="0" on:input="{handleCodeChange}" maxLength="1" />
         <input class="phoneInput-1" bind:value="{code5}" placeholder="0" on:input="{handleCodeChange}" maxLength="1" />
      </div>
      <button id="verifyCTA" disabled="{fullCode.length !== 6}" on:click="{handleCodeSubmit}">Verify my number</button>
   {:else}
      {#if !$user.phone}
         <h4>Enter your phone number</h4>
      {:else}
         <h4>Your phone is linked!</h4>
      {/if}

      <div class="phoneContainer">
         +1
         <input id="areaCode" class="phoneInput-3" bind:value="{areaCode}" placeholder="123" maxLength="3" />
         -
         <input id="firstThree" class="phoneInput-3" bind:value="{firstThree}" placeholder="456" maxLength="3" />
         -
         <input id="lastFour" class="phoneInput-4" bind:value="{lastFour}" placeholder="7890" maxLength="4" />
      </div>

      {#if !$user.phone}
         <p>
            Once you confirm your phone number, anything you text to
            <strong>{TWILIO_PHONE}</strong>
            will be saved as a lifelog entry.
         </p>
      {:else}
         <p>Anything you text to <strong>{TWILIO_PHONE}</strong> will be saved as a lifelog entry.</p>
      {/if}
   {/if}
</AppShell>

<style>
   p {
      color: rgba(255, 255, 255, 0.8);
      padding: 10px 20px;
      text-align: center;
   }
   h4 {
      text-align: center;
      color: rgba(255, 255, 255, 0.9);
      margin-top: 30px;
      padding: 10px 20px;
   }

   .phoneContainer {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: center;
      margin-top: 20px;
      font-size: 20px;
      color: #fff;
   }

   input {
      outline: none;
      border: 1px solid rgba(255, 255, 255, 0.04);
      margin: 0px 5px;
      color: rgba(255, 255, 255, 1);
      padding: 8px 12px;
      background-color: rgba(255, 255, 255, 0.04);
      text-align: center;
   }

   input:focus {
      border: 1px solid rgba(179, 66, 204, 0.5);
   }

   .phoneInput-1 {
      width: 2.5rem;
   }

   .phoneInput-3 {
      width: 4rem;
   }

   .phoneInput-4 {
      width: 5rem;
   }

   #verifyCTA {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 40px auto;
      padding: 10px 40px;
      border-radius: 20px;
      background-color: rgba(179, 66, 204, 1);
      border: 0px solid rgba(179, 66, 204, 1);
      box-shadow: 0 2px 5px rgba(255, 255, 255, 0.06), 0 2px 5px rgba(255, 255, 255, 0.14);
      color: #fff;
      cursor: pointer;
   }
</style>
