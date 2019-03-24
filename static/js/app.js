function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`

  // Use `.html("") to clear any existing metadata

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  d3.json(`metadata/${sample}`).then(function (data) {
    console.log(data)
    d3.select("#sample-metadata").html(" ")
    let myHtmlBlock = d3.select("#sample-metadata");
    Object.keys(data).forEach(key => {
      myHtmlBlock.append('p').text(key + " : " + data[key])
    })
  })


  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  // @TODO: Build a Bubble Chart using the sample data

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).

  console.log(sample) //just some ID of a person
  let url = `samples/${sample}`;
  d3.json(url).then(function (data) {
    //top 10 
    let myvalues = data.sample_values.slice(0, 10);
    let myLables = data.otu_ids.slice(0, 10);

    //plotly piechart
    var staticData = [{
      values: myvalues,
      labels: myLables,
      type: 'pie'
    }];

    var layout = {
      height: 400,
      width: 500
    };

    Plotly.newPlot('pie', staticData, layout);

    d3.json(url).then(function (data) {

      // @TODO: Build a Bubble Chart using the sample data
      var x_axis = data.otu_ids;
      var y_axis = data.sample_values;
      var bubbleSize = data.sample_values;
      var bubbleColors = data.otu_ids;
      var for_txt = data.otu_labels;

      var trace1 = {
        x: x_axis,
        y: y_axis,
        text: for_txt,
        mode: 'markers',
        marker: {
          color: bubbleColors,
          size: bubbleSize
        }
      };

      var data = [trace1];

      var layout = {
        xaxis: { title: "OTU ID" },
      };

      Plotly.newPlot('bubble', data, layout);
    })

  })

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
