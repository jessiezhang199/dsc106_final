<script>
  import { navigate } from "svelte-routing";
</script>
<main>
    <h1 style="text-align: center;">About MBTI Test</h1>
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
        <button on:click={() => navigate("/learn-more")}>Learn More</button>
      </div>
    <p>source 1: https://www.themyersbriggs.com/en-US/Products-and-Services/Myers-Briggs
    </p>
    <p>source 2: https://www.verywellmind.com/the-myers-briggs-type-indicator-2795583 
    </p>
   
</main>