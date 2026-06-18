


function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function loadAllScripts() {
  const scripts = [
    "./include/MapLocation.js",
    "./include/landmarks.js",
    "./include/map-links.js",
    "./include/components.js",
    "./include/PathLocation.js",
    "./include/draw-route.js",
    "./include/common.js"
  ];

  for (const src of scripts) {
    await loadScript(src);   // loads sequentially
  }
}

export default loadAllScripts;
