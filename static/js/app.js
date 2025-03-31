// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metadata = data.metadata;
    // Filter the metadata for the object with the desired sample number
    let filterMetadata = metadata.filter((metadata) => metadata.id === Number(sample));
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select(`#sample-metadata`);
    panel.html("");
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let obj = filterMetadata[0];
    // Built in method to return key value pairs 
    let entries = Object.entries(obj);
    entries.forEach(([key, value]) => {
      panel.append('h5').text(`${key} : ${value}`)
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let samples = data.samples;
    console.log(samples);
    // Filter the samples for the object with the desired sample number
    let filterSamples = samples.filter((samples) => Number(samples.id) === Number(sample));
    console.log(filterSamples);
    // Get the otu_ids, otu_labels, and sample_values
    let obj = filterSamples[0]
    let otu_ids = obj.otu_ids;
    let otu_labels = obj.otu_labels;
    let sample_values = obj.sample_values;
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);
    // Build a Bubble Chart
    let trace1 = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,

      }
    }];

    let layout1 = {
      title: {text:'Bacteria Cultures per Sample'},
      xaxis: {title: {text: 'Culture'}},
      yaxis: {title: {text: 'Number of Baceria'}}
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', trace1, layout1);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otu_strings = otu_ids.map((item) => 'OTU ' + String(item));
    console.log(otu_strings)
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = [{
      type: 'bar',
      orientation:'h',
      x: sample_values.slice(0,10).reverse(),
      y: otu_strings.slice(0,10).reverse(),
      hoverinfo: otu_labels.slice(0,10).reverse()
    }];
    console.log(trace2)
    let layout2 = {
      title: {text: 'Top 10 Bacteria Cultures Found'},
      xaxis: {title: {text: 'Number of Bacteria'}},
      yaxis: {title: {text: 'Culture'}}
    }

    // Render the Bar Chart
    Plotly.newPlot('bar', trace2, layout2)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    let name0 = names[0];
    // Build charts and metadata panel with the first sample
    buildCharts(name0);
    buildMetadata(name0)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample) 
};

// Initialize the dashboard
init();
