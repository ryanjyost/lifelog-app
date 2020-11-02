<script context="module">
   import { notification } from "../stores";

   export function showNotification({ msg, type }) {
      notification.set({ msg, type });

      setTimeout(() => {
         console.log("timeout");
         notification.set(null);
      }, 4001);
   }
</script>

<div class="snackbar {$notification ? 'show' : null} {$notification ? $notification.type : null}">
   {$notification ? $notification.msg : null}
</div>

<style>
   .snackbar {
      visibility: hidden; /* Hidden by default. Visible on click */
      width: 100%; /* Set a default minimum width */
      max-width: 500px;
      background-color: #333; /* Black background color */
      color: #fff; /* White text color */
      border-radius: 4px; /* Rounded borders */
      padding: 14px 16px;
      position: fixed; /* Sit on top of the screen */
      z-index: 11; /* Add a z-index if needed */
      left: 0px; /* Center the snackbar */
      bottom: 0px; /* 30px from the bottom */
      text-align: left;
      box-shadow: 0 2px 5px rgba(255, 255, 255, 0.06), 0 2px 5px rgba(255, 255, 255, 0.14);
      font-size: 1rem;
      line-height: 1.2;
      display: flex;
      align-items: center;
      margin: auto;
   }

   /* Show the snackbar when clicking on a button (class added with JavaScript) */
   .snackbar.show {
      visibility: visible; /* Show the snackbar */
      -webkit-animation: fadein 0.5s, fadeout 0.5s 4s;
      animation: fadein 0.5s, fadeout 0.5s 4s;
   }

   .snackbar.error {
      background-color: #e74343;
   }

   .snackbar.success {
      background-color: rgba(179, 66, 204, 0.9);
   }

   /* Animations to fade the snackbar in and out */
   @-webkit-keyframes fadein {
      from {
         bottom: 0;
         opacity: 0;
      }
      to {
         bottom: 0;
         opacity: 1;
      }
   }

   @keyframes fadein {
      from {
         bottom: 0;
         opacity: 0;
      }
      to {
         bottom: 0;
         opacity: 1;
      }
   }

   @-webkit-keyframes fadeout {
      from {
         bottom: 0;
         opacity: 1;
      }
      to {
         bottom: 0;
         opacity: 0;
      }
   }

   @keyframes fadeout {
      from {
         bottom: 0;
         opacity: 1;
      }
      to {
         bottom: 0;
         opacity: 0;
      }
   }
</style>
