<footer>
  <p>Data source: <a href="https://www.16personalities.com/personality-types" target="_blank">https://www.16personalities.com/personality-types</a></p>
</footer>

<script>
  import { writable } from 'svelte/store';
  import { base } from '$app/paths';
  import { fade } from 'svelte/transition';

  const categoryImages = {
    "Barbie": ["ISFJ-Gloria.jpg", "ISFP-Allen.jpg", "ESFJ-Barbie.jpg", "ESFP-Ken.jpg"],
    "DC Comics": ["ENFJ-Wonder_Woman.jpg", "ENFP-Harley_Quinn.jpg", "ENTP-The_Joker.jpg", "ESTP-Aquaman.jpg", "ESTP-Cat_Woman.jpg", "INFP-The_Flash.jpg", "INTJ-Batman.jpg", "ISFJ-Superman.jpg", "ISTJ-Cyborg.jpg"],
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
  let feedbackImage = '';
  let characterName = '';


  const allMBTITypes = ["INTJ", "ENTP", "INFP", "ENTJ", "ENFJ", "ISTJ", "ISFJ", "ESTP", "ESFP", "ENFP", "INTP", "ISTP", "ISFP", "ESTJ", "ESFJ", "INFJ"];
  const imageToCharacterMap = {
  "ISFJ-Gloria.jpg": "Gloria",
  "ISFP-Allen.jpg": "Allen",
  "ESFJ-Barbie.jpg": "Barbie",
  "ESFP-Ken.jpg": "Ken",
  "ENFJ-Wonder_Woman.jpg": "Wonder Woman",
  "ENFP-Harley_Quinn.jpg": "Harley Quinn",
  "ENTP-The_Joker.jpg": "The Joker",
  "ESTP-Aquaman.jpg": "Aquaman",
  "ESTP-Cat_Woman.jpg": "Cat Woman",
  "INFP-The_Flash.jpg": "The Flash",
  "INTJ-Batman.jpg": "Batman",
  "ISFJ-Superman.jpg": "Superman",
  "ISTJ-Cyborg.jpg": "Cyborg",
  "ENTP-Fred_Weasley&George_Weasley.jpg": "Fred & George Weasley",
  "ESFP-Ron_Weasley.jpg": "Ron Weasley",
  "ESTJ-Hermione_Granger.jpg": "Hermione Granger",
  "INFP-Luna_Lovegood.jpg": "Luna Lovegood",
  "ISFJ-Ginny_Weasley.jpg": "Ginny Weasley",
  "ISFP-Harry_Potter.jpg": "Harry Potter",
  "ENFP-Spider_Man.jpg": "Spider-Man",
  "ENTP-Iron_Man.jpg": "Iron Man",
  "ESTP-God_of_Thunder.jpg": "Thor",
  "ESTP-Rocket_Raccoon.jpg": "Rocket Raccoon",
  "INFJ-Vision.jpg": "Vision",
  "INFP-Scarlet_Witch.jpg": "Scarlet Witch",
  "INTJ-Doctor_Strange.jpg": "Doctor Strange",
  "ISFJ-Captain_America.jpg": "Captain America",
  "ISFJ-Groot.jpg": "Groot",
  "ISFP-Hulk.jpg": "Hulk",
  "ISTP-Black_Widow.jpg": "Black Widow"
};

  function startQuiz() {
    imagesForQuiz = selectRandomImages(categoryImages[selectedCategory]);
    correctAnswers.set(0);
    quizStarted = true;
    currentQuestionIndex = 0;
    showResults = false;
    loadQuestion();
  }

  function getCharacterNameFromImage(imageFileName) {
  return imageToCharacterMap[imageFileName] || "Unknown Character";
  }

  function loadQuestion() {
    let imageFileName = imagesForQuiz[currentQuestionIndex];
    let correctAnswer = imageFileName.split('-')[0];
    characterName = getCharacterNameFromImage(imageFileName); // This will get the character name from the dictionary
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
    let score = $correctAnswers; // Ensure you use the $ prefix to get the value directly
    if (score === 4) {
      feedbackImage = `${base}/mbti_images/quiz_data/feedback/good.webp`;
      resultsMessage = "Excellent, you are a master in MBTI!";
    } else if (score >= 2) {
      feedbackImage = `${base}/mbti_images/quiz_data/feedback/soso.webp`;
      resultsMessage = "Great job, you know quite a bit!";
    } else {
      feedbackImage = `${base}/mbti_images/quiz_data/feedback/bad.webp`;
      resultsMessage = "Looks like there's more to learn, try again!";
    }
    resultsMessage += ` You answered ${score} out of 4 correctly.`;
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
  justify-content: flex-start; /* Changed from center to flex-start */
  min-height: 90vh; /* Reduced from 100vh to pull content up */
  margin-top: 40px; /* Example of pulling the content up by reducing the top margin */
}

.quiz-container {
  text-align: center;
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
  padding: 12px 24px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  font-size: 18px;
}

button:hover {
  background-color: #45a049;
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}
.quiz-container h2 {
  margin-top: 0px; /* Negative value pulls the content up */
  /* Other styling properties */
}

p {
  font-size: 18px;
  margin-bottom: 20px;
}

.restart-button-container {
  margin-top: 20px;
}
  .feedback-image {
    max-width: 50%; /* Adjust this value as needed */
    max-height: 400px; /* Adjust this value as needed */
    margin-bottom: 20px;
  }
  .category-image {
    max-width: 50%; /* Adjust this value as needed */
    max-height: 400px; /* Adjust this value as needed */
    margin-bottom: 20px;
  }
  footer {
    position: absolute;
    bottom: -80px;
    width: 100%;
    text-align: center;
    padding: 10px;
    background-color: #f3f3f3; /* Or any color that fits your design */
  }

  footer p {
    margin: 0;
    font-size: 14px;
  }

  footer a {
    color: #0645AD; /* Or any color that fits your design */
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }
  
  .cheatsheet {
  max-width: 200px; /* Adjust as needed */
  max-height: 100%; /* Adjust as needed */
  /* additional styling as needed */
}
</style>


{#if !quizStarted && !showResults}
  <div class="centered-container">
    <img src={`${base}/mbti_images/quiz_data/quiz_choose.webp`} alt="Choose Your Quiz" class="category-image">
    <h2>Select your favorite fictional universe and start the quiz!</h2>
    <div class="categories-container">
      {#each Object.keys(categoryImages) as category}
        <button on:click={() => { selectedCategory = category; startQuiz(); }}>
          {category}
        </button>
      {/each}
    </div>
  </div>
{:else if quizStarted}
  <div class="centered-container">
    <div class="quiz-container">
      <h2>{characterName}</h2>
      <img class="quiz-image" src={`${base}/mbti_images/quiz_data/${selectedCategory}/${imagesForQuiz[currentQuestionIndex]}`} alt="Character image" />
      <div class="choices-container">
        {#each currentChoices as choice}
          <button on:click={() => selectAnswer(choice)}>{choice}</button>
        {/each}
      </div>
      {#if showFeedback}
      <p in:fade={{ duration: 500 }}>{feedbackMessage}</p>
      {/if}
      <!-- Cheatsheet image addition for when the quiz is ongoing -->
      <img src={`${base}/mbti_images/quiz_data/cheatsheet.jpg`} 
       alt="MBTI Cheat Sheet" 
       class="cheatsheet" 
       style="position: absolute; left: 5%; top: 20%;">
       <img src={`${base}/mbti_images/quiz_data/thinking.webp`} 
       alt="MBTI Cheat Sheet" 
       class="cheatsheet" 
       style="position: absolute; right: 5%; top: 50%;">
    </div>
  </div>
{:else if showResults}
  <div class="centered-container">
    {#if feedbackImage}
      <img src={feedbackImage} alt="Feedback" class="feedback-image" />
    {/if}
    <p>{resultsMessage}</p>
    <div class="restart-button-container">
      <button on:click={restartQuiz}>Thank you for the journey with Capybara! <br> Give another shot and see what other cool characters we have!</button>
    </div>
  </div>
{/if}

