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
   let formRef;
   let isLoading = false;
   let snackbar;
   let files = null;

   async function handleCreateLogEntry() {
      isLoading = true;

      try {
         let formData = new FormData();
         formData.append("user", $user.id);
         formData.append("text", newLogText);

         if (files && files.length) {
            formData.append("attachment", files[0]);
            formData.append("fileType", files[0].type);
         }

         await axios.post(`${API_URL}/logs`, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         showNotification({ msg: "Lifelog entry saved!", type: "success" });
         newLogText = "";
         files = null;
         window.localStorage.setItem("newLogEntry", "");
      } catch (e) {
         console.error(e);
         showNotification({ msg: "Something went wrong...", type: "error" });
      } finally {
         isLoading = false;
      }
   }

   function textAreaAdjust(e) {
      const element = e.srcElement;
      element.style.height = "1px";
      element.style.height = 25 + element.scrollHeight + "px";
   }

   function focusTextarea() {
      setTimeout(() => {
         ref.focus();
      }, 100);
   }

   function previewImage() {
      const reader = new FileReader();
      reader.onload = function () {
         const output = document.getElementById("preview");
         output.src = reader.result;
      };

      reader.readAsDataURL(files[0]);
   }

   function handleImageChange() {
      previewImage();
   }

   function handleDeleteAttachment() {
      files = null;
   }

   onMount(() => {
      focusTextarea();
   });

   onDestroy(() => {
      window.localStorage.setItem("newLogEntry", newLogText);
   });

   $: file = files && files[0];
   $: disableAction = !newLogText.length && !(files && files.length);
</script>

<AppShell>
   <!--   <form action="{`${API_URL}/logs`}" enctype="multipart/form-data" method="POST" name="fileinfo">-->
   <Header
      showBackButton="{true}"
      disableAction="{disableAction}"
      onAction="{handleCreateLogEntry}"
      isSubmit="{true}"
   />

   <div id="entryArea">
      <textarea
         name="logText"
         on:keyup="{textAreaAdjust}"
         disabled="{isLoading}"
         bind:value="{newLogText}"
         placeholder="{placeholders[Math.floor(Math.random() * placeholders.length)]}"
         bind:this="{ref}"
      ></textarea>

      {#if file}
         <div id="attachmentPreviewContainer">
            <img id="preview" />
            <button class="deleteAttachment" on:click="{handleDeleteAttachment}"><i
                  class="fas fa-trash-alt"
               ></i></button>
         </div>
      {/if}
   </div>

   <label for="take-photo" class="floatingCircleBtn"> <span><i class="fas fa-camera"></i></span> </label>
   <input
      type="file"
      id="take-photo"
      name="image"
      capture="user"
      accept="image/*"
      bind:files
      on:change="{handleImageChange}"
   />

   <label for="upload-photo"> <a><i class="fas fa-images"></i></a> </label>
   <input type="file" id="upload-photo" name="image" accept="image/*" bind:files on:change="{handleImageChange}" />
   <!--   </form>-->

   {#if isLoading}
      <Loading />
   {/if}
</AppShell>

<style>
   img {
      width: 90%;
      border-radius: 5px;
      border: 0px solid transparent;
   }

   textarea {
      width: 100%;
      background-color: transparent;
      caret-color: rgba(255, 255, 255, 0.9);
      font-size: 20px;
      border: none;
      resize: vertical;
      line-height: 1.3;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 0.03em;
      min-height: 100px;
      margin: 0px;
   }

   textarea:focus {
      border: none;
      outline: none;
   }

   label[for="take-photo"] {
      position: fixed;
      bottom: 20px;
      right: 20px;
   }

   label[for="upload-photo"] {
      position: fixed;
      bottom: 20px;
      left: 20px;
      font-size: 24px;
   }

   label span {
      font-size: 26px;
      margin-bottom: 2px;
   }

   #entryArea {
      /*background-color: rgba(255, 255, 255, 0.05);*/
      /*border-bottom: 1px solid rgba(255, 255, 255, 0.1);*/
      padding: 20px 20px 10px 20px;
   }

   #upload-photo {
      position: absolute !important;
      top: -9999px !important;
      left: -9999px !important;
      opacity: 0px;
   }

   #take-photo {
      position: absolute !important;
      top: -9999px !important;
      left: -9999px !important;
      opacity: 0px;
   }

   #attachmentPreviewContainer {
      width: 100%;
      max-width: 90%;
      display: flex;
      flex-direction: column;
      position: relative;
   }

   .deleteAttachment {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.7);
   }
</style>
