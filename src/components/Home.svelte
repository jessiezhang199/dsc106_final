<script>
  import { navigate } from 'svelte-routing';
  function goToNoPage() {
    // Navigate to the page with information about MBTI test
    navigate("/no");
  }

  function goToYesPage() {
    // Navigate to the page with detailed explanations of MBTI elements
    navigate("/yes");
  }
</script>


<main>
  <h1 style="text-align: center;">Do you know about MBTI test?</h1>

  <div style="display: flex; justify-content: center; margin-top: 20px;">
    <button on:click={goToNoPage}>No</button>
    <button on:click={goToYesPage}>Yes</button>
  </div>
</main>

<style>
  /* Write your CSS styles here */
  main {
    text-align: center;
    margin-top: 50px;
  }

  button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
</style>