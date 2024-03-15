<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
</script>

<style>
  nav {
    background-color: #f0f4f8;
    padding: 10px 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  a {
    text-decoration: none;
    color: #333;
    margin: 0 15px;
    font-size: 18px;
    transition: color 0.3s;
  }
  a:hover {
    color: #007bff;
  }
  .active {
    color: #007bff;
    font-weight: bold;
  }
</style>

<nav>
  <a href="/" on:click|preventDefault={() => goto(`${base}/`)}>Home</a>
  <a href="/" on:click|preventDefault={() => goto(`${base}/16picture`)}>16 Personalities-16 Styles</a>
  <a href="/" on:click|preventDefault={() => goto(`${base}/vis`)}>MBTI across the World</a>
  <a href="/" on:click|preventDefault={() => goto(`${base}/quiz`)}>Fun Quiz</a>
  <a href="/" on:click|preventDefault={() => goto(`${base}/conclution`)}>Credits</a>
</nav>

<slot />
