<header>
   <slot>
      <h4>My Private Lifelog</h4>
   </slot>
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
</style>
