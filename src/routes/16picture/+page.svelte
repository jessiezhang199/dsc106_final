<script>
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
</script>

<nav>
  <a href="/home">Introduction to MBTI</a >
  <a href="/16picture">MBTI Types</a >
  <a href="/vis">Country Distribution</a >
  <a href="/quiz">Fun Quiz</a >
 </nav>

<div style="display: flex; justify-content: center; margin-top: 20px;">
    
    <button on:click={() => goto(`${base}/vis`)}>Learn more</button>
    
</div>