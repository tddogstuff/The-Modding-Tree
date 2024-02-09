// ************ Big Feature related ************

function respecBuyables(layer) {
	if (!layers[layer].buyables) return
	if (!layers[layer].buyables.respec) return
	if (!player[layer].noRespecConfirm && !confirm(tmp[layer].buyables.respecMessage || "Are you sure you want to respec? This will force you to do a \"" + (tmp[layer].name ? tmp[layer].name : layer) + "\" reset as well!")) return
	run(layers[layer].buyables.respec, layers[layer].buyables)
	updateBuyableTemp(layer)
	document.activeElement.blur()
}

function canAffordUpgrade(layer, id) {
	let upg = tmp[layer].upgrades[id]
	if(tmp[layer].deactivated) return false
	if (tmp[layer].upgrades[id].canAfford === false) return false
	let cost = tmp[layer].upgrades[id].cost
	if (cost !== undefined) 
		return canAffordPurchase(layer, upg, cost)

	return true
}

function canBuyBuyable(layer, id) {
	let b = temp[layer].buyables[id]
	return (b.unlocked && run(b.canAfford, b) && player[layer].buyables[id].lt(b.purchaseLimit) && !tmp[layer].deactivated)
}



function canAffordPurchase(layer, thing, cost) {
	if (thing.currencyInternalName) {
		let name = thing.currencyInternalName
		if (thing.currencyLocation) {
			return !(thing.currencyLocation[name].lt(cost))
		}
		else if (thing.currencyLayer) {
			let lr = thing.currencyLayer
			return !(player[lr][name].lt(cost))
		}
		else {
			return !(player[name].lt(cost))
		}
	}
	else {
		return !(player[layer].points.lt(cost))
	}
}

function buyUpgrade(layer, id) {
	buyUpg(layer, id)
}

function buyUpg(layer, id) {
	if (!tmp[layer].upgrades || !tmp[layer].upgrades[id]) return
	let upg = tmp[layer].upgrades[id]
	if (!player[layer].unlocked || player[layer].deactivated) return
	if (!tmp[layer].upgrades[id].unlocked) return
	if (player[layer].upgrades.includes(id)) return
	if (upg.canAfford === false) return
	let pay = layers[layer].upgrades[id].pay
	if (pay !== undefined)
		run(pay, layers[layer].upgrades[id])
	else {
		let cost = tmp[layer].upgrades[id].cost

		if (upg.currencyInternalName) {
			let name = upg.currencyInternalName
			if (upg.currencyLocation) {
				if (upg.currencyLocation[name].lt(cost)) return
				upg.currencyLocation[name] = upg.currencyLocation[name].sub(cost)
			}
			else if (upg.currencyLayer) {
				let lr = upg.currencyLayer
				if (player[lr][name].lt(cost)) return
				player[lr][name] = player[lr][name].sub(cost)
			}
			else {
				if (player[name].lt(cost)) return
				player[name] = player[name].sub(cost)
			}
		}
		else {
			if (player[layer].points.lt(cost)) return
			player[layer].points = player[layer].points.sub(cost)
		}
	}
	player[layer].upgrades.push(id);
	if (upg.onPurchase != undefined)
		run(upg.onPurchase, upg)
	needCanvasUpdate = true
}

function buyMaxBuyable(layer, id) {
	if (!player[layer].unlocked) return
	if (!tmp[layer].buyables[id].unlocked) return
	if (!tmp[layer].buyables[id].canBuy) return
	if (!layers[layer].buyables[id].buyMax) return

	run(layers[layer].buyables[id].buyMax, layers[layer].buyables[id])
	updateBuyableTemp(layer)
}

function buyBuyable(layer, id) {
	if (!player[layer].unlocked) return
	if (!tmp[layer].buyables[id].unlocked) return
	if (!tmp[layer].buyables[id].canBuy) return

	run(layers[layer].buyables[id].buy, layers[layer].buyables[id])
	updateBuyableTemp(layer)
}

function clickClickable(layer, id) {
	if (!player[layer].unlocked || tmp[layer].deactivated) return
	if (!tmp[layer].clickables[id].unlocked) return
	if (!tmp[layer].clickables[id].canClick) return

	run(layers[layer].clickables[id].onClick, layers[layer].clickables[id])
	updateClickableTemp(layer)
}

function clickGrid(layer, id) {
	if (!player[layer].unlocked  || tmp[layer].deactivated) return
	if (!run(layers[layer].grid.getUnlocked, layers[layer].grid, id)) return
	if (!gridRun(layer, 'getCanClick', player[layer].grid[id], id)) return

	gridRun(layer, 'onClick', player[layer].grid[id], id)
}

// Function to determine if the player is in a challenge
function inChallenge(layer, id) {
	let challenge = player[layer].activeChallenge
	if (!challenge) return false
	id = toNumber(id)
	if (challenge == id) return true

	if (layers[layer].challenges[challenge].countsAs)
		return tmp[layer].challenges[challenge].countsAs.includes(id) || false
	return false
}

// ************ Misc ************

var onTreeTab = true

function showTab(name, prev) {
	if (LAYERS.includes(name) && !layerunlocked(name)) return
	if (player.tab !== name) clearParticles(function(p) {return p.layer === player.tab})
	if (tmp[name] && player.tab === name && isPlainObject(tmp[name].tabFormat)) {
		player.subtabs[name].mainTabs = Object.keys(layers[name].tabFormat)[0]
	}
	var toTreeTab = name == "none"
	player.tab = name
	if (tmp[name] && (tmp[name].row !== "side") && (tmp[name].row !== "otherside")) player.lastSafeTab = name
	updateTabFormats()
	needCanvasUpdate = true
	document.activeElement.blur()

}

function showNavTab(name, prev) {
	console.log(prev)
	if (LAYERS.includes(name) && !layerunlocked(name)) return
	if (player.navTab !== name) clearParticles(function(p) {return p.layer === player.navTab})
	if (tmp[name] && tmp[name].previousTab !== undefined) prev = tmp[name].previousTab
	var toTreeTab = name == "tree-tab"
	console.log(name + prev)
	if (name!== "none" && prev && !tmp[prev]?.leftTab == !tmp[name]?.leftTab) player[name].prevTab = prev
	else if (player[name])
		player[name].prevTab = ""
	player.navTab = name
	updateTabFormats()
	needCanvasUpdate = true
}


function goBack(layer) {
	let nextTab = "none"

	if (player[layer].prevTab) nextTab = player[layer].prevTab
	if (player.navTab === "none" && (tmp[layer]?.row == "side" || tmp[layer].row == "otherside")) nextTab = player.lastSafeTab

	if (tmp[layer].leftTab) showNavTab(nextTab, layer)
	else showTab(nextTab, layer)

}

function layOver(obj1, obj2) {
	for (let x in obj2) {
		if (obj2[x] instanceof Decimal) obj1[x] = new Decimal(obj2[x])
		else if (obj2[x] instanceof Object) layOver(obj1[x], obj2[x]);
		else obj1[x] = obj2[x];
	}
}

function prestigeNotify(layer) {
	if (layers[layer].prestigeNotify) return layers[layer].prestigeNotify()
	
	if (isPlainObject(tmp[layer].tabFormat)) {
		for (subtab in tmp[layer].tabFormat){
			if (subtabResetNotify(layer, 'mainTabs', subtab))
				return true
		}
	}
	for (family in tmp[layer].microtabs) {
		for (subtab in tmp[layer].microtabs[family]){
			if (subtabResetNotify(layer, family, subtab))
				return true
		}
	}
	if (tmp[layer].autoPrestige || tmp[layer].passiveGeneration) return false
	else if (tmp[layer].type == "static") return tmp[layer].canReset
	else if (tmp[layer].type == "normal") return (tmp[layer].canReset && (tmp[layer].resetGain.gte(player[layer].points.div(10))))
	else return false
}

function notifyLayer(name) {
	if (player.tab == name || !layerunlocked(name)) return
	player.notify[name] = 1
}

function subtabShouldNotify(layer, family, id) {
    let subtab = {}
    if (family == "mainTabs") subtab = tmp[layer].tabFormat[id]
    else subtab = tmp[layer].microtabs[family][id]
	if (!subtab.unlocked) return false
    if (subtab.embedLayer) return tmp[subtab.embedLayer].notify
    else return subtab.shouldNotify
}

function subtabResetNotify(layer, family, id) {
	let subtab = {}
	if (family == "mainTabs") subtab = tmp[layer].tabFormat[id]
	else subtab = tmp[layer].microtabs[family][id]
	if (subtab.embedLayer) return tmp[subtab.embedLayer].prestigeNotify
	else return subtab.prestigeNotify
}

function nodeShown(layer) {
	return layerShown(layer)
}

function layerunlocked(layer) {
	if (tmp[layer] && tmp[layer].type == "none") return (player[layer].unlocked)
	return LAYERS.includes(layer) && (player[layer].unlocked || (tmp[layer].canReset && tmp[layer].layerShown))
}

function keepGoing() {
	player.keepGoing = true;
	needCanvasUpdate = true;
}

function toNumber(x) {
	if (x.mag !== undefined) return x.toNumber()
	if (x + 0 !== x) return parseFloat(x)
	return x
}

function updateMilestones(layer) {
	if (tmp[layer].deactivated) return
	for (id in layers[layer].milestones) {
		if (!(hasMilestone(layer, id)) && layers[layer].milestones[id].done()) {
			player[layer].milestones.push(id)
			if (layers[layer].milestones[id].onComplete) layers[layer].milestones[id].onComplete()
			if (tmp[layer].milestonePopups || tmp[layer].milestonePopups === undefined) doPopup("milestone", tmp[layer].milestones[id].requirementDescription, "Milestone Gotten!", 3, tmp[layer].color);
			player[layer].lastMilestone = id
		}
	}
}

function updateAchievements(layer) {
	if (tmp[layer].deactivated) return
	for (id in layers[layer].achievements) {
		if (isPlainObject(layers[layer].achievements[id]) && !(hasAchievement(layer, id)) && layers[layer].achievements[id].done()) {
			player[layer].achievements.push(id)
			if (layers[layer].achievements[id].onComplete) layers[layer].achievements[id].onComplete()
			if (tmp[layer].achievementPopups || tmp[layer].achievementPopups === undefined) doPopup("achievement", tmp[layer].achievements[id].name, "Achievement Gotten!", 3, tmp[layer].color);
		}
	}
}

function addTime(diff, layer) {
	let data = player
	let time = data.timePlayed
	if (layer) {
		data = data[layer]
		time = data.time
	}

	//I am not that good to perfectly fix that leak. ~ DB Aarex
	if (time + 0 !== time) {
		console.log("Memory leak detected. Trying to fix...")
		time = toNumber(time)
		if (isNaN(time) || time == 0) {
			console.log("Couldn't fix! Resetting...")
			time = layer ? player.timePlayed : 0
			if (!layer) player.timePlayedReset = true
		}
	}
	time += toNumber(diff)

	if (layer) data.time = time
	else data.timePlayed = time
}

shiftDown = false
ctrlDown = false

document.onkeydown = function (e) {
	if (player === undefined) return;
	shiftDown = e.shiftKey
	ctrlDown = e.ctrlKey
	if (tmp.gameEnded && !player.keepGoing) return;
	let key = e.key
	if (ctrlDown) key = "ctrl+" + key
	if (onFocused) return
	if (ctrlDown && hotkeys[key]) e.preventDefault()
	if (hotkeys[key]) {
		let k = hotkeys[key]
		if (player[k.layer].unlocked && tmp[k.layer].hotkeys[k.id].unlocked)
			k.onPress()
	}
}

document.onkeyup = function (e) {
	shiftDown = e.shiftKey
	ctrlDown = e.ctrlKey
}

var onFocused = false
function focused(x) {
	onFocused = x
}


function isFunction(obj) {
	return !!(obj && obj.constructor && obj.call && obj.apply);
};

function isPlainObject(obj) {
	return (!!obj) && (obj.constructor === Object)
}

document.title = modInfo.name

// Converts a string value to whatever it's supposed to be
function toValue(value, oldValue) {
	if (oldValue instanceof Decimal) {
		value = new Decimal (value)
		if (checkDecimalNaN(value)) return decimalZero
		return value
	}
	if (!isNaN(oldValue)) 
		return parseFloat(value) || 0
	return value
}

// Variables that must be defined to display popups
var activePopups = [];
var popupID = 0;

// Function to show popups
function doPopup(type = "none", text = "This is a test popup.", title = "", timer = 3, color = "") {
	switch (type) {
		case "achievement":
			popupTitle = "Achievement Unlocked!";
			popupType = "achievement-popup"
			break;
		case "challenge":
			popupTitle = "Challenge Complete";
			popupType = "challenge-popup"
			break;
		default:
			popupTitle = "Something Happened?";
			popupType = "default-popup"
			break;
	}
	if (title != "") popupTitle = title;
	popupMessage = text;
	popupTimer = timer;

	activePopups.push({ "time": popupTimer, "type": popupType, "title": popupTitle, "message": (popupMessage + "\n"), "id": popupID, "color": color })
	popupID++;
}


//Function to reduce time on active popups
function adjustPopupTime(diff) {
	for (popup in activePopups) {
		activePopups[popup].time -= diff;
		if (activePopups[popup]["time"] < 0) {
			activePopups.splice(popup, 1); // Remove popup when time hits 0
		}
	}
}

function run(func, target, args = null) {
	if (isFunction(func)) {
		let bound = func.bind(target)
		return bound(args)
	}
	else
		return func;
}

function gridRun(layer, func, data, id) {
	if (isFunction(layers[layer].grid[func])) {
		let bound = layers[layer].grid[func].bind(layers[layer].grid)
		return bound(data, id)
	}
	else
		return layers[layer].grid[func];
}
//additional utility
//graduation
function RandomArtifactID(index) {
	let array = [0,0,0,0]
	const usedNumbers = new Set(); 
  
	for (let i = 0; i < array.length; i++) {
	  while (true) {
		const randomNumber = Math.floor(Math.random() * 8) + 1 + 8 * index;
  
		if (!usedNumbers.has(randomNumber)) {
		  array[i] = randomNumber;
		  usedNumbers.add(randomNumber); 
		  break;
		}
	  }
	}
	return array;
  }
function RandomArtifactQuality() {  
	let array = [0,0,0,0]
	for (let i = 0; i < 4; i++) {
	  while (true) {
		const randomNumber = (Math.floor(Math.random() * 10000) + 1) /100;
		array[i] = randomNumber;
		break;
		}
	  }	
	return array;
}
function maxEffect(id) {
	switch (id) {
		case 1:
		  return 1.25;
		case 2:
		  return 1.6;
		case 3:
		  return 1.6;	  
		case 4:
		  return 1.2;
		case 5:
		  return 1.2;
		case 6:
		  return 1.25;
		case 7:
		  return 2;
		case 8:
		  return 1.5;
		case 9:
		  return 16;
		case 10:
		  return 0.5;
		 case 11:
		  return 0.75;	  
		case 12:
		  return 0.25;
		case 13:
		  return 2.5;
		 case 14:
		  return 2.5;
		case 15:
		  return 1.4;
		case 16:
		  return 1.4;
		case 17:
		  return 1.15;
		case 18:
		  return 1.2;
		 case 19:
		  return 1.25;	  
		case 20:
		  return 1.2;
		case 21:
		  return 2;
		 case 22:
		  return 1.6;
		case 23:
		  return 10000;
		case 24:
		  return 40;
		case 25:
		  return 100;
		case 26:
		  return 2;
		 case 27:
		  return 100;	  
		case 28:
		  return 40;
		case 29:
		  return 20;
		 case 30:
		  return 0.65;
		case 31:
		  return 1.25;
		case 32:
		  return 10;
		//if error
		default:
		  return 1;
	}
}
function getArtifactEffect(idarray,qualityarray,a) {
	let id = idarray
	let quality = qualityarray
	let effect = [1]

	for (let i = 0; i < 4; i++) {
		while (true) {
		  let max = maxEffect(id[i]) 
		  let eff = Math.pow(max,quality[i] / 100)
		  effect[i] = eff;
		  break;
		  }
		}	
	return effect
	
}
//Yes! there is 32 different artifact id , oh no
function DisplayArtifactEffect(id,effect) {
	let e = effect
  switch (id) {
	//1-8 : Resource booster
    case 1:
      return "Number gained is ^"+format(e)+"";
    case 2:
      return "Additive gained (before cost scaling) is x"+format(e)+"";
 	case 3:
      return "Subtractive gained (before cost scaling) is x"+format(e)+"";	  
	case 4:
      return "Multiplicative gained is ^"+format(e)+"";
    case 5:
      return "Divisive gained is ^"+format(e)+"";
 	case 6:
      return "Effective exponent is x"+format(e)+"";
    case 7:
      return "Perk power gained is x"+format(e)+"";
    case 8:
      return "Research gained is x"+format(e)+"";
	//9-16 : Reduce the cost of sth or weaken cost scaling
    case 9:
      return "Research cost is /"+format(e)+"";
    case 10:
      return "'Point Boost' (Multiplicative) cost is ^"+format(e)+"";
 	case 11:
      return "All improvement cost is ^"+format(e)+"";	  
	case 12:
      return "Energy booster (Twilight) cost is ^"+format(e)+"";
    case 13:
      return "Light additive (Twilight) cost scaling is "+format(e)+"x weaker";
 	case 14:
      return "Dark subtractive (Twilight) cost scaling is "+format(e)+"x weaker";
    case 15:
      return "Additive cost scaling is "+format(e)+"x weaker";
    case 16:
      return "Subtractive cost scaling is "+format(e)+"x weaker";
	//17-24 : Buyables
	case 17:
      return "'Perk Power 1' (Exponent) effect is ^"+format(e)+"";
    case 18:
      return "'Perk Power 2' (Exponent) effect is ^"+format(e)+"";
 	case 19:
      return "'Point Boost' (Multiplicative) effect is ^"+format(e)+"";	  
	case 20:
      return "All improvement (Research) effect is ^"+format(e)+"";
    case 21:
      return "Light additive and Dark subtractive (Twilight) generator are "+format(e)+"x stronger";
 	case 22:
      return "'Discount' (Exponent) effect is ^"+format(e)+"";
    case 23:
      return "'Number Booster' (Exponent) base is multiplied by "+format(e)+"";
    case 24:
      return "Add +"+format(e)+"% to Twilight perk strength";
	//24-32 : Other
	case 25:
      return "Multiply Gamespeed by x"+format(e)+"";
    case 26:
      return "Raise Tickspeed by ^"+format(e)+"";
 	case 27:
      return "Prestige Time gained is multiplied by "+format(e)+"";	  
	case 28:
      return "Weaken all Meta-research challenge modifier by "+format(e)+"%";
    case 29:
      return "Reduce Exponent cost scaling by "+format(e)+"%";
 	case 30:
      return "Raise All Pre-Research challenge goal by ^"+format(e)+"";
    case 31:
      return "Boost Exponent effect by ^"+format(e)+"";
    case 32:
      return "Add "+format(e)+" to base Perk Power gained";
	//if error
    default:
      return "";
  }
}
// 16 more for unique ID  
function DisplayUniqueArtifactEffect(id) {
  switch (id) {
    case 1:
      return "Gain free Additive and Subtractive based on 'Point Boost' level";
    case 2:
      return "'Perk Power 2' add free 'Perk Power 1' level";
 	case 3:
      return "'Perk Power 1' add free 'Point Boost' level";	  
	case 4:
      return "'Point Boost' add free 'Perk Power 2' level at a very reduced rate";
    case 5:
      return "Improvement boost their respective challenge reward";
 	case 6:
      return "Tickspeed boost from Research is stronger based on Prestige Time";
    case 7:
      return "Challenge shard grant additional free Research";
    case 8:
      return "Reduce the cost of Research based on unspent Meta-research";
    case 9:
      return "Operation effect also weaken Energy reduction at a heavily reduced rate";
    case 10:
      return "Energy effect also affect Light Additive and Dark Subtractive at a severely reduced rate";
 	case 11:
      return "Exponent effect additionally affect Number at a insanely reduced rate";	  
	case 12:
      return "Mastery boost Prestige Time gained at a greatly reduced rate";
    case 13:
      return "Operation gained is boosted based on current Twilight at a slightly reduced rate";
 	case 14:
      return "Challenge shard boost the reward of all Pre-Research challenge at a reduced rate";
    case 15:
      return "Decrease the cost increase to other Improvement when buying any Improvement";
    case 16:
      return "Perk Power gained is increased based on Subtractive";
	case 17:
	  return "Gamespeed is boosted based on Tickspeed";
	case 18: 
	  return "Additive cost scaling start later based on Research";
	case 19:
	  return "Subtractive cost scaling start later based on Research";
	case 20:
	  return "Boost Light additive gained based on Challenge shard";
	//if error
    default:
      return "Unique Artifact ID is invalid";
  }
}
function updateArtifactEffect() {
	for (let i = 0; i < 4; i++) {
		while (true) {
		  player.g.artifact1d[i] = DisplayArtifactEffect(player.g.artifact1[i],player.g.artifact1eff[i])
		  player.g.artifact2d[i] = DisplayArtifactEffect(player.g.artifact2[i],player.g.artifact2eff[i])
		  player.g.artifact3d[i] = DisplayArtifactEffect(player.g.artifact3[i],player.g.artifact3eff[i])
		  player.g.artifact4d[i] = DisplayArtifactEffect(player.g.artifact4[i],player.g.artifact4eff[i])
		  break;
		  }
		}	
}  
function AllArtifactEffect(id, effect, index) {
    let b1 = id
    let array = [];
    let v = 1 + 8 * index;

    for (let i = 0; i < 8; i++) {
        if (!b1.includes(v)) {
            b1.push(v);
        }
        v++;
    }

    for (let i = 0; i < 8; i++) {
        array[id[i] - 1] = effect[i] || 1; // Use 0 for missing effects
    }

    return array.slice(index * 8, (index + 1) * 8);
}
function updateAllAritfactEffect() { 

	player.g.artifactset1 = AllArtifactEffect(player.g.artifact1,player.g.artifact1eff,0)
	player.g.artifactset2 = AllArtifactEffect(player.g.artifact2,player.g.artifact2eff,1)
	player.g.artifactset3 = AllArtifactEffect(player.g.artifact3,player.g.artifact3eff,2)
	player.g.artifactset4 = AllArtifactEffect(player.g.artifact4,player.g.artifact4eff,3)


}
