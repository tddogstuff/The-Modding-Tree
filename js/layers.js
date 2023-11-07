
addLayer("t", {
    startData() { return {                  
        unlocked: true,
        points: new Decimal(0), 
        total: new Decimal(0),      
    }},
    infoboxes: {
        lore: {
            title: "Tickspeed",
            body() { return "Tickspeed increase point generation and all layer passive generation unless stated . You have "+format(player.t.total)+" total ticks , you gain exactly 1,000 ticks per real-life second"},
        }
    },
    symbol:"T",
    color: "#FFFFFF",                       // The color for this layer, which affects many elements.
    resource: "Tick",            // The name of this layer's main prestige resource.
    row: "side",                           

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points},  // A function to return the current amount of baseResource.

    requires: new Decimal(0),              // The amount of the base needed to  gain 1 of the prestige currency.
    canReset() {return true},
    passiveGeneration() {
        let speed = new Decimal(1)
        return speed.times(1000)
    },

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    effect() {
        let base = new Decimal(1000).times(tmp.r.effect).times(buyableEffect('r',104))
        if (hasUpgrade('t', 11)) base = base.times(upgradeEffect('t', 11))
        if (hasUpgrade('t', 12)) base = base.times(upgradeEffect('t', 12))
        if (hasUpgrade('t', 13)) base = base.times(upgradeEffect('t', 13))
        if (hasUpgrade('t', 14)) base = base.times(upgradeEffect('t', 14))

        let exp = new Decimal(1)
        if(hasUpgrade('t',15)) exp = exp.times(1.1)
        if(hasUpgrade('t',16)) exp = exp.times(upgradeEffect('t',16))

        let total = base.pow(exp)
        return total
    },
    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    upgrades: {
        11: {
            title: "Faster Time I",
            description: "x2 Tickspeed",
            cost: new Decimal(900000),
            effect() {
                return new Decimal(2)
            },
            effectDisplay() {return format(upgradeEffect(this.layer,this.id))+"x"}},
        
        12: {
            title: "Faster Time II",
            description: "Tickspeed is increased based on Ticks",
            cost: new Decimal(900000),
            effect() {
                let multiplier1 = player[this.layer].points.div(1000).add(1.1).log(50)
                let multiplier2 = player[this.layer].points.div(1000).add(1).pow(0.04)
                return multiplier1.times(multiplier2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        13: {
            title: "Faster Time III",
            description: "Tickspeed is increased based on Points",
            cost: new Decimal(900000),
            effect() {
                let multiplier1 = player.points.add(10).slog().pow(1.5)
                 return multiplier1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        14: {
            title: "Faster Time IV",
            description: "Tickspeed is increased based on total ticks",
            cost: new Decimal(900000),
            effect() {
                let multiplier1 = player[this.layer].total.div(1000).add(1).pow(2).log(10).times(0.25).add(1)
                 return multiplier1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        15: {
            title: "Faster Time V",
            description: "Tickspeed is ^1.1",
            cost: new Decimal(1800000),
            effect() {
                let multiplier1 = new Decimal(1.1)
                return multiplier1
            },
            unlocked() {return hasUpgrade('a',41)},
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))+"" }, 
        },
        16: {
            title: "Faster Time VI",
            description: "Tickspeed is increased based on itself",
            cost: new Decimal(1800000),
            effect() {
                let multiplier1 = tmp.t.effect.div(1000).add(10).log(10).add(20).log(20)
                 return multiplier1
            },
            unlocked() {return hasUpgrade('a',41)},
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))+"" }, 
        },
        21: {
            title: "Prestige Time I",
            description: "Prestige time/s (Research) is increased by +3",
            cost: new Decimal(1200000),
            unlocked() {return player.r.points>0},
            effect() {
                return new Decimal(3)
            } ,
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+""}
         },
        22: {
            title: "Prestige Time II",
            description: "Prestige time/s (Research) is increased more based on Points",
            cost: new Decimal(1200000),
            unlocked() {return player.r.points>0},
            effect() {
                let a = player.points.add(10).slog()
                return a.times(1.4)
            }, 
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+""}
        },
         23: {
            title: "Prestige Time III",
            description: "Prestige time/s (Research) is increased more based on Mastery",
            cost: new Decimal(1200000),
            unlocked() {return player.r.points>0},
            effect() {
                let mast = player.r.mastery
                return mast.pow(0.2).times(1.1)
            } ,
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+""}
         },
        24: {
            title: "Prestige Time IV",
            description: "Prestige time/s (Research) is increased more based on Multiplicative",
            cost: new Decimal(1200000),
            unlocked() {return player.r.points>0},
            effect() {
                return player.m.points.add(10).slog().times(1.425)
            }, 
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+""}
        },
       
    },
    buyables: {
        11: {
            title() {
             return "Exponent challenge softlock help"
            } ,
            cost(x) { return new Decimal(0) },
            display() { return "Your exponent is set to 0.0001 , this is enough to unlock the exponent tab to exit challenge" },
            canAfford() { return (inChallenge('e',11) || inChallenge('e',12)) },
            buyMax() {return true},
            buy() {
                player.e.points = player.e.points.max(0.0001)
            },
        },
        
    },

    tabFormat:{
        "Main":{
          content: [["main-display","resource-display"],["infobox","lore"],"prestige-button","milestones","upgrades"]
        },
        "Point gained":{
          content: [["display-text", function(){return "Base Point gained : +1.00"}],
          ["display-text",function(){return hasUpgrade('n', 11)?"Counting Faster (Number) : x2.00":""}]
          ,["display-text",function(){return hasUpgrade('n', 12)?"Headstart (Number) : x"+format(upgradeEffect('n',12))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 13)?"1st Grade (Number) : x1.20":""}],
          ["display-text",function(){return hasUpgrade('a', 21)?"Addition (Additive) : x"+format(upgradeEffect('a',21))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 12)?"Effective Counting (Number) : x"+format(upgradeEffect('n',13))+"":""}],
          ,["display-text",function(){return hasUpgrade('n', 24)?"3rd Grade (Number) : x1.20":""}],
          ["display-text",function(){return buyableEffect('m', 11)>1?"Point Boost (Multiplicative) : x"+format(buyableEffect('m',11))+"":""}],
          ["display-text",function(){return hasChallenge('m', 11)?"Square root challenge (Multiplicative) : x"+format(challengeEffect('m',11))+"":""}],
          ["display-text",function(){return player.d.points>0?"Divisive Effect (Divisive) : x"+format(tmp.d.effect)+"":""}],
          ["display-text",function(){return player.e.points>0?"Exponent Effect (Exponent) : x"+format(tmp.e.effect)+"":""}],
          ["display-text", function(){return hasUpgrade('m',43)?"Glazed Point (Multiplicative) : ^1.05":""}],
          ["display-text", function(){return player.e.points>0?"Exponent effect (Exponent) : ^"+format(tmp.e.expeffect)+"":""}]]
        },
        "Softlock Helper": {
            content: [["display-text", function(){return "Use this button to help you get out of some known softlock"}],"buyables"]
        }
        }
    

})
addLayer("n", {
    name: "Number", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00F9FF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "numbers", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        multi = new Decimal(1).times(buyableEffect('r',103))
        if (hasUpgrade('a', 22)) multi = multi.times(upgradeEffect('a', 22))
        if (hasUpgrade('s', 31)) multi = multi.times(upgradeEffect('s', 31))
        if (hasUpgrade('n', 21)) multi = multi.times(1.5)
        if (hasUpgrade('a', 34)) multi = multi.times(1.5)
        if (hasUpgrade('n', 22)) multi = multi.times(upgradeEffect('n', 22))
        if (hasChallenge('m', 12)) multi = multi.times(challengeEffect('m',12))
        if (hasUpgrade('a',44)) multi = multi.times(upgradeEffect('a',44))
        if (player.d.unlocked) multi = multi.times(tmp.d.effect)

        return multi
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (inChallenge('m',12)) exp = exp.times(0.5)
        if (inChallenge('d',11)) exp = exp.times(0)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "n", description: "N: Reset for Numbers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true} ,
    passiveGeneration() { 
        let numpas = new Decimal(0)
        if (hasMilestone('e',2)) numpas = numpas.add(1) 
        if (hasMilestone('r',2)) numpas = numpas.add(1)
        if (hasUpgrade('s', 33)) numpas = numpas.add(upgradeEffect('s', 33)).times(0.01)
        if (hasUpgrade('s', 41)) numpas = numpas.times(upgradeEffect('s', 41))
        return numpas.times(tmp.t.effect.times(0.001)) },
        doReset(resettingLayer) {
			let keep = [];
			if ((hasUpgrade("n", 23) || hasMilestone("e",1)) && resettingLayer=="a") keep.push("upgrades")
			if ((hasUpgrade("n", 23) || hasMilestone("e",1))&& resettingLayer=="s") keep.push("upgrades")
            if ((hasUpgrade("n", 23) || hasMilestone("e",1))&& resettingLayer=="m") keep.push("upgrades")
            if ((hasUpgrade("n", 23) || hasMilestone("e",1))&& resettingLayer=="d") keep.push("upgrades")
            if (hasMilestone("e",4) && resettingLayer=="a") keep.push("points")
			if (hasMilestone("e",4) && resettingLayer=="s") keep.push("points")
            if (hasMilestone("e",4) && resettingLayer=="m") keep.push("points")
            if (hasMilestone("e",4) && resettingLayer=="d") keep.push("points")
            if (hasMilestone("e", 1) && resettingLayer=="e") keep.push("upgrades")
			if (layers[resettingLayer].row > this.row) layerDataReset("n", keep)
        },
    infoboxes: {
        lore: {
            title: "Number gained",
            body() {
                return "Base : "+format(player.points.times(0.1).pow(0.5))+" . Multiplier : x"+format(tmp.n.gainMult)+" . Exponent : ^"+format(tmp.n.gainExp)+"" },
        },
    },
    upgrades: {
        11: {
            title: "Counting faster",
            description: "Point gained is x2",
            cost: new Decimal(1),
        },
        12: {
            title: "Headstart",
            description: "Points gained is based on number",
            cost: new Decimal(2),
            tooltip() {
                    return "Bonus : (Number+2)^0.5 </br> Softcap : 100% , Start : 1e100x"
            },
            unlocked() { return hasUpgrade("n", 11) },
            effect() {
                let pow1 = new Decimal("10")
                let startcap1 = new Decimal("1e100")
                let eff = player[this.layer].points.add(2).pow(0.5)
                if (hasUpgrade('s', 32)) eff = eff.times(upgradeEffect('s', 32))
                return softcap(eff,startcap1,1/pow1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        13: {
            title: "Effective counting",
            description: "Points gained boost itself",
            cost: new Decimal(2),
            tooltip: "Bonus : log10(Point+11) ",
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
            description: "Unlock new layer and x1.2 point gained  ",
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
            tooltip: "Bonus : log(Point+10)^0.75",
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
            title: "3rd Grade",
            description: "Unlock new layer and x1.2 point gained",
            cost: new Decimal(7e7),
            unlocked() { return hasUpgrade("a", 24)&&hasUpgrade("n", 23) },
        },
    },
})

addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        startsoftcap: new Decimal(100),
    }},

    color: "#32FF00",                       // The color for this layer, which affects many elements.
    resource: "additives",            // The name of this layer's main prestige resource.
    row: 1,         
    branches:['n']  ,                      // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(250),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.35,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = new Decimal(1)
        if (hasUpgrade('s', 43)) multi = multi.times(upgradeEffect('s', 43).pow(-1))
        if (hasUpgrade('e', 51)) multi = multi.times(upgradeEffect('e', 51).pow(-1)).times(buyableEffect('e',22).pow(-1)).times(buyableEffect('e',24).pow(-1))
        return multi                      
    },
    gainExp() {
        let exp = new Decimal(1).times(new Decimal(1).add(-player.a.points.div(player.a.startsoftcap.max(1)).floor())).max(0)
        return exp
    },

    layerShown() { return (hasUpgrade('n', 14))||player[this.layer].points>0||player.s.points>0||(hasUpgrade('a', 21))||(hasUpgrade('s', 31)) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "a", description: "A: Reset for Additives", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    automate() {
        if(hasUpgrade('m',43)) {
            let start = player.a.startsoftcap
            let maxadditive = (player.points.times(tmp.a.gainMult.pow(-1)).times(1/125).max(2).log(10).add(-new Decimal(2).log(10))).pow(20/27).times(new Decimal(2).log(10).pow(-20/27))
            let final = softcap(maxadditive,start,0.6)
            player.a.points = final
        }
            let base = new Decimal(100)
            if (hasUpgrade('e', 53)) base = base.add(upgradeEffect('e', 53))
            if (hasUpgrade('a', 42)) base = base.add(upgradeEffect('a', 42))


            if (hasChallenge('e', 12)) base = base.times(1.1)
            player.a.startsoftcap = base
    },
    doReset(resettingLayer) {
        let keep = [];
        if ( hasMilestone("e",3) && resettingLayer=="e") keep.push("upgrades")
        if ( hasMilestone("e",3) && resettingLayer=="e" && (inChallenge('e',12) || inChallenge('e',11))) keep.push("points")
        if (layers[resettingLayer].row > this.row) layerDataReset("a", keep)
    },
effect() {
        let base = new Decimal(1.5)
        if (hasUpgrade('a', 23)) base = base.add(upgradeEffect('a', 23))
        if (hasUpgrade('a', 31)) base = base.add(upgradeEffect('a', 31))
        if (hasUpgrade('a', 32)) base = base.add(0.05)
        return base
    },
effectDescription() {
    return "Addition upgrade base : "+format(tmp.a.effect)+""
},
infoboxes: {
    lore: {
        title: "Additive cost",
        body() {
            let max = (player.points.times(tmp.a.gainMult.pow(-1)).times(1/125).max(2).log(10).add(-new Decimal(2).log(10))).pow(20/27).times(new Decimal(2).log(10).pow(-20/27))
            let softcappower = new Decimal(0.6)
            let start = player.a.startsoftcap
            return "You can only buy at most "+format(start)+" additives </br> Autobuyer bypass that limit and could buy "+format(max)+" additives </br> Cost reduction : /"+format(tmp.a.gainMult.pow(-1))+" </br> Softcapped to "+format(softcap(max,start,softcappower))+""  },
    },
},
    upgrades: {
        21: {
            title: "Addition",
            description: "Multiply points gained per unspent additives",
            tooltip() {return "Bonus : "+format(tmp.a.effect)+"^additive"},
            cost: new Decimal(1),
            effect() {
                let eff = player[this.layer].points.add(1)
                let base = tmp.a.effect
                return base.pow(eff)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        22: {
            title: "Numberic increase",
            description: "Increase Numbers gained based on additives",
            tooltip: "Bonus : (additive+3)^0.5",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("a", 21) },
            effect() {
                let eff = player[this.layer].points.add(3).pow(0.5)
                return eff.pow(buyableEffect('e',32))
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        23: {
            title: "More addition",
            description: "Addtive upgrade 'Addition' is more effective based on subtraction",
            tooltip: "Bonus : +0.1log10(s+1) to base . ",
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
        31: {
            title: "Crazed addition",
            description: "'Addition' additive upgrade is more effective based on additives",
            tooltip: "Bonus : +0.07log10(a+1) to base",
            cost: new Decimal(27),
            unlocked() { return hasUpgrade("m" , 51)},
            effect() {
                let eff = player[this.layer].points.add(1).log(10).times(0.07)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+" added to base" }, },
        32: {
            title: "Stronger additive",
            description: "+0.05 to the base of 'Addition' additive upgrade",
            cost: new Decimal(30),
            unlocked() { return hasUpgrade("a", 31) }, },
        33: {
            title: "Multiplier automation",
            description: "Gain a percentage of your multiplicatives passively per seconds (based on additives)",
            tooltip:"Bonus : (a+1)*0.2 % per second",
            cost: new Decimal(33),
            unlocked() { return hasUpgrade("a", 32) },
            effect() {
                let eff = player[this.layer].points.add(1).times(0.2)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"%" }, },
        34: {
            title: "5th Grade",
            description: "Unlock a new layer and x1.5 Number gained",
            cost: new Decimal(35),
            unlocked() { return hasUpgrade("a", 33) },
            },    
        41: {
            title: "Multiplicative Extension",
            description: "Point Boost max level is tripled and unlock additional time upgrade",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('a',42)) base = base.add(10)
                if(hasUpgrade('a',43)) base = base.add(8)
                if(hasUpgrade('a',44)) base = base.add(6)

                return base
            },
            unlocked() { return buyableEffect("e",33)>=1 },},
        42: {
            title: "Delay additive ",
            description: "Additive softcap started later based on Perk Power",
            tooltip:"Bonus : ((Perkpower+2)^1.2)/2 ",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('a',41)) base = base.add(4)
                if(hasUpgrade('a',43)) base = base.add(8)
                if(hasUpgrade('a',44)) base = base.add(6)

                return base
            },
            unlocked() { return buyableEffect("e", 33)>=1 },
            effect() {
                let eff = player.e.perkpower.add(2).pow(1.2).times(1/2).max(1)
                return eff
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+"" }, },
        43: {
            title: "Additive Perk",
            description: "Multiply Perk Point gained based on Additive",
            tooltip:"Bonus : (Additive/2500)+1 ",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('a',41)) base = base.add(4)
                if(hasUpgrade('a',42)) base = base.add(10)
                if(hasUpgrade('a',44)) base = base.add(6)

                return base
            },
            unlocked() { return buyableEffect("e", 33)>=1 },
            effect() {
                let eff = player.a.points.times(0.0004)
                return eff.add(1)
            },
            effectDisplay() { return ""+format(upgradeEffect(this.layer, this.id))+"x" }, },
        44: {
            title: "Spectral Perk",
            description: "Multiply Number gained based on Perk Power",
            tooltip:"Bonus : (Perkpower+1)^10 ",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('a',42)) base = base.add(10)
                if(hasUpgrade('a',43)) base = base.add(8)
                if(hasUpgrade('a',41)) base = base.add(4)

                return base
            },
            unlocked() { return buyableEffect("e", 33)>=1 },
            effect() {
                let eff = player.e.perkpower.add(1).pow(10)
                return eff
            },
            effectDisplay() { return ""+format(upgradeEffect(this.layer, this.id))+"x" }, },
       
    },
})

addLayer("s", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        best:new Decimal(0),
        startsoftcap:new Decimal(100),
    }},

    color: "#FF0000",                       // The color for this layer, which affects many elements.
    resource: "subtractives",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    branches:['n'], 
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(250),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency. (2^x^1.35)
    exponent: 1.35,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                  
        let multi = new Decimal(1)
        if (hasUpgrade('e', 51)) multi = multi.times(upgradeEffect('e', 51).pow(-1)).times(buyableEffect('e',21).pow(-1)).times(buyableEffect('e',24).pow(-1))
        return multi     
    },
    gainExp() {                  
        let exp = new Decimal(1).times(new Decimal(1).add(-player.s.points.div(player.s.startsoftcap.max(1)).floor())).max(0)
        return exp
    },


    layerShown() { return (hasUpgrade('n', 14))||player[this.layer].points>0||player.a.points>0||(hasUpgrade('s', 31))||(hasUpgrade('a', 21)) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "s", description: "S: Reset for Subtractive", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        let keep = [];
        if ( hasMilestone("e",3) && resettingLayer=="e") keep.push("upgrades")
        if ( hasMilestone("e",3) && resettingLayer=="e" && (inChallenge('e',12) || inChallenge('e',11))) keep.push("points")
        if (layers[resettingLayer].row > this.row) layerDataReset("s", keep)
    },
    infoboxes: {
        lore: {
            title: "Subtractive cost",
            body() {
                let max = (player.points.times(tmp.s.gainMult.pow(-1)).times(1/125).max(2).log(10).add(-new Decimal(2).log(10))).pow(20/27).times(new Decimal(2).log(10).pow(-20/27))
                let softcappower = new Decimal(0.6)
                let start = player.s.startsoftcap
                return "You can only buy at most "+format(start)+" subtractives </br> Autobuyer bypass that limit and could buy "+format(max)+" subtractives </br> Cost reduction : /"+format(tmp.s.gainMult.pow(-1))+" </br> Softcapped to "+format(softcap(max,start,softcappower))+""  },
        },
    },
    automate() {
        if(hasUpgrade('m',43)) {
            let start = player.s.startsoftcap
            let maxsubtractive = (player.points.times(tmp.s.gainMult.pow(-1)).times(1/125).max(2).log(10).add(-new Decimal(2).log(10))).pow(20/27).times(new Decimal(2).log(10).pow(-20/27))
            let final = softcap(maxsubtractive,start,0.6)
            player.s.points = final
        }
            let base = new Decimal(100)
            if (hasUpgrade('e', 54)) base = base.add(upgradeEffect('e', 54))


            if (hasChallenge('e', 12)) base = base.times(1.1)
            if (hasUpgrade('s', 53)) base = base.times(1.1)
            player.s.startsoftcap = base
    },
    upgrades: {
        31: {
            title: "Subtract?",
            description: "Increase number gained based on subtractive",
            tooltip: "Bonus : (s+2)^1.11",
            cost: new Decimal(1),
            effect() {
                let eff = player[this.layer].points.add(2)
                let ex = new Decimal(1.11).times(buyableEffect('e',31))
                eff = eff.pow(ex)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        32: {
            title: "Negative to Postive",
            description: "Number upgrade 'Headstart' and 'Effective counting' is boosted based on subtractive",
            tooltip: "Bonus : 1.5+0.04s multi to both upgrade" ,
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
            tooltip: "Bonus : 5(s+1) % per second",
            cost: new Decimal(8),
            unlocked() { return hasUpgrade("s", 32) },
            effect() {
                 let eff = new Decimal(5).times(player[this.layer].points.add(1))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"%" }, },
        41: {
            title: "Faster automation",
            description: "Multiply Number gained from passive generation based on subtractive",
            cost: new Decimal(11),
            unlocked() { return hasUpgrade("m", 44) },
            tooltip: "Bonus : (s+2)^0.75 multi",
            effect() {
                 let eff = player[this.layer].points.add(2).pow(0.75)
                 if(hasUpgrade('s',51)) eff = eff.pow(upgradeEffect('s',51))
                 if(hasUpgrade('s',42)) eff = eff.pow(upgradeEffect('s',42))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        42: {
            title: "Stronger Subtraction",
            description: "All Upgrade in this row stronger based on subtractives",
            tooltip: "Raise the effect of all upgrade in this row by +0.5% per subtractives , capped at +20%",
            cost: new Decimal(14),
            unlocked() { return hasUpgrade("s", 41) },
            effect() {
                let point = player[this.layer].points.max(0).times(0.5).min(20)
                let multi = new Decimal(1).add(point.times(0.01))
                return multi
            } ,
            effectDisplay() {return format(upgradeEffect(this.layer,this.id))+"x"}},
        43: {
            title: "Additive cheapener",
            description: "Divide the cost of additives based on subtractives",
            cost: new Decimal(15),
            tooltip: "Bonus : (2s+1)^(0.5s+1) </br> Exponent no longer increase beyond ^14",
            unlocked() { return hasUpgrade("s", 42) },
            effect() {
                 let eff = player[this.layer].points.add(1).times(2)
                 let power = player[this.layer].points.times(0.5).add(1).min(14)
                 let effect1 = eff.pow(power)
                 if(hasUpgrade('s',42)) effect1 = effect1.pow(upgradeEffect('s',42))
                return effect1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        51: {
            title: "Fastest Automation",
            description: "The upgrade above is raised based on subtractive",
            tooltip:"Bonus : ^ 1+0.02subtractive ",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('s',52)) base = base.add(9)
                if(hasUpgrade('s',53)) base = base.add(15)

                return base
            },
            unlocked() { return buyableEffect("e", 34)>=1 },
            effect() {
                let eff = player.s.points.times(0.02).add(1)
                return eff
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))+"" }, },
        52: {
            title: "Easier Exponent",
            description: "Exponent cost scaling is x0.99",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('s',51)) base = base.add(12)
                if(hasUpgrade('s',53)) base = base.add(15)

                return base
            },
            pay() {return },
            unlocked() { return buyableEffect("e", 34)>=1 }, },
        53: {
            title: "Slow Subtractive",
            description: "Subtractive softcap start x1.1 later",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('s',52)) base = base.add(9)
                if(hasUpgrade('s',51)) base = base.add(12)

                return base
            },
            unlocked() { return buyableEffect("e", 34)>=1 }, },
    
    },
})

addLayer("m", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
    }},

    color: "#29AC7F",                       // The color for this layer, which affects many elements.
    resource: "multiplicative",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    branches:['n'], 
    baseResource: "numbers",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.n.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e8),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = new Decimal(1).times(buyableEffect('r',101))
        multi.times("e-8")
        if (hasUpgrade('m', 42)) multi = multi.times(2)

        return multi 
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return (hasUpgrade('n', 24))||player[this.layer].points>0||player.d.points>0 },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "m", description: "M: Reset for Multiplicative", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    passiveGeneration() { 
        let numpas = new Decimal(0)
        if (hasMilestone('r',2)) numpas = numpas.add(1)
        if (hasUpgrade('a', 33)) numpas = numpas.add(upgradeEffect('a', 33)).times(0.01)
        if (hasMilestone('e',2)) numpas = numpas.add(1)
        return numpas.times(tmp.t.effect.times(0.001)) },
    infoboxes: {
    lore: {
        title: "Multiplicative gained",
        body() {
            return "Base : "+format(player.n.points.times("e-8").pow(0.5))+" . Multiplier : x"+format(tmp.m.gainMult)+""  },
    },
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("e",5) && resettingLayer=="e") keep.push("challenges")
        if (hasMilestone("e",6) && resettingLayer=="e")  keep.push("upgrades")
        if (hasMilestone("e",7) && resettingLayer=="e" && (inChallenge('e',12) || inChallenge('e',11))) keep.push("points")
        if (layers[resettingLayer].row > this.row) layerDataReset("m", keep)
    },
    buyables: {
        11: {
            title() {
             return +format(getBuyableAmount(this.layer, this.id), 0) + "<br/> Point Boost"
            } ,
            cost(x) { return new Decimal(2).pow(x) },
            display() { return "Multiply point gained by " + format(this.effect()) +"x </br> Cost : " + format(this.cost()) + " Multiplicative" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buyMax() {return true},
            tooltip() {
                let exp = new Decimal(0.7)
                if(hasUpgrade('m',52)) exp = exp.times(1.3)
                if(hasUpgrade('m',54)) exp = exp.times(1.4)
                if(hasChallenge('d',12)) exp = exp.times(1.15)
                return "Base :  (level+1) </br> Exponent : "+format(exp)+"log10(level+10)  "},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.add(1).pow(0.7)
                let exp = x.add(10).log(10)
                if(hasUpgrade('m',52)) exp = exp.times(1.3)
                if(hasUpgrade('m',54)) exp = exp.times(1.4)
                if(hasChallenge('d',12)) exp = exp.times(1.15)
                return base.pow(exp)
            },
            purchaseLimit() {
                let base = new Decimal(100)
                if(hasUpgrade('a',41)) base = base.times(3)
                return base
            },
            buymax:true,

        },
        
    },
    challenges: {
        11: {
            name: "Fatigued",
            challengeDescription: "Square root point gained" ,
            goalDescription: "Reach 1e9 point",
            rewardDescription: "Point gained are boosted based on multiplicative",
            rewardEffect() {
                let m = player[this.layer].points.add(4).log(2).pow(1.25)
                return m
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            canComplete: function() {return player.points.gte("1e9")},
        },
        12: {
            name: "Halted Counter",
            challengeDescription: "Square root number gained" ,
            goalDescription: "Reach 1e9 number",
            rewardDescription: "Number gained are boosted based on multiplicative",
            rewardEffect() {
                let m = player[this.layer].points.add(3.5).log(2).pow(2)
                return m
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            canComplete: function() {return player.n.points.gte("1e9")},
        },
        },


    
    upgrades: {
        41: {
            title: "Number increase",
            description: "x1.5 Number gained",
            cost: new Decimal(1),
        },
        42: {
            title: "Increased multiplicative",
            description: "x2 Multiplicatives gained",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("m", 41) }, },

        43: {
            title: "Glazed Point",
            description: "^1.05 Points gained . Automate additive and subtractive ",
            cost: new Decimal(20),
            unlocked() { return hasUpgrade("m", 42) },
            },            
        44: {
            title: "Minus Upgrade",
            description: "Unlock 3 more subtractive upgrade",
            cost: new Decimal(60),
            unlocked() { return hasUpgrade("m", 43) },
            },    
        51: {
            title: "Additive upgrade",
            description: "Unlock 3 more additive upgrade",
            cost: new Decimal(2500),
            unlocked() { return hasUpgrade("m", 44) },},
        52: {
            title: "Greater Boost",
            description: "'Point Boost' multiplicative buyable effect is ^1.30",
            cost: new Decimal(40000),
            unlocked() { return hasUpgrade("m", 51) },},
        53: {
            title: "Automatic Division",
            description: "Gain a percentage of your divisive gained on reset per second (based on multiplicative)",
            tooltip: "Bonus : 2log10(m+11) % of Divisive per second",
            cost: new Decimal("1e16"),
            unlocked() { return hasChallenge("d", 11) },
            effect() {
                 let eff = (player[this.layer].points.add(11).log(10).times(2))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"%" }, },
        54: {
            title: "Greatest Boost",
            description: "'Point Boost' multiplicative buyable effect is ^1.40",
            cost: new Decimal("4e16"),
            unlocked() { return hasUpgrade("m", 53) },},
        61: {
            title: "Strange 5",
            description: "Multiply your point gained by 5x",
            cost: new Decimal("1.6e17"),
            unlocked() { return hasUpgrade("m", 54) }, },
        62: {
            title: "Better effect ",
            description: "Divisior effect is 5% more effective",
            cost: new Decimal("6.4e17"),
            unlocked() { return hasUpgrade("m", 61) }, }
    },
})

addLayer("d", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#822B2B",                       // The color for this layer, which affects many elements.
    resource: "divisive",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "numbers",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.n.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e18),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,
    branches:['n'],                           // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = new Decimal(1).times(buyableEffect('r',102))
        multi.times("e-18")
        return multi 
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return (hasUpgrade('a', 34))||player[this.layer].points>0},          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "d", description: "D: Reset for Divisive", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    power() {
        let power = new Decimal(0.5)
        if (hasUpgrade('m', 62)) power = power.times(1.05)
        return power
    },

    effect() {   
        let power = new Decimal(0.5)
        if (hasUpgrade('m', 62)) power = power.times(1.05)
        return Decimal.pow(player[this.layer].points.add(1),power)
    },
    effectDescription() {
        return " which is boosting Point and Number gained by " + format(tmp.d.effect) +"x"
    },
    passiveGeneration() { 
        let numpas = new Decimal(0)
        if (hasMilestone('r',2)) numpas = numpas.add(1)
        if (hasUpgrade('m',53)) numpas = numpas.add(upgradeEffect('m', 53)).times(0.01)
        if (hasMilestone('e',2)) numpas = numpas.add(1)
        return numpas.times(tmp.t.effect.times(0.001)) },
    infoboxes: {
    lore: {
        title: "Divisive gained",
        body() {
            return "Base : "+format(player.n.points.times("e-18").pow(0.5))+" . Multiplier : x"+format(tmp.d.gainMult)+""  },
    },
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("e",5) && resettingLayer=="e") keep.push("challenges")
        if (hasMilestone("e",6) && resettingLayer=="e") keep.push("upgrades")
        if (hasMilestone("e",7) && resettingLayer=="e" && (inChallenge('e',12) || inChallenge('e',11))) keep.push("points")
        if (layers[resettingLayer].row > this.row) layerDataReset("d", keep)
    },

    

    challenges: {
        11: {
            name: "No counting",
            challengeDescription: "Number cannot be gained" ,
            goalDescription: "Reach 4.85e30 points",
            rewardDescription: "Unlock 4 more multiplicative upgrade",
            canComplete: function() {return player.points.gte("4.85e30")},
            unlock() {return true},
        },
        12: {
            name: "Worsen condition",
            challengeDescription: "All Point multiplier become log(multi)^5" ,
            goalDescription: "Reach 2.09e14 points",
            rewardDescription: "Unlock a new layer and raise Point Boost multiplicative buyable effect by 1.15",
            canComplete: function() {return player.points.gte("2.09e14")},
            unlock() {return true},
        },
        },

}) 

addLayer("e", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        best: new Decimal(0),
        perkpower: new Decimal(0),
        effective: new Decimal(0)
    }},

    color: "#8420EC",                       // The color for this layer, which affects many elements.
    resource: "exponent",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e50),              // The amount of the base needed to  gain 1 of the prestige currency.
    branches:['a','s','d','m'],                                        // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = new Decimal(1).times(buyableEffect('e',23).pow(-1)).times(buyableEffect('e',24).pow(-1))
        if(hasUpgrade('e',63)) multi = multi.pow(1.25)  
        return multi 
    },
    gainExp() {   
        let cont = new Decimal(0.5)
        if (hasUpgrade('e',52)) cont = cont.times(0.75)
        if (hasUpgrade('s',52)) cont = cont.times(0.99)
        if (hasChallenge('e',11)) cont = cont.times(0.98)
        if (hasMilestone('r',1)) cont = cont.times(0.925)
        let base = new Decimal(1).add(-cont)
        let exp = new Decimal(1)      
        let point = player.e.points.min(10)
        let mul = base.pow(point)                    
        return exp.times(mul)
    },

    layerShown() { return (hasChallenge('d', 12))||player[this.layer].points>0},          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "e", description: "E: Reset for Exponent", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    power() {
        let power = new Decimal(0.05)
        return power
    },

    expeffect() {   
        let power = new Decimal(0.05)
        return Decimal.pow(player[this.layer].effective.add(1),power)
    },
    effect() {
        let base = (tmp.e.power).times(100)
        let effect = base.pow(player[this.layer].effective) 
        return effect
    },

    effectDescription() {
        return " which is raising Points gained by ^" + format(tmp.e.expeffect) +" after x"+ format(tmp.e.effect)
    },
    infoboxes: {
        lore: {
            title: "Exponent cost",
            body() {
                return "Base cost : "+format(new Decimal(2).pow(player.e.points.pow(1.5)).times("e50"))+" </br> Exponent cost scaling : ^"+format(tmp.e.gainExp.pow(-1))+" (Based on current Exponent up to 10) </br> Total cost : "+format(new Decimal(2).pow(player.e.points.pow(1.5)).pow(tmp.e.gainExp.pow(-1)).times("e50"))+"  </br> Cost reduction : /"+format(tmp.e.gainMult.pow(-1))+""  },
        },
    },
    automate() {
        hasMilestone('e',6)?player.e.perkpower=buyableEffect('e',12):""
        if(player.e.points>0) {
            let multi = new Decimal(1)
            if(hasMilestone('e',5)) multi = multi.times((player.e.perkpower.add(10)).log(10))
            player.e.effective=player.e.points.times(multi)
        }
        if(hasUpgrade('a',41)) {
            setBuyableAmount('e','11',getBuyableAmount('e',11).max(player.e.points.times(100))) 
        }

        if(hasMilestone('e',6) || hasMilestone('r',1)) {
            buyBuyable('e',11)
            buyBuyable('e',21)
            buyBuyable('e',22)
            buyBuyable('e',23)
            buyBuyable('e',24)
            buyBuyable('e',31)
            buyBuyable('e',32)
            buyBuyable('m',11)
        }
    },
    autoPrestige() {
        return hasMilestone('e',6)
    },


    milestones: {
        1: {
            requirementDescription: "2 Exponent",
            effectDescription: "Keep number upgrade on Exponent reset",
            done() { return player.e.points.gte(2) }
        },
        2: {
            requirementDescription: "4 Exponent",
            effectDescription: "Gain +100% of number , multiplicative , divisive gained per second",
            done() { return player.e.points.gte(4) }
        },
        3: {
            requirementDescription: "5 Exponent",
            effectDescription: "Keep Additive and Subtractive upgrade on Exponent reset",
            done() { return player.e.points.gte(5) }
        },
        4: {
            requirementDescription: "6 Exponent",
            effectDescription: "Row 2 resets no longer reset number ",
            done() { return player.e.points.gte(6) }
        },
        5: {
            requirementDescription: "7 Exponent",
            effectDescription: "Keep Multiplicative and Divisive challenge completion  ",
            done() { return player.e.points.gte(7) }
        },
        6: {
            requirementDescription: "8 Exponent",
            effectDescription: "Keep Multiplicative upgrade , Automate Perk Power update and unlock additional Exponent Perk . Point Boost multiplicative buyable and all Perk are automaticly bought",
            done() { return player.e.points.gte(8)}
        },
        7: {
            requirementDescription: "9 Exponent",
            effectDescription: "Automaticly perform Exponent reset",
            done() { return player.e.points.gte(9) }
        },
        8: {
            requirementDescription: "10 Exponent",
            effectDescription: "Unlock another layer",
            done() { return player.e.points.gte(10) }
        },
        
    },
    upgrades: {
        51: {
            title: "Power Boost",
            description: "Additives and Subtractive cost are divided based on Number ",
            cost: new Decimal(3),
            effect() {
                let eff = player.n.points.pow(0.5).add(1)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
         52: {
            title: "Uncosty Exponent",
            description: "Multiply the cost scaling of exponent by x0.75 ",
            cost: new Decimal(5),},
         53: {
            title: "Delay additive scaling",
            description: "Additive softcap is delayed based on exponent (Base : 100)",
            cost: new Decimal(7),
            effect() {
                let eff = player.e.effective.times(0.5).add(1).pow(1.5)
                return eff
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+" delay" },
        },
        54: {
            title: "Delay subtractitive scaling",
            description: "Subtractive softcap is delayed based on exponent (Base : 100)",
            cost: new Decimal(7),
            effect() {
                let eff = player.e.effective.times(0.5).add(1).pow(1.4)
                return eff
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+" delay" },
        },
        61: {
            title : "Strong Perk",
            description: "Gain 1.08x more Perk Point",
            cost : new Decimal(8),
            unlocked() {return hasMilestone('e',6)},
        },
        62: {
            title : "Powerful Perk",
            description: "Perk Power exponent buyable effect is ^1.08",
            cost : new Decimal(8),
            unlocked() {return hasMilestone('e',6)},
        },
        63: {
            title : "Extra cheap",
            description: "Exponent cost reduction is ^1.25",
            cost : new Decimal(9),
            unlocked() {return hasMilestone('e',7)},
        },
         64: {
            title : "Strengthen Perk",
            description: "Gain 1.07x more Perk Point ",
            cost : new Decimal(9),
            unlocked() {return hasMilestone('e',7)},
        }
    },

    buyables: {
        11: {
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/> Perk Point"
               } ,
            cost(x) { 
                let level = x
                return level.times(0.01).add(0.01)
            },
            display() { return "Gain +" + format(this.effect()) +" Perk Power </br> Require : " + format(this.cost()) + " Exponent " },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buyMax() {return true},
            buy() {
                player[this.layer].points = player[this.layer].points
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.pow(0.3)   
               if(hasUpgrade('e',62)) base = base.pow(1.08)             
                return base
            },
        },
        12: {
            title: "Update Perk Power" ,
            cost(x) { return new Decimal(0) },
            display() { return "Perk Power doesn't automaticly update , it must be updated manually" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            tooltip: "Click to update Perk Power , this will not reset any purchase",
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id))
                player[this.layer].perkpower = this.effect()
            }, 
            effect(x) {
                let a1 = buyableEffect('e',11)
                let sum = a1
                let multi = new Decimal(1)
                if(hasUpgrade('e',61)) multi = multi.times(1.08)
                if(hasUpgrade('a',42)) multi = multi.times(upgradeEffect('a',43))
                if(hasUpgrade('e',64)) multi = multi.times(1.07)  
                if(hasChallenge('e',11)) multi = multi.times(1.14)
                let exponent = new Decimal(1)
                let total = (sum.times(multi)).pow(exponent)
                return total
            },
        },
        13: {
            title: "Lose all exponent" ,
            cost(x) { return new Decimal(0) },
            display() { return "Your exponent is reset to 0 for no benefit at all" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.times(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id))
            }, 
        },
        14: {
            title: "Lose all upgrade" ,
            cost(x) { return new Decimal(0) },
            display() { return "Respec all upgrade in this row" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {

                setBuyableAmount(this.layer, '11', getBuyableAmount(this.layer, this.id).times(0))
                setBuyableAmount(this.layer, '21', getBuyableAmount(this.layer, this.id).times(0))
                setBuyableAmount(this.layer, '22', getBuyableAmount(this.layer, this.id).times(0))
                setBuyableAmount(this.layer, '23', getBuyableAmount(this.layer, this.id).times(0))
                setBuyableAmount(this.layer, '24', getBuyableAmount(this.layer, this.id).times(0))
                setBuyableAmount(this.layer, '31', getBuyableAmount(this.layer, this.id).times(0))
                setBuyableAmount(this.layer, '32', getBuyableAmount(this.layer, this.id).times(0))
                setBuyableAmount(this.layer, '33', getBuyableAmount(this.layer, this.id).times(0))
                setBuyableAmount(this.layer, '34', getBuyableAmount(this.layer, this.id).times(0))
            }, 
        },
        21: {
            title() {
                return +format(getBuyableAmount(this.layer, this.id), 0) + "<br/> Cheaper Subtractive"
               } ,
            cost(x) { return (x.times(0.04).add(1)).pow(1.3) },
            display() { return "Subtractive cost is /" + format(this.effect()) +" </br> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Bonus : 10^((1.2level)^0.8)",
            buy() {
                player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.times(1.2).pow(0.8)                
                let eff = new Decimal(10).pow(base)
                return eff
            },
        },
        22: {
            title() {
                return +format(getBuyableAmount(this.layer, this.id), 0) + "<br/> Cheaper Additive"
               } ,
            cost(x) { return (x.times(0.04).add(1)).pow(1.3) },
            display() { return "Additive cost is /" + format(this.effect()) +" </br> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Bonus : 10^((1.2level)^0.8)",
            buy() {
                player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.times(1.2).pow(0.8)                
                let eff = new Decimal(10).pow(base)
                return eff
            },
        },
        23: {
            title() {
                return +format(getBuyableAmount(this.layer, this.id), 0) + "<br/> Cheaper Exponent"
               } ,
            cost(x) { return (x.times(0.1).add(1)).pow(1.5) },
            display() { return "Exponent cost is /" + format(this.effect()) +" <br/> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Bonus : 10^((3level)^0.85)",
            buy() {
                player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.times(3).pow(0.85)                
                let eff =  new Decimal(10).pow(base)
                return eff
            },
        },
        24: {
            title() {
                return +format(getBuyableAmount(this.layer, this.id), 0) + "<br/> Discounted"
               } ,
            cost(x) { return (x.times(0.2).add(1)).pow(1.5) },
            display() { return "Subtractive , Additive and Exponent cost are /" + format(this.effect()) +" <br/> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Bonus : 10^((6level)^0.9)",
            buy() {
                player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.times(6).pow(0.9)                
                let eff =  new Decimal(10).pow(base)
                return eff
            },
        },
        31: {
            title() {
                return +format(getBuyableAmount(this.layer, this.id), 0) + "<br/> Subtractive Booster"
               } ,
            cost(x) { return (x.times(0.14).add(1)).pow(1.4) },
            display() { return "The effect of Subtract? upgrade is raised ^" + format(this.effect()) +" </br> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Bonus : (0.9level+1)^0.7",
            buy() {
                player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = (x.times(0.9).add(1)).pow(0.7)                
                return base
            },
        },
        32: {
            title() {
                return +format(getBuyableAmount(this.layer, this.id), 0) + "<br/> Additive Booster"
               } ,
            cost(x) { return (x.times(0.1).add(1)).pow(1.2) },
            display() { return "The effect of Numberic Increase upgrade is raised ^" + format(this.effect()) +" </br> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Bonus : (0.9level+1)^0.8",
            buy() {
                player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = (x.times(0.9).add(1)).pow(0.8)                
                return base
            }
        },
        33: {
            title: "Additive upgrader" ,
            cost(x) { return (x.times(6))},
            display() { return "Unlock a new row of additive upgrade </br> Cost : " + format(this.cost()) + " Perk Power" },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Buying any upgrade in that row increase the cost of the other",
            buy() {
                player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x                
                return base
            },
            purchaseLimit:1,
            unlocked() {return hasMilestone('e',6)}
        },
        34: {
            title: "Subtractive upgrader" ,
            cost(x) { return (x.times(6))},
            display() { return "Unlock a new row of subtractive upgrade </br> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Buying any upgrade in that row increase the cost of the other",
            buy() {
                player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x                
                return base
            },
            purchaseLimit:1,
            unlocked() {return hasMilestone('e',6)}
        },
    },
    challenges: {
        11: {
            name: "Equality",
            challengeDescription: "Your Points gained per second cannot exceed square root of number" ,
            goalDescription: "Reach 1e80 points",
            rewardDescription: "x1.14 Perk Point gained , Exponent cost scaling scaling is x0.91 ",
            canComplete: function() {return player.points.gte("1e80")},
            unlock() {return true},
        },
        12: {
            name: "No number",
            challengeDescription: "Point gained are 10^(log(gain)^0.25) which is worsen based on Point . Tickspeed increase the challenge goal" ,
            goalDescription: function() { 
                let base = new Decimal(100000)
                let ts = tmp.t.effect.div(1000).add(1).pow(0.5)

                let goal = base.times(ts)
                return "Reach "+format(goal)+" points"},
            rewardDescription: "Additive and Subtractive softcap start x1.1 later",
            canComplete: function() {
                let goal = new Decimal(100000).times(tmp.t.effect.div(1000).add(1).pow(0.5))
                return player.points.gte(goal)},
            unlock() {return true},
        },
        },

    tabFormat:{
        "Main":{
          content: [["infobox","lore"],["main-display","resource-display"],"prestige-button","milestones","upgrades"]
        },
        "Perk":{
          content: [["infobox","lore2"],["display-text", function(){return "Use your Perk Power to upgrade Perk , your Perk Power can be refilled by updating"}],["display-text",function(){return "You have "+format(player.e.perkpower)+" Perk Power , which is multiplying effective exponent by "+format((player.e.perkpower.add(10)).log(10))+" (Effective exponent : "+format(player.e.effective)+")"}],"buyables"]
        },
        "Challenge": {
          content: [["display-text",function(){return "On Exponent challenge entry , Row 2 resources won't be kept"}],"challenges"]
        },
      }

}) 

addLayer("r", {
    startData() { return {
        //basic data                  
        unlocked: true,                     
        points: new Decimal(0),
        best: new Decimal(0),
        prestigetime: new Decimal(0),
        //mastery 
        mastery: new Decimal(0),
        basemastery : new Decimal(0),
        numbermastery : new Decimal(0),
        additivemastery : new Decimal(0),
        subtractivemastery : new Decimal(0),
        multiplicativemastery : new Decimal(0),
        divisivemastery: new Decimal(0),
        exponentmastery : new Decimal(0),
        researchmastery: new Decimal(0),
        //improvement
        improvementfactor : new Decimal(0),
        deltatime : new Decimal(0),
        //research
        maxupgradetoken: new Decimal(0),
        upgradetoken : new Decimal(0),
        spentupgradetoken: new Decimal(0),
        
    }},

    color: "#5020EC",                       // The color for this layer, which affects many elements.
    resource: "Research",            // The name of this layer's main prestige resource.
    row: 10,                                 // The row this layer is on (0 is the first row).

    baseResource: "exponents",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.e.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.2,                          // "normal" prestige gain is (currency^exponent).
    base:1.1,

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = new Decimal(1)
        return multi 
    },
    gainExp() {   
        let exp = new Decimal(1)                
        return exp
    },

    layerShown() { return (hasMilestone('e', 8))||player[this.layer].points>0},          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "r", description: "R: Reset for Research", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
  
    effect() {
        let exponent = new Decimal(4)
        return player.r.best.add(1).pow(exponent)
    },

    effectDescription() {
        return " which is multipling Tickspeed by x"+format(tmp.r.effect)+" (based on best research)"
    },
    infoboxes: {
        lore: {
            title: "Research cost",
            body() {
                return "Base cost : "+format(new Decimal(1.1).pow(player.r.points.pow(1.2)).times(10))+" . Cost reduction : /"+format(tmp.r.gainMult.pow(-1))+""  },
        },
    },
    automate() {
      let basem = player.points.add(1).pow(2).slog()
      let addm = player.a.points.add(10).log(10)
      let subm = player.s.points.add(10).log(10)
      let mulm = player.m.points.add(1).pow(player.m.points.add(10).log(10)).slog().max(1)
      let divm = player.d.points.add(1).pow(player.d.points.add(10).log(10)).slog().max(1)
      let expm = player.e.effective.add(10).pow(1.5).log(10)
      let resm = player.r.points.add(1).pow(0.45)
      let resm1 = softcap(resm,new Decimal(1.35),0.3)

        player.r.basemastery = basem
        player.r.additivemastery = addm
        player.r.subtractivemastery = subm
        player.r.multiplicativemastery = mulm
        player.r.divisivemastery = divm
        player.r.exponentmastery = expm 
        player.r.researchmastery = resm1
        player.r.mastery = basem.times(addm).times(subm).times(mulm).times(divm).times(expm).times(resm1)


    let dtime = new Decimal(0)
    if(hasUpgrade('t',21)) dtime = dtime.add(upgradeEffect('t',21))
    if(hasUpgrade('t',22)) dtime = dtime.add(upgradeEffect('t',22))
    if(hasUpgrade('t',23)) dtime = dtime.add(upgradeEffect('t',23))
    if(hasUpgrade('t',24)) dtime = dtime.add(upgradeEffect('t',24))
        player.r.deltatime = dtime.div(20)



        player.r.improvementfactor = getBuyableAmount(this.layer, '101').add(getBuyableAmount(this.layer, '102')).add(getBuyableAmount(this.layer, '103')).add(getBuyableAmount(this.layer, '104'))
        },
    update(delta) {
        player.r.prestigetime = player.r.prestigetime.add(delta).add(player.r.deltatime)
    },

    milestones: {
        1: {
            requirementDescription: "1 Research (1)",
            effectDescription: "Always buy all Perk Power buyable and autobuy Additive & Subtractive . Exponent cost scaling is x0.925 ",
            done() { return player.r.points.gte(1) }
        },
        2: {
            requirementDescription: "2 Research (2)",
            effectDescription: "Gain +100% Number , Multiplicative , Divisive passively",
            done() { return player.r.points.gte(2) }
        },
        3: {
            requirementDescription: "4 Research (3)",
            effectDescription: "Keep all Exponent milestone on reset",
            done() { return player.r.points.gte(4) }
        },           
    },
   
    buyables: {
        11: {
            title() {
                   return "Reset all improvement in this tab but lose 25% of your Prestige time"
               } ,
            cost() { return new Decimal(0) },
            canAfford() { return player.points.gte(this.cost())},
            buy() {
                player.r.prestigetime = player.r.prestigetime.times(0.75)
                setBuyableAmount(this.layer, '101', new Decimal(0))
                setBuyableAmount(this.layer, '102', new Decimal(0))
                setBuyableAmount(this.layer, '103', new Decimal(0))
                setBuyableAmount(this.layer, '104', new Decimal(0))

                player.n.points = new Decimal(0)
                player.m.points = new Decimal(0)
                player.d.points = new Decimal(0)

            },

        },
        101: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> More Fatigued  "
               } ,
            cost(x) { 
                let cost = x.add(player.r.improvementfactor)
                return new Decimal("1e10").pow(cost.pow(1.2)).times("1e10") },
            display() { 
            return "You must be inside of Fatigue (Multiplicative) challenge and reached "+format(this.cost())+" points <br/> Effect : Multiply Multiplicative gained by " + format(this.effect()) + "x => "+format(this.nexteffect())+"x (Slowly increasing)  " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('m',11)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(1).div(30)
                let sfctime = softcap(time,new Decimal(2.5),0.5)
                let base = x.times(10).add(1).pow(sfctime)
                let sfcbase = base.pow(0.8)
                return sfcbase                
            },
            nexteffect() {
                let time = player.r.prestigetime.add(1).div(30)
                let sfctime = softcap(time,new Decimal(2.5),0.5)
                let base = getBuyableAmount(this.layer, this.id).add(1).times(10).add(1).pow(sfctime)
                let sfcbase = base.pow(0.8)
                return sfcbase       
            }
        },
        102: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> More Hardness  "
               } ,
            cost(x) {
                let cost = x.add(player.r.improvementfactor)
                 return new Decimal("1e2").pow(cost.pow(1.11)).times("1e3") },
            display() { 
                return "You must be inside of Worsen Condition (Divisive) challenge and reached "+format(this.cost())+" points <br/> Effect : Multiply Divisive gained by " + format(this.effect()) + "x => "+format(this.nexteffect())+"x (Slowly increasing)  " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('d',12)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(1).div(30)
                let sfctime = softcap(time,new Decimal(2.5),0.4)
                let base = x.times(10).add(1).pow(sfctime)
                let sfcbase = base.pow(0.75)
                return sfcbase                
            },
            nexteffect() {
                let time = player.r.prestigetime.add(1).div(30)
                let sfctime = softcap(time,new Decimal(2.5),0.4)
                let base = getBuyableAmount(this.layer, this.id).add(1).times(10).add(1).pow(sfctime)
                let sfcbase = base.pow(0.75)
                return sfcbase       
            }
        },
        103: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> More Equality  "
               } ,
            cost(x) { 
                let cost = x.add(player.r.improvementfactor)
                return new Decimal("1e10").pow(cost.pow(1.21)).times("1e10") },
            display() { 
                return "You must be inside of Equality (Exponent) challenge and reached "+format(this.cost())+" points <br/> Effect : Multiply Number gained by " + format(this.effect()) + "x => "+format(this.nexteffect())+"x (Based on Tickspeed)  " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('e',11)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = tmp.t.effect.div(1000).add(1).pow(0.8)
                let base = time.pow(x).times(time).times(x).add(1)
                let sfcbase = base.pow(time.add(10).log(10).times(0.3).add(1))
                return sfcbase.pow(0.9)                
            },
            nexteffect() {
                let time = tmp.t.effect.div(1000).add(1).pow(0.8)
                let base = time.pow(getBuyableAmount(this.layer,this.id).add(1)).times(time).times(getBuyableAmount(this.layer,this.id).add(1)).add(1)
                let sfcbase = base.pow(time.add(10).log(10).times(0.3).add(1))
                return sfcbase.pow(0.9)   
            }
        },
        104: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> More Letter  "
               } ,
            cost(x) { 
                let cost = x.add(player.r.improvementfactor)
                return new Decimal(5).pow(cost.pow(1.1)).times("1e3") },
            display() { 
                return "You must be inside of No Letter (Exponent) challenge and reached "+format(this.cost())+" points <br/> Effect : Multiply Tickspeed gained by " + format(this.effect()) + "x => "+format(this.nexteffect())+"x (Slowly increasing)  " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('e',12)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(1).log(8)
                let sfctime = time.times(0.8).add(1)
                let base = x.pow(sfctime).add(x)
                let sfcbase = base.add(2).log(2).pow(1.2)
                return sfcbase                
            },
            nexteffect() {
                let time = player.r.prestigetime.add(1).log(8)
                let sfctime = time.times(0.8).add(1)
                let base = getBuyableAmount(this.layer,this.id).add(1).pow(sfctime).add(getBuyableAmount(this.layer,this.id))
                let sfcbase = base.add(2).log(2).pow(1.2)
                return sfcbase                
            },
        },
       
    },

    tabFormat:{
        "Main":{
          content: [["infobox","lore"],["main-display","resource-display"],"prestige-button","milestones","upgrades"]
        },
        "Improvement":{
          content: [
          ["display-text",function(){return "Prestige time : "+formatTime(player.r.prestigetime)+" (+"+format(player.r.deltatime.times(20).add(1))+"s per real-life second)"}],
          ["display-text",function(){return "Improvement require you to gain Points in different challenge . Each Improvement increase the cost of all improvement (including itself)"}]
          ,"buyables"]
        },
        "Mastery breakdown": {
            content :     [
                ["blank", "25px"],
                ["raw-html", function () { return "<h3>Basic Mathmatic " }, { "color": "white", "font-size": "24px", "font-family": "monospace" }],
                ["raw-html", function () { return "<h3>Current points: " + format(player.points) + " -> +" + format(player.r.basemastery) + " mastery"}, { "color": "white", "font-size": "18px", "font-family": "monospace" }],
                ["raw-html", function () { return "<h3>Current additive " + format(player.a.points) + " -> " + format(player.r.additivemastery) + "x mastery"}, { "color": "#32FF00", "font-size": "18px", "font-family": "monospace" }],
                ["raw-html", function () { return "<h3>Current subtractive " + format(player.s.points) + " -> " + format(player.r.subtractivemastery) + "x mastery"}, { "color": "#FF0000", "font-size": "18px", "font-family": "monospace" }],
                ["raw-html", function () { return "<h3>Current multiplicative " + format(player.m.points) + " -> " + format(player.r.multiplicativemastery) + "x mastery"}, { "color": "#29AC7F", "font-size": "18px", "font-family": "monospace" }],
                ["raw-html", function () { return "<h3>Current divisive " + format(player.d.points) + " -> " + format(player.r.divisivemastery) + "x mastery"}, { "color": "#822B2B", "font-size": "18px", "font-family": "monospace" }],
                ["raw-html", function () { return "<h3>Current exponent: " + format(player.e.effective) + "  -> " + format(player.r.exponentmastery) + "x mastery"}, { "color": "#8420EC", "font-size": "18px", "font-family": "monospace" }],
                ["raw-html", function () { return "<h3>Current research: " + format(player.r.points) + "  -> " + format(player.r.researchmastery) + "x mastery"}, { "color": "#5020EC", "font-size": "18px", "font-family": "monospace" }],
                ["blank","25px"],
                ["blank","25px"],
                ["raw-html", function () { return "<h3>Total mastery: " + format(player.r.mastery) + ""}, { "color": "white", "font-size": "18px", "font-family": "monospace" }],

        ]},
      }

}) 
