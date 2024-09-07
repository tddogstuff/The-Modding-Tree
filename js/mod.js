
let modInfo = {
	name: "Math Tree",
	id: "mthprog",
	author: "ccon1416",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js","layers2.js","layers3.js","CursedRealm.js","Modal.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0), // Disabled by getStartPoints()
	offlineLimit:168  
}

// Set your version in num and name
let VERSION = {
	num: "0.0.4",
	name: "Graduation II (partial)",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3 style='color: red'> v0.0.4b - Graduation II additions </h3> <br>
	*** Addition : <br>
	- 12 Achievements <br>
	- Implemented <span style='color:yellow'>Bits tree</span> import/export <br>
	*** Balancing changes : <br>
	- Capped <span style='color:yellow'>'Tetration II' upgrade</span> effect to -400 raw Tetration <br>
	- <span style='color:yellow'>Realm sacrifice</span> requirement is decreased (1e1000 Operation => 1e850) <br>
	- <span style='color:yellow'>Tickspeed sacrifice</span> bar fill 5x faster <br>
	- <s> <span style='color:yellow'>Achievement 141 'A brutal world'</span>  give a static +1 conditional Graduate instead </s> : Reverted <br>
	- Completing post Graduation <span style='color:yellow'>achievement</span> grant additional reward <br>
	- <span style='color:lime'>Algebric</span> buyable cost now increase faster above 1e500 <br>
	- <span style='color:lime'>Algebric points boost</span> is now weakened again above 1e500x <br>
	- Nerfed <span style='color:yellow'>Charm artifact</span> effect <span style='color:pink'>'Exponent cost scaling reduction'</span> , Max effect : 80% => 20% <br>
	- Nerfed <span style='color:yellow'>Charm artifact</span> effect <span style='color:yellow'>'Tickspeed'</span> , max effect : ^1.50 => ^1.25 <br>
	- Buffed <span style='color:yellow'>Charm artifact</span> effect <span style='color:yellow'>'Gamespeed'</span> , 'Prestige time' , max effect : 10x => 25x , 30x respectively <br>
	- Buffed <span style='color:yellow'>Ring artifact</span> Effect <span style='color:yellow'>'Twilight generator strength'</span> , max effect : 1.75x => 2x <br>
	- Buffed <span style='color:yellow'>Ring artifact</span> Effect <span style='color:magenta'>'Improvement effect' , 'Point boost effect'</span> , max effect : ^1.2 => ^1.25 <br>
	- Buffed <span style='color:yellow'>Ring artifact</span> Effect <span style='color:magenta'>'Additive/Subtractive/Exponent cost reduction'</span> , max effect : ^4 => ^2 <br>
	- Reduce the cost of the first Bits tree perk (Exponent cost reduction) from 17 => 15 <br>
	- <s><span style='color:yellow'>Tetration sacrifice</span> reward removed</s> , renamed to <span style='color:yellow'>Herbivore sacrifice</span><br>
	*** Fixed : <br>
	- Fixed Graduation milestone 1 and 2 not working <br>
	- Fixed features that haven't been unlocked , being displayed <br>
	*** Others : <br>
	- Fixed typos (x3) <br>
	- Reduced text wall (x2) <br>
	- Make <span style='color:purple'>'Operationless'</span> and <span style='color:pink'>Operation from Mastery</span> not display insanely high number , <span style='color:green'>'Operation'</span> remains unchanged<br>
	- <span style='color:#ffdead'>'Ticks'</span> layer color is now warmer (more orange) ; <span style='color:#ffdead'>'Graduation'</span> layer color is now cooler (more blue)<br>
	- Added a slight <span style='color:purple'>shadow</span> to colored text<br>
	- <span style='color:purple'>'Research'</span> hotkey is now shift+H<br>
	- Tweaked number inverting e.x 2e-10 will become 1/(5e10) <br>
	- Having the <span style='color:purple'>'Operationless' upgrade</span>  set the cost of <span style='color:orange'>'Mathmatical Operation' upgrade</span>  to 0<br>
	*** Endgame : <span style='color:magenta'>Cursed realm</span> unlock<br>
	<h3 style='color: orange'> v0.0.4a - Graduation I balancing </h3> <br>
	*** Reminder : <br>
	- Some part of Graduation II is available <br>
	*** Balancing changes : <br> 
	- Tickspeed upgrade is unlocked at 5 best Mastery instead of 100 <br>
	- Modified Ticks gain formula below 100 Mastery <br>
	- Changed achievements layer tooltip to display the amount of completed achievements , secret achievements<br>
	- Improved 'Point boost' buyable autobuyer <br>
	- Rebalanced some Achievements goal/rewards<br><i>
	- If you haven't unlocked both Additive or Subtractive yet , 1 of their upgrade costs nothing <br>
	- Subtractive Upg12 "Negative to Postive" , renamed to "Postive synergy" , now based on Additive instead<br>
	- Subtractive Upg21 "Faster automation" effect squared<br>
	- 'Points boost' effect nerfed above 1e1000x <br>
	- Additive/Subtractive cost scaling is now linearly <br>
	- Multiplicative Upg23 "Automatic Division" effect scale slightly better <br> 
	- Perk power mechanic completely scrapped  , now increase over time <br>
	- Added a Perk power interval to deal with the new mechanic and another upgrade <br>
	- Exponent perks will scale based on Perk power and no longer require purchases <br>
	- Research Tickspeed bonus formula immensely improved for higher Research amount <br>
	- Research QOL Upg24 "Effortless Research" effect replaced , make Research Tickspeed bonus formula increase another 10% more <br>
	- Improved all Twilight perk reward scaling <br>
	- Improvement is now unlocked at 3 Research instead of 1<br>
	- While Altered , lowered the primary goal for 'Chaotic division' from 1e30 => 1e26 <br>
	- Increase the cost scaling of Twilight strength after level 100<br>
	- The Row1 - Row2 autobuyer from Research milestone 3 (3 Research) is pushed to Research milestone 4 (4 Research) <br> 
	- Energy effect is slightly stronger <br>
	- Extension mastery is reduced massively above 4.00x Multiplier , at around 1e100 (10 Tt) Extension <br>
	- Extension upgrade "Stronger variable" effect is stronger every 1e30 Extension (1 No) , strength boost diminish greatly after 1e300 Extension <br>
	- Operation is no longer affected by Algebric failure challenge modifier <br>
	- All Meta-research challenge modifier penality is readjusted <br>
	- Gamespeed (permeant) research base boost severely weakened (+0.2 instead of +1)<br>
	- Gamespeed (permeant) research requires more <br>
	- Increasing 'offline time conversion' cost by a lot , max level by another 15 , effect by /2.5 , become additive instead (This cannot be maxed realistically)<br>
	- Real time conversion starts at 0% , instead of 25% <br>
	- Tickspeed is capped at 1e1000 for now <br>
	- After a certain point , preResearch resource will be corrupted , either lowering resource gain/cost more <br>
	- The old layer 'softcap' were reworked into corruption , and no longer reduce their gain Exponent <br>
	- Most of Meta-research QOL upgrade cost is immensely increased <br>
	- 'Chaotic division' challenge secondary now scale less , become multiplicative x1.1 bonus instead <br> 
	- Graduation : Normal task 5 require lower Tickspeed threshold (1e200 => 1e160) <br>
	- Graduation : Normal task 9 require less Prestige time (10 years => 8 years) <br> 
	- Graduation : Altered task 5 require reduced Number (1e1250 => 1e1175) <br> 
	*** Bug fixed : <br>
	- Fixed being able to obtain the second row of Ticks upgrade without unlocking Improvement , they now require Altered realm entry <br>
	- Fixed 'Chaotic division' challenge NaN where one of the divisor (Number/Points) were 0 <br>
	- Fixed Research not display its Mastery bonuses <br>
	- Fixed Ach86 'Altered exponent' NOT giving any effect , in return reducing its effect <br>
	- Fixed Multiplicative challenge "Fatigued" still require 1B (1e9) Number regardless of any external modifier <br>
	- Fixed being able to Meta-reset in Altered realm , unless overridden by other features <br>
	- Fixed Algebric can still be gained before the 5s or 1s cooldown expired <br>
	- Fixed twilight (the resource) being affect less by the 10 Tetration reward (square rooted) <br>
	- Attempted a fix for major challenge where some resources still being retain post reset <br>
	- Multiplicative Upg13 'Glazed points' now properly autobuy additive & subtractive (inside Altered realm)<br>
	*** Added features : <br>
	- (Mostly) Colorful tooltip <br>
	- Most upgrade/buyable tooltip should be a lot better now <br>
	- Make 'Addition' upgrade tooltip more clear<br>
	- Using Gamespeed time-speedup from Research or Offline time will give +0.5 Heat per 1x speedup <br>
	- IF you have a heat amount equal or exceed half of your max , the game will run progressively slower <br>
	- You can hold any reset layer button to attempt resetting around 20 times per second<br>
	- Additional settings for some QOL features <br>
	- Added 10 'offline time conversion' upgrade that add +1% to real time conversion each <br>
	- hold [shift] to make all popup disappear 10x faster (0.3s afterward) or disable them entirely with a setting<br>
	- Added missing hotkey for MR , Tetration reset <br>
	- A reset number button , for 'Chaotic division' challenge <br>
	- Organized information display by requiring [shift] or [ctrl] press/hold <br>
	- Tried coloring text , most of them (can be disabled in settings) <br>
	- Added a rough estimate for next resource requirement for static resources <br>
	- Static layers autobuyer are faster (Experimental) <br>
	- Added an auto shift options <br>
	- Added secret achievements that mostly does nothing<br>
	- <i>There are some secret achievements that unlock some little stuff , which is not needed <br>
	*** Other : <br>
	- All existing challenge button will no longer show 'Finished' <br>
	- Challenge background is color-coded : Black for incomplete , Yellow for goal reached , Green for completed   <br>
	- Fixed Meta-research resets being displayed instead of Meta-resets , causing confusion  <br> 
	- Different achievement display , per page instead <br>
	- Drastically improved Resource calculation text to actually useable <br>
	- All references of Exponent cost scaling is replaced by Exponent cost scaling base<br>
	- 'Worsen condition' challenge description changed , to be better <br>
	- Most buyable have better tooltip<br>
	- You can now buy additive/subtractive beyond their cost scaling using their respective hotkey <br>
	*** Endgame : <br>
	- Endgame : not possible this patch<br>
	*** Planet? : <br>
	- It's a placeholder , currently does nothing yet  <br>
	<h3> v0.0.3 (fix) </h3><br>
	- Fixed a endgame Infinite bug if any layer's passive generation is above 1.79e308x its gain </br>
	<h3>v0.0.3</h3><br>
	- Fixed some issue where localStorage would get flood too quick </br>
	- Upon reaching their respective achievement , Pre-Research layer will always be shown (available) </br>
	- Added 1 more semi 'layer' and new challenges <br>
	- Most meta research upgrade cost are reduced<br>
	- Prevented entering any Exponent challenge with no Exponent <br>
	- More achievement content and reward<br>
	- Rebalanced some achievement to be much easier<br>
	- Removed default offline progress <br>
	- Rebalanced some tickspeed upgrade effect and cost <br>
	- Fixed various bug </br>
	- Endgame : Graduation unlocked (~38k Mastery)<br>
	<h3>v0.0.2</h3><br>
	- Algebric field part 1 is done.<br>
	- Reduced difficulty of various resource and challenge.<br>
	- Improved GUI</br>
	- Endgame : 6,000 Mastery<br>

	<h3>v0.0.1</h3><br>
		- Added Some stuff.<br>
		- Endgame : 320 Mastery`

let winText = `You have reached Cursed Realm (current Endgame)`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything","backgroundHeat"]
/** 
* Get the player's starting points , use for reset row 1+ or hard resets 
**/
function getStartPoints(){
    let base = new Decimal(10)
	return base
}

/** 
* Should the points/sec be shown 
**/
function canGenPoints(){
	return !(player.g.timer2.lte(0.5) || player.r.timer2.lte(0.5)) && !inChallenge('c',11)
}

/** 
* Current points gain in a real-life second
**/
function getPointGen() {
	let gain = getMult()
	let power = getExp()
 	let total = gain.pow(power)

	if(inChallenge('e',13)) total = total.add(10).log(10).tetrate(1.5)
	if(inChallenge('e',11)) total = total.min(player.n.points.pow(0.5))
	if(inChallenge('e',12)) total = new Decimal(10).pow(total.max(10).log(10).pow(new Decimal(0.25).times(player.points.max(10).log(10).pow(-0.1))))

	let sum = total.times(tmp.t.effect.div(1000).min(player.t.cap)) //Tickspeed

	if(inChallenge('d',13)) sum = sum.div(player.n.points.add(1))
	if(inChallenge('d',13)) sum = sum.min(player.n.points.pow(0.5).add(1))

	sum = sum.times(player.r.truegamespeed) //Gamespeed
	return sum
}
/** 
* Points gain multiplier
**/
function getMult() {
	//multiplier
	let gain = new Decimal(1)

	if (hasUpgrade('n', 11) &&player.r.tetration.lt(9)) gain = gain.times(upgradeEffect('n',11))
	if (hasUpgrade('n', 12) &&player.r.tetration.lt(9)) gain = gain.times(upgradeEffect('n', 12))
	if (hasUpgrade('n', 13) &&player.r.tetration.lt(9)) gain = gain.times(upgradeEffect('n', 13))
	if (hasUpgrade('n', 14) &&player.r.tetration.lt(9)) gain = gain.times(1.2)
	if (hasUpgrade('n', 24)) gain = gain.times(1.2)
	if (hasUpgrade('a', 21) && !player.r.buyables[121].gte(1)) gain = gain.times(upgradeEffect('a', 21))
	if (player.m.unlocked) gain = gain.times(buyableEffect('m',11).max(1))
	if (hasChallenge('m', 11)) gain = gain.times(challengeEffect('m',11))
	if (player.d.unlocked) gain = gain.times(tmp.d.effect)
	if (player.e.unlocked) gain = gain.times(tmp.e.effect)
	if (buyableEffect('al',33).neq(1)) gain = gain.times(buyableEffect('al',33).max(1))
	if (player.r.lightadd.neq(0)) gain = gain.times(player.r.la1.max(1))
	if (hasUpgrade('m', 61)) gain = gain.times(5)
	if (hasUpgrade('n',31)) gain = gain.times(getPointCondensereffect_MUL())
	if (hasAchievement('ac',19)) gain = gain.times(2)
	if (inChallenge('d',12)) gain = gain.log(10)
	if (inChallenge('al',11) && player.g.s4best.gte(3)) gain = gain.log(10)

	if(player.g.sacrificeactive[7].gte(1)) gain = new Decimal(1)	
	return gain
}
/** 
* Points gain exponentation
**/
function getExp() {
	//exponent
	let power = new Decimal(1)

	if (hasUpgrade('m', 43)) power = power.times(1.05)
	if (inChallenge('m', 11)) power = power.times(0.5)
	if (inChallenge('d',12)) power = power.times(5) 
	if (inChallenge('al',11) && player.g.s4best.gte(3)) power = power.times(125)
	if (player.r.tetration.gt(0)) power = power.times(1.1)
	if (player.e.unlocked) power = power.times(tmp.e.expeffect)
	if(hasSuperAchievement('ac',19)) power = power.times(1.02)
	if (hasUpgrade('n', 11) &&player.r.tetration.gte(9)) power = power.times(upgradeEffect('n',11))
	if (hasUpgrade('n', 12) &&player.r.tetration.gte(9)) power = power.times(upgradeEffect('n', 12))
	if (hasUpgrade('n', 13) &&player.r.tetration.gte(9)) power = power.times(upgradeEffect('n', 13))
	if (hasUpgrade('n', 14) &&player.r.tetration.gte(9) && !player.r.buyables[121].gte(1)) power = power.times(1.01)
	if (inChallenge('r',11)) power = power.times(player.r.cha)
	if (hasUpgrade('n',31)) power = power.times(getPointCondensereffect_POW())
	if (hasUpgrade('n',52)) power = power.times(buyableEffect('n',11))
	if (inChallenge('d',13)) power = power.div(5)
	if (true) power = power.times(player.g.timer.min(600).div(600))
	
	if(player.g.sacrificeactive[7].gte(1)) power = new Decimal(1)
	return power
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		let a = player.t.tickspeedcontrol.eq(1)?"":"  "+Qcolor2('d',"(^"+format(player.t.tickspeedcontrol)+")")+""
		let b = tmp.t.effect.gte(player.t.cap)?!shiftDown?" "+Qcolor2('d',''+format(player.t.cap)+'')+"":" "+Qcolor2('la',format(tmp.t.effect))+"":" "+Qcolor2('la',format(tmp.t.effect))+""
		let c = ""
		if(!(!tmp.t.effect.eq(1000) || hasAchievement('ac',39)) && !inChallenge('al',11)) c = ""
		else c = " Tickspeed :"+b+" "+a+""
		let d = !player.r.truegamespeed.eq(1)?" Gamespeed : "+Qcolor2('n',format(player.r.truegamespeed)+"x"):""
		let m = '' 
		m += c
		if(c !== '' && d!== '') m += ' / '
		m += d
		if(inChallenge('c',11)) m = d
		return "<h4>"+m
	},
	function() {return !options.hidemastery&&!inChallenge('c',11)?"<h4>Current Mastery : "+Qcolor2('e',format(player.r.mastery))+" (Highest : "+Qcolor2('r',format(player.r.bestmastery))+")":""},
	function() {
	if (options.hidemastery) 
	return ""
	if (!player.r.bestmastery.gte(5)) 
    return "<h4>Unlock Tickspeed Upgrade at 5 Best Mastery"
    if (!player.r.bestmastery.gte(308.25)) 
    return "<h4>Unlock another (non-reset) layer at 308.25 Best Mastery"
	if (!player.r.bestmastery.gte(1000)) 
    return "<h4>Unlock Warp bundle at "+format(1000)+" Best Mastery"
    if (!player.r.bestmastery.gte(10000)) 
    return "<h4>Unlock Meta-research resetting at "+format(10000)+" Best Mastery"
	if (!player.r.bestmastery.gte(35000)) 
    return "<h4>Unlock something at "+format(35000)+" Best Mastery and 80 Total achievements completions"
	if (!hasAchievement('ac',109))
    return "<h4>Get 80 achievements first"
	if (player.g.rank.eq(1))
	return "<h4>Complete all of your Graduation tasks"
	else 
	return ""
		},
	function() {
		if(inChallenge('e',12)) 
		return "<h4>No Number challenge : Points gain is 10^log(gain)^"+Qcolor2('d',format(new Decimal(0.25).times(player.points.max(10).log(10).pow(-0.1)),6))+""
	},
	function() {
		if(inChallenge('d',13)) 
		return "<h4>Chaotic Divisor challenge : "+format(player.points)+"/"+format(player.d.timereq)+" Points for "+Qcolor2('a',"x1.1 Prestige Time gain")+""
	},
	function() {
		if(inChallenge('d',12) && inChallenge('al',11) && player.g.rank.eq(1)) 
		return "<h4>Worsen condition challenge : "+format(player.points.sub(10))+"/"+format(d("3.16e10").pow(0.0000001).times(10).sub(10))+" points"
	},
	function() {
		if(player.g.timer.lt(600)) 
		return "<h4>Graduation : Points gain and Tickspeed is currently raised to ^"+format(player.g.timer.div(600),4)+""
	},
	function() {
		if(player.r.c10.eq(0)) return
		switch (toNumber(player.r.c10)) {
			case 1:
				return "<h4>Challenge sacrifice : You can only gain Number (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 2: 
				return "<h4>Challenge sacrifice : You can only gain Additive (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 3:
				return "<h4>Challenge sacrifice : You can only gain Subtractive (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 4: 
				return "<h4>Challenge sacrifice : You can only gain Multiplicative (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 5:
				return "<h4>Challenge sacrifice : You can only gain Divisive (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 6: 
				return "<h4>Challenge sacrifice : You can only gain Exponent (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 7:
				return "<h4>Challenge sacrifice : You can only gain Perk Power (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 8: 
				return "<h4>Challenge sacrifice : You can only gain Research (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 9:
				return "<h4>Challenge sacrifice : You can only gain Prestige time (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 10: 
				return "<h4>Challenge sacrifice : You can only gain Meta-research (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 11:
				return "<h4>Challenge sacrifice : You can only gain Light additive (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 12: 
				return "<h4>Challenge sacrifice : You can only gain Dark subtractive (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 13:
				return "<h4>Challenge sacrifice : You can only gain Twilight (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 14: 
				return "<h4>Challenge sacrifice : You can only gain Energy (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			case 15:
				return "<h4>Challenge sacrifice : You can only gain Tetration (Changing in "+formatTime((player.g.timer2.div(60).ceil().sub(player.g.timer2.div(60))).times(60))+")"
			default:
				break;
		}
	},
	function() {
		let current = player.o.heat
		let difference = player.o.heating.sub(player.o.cooling)	
		if(current.eq(0)) return
		let max = player.o.maxHeat
		let hue = toNumber(d(d(100).sub(d(current).div(d(max)))).times(120))
		let sat = 100
		let light = 50 
		if(!options.heatPercentage) return `<h4 style='color:hsl(${hue},${sat}%,${light}%)'>${format(current)}/${format(max)} Heat (${format(difference)}/s)</h4>`
		else return `<h4 style='color:hsl(${hue},${sat}%,${light}%)'>${format(current/max*100)}% Heat (${format(difference/max*100)}%/s)</h4>`
	},
	function() {
		let len = pastTickTimes.length
		if (len <= 1) return "<h4>Avg ms/ticks : ?? (Peak : ?? ms/ticks)"
		let a = 0
		let b = 0
		for (i = 0; i < len; i++){
			a += pastTickTimes[i]
			b = Math.max(b , pastTickTimes[i])
		}

		let val = Math.round(a/len)

		if(options.dev) return "<h4>Avg ms/tick : "+ format(val,0) + " (Peak : "+format(b,0)+" ms/tick)"
	},
]

// Determines when the game "ends"
// it's not possible right now
function isEndgame() {
	return false
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
// Note : This is for devSpeed (which is removed) , not Gamespeed , which is accounted for when calculating resource
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	if(true) {
		player.g.artifact1eff = getArtifactEffect(player.g.artifact1,player.g.artifact1q)
		player.g.artifact2eff = getArtifactEffect(player.g.artifact2,player.g.artifact2q)
		player.g.artifact3eff = getArtifactEffect(player.g.artifact3,player.g.artifact3q)
		player.g.artifact4eff = getArtifactEffect(player.g.artifact4,player.g.artifact4q)

		AllArtifactEffect()
		updateAllAritfactEffect()

		delete player.g.artifactstorage1
		delete player.g.artifactstorage2
		delete player.g.artifactstorage3
		delete player.g.artifactstorage4
		delete player.g.artifactstorage5
		delete player.g.generated
		delete player.t.accelerationMultiplier
		delete player.t.accelerationPurchase
		delete player.t.purchaseMultiplier
		delete player.t.crystal
		delete player.t.generatorAmount
		delete player.t.generatorPurchased
		delete player.t.generatorMultiplier
		delete player.t.generatorMultiplier1
		delete player.t.generatorProduction
		delete player.t.crystalEffect

	}
	
	if(oldVersion <= "0.0.4" && options.hidemastery) {
		options.hidemastery = false
		showModal('Your save had Hide Mastery option enabled prior to v0.0.4 , which is now been disabled')
	}
}
