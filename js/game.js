var player;
var needCanvasUpdate = true;
var backgroundHeatUpdate = true;
var playTimeUpdate = true;

// Don't change this
const TMT_VERSION = {
	tmtNum: "2.6.6.2",
	tmtName: "Fixed Reality"
}
/** 
* Retrieve how much resources gain in a reset
**/
function getResetGain(layer, useType = null) {
	let type = useType
	if (!useType){ 
		type = tmp[layer].type
		if (layers[layer].getResetGain !== undefined)
			return layers[layer].getResetGain()
	} 
	if(tmp[layer].type == "none")
		return new Decimal (0)
	if (tmp[layer].gainExp.eq(0)) return decimalZero
	if (type=="static") {
		if ((!tmp[layer].canBuyMax) || tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalOne
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).div(tmp[layer].gainMult).max(1).log(tmp[layer].base).times(tmp[layer].gainExp).pow(Decimal.pow(tmp[layer].exponent, -1))
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().sub(player[layer].points).add(1).max(1);
	} else if (type=="normal"){
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return decimalZero
		let gain = tmp[layer].baseAmount.div(tmp[layer].requires).pow(tmp[layer].exponent).times(tmp[layer].gainMult).pow(tmp[layer].gainExp)
		if (gain.gte(tmp[layer].softcap)) gain = gain.pow(tmp[layer].softcapPower).times(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower)))
		gain = gain.times(tmp[layer].directMult)
		return gain.floor().max(0);
	} else if (type=="custom"){
		return layers[layer].getResetGain()
	} else {
		return decimalZero
	}
}
/** 
* Calculate the amount of prior resource to gain n of that resource
**/
function getNextAt(layer, canMax=false, useType = null) {
	let type = useType
	if (!useType) {
		type = tmp[layer].type
		if (layers[layer].getNextAt !== undefined)
			return layers[layer].getNextAt(canMax)

		}
	if(tmp[layer].type == "none")
		return new Decimal (Infinity)

	if (tmp[layer].gainMult.lte(0)) return new Decimal(Infinity)
	if (tmp[layer].gainExp.lte(0)) return new Decimal(Infinity)

	if (type=="static") 
	{
		if (!tmp[layer].canBuyMax) canMax = false
		let amt = player[layer].points.plus((canMax&&tmp[layer].baseAmount.gte(tmp[layer].nextAt))?tmp[layer].resetGain:0).div(tmp[layer].directMult) 
		let extraCost = Decimal.pow(tmp[layer].base, amt.pow(tmp[layer].exponent).div(tmp[layer].gainExp)).times(tmp[layer].gainMult) 
		let cost = extraCost.times(tmp[layer].requires).max(tmp[layer].requires)
		if (tmp[layer].roundUpCost) cost = cost.ceil()
		return cost;
	} else if (type=="normal"){
		let next = new Decimal(tmp[layer].resetGain).add(1).div(tmp[layer].directMult)
		if (next.gte(tmp[layer].softcap)) next = next.div(tmp[layer].softcap.pow(decimalOne.sub(tmp[layer].softcapPower))).pow(decimalOne.div(tmp[layer].softcapPower))
		next = next.root(tmp[layer].gainExp).div(tmp[layer].gainMult).root(tmp[layer].exponent).times(tmp[layer].requires).max(tmp[layer].requires)
		if (tmp[layer].roundUpCost) next = next.ceil()
		return next;
	} else if (type=="custom"){
		return layers[layer].getNextAt(canMax)
	} else {
		return decimalZero
	}}
/** 
* Normal softcap 
**/
function softcap(value, cap, power ) {
	if (value.lte(cap)) return value
	else
		return value.pow(power).times(new Decimal(cap).pow(decimalOne.sub(power)))
}
/** 
* Exponental softcap
**/
function softcap2(value , cap , power) {
	if (value.lte(cap)) return value
	else 
		return cap.times(new Decimal(10).pow(value.div(cap.max(1)).max(1).log(10).pow(power)))
}
// Return true if the layer should be highlighted. By default checks for upgrades only
function shouldNotify(layer) {
	for (id in tmp[layer].upgrades){
		if (isPlainObject(layers[layer].upgrades[id])){
			if (canAffordUpgrade(layer, id) && !hasUpgrade(layer, id) && tmp[layer].upgrades[id].unlocked){
				if(layer === 't' && (id === '42' || id === '43')) return false
				else return true
			}
		}
	}
	if (player[layer].activeChallenge && canCompleteChallenge(layer, player[layer].activeChallenge)) {
		return true
	}

	if (tmp[layer].shouldNotify)
		return true

	if (isPlainObject(tmp[layer].tabFormat)) {
		for (subtab in tmp[layer].tabFormat){
			if (subtabShouldNotify(layer, 'mainTabs', subtab)) {
				tmp[layer].trueGlowColor = tmp[layer].tabFormat[subtab].glowColor || defaultGlow

				return true
			}
		}
	}


	for (family in tmp[layer].microtabs) {
		for (subtab in tmp[layer].microtabs[family]){
			if (subtabShouldNotify(layer, family, subtab)) {
				tmp[layer].trueGlowColor = tmp[layer].microtabs[family][subtab].glowColor
				return true
			}
		}
	}
	 
	return false
	
}

function canReset(layer)
{	
	if (layers[layer].canReset!== undefined)
		return run(layers[layer].canReset, layers[layer])
	else if(tmp[layer].type == "normal")
		return tmp[layer].baseAmount.gte(tmp[layer].requires)
	else if(tmp[layer].type== "static")
		return tmp[layer].baseAmount.gte(tmp[layer].nextAt) 
	else 
		return false
}

function rowReset(row, layer) {
	for (lr in ROW_LAYERS[row]){
		if(layers[lr].doReset) {
			if (!isNaN(row)) Vue.set(player[lr], "activeChallenge", null) // Exit challenges on any row reset on an equal or higher row
			run(layers[lr].doReset, layers[lr], layer)
		}
		else
			if(tmp[layer].row > tmp[lr].row && !isNaN(row)) layerDataReset(lr)
	}
}
/** 
* Reset the layer data , like buyables/clickables/challenge/upgrades , etc
**/
function layerDataReset(layer, keep = []) {
	let storedData = {unlocked: player[layer].unlocked, forceTooltip: player[layer].forceTooltip, noRespecConfirm: player[layer].noRespecConfirm, prevTab:player[layer].prevTab} // Always keep these

	for (thing in keep) {
		if (player[layer][keep[thing]] !== undefined)
			storedData[keep[thing]] = player[layer][keep[thing]]
	}

	Vue.set(player[layer], "buyables", getStartBuyables(layer))
	Vue.set(player[layer], "clickables", getStartClickables(layer))
	Vue.set(player[layer], "challenges", getStartChallenges(layer))
	Vue.set(player[layer], "grid", getStartGrid(layer))

	layOver(player[layer], getStartLayerData(layer))
	player[layer].upgrades = []
	player[layer].milestones = []
	player[layer].achievements = []

	for (thing in storedData) {
		player[layer][thing] =storedData[thing]
	}
}



function addPoints(layer, gain) {
	player[layer].points = player[layer].points.add(gain).max(0)
	if (player[layer].best) player[layer].best = player[layer].best.max(player[layer].points)
	if (player[layer].total) player[layer].total = player[layer].total.add(gain)
}

function generatePoints(layer, diff) {
	addPoints(layer, tmp[layer].resetGain.times(diff).times(tmp[layer].passiveGeneration))
}
//return the amount of resource generated in a second
function generateAmount(layer) {
	return new Decimal(tmp[layer].resetGain).times(tmp[layer].passiveGeneration)
}

function doReset(layer, force=false) {
	if (tmp[layer].type == "none") return
	let row = tmp[layer].row
	if (!force) {
		
		if (tmp[layer].canReset === false) return;
		
		if (tmp[layer].baseAmount.lt(tmp[layer].requires)) return;
		let gain = tmp[layer].resetGain
		if (tmp[layer].type=="static") {
			if (tmp[layer].baseAmount.lt(tmp[layer].nextAt)) return;
			gain =(tmp[layer].canBuyMax ? gain : 1)
		} 


		if (layers[layer].onPrestige)
			run(layers[layer].onPrestige, layers[layer], gain)
		
		addPoints(layer, gain)
		updateMilestones(layer)
		updateAchievements(layer)

		if (!player[layer].unlocked) {
			player[layer].unlocked = true;
			needCanvasUpdate = true;

			if (tmp[layer].increaseUnlockOrder){
				lrs = tmp[layer].increaseUnlockOrder
				for (lr in lrs)
					if (!player[lrs[lr]].unlocked) player[lrs[lr]].unlockOrder++
			}
		}
	
	}

	if (run(layers[layer].resetsNothing, layers[layer])) return
	tmp[layer].baseAmount = decimalZero // quick fix


	for (layerResetting in layers) {
		if (row >= layers[layerResetting].row && (!force || layerResetting != layer)) completeChallenge(layerResetting)
	}

	player.points = (row == 0 ? decimalZero : getStartPoints())

	for (let x = row; x >= 0; x--) rowReset(x, layer)
	for (r in OTHER_LAYERS){
		rowReset(r, layer)
	}
	updateTemp()
	updateTemp()
}

function resetRow(row) {
	if (prompt('Are you sure you want to reset this row? It is highly recommended that you wait until the end of your current run before doing this! Type "I WANT TO RESET THIS" to confirm')!="I WANT TO RESET THIS") return
	let pre_layers = ROW_LAYERS[row-1]
	let layers = ROW_LAYERS[row]
	let post_layers = ROW_LAYERS[row+1]
	rowReset(row+1, post_layers[0])
	doReset(pre_layers[0], true)
	for (let layer in layers) {
		player[layer].unlocked = false
		if (player[layer].unlockOrder) player[layer].unlockOrder = 0
	}
	player.points = getStartPoints()
	updateTemp();
	resizeCanvas();
}

function startChallenge(layer, x) {
	let enter = false
	if (!player[layer].unlocked || !tmp[layer].challenges[x].unlocked) return
	if (player[layer].activeChallenge == x) {
		completeChallenge(layer, x)
		Vue.set(player[layer], "activeChallenge", null)
		} else {
		enter = true
	}	
	doReset(layer, true)
	if(enter) {
		Vue.set(player[layer], "activeChallenge", x)
		run(layers[layer].challenges[x].onEnter, layers[layer].challenges[x])
	}
	updateChallengeTemp(layer)
	player.points = getStartPoints()
}

function canCompleteChallenge(layer, x)
{
	if (x != player[layer].activeChallenge) return
	let challenge = tmp[layer].challenges[x]
	if (challenge.canComplete !== undefined) return challenge.canComplete

	if (challenge.currencyInternalName){
		let name = challenge.currencyInternalName
		if (challenge.currencyLocation){
			return !(challenge.currencyLocation[name].lt(challenge.goal)) 
		}
		else if (challenge.currencyLayer){
			let lr = challenge.currencyLayer
			return !(player[lr][name].lt(challenge.goal)) 
		}
		else {
			return !(player[name].lt(challenge.goal))
		}
	}
	else {
		return !(player.points.lt(challenge.goal))
	}

}

function completeChallenge(layer, x) {
	var x = player[layer].activeChallenge
	if (!x) return
	
	let completions = canCompleteChallenge(layer, x)
	if (!completions){
		Vue.set(player[layer], "activeChallenge", null)
		run(layers[layer].challenges[x].onExit, layers[layer].challenges[x])
		return
	}
	if (player[layer].challenges[x] < tmp[layer].challenges[x].completionLimit) {
		needCanvasUpdate = true
		player[layer].challenges[x] += completions
		player[layer].challenges[x] = Math.min(player[layer].challenges[x], tmp[layer].challenges[x].completionLimit)
		if (layers[layer].challenges[x].onComplete) run(layers[layer].challenges[x].onComplete, layers[layer].challenges[x])
	}
	Vue.set(player[layer], "activeChallenge", null)
	run(layers[layer].challenges[x].onExit, layers[layer].challenges[x])
	updateChallengeTemp(layer)
}

VERSION.withoutName = "v" + VERSION.num + (VERSION.pre ? " Pre-Release " + VERSION.pre : VERSION.pre ? " Beta " + VERSION.beta : "")
VERSION.withName = VERSION.withoutName + (VERSION.name ? ": " + VERSION.name : "")


function autobuyUpgrades(layer){
	if (!tmp[layer].upgrades) return
	for (id in tmp[layer].upgrades)
		if (isPlainObject(tmp[layer].upgrades[id]) && (layers[layer].upgrades[id].canAfford === undefined || layers[layer].upgrades[id].canAfford() === true))
			buyUpg(layer, id) 
}

function gameLoop(diff) {
	if (isEndgame() || tmp.gameEnded){
		tmp.gameEnded = true
		clearParticles()
	}

	if (isNaN(diff) || diff < 0) diff = 0
	if (tmp.gameEnded && !player.keepGoing) {
		diff = 0
		//player.tab = "tmp.gameEnded"
		clearParticles()
	}
	addTime(diff)
	player.points = player.points.add(tmp.pointGen.times(diff)).max(0)

	for (let x = 0; x <= maxRow; x++){
		for (item in TREE_LAYERS[x]) {
			let layer = TREE_LAYERS[x][item]
			if (tmp[layer].passiveGeneration) generatePoints(layer, diff);
			if (layers[layer].update) layers[layer].update(diff);
		}
	}

	for (row in OTHER_LAYERS){
		for (item in OTHER_LAYERS[row]) {
			let layer = OTHER_LAYERS[row][item]
			if (tmp[layer].passiveGeneration) generatePoints(layer, diff);
			if (layers[layer].update) layers[layer].update(diff);
		}
	}	

	for (let x = maxRow; x >= 0; x--){
		for (item in TREE_LAYERS[x]) {
			let layer = TREE_LAYERS[x][item]
			if (tmp[layer].autoPrestige && tmp[layer].canReset) doReset(layer);
			if (layers[layer].automate) layers[layer].automate();
			if (tmp[layer].autoUpgrade) autobuyUpgrades(layer)
		}
	}

	for (row in OTHER_LAYERS){
		for (item in OTHER_LAYERS[row]) {
			let layer = OTHER_LAYERS[row][item]
			if (tmp[layer].autoPrestige && tmp[layer].canReset) doReset(layer);
			if (layers[layer].automate) layers[layer].automate();
				player[layer].best = player[layer].best.max(player[layer].points)
			if (tmp[layer].autoUpgrade) autobuyUpgrades(layer)
		}
	}

	for (layer in layers){
		if (layers[layer].milestones) updateMilestones(layer);
		if (layers[layer].achievements) updateAchievements(layer)
	}

}
function HardReset() {
	if(!hasAchievement('ac',1014)) {
		showModal("Do you want to hard reset , type exactly 'I AM WILLING TO DELETE MY SAVE' (case-sensitive)","",{ textBox: true , confirmButton: true , textColor: "green"} , hardReset)
	} else {
		showModal("DO you really want to HARD RESET for real , no more jokes . Carefully type exactly 'I AM WILLING TO DELETE MY SAVE' (case-sensitive)","",{ textBox: true , confirmButton: true , textColor: "red"} , hardReset)
	}
}
function hardReset(resetOptions,forced) {
	if(forced) {
		player = null
		save(true);
		window.location.reload()
	}
	if(modal.textBox.value === 'I AM WILLING TO DELETE MY SAVE' && !hasAchievement('ac',1014)) {
		addAchievement('ac',1014)
		return
	}
	if(modal.textBox.value !== 'I AM WILLING TO DELETE MY SAVE' && hasAchievement('ac',1014)) {
		return
	}
	player = null
	save(true);
	window.location.reload();
}

var ticking = false
//Performance test
var pastTickTimes = []


var interval = setInterval(function() {
	if (player===undefined||tmp===undefined) return;
	if (ticking) return;
	if (tmp.gameEnded&&!player.keepGoing) return;
	ticking = true
	if(options.autoshift && !shiftDown) shiftDown = true
	let now = Date.now()
	let diff = (now - player.time) / 1000
	let trueDiff = shiftDown?diff * 10:diff
	if(!options.popup) trueDiff = trueDiff * 1000000
	if (player.offTime !== undefined) {
		if (player.offTime.remain > (modInfo.offlineLimit * 3600)) player.offTime.remain = modInfo.offlineLimit * 3600
		if (player.offTime.remain > 0) {
			let offlineDiff = shiftDown?Math.max(player.offTime.remain / 2 , diff):Math.max(player.offTime.remain / 10, diff)
			player.offTime.remain -= offlineDiff
			player.o.time = player.o.time.add(offlineDiff)

		}
		if (!options.offlineProd || player.offTime.remain <= 0) player.offTime = undefined
	}
	player.time = now
	if (needCanvasUpdate){ 
		resizeCanvas();
		needCanvasUpdate = false;
	}
	if (backgroundHeatUpdate) {
		backgroundHeat();
		backgroundHeatUpdate = false;
	}
	if(playTimeUpdate) {
		if(options.DD === "None") {
			document.title = modInfo.name
		} else {
			document.title = modInfo.name+" | "+updateDDdisplay()
		}
		playTimeUpdate = false
	}
	tmp.scrolled = document.getElementById('treeTab') && document.getElementById('treeTab').scrollTop > 30
	updateTemp();
	updateOomps(diff);
	updateWidth()
	updateTabFormats()
	gameLoop(diff)
	fixNaNs()
	adjustPopupTime(trueDiff)
	updateParticles(trueDiff)
	pastTickTimes = [Date.now() - now].concat(pastTickTimes.slice(0, 9))
	ticking = false
}, 50)

setInterval(function() {needCanvasUpdate = true}, 500)
setInterval(function() {backgroundHeatUpdate = true} , 1000)
setInterval(function() {playTimeUpdate = true}, 400);