function createXPGraph(data) {
    const margin = {top: 20, right: 20, bottom: 50, left: 50};
    const width = 280 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    // Clear previous chart if any
    d3.select("#xpChart").html("");

    const svg = d3.select("#xpChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Transform data to show cumulative XP
    const xpData = data.transactions
        .map(t => ({
            date: new Date(t.createdAt),
            amount: t.amount
        }))
        .sort((a, b) => a.date - b.date);

    // Calculate cumulative sum
    let runningTotal = 0;
    xpData.forEach(d => {
        runningTotal += d.amount;
        d.cumulativeXP = runningTotal;
    });

    // If no data points, add placeholder message
    if (xpData.length === 0) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text("No XP data available");
        return;
    }

    const x = d3.scaleTime()
        .domain(d3.extent(xpData, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(xpData, d => d.cumulativeXP) * 1.1]) // Add 10% padding
        .range([height, 0]);

    // Create the area fill with gradient
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "xp-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
      
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#0ef")
        .attr("stop-opacity", 0.7);
      
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#0ef")
        .attr("stop-opacity", 0.1);

    const area = d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.cumulativeXP))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(xpData)
        .attr("fill", "url(#xp-gradient)")
        .attr("d", area);

    // Create the line with animation
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.cumulativeXP))
        .curve(d3.curveMonotoneX);

    const path = svg.append("path")
        .datum(xpData)
        .attr("fill", "none")
        .attr("stroke", "#0ef")
        .attr("stroke-width", 2.5)
        .attr("d", line);
  
    // Animate the line drawing
    const pathLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", pathLength + " " + pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);

    // Add data points
    svg.selectAll(".data-point")
        .data(xpData)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.cumulativeXP))
        .attr("r", 3)
        .attr("fill", "white")
        .attr("stroke", "#0ef")
        .attr("stroke-width", 1.5)
        .style("opacity", 0)
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .style("opacity", 1);

    // Add tooltip for data points
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("font-size", "12px")
        .style("border", "1px solid #0ef");

    svg.selectAll(".data-point")
        .on("mouseover", function(event, d) {
            const formatter = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 5);
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`Date: ${formatter.format(d.date)}<br>XP: ${d.cumulativeXP.toLocaleString()}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 3);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add a more readable x-axis with fewer ticks
    const xAxis = d3.axisBottom(x)
        .ticks(3)  // Fewer ticks for better readability
        .tickFormat(d3.timeFormat("%b %y"));  // Format as "Month Year"

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .style("font-size", "10px")
        .selectAll("text")
        .style("fill", "white")
        .style("text-anchor", "middle");

    // Add a cleaner y-axis with better number formatting
    const yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => {
            if (d >= 1000000) return `${(d/1000000).toFixed(1)}M`;
            if (d >= 1000) return `${(d/1000).toFixed(1)}k`;
            return d;
        });

    svg.append("g")
        .call(yAxis)
        .style("font-size", "10px")
        .selectAll("text")
        .style("fill", "white");
      
    // Add labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "10px")
        .text("Time");
      
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "10px")
        .text("XP");
} 