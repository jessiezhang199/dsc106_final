<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  let currentSection = 0;

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function handleScroll() {
    const sectionHeight = window.innerHeight;
    currentSection = Math.round(window.scrollY / sectionHeight);
  }
</script>

<style>
  .scroller-container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
  }

  section {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    scroll-snap-align: start;
  }

  .button-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 20px;
    scroll-snap-align: start;
  }

  button, .button {
    padding: 10px 20px;
    cursor: pointer;
    text-decoration: none;
    background-color: #007bff;
    color: white;
    border: none;
    font-size: 16px;
  }

  button:hover, .button:hover {
    background-color: #0056b3;
  }

  footer {
    padding: 1em;
    text-align: center;
    scroll-snap-align: start;
  }
</style>

<div class="scroller-container">
  <section style="background-color: lightcoral;">Do you know Arnold Schwarzenegger is an 'architect'?</section>
  <section style="background-color: lightblue;">Do you know Madonna is an 'entrepreneur'?</section>
  <section style="background-color: lightgreen;">Do you know Anne Hathaway is a 'defender'?</section>
  
  <!-- Button Container -->
  <div class="button-container">
    <a href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noopener noreferrer" class="button">Take the Test</a>
    <button on:click={() => goto(`${base}/16picture`)}>Learn More</button>
  </div>

  <!-- Footer -->
  <footer>
    <p>Research Source: <a href="https://www.jstor.org/stable/26554264" target="_blank">Validity and Reliability of the Myers-Briggs Personality Type Indicator</a></p>
    <p>Data Source: <a href="https://www.kaggle.com/datasets/yamaerenay/mbtitypes-full" target="_blank">MBTI-TYPES Data</a></p>
  </footer>
</div>
