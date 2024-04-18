const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Function to initialize the dashboard
function init() {
    // Select the dropdown menu
    const dropdownMenu = d3.select("#selDataset");

    // Load JSON data
    d3.json(url).then(data => {
        // Extract sample names
        const sampleNames = data.names;

        // Populate dropdown menu with sample names
        sampleNames.forEach(sample => {
            dropdownMenu.append("option")
                .text(sample)
                .property("value", sample);
        });

        // Initial sample
        const initialSample = sampleNames[0];

        // Build initial plots and metadata
        buildCharts(initialSample);
        buildMetadata(initialSample);
    });
}

// Function to build charts and metadata
function buildCharts(sample) {
    // Load JSON data
    d3.json(url).then(data => {
        // Filter data based on selected sample
        const sampleData = data.samples.find(entry => entry.id === sample);

        // Extract sample values, OTU IDs, and labels
        const sampleValues = sampleData.sample_values.slice(0, 10).reverse();
        const otuIds = sampleData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
        const otuLabels = sampleData.otu_labels.slice(0, 10).reverse();

        // Bar chart trace
        const barTrace = {
            x: sampleValues,
            y: otuIds,
            text: otuLabels,
            type: 'bar',
            orientation: 'h'
        };

        // Bar chart layout
        const barLayout = {
            title: 'Top 10 OTUs Found'
        };

        // Plot bar chart
        Plotly.newPlot('bar', [barTrace], barLayout);

        // Bubble chart trace
        const bubbleTrace = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: 'markers',
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: 'Earth'
            }
        };

        // Bubble chart layout
        const bubbleLayout = {
            title: 'Bacteria Count Per Sample',
            xaxis: { title: 'OTU ID' }
        };

        // Plot bubble chart
        Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);
    });
}

// Function to build metadata
function buildMetadata(sample) {
    // Select metadata panel
    const metadataPanel = d3.select("#sample-metadata");

    // Load JSON data
    d3.json(url).then(data => {
        // Filter metadata based on selected sample
        const metadata = data.metadata.find(entry => entry.id === +sample);

        // Clear existing metadata
        metadataPanel.html("");

        // Add each key-value pair to metadata panel
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    });
}

// Function to handle change in selected sample
function optionChanged(newSample) {
    // Rebuild charts and metadata for the newly selected sample
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
