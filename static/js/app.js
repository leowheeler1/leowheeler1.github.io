// metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let metadata = data.metadata; // Dot notation makes manipulating the data very easy
    let filterMetadata = metadata.filter((metadata) => metadata.id === Number(sample)); // filter based on input

    let panel = d3.select(`#sample-metadata`); // panel where data goes
    panel.html(""); // wipe it clean before we add anything to it

    let obj = filterMetadata[0]; // Removes the item from the array
    let entries = Object.entries(obj); // Built in method to return key value pairs 
    entries.forEach(([key, value]) => { 
      panel.append('h5').text(`${key} : ${value}`) // adds a set of values each iteration
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    let samples = data.samples; // 'samples' field from data
    let filterSamples = samples.filter((samples) => Number(samples.id) === Number(sample)); // Filters based on input
    
    let obj = filterSamples[0]  // Removes the item from the array
    let otu_ids = obj.otu_ids; // grabbing values to use in both charts
    let otu_labels = obj.otu_labels;
    let sample_values = obj.sample_values;

    let trace1 = [{       // trace is an array that holds a dictionary 
      x: otu_ids,        // containing all paramaters for making a chart.
      y: sample_values, // certain values are specific to certain charts.
      text: otu_labels,
      mode: 'markers',
      marker: {               // size and color of bubbles
        size: sample_values,
        color: otu_ids,
      }
    }];

    let layout1 = {                                   // I use a specific plotly library (plotly-3.0.1)
      title: {text:'Bacteria Cultures per Sample'},  // rather than 'plotly-latest' since that method is 
      xaxis: {title: {text: 'Culture'}},            // no longer supported. This just means an extra dictionary
      yaxis: {title: {text: 'Number of Baceria'}}  // with {text:'text'} format is required.
    };
    Plotly.newPlot('bubble', trace1, layout1); // bubble plot rendering

    let otu_strings = otu_ids.map((item) => 'OTU ' + String(item)); // adding OTU to the beginning of the numeric ID 
                                                                   // so that the Plotly function doesn't mistake them as 
                                                                  // a numeric value
    let trace2 = [{ // refer to line 34
      type: 'bar',
      orientation:'h',
      x: sample_values.slice(0,10).reverse(), // plotly like the values in reverse order
      y: otu_strings.slice(0,10).reverse(),
      hoverinfo: otu_labels.slice(0,10).reverse() // what you see when you hover the bar with your mouse
    }];
    let layout2 = {
      title: {text: 'Top 10 Bacteria Cultures Found'}, // Refer to line 45
      xaxis: {title: {text: 'Number of Bacteria'}},
      yaxis: {title: {text: 'Culture'}}
    }
    Plotly.newPlot('bar', trace2, layout2) // bar plot rendering
  });
}

// run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    let names = data.names;
    let dropdown = d3.select('#selDataset');  // dropdown menu
    names.forEach((name) => { // adds values to the dropdown menu
      dropdown.append("option").text(name).property("value", name);
    });
    let name0 = names[0]; // initializing
    buildCharts(name0);  // charts
    buildMetadata(name0)// and metadata
  });
}

// function for event listener
function optionChanged(newSample) {
   
  buildCharts(newSample);   // Build charts and
  buildMetadata(newSample) // metadata panel each time 
};                        // a new sample is selected

init(); // Initialize the dashboard
