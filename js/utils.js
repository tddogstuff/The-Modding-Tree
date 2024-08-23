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
document.title = modInfo.name

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
			if (tmp[layer].milestonePopups || tmp[layer].milestonePopups === undefined) doPopup("milestone", tmp[layer].milestones[id].requirementDescription, tmp[layer].layerName+" Milestone", 3, tmp[layer].color);
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
			if ((tmp[layer].achievementPopups || tmp[layer].achievementPopups === undefined) && (new Decimal(id).lt(2100) || options.lore)) doPopup("achievement", tmp[layer].achievements[id].name, "Achievement reached", 3, tmp[layer].color);
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



let shiftDown = false
let ctrlDown = false

//Not used
function isUsingMobile() {
	if (
	  navigator.userAgent.match(/Android/i) ||
	  navigator.userAgent.match(/webOS/i) ||
	  navigator.userAgent.match(/iPhone/i) ||
	  navigator.userAgent.match(/iPad/i) ||
	  navigator.userAgent.match(/iPod/i) ||
	  navigator.userAgent.match(/BlackBerry/i) ||
	  navigator.userAgent.match(/Windows Phone/i) 
	) {
	  return true;
	} else {
	  return false;
	}
  }
document.onkeydown = function (e) {
	if (player === undefined) return;
	if(options.autoshift) {
	shiftDown = true
	} else {
	shiftDown = e.shiftKey
	}
	ctrlDown = e.ctrlKey
	if (tmp.gameEnded && !player.keepGoing) return;
	let key = e.key
	if (ctrlDown) key = "ctrl+" + key
	if (onFocused) return
	if (ctrlDown && hotkeys[key]) e.preventDefault()
	if (hotkeys[key]) {
		let k = hotkeys[key]
		if (player[k.layer].unlocked && tmp[k.layer].hotkeys[k.id].unlocked && !modal.isOpen)
			k.onPress()
	}
}

document.onkeyup = function (e) {
	if(options.autoshift) {
		shiftDown = true
	} else {
		shiftDown = e.shiftKey
	}	
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
		case "Machine":
			popupTitle = "Machine";
			popupType = "machine-popup"
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
//sacrifice
function unlockSAch(layer , id) {
	if(!player[layer].unlocked) return
	if(!tmp[layer].achievements[id].unlocked) return
	if(player[layer].super.includes(id)) return
	if(!tmp[layer].achievements[id].chargeUnl) return
	if(!tmp[layer].achievements[id].chargeCan) return
	player[layer].super.push(id)
}
//additional utility
//graduation
/** 
*Generate the unique ID of the Artifact effect 
**/
function RandomArtifactID(index,binding) {
	if(binding === undefined) binding = []
	let array = [0,0,0,0]
	const usedNumbers = new Set(); 
	for (let j = 0 ; j < binding.length ; j++) {
		usedNumbers.add(binding[j])
	}
	for (let i = 0; i < array.length - binding.length; i++) {
	  while (true) {
		const randomNumber = Math.floor(Math.random() * 8) + 1 + 8 * index;
  
		if (!usedNumbers.has(randomNumber)) {
		  array[i] = randomNumber;
		  usedNumbers.add(randomNumber); 
		  break;
		}
	  }
	}
	for (let k = 0 ; k < binding.length ; k++) {
		array[array.length - k - 1] = binding[k]
	}

	return array;
  }
/** 
*Generate an array of number representing the artifact quality , with quality affecting the randomness
**/
function RandomArtifactQuality(quality) {  
	if(quality === undefined) quality = d(0)
	quality = quality.add(100)
	let array = [0,0,0,0]
	for (let i = 0; i < 4; i++) {
	  while (true) {
		const randomNumber = (Math.floor(Math.random() ** (100 / (toNumber(quality) + 100)) * 10000) + 1) /100;
		array[i] = randomNumber;
		break;
		}
	  }	
	return array;
}
function maxEffect(id , level) {
	if(level === undefined) level = 1
	level = toNumber(level)
	switch (id) {
		case 1:
		  return 1.245 + 0.005 * level; //Number
		case 2:
		  return 1.73 + 0.02 * level; //Additive
		case 3:
		  return 1.73 + 0.02 * level; //Subtractive
		case 4:
		  return 1.194 + 0.006 * level; //Multiplicative
		case 5:
		  return 1.196 + 0.004 * level; //Divisive
		case 6:
		  return 1.146 + 0.004 * level; //Exponent
		case 7:
		  return 1.96 + 0.04 * level; //Perk power
		case 8:
		  return 1.1475 + 0.0025 * level; //Research
		case 9:
		  return 4.8 + 0.2 * level; //Research cost
		case 10:
		  return Math.pow(0.75 , 1 + (level - 1) / 90); // Points boost cost
		 case 11:
		  return Math.pow(0.25 , 1 + (level - 1) / 40); // Improvement cost	  
		case 12:
		  return Math.pow(0.15 , 1 + (level - 1) / 40); // Energy booster cost
		case 13:
		  return 2.97 + 0.03 * level; //LA cost scaling
		 case 14:
		  return 2.97 + 0.03 * level; //DA cost scaling
		case 15:
		  return 1.392 + 0.008 * level; //Additive softcap strength
		case 16:
		  return 1.392 + 0.008 * level; //Subtractive softcap strength
		case 17:
		  return 1.144 + 0.006 * level; // Perk power from Exponent
		case 18:
		  return 1.192 + 0.008 * level; // Perk power from Research
		case 19:
		  return 1.245 + 0.005 * level;	 //Points boost effect
		case 20:
		  return 1.245 + 0.005 * level; //Improvement effect
		case 21:
		  return 1.98 + 0.02 * level; //Generator strength
		case 22:
		  return 3.6 + 0.4 * level; //Perk power effect , boosting ASE cost reduction 
		case 23:
		  return 10; //10th Perk
		case 24:
		  return 72 + 4 * level; //Twilight perk strength
		case 25:
		  return 24 + 1 * level; //Gamespeed
		case 26:
		  return 1.24 + 0.01 * level; //Tickspeed
		 case 27:
		  return 28 + 2 * level; //Prestige time
		case 28:
		  return 26; //Challenge reward weaken , cannot scale with level
		case 29:
		  return 100 - ((80 / ((level - 1) / 2500 + 1)) + 1); //Exponent cost scaling base reduction
		 case 30:
		  return Math.pow(0.5 , 1 + (level - 1)/25); //Lower all Pre-research challenge goal
		case 31:
		  return 1.19 + 0.01 * level; //Exponent boost multiplier
		case 32:
		  return 9.75 + 0.25 * level; //Base max Perk power
		//if error
		default:
		  return 1;
	}
}
/** 
*Get an array , containing the effect of Artifact given its ID and Quality 
**/
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
/** 
*Handle displaying Artifact effect as a string
**/
function DisplayArtifactEffect(id,effect) {
	let e = effect
  switch (id) {
	//1-8 : Resource booster
    case 1:
      return "Number gain is ^"+format(e)+""; 
    case 2:
      return "Additive gain is x"+format(e)+"";
 	case 3:
      return "Subtractive gain is x"+format(e)+""; 	  
	case 4:
      return "Multiplicative gain is ^"+format(e)+""; 
    case 5:
      return "Divisive gain is ^"+format(e)+"";
 	case 6:
      return "Effective exponent is x"+format(e)+"";
    case 7:
      return "Max Perk power gain is x"+format(e)+"";
    case 8:
      return "Research gain is x"+format(e)+"";  
	//9-16 : Reduce the cost of sth or weaken cost scaling
    case 9:
      return "Research cost is /"+format(e)+"";
    case 10:
      return "'Points Boost' (Multiplicative) cost is ^"+format(e)+"";
 	case 11:
      return "All improvement cost is ^"+format(e)+"";	  
	case 12:
      return "Energy booster (Twilight) cost is ^"+format(e)+"";
    case 13:
      return "Light additive (Twilight) generator cost scaling is "+format(e)+"x weaker";
 	case 14:
      return "Dark subtractive (Twilight) generator cost scaling is "+format(e)+"x weaker";
    case 15:
      return "Additive cost scaling is "+format(e)+"x weaker";
    case 16:
      return "Subtractive cost scaling is "+format(e)+"x weaker";
	//17-24 : Buyables
	case 17:
      return "Perk Power from Exponent is ^"+format(e)+"";
    case 18:
      return "Perk Power from Research is ^"+format(e)+"";
 	case 19:
      return "'Points Boost' (Multiplicative) effect is ^"+format(e)+" (Applied after Tetration reward)";	  
	case 20:
      return "All improvement (Research) effect is ^"+format(e)+"";
    case 21: 
      return "Light additive and Dark subtractive (Twilight) generator are "+format(e)+"x stronger";
 	case 22:
      return "Additive , Subtractive , Exponent cost reduction from Perk Power is ^"+format(e)+"";
    case 23:
      return "Unlock the 10th boost from Perk Power";
    case 24:
      return "Add +"+format(e - 1)+"% to Twilight reward strength";
	//24-32 : Other
	case 25:
      return "Multiply Gamepeed by x"+format(e)+"";
    case 26:
      return "Raise Tickspeed by ^"+format(e)+"";
 	case 27:
      return "Prestige Time gain is multiplied by "+format(e)+"";	  
	case 28:
      return "Weaken the first 7 Meta-research challenge modifier by "+format(e - 1)+"%";
    case 29:
      return "Reduce Exponent cost scaling base by "+format(e - 1)+"%";
 	case 30:
      return "Raise All Pre-Research challenge goal by ^"+format(e)+"";
    case 31:
      return "Increase Exponent boost by "+format(e)+"x";
    case 32:
      return "Add "+format(e - 1)+" to max Perk Power";
    default:
      return "";
  }
}
/** 
*Update the Artifact text display
**/
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
/** 
*Generate a 8 effect array with successive ID and will sort the effect correspondingly 
**/
function AllArtifactEffect(id, effect, index) {
    let b1 = id
    let array = [];
    let v = 1 + 8 * index;
try {
	for (let i = 0; i < 8; i++) {
        if (!b1.includes(v)) {
            b1.push(v);
        }
        v++;
    }

    for (let i = 0; i < 8; i++) {
        array[id[i] - 1] = effect[i] || 1; 
    }

} catch (error) {
	return 
}
    
    array =  array.slice(index * 8, (index + 1) * 8);
	if(array.length < 8) return [1,1,1,1,1,1,1,1]
	else return array
}
//DO NOT CALL THIS
/** 
*Update the effect of all artifact , which do not include the text
**/
function updateAllAritfactEffect() { 

	player.g.artifactset1 = AllArtifactEffect(player.g.artifact1,player.g.artifact1eff,0)
	player.g.artifactset2 = AllArtifactEffect(player.g.artifact2,player.g.artifact2eff,1)
	player.g.artifactset3 = AllArtifactEffect(player.g.artifact3,player.g.artifact3eff,2)
	player.g.artifactset4 = AllArtifactEffect(player.g.artifact4,player.g.artifact4eff,3)


}
/** 
*Change the color , height of a box (buyables , challenges , clickables , upgrades)
**/
function Qcolor(bgcolor,height,color) {
	if (bgcolor === undefined) {
		bgcolor = 'black'
	}
	if (height === undefined) {
		height = 120
	} 
	if (color === undefined) {
		color = 'white'
	}
	 return {
		'border-radius': '0%',
		'color':'white',
		'background-color': bgcolor,
		'border':'2px solid',
		'border-color':color,
		'height': height+'px'
	} 
}
/** 
*Change a color of an html elements
**/
function Qcolor2(layercode,text) {
	if(!options.coloredtext) {
		return text
	} else {
	let c = text
	switch(layercode) {
		case 'n': //number
		return "<span style='color:#8efdfc'>" + c + "</span>"
		case 'a': //addtive
		return "<span style='color:#93fd8e'>" + c + "</span>"
		case 's': //subtractive
		return "<span style='color:#fd8e8e'>" + c + "</span>"
		case 'm': //multiplicative
		return "<span style='color:#2487da'>" + c + "</span>"
		case 'd': //divisive
		return "<span style='color:#b90e0e'>" + c + "</span>"
		case 'e': //exponent
		return "<span style='color:#d968f6'>" + c + "</span>"
		case 'r': //research
		return "<span style='color:#9168f6'>" + c + "</span>"
		case 't': //ticks
		return "<span style='color:#ffffff'>" + c + "</span>"
		case 'g': //graduation
		return "<span style='color:#dcdac4'>" + c + "</span>"
		case 'la': //light additive
		return "<span style='color:#6eb23c'>" + c + "</span>"
		case 'ds': //dark subtractive
		return "<span style='color:#b23c3c'>" + c + "</span>"
		case 'tw': //twilight
		return "<span style='color:#7006be'>" + c + "</span>"
		case 'en': //energy
		return "<span style='color:#6cd9dd'>" + c + "</span>"
		case 'tt': //tetration
		return "<span style='color:#54a23b'>" + c + "</span>"
		case 'off': //offline time
		return "<span style='color:#ff00ff'>" + c + "</span>"
		case 'y' : //yellow color
		return "<span style='color:#ffff00'>" + c + "</span>" 
		case 'red1' : 
		return "<span style='color:#cd5c5c'>" + c + "</span>" 
		case 'red2' : 
		return "<span style='color:#f08080'>" + c + "</span>" 
		case 'red3' : 
		return "<span style='color:#e9967a'>" + c + "</span>" 
		case 'red4' : 
		return "<span style='color:#b22222'>" + c + "</span>" 
		case 'red5' : 
		return "<span style='color:#bb0000'>" + c + "</span>" 
		case 'pink1' : 
		return "<span style='color:#ffc0cb'>" + c + "</span>" 
		case 'pink2' : 
		return "<span style='color:#ffb6c1'>" + c + "</span>" 
		case 'pink3' : 
		return "<span style='color:#ff69b4'>" + c + "</span>" 
		case 'pink4' : 
		return "<span style='color:#ff1493'>" + c + "</span>" 
		case 'pink5' : 
		return "<span style='color:#db7093'>" + c + "</span>" 
		case 'orange1' : 
		return "<span style='color:#ffa07a'>" + c + "</span>" 
		case 'orange2' : 
		return "<span style='color:#ff7f50'>" + c + "</span>" 
		case 'orange3' : 
		return "<span style='color:#ff6347'>" + c + "</span>" 
		case 'orange4' : 
		return "<span style='color:#ff4500'>" + c + "</span>" 
		case 'orange5' : 
		return "<span style='color:#ffa500'>" + c + "</span>" 
		case 'yellow1' : 
		return "<span style='color:#ffd700'>" + c + "</span>" 
		case 'yellow2' : 
		return "<span style='color:#ffffe0'>" + c + "</span>" 
		case 'yellow3' : 
		return "<span style='color:#ffe4b5'>" + c + "</span>" 
		case 'yellow4' : 
		return "<span style='color:#eee8aa'>" + c + "</span>" 
		case 'yellow5' : 
		return "<span style='color:#f0e68c'>" + c + "</span>" 
		case 'purple1' : 
		return "<span style='color:#e6e6fa'>" + c + "</span>" 
		case 'purple2' : 
		return "<span style='color:#dda0dd'>" + c + "</span>" 
		case 'purple3' : 
		return "<span style='color:#ee82ee'>" + c + "</span>" 
		case 'purple4' : 
		return "<span style='color:#663399'>" + c + "</span>" 
		case 'purple5' : 
		return "<span style='color:#9400d3'>" + c + "</span>" 
		case 'green1' : 
		return "<span style='color:#adf2ff'>" + c + "</span>" 
		case 'green2' : 
		return "<span style='color:#7cfc00'>" + c + "</span>" 
		case 'green3' : 
		return "<span style='color:#00ff7f'>" + c + "</span>" 
		case 'green4' : 
		return "<span style='color:#808000'>" + c + "</span>" 
		case 'green5' : 
		return "<span style='color:#66cdaa'>" + c + "</span>" 
		case 'blue1' : 
		return "<span style='color:#e0ffff'>" + c + "</span>" 
		case 'blue2' : 
		return "<span style='color:#e4d0d0'>" + c + "</span>" 
		case 'blue3' : 
		return "<span style='color:#00ced1'>" + c + "</span>" 
		case 'blue4' : 
		return "<span style='color:#4682b4'>" + c + "</span>" 
		case 'blue5' : 
		return "<span style='color:#7b68ee'>" + c + "</span>" 
		default: 
		return c
	}}
}

function Qcolor3(color) {
return {
	'border-color' : color,
}
}
function Qcolor4(color,text) {
	if(!options.coloredtext) {
		return text
	} else {
		return `<span style='color:${color}'>" +${text} + "</span>`
	}
}
/**
 * the default shadow colored text without <h3> , currently unused
 */
function BasicColor(layer, text, tag='h2') { return `<${tag} style='color:${tmp[layer].color};text-shadow:${tmp[layer].color} 0px 0px 10px;'>${text}</${tag}>` }


 /** 
*Perform an Meta-research reset (very obvious)
**/
function MRreset() {
	player.al.x = new Decimal(0)
	player.al.deltax = new Decimal(0)
if(!player.g.sacrificeactive[3].gte(1)) {
	player.al.points = player.al.points.times(0)
	player.al.upgrades.filter(x => x>60)
	
		for (let i = 0 ; i < 12 ; i++) {
			let j = i % 4 + 1
			let k = Math.floor(i / 4) * 10 + 10
			let l = j + k 
			player.al.buyables[l] = new Decimal(0)
		}
  
	//reset algebra (extension phase)
	player.al.extension = new Decimal(0)
	player.al.operation = new Decimal(0)    
	}
	
	player.al.resetcooldown = new Decimal(4)

	//reset Research
	player.r.points = new Decimal(0)
	if(!hasMilestone('g',1)) {
	buyBuyable('r',11)
	for (let i = 0; i < player.r.milestones.length; i++) {
		
		player.r.milestones.splice(i, 1);
		i--;
	
	}	
	}
	if(!hasMilestone('g',2)) {
	player.r.prestigetime = new Decimal(0)
	}
	doReset('e',true)
}
/** 
*Add an achievement (obviously)
**/
function addAchievement(layer , id) {
	if(hasAchievement(layer , id)) return 
 	player[layer].achievements = [... new Set(player[layer].achievements.concat(String(id)))]
	doPopup("achievement", tmp[layer].achievements[id].name, "Achievement reached", 3, tmp[layer].color)
}
/**
 * Bits tree import follow these rule :
 * (Basic) formatting should follow : ID:levels
 * (I) you need to actually have enough MB to buy them 
 * (II) you need to physically unlocked them first , following this rules : 
 * (1) Default : Skills 11 are always unlocked
 * (2) Resource choice : Skills 21,22,23,31,32 and 33 requires 2 or more level of Skills 11 
 * (3) Resource choice II : Starting at skills 31,32 and 33 - Having 2 levels of skills n unlock skills n+10 ; until skills 71 , 72 and 73  
 * (4) Powerful Perk : Having 2 levels of skills 71,72 and 73 unlock an optional powerful perk 81
 * (5) Pace split : Having skills 71,72 and 73 additionally unlock skills 91,92,93 but only one can be bought with Bits upgrade 'Additional depth' 
 */ 
function BitTreeCheckErrorMsg(importString) {
  const pairs = importString.split(',');

  //Set do not allow duplicates
  const skillIds = new Set();
  const skillLevels = {}; //new Object
  let totalCost = d(0)
  //RegEx to check
  const pairRegex = /^(\d+):(\d+)$/;
  //Check for import violation
  for (const pair of pairs) {
    const match = pairRegex.exec(pair);

    if (!match) {
      return 'Invalid characters: ' + pair;
    }

    const skillId = parseInt(match[1]);
    const skillLevel = parseInt(match[2]);

    // Check if exist , of course there's a false postive
    if (!tmp.n.buyables.hasOwnProperty(skillId) || skillId === 10) {
      return 'Skill ID not found: ' + skillId;
    }

    // Check duplicates
    if (skillIds.has(skillId)) {
      return 'Duplicate skill ID: ' + skillId;
    }

    // Check if actually in range of 0 to whatever that purchase limit might be
    if (skillLevel < 0 || skillLevel > (toNumber(tmp.n.buyables[skillId].purchaseLimit))) {
      return 'Invalid skill level: ' + skillLevel + ' for skill ID ' + skillId;
    }

    skillIds.add(skillId);
	skillLevels[skillId] = skillLevel;
  }
  //Check for rule (I) violations , cost exceeding total
  for (const pair of pairs) {
    const [skillId, skillLevel] = pair.split(":");
    totalCost = totalCost.add(new Decimal(skillLevel).times(tmp.n.buyables[skillId].cost));
	
  }
  	console.log(totalCost)
  	if(totalCost.gt(player.g.totalmetabits)) return 'Not enough Metabits: ('+format(player.g.totalmetabits,0)+'/'+format(totalCost,0)+')'
  //Check for rule (II) violations , pre-requirements
  for (const pair of pairs) {
	const [skillId, skillLevel] = pair.split(":");
	if(skillId>=91 && !hasUpgrade('n',74)) return 'Skills '+skillId+' is locked (Not having "Additional depth")'
	if(isSkillUnlocked(skillId,skillLevels) === null) return 'Skills '+skillId+' cannot be bought due to exclusivity'
	if(!isSkillUnlocked(skillId,skillLevels)) return 'Cannot reach skill '+skillId+''
  }

  return '';
}
function isSkillUnlocked(skillId, skillTree) {
	skillId = parseInt(skillId)
	// Rule (II).1
	if (skillId === 11) {
	  return true;
	}
  
	// Rule (II).2
	if (skillId >= 21 && skillId <= 33 && skillTree[11] >= 2) {
	  return true;
	}
  
	// Rule (II).3
	if (skillId >= 31 && skillId <= 73) {
	  const prerequisiteSkillId = skillId - 10;
	  return skillTree[prerequisiteSkillId] >= 2;
	}
	// Rule (II).4
	if (skillId === 81) {
		try {
			if(skillTree[71] >= 2 && skillTree[72] >= 2 && skillTree[73] >= 2) return true
			else return false
		} catch (e) {
			return false
		}
	}
	// Rule (II).5
	if (skillId >= 91 && skillId <= 93) {
		let other = [91,92,93].filter(x => x!==skillId)
		const prerequisiteSkillId = skillId - 20;
		for (let i = 0; i < other.length; i++) {
			if(skillTree[parseInt(other[i])] > 0) return null
			else continue
		} 
		return skillTree[prerequisiteSkillId] >= 2 && hasUpgrade('n',74)
	}
	// Rule (II).3 and 5 extended 
	if (skillId >= 101 && skillId <= 103) {
		const prerequisiteSkillId = skillId - 10;
		return skillTree[prerequisiteSkillId] >= 2 && hasUpgrade('n',74)
	}
	return false;
  }
  function BitsTreeImport() {
	showModal('Paste your Bits tree string here (Do not add empty space)','You need an empty Bittree otherwise you are forced to Meta-reset',{ textBox: true , confirmButton: true , textColor: 'aqua'} , BitsTreeImport2)
  }
  function BitsTreeImport2(imported = undefined) {
	imported = String(modal.textBox.value)
	let msg = BitTreeCheckErrorMsg(imported)
	if(msg === '' && (tmp.r.buyables[110].canAfford || getBuyableAmount('n',11).eq(0))) {
		if(getBuyableAmount('n',11).gte(1)) player.r.buyables[1101] = d(0)
		if(getBuyableAmount('n',11).gte(1)) buyBuyable('r',110)

		const pairs = imported.split(",");
		let totalCost = d(0);	
		for (const pair of pairs) {
			const [skillId, skillLevel] = pair.split(":");
			player.n.buyables[skillId] = new Decimal(skillLevel)
			totalCost = totalCost.add(new Decimal(skillLevel).times(tmp.n.buyables[skillId].cost));
		}
		player.g.spentmetabits = totalCost
		
	} else if (msg === '') {
		doPopup('Machine', 'You cannot Meta-reset!' , 'Bits tree import failed' , 3 , 'red')
	} else {
		doPopup('Machine' , msg , "Bits tree import failed" , 3 , "red")
	}
  }
  function BitsTreeExport(skillTree = tmp.n.buyables) {
	const skillPairs = [];

	for (const skillId in skillTree) {
	  const skillLevel = parseInt(skillTree[skillId].title);
	  if (skillLevel > 0) {
		skillPairs.push(`${skillId}:${skillLevel}`);
	  }
	}
   
	return skillPairs.join(",");
  }
  function BitsTreeImport3(str) {

  }