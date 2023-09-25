addLayer("n", {
    name: "Number", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#7FFFD4",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "numbers", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        multi = new Decimal(1)
        if (hasUpgrade('a', 22)) multi = multi.times(upgradeEffect('a', 22))
        if (hasUpgrade('s', 31)) multi = multi.times(upgradeEffect('s', 31))
        if (hasUpgrade('n', 21)) multi = multi.times(1.5)
        if (hasUpgrade('n', 22)) multi = multi.times(upgradeEffect('n', 22))
        return multi
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "n", description: "N: Reset for Numbers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true} ,
    passiveGeneration() { 
        let numpas = new Decimal("0")
        if (hasUpgrade('s', 33)) numpas = numpas.add(upgradeEffect('s', 33)).times(0.01)
        return numpas },
        doReset(resettingLayer) {
			let keep = [];
			if (hasUpgrade("n", 23) && resettingLayer=="a") keep.push("upgrades")
			if (hasUpgrade("n", 23) && resettingLayer=="s") keep.push("upgrades")
			if (layers[resettingLayer].row > this.row) layerDataReset("n", keep)
        },
    upgrades: {
        11: {
            title: "Counting faster",
            description: "Double your point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Headstart",
            description: "Points gained is based on number",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("n", 11) },
            effect() {
                let eff = player[this.layer].points.add(2).pow(0.5)
                if (hasUpgrade('s', 32)) eff = eff.times(upgradeEffect('s', 32))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        13: {
            title: "Effective counting",
            description: "Points gained boost itself",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("n", 12) },
            effect() {
                let eff = player.points.add(11).log(10)
                if (hasUpgrade('s', 32)) eff = eff.times(upgradeEffect('s', 32))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        14: {
            title: "1st Grade",
            description: "Unlock the layer Addition(a) and Subtraction(s) and x1.2 point gained  ",
            cost: new Decimal(6),
            unlocked() { return hasUpgrade("n", 13) },
        },
        21: {
            title: "Counting much faster",
            description: "1.5x Number gained",
            cost: new Decimal(1.5e6),
            unlocked() { return hasUpgrade("a", 24) },
        },
        22:{
            title: "Reverse increase",
            description: "Points boost number gained",
            cost: new Decimal(8.75e6),
            unlocked() { return hasUpgrade("a", 24)&&hasUpgrade("n", 21) },
            effect() {
                let eff = player.points.add(10).log(10).pow(0.4)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        23:{
            title: "Keeping resource",
            description: "Performing a row 2 reset doesn't reset your number upgrade",
            cost: new Decimal(3.3e7),
            unlocked() { return hasUpgrade("a", 24)&&hasUpgrade("n", 22) },
        },
        24:{
            title: "Potentional Score (end)",
            description: " x1.2 point gained",
            cost: new Decimal(7e7),
            unlocked() { return hasUpgrade("a", 24)&&hasUpgrade("n", 23) },
        },
    },
})

addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "green",                       // The color for this layer, which affects many elements.
    resource: "additives",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(250),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.35,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return (hasUpgrade('n', 14))||player[this.layer].points>0||player.s.points>0||(hasUpgrade('a', 21))||(hasUpgrade('s', 31)) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "a", description: "A: Reset for Additives", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    upgrades: {
        21: {
            title: "Addition",
            description: "Multiply points gained per unspent additives",
            cost: new Decimal(1),
            effect() {
                let eff = player[this.layer].points.add(1)
                let base = new Decimal(1.5)
                if (hasUpgrade('a', 23)) base = base.add(upgradeEffect('a', 23))
                eff = base.pow(eff)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        22: {
            title: "Numberic increase",
            description: "Increase Numbers gained based on additives",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("a", 21) },
            effect() {
                let eff = player[this.layer].points.add(3).pow(0.4)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        23: {
            title: "More addition",
            description: "Addtive upgrade 'Addition' is more effective based on unspent subtraction",
            cost: new Decimal(6),
            unlocked() { return hasUpgrade("a", 22) },
            effect() {
                let eff = player.s.points.add(1).log(10).times(0.1)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+" added to base" }, },
        24: {
            title: "New upgrade",
            description: "Unlock 4 more number upgrade",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade("a", 23) },
            },    
    },
})

addLayer("s", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "red",                       // The color for this layer, which affects many elements.
    resource: "subtractives",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(250),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.35,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return (hasUpgrade('n', 14))||player[this.layer].points>0||player.a.points>0||(hasUpgrade('s', 31))||(hasUpgrade('a', 21)) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "s", description: "S: Reset for Subtractive", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    upgrades: {
        31: {
            title: "Subtract?",
            description: "Increase number gained based on subtractive",
            cost: new Decimal(1),
            effect() {
                let eff = player[this.layer].points.add(2)
                let ex = new Decimal(1.1)
                eff = eff.pow(ex)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        32: {
            title: "Negative to Postive",
            description: "Number upgrade 'Headstart' and 'Effective counting' is boosted based on subtractive",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("s", 31) },
            effect() {
                let eff = new Decimal(1.5).add(player[this.layer].points.times(0.04))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        33: {
            title: "Automatic counting",
            description: "Gain a percentage of your number gained on Number reset per second (based on subtractive)",
            cost: new Decimal(8),
            unlocked() { return hasUpgrade("s", 32) },
            effect() {
                 let eff = new Decimal(5).times(player[this.layer].points.add(1))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"%" }, }
    },
})



