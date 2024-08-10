/** 
*Check if has an specific upgrade , return true or false
**/
function hasUpgrade(layer, id) {
	return ((player[layer].upgrades.includes(toNumber(id)) || player[layer].upgrades.includes(id.toString())) && !tmp[layer].deactivated)
}
/** 
*Check if has an specific milestone , return true or false
**/
function hasMilestone(layer, id) {
	return ((player[layer].milestones.includes(toNumber(id)) || player[layer].milestones.includes(id.toString())) && !tmp[layer].deactivated)
}
/** 
*Check if has an specific achievement , return true or false
**/
function hasAchievement(layer, id) {
	return ((player[layer].achievements.includes(toNumber(id)) || player[layer].achievements.includes(id.toString())) && !tmp[layer].deactivated)
}
/** 
*Check if has an specific challenge , return true or false
**/
function hasChallenge(layer, id) {
	return ((player[layer].challenges[id]) && !tmp[layer].deactivated)
}

function maxedChallenge(layer, id) {
	return ((player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit) && !tmp[layer].deactivated)
}

function challengeCompletions(layer, id) {
	return (player[layer].challenges[id])
}
/** 
*Get a specific buyable amount
**/
function getBuyableAmount(layer, id) {
	return (player[layer].buyables[id])
}
/** 
*Set a specific buyable amount 
**/
function setBuyableAmount(layer, id, amt) {
	player[layer].buyables[id] = amt
}
/** 
*Add to a specific buyable
**/
function addBuyables(layer, id, amt) {
	player[layer].buyables[id] = player[layer].buyables[id].add(amt)
}

function getClickableState(layer, id) {
	return (player[layer].clickables[id])
}

function setClickableState(layer, id, state) {
	player[layer].clickables[id] = state
}

function getGridData(layer, id) {
	return (player[layer].grid[id])
}

function setGridData(layer, id, data) {
	player[layer].grid[id] = data
}
/** 
*Retrieve specific upgrade effect , as decimal
**/
function upgradeEffect(layer, id) {
	return (tmp[layer].upgrades[id].effect)
}
/** 
*Retrieve specific challenge effect (only if completed) , as decimal
**/
function challengeEffect(layer, id) {
	return (tmp[layer].challenges[id].rewardEffect)
}
/** 
*Retrieve specific buyable effect , as decimal
**/
function buyableEffect(layer, id) {
	return (tmp[layer].buyables[id].effect)
}

function clickableEffect(layer, id) {
	return (tmp[layer].clickables[id].effect)
}
/** 
*Retrieve specfic achievement effect , as decimal
**/
function achievementEffect(layer, id) {
	return (tmp[layer].achievements[id].effect)
}

function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id))
}
/** 
*Check if an unlocked achievement was charged , return true or false
**/
function hasSuperAchievement(layer , id) {
	return player[layer].super.includes(id)
}
