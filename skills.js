function createRadarChart(skills) {
    const width = 280;
    const height = 280;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Clear previous chart if any
    d3.select("#skillsChart").html("");

    const svg = d3.select("#skillsChart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

    // Process the skills data and map skill names to more readable formats
    const skillNameMap = {
        'prog': 'Programming',
        'algo': 'Algorithm',
        'sys-admin': 'Sys Admin',
        'front-end': 'Front-End',
        'back-end': 'Back-End',
        'stats': 'Statistics',
        'ai': 'AI',
        'game': 'Game Dev',
        'tcp': 'TCP/IP'
    };

    const skillsData = skills.map(skill => {
        // Extract skill name without "skill_" prefix
        const skillName = skill.type.replace('skill_', '');
        return {
            skill: skillNameMap[skillName] || skillName, // Use mapping or original name
            originalSkill: skillName,
            value: skill.amount
        };
    });

    // Sort skills by value for better visualization
    skillsData.sort((a, b) => b.value - a.value);

    // If no data points, add placeholder message
    if (skillsData.length === 0) {
        svg.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text("No skills data available");
        return;
    }

    const features = skillsData.map(d => d.skill);
    const maxValue = d3.max(skillsData, d => d.value);

    // Scale for the axes
    const rScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, radius]);

    // Calculate angles for each feature
    const angleSlice = (Math.PI * 2) / features.length;

    // Draw circular grid levels with labels
    const levels = 4;
    
    // Add level circles
    svg.selectAll(".grid-circle")
        .data(d3.range(1, levels + 1).reverse())
        .enter()
        .append("circle")
        .attr("class", "grid-circle")
        .attr("r", d => radius * d / levels)
        .style("fill", "none")
        .style("stroke", "rgba(255, 255, 255, 0.2)")
        .style("stroke-dasharray", "4 4");

    // Add level labels
    svg.selectAll(".level-label")
        .data(d3.range(1, levels + 1))
        .enter()
        .append("text")
        .attr("class", "level-label")
        .attr("x", 5)
        .attr("y", d => -radius * d / levels)
        .attr("dy", "0.4em")
        .style("font-size", "8px")
        .style("fill", "rgba(255, 255, 255, 0.7)")
        .text(d => Math.round(maxValue * d / levels));

    // Create axes
    const axes = svg.selectAll(".axis")
        .data(features)
        .enter()
        .append("g")
        .attr("class", "axis");

    // Draw the lines
    axes.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI/2))
        .attr("y2", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI/2))
        .attr("stroke", "rgba(255, 255, 255, 0.3)")
        .attr("stroke-width", "1px");

    // Add background for labels to improve readability
    axes.append("rect")
        .attr("x", (d, i) => rScale(maxValue * 1.15) * Math.cos(angleSlice * i - Math.PI/2) - 30)
        .attr("y", (d, i) => rScale(maxValue * 1.15) * Math.sin(angleSlice * i - Math.PI/2) - 10)
        .attr("width", 60)
        .attr("height", 20)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "rgba(0, 0, 0, 0.7)")
        .style("stroke", "rgba(14, 239, 255, 0.4)")
        .style("stroke-width", "1px")
        .style("opacity", 0.7);

    // Add labels
    axes.append("text")
        .attr("class", "legend")
        .style("font-size", "9px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => rScale(maxValue * 1.15) * Math.cos(angleSlice * i - Math.PI/2))
        .attr("y", (d, i) => rScale(maxValue * 1.15) * Math.sin(angleSlice * i - Math.PI/2))
        .text(d => d)
        .style("fill", "white");

    // Draw the path
    const radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice);

    // Add radar area with gradient
    const gradient = svg.append("defs")
        .append("radialGradient")
        .attr("id", "radar-gradient")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");
        
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#0ef")
        .attr("stop-opacity", 0.7);
        
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#0ef")
        .attr("stop-opacity", 0.1);

    // Create the path with animation
    const radarPath = svg.append("path")
        .datum(skillsData)
        .attr("d", radarLine)
        .attr("stroke", "#0ef")
        .attr("stroke-width", "2px")
        .attr("fill", "url(#radar-gradient)")
        .attr("fill-opacity", 0.6)
        .style("filter", "drop-shadow(0px 0px 4px rgba(14, 239, 255, 0.5))");

    // Animate the radar path
    const pathLength = radarPath.node().getTotalLength();
    radarPath.attr("stroke-dasharray", pathLength + " " + pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);

    // Add data points
    svg.selectAll(".radar-point")
        .data(skillsData)
        .enter()
        .append("circle")
        .attr("class", "radar-point")
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI/2))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI/2))
        .attr("r", 4)
        .attr("fill", "white")
        .style("filter", "drop-shadow(0px 0px 2px #0ef)")
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

    // Add hover interactivity to data points
    svg.selectAll(".radar-point")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 6);
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`Skill: ${d.skill}<br>Value: ${d.value.toLocaleString()}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 4);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
        
    // Add a value label next to each data point
    svg.selectAll(".value-label")
        .data(skillsData)
        .enter()
        .append("text")
        .attr("class", "value-label")
        .attr("x", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI/2) * 0.85)
        .attr("y", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI/2) * 0.85)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "9px")
        .style("font-weight", "bold")
        .style("text-shadow", "0 0 2px black")
        .text(d => d.value.toLocaleString());
}
