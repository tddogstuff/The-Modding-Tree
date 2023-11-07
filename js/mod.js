
let modInfo = {
	name: "Mathmatical Progression",
	id: "mthprog",
	author: "ccon1416",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)
	let gain = new Decimal(1).times(buyableEffect('m',11))
	if (hasUpgrade('n', 11)) gain = gain.times(2)
	if (hasUpgrade('n', 12)) gain = gain.times(upgradeEffect('n', 12))
	if (hasUpgrade('n', 13)) gain = gain.times(upgradeEffect('n', 13))
	if (hasUpgrade('n', 14)) gain = gain.times(1.2)
	if (hasUpgrade('n', 24)) gain = gain.times(1.2)
	if (hasUpgrade('a', 21)) gain = gain.times(upgradeEffect('a', 21))
	if (hasChallenge('m', 11)) gain = gain.times(challengeEffect('m',11))
	if (player.d.unlocked) gain = gain.times(tmp.d.effect)
	if (player.e.unlocked) gain = gain.times(tmp.e.effect)
	if (hasUpgrade('m', 61)) gain = gain.times(5)


	let power = new Decimal(1)
	if (hasUpgrade('m', 42)) power = power.times(1.05)
	if (inChallenge('m', 11)) power = power.times(0.5)
	if (inChallenge('d',12)) power = power.times(5)
	if (player.e.unlocked) power = power.times(tmp.e.expeffect)

	if (inChallenge('d',12)) gain = gain.log(10)
 	let total = gain.pow(power)
	if (inChallenge('e',11)) total = total.min(player.n.points.pow(0.5))
	let exponentalreduction = new Decimal(0.25).times(player.points.max(10).log(10).pow(-0.1))
	if (inChallenge('e',12)) total = new Decimal(10).pow(total.max(10).log(10).pow(exponentalreduction))
	return total.times(tmp.t.effect.times(0.001))
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {return "Current Tickspeed/s : "+format(tmp.t.effect)}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e4000"))
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
