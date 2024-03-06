<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  

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
  let selectedColumn = 'danceability'; // Default column to display
  const columns = ['danceability', 'valence', 'energy', 'loudness', 'acousticness', 'instrumentalness', 'liveness']; // List of columns
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

  let svg;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 250 - margin.top - margin.bottom;

  onMount(async () => {
    const dataset = await fetch('page2_bar_df.csv');
    const csv = await dataset.text();
    data = d3.csvParse(csv, d3.autoType);
    drawChart();
    drawRadarChart();
  });


  // function drawRadarChart() {

  //   const radarData = data.find(d => d.mbti === selectedMBTI);

  //   // Convert the radarData for the selected MBTI type into a suitable format
  //   const formattedData = columns.map(category => ({
  //     axis: category,
  //     value: radarData[category]
  //   }));


  //   const radarWidth = 300;
  //   const radarHeight = 300;

  //   const radius = Math.min(radarWidth / 2, radarHeight / 2);
  //   const angleSlice = (2 * Math.PI) / columns.length;

  //   // Create radar chart SVG
  //   const svg = d3.select('#radarChart')
  //     .attr('width', radarWidth)
  //     .attr('height', radarHeight)
  //     .append('g')
  //     .attr('transform', `translate(${radarWidth / 2}, ${radarHeight / 2})`);

  //   // Radar chart scales
  //   const rScale = d3.scaleLinear()
  //     .domain([0, 1]) // Assuming your data is normalized between 0 and 1
  //     .range([0, radius]);

  //   // Radar chart paths
  //   const line = d3.lineRadial()
  //     .curve(d3.curveLinearClosed)
  //     .radius(d => rScale(d.value))
  //     .angle((d, i) => i * angleSlice);

  //   // Radar chart axes
  //   const axisGrid = svg.append('g').attr('class', 'axisWrapper');

  //   axisGrid.selectAll('.levels')
  //     .data(d3.range(1, 5).reverse())
  //     .enter()
  //     .append('circle')
  //     .attr('class', 'gridCircle')
  //     .attr('r', d => radius / 4 * d)
  //     .style('fill', '#CDCDCD')
  //     .style('fill-opacity', 0.1);

  //   svg.append('path')
  //     .datum(radarData)
  //     .attr('d', line)
  //     .style('stroke', mbtiColorPalette[selectedMBTI])
  //     .style('fill', mbtiColorPalette[selectedMBTI])
  //     .style('fill-opacity', 0.5);
  // }


  function drawChart() {
    d3.select("#chart").select("svg").remove();

    svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    const y = d3.scaleLinear()
      .range([height, 0]);

    // Set the domain for the y-scale based on the selected column
    const domain = yDomains[selectedColumn] || yDomains['default'];
    y.domain(domain);

    x.domain(data.map(d => d.mbti));

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.mbti))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d[selectedColumn]))
      .attr("height", d => height - y(d[selectedColumn]))
      .attr("fill", d => mbtiColorPalette[d.mbti]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));
  }

  function updateColumn(newColumn) {
    selectedColumn = newColumn;
    drawChart();
  }
</script>

<div id="chart"></div>
<svg id="radarChart"></svg>

<select bind:value={selectedColumn} on:change="{() => updateColumn(selectedColumn)}">
  {#each columns as column}
    <option value="{column}">{column}</option>
  {/each}
</select>

<div style="display: flex; justify-content: center; margin-top: 20px;">
    <button on:click={() => goto(`${base}/vis`)}>Learn more</button>
</div>

<p style="position: absolute; top: 700px; right: 20px;">
  Image Source: <a href="https://www.xiaohongshu.com/user/profile/6033ab1800000000010075ac?xhsshare=CopyLink&appuid=5c4e9b04000000001203ea7e&apptime=1709362317" target="_blank">xiaohongshu</a>
</p>