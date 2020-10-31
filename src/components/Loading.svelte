<div id="loader_container">
   <div class="loader"></div>
   <br />
   <p>
      <slot />
   </p>
</div>

<style>
   p {
      color: rgba(255, 255, 255, 0.9);
      z-index: 10;
      font-size: 1.2rem;
   }

   #loader_container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100vh;
      position: fixed;
      pointer-events: none !important;
      top: 0;
      left: 0;
      z-index: 9;
      background-color: rgba(21, 32, 43, 0.9);
      -webkit-user-select: none; /* Chrome all / Safari all */
      -moz-user-select: none; /* Firefox all */
      -ms-user-select: none; /* IE 10+ */
      user-select: none; /* Likely future */
   }

   .loader {
      border: 16px solid rgba(179, 66, 204, 0.2);
      border-top: 16px solid rgba(179, 66, 204, 1);
      border-radius: 50%;
      width: 80px;
      height: 80px;
      animation: spin 1s ease infinite;
   }

   @keyframes spin {
      0% {
         transform: rotate(0deg);
      }
      100% {
         transform: rotate(360deg);
      }
   }
</style>
