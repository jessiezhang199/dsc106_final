<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { geoNaturalEarth1, geoPath } from 'd3-geo';

  let mbtiData = [], mapData;
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  let tooltipContent = '', tooltipX = 0, tooltipY = 0, showTooltip = false;
  let searchCountry = ''; // Variables for search inputs
  let searchResult = ''; // For displaying search results on the page
  let CountrySuggestions = [];

  // Assuming you have a list of all Country names in your data
  let allCountries = []; // This will be populated with unique Country names
  
  const mbtiColors = d3.scaleOrdinal()
  .domain(["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"])
  .range(["#FFDCAC", "#5F492A", "#99B658", "#90E45E", "#B3E0AE", "#2BB17F", "#27CABD", "#147EA3", "#0D3C94", "#1E1285", '#672595', '#A97CB8', '#D7AFD9', '#E54E3B', '#7B6865', '#DD7929']);

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
    const mbtiRes = await fetch('mbti_clean.csv');
    const csvText = await mbtiRes.text();
    mbtiData = d3.csvParse(csvText, d => {
          // Use the rename map to correct Country names
          if (renameMap[d.Country]) {
          d.Country = renameMap[d.Country];
          }
          return d3.autoType(d);
      });
    // Check the structure of parsed data
    console.log(mbtiData);

    const baseURL = location.hostname === 'localhost' ? '' : '/dsc106final';

    const mapRes = await fetch(`${baseURL}/world.geojson`);
    mapData = await mapRes.json();
    drawMap();

    // After fetching and processing your data, populate allCountries
    allCountries = Array.from(new Set(mbtiData.map(d => d.Country))).sort();
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

  function drawMap() {
    const svg = d3.select('#map').html('');
    const projection = geoNaturalEarth1();
    const pathGenerator = geoPath().projection(projection);

    svg.selectAll('path')
       .data(mapData.features)
       .join('path')
       .attr('d', pathGenerator)
       .attr('fill', d => {
         const CountryData = mbtiData.find(cd => cd.Country === d.properties.name);
         return CountryData ? mbtiColors(CountryData.MBTI_type) : '#DED3D1';
       })
       .on('mousemove', (event, d) => {
         const CountryData = mbtiData.find(cd => cd.Country === d.properties.name);
         tooltipContent = CountryData ?
                   `${d.properties.name} ${CountryData.MBTI_type}: ${CountryData.Percentage} (Percentage of All Population)` :
                   `${d.properties.name}: No data`; // Include Country name before "No data"
         tooltipX = event.pageX;
         tooltipY = event.pageY - 28; // Adjust Y position to avoid cursor overlap
         showTooltip = true;
       })
       .on('mouseleave', () => {
         showTooltip = false;
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
    d3.select('#map').selectAll('path')
        .style('stroke', null)
        .style('stroke-width', null);

    // Apply a stroke to the searched Country for highlighting
    d3.select('#map').selectAll('path')
        .filter(d => d.properties.name.toLowerCase() === searchNameLower)
        .style('stroke', 'blue') // Highlight color
        .style('stroke-width', 2); // Highlight width
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
    opacity: 1;
  }

  .search-container {
    position: relative;
    display: inline-block; /* Ensure the container only takes the width of its content */
  }
  .search-container input,
  .search-results {
    margin-top: 20px;
    text-align: left; /* Aligns the text of the search results to the left */
    padding-left: 20px; /* Adds some padding to align with the search bar, adjust as needed */
    font-size: 16px;
    color: #333;
  }
  .autocomplete-suggestions {
    position: absolute;
    width: calc(100% - 80px); /* Set width relative to the Country input field (adjust the value according to your layout) */
    background-color: #e7f0fa; /* Light blue background */
    border-radius: 5px; /* Rounded corners */
    border: 1px solid #ccc; /* Border color */
    box-sizing: border-box; /* Ensure padding and border are included in the width */
    margin-bottom: 10px; /* Add some bottom margin for spacing */
  }
  .autocomplete-suggestions li {
    padding: 5px;
    cursor: pointer;
  }
  .autocomplete-suggestions li:hover {
    background-color: #f0f0f0;
  }
  .legend-container {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .legend-item svg {
    margin-right: 5px;
  }

  .legend-item span {
    font-size: 14px;
  }
</style>

<h1>Which MBTI Type is Most Common in Your Country?</h1>
<p style="position: absolute; top: 250px; left: 20px; font-size: 16px; max-width: 150px;">
  In many countries, INFP types account for the majority.
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
        <li on:click={() => selectCountry(suggestion)}>{suggestion}</li>
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
<p style="position: fixed; top: 550px; right: 20px;">Data source: <a href="https://www.kaggle.com/datasets/yamaerenay/mbtitypes-full" target="_blank">https://www.kaggle.com/datasets/yamaerenay/mbtitypes-full</a></p>

