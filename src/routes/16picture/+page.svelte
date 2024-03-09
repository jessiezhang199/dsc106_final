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
    // Extract MBTI types from the dataset
    mbtiTypes = Array.from(new Set(data.map(d => d.mbti)));
    drawRadarChart();
    drawChart();
  });


  function toggleSort() {
  isSorted = !isSorted;
  drawChart(); // Redraw the chart with the new sort state
  }
  function handleMBTIChange(event) {
    selectedMBTI = `${EI}${NS}${FT}${PJ}`;
    drawRadarChart();
  }

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
  }
  let imageUrl = `${base}/mbti_images/${selectedMBTI.toLowerCase()}.jpg`; 

  $: imageUrl = `${base}/mbti_images/${selectedMBTI.toLowerCase()}.jpg`; 
  $: selectedMBTI = `${EI}${NS}${FT}${PJ}`;
  $: imageUrl = `${base}/mbti_images/${selectedMBTI.toLowerCase()}.jpg`; 

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

    if (isSorted) {
    data.sort((a, b) => d3.descending(a[selectedColumn], b[selectedColumn]));
  }
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
  $: audioSource = `${base}/music/${selectedMBTI}.mp3`;
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

<div
  class="music-container"
  on:dblclick={togglePlayPause}
  on:keydown={handleKeyPress}
  tabindex="0"
  role="button"
  aria-pressed={isPlaying.toString()}
>
  <audio bind:this={audio} src={audioSource}></audio>
  <button on:click={handleButtonClick}>Play Music</button>
</div>

<style>
  .music-container {
    position: fixed; 
    right: 10px; /* Distance from the left edge */
    top: 50%; /* Center vertically */
    transform: translateY(-50%); /* Adjust to center based on its height */
    background: #f8f8f8; /* Background color */
    padding: 10px; /* Padding around content */
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
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

  #radarChart svg {
    width: 100%; /* Make the SVG fill the container */
    height: 100%; /* Make the SVG fill the container */
  }

  #chart-container {
    text-align: center; /* Center the chart container */
    margin-top: 100px; /* Space from the top elements */
  }

  select {
  border-radius: 20px; /* Gives the dropdown rounded corners */
  padding: 5px 10px; /* Adds some padding inside the dropdown */
  background-color: #ede9e6; /* Sets a light grey background color */
  color: #333; /* Sets the text color */
  border: 3px solid #ccc; /* Adds a light grey border */
  outline: none; /* Removes the default focus outline */
  cursor: pointer; /* Changes the cursor to indicate it's clickable */
  -webkit-appearance: none; /* Removes default styling for Webkit browsers */
  -moz-appearance: none; /* Removes default styling for Mozilla browsers */
  appearance: none; /* Removes default styling */
}


.mbti-selectors::after {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #333;
  pointer-events: none; /* Ensures clicks on the arrow don't interfere with the select functionality */
}
.mbti-selectors {
    margin-top: 20px; 
    display: flex;
    justify-content: center;
    gap: 50px; /* Adds some space between each select element */
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

<div class="container">
  <div>
    <img class="mbti-image" src={imageUrl} alt={selectedMBTI}>
  </div>
  <div id="radarChart"></div>
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
  <div id="chart"></div>
</div>

<div style="display: flex; justify-content: center; margin-top: 20px;">
    <button on:click={() => goto(`${base}/vis`)}>Learn more</button>
</div>

<div style="display: flex; justify-content: space-between;">
  <p>
    Data Source: <a href="https://www.kaggle.com/code/xtrnglc/spotify-mbti-playlist-analysis" target="_blank">Spotify MBTI Playlist Analysis</a>
  </p>
  <p>
    Image Source: <a href="https://www.xiaohongshu.com/user/profile/6033ab1800000000010075ac?xhsshare=CopyLink&appuid=5c4e9b04000000001203ea7e&apptime=1709362317" target="_blank">xiaohongshu</a>
  </p>
</div>

