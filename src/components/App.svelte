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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}

.scroller-container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
}

section {
  height: 100vh;
  display: flex;
  flex-direction: row; /* Ensure the text and image are side by side */
  align-items: center;
  justify-content: center; /* Center content horizontally */
  text-align: center;
  scroll-snap-align: start;
  color: white;
  font-weight: 600;
  padding: 0 5%; /* Add some padding to ensure content doesn't touch the edges */
}

.text-container {
  flex: 1; /* Allows the container to grow */
  max-width: 600px; /* Adjust this to control the text width */
  font-size: 2rem; /* Increase font size for larger text */
}

.image-container img {
  width: auto; /* Adjust based on image aspect ratio */
  height: 100vh; /* Makes images larger, adjust as needed */
  max-width: 800px; /* Prevent the image from becoming too wide */
  border-radius: 10px;
}

.button-container, footer {
  text-align: center;
  padding: 20px;
  scroll-snap-align: start;
}

button, .button {
  padding: 15px 30px; /* Larger buttons */
  font-size: 1.2rem; /* Larger font size for button text */
  border-radius: 8px; /* Adjusted border-radius for aesthetics */
}

/* Additional styles remain unchanged */


/* Gradient Backgrounds */
section:nth-child(1) { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
section:nth-child(2) { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
section:nth-child(3) { background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%); }

.image-container img {
  width: 40%; /* Adjust based on your preference */
  height: auto;
  border-radius: 10px;
}

.button-container, footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  scroll-snap-align: start;
}

button, .button {
  padding: 12px 24px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button:hover, .button:hover {
  background-color: #0056b3;
}

footer {
  padding: 1em;
  text-align: center;
  scroll-snap-align: start;
  color: #fff; /* Adjust based on footer background */
}
</style>

<div class="scroller-container">
  <section>
    <div class="text-container">Do you know Arnold Schwarzenegger is an 'architect'?</div>
    <div class="image-container">
      <img src="{base}/mbti_images/first_page_data/arnold.webp" alt="Arnold Schwarzenegger">
    </div>
  </section>
  <section>
    <div class="text-container">Do you know Madonna is an 'entrepreneur'?</div>
    <div class="image-container">
      <img src="{base}/mbti_images/first_page_data/madonna.webp" alt="Madonna">
    </div>
  </section>
  <section>
    <div class="text-container">Do you know Beyonce is a 'defender'?</div>
    <div class="image-container">
      <img src="{base}/mbti_images/first_page_data/beyonce.webp" alt="Beyonce">
    </div>
  </section>

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
