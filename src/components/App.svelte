<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
</script>

<nav>
  <a href="#" on:click|preventDefault={() => goto(`${base}/home`)}>Introduction to MBTI</a>
  <a href="#" on:click|preventDefault={() => goto(`${base}/16picture`)}>MBTI Types</a>
  <a href="#" on:click|preventDefault={() => goto(`${base}/vis`)}>Country Distribution</a>
  <a href="#" on:click|preventDefault={() => goto(`${base}/quiz`)}>Fun Quiz</a>
</nav>

<main>
    <h1 style="text-align: center;">What is MBTI Test?</h1>
    <p style="text-align: center;">The full name of MBTI is Myers-Briggs Type Indicator,
        which is the world's most popular personality tools.
        it have more than 70 years of science-based and 
        research-based insight which assessment is a robust 
        tool for self-awareness and improvement. It help people to 
        commuicate, learn and work.
    </p>
    <p style="text-align: center;">
        The test result have total 8 element which have four pairs of 
        opposit meaning element. Extraversion (E) - Introversion (I),
        Sensing (S) - Intuition (N), Thinking (T) - Feeling (F), 
        Judging (J) - Perceiving (P).
    </p>
    <p style="text-align: center;">
        Are you curious about what type of mbti you are?
    </p>

    <div style="display: flex; justify-content: center; margin-top: 20px;">
        <a href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noopener noreferrer">
            <button>Test</button>
          </a>
            <button on:click={() => goto(`${base}/16picture`)}>Learn more</button>   
    </div>

    <p style="position: absolute; top: 730px; right: 20px;">
      Research Source: <a href="https://www.jstor.org/stable/26554264" target="_blank">Validity and Reliability of the Myers-Briggs Personality Type Indicator</a>
    </p>
    <p style="position: absolute; top: 700px; right: 20px;">
      Data Source: <a href="https://www.kaggle.com/datasets/yamaerenay/mbtitypes-full" target="_blank">MBTI-TYPES Data</a>
    </p>
</main>