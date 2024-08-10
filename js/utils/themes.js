// ************ Themes ************
var themes = ["default", "aqua","r"]

var colors = {
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
	aqua: {
		1: "#bfdfff",
		2: "#8fa7bf",
		3: "#5f6f7f",
		color: "#bfdfff",
		points: "#dfefff",
		locked: "#c4a7b3",
		background: "#001f3f",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
	},
	r: {
		1: "#ffcccc",
		2: "#ff6666",
		3: "#ff1a1a",
		color: "#ffcccc",
		points: "#ffcccc",
		locked: "#b30000",
		background: "#1f1f04",
		background_tooltip: "rgba(26, 10, 0, 0.75)",
	}
}
function changeTheme() {

	colors_theme = colors[options.theme || "default"];
	document.body.style.setProperty('--background', colors_theme["background"]);
	document.body.style.setProperty('--background_tooltip', colors_theme["background_tooltip"]);
	document.body.style.setProperty('--color', colors_theme["color"]);
	document.body.style.setProperty('--points', colors_theme["points"]);
	document.body.style.setProperty("--locked", colors_theme["locked"]);
}
function getThemeName() {
	return "CANNOT BE CHANGED"
}
function switchTheme() {
	changeTheme();
	resizeCanvas();
}

function backgroundHeat() {
    const heatRatio = toNumber(player.o.heat.div(player.o.maxHeat));
 // Set CSS attribute to Black if false
  if (heatRatio <= 0.5 || options.noHeatColor) {
	document.body.style.setProperty('--background', `black`);
	return;
   }	    
// Calculate alpha/opacity
  const opacity = Math.min(0.75, Math.max(0, 0.25 + 1 * (heatRatio - 0.5)));
  let edgeSize = Math.max(0, Math.min(50, 50 - (Math.max(0, heatRatio - 0.5)) * 100));


  const gradientCSS = `
	  radial-gradient(
		  ellipse at center,
		  black ${edgeSize}%,
		  rgba(255, 128, 0, ${opacity}) 100%
	  ),
	  linear-gradient(
		  to right,
		  black ${edgeSize}%,
		  rgba(255, 128, 0, ${opacity}) 100%
	  ),
	  linear-gradient(
		  to bottom,
		  black ${edgeSize}%,
		  rgba(255, 128, 0, ${opacity}) 100%
	  )
  `;
  
  document.body.style.setProperty('--background', gradientCSS);

}