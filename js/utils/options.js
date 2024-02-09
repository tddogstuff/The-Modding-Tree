// ************ Options ************

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
		earlyskip: 0,
		betatest: false,
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
function earlyskip() {
	if(options.earlyskip !== 0) {	
		options.earlyskip = options.earlyskip * 0
		alert("Look like you want to do it (1/5)");
		alert("You will receive the first 90 achievements (2/5)");
		player.ac.achievements = ['11','12','13','14','15','16','17','18','19','21','22','23','24','25','26','27','28','29','31','32','33','34','35','36','37','38','39','41','42','43','44','45','46','47','48','49','51','52','53','54','55','56','57','58','59','61','62','63','64','65','66','67','68','69','71','72','73','74','75','76','77','78','79','81','82','83','84','85','86','87','88','89','91','92','93','94','95','96','97','98','99','101','102','103','104','105','106','107','108','109']
		alert("and some starting resource (3/5)")
		player.r.bestmastery = new Decimal("36000")
		player.a.unlocked = true
		player.m.unlocked = true
		player.d.unlocked = true
		player.s.unlocked = true
		player.e.unlocked = true
		player.r.tetration = new Decimal(10)
		player.r.best = new Decimal(10)
		player.r.metaresearch = new Decimal(40)
		player.r.prestigetime = new Decimal("1e9")
		player.t.points = new Decimal("1e10")
		player.e.points = new Decimal(10)
		player.r.points = new Decimal(10)
		player.r.challengeshard = new Decimal(8)
		autobuyUpgrades('r')
		alert("Since you skip content . I'm not gonna explain anything else (4/5)")
		alert("Good luck! (5/5)")
	} else {
		if (!confirm("In order to skip to the end of Graduation 1 , you must WIPE your current save . Are you sure? (Click this again after wiping to skip progress)")) return
		player = null
		options.earlyskip = options.earlyskip + 1
		save(true);
		window.location.reload();
	}
	}
	function betatest() {
		if(!options.betatest) {	
			if (!confirm("You will be beta testing unstable feature or broken feature . Are you sure? ")) return
			options.betatest = !options.betatest
			alert("You have unlocked the ability to Graduate")
			alert("You have unlocked Artifacts in Graduation")

		} else {
			if (!confirm("This will force a Graduation reset and wipe your artifact . IGNORE THE NaN , JUST REFRESH YOUR PAGE.")) return
			options.betatest = !options.betatest
			buyBuyable('g',15)
			save()
			window.location.reload()
		}
		}