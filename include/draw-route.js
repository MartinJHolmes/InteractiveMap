document.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById('drawingArea');
  let points = [];
  let line;

  svg.addEventListener('click99', (event) => {
    const pt = getSVGPoint(event);
    points.push(pt);

    if (points.length === 1) {
      // Start a new line
      line = createLine(points[0], points[0]);
      svg.appendChild(line);
    } else {
      // Update the existing line
      updateLine(line, points);
    }
  });

  svg.addEventListener('dblclick99', (event) => {
    if (points.length > 1) {
      const pt = getSVGPoint(event);
      points.push(pt);
      updateLine(line, points);
      const pointsString = points.map(pt => `${pt.x},${pt.y}`).join(' ');
      console.log(pointsString);
      const newPath = mapPointsToGPS(mapWidth, mapHeight, topLeft, bottomRight, pointsString);
      console.log(JSON.stringify(newPath,null,2));
      // Reset points for new line drawing
      points = [];
      line = null;
    }
  });

  function getSVGPoint(event) {
    const pt = svg.createSVGPoint();
    const svgRect = svg.getBoundingClientRect();
    pt.x = event.clientX - svgRect.left;
    pt.y = event.clientY - svgRect.top;
    return pt;
  }

  function createLine(start, end) {
    const newLine = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    newLine.setAttribute("fill", "none");
    newLine.setAttribute("stroke", "black");
    newLine.setAttribute("stroke-width", "2");
    newLine.addEventListener('mouseover', onLineMouseOver);
    newLine.addEventListener('mouseout', onLineMouseOut);
    return newLine;
  }

  function updateLine(line, points) {
    const pointsString = points.map(pt => `${pt.x},${pt.y}`).join(' ');
    line.setAttribute('points', pointsString);
  }

  function onLineMouseOver(event) {
    const line = event.target;
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '8');
  }

  function onLineMouseOut(event) {
    const line = event.target;
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', '2');
  }

  // tram("tram22");
  // tram("tram28");
  // tram("tram33");
  // tram("tram35");
  // function tram(tranName) {
  //     let newLine = document.getElementById(tranName);
  //     newLine.setAttribute("fill", "none");
  //     newLine.setAttribute("stroke", "black");
  //     newLine.setAttribute("stroke-width", "6");
  //     newLine.addEventListener('mouseover', onLineMouseOver);
  //     newLine.addEventListener('mouseout', onLineMouseOut);
  //     // return newLine;
  // }
});

function mapPointsToGPS(mapWidth, mapHeight, topLeft, bottomRight, points) {
  // Split the string into pairs
  const coords = points.trim().split(" ").map(p => {
    const [xStr, yStr] = p.split(",");
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);

    // Interpolate longitude (x axis)
    const lng =
      topLeft.lng +
      (x / mapWidth) * (bottomRight.lng - topLeft.lng);

    // Interpolate latitude (y axis, flipped)
    const lat =
      topLeft.lat -
      (y / mapHeight) * (topLeft.lat - bottomRight.lat);

    return { lat, lng };
  });

  return coords;
}

function addPathToSVG(path, mapWidth, mapHeight, topLeft, bottomRight, svgId, style) {
  const points = path.map(({ lat, lng }) => {
    const x = ((lng - topLeft.lng) / (bottomRight.lng - topLeft.lng)) * mapWidth;
    const y = ((topLeft.lat - lat) / (topLeft.lat - bottomRight.lat)) * mapHeight;
    return `${x.toFixed(0)},${y.toFixed(0)}`;
  }).join(" ");

  const stroke = style.stroke ?? 'black';
  const strokeWidth = style.strokeWidth ?? '2';
  const strokeDashArray = style.strokeDashArray ?? '2';

  // Create polyline in the SVG namespace
  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", stroke);
  polyline.setAttribute("stroke-width", strokeWidth);
  polyline.setAttribute("points", points);
  polyline.setAttribute("stroke-dasharray", strokeDashArray);

  // Append it to the target SVG
  const svg = document.getElementById(svgId);
  if (svg) {
    svg.appendChild(polyline);
  }

  return polyline; // in case you want to keep a reference
}

function drawAllPaths(mapWidth, mapHeight, topLeft, bottomRight, svgId) {
  for (const key in pathLocations) {
    if (pathLocations.hasOwnProperty(key)) {
      console.log("Key:", key, "Value:", pathLocations[key]);
      addPathToSVG(pathLocations[key].path, mapWidth, mapHeight, topLeft, bottomRight, svgId, pathLocations[key].style);
    }
  }
}
