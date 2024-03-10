<script>
  import { writable } from 'svelte/store';
  import { base } from '$app/paths';

  const categoryImages = {
    "Barbie": ["ISFJ-Gloria.jpg", "ISFP-Allen.jpg", "ESFJ-Barbie.jpg", "ESFP-Ken.jpg"],
    "DC Comics": ["ENFJ-Wonder_woman.jpg", "ENFP-Harley_Quinn.jpg", "ENTP-The_Joker.jpg", "ESTP-Aquaman.jpg", "ESTP-Cat_Woman.jpg", "INFP-The_Flash.jpg", "INTJ-Batman.jpg", "ISFJ-Superman.jpg", "ISTJ-Cyborg.jpg"],
    "Harry Potter": ["ENTP-Fred_Weasley&George_Weasley.jpg", "ESFP-Ron_Weasley.jpg", "ESTJ-Hermione_Granger.jpg", "INFP-Luna_Lovegood.jpg", "ISFJ-Ginny_Weasley.jpg", "ISFP-Harry_Potter.jpg"],
    "The Avengers": ["ENFP-Spider_Man.jpg", "ENTP-Iron_Man.jpg", "ESTP-God_of_Thunder.jpg", "ESTP-Rocket_Raccoon.jpg", "INFJ-Vision.jpg", "INFP-Scarlet_Witch.jpg", "INTJ-Doctor_Strange.jpg", "ISFJ-Captain_America.jpg", "ISFJ-Groot.jpg", "ISFP-Hulk.jpg", "ISTP-Black_Widow.jpg"]
  };

  let selectedCategory = '';
  let quizStarted = false;
  let currentQuestionIndex = 0;
  let correctAnswers = writable(0);
  let currentChoices = [];
  let imagesForQuiz = [];
  let feedbackMessage = '';
  let showFeedback = false;
  let showResults = false;
  let resultsMessage = '';

  const allMBTITypes = ["INTJ", "ENTP", "INFP", "ENTJ", "ENFJ", "ISTJ", "ISFJ", "ESTP", "ESFP", "ENFP", "INTP", "ISTP", "ISFP", "ESTJ", "ESFJ", "INFJ"];

  function startQuiz() {
    imagesForQuiz = selectRandomImages(categoryImages[selectedCategory]);
    correctAnswers.set(0);
    quizStarted = true;
    currentQuestionIndex = 0;
    showResults = false;
    loadQuestion();
  }

  function loadQuestion() {
    let imageFileName = imagesForQuiz[currentQuestionIndex];
    let correctAnswer = imageFileName.split('-')[0];
    let incorrectAnswers = allMBTITypes.filter(mbti => mbti !== correctAnswer);
    let randomIncorrectAnswer = incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];
    currentChoices = shuffleArray([correctAnswer, randomIncorrectAnswer]);
    showFeedback = false;
    feedbackMessage = '';
  }

  function selectAnswer(answer) {
    const correctAnswer = imagesForQuiz[currentQuestionIndex].split('-')[0];
    if (answer === correctAnswer) {
      correctAnswers.update(n => n + 1);
      feedbackMessage = "Correct!";
    } else {
      feedbackMessage = `Incorrect. The correct answer is ${correctAnswer}.`;
    }
    showFeedback = true;

    if (currentQuestionIndex < imagesForQuiz.length - 1) {
      setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
      }, 2000);
    } else {
      setTimeout(() => {
        endQuiz();
      }, 2000);
    }
  }

  function endQuiz() {
    quizStarted = false;
    showResults = true;
    correctAnswers.subscribe(value => {
      if (value === 4) {
        resultsMessage = "Excellent, you are a master in MBTI!";
      } else if (value >= 2) {
        resultsMessage = "Great job, you know quite a bit!";
      } else {
        resultsMessage = "Looks like there's more to learn, try again!";
      }
      resultsMessage += ` You answered ${value} out of 4 correctly.`;
    });
  }

  function restartQuiz() {
    selectedCategory = '';
    quizStarted = false;
    showResults = false;
    currentQuestionIndex = 0;
    correctAnswers.set(0);
  }

  // Helper function to shuffle array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Helper function to select random images
  function selectRandomImages(images) {
    let result = [];
    let tempArray = [...images];
    while (result.length < 4) {
      let index = Math.floor(Math.random() * tempArray.length);
      result.push(tempArray.splice(index, 1)[0]);
    }
    return result;
  }
</script>

<style>
  .centered-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .quiz-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .categories-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }

  .choices-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }

  .quiz-image {
    max-width: 50%;
    height: auto;
    border-radius: 10px;
  }

  button {
    padding: 10px 20px;
    cursor: pointer;
  }

  h2 {
    width: 100%; /* Ensure the title spans the full width */
    text-align: center; /* Center the title */
  }
</style>


{#if !quizStarted && !showResults}
  <div class="centered-container">
    <h2>Select a Quiz Category</h2>
    <div class="categories-container">
      {#each Object.keys(categoryImages) as category (category)}
        <button on:click={() => { selectedCategory = category; startQuiz(); }}>
          {category}
        </button>
      {/each}
    </div>
  </div>
{:else if quizStarted}
  <div class="centered-container">
    <div class="quiz-container">
      <img class="quiz-image" src={`${base}/mbti_images/quiz_data/${selectedCategory}/${imagesForQuiz[currentQuestionIndex]}`} alt="Character image">
      <div class="choices-container">
        {#each currentChoices as choice}
          <button on:click={() => selectAnswer(choice)}>{choice}</button>
        {/each}
      </div>
      {#if showFeedback}
        <p>{feedbackMessage}</p>
      {/if}
    </div>
  </div>
{:else if showResults}
  <div class="centered-container">
    <p>{resultsMessage}</p>
    <button on:click={restartQuiz}>Give another shot and see what other cool characters we have</button>
  </div>
{/if}