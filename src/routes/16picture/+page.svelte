<script>
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
  </script>
<div style="display: flex; justify-content: center; margin-top: 20px;">
    
    <button on:click={() => goto(`${base}/vis`)}>Learn more</button>
    
  </div>