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

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let url= "/samples/" + sample;
  d3.json(url).then(function(response) {

    
    console.log(response);

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
 
    
    let restructure = response.sample_values.map(function(x, i) {
      return {
        otu_ids: response.otu_ids[i],
        otu_labels: response.otu_labels[i],
        sample_values: response.sample_values[i]
      }});

    restructure.sort(function(a, b){return b.sample_values-a.sample_values});

    let slice = restructure.slice(0,11);

    console.log(slice);

    xl = slice.map

    let data = [{
      values: slice['sample_values'],
      labels: slice['otu_labels'],
      type: 'pie'
    }];

    let layout = {
      height: 600,
      width: 600
    };


    
    Plotly.newPlot("pie", data, layout);
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
