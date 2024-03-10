<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  


  const mbtiColorPalette = {
    'INFP': '#48ad82',
    'ENFP': '#71bf9e',
    'INFJ': '#1a523a',
    'ENFJ': '#103123',
    'INTP': '#9874a6',
    'ENTP': '#af93ba',
    'INTJ': '#70507d',
    'ENTJ': '#46324e',
    'ISFP': '#e8b859',
    'ESFP': '#edc87e',
    'ISTP': '#b78d38',
    'ESTP': '#f5dfb5',
    'ISFJ': '#346f7b',
    'ESFJ': '#5ca9b8',
    'ISTJ': '#2c5f6a',
    'ESTJ': '#80bcc8'
  };

  const mbtiTexts = {
  'INTJ': 'An Architect (INTJ) is a person with the Introverted, Intuitive, Thinking, and Judging personality traits. These thoughtful tacticians love perfecting the details of life, applying creativity and rationality to everything they do. Their inner world is often a private, complex one.',
  'INTP': 'A Logician (INTP) is someone with the Introverted, Intuitive, Thinking, and Prospecting personality traits. These flexible thinkers enjoy taking an unconventional approach to many aspects of life. They often seek out unlikely paths, mixing willingness to experiment with personal creativity.',
  'ENTJ': 'A Commander (ENTJ) is someone with the Extraverted, Intuitive, Thinking, and Judging personality traits. They are decisive people who love momentum and accomplishment. They gather information to construct their creative visions but rarely hesitate for long before acting on them.',
  'ENTP': 'A Debater (ENTP) is a person with the Extraverted, Intuitive, Thinking, and Prospecting personality traits. They tend to be bold and creative, deconstructing and rebuilding ideas with great mental agility. They pursue their goals vigorously despite any resistance they might encounter.',
  'INFJ': 'An Advocate (INFJ) is someone with the Introverted, Intuitive, Feeling, and Judging personality traits. They tend to approach life with deep thoughtfulness and imagination. Their inner vision, personal values, and a quiet, principled version of humanism guide them in all things.',
  'INFP': 'A Mediator (INFP) is someone who possesses the Introverted, Intuitive, Feeling, and Prospecting personality traits. These rare personality types tend to be quiet, open-minded, and imaginative, and they apply a caring and creative approach to everything they do.',
  'ENFJ': 'A Protagonist (ENFJ) is a person with the Extraverted, Intuitive, Feeling, and Judging personality traits. These warm, forthright types love helping others, and they tend to have strong ideas and values. They back their perspective with the creative energy to achieve their goals.',
  'ENFP': 'A Campaigner (ENFP) is someone with the Extraverted, Intuitive, Feeling, and Prospecting personality traits. These people tend to embrace big ideas and actions that reflect their sense of hope and goodwill toward others. Their vibrant energy can flow in many directions.',
  'ISTJ': 'A Logistician (ISTJ) is someone with the Introverted, Observant, Thinking, and Judging personality traits. These people tend to be reserved yet willful, with a rational outlook on life. They compose their actions carefully and carry them out with methodical purpose.',
  'ISFJ': 'A Defender (ISFJ) is someone with the Introverted, Observant, Feeling, and Judging personality traits. These people tend to be warm and unassuming in their own steady way. They’re efficient and responsible, giving careful attention to practical details in their daily lives.',
  'ESTJ': 'An Executive (ESTJ) is someone with the Extraverted, Observant, Thinking, and Judging personality traits. They possess great fortitude, emphatically following their own sensible judgment. They often serve as a stabilizing force among others, able to offer solid direction amid adversity.',
  'ESFJ': 'A Consul (ESFJ) is a person with the Extraverted, Observant, Feeling, and Judging personality traits. They are attentive and people-focused, and they enjoy taking part in their social community. Their achievements are guided by decisive values, and they willingly offer guidance to others.',
  'ISTP':'A Virtuoso (ISTP) is someone with the Introverted, Observant, Thinking, and Prospecting personality traits. They tend to have an individualistic mindset, pursuing goals without needing much external connection. They engage in life with inquisitiveness and personal skill, varying their approach as needed.',
  'ISFP':'An Adventurer (ISFP) is a person with the Introverted, Observant, Feeling, and Prospecting personality traits. They tend to have open minds, approaching life, new experiences, and people with grounded warmth. Their ability to stay in the moment helps them uncover exciting potentials.',
  'ESTP':'An Entrepreneur (ESTP) is someone with the Extraverted, Observant, Thinking, and Prospecting personality traits. They tend to be energetic and action-oriented, deftly navigating whatever is in front of them. They love uncovering life’s opportunities, whether socializing with others or in more personal pursuits.',
  'ESFP':'An Entertainer (ESFP) is a person with the Extraverted, Observant, Feeling, and Prospecting personality traits. These people love vibrant experiences, engaging in life eagerly and taking pleasure in discovering the unknown. They can be very social, often encouraging others into shared activities.'
  };

  let data = [];
  let EI = 'E';
  let NS = 'N';
  let FT = 'F';
  let PJ = 'P';
  let selectedMBTI = `${EI}${NS}${FT}${PJ}`;
  let selectedColumn = 'danceability'; // Default column to display
  let mbtiTypes = []; // To store unique MBTI types from the dataset
  const columns = ['danceability', 'valence', 'energy', 'loudness', 'acousticness', 'instrumentalness', 'liveness'];
  const yDomains = {
    'danceability': [0.55, 0.8],
    'valence': [0.4, 0.7],
    'energy': [0.4, 0.8],
    'loudness': [0.6, 0.8],
    'liveness': [0.2, 0.3],
    'acousticness': [0.1, 0.45],
    // Default range for other columns (if any)
    'default': [0, 0.2]
  };
  let isSorted = false;

  onMount(async () => {
    const dataset = await fetch('page2_bar_df.csv');
    const csv = await dataset.text();
    data = d3.csvParse(csv, d3.autoType);
    document.body.style.backgroundImage = `url(${base}/page2/bg.jpg)`;
    // Extract MBTI types from the dataset
    mbtiTypes = Array.from(new Set(data.map(d => d.mbti)));
    drawRadarChart();
    drawChart();
  });

  function toggleSort() {
  isSorted = !isSorted;
  if (isSorted) {
    // Sort data when isSorted is true
    data.sort((a, b) => d3.descending(a[selectedColumn], b[selectedColumn]));
  } else {
    // Revert to the original order when isSorted is false
    // Assuming you have a way to access the original data order, perhaps loading again or storing a copy
    data = data.slice().sort((a, b) => mbtiTypes.indexOf(a.mbti) - mbtiTypes.indexOf(b.mbti));
  }
  drawChart(); // Redraw the chart with the updated data order
}

  function handleMBTIChange(event) {
    selectedMBTI = `${EI}${NS}${FT}${PJ}`;
    drawRadarChart();
  }
  $: selectedMBTI = `${EI}${NS}${FT}${PJ}`;

  function drawRadarChart() {
    const radarWidth = 700;
    const radarHeight = 600;
    const radius = 150;
    const angleSlice = (2 * Math.PI) / columns.length;
    const levels = 5; // Number of concentric circles/levels
    const chartCenterY = 250;  // Center Y position of the radar chart
    

    // Clear previous radar chart
    d3.select('#radarChart').select('svg').remove();

    const svg = d3.select('#radarChart')
      .append('svg')
      .attr('width', radarWidth)
      .attr('height', radarHeight)
      .append('g')
      .attr('transform', `translate(${radarWidth / 2 -110}, ${chartCenterY})`);

    // Radar scale
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, 1]); // Assuming normalized data


    // Draw axis lines
    svg.selectAll('.axis')
      .data(columns)
      .enter()
      .append('line')
      .attr('class', 'axis-line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(1) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('stroke', '#CDCDCD')
      .style('stroke-width', '2px');
      
    // Format the level labels to display one decimal point
    svg.selectAll('.axisLabel')
      .data(d3.range(1, (levels + 1)).reverse())
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', 4)
      .attr('y', d => -d * radius / levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .attr('text-anchor', 'middle')
      .text(d => parseFloat((d / levels).toFixed(1))); // Format to one decimal place

    
    // Draw the levels and level labels
    for (let level = 0; level < levels; level++) {
      const levelFactor = radius * ((level + 1) / levels);
      svg.selectAll(`.levels-${level}`)
        .data([1]) // Dummy data for binding
        .enter()
        .append('circle')
        .attr('class', 'grid-circle')
        .attr('r', levelFactor)
        .style('fill', '#CDCDCD')
        .style('stroke', '#CDCDCD')
        .style('fill-opacity', 0.2)
        .style('stroke-opacity', 0.7);
    }
    // Extract the data for the selected MBTI
    const mbtiData = data.find(d => d.mbti === selectedMBTI);

    // Prepare the data for radar chart plotting
    const radarData = columns.map((key, i) => {
      return {
        axis: key,
        value: mbtiData[key]
      };
    });

    radarData.push(radarData[0]); // Complete the radar loop

    // Draw the radar chart
    const line = d3.lineRadial()
      .curve(d3.curveLinearClosed)
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    // Append the radar area

    svg.append('path')
      .datum(radarData)
      .attr('d', line)
      .style('stroke', mbtiColorPalette[selectedMBTI])
      .style('fill', mbtiColorPalette[selectedMBTI])
      .style('fill-opacity', 0.25);

    // Add axes labels (optional)
    svg.selectAll('.axisLabel')
      .data(columns)
      .enter()
      .append('text')
      .attr('class', 'axisLabel')
      .attr('x', (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d)
      .style('font-size', '10px')
      .attr('text-anchor', 'middle');

    svg.append('text')
    .attr('class', 'chart-title')
    .attr('x', 0)
    .attr('y', -200) // Adjust position based on your preference
    .attr('text-anchor', 'middle')
    .style('font-size', '18px')
    .text("Music Preference");
    }


  function drawChart() {
    d3.select("#chart").select("svg").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 700 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    const y = d3.scaleLinear()
      .range([height, 0]);

    // Set the domain for the y-scale based on the selected column
    const domain = yDomains[selectedColumn] || yDomains['default'];
    y.domain(domain);
    x.domain(data.map(d => d.mbti));

    // X-axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Y-axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // Create bars
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.mbti))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d[selectedColumn]))
      .attr("height", d => height - y(d[selectedColumn]))
      .attr("fill", d => mbtiColorPalette[d.mbti]);
  }

  function updateColumn(newColumn) {
    selectedColumn = newColumn;
    drawChart();
  }

  let audio;
  let isPlaying = false;

  $: {
    if (audio) {
      audio.pause();
      audio.load(); // Reload the new source
    }
  }
  function togglePlayPause() {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      isPlaying = !isPlaying;
    }
  }
  function handleKeyPress(event) {
    // Toggle play/pause on Enter or Space key press
    if (event.key === 'Enter' || event.key === ' ') {
      togglePlayPause();
    }
  }
  function handleButtonClick(event) {
    event.stopPropagation(); // Prevent click from propagating to the parent div
    togglePlayPause();
  }

</script>

<style>
  .music-container {
    position: absolute;
    left: 10px; /* Distance from the right edge */
    top: 50%; /* Center vertically */
    transform: translateY(-50%); /* Adjust to center based on its height */
    background: hsl(43, 59%, 88%); /* Background color */
    padding: 10px; /* Padding around content */
    width: 80px; /* Specify width */
    height: 80px; /* Specify height to match width to form a circle */
    border-radius: 50%; /* Rounded corners to form a circle */
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
    display: flex; /* Ensures the content is centered */
    align-items: center; /* Center content vertically */
    justify-content: center; /* Center content horizontally */
}

.music-container button {
    width: 75px; /* Specify the width */
    height: 75px; /* Specify the height to match the width */
    border-radius: 50%; /* Rounded corners to form a circle */
    border: none; /* Remove default border */
    background-color: hsl(46, 57%, 95%); /* Background color of the button */
    color: #333; /* Text color */
    display: flex; /* Enables flexbox for centering content */
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    cursor: pointer; /* Change cursor to pointer on hover */
}
  .container {
    display: flex;
    align-items: flex-start; /* Align items vertically in the center */
    justify-content: center; /* Center items horizontally */
  }

  .mbti-image {
    width: 350px; /* Adjust the width as needed */
    height: auto; /* Maintain aspect ratio */
    margin-left: -300px; /* Add some space between the image and the radar chart */
    margin-top: 80px; 
  }
  #radarChart {
    width: 150px; /* Set the width of the radar chart */
    height: 150px; /* Set the height of the radar chart */
    margin-left: 30px;
  }
  #chart-container {
    text-align: center; /* Center the chart container */
    margin-top: 30px; /* Space from the top elements */
  }

  select {
  border-radius: 20px; /* Gives the dropdown rounded corners */
  padding: 10px 15px; /* Increased padding for a larger appearance */
  background-color: hsl(46, 57%, 95%); /* Sets a light grey background color */
  color: #333; /* Sets the text color */
  border: 3px solid #ccc; /* Adds a light grey border */
  outline: none; /* Removes the default focus outline */
  cursor: pointer; /* Changes the cursor to indicate it's clickable */
  -webkit-appearance: none; /* Removes default styling for Webkit browsers */
  -moz-appearance: none; /* Removes default styling for Mozilla browsers */
  appearance: none; /* Removes default styling */
  font-size: 18px; /* Increases the font size for better readability */
}

.mbti-selectors {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 50px; /* Adds some space between each select element */
}


  #mbti-text {
    font-family: 'Comic Sans MS', cursive;
    color: #333;
    margin-top: 30px;
    padding: 10px;
    background-color: hsl(46, 57%, 95%);
    border-radius: 10px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    width: 800px;
    margin-left: auto; 
    margin-right: auto;
  }

  #chart-container select, #chart-container button {
  border-radius: 10px; /* Slightly less rounded corners compared to the MBTI selectors */
  padding: 5px 15px; /* Less padding for a smaller appearance */
  background-color: hsl(46, 57%, 95%); /* Sets a light grey background color */
  color: #333; /* Sets the text color */
  border: 3px solid #ccc; /* Thinner border compared to the MBTI selectors */
  outline: none; /* Removes the default focus outline */
  cursor: pointer; /* Changes the cursor to indicate it's clickable */
  font-size: 16px; /* Smaller font size for the text */
  margin-right: 10px; /* Adds space between the select and the button */
}

#chart-container {
  margin-top: 20px;
  text-align: center; /* Centers the content inside the container */
}


  #tips1-container {
    position: absolute;
    border-radius: 10px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    background-color: hsl(43, 59%, 88%);
    width: 200px;
    height:50px;
    left: 330px; 
    top: 60px;
    font-size: 12px;
    text-align: center;
  }
  #tips2-container {
    position: absolute;
    border-radius: 10px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    background-color: hsl(43, 59%, 88%);
    width: 150px;
    left:10px;
    top: 500px;
    font-size: 12px;
    text-align: center;
  }

  #tips3-container {
    position: absolute;
    border-radius: 10px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    background-color: hsl(43, 59%, 88%);
    width: 200px;
    right:200px;
    bottom: 50px;
    font-size: 12px;
    text-align: center;
  }
  footer {
  position: absolute;
  bottom: -600px;
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
</style>

<!-- MBTI Type Selection Dropdown -->
<div class="mbti-selectors">
  <select bind:value={EI} on:change={handleMBTIChange}>
    <option value="E">E</option>
    <option value="I">I</option>
  </select>

  <select bind:value={NS} on:change={handleMBTIChange}>
    <option value="N">N</option>
    <option value="S">S</option>
  </select>

  <select bind:value={FT} on:change={handleMBTIChange}>
    <option value="F">F</option>
    <option value="T">T</option>
  </select>

  <select bind:value={PJ} on:change={handleMBTIChange}>
    <option value="P">P</option>
    <option value="J">J</option>
  </select>
</div>

<div id="mbti-text">
  <p>   {mbtiTexts[selectedMBTI]}</p>
</div>

<div class="container">
  <div>
    <img class="mbti-image" 
    src="{base}/mbti_images/{selectedMBTI.toLowerCase()}.jpg" alt={selectedMBTI}>
  </div>
  <div id="radarChart"></div>
</div>


<div id="tips1-container">
  <p>
    Tips: Click the button to change MBTI types!
  </p>
</div>

<div id="tips2-container">
  <p>
    Tips: Click the button above to play music! (Click again to pause)
  </p>
</div>


<p style="position: absolute; top: 320px; left: 420px; font-size: 16px; max-width: 200px;">
  What kind of music they love to listen?
</p>
<p style="position: absolute; top: 400px; right:30px; font-family: 'Comic Sans MS', cursive; font-size: 16px; max-width: 260px;">
  To explore what kind of music might be favored by {selectedMBTI}  personality types based on Spotify audio quality features, we can consider the following interpretation of each feature: 'danceability', 'valence', 'energy', 'loudness', 'acousticness', 'instrumentalness', 'liveness'.
</p>
<p style="position: absolute; top: 900px; left: 50px; font-family: 'Comic Sans MS', cursive; font-size: 16px; max-width: 250px;">
  Fun fact:
  Extroverts tend to gravitate towards energetic types of music, especially dance music and loud music. This tendency is particularly evident in ESFPs and ESTPs!
</p>

<div
  class="music-container"
  on:dblclick={togglePlayPause}
  on:keydown={handleKeyPress}
  tabindex="0"
  role="button"
  aria-pressed={isPlaying.toString()}
>
  <audio bind:this={audio} src="{base}/music/{selectedMBTI}.mp3"></audio>
  <button on:click={handleButtonClick}>Play Music</button>
</div>

<div id="chart-container">
  <!-- Dropdown to select column for the bar chart -->
  <select bind:value={selectedColumn} on:change="{() => updateColumn(selectedColumn)}">
    {#each columns as column}
      <option value="{column}">{column}</option>
    {/each}
  </select>
  <button on:click={toggleSort}>
    {isSorted ? 'Unsort' : 'Sort'}
  </button>
  <p style='font-size: 18px'>Overall Distribution of Music Types for 16 MBTIs</p>
  <div id="chart"></div>
</div>

<div style="display: flex; justify-content: center; margin-top: 20px;">
    <button on:click={() => goto(`${base}/vis`)}>Learn more</button>
</div>

<div id="tips3-container">
  <p>
    Tip: Click the button to toggle the chart's features, allowing you to sort or unsort the bar chart. Scroll down to view the chart!
  </p>
</div>

<footer>
  <p>
    Data Source: <a href="https://www.kaggle.com/datasets/xtrnglc/spotify-mbti-playlists" target="_blank">Spotify MBTI Playlist Analysis</a>
  </p>
  <p>
    Image Source: <a href="https://www.xiaohongshu.com/user/profile/6033ab1800000000010075ac?xhsshare=CopyLink&appuid=5c4e9b04000000001203ea7e&apptime=1709362317" target="_blank">xiaohongshu</a>
  </p>
</footer>