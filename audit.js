function createAuditRatioGraph(data) {
    const width = 340;
    const height = 340;
    const radius = Math.min(width, height) / 2 - 40; // Reduce radius for fit

    // Clear previous chart if any
    d3.select("#auditChart").html("");

    const svg = d3.select("#auditChart")
        .attr("width", width)
        .attr("height", height + 80) // Increase SVG height to accommodate both elements
        .append("g")
        .attr("transform", `translate(${width/2},0)`); // Start from top

    // Add a spinning gradient animation via CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spinGradient {
            0% { stop-color: rgba(0, 238, 255, 0.7); }
            50% { stop-color: rgba(0, 180, 255, 0.9); }
            100% { stop-color: rgba(0, 238, 255, 0.7); }
        }
        
        .pie-gradient-animation stop {
            animation: spinGradient 4s linear infinite;
        }
    `;
    document.head.appendChild(style);

    // Convert values to MB (divide by 1000)
    const auditData = {
        'Done': data.totalUp / 1000000,
        'Received': data.totalDown / 1000000
    };

    // Calculate ratio early to make sure it's displayed
    const ratio = auditData.Done / (auditData.Received || 1); // Avoid division by zero

    // Create the stats panel at the top with fixed position
    const statsPanel = svg.append("g")
        .attr("transform", `translate(0, 60)`); // Position from top of SVG

    // Add a background for the stats panel
    statsPanel.append("rect")
        .attr("x", -width/2 + 20)
        .attr("y", 0)
        .attr("width", width - 40)
        .attr("height", 120)
        .attr("rx", 10)
        .attr("fill", "rgba(0, 10, 30, 0.7)")
        .attr("stroke", "rgba(0, 238, 255, 0.3)")
        .attr("stroke-width", 1);

    // Add heading
    statsPanel.append("text")
        .attr("x", 0)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text("AUDIT STATISTICS");

    // Display the Done and Received values prominently
    const doneValue = statsPanel.append("g")
        .attr("transform", "translate(-80, 55)");
  
    doneValue.append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "white")
        .text("Done:");
  
    doneValue.append("text")
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", "#0ef")
        .text(`${auditData.Done.toFixed(1)} MB`);

    const receivedValue = statsPanel.append("g")
        .attr("transform", "translate(80, 55)");
  
    receivedValue.append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "white")
        .text("Received:");
  
    receivedValue.append("text")
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", "#ff3333")
        .text(`${auditData.Received.toFixed(1)} MB`);

    // Add the ratio at the bottom
    statsPanel.append("rect")
        .attr("x", -60)
        .attr("y", 90)
        .attr("width", 120)
        .attr("height", 26)
        .attr("rx", 5)
        .attr("fill", "rgba(0, 40, 80, 0.6)")
        .attr("stroke", "#0ef")
        .attr("stroke-width", 1);
      
    statsPanel.append("text")
        .attr("x", 0)
        .attr("y", 108)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", ratio >= 1 ? "#0ef" : "orange") // Color based on ratio value
        .text(`Ratio: ${ratio.toFixed(2)}`);

    // Create the pie chart group 15px below the stats panel
    const pieChartGroup = svg.append("g")
        .attr("transform", `translate(0, ${60 + 120 + 120})`); // Stats Y position + stats height + 15px gap

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null); // Don't sort, use the order of data

    const data_ready = pie(Object.entries(auditData).map(([key, value]) => ({key, value})));

    // Create a gradient that will animate
    const gradient = pieChartGroup.append("defs")
        .append("linearGradient")
        .attr("id", "spinning-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("class", "pie-gradient-animation");
    
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("class", "gradient-stop-1");
    
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("class", "gradient-stop-2");

    const arcGenerator = d3.arc()
        .innerRadius(radius * 0.5) 
        .outerRadius(radius * 0.8);

    // Create slices with hover effect in the pie chart group
    pieChartGroup.selectAll('slices')
        .data(data_ready)
        .join('path')
        .attr('d', arcGenerator)
        .attr('fill', d => d.data.key === 'Done' ? '#0ef' : '#ff3333')
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.8);

    // Add a decorative center piece with spinning gradient
    pieChartGroup.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius * 0.25)
        .attr("fill", "url(#spinning-gradient)")
        .attr("stroke", "#0ef")
        .attr("stroke-width", 2)
        .style("filter", "drop-shadow(0 0 8px rgba(0, 238, 255, 0.7))");
}