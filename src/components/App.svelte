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

  $: showDeepDiveButton = currentSection === 3; // Button shows only on the fourth page
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
.scroll-hint {
  position: absolute;
  bottom: 20px; /* Position at the bottom of the section */
  left: 50%;
  transform: translateX(-50%); /* Center horizontally */
  font-size: 24px; /* Adjust size as needed */
  color: white; /* Adjust color as needed */
  animation: bounce 2s infinite; /* Add a bounce animation for visibility */
  cursor: pointer; /* Indicates it's interactive or a hint */
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-20px);
  }
  60% {
    transform: translateX(-50%) translateY(-10px);
  }
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

button, .button {
  padding: 15px 30px; /* Larger buttons */
  font-size: 1.2rem; /* Larger font size for button text */
  border-radius: 8px; /* Adjusted border-radius for aesthetics */
}

/* Additional styles remain unchanged */


/* Gradient Backgrounds */
section:nth-child(1) { background: linear-gradient(135deg, #fda085 0%, #f6d365 100%); }
section:nth-child(2) { background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%); }
section:nth-child(3) { background: linear-gradient(135deg, #b490ca 0%, #5ee7df 100%); }
section:nth-child(4) { background: linear-gradient(135deg, #9D50BB 0%, #6E48AA 100%); }

.image-container img {
  width: 70%; /* Adjust based on your preference */
  height: auto;
  border-radius: 10px;
  max-width: 800px; /* Prevent the image from becoming too wide */
}

.button-container, footer {
  display: flex;
  justify-content: right;
  gap: 20px;
  padding: 20px;
  scroll-snap-align: start;
}

.deep-dive-button {
  position: fixed; /* Fixed relative to the viewport */
  bottom: 20px;
  right: 20px;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 8px;
  background-color: #007bff; /* Or use rgba(11, 10, 10, 0.178) for black as per your request */
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 10; /* Ensure it's above other content */
}

button:hover, .button:hover {
  background-color: #0056b3;
}
/* Specific styling for the fourth page's text-container */
section:nth-child(4) .text-container {
  color: #E8E8E8; /* Lighter text color for readability against the dark background */
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent black background for the text */
  padding: 20px; /* Padding around the text */
  border-radius: 15px; /* Rounded corners for the container */
  margin: 20px; /* Ensures some spacing around the text container */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  font-size: 1.1rem; /* Slightly larger font size */
  line-height: 1.6; /* Improved line height for better readability */
  max-width: 800px; /* Optimal reading width */
  text-align: justify; /* Justified text for a cleaner look */
}

/* Enhance the first paragraph to draw attention */
section:nth-child(4) .text-container p:first-child {
  font-weight: bold;
  color: #FFD700; /* Gold color for emphasis */
  font-size: 1.2rem; /* Slightly larger than the rest */
}

/* Optional: Add a subtle animation to the text container for engagement */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

section:nth-child(4) .text-container {
  animation: fadeIn 1.5s ease-out;
}


</style>

<div class="scroller-container">
  <section>
    <div class="text-container">Do you know Arnold Schwarzenegger is an 'architect'?</div>
    <div class="image-container">
      <img src="{base}/mbti_images/first_page_data/arnold.webp" alt="Arnold Schwarzenegger">
    </div>
    <div class="scroll-hint">↓ Scroll down to continue</div>
  </section>
  <section>
    <div class="text-container">Do you know Madonna is an 'entrepreneur'?</div>
    <div class="image-container">
      <img src="{base}/mbti_images/first_page_data/madonna.webp" alt="Madonna">
    </div>
    <div class="scroll-hint">↓ Scroll down to continue</div>
  </section>
  <section>
    <div class="text-container">Do you know Beyonce is a 'defender'?</div>
    <div class="image-container">
      <img src="{base}/mbti_images/first_page_data/beyonce.webp" alt="Beyonce">
    </div>
    <div class="scroll-hint">↓ Scroll down to continue</div>
  </section>
  <section>
    <div class="text-container">
      <p>Ever wondered why we see the world so differently? It's not just random; there's a method to the madness called the MBTI.</p>
      <p>MBTI, or Myers-Briggs Type Indicator, isn't about boxing us into categories. It's a lens to celebrate our unique flavors of personality. From 'Explorers' craving adventure to 'Diplomats' weaving creativity, MBTI reveals our strengths and growth paths.</p>
      <p>Ready to uncover what makes you uniquely you? Let's dive into this journey of self-discovery and embrace our diverse personalities!</p>
    </div>
    <div class="image-container">
      <img src="{base}/mbti_images/first_page_data/mbti_intro.webp" alt="MBTI Introduction">
    </div>
  </section>
  {#if showDeepDiveButton}
    <button class="deep-dive-button" on:click={() => goto(`${base}/16picture`)}>Take a deep dive into the MBTI world</button>
  {/if}

  <!-- Button Container -->
  <div class="button-container">
    <button on:click={() => goto(`${base}/16picture`)}>Take a deep dive into the MBTI world!</button>
  </div>
</div>
