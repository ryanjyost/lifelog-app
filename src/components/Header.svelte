<script>
   export let title = null;
   export let showBackButton = false;
   export let onAction;
   export let actionText = "Save";
   export let disableAction = false;
</script>

<header>
   {#if showBackButton}<a id="backButton" href="/#/logs">&larr;</a>{/if}

   {#if title}
      <h4>{title}</h4>
   {/if}

   {#if onAction}<button id="actionButton" disabled="{disableAction}" on:click="{onAction}">{actionText}</button>{/if}

   <slot />
</header>

<style>
   header {
      height: 50px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      position: sticky;
      top: 0;
      background-color: rgba(21, 32, 43, 1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      /*padding: 0px 10px;*/
      font-size: 16px;
      padding: 0px 20px;
      -webkit-box-shadow: 0 3px 2px -2px rgba(255, 255, 255, 0.2);
      -moz-box-shadow: 0 3px 2px -2px rgba(255, 255, 255, 0.2);
      box-shadow: 0 3px 2px -2px rgba(255, 255, 255, 0.2);
      z-index: 10;
   }

   header h4 {
      letter-spacing: 0.02em;
      color: #fff;
      font-weight: 900;
      font-size: 18px;
   }

   #backButton {
      opacity: 0.8;
      font-weight: 900;
      font-size: 1.5rem;
   }

   .section {
   }

   #actionButton {
      margin: 0px;
      border-radius: 20px;
      width: 90px;
      background-color: rgba(179, 66, 204, 0.9);
      border: 0px solid rgba(179, 66, 204, 0.9);
      color: #fff;
      font-weight: bold;
      cursor: pointer;
   }

   #actionButton:disabled {
      background-color: rgba(179, 66, 204, 0.5);
      border: 0px solid rgba(179, 66, 204, 0.5);
      color: rgba(255, 255, 255, 0.5);
      cursor: default;
   }
</style>
