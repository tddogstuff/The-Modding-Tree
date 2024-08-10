// ************ Options ************
/** 
* just think it like a setting
**/
let options = {}

function getStartOptions() {
	return {
		autosave: true,
		msDisplay: "always",
		theme: "default",
		hqTree: false,
		offlineProd: true,
		hideChallenges: false,
		showStory: true,
		forceOneTab: false,
		oldStyle: false,
		tooltipForcing: true,
		earlyskip: 0, //disabled
		betatest: true, //disabled
		coloredtext: true,
		mixedsci:false,
		hidemastery:false,
		gamepaused:false,
		autoshift:false,
		instantcalculation:false,
		nerdy:true, //Resource breakdown
		discord:false, //disabled
		difficulty: d(1),
		popup: true,
		dev: false,
		subCurrency:false,
		heatPercentage:false,
		noHeatColor:true,
		flashingWarned:true,
		DD:'None', //Document display
		randomNumber:0,
		defaultFont:'monospace',
		unit: "Scientific",
	}
}
function toggleOpt(name) {
	if (name == "oldStyle" && styleCooldown > 0)
		return;

	options[name] = !options[name];
	if (name == "hqTree")
		changeTreeQuality();
	if (name == "oldStyle")
		updateStyle();
}
var styleCooldown = 0;
function updateStyle() {
	styleCooldown = 1;
	let css = document.getElementById("styleStuff");
	css.href = options.oldStyle ? "oldStyle.css" : "style.css";
	needCanvasUpdate = true;
}
function changeTreeQuality() {
	var on = options.hqTree;
	document.body.style.setProperty('--hqProperty1', on ? "2px solid" : "4px solid");
	document.body.style.setProperty('--hqProperty2a', on ? "-4px -4px 4px rgba(0, 0, 0, 0.25) inset" : "-4px -4px 4px rgba(0, 0, 0, 0) inset");
	document.body.style.setProperty('--hqProperty2b', on ? "0px 0px 20px var(--background)" : "");
	document.body.style.setProperty('--hqProperty3', on ? "2px 2px 4px rgba(0, 0, 0, 0.25)" : "none");
}
function toggleAuto(toggle) {
	Vue.set(player[toggle[0]], [toggle[1]], !player[toggle[0]][toggle[1]]);
	needCanvasUpdate=true
}

const MS_DISPLAYS = ["ALL", "LAST, AUTO, INCOMPLETE", "AUTOMATION, INCOMPLETE", "INCOMPLETE", "NONE"];

const MS_SETTINGS = ["always", "last", "automation", "incomplete", "never"];

const Unit = ["Scientific","Mixed scientific","Logarithm","Infinity","Blind"]
const DD1 = ["None","Play time","Current Mastery","Highest Mastery","Points","Update version","Gamespeed","Tickspeed","Real time","Random number"]
function DD() {
	options.DD = DD1[(DD1.indexOf(options.DD) + 1) % 10]
	if(options.DD === "Random number") {
		options.randomNumber = Math.floor(Math.random() * 101)
	}
	document.title = modInfo.name+" | "+updateDDdisplay()
	save()
}
function unit() {
	options.unit = Unit[(Unit.indexOf(options.unit) + 1) % Unit.length]
}
function updateDDdisplay() {
	switch (options.DD) {
		case "None":
		return "Disabling..."
		case "Play time":
		return "PT : "+formatTime(player.timePlayed)
		case "Current Mastery":
		return "Ma : "+format(player.r.mastery)
		case "Highest Mastery":
		return "bMa : "+format(player.r.bestmastery)
		case "Points":
		return format(player.points)+" Pts"
		case "Update version":
		return "v"+VERSION.num
		case "Gamespeed":
		return "GS : "+format(player.r.truegamespeed)+"x"
		case "Tickspeed":
		return "TS : "+format(tmp.t.effect)
		case "Real time":
		return "RTime : "+formatTime(player.o.realtime)
		case "Random number":
		return "Rolled a "+options.randomNumber
	}
}

function adjustMSDisp() {
	options.msDisplay = MS_SETTINGS[(MS_SETTINGS.indexOf(options.msDisplay) + 1) % 5];
}
function milestoneShown(layer, id) {
	complete = player[layer].milestones.includes(id);
	auto = layers[layer].milestones[id].toggles;

	switch (options.msDisplay) {
		case "always":
			return true;
			break;
		case "last":
			return (auto) || !complete || player[layer].lastMilestone === id;
			break;
		case "automation":
			return (auto) || !complete;
			break;
		case "incomplete":
			return !complete;
			break;
		case "never":
			return false;
			break;
	}
	return false;
}
// no testing for now ... 
function earlyskip() {
	if(options.earlyskip !== 0) {	
		options.earlyskip = options.earlyskip * 0
		for (let i = 0; i < 81; i++) {
			let j = i % 9 + 11 + Math.floor(i / 9) * 10
			player.ac.achievements = [...new Set(player.ac.achievements.concat(String(j)))]
		}
		player.r.bestmastery = new Decimal("36000")
		player.a.unlocked = true
		player.m.unlocked = true
		player.d.unlocked = true
		player.s.unlocked = true
		player.e.unlocked = true
		player.r.tetration = new Decimal(10)
		player.r.best = new Decimal(10)
		player.r.metaresearch = new Decimal(120)
		player.r.prestigetime = new Decimal("1e9")
		player.t.points = new Decimal("1e10")
		player.e.points = new Decimal(10)
		player.r.points = new Decimal(10)
		player.r.challengeshard = new Decimal(8)
		autobuyUpgrades('r')
	} else {
		alert("This feature is currently disabled!")
		/*if (!confirm("In order to skip to the end of Graduation 1 , you must WIPE your current save . Are you sure? (Click this again after wiping to skip progress)")) return
		player = null
		options.earlyskip = options.earlyskip + 1
		save(true);
		window.location.reload();*/
	}
	}
	function betatest() {
	/*	if(!options.betatest) {	
			if (!confirm("This feature is disabled")) return
			options.betatest = !options.betatest
			alert("You have unlocked the ability to Graduate")
			alert("You have unlocked Artifacts in Graduation")

		} else {
			if (!confirm("This will force a Graduation reset and wipe your artifact . IGNORE THE NaN , JUST REFRESH YOUR PAGE.")) return
			options.betatest = !options.betatest
			buyBuyable('g',15)
			save()
			window.location.reload()
		} */
		alert("This feature is currently disabled!")
		} 
	function mixedsci() {			
			options.mixedsci = !options.mixedsci
		} 
	function hidemastery() {			
			options.hidemastery = !options.hidemastery
		} 
	function gamepaused() {
			options.gamepaused = !options.gamepaused
	}
	function coloredtext() {
			options.coloredtext = !options.coloredtext
	}
	function autoshift() {
			shiftDown = false
			options.autoshift = !options.autoshift
	}
	function forcegraduation() {
		if(player.r.rank.eq(1)) {
			if(!confirm("Do you want to restart your current Graduation , which will reset everything you currently have?")) return
			buyBuyable('g',100)
		} if(player.r.rank.gte(2)) {
			if(!confirm("Do you want to restart your current Graduation , which will forces a Graduation reset without giving you Graduate . You may reselect graduation sacrifice if needed")) return
			buyBuyable('g',100)
		}
	}
	function nerdy() {
		options.nerdy = !options.nerdy
	}
	function discord() {
		options.discord = !options.discord
	}
	function popup1() {
		options.popup = !options.popup
	}
	function subCurrency() {
		options.subCurrency = !options.subCurrency
	}
	function heatPercentage() {
		options.heatPercentage = !options.heatPercentage
	}
	function noHeatColor() {
		options.noHeatColor = !options.noHeatColor
	}
	function flashingWarned() {
		if(!confirm("Flashing light warning : Background heat color contains Flashing light effect , Do you wish to proceed? (This warning will only show once)")) {
			options.noHeatColor = true
		} else {
			options.noHeatColor = false
		}
		options.flashingWarned = true
	}
	function changeFont() {
		showModal('[VERY UNSTABLE] Enter the default text font you want , which is applied partially and will apply anything , even invalid fonts','',{textBox:true,confirmButton:true,textColor:'red'},ChangeFont)
	}
	function ChangeFont() {
		  document.body.style.fontFamily = modal.textBox.value	
		}