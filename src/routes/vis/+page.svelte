<script>
  import { onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import { geoNaturalEarth1, geoPath, geoOrthographic} from 'd3-geo';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  let mbtiData = [], mapData;
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  let tooltipContent = '', tooltipX = 0, tooltipY = 0, showTooltip = false;
  let pieChartContainer;
  let showPie= false;
  let rotationPaused = false;
  let backgroundMusic;

  let searchCountry = ''; // Variables for search inputs
  let searchResult = ''; // For displaying search results on the page
  let CountrySuggestions = [];
  

  // Assuming you have a list of all Country names in your data
  let allCountries = []; // This will be populated with unique Country names
  let pieChartData;


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
  const mbtiTypes = Object.keys(mbtiColorPalette);
  const mbtiColorS = Object.values(mbtiColorPalette);
  const mbtiColors = d3.scaleOrdinal()
  .domain(mbtiTypes)
  .range(mbtiColorS);
 
  const renameMap = {
      // Example: 'CSV Name': 'GeoJSON Name',
      'Congo (Kinshasa)':"Dem. Rep. Congo",
      'Czech Republic':  'Czechia',
      'Dominica':"Dominican Rep.",
      'Dominican Republic':"Dominican Rep.",
      'Bosnia and Herzegovina': "Bosnia and Herz.",
      'United States': 'United States of America',
      };

  onMount(async () => {
    const plotlyScript = document.createElement('script');
    plotlyScript.src = 'https://cdn.plot.ly/plotly-latest.min.js';
    plotlyScript.async = true;
    document.head.appendChild(plotlyScript);
    document.body.style.backgroundImage = `url(${base}/page3/sky2.jpg)`;
    document.body.style.backgroundSize = 'cover'; // Adjust as needed
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';

    backgroundMusic = new Audio(`${base}/music/Cornfield_Chase.mp3`);
    backgroundMusic.loop = true; // Enable looping
    backgroundMusic.play();
   

    const mbtiRes = await fetch('mbti_clean.csv');
    const csvText = await mbtiRes.text();
    const pieChartRes = await fetch('mbti_all_type_clean.csv');
    const pieChartText = await pieChartRes.text();
   
    pieChartData = d3.csvParse(pieChartText, d => {
          // Use the rename map to correct Country names
          if (renameMap[d.Country]) {
          d.Country = renameMap[d.Country];
          }
          return d3.autoType(d);
      });
    mbtiData = d3.csvParse(csvText, d => {
          // Use the rename map to correct Country names
          if (renameMap[d.Country]) {
          d.Country = renameMap[d.Country];
          }
          return d3.autoType(d);
      });
    // Check the structure of parsed data
    

    const baseURL = location.hostname === 'localhost' ? '' : '/dsc106final';

    const mapRes = await fetch(`${baseURL}/world.geojson`);
    mapData = await mapRes.json();
    drawMap();

    // After fetching and processing your data, populate allCountries
    allCountries = Array.from(new Set(mbtiData.map(d => d.Country))).sort();
  });

  onDestroy(() => {
    // Cleanup that also needs to run in the browser
    if (typeof document !== 'undefined') {
      document.body.style.backgroundImage = '';
    }
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  });

  // Watch for changes in searchCountry and update suggestions
  $: if (searchCountry) {
    CountrySuggestions = allCountries.filter(Country => 
      Country.toLowerCase().includes(searchCountry.toLowerCase())
    ).slice(0, 5); // Limit the number of suggestions
  } else {
    CountrySuggestions = [];
  }

  $: if (searchCountry) {
    const exactMatch = allCountries.find(Country => Country.toLowerCase() === searchCountry.toLowerCase());
    CountrySuggestions = allCountries.filter(Country => 
      Country.toLowerCase().includes(searchCountry.toLowerCase()) && Country !== exactMatch
    ).slice(0, 5); // Limit the number of suggestions
  } else {
    CountrySuggestions = [];
  }

  function showPieChart(data, mouseX, mouseY) {
    if (!pieChartContainer) {
    // Create the pieChartContainer div if it doesn't exist
    pieChartContainer = document.createElement('div');
    pieChartContainer.id = 'pieChartContainer';
    document.body.appendChild(pieChartContainer);
  }
    const mbtiTypes = ["ENFJ", "ENFP", "ENTJ", "ENTP", "ESFJ", "ESFP", "ESTJ", "ESTP", "INFJ", "INFP", "INTJ", "INTP", "ISFJ", "ISFP", "ISTJ", "ISTP"]
    const plotData = [{
      values: mbtiTypes.map(type => data[type]),
      labels: mbtiTypes,
      type: 'pie',
      marker: {
        colors: mbtiTypes.map(type => mbtiColors(type)), // Use mbtiColors for each type
      },
      textinfo: 'label+percent',
      hoverinfo: 'label+percent',
    }];

    console.log(plotData)

    const plotLayout = {
      title: `MBTI Distribution in ${data.Country}`,
      showlegend: false,
      width: 400, // Set the desired width
      height: 400, // Set the desired height
      // opacity: 0.5,
    };

    Plotly.newPlot('pieChartContainer', plotData, plotLayout);

    pieChartContainer.style.position = 'absolute';
    pieChartContainer.style.left = `${mouseX + 10}px`;
    pieChartContainer.style.top = `${mouseY + 10}px`;
    pieChartContainer.style.opacity = 0.8;
    
    rotationPaused = true;
  }
  function removePieChartAfterDelay() {
  setTimeout(() => {
    if (pieChartContainer) {
      document.body.removeChild(pieChartContainer);
      pieChartContainer = null;
    }
  }, 5000); // Adjust the delay time (in milliseconds) as needed
}

  function drawMap() {
    const width = 900;
    const height = 600;
    let dragging = false;
    let dragStart, dragEnd;
    let rotationTimer;
    const svg = d3.select('#map').html('')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('left', '100px')
      .style('right', '100px')
      .call(d3.drag().on('start', dragStartHandler).on('drag', dragged).on('end', dragEndHandler))
  

    const projection = geoOrthographic().translate([width / 2, height / 2]).scale(300).rotate([0, 0]);
    const pathGenerator = geoPath().projection(projection);
    svg.append('circle')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', projection.scale())
    .attr('fill', '#44c4f2')
    .attr('opacity', 0.9);

    const graticule = d3.geoGraticule()
      .step([20, 20]);

    svg.append('path')
      .datum(graticule())
      .attr('class', 'graticule')
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2 2');

    svg.selectAll('path.country')
       .data(mapData.features)
       .join('path')
       .attr('class', 'country')
       .attr('d', pathGenerator)
       .attr('fill', d => {
        const CountryData = mbtiData.find(cd => cd.Country === d.properties.name);
        return CountryData ? mbtiColors(CountryData.MBTI_type) : '#DED3D1';
       })
       .attr('opacity', 0.9)
       .attr('stroke', 'white') // Add this line to set the stroke color
       .attr('stroke-width', 0.3)
       .on('mousemove', (event, d) =>{
            // Display pie chart when the mouse is over the country
            const countryPieData = pieChartData.find(pd => pd.Country === d.properties.name);
            if (countryPieData) {
              showPieChart(countryPieData, event.pageX, event.pageY);
               // Adjust Y position to avoid cursor overlap
              showPie = true;
            } else {
              tooltipContent = `${d.properties.name}: No data`; 
              showTooltip = true;
              tooltipX = event.pageX;
              tooltipY = event.pageY - 10;
            }
             // Adjust Y position to avoid cursor overlap
            
            rotationPaused = true;
        })
       .on('mouseleave', () => {
         showTooltip = false;
         removePieChartAfterDelay();
         showPie = false;
         rotationPaused = false;
        
       });
    enableRotation();
    function enableRotation() {
      if (rotationTimer) {
        rotationTimer.stop();
      }

      let lastTime = Date.now();

      rotationTimer = d3.timer(function () {
        if (!dragging && !rotationPaused) {
          const now = Date.now();
          const delta = now - lastTime;
          lastTime = now;

           // Resume rotation after 1 second of mouse inactivity
            const rotate = projection.rotate();
            const rotationSpeed = 0.005; // Adjust rotation speed as needed
            projection.rotate([rotate[0] + rotationSpeed * delta, rotate[1]]);
            svg.selectAll('path.country').attr('d', pathGenerator);
            svg.select('path.graticule').attr('d', pathGenerator);
        }
      });
    }

      function dragStartHandler(event) {
        dragging = true;
        dragStart = projection.invert(d3.pointer(event));
        rotationPaused = true;
      }
      function dragged(event) {
        if (dragging) {
          d3.timerFlush();

          const rotate = projection.rotate();
          const k = 1 + event.subject.y / height;

          projection.rotate([rotate[0] + event.dx / k, rotate[1] - event.dy / k]);
          svg.selectAll('path').attr('d', pathGenerator);
        }
      }
      function dragEndHandler() {
        dragging = false;
        
      }

      svg.on('mousedown', (event) => {
        dragging = true;
        dragStart = projection.invert(d3.pointer(event));
      });

      svg.on('mouseup', () => {
        dragEndHandler();
      });
  }

  function searchData() {
    if (!searchCountry) {
        searchResult = 'Please enter Country';
        return;
    }

    const filteredData = mbtiData.filter(d => 
      d.Country.toLowerCase() === searchCountry.toLowerCase());
    
    if (filteredData.length > 0) {
        // Data exists, update the year and the map visualization
        searchResult = `${searchCountry} ${filteredData[0].MBTI_type}: ${filteredData[0].Percentage} (Percentage of All Population)`;
        // Highlight the searched Country
        highlightCountry(searchCountry);
        
    } else {
        searchResult = `${searchCountry}: No data available.`;
    }

    // Clear the CountrySuggestions to hide the list of hints
    CountrySuggestions = [];
  }

  function highlightCountry(CountryName) {
    // Normalize the search input to lowercase
    const searchNameLower = CountryName.toLowerCase();

    // Reset any previous highlights
    d3.select('#map').selectAll('path.country')
      .style('fill', d => {
        const CountryData = mbtiData.find(cd => cd.Country === d.properties.name);
        return CountryData ? mbtiColors(CountryData.MBTI_type) : '#DED3D1';
      }).style('stroke', 'white') // Reset stroke color
      .style('stroke-width', 0.3); 

    // Apply a stroke to the searched Country for highlighting
    d3.select('#map').selectAll('path.country')
      .filter(d => d.properties.name.toLowerCase() === searchNameLower)
      .style('fill', '#51544d');
  }

 function selectCountry(Country) {
  searchCountry = Country; // Update the search input with the selected Country
  CountrySuggestions = []; // Clear suggestions
  
  }

  function resetSearch() {
    searchCountry = '';
    searchResult = '';
    CountrySuggestions = []; // Clear Country suggestions

    // Clear any highlights from the map
    d3.select('#map').selectAll('path')
      .style('stroke', null)
      .style('stroke-width', null);

    // Redraw the map if necessary to remove any highlights
    drawMap();
  }
  
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      searchData();
    }
  }
  
</script>

<style>
  
  h1 {
  text-align: center; /* Centers the title text */
  color: white;
  font-family:'Great Vibes', cursive;
  font-size: 40px;
  opacity: 0.9;
  }
  
  #map {
    width: 80%; /* Adjust the width as needed */
    min-height: 700px; /* Adjust the height as needed */
    margin: 0 auto; /* This centers the map horizontally */
    display: block; /* Ensures the map is treated as a block-level element, which respects margin auto for centering */
    position: relative;
  }
  
  .tooltip {
    position: fixed;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.75);
    color: white;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    font-size: 14px;
    z-index: 100;
  }
  .tooltip.show {
    opacity: 0.9;
  }
  .pieChart{
    opacity: 0.5;
  }
  

  .search-container {
    position: relative;
    display: inline-block; /* Ensure the container only takes the width of its content */
  }
  .search-container input,
  .search-results {
    margin-top: 20px;
    text-align: left; /* Aligns the text of the search results to the left */
    padding-left: 20px; /* Adds some paddsing to align with the search bar, adjust as needed */
    font-size: 16px;
    color: #28c7ea;
  }
  .autocomplete-suggestions {
    position: absolute;
    width: calc(100% - 80px); /* Set width relative to the Country input field (adjust the value according to your layout) */
    background-color: #aaddeb; /* Light blue background */
    border-radius: 5px; /* Rounded corners */
    border: 1px solid #90abbb; /* Border color */
    box-sizing: border-box; /* Ensure padding and border are included in the width */
    margin-bottom: 10px; /* Add some bottom margin for spacing */
  }
  .autocomplete-suggestions li {
    padding: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .autocomplete-suggestions li:hover {
    background-color: #88caf0a1;
  }
  .legend-container {
    position: absolute;
    top:200px;
    right: 50px;
    display: flex;
    flex-direction: column;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .legend-item svg {
    margin-right: 10px;
  }

  .legend-item span {
    font-size: 14px;
    color: white;
  }
  .learn button {
    padding: 12px 24px;
    cursor: pointer;
    background-color: #0ccced;
    color: white;
    border: none;
    border-radius: 6px;
    transition: background-color 0.3s ease;
    font-size: 18px;
    opacity: 0.9;
  }
  .learn button:hover {
    background-color: #0cb1ed;
  }
  button {
    padding: 4px 4px;
    cursor: pointer;
    background-color: #aaddeb;;
    color: black;
    border: none;
    border-radius: 6px;
    transition: background-color 0.3s ease;
    font-size: 14px;
    opacity: 0.9;
  }
  button:hover{
    background-color: #88caf0a1;
  }
  
  .text p {
    padding: 4px 4px;
    cursor: pointer;
    background-color: rgba(25, 198, 228, 0.3);;
    color: white;
    border-radius: 6px;
    transition: background-color 0.3s ease;
    font-size: 14px;
    opacity: 0.9;
  }
  p{
    color: white;
    opacity: 0.8;
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
footer p span {
  color: black; /* Sets the color of "Data source" text to black */
}

</style>

<h1>Which MBTI Type is Most Common in Your Country?</h1>
<div class="text">
<p style="position: absolute; top: 320px; left: 20px; font-size: 16px; max-width: 200px;">
  In many countries, INFP types count for the majority.
</p>
<p style="position: absolute; top: 500px; left: 20px; font-size: 16px; max-width: 200px;">
  According to our data, there are only 5 major MBTI types in the map. (INFP, ESFJ, ESTJ, ENFP, ISFJ), and the rest of the types were minority.
</p>

<p style="position: absolute; top: 200px; left: 790px; font-size: 16px; max-width: 300px;">
  Try to rotate the map by mouse or place the mouse over the country you like, what do you see?
</p>
<p style="position: absolute; top: 330px; left: 900px; font-size: 16px; max-width: 180px;">
  Fun fact: Do you know that the most common type of mbti for American is Introversion instead of Extraversion? (Surprise!)
</p>
</div>
<p style="position: absolute; top: 140px; left: 10px; font-size: 18px; max-width: 400px;">
  Search the country you want to learn more.
</p>

<div class="search-container">
  <input type="text" 
  placeholder="Country" 
  bind:value={searchCountry}
  on:keydown={handleKeydown}>

<button on:click={searchData}>Search</button>
<button on:click={resetSearch}>Reset</button> <!-- Add this line for the Reset button -->
  {#if CountrySuggestions.length > 0}
  <ul class="autocomplete-suggestions">
    {#each CountrySuggestions as suggestion}
      <li>
        <button on:click={() => selectCountry(suggestion)}>{suggestion}</button>
      </li>
    {/each}
  </ul>
  {/if}
</div>
<!-- Search results are now directly under the search bar -->
<div class="search-results">{searchResult}</div>

<svg id="map"></svg>
<div class="tooltip" style="top: {tooltipY}px; left: {tooltipX}px;" class:show="{showTooltip}">
  
  {tooltipContent}
</div>

<div class="pieChart" style="top: {tooltipY}px; left: {tooltipX}px;" class:show="{showPie}">
  {pieChartContainer}
</div>


<div class="legend-container">
  {#each mbtiColors.domain() as type}
    <div class="legend-item">
      <svg width="20" height="20">
        <rect fill={mbtiColors(type)} width="20" height="20"></rect>
      </svg>
      <span>{type}</span>
    </div>
  {/each}
  <div class="legend-item">
    <svg width="20" height="20">
      <rect fill="#DED3D1" width="20" height="20"></rect>
    </svg>
    <span>No Data</span>
  </div>
</div>
<div class="learn" style="position: absolute; top: 800px; left: 20px;">
  <button on:click={() => goto(`${base}/quiz`)}>Learn more</button>
</div>

<footer>
  <p><span>Data source:</span> <a href="https://www.kaggle.com/datasets/yamaerenay/mbtitypes-full" target="_blank">MBTI-TYPES Data</a></p>
  <p><span>Music source:</span> <a href="https://archive.org/download/interstellar-soundtrack" target="_blank">Music</a></p>
</footer>
