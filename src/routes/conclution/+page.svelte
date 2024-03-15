<script>
    import { onMount, onDestroy } from 'svelte';
    import { base } from '$app/paths';
    onMount(() => {
    document.body.style.backgroundImage = `url(${base}/page2/bg.jpg)`;
  });
</script>

<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh; /* Set height to 100% of viewport height */
        justify-content: center;
    }

    h1 {
        font-size: 24px;
        margin-bottom: 10px;
        font-family: 'Comic Sans MS', cursive;
    }

    p {
        font-size: 16px;
        line-height: 1.5;
        font-family: 'Comic Sans MS', cursive;
        max-width: 800px; /* Set your desired max-width value */
    }
</style>

<div>
    <img src="{base}/page3/thanks.webp" alt="Capybara" style="width: 200px; height: auto">
    <p>The overarching lesson from our visualization is the profound impact of personality diversity on various aspects of life, from music preferences to global distribution. </p>
    <p>Our visualization succeeds at explaining it by providing comprehensive insights into MBTI personality types, their associated characteristics, and how they manifest in real-world scenarios. Through interactive elements such as music samples, bar charts, and an interactive world map, viewers are not only informed but also engaged, fostering a deeper connection to the material. By exploring the intersection of personality traits and their manifestations in different contexts, viewers gain a deeper understanding of the richness and complexity of human nature.  </p>
    <p>Ultimately, the visualization encourages viewers to embrace and celebrate the diversity of personalities, recognizing the unique strengths and perspectives that each individual brings to the table. </p>
    <h1>Contributor:</h1>
    <p>Steven Jiang: INTP </p>
    <p>Haoyang Yu: ISTJ</p>
    <p>Jessie Zhang: ESFJ</p>
    
</div>