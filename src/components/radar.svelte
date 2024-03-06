<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';


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
  let selectedMBTI = 'ENFJ'; // Default MBTI type
  let mbtiTypes = []; // To store unique MBTI types from the dataset
  const categories = ['danceability', 'valence', 'energy', 'loudness', 'acousticness', 'instrumentalness', 'liveness'];

  onMount(async () => {
    const dataset = await fetch('page2_bar_df.csv');
    const csv = await dataset.text();
    data = d3.csvParse(csv, d3.autoType);
    // Extract MBTI types from the dataset
    mbtiTypes = Array.from(new Set(data.map(d => d.mbti)));
    drawRadarChart();
  });

  function handleMBTIChange(event) {
    selectedMBTI = event.target.value;
    drawRadarChart();
  }

  function drawRadarChart() {
    const radarWidth = 500;
    const radarHeight = 400;
    const radius = Math.min(radarWidth / 2, radarHeight / 2)-50;
    const angleSlice = (2 * Math.PI) / categories.length;
    const levels = 5; // Number of concentric circles/levels
    const chartCenterY = radarHeight / 2;  // Center Y position of the radar chart, 50 pixels down
    

    // Clear previous radar chart
    d3.select('#radarChart').select('svg').remove();

    const svg = d3.select('#radarChart')
      .append('svg')
      .attr('width', radarWidth)
      .attr('height', radarHeight)
      .append('g')
      .attr('transform', `translate(${radarWidth / 2}, ${chartCenterY})`);

    // Radar scale
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, 1]); // Assuming normalized data


    // Draw axis lines
    svg.selectAll('.axis')
      .data(categories)
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
    const radarData = categories.map((key, i) => {
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
      .data(categories)
      .enter()
      .append('text')
      .attr('class', 'axisLabel')
      .attr('x', (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d)
      .style('font-size', '10px')
      .attr('text-anchor', 'middle');
  }
</script>

<!-- MBTI Type Selection Dropdown -->
<select bind:value={selectedMBTI} on:change={handleMBTIChange}>
  {#each mbtiTypes as mbtiType}
    <option value={mbtiType}>{mbtiType}</option>
  {/each}
</select>


<div id="radarChart"></div>
