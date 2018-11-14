function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  let url= "/metadata/" + sample;
  d3.json(url).then(function(response) {
    //console.log(response);
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    let sample_metadata = d3.select("#sample-metadata").html("")    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(function([key, value]) {
      sample_metadata.append("div").text(`${key}: ${value}`)
    })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  }
)};

function buildCharts(sample) {
  let url= "/samples/" + sample;
  d3.json(url).then(function(response) {
    
    let restructure = response.sample_values.map(function(x, i) {
      return {
        otu_ids: response.otu_ids[i],
        otu_labels: response.otu_labels[i],
        sample_values: response.sample_values[i]
      }});

    restructure.sort(function(a, b){return b.sample_values-a.sample_values});

    let sliced = restructure.slice(0,10);
    
    //empty arrays for Plotly
    slicedLabels = [];
    slicedIds = [];
    slicedValues = [];
    
    // pushing object values into arrays for Plotly
    for (const x of sliced) {
      slicedValues.push(x.sample_values)
      slicedLabels.push(x.otu_labels);
      slicedIds.push(x.otu_ids)
    }
    
    // Plotly PieChart
    let data = [{
      values: slicedValues,
      labels: slicedIds,
      hovertext: slicedLabels,
      type: "pie"
    }];

    let layout = {
      title: `Sample #${sample}`
    };
    
    Plotly.newPlot("pie", data, layout);
    

    // Plotly BubbleChart
    let trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        size: response.sample_values,
        color: response.otu_ids,
        opacity: response.otu_ids
      }
    };
    
    let data2 = [trace1];
    
    let layout2 = {
      title: `Sample #${sample}`,
      showlegend: false,
      xaxis: {
        title: 'OTU ID',
      },
      yaxis: {
        title: 'Sample Values',
      },
    };
    
    Plotly.newPlot('bubble', data2, layout2);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
