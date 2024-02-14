
let modInfo = {
	name: "Math Tree",
	id: "mthprog",
	author: "ccon1416",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(10), // Used for hard resets and new players
	offlineLimit:24  //48h since upgrade rework ...
}

// Set your version in num and name
let VERSION = {
	num: "0.0.3",
	name: "Graduation I ",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3> v0.0.3 (fix) </h3><br>
	- Fixed a NaN when any layer passive generation is above 1.79e308x its gain </br>
	<h3>v0.0.3</h3><br>
	- Fixed some issue where localStorage would get flood too quick </br>
	- Upon reaching their respective achievement , Pre-Research layer will always be shown (available) </br>
	- Added 1 more semi 'layer' and new challenges (don't need to complete all) <br>
	- Most meta research upgrade cost are reduced<br>
	- Prevented softlock when entering any Exponent challenge with 0 Exponent <br>
	- More achievement content and reward<br>
	- Rebalanced some achievement to be much easier<br>
	- Removed default offline progress <br>
	- Rebalanced some tickspeed upgrade effect and cost <br>
	- Fixed various bug </br>
	- Endgame : Graduation unlocked (~38k Mastery)<br>
	<h3>v0.0.2</h3><br>
	- Algebric field part 1 is done.<br>
	- Reduced difficulty of verious resource and challenge.<br>
	- Improved GUI</br>
	- Endgame : 6,000 Mastery<br>

	<h3>v0.0.1</h3><br>
		- Added Some stuff.<br>
		- Endgame : 320 Mastery`

let winText = `Congratulations! You have reached the end of Graduation I .`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything","RandomArtifactID","RandomArtifactQuality","maxEffect","getArtifactEffect","DisplayArtifactEffect","DisplayUniqueArtifactEffect","updateArtifactEffect","updateAllAritfactEffect"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	//multiplier
	let gain = new Decimal(1).times(buyableEffect('m',11).max(1)).times(buyableEffect('al',33).max(1)).times(player.r.la1.max(1))
	if (hasUpgrade('n', 11) &&player.r.tetration.lt(9)) gain = gain.times(upgradeEffect('n',11))
	if (hasUpgrade('n', 12) &&player.r.tetration.lt(9)) gain = gain.times(upgradeEffect('n', 12))
	if (hasUpgrade('n', 13) &&player.r.tetration.lt(9)) gain = gain.times(upgradeEffect('n', 13))
	if (hasUpgrade('n', 14) &&player.r.tetration.lt(9)) gain = gain.times(1.2)
	if (hasUpgrade('n', 24)) gain = gain.times(1.2)
	if (hasUpgrade('a', 21) && !player.r.buyables[121].gte(1)) gain = gain.times(upgradeEffect('a', 21))
	if (hasChallenge('m', 11)) gain = gain.times(challengeEffect('m',11))
	if (player.d.unlocked) gain = gain.times(tmp.d.effect)
	if (player.e.unlocked) gain = gain.times(tmp.e.effect)
	if (hasUpgrade('m', 61)) gain = gain.times(5)
	if (hasUpgrade('n',31)) gain = gain.times(getPointCondensereffect_MUL())

	if (hasAchievement('ac',19)) gain = gain.times(2)

	//exponent
	let power = new Decimal(1)
	if (hasUpgrade('m', 42)) power = power.times(1.05)
	if (inChallenge('m', 11)) power = power.times(0.5)
	if (inChallenge('d',12)) power = power.times(5) 
	if (player.r.tetration.gt(0)) power = power.times(1.1)
	if (player.e.unlocked) power = power.times(tmp.e.expeffect)
	if (hasUpgrade('n', 11) &&player.r.tetration.gte(9)) power = power.times(upgradeEffect('n',11))
	if (hasUpgrade('n', 12) &&player.r.tetration.gte(9)) power = power.times(upgradeEffect('n', 12))
	if (hasUpgrade('n', 13) &&player.r.tetration.gte(9)) power = power.times(upgradeEffect('n', 13))
	if (hasUpgrade('n', 14) &&player.r.tetration.gte(9) && !player.r.buyables[121].gte(1)) power = power.times(1.01)
	if (inChallenge('r',11)) power = power.times(player.r.cha)
	if (hasUpgrade('n',31)) power = power.times(getPointCondensereffect_POW())

	if (inChallenge('d',12)) gain = gain.log(10)
 	let total = gain.pow(power)
	if (inChallenge('e',11)) total = total.min(player.n.points.pow(0.5))
	let exponentalreduction = new Decimal(0.25).times(player.points.max(10).log(10).pow(-0.1))
	if (inChallenge('e',12)) total = new Decimal(10).pow(total.max(10).log(10).pow(exponentalreduction))
	let sum = total.times(tmp.t.effect.times(0.001))

	if(inChallenge('d',13)) sum = sum.pow(0.2)
	if(inChallenge('d',13)) sum = sum.div(player.n.points.add(1))
	if(inChallenge('d',13)) sum = sum.min(player.n.points.pow(0.5).add(1))
	sum = sum.times(player.r.truegamespeed)
	return sum
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		return !player.r.truegamespeed.eq(1)?"Gamespeed : "+format(player.r.truegamespeed)+"x":""},
	function() {
		let a = player.t.tickspeedcontrol.eq(1)?"":" (^"+format(player.t.tickspeedcontrol)+")"

		if(!tmp.t.effect.eq(1000) && !inChallenge('al',11))
		return "Tickspeed : "+format(tmp.t.effect)+""+a
		if(inChallenge('al',11))
		return "Altered Tickspeed : "+format(tmp.t.effect)+""+a
		else 
		return ""
 		},
	function() {return !options.hidemastery?"Current Mastery : "+format(player.r.mastery)+" (Highest : "+format(player.r.bestmastery)+")":""},
	function() {
	if (options.hidemastery) 
	return ""
	if (!player.r.bestmastery.gte(100)) 
    return "Unlock Tickspeed Upgrade at 100 Best Mastery"
    if (!player.r.bestmastery.gte(308.25)) 
    return "Unlock field selector at 308.25 Best Mastery"
    if (!player.r.bestmastery.gte(10000)) 
    return "Unlock Meta-research resetting at 10000 Best Mastery"
	if (!player.r.bestmastery.gte(35000)) 
    return "Unlock something important at 35000 Best Mastery"
	if (!hasAchievement('ac',109))
    return "Complete remaining Meta research achievement to progress ..."
	else 
	return ""
		},
	function() {
		if(inChallenge('e',12)) 
		return "No Number challenge : Points gained is 10^log(gain)^"+format(new Decimal(0.25).times(player.points.max(10).log(10).pow(-0.1)),6)+""
	},
	function() {
		if(inChallenge('d',13)) 
		return "Chaotic Divisor challenge : "+format(player.points)+"/"+format(player.d.timereq)+" Points"
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.r.bestmastery.gte(38591)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	
}
