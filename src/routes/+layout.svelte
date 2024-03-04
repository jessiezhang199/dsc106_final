<script>
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
  </script>
  
  <nav>
    <a href="/" on:click|preventDefault={() => goto(`${base}/`)}>Home</a>
    <a href="/" on:click|preventDefault={() => goto(`${base}/16picture`)}>MBTI Types</a>
    <a href="/" on:click|preventDefault={() => goto(`${base}/vis`)}>Country Distribution</a>
    <a href="/" on:click|preventDefault={() => goto(`${base}/quiz`)}>Fun Quiz</a>
  </nav>
  
  <slot />