
addLayer("ac", {
    startData() { return {         
        //general         
        unlocked: true,
        score: new Decimal(0),
    }},
    infoboxes: {
    },
    symbol:"AC",
    color: "#FFFF00",                       // The color for this layer, which affects many elements.
    tooltip:"Achivement",
    row: "side",                           
    type: "none",                         // Determines the formula used for calculating prestige currency.

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    automate() {
        if(hasAchievement('ac',34) && !inChallenge('al',11)) {
            buyUpgrade('n',11)
            buyUpgrade('n',12)
            buyUpgrade('n',13)
            buyUpgrade('n',14)

        }
        if(hasAchievement('ac',36)) {
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
        }
    },
    upgrades: {
       
    },
    buyables: {

        
    },
    achievements: {
        11: {
            name: "The Begining",
            done() { return player.n.points.gte("1") },
            tooltip: "Goal : Get 1 Number . ",
            onComplete() { player.ac.score = player.ac.score.add(1) },
        },
        12: {
            name: "1,2,3,4 and ?",
            done() { return player.n.points.gte("5") },
            tooltip: "Goal : Get 5 Number .",
            onComplete() { player.ac.score = player.ac.score.add(1) },
        },
        13: {
            name: "Twenty five",
            done() { return player.n.points.gte("25") },
            tooltip: "Goal : Get 25 Number .",
            onComplete() { player.ac.score = player.ac.score.add(1) },
        },
        14: {
            name: "Not Addition",
            done() { return player.a.points.gte("1") },
            tooltip: "Goal : Get 1 Additive .",
            onComplete() { player.ac.score = player.ac.score.add(1) },
        },
        15: {
            name: "Not Subtraction",
            done() { return player.s.points.gte("1") },
            tooltip: "Goal : Get 1 Subtractive . ",
            onComplete() { player.ac.score = player.ac.score.add(1) },
        },
        16: {
            name: "3 of additive",
            done() { return player.a.points.gte("3") },
            tooltip: "Goal : Get 3 Additive . ",
            onComplete() { player.ac.score = player.ac.score.add(1) },
        },
        17: {
            name: "3 of minus",
            done() { return player.s.points.gte("3") },
            tooltip: "Goal : Get 3 Subtractive . ",
            onComplete() { player.ac.score = player.ac.score.add(1) },
        },
        18: {
            name: "Equality",
            done() { return player.a.points.eq("5") && player.s.points.eq("5") },
            tooltip: "Goal : Have exactly 5 Subtractive and 5 Additive . Reward : Number gained x1.1 ",
            onComplete() { player.ac.score = player.ac.score.add(1) },
        },
        19: {
            name: "What's Mastery",
            done() { return player.r.bestmastery.gte("10") },
            tooltip() {return "Goal : Reach 10 Mastery . Reward : Multipliy Point gained by "+format(this.effect())+"x (based on Current Mastery)"},
            effect() {
                return player.r.mastery.add(1).pow(0.25)
            },
            onComplete() { player.ac.score = player.ac.score.add(1) },
        },
        21: {
            name: "Subtractive lord",
            done() { return player.s.points.gte("8") },
            tooltip: "Goal : Get 8 Subtractive . Reward : Additive cost /2 ",
            onComplete() { player.ac.score = player.ac.score.add(2) },
        },
        22: {
            name: "Additive legend",
            done() { return player.a.points.gte("10") },
            tooltip: "Goal : Get 10 Additive .",
            onComplete() { player.ac.score = player.ac.score.add(2) },
        },
        23: {
            name: "1 million",
            done() { return player.n.points.gte("1e6") },
            tooltip: "Goal : Get 1e6 Number .",
            onComplete() { player.ac.score = player.ac.score.add(2) },
        },
        24: {
            name: "Nice number!",
            done() { return player.n.points.gte("6.9e7") },
            tooltip: "Goal : Get 6.9e7 Number . Reward : Subtractive cost /10",
            onComplete() { player.ac.score = player.ac.score.add(2) },
        },
        25: {
            name: "Doubling",
            done() { return player.m.points.gte("2") },
            tooltip: "Goal : Get 2 Multiplicative . Reward : Number gained x1.1",
            onComplete() { player.ac.score = player.ac.score.add(2) },
        },
        26: {
            name: "Fifth Doubling",
            done() { return player.m.points.gte("32") },
            tooltip: "Goal : Get 32 Multiplicative . Reward : Multiplicative gained x1.1",
            onComplete() { player.ac.score = player.ac.score.add(2) },
        },
        27: {
            name: "Tenth Doubling",
            done() { return player.m.points.gte("1024") },
            tooltip: "Goal : Get 1 024 Multiplicative . ",
            onComplete() { player.ac.score = player.ac.score.add(2) },
        },
        28: {
            name: "+30 would be insane",
            done() { return player.a.points.gte("25") },
            tooltip: "Goal : Have 30 Additive ",
            onComplete() { player.ac.score = player.ac.score.add(2) },
        },
        29: {
            name: "Division!",
            done() { return player.d.points.gte("1") },
            tooltip() {return "Goal : Get 1 Divisive . Reward : Tickspeed x1.15"},
            onComplete() { player.ac.score = player.ac.score.add(2) },
        },
        31: {
            name: "A lot of Multiplicative",
            done() { return player.m.points.gte("40000") },
            tooltip: "Goal : Reach 40 000 Multiplicative . Reward : Additive cost x0.2",
            onComplete() { player.ac.score = player.ac.score.add(3) },
        },
        32: {
            name: "A lot of Divisive!",
            done() { return player.d.points.gte("40000") },
            tooltip: "Goal : Get 40 000 Divisive . Reward : x2 Number gained",
            onComplete() { player.ac.score = player.ac.score.add(3) },
        },
        33: {
            name: "Actually Multiplin'",
            done() { return player.m.points.gte("1e12") },
            tooltip: "Goal : Get 1e12 Multiplicative . ",
            onComplete() { player.ac.score = player.ac.score.add(3) },
        },
        34: {
            name: "EXPONENTATION!",
            done() { return player.e.points.gte("1") },
            tooltip: "Goal : Reach 1 Exponent . Reward : Automaticly buy the first row of Number upgrade",
            onComplete() { player.ac.score = player.ac.score.add(3) },
        },
        35: {
            name: "MAXED?",
            done() { return player.m.buyables[11].gte("100") },
            tooltip: "Goal : Buy 100 level of 'Point Boost' (x) buyable . Reward : Extend the level limit of 'Point Boost' by 2x ",
            onComplete() { player.ac.score = player.ac.score.add(3) },
        },
        36: {
            name: "More like Google",
            done() { return player.points.gte("1e100") },
            tooltip: "Goal : Have 1e100 Points . Reward : Automaticly buy 'Point Boost' buyable for free",
            onComplete() { player.ac.score = player.ac.score.add(3) },
        },
        37: {
            name: "Third one",
            done() { return player.e.points.gte("3") },
            tooltip: "Goal : Reach 3 Exponent . Reward : x2 Divisive gained",
            onComplete() { player.ac.score = player.ac.score.add(3) },
        },
        38: {
            name: "Literally Eight Exponent",
            done() { return player.e.points.gte("8") },
            tooltip: "Goal : Have 8 Exponent ",
            onComplete() { player.ac.score = player.ac.score.add(3) },
        },
        39: {
            name: "Researcher",
            done() { return player.r.points.gte("1") },
            tooltip() {return "Goal : Have 1 Research . Reward : Tickspeed x2"},
            onComplete() { player.ac.score = player.ac.score.add(3) },
        },
        41: {
            name: "Not tired at all",
            done() { return player.points.gte("1e90") && inChallenge('m',11) },
            tooltip() {return "Reach 1e90 Points in  (x) challenge 'Fatigue' . Reward : that Challenge reward ^"+format(this.effect())+" (based on Multiplicative)"},
            effect() {
                let a = player.m.points.add(10).slog()
                return a
            },
        },
        42: {
            name: "Not even halted",
            done() { return player.n.points.gte("1e9") && player.points.lt("1e20") && inChallenge('m',12) },
            tooltip() {return "Complete (x) challenge 'Halted Counter' while having less than 1e20 Points  . Reward : that Challenge reward ^"+format(this.effect())+" (based on Multiplicative)"},
            effect() {
                let a = player.m.points.add(10).slog()
                return a
            },
        },
        43: {
            name: "Why",
            done() { return player.points.gte("1.78e308") && inChallenge('d',11) },
            tooltip() {return "Reach 1.78e308 Points in (/) challenge 'No Counting'  . Reward : x1.2 Effective Exponent "},

        },
        44: {
            name: "NOT ENOUGH??",
            done() { return player.points.gte("1e20") && inChallenge('d',12) },
            tooltip() {return "Reach 1e20 Points in (/) challenge 'Worsen Condition'   . Reward : x1.2 Effective Exponent "},

        },
        45: {
            name: "Toture",
            done() { return  player.points.gte("1e100") && inChallenge('e',11) },
            tooltip() {return "Reach 1e100 Points in (^) Equality challenge  . Reward : x1.08 Perk Power"},

        },
        46: {
            name: "The Waiting Challenge",
            done() { return   player.points.gte(new Decimal(10000000).times(tmp.t.effect.div(1000).add(1).pow(0.5))) && player.t.tickspeedcontrol.eq(1) && inChallenge('e',12) },
            tooltip() {return "Complete (^) No Number challenge without disabling Tickspeed . Reward : x2 Tickspeed"},

        },
        47: {
            name: "Impossible Challenge",
            done() { return   inChallenge('e',12) && inChallenge('d',12) && player.points.gte("1e9") },
            tooltip() {return "Reach 1e9 Points while inside (^) No Number and (/) Worsen Condition  . Reward : Point Boost (x) buyable effect ^1.5"},

        },
        48: {
            name: "Specfic requirement",
            done() { return   inChallenge('e',12) && inChallenge('d',12) && player.t.tickspeedcontrol.eq(0) && player.points.lte(11000) && player.points.gte(9000) },
            tooltip() {return "Reach 9000 - 11000 Point inside (^) No Number and (/) Worsen Condition while disabling Tickspeed . Reward : Raise Perk Power gained to 1.1"},

        },
        49: {
            name: "No Reality",
            done() { return   inChallenge('e',12) && inChallenge('d',12) && player.t.tickspeedcontrol.eq(0) && player.r.mastery.gte(1000) && player.points.lte(25000) },
            tooltip() {return "Reach 1000 Mastery inside (^) No Number and (/) Worsen Condition while disabling Tickspeed with less than 25000 Point . Reward : x1.1 Effective Exponent , x1.25 Perk Power , x5 Tickspeed"},

        },
        51: {
            name: "Unrelated challenge",
            done() { return   inChallenge('al',11)},
            tooltip() {return "Find a different way to reset Improvement . Reward : 5x to Prestige Time gained "},

        },
        52: {
            name: "True Equality",
            done() { return   player.points.eq(player.n.points)},
            tooltip() {return "Get Number amount EXACTLY equal to Point amount . Reward : Number => Mastery formula is better"},

        },
        53: {
            name: "Canceller term",
            done() { return   player.m.points.eq(player.d.points) && player.m.points.gte(1) && player.d.points.gte(1)},
            tooltip() {return "Get Multiplicative amount EXACTLY equal to Divisive amount while both of them is above 1. Reward : Multiplicative => Mastery formula is better"},

        },
        54: {
            name: "Postivity",
            done() { return   player.a.points.gte(640)},
            tooltip() {return "Get 640 Additive . Reward : Unlock Twilight research"},

        },
        55: {
            name: "Negativity",
            done() { return   player.s.points.gte(600)},
            tooltip() {return "Get 600 Subtractive  . Reward : 'Point Boost' multiplicative buyable cost is ^"+format(this.effect())+" (based on Subtractive) "},
            effect() {
                let subtracti = player.s.points.add(1)
                return subtracti.pow(-0.1)
            }

        },
        56: {
            name: "More Multiplicative content",
            done() { return   player.m.points.gte("1e1000")},
            tooltip() {return "Get 1e1000 Multiplicative . Reward : Unlock 2 more Multiplicative upgrade "},

        },
        57: {
            name: "More Divisive content",
            done() { return   player.d.points.gte("1e1000")},
            tooltip() {return "Get 1e1000 Divisive . Reward : Unlock 1 more Divisive challenge"},

        },
        58: {
            name: "Relativity",
            done() { return   tmp.t.effect.gte("1e15")},
            tooltip() {return "Reach 1e15 Tickspeed/s . Reward : Unlock a tickspeed buyable"},

        },
        59: {
            name: "Old age",
            done() { return   player.r.prestigetime.gte("2628000")},
            tooltip() {return "Reach 1 Month (31 days) worth of Prestige Time . Reward : Unlock 1 more Research Improvement"},

        },
        61: {
            name: "Point Boost++",
            done() { return   player.m.buyables[11].gte(4000)},
            tooltip() {return "Reach 'Point Boost' multiplicative buyable level 4000 . Reward : Unlock 2 more Multiplicative upgrade "},

        },
        62: {
            name: "Elder age",
            done() { return   player.r.prestigetime.gte("31556926")},
            tooltip() {return "Reach 1 Year (~365.25 days) . Reward : All Research Improvement cost increase 10% less when buying any Improvement "},

        },
        63: {
            name: "Number greatness",
            done() { return player.n.points.gte("1e2000")},
            tooltip() {return "Reach 1e2000 Number. Reward : Subtractive softcap start +20 later"},

        },
        64: {
            name: "Its Metain' time",
            done() { return   player.r.mastery.gte(10000)},
            tooltip() {return "Get 10000 Mastery . Reward : Permeantly keep Number upgrade on any reset"},

        },
        65: {
            name: "Slightly more ...",
            done() { return   player.r.mastery.gte(11830)},
            tooltip() {return "Get 11830 Mastery  . Reward : Gain 2 Meta-research instantly"},
            onComplete() {
                player.r.metaresearch = player.metaresearch.add(2)
            },
        },
        66: {
            name: "What's next",
            done() { return   player.e.effective.gte(75)},
            tooltip() {return "Get 75 effective exponent . Reward : Exponent cost reduction is ^1.1"},

        },
        67: {
            name: "Infinite Ticks",
            done() { return   player.t.total.gte("1e9")},
            tooltip() {return "Earned a total of 1e9 Ticks . Reward : x2 Ticks gained"},

        },
        68: {
            name: "Further researchest",
            done() { return   player.r.twilight.gte("1e9")},
            tooltip() {return "Reach 1e9 Twilight . Reward : x2 Twilight gained"},

        },
        69: {
            name: "Repeated Exponentation",
            done() { return   player.e.effective.gte(100)},
            tooltip() {return "Reach 100 effective exponent . Reward : Unlock 1 more reset layer (in Research)"},

        },
     
    },
    microtabs: {
        stuff: {
            "Normal Achivement": {
                buttonStyle() { return { 'color': 'yellow' } },
                unlocked() { return true },
                content: 
    
                    [
             ["raw-html", function () { return "<h3>Normal achivement may give additional reward" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],

            ["microtabs", "normal", { 'border-width': '0px' }],
        ]
    
            },
            "Challenge Achivement": {
                buttonStyle() {return {'color':'red'}},
                content :     [
                    ["raw-html", function () { return "<h3>Challenge achivement require specfic condition to complete and always give additional reward </br> Challenge achivement doesn't always require you to be in any condition" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                    ["microtabs", "challenge", { 'border-width': '0px' }],
    
            ]},
            "Altered Achiveement": {
                buttonStyle() { return { 'color': 'lime' , "border-color" : "green" } },
                unlocked() { return hasUpgrade('al',24) },
                content:
                
                    [
             ["raw-html", function () { return "<h3>Altered achivement require you to be inside of Altered realm and may give additional reward" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],

            ["microtabs", "altered", { 'border-width': '0px' }],
        ]
    
            },
        },
        normal: {
            "Chapter 1": {
                buttonStyle() { return { 'color': 'lime' } },
                unlocked() { return true }, 
                content:[
                    ["blank", "50px"],
                    ["row", [["achievement", 11], ["achievement", 12], ["achievement", 13], ["achievement", 14], ["achievement", 15], ["achievement", 16], ["achievement", 17], ["achievement", 18], ["achievement", 19]]],

                ]
            },
            "Chapter 2": {
                buttonStyle() { return { 'color': 'lime' } },
                unlocked() { return true },
                content: [
                    ["blank", "50px"],
                    ["row", [["achievement", 21], ["achievement", 22], ["achievement", 23], ["achievement", 24], ["achievement", 25], ["achievement", 26], ["achievement", 27], ["achievement", 28], ["achievement", 29]]],

        ]
    
            },
            "Chapter 3": {
                buttonStyle() { return { 'color': 'lime' } },
                unlocked() { return true },
                content: [
                    ["blank", "50px"],
                    ["row", [["achievement", 31], ["achievement", 32], ["achievement", 33], ["achievement", 34], ["achievement", 35], ["achievement", 36], ["achievement", 37], ["achievement", 38], ["achievement", 39]]],

        ]
    
            },
        },
        challenge: {
            "Part 1": {
                buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
                unlocked() { return true },
                content: [
                    ["blank", "50px"],
                    ["row", [["achievement", 41], ["achievement", 42], ["achievement", 43], ["achievement", 44], ["achievement", 45], ["achievement", 46], ["achievement", 47], ["achievement", 48], ["achievement", 49]]],

                ]
    
                    
            },
            "Part 2" : {
                buttonStyle() { return { 'color': 'crimson' , "border-color" : "orange" } },
                unlocked() { return true },
                content: [
                    ["blank", "50px"],
                    ["row", [["achievement", 51], ["achievement", 52], ["achievement", 53], ["achievement", 54], ["achievement", 55], ["achievement", 56], ["achievement", 57], ["achievement", 58], ["achievement", 59]]],

                ]
                
            },
            "Part 3" : {
                buttonStyle() { return { 'color': 'purple' , "border-color" : "orange" } },
                unlocked() { return true},
                content: [
                    ["blank", "50px"],
                    ["row", [["achievement", 61], ["achievement", 62], ["achievement", 63], ["achievement", 64], ["achievement", 65], ["achievement", 66], ["achievement", 67], ["achievement", 68], ["achievement", 69]]],

                ]
            },
    },
    altered: {
        "Tier 1": {
            buttonStyle() { return { 'color': 'green' , "border-color" : "green" } },
            unlocked() { return true },
            content: [
                ["blank", "50px"],
                ["row", [["achievement", 71], ["achievement", 72], ["achievement", 73], ["achievement", 74], ["achievement", 75], ["achievement", 76], ["achievement", 77], ["achievement", 78], ["achievement", 79]]],

            ]

                
        },
        "Tier 2" : {
            buttonStyle() { return { 'color': 'lime' , "border-color" : "green" } },
            unlocked() { return true },
            content: [
                ["blank", "50px"],
                ["row", [["achievement", 81], ["achievement", 82], ["achievement", 83], ["achievement", 84], ["achievement", 85], ["achievement", 86], ["achievement", 87], ["achievement", 88], ["achievement", 89]]],

            ]
            
        },
        "Tier 3" : {
            buttonStyle() { return { 'color': 'cyan' , "border-color" : "green" } },
            unlocked() { return true},
            content: [
                ["blank", "50px"],
                ["row", [["achievement", 91], ["achievement", 92], ["achievement", 93], ["achievement", 94], ["achievement", 95], ["achievement", 96], ["achievement", 97], ["achievement", 98], ["achievement", 99]]],

            ]
        },
}

},

    tabFormat: [
        ["raw-html", function () { return "<h3>Achivement can be earned by reaching specfic goal or requirement " }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Some achivement reward are much better than other" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Some achivement also unlock something new" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
    

})
addLayer("t", {
    startData() { return {                  
        //actual feature
        unlocked: true,
        points: new Decimal(0), 
        total: new Decimal(0),  
        tickspeedcontrol: new Decimal(1),
         
        



    }},
    infoboxes: {
        lore: {
            title: "Tickspeed",
            body() {
            let mas = player.r.bestmastery.add(-100).max(0)
            let multi = mas.times(1000)
            let multi1 = softcap(multi,new Decimal(1000),0.15)
                
                return "Tickspeed increase point generation and basic layer passive generation unless stated . You have "+format(player.t.total)+" total ticks , You gain +"+format(multi1)+" ticks/s (Based on best Mastery)"},
        },
         lore2: {
            title: "Tickspeed Control",
            body() {                
                return "Current tickspeed is ^"+format(player.t.tickspeedcontrol)+" above 1,000"},
        },
        
    },
    symbol:"T",
    color: "#FFFFFF",                       // The color for this layer, which affects many elements.
    resource: "Tick",            // The name of this layer's main prestige resource.
    row: "side",                           


    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points},  // A function to return the current amount of baseResource.

    requires: new Decimal(0),              // The amount of the base needed to  gain 1 of the prestige currency.
    canReset() {return player.r.bestmastery.gte(100)},
    passiveGeneration() {
        let speed = new Decimal(1)
        let mas = player.r.bestmastery.add(-100).max(0)
        let multi = mas.times(1000)
        let multi1 = softcap(multi,new Decimal(1000),0.15)
        return speed.times(multi1)
    },

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0,                          // "normal" prestige gain is (currency^exponent).
    resetDescription:"Why do you even reset point for ",

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    effect() {
        let base = new Decimal(1000).times(player.r.tickspeedbonus).times(buyableEffect('r',104)).times(player.r.ta1)
        if (hasUpgrade('t', 11)) base = base.times(upgradeEffect('t', 11))
        if (hasUpgrade('t', 12)) base = base.times(upgradeEffect('t', 12))
        if (hasUpgrade('t', 13)) base = base.times(upgradeEffect('t', 13))
        if (hasUpgrade('t', 14)) base = base.times(upgradeEffect('t', 14))
        if (hasAchievement('ac', 29)) base = base.times(1.15)
        if (hasAchievement('ac', 39)) base = base.times(2)
        if(hasAchievement('ac',45)) base = base.times(2)
        if(hasAchievement('ac',49)) base = base.times(5)



        let exp = new Decimal(1)
        if(hasUpgrade('t',15)) exp = exp.times(1.1)
        if(hasUpgrade('t',16)) exp = exp.times(upgradeEffect('t',16))

        let total = base.pow(exp)
        let total1 = softcap(total,new Decimal(1000),player.t.tickspeedcontrol)
        if(inChallenge('al',11)) total1 = softcap(total1,new Decimal(1000),player.al.tickspeedreduction1)
        if(inChallenge('al',11)) total1 = total1.div(player.al.tickspeedreduction2)

        if(inChallenge('d',13)) total1 = total1.times(0).add(1000)
        return total1
    },
    

    layerShown() { return player.r.bestmastery.gte(100) },          // Returns a bool for if this layer's node should be visible in the tree.
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
            tooltip: "Multi : log50(tick/1000+1.1)*(tick/1000+1)^0.04",
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
            tooltip:"Multi : slog(point+10)^1.5",
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
            tooltip:"Multi : 0.5log10(totaltick/1000+1)+1",
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
            tooltip:"Exponent : log20(log10(tickspeed/1000+10)+20)",
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
            tooltip:"Bonus : 1.4slog(points+10)",
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
            tooltip:"Bonus : 1.1mastery^0.2",
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
            tooltip:"Bonus : 1.45slog(multiplicative+10)",
            unlocked() {return player.r.points>0},
            effect() {
                return player.m.points.add(10).slog().times(1.45)
            }, 
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+""}
        },
       
    },
    buyables: {
        11: {
            title() {
             return "-1% Tickspeed"
            } ,
            cost() { return new Decimal(0) },
            display() { return "Tickspeed is ^0.99 above 1000" },
            canAfford() { return true },
            buyMax() {return true},
            buy() {
                player.t.tickspeedcontrol = player.t.tickspeedcontrol.times(0.99)
            },
        },
        12: {
            title() {
             return "-5% Tickspeed"
            } ,
            cost() { return new Decimal(0) },
            display() { return "Tickspeed is ^0.95 above 1000" },
            canAfford() { return true },
            buyMax() {return true},
            buy() {
                player.t.tickspeedcontrol = player.t.tickspeedcontrol.times(0.95)
            },
        },
        13: {
            title() {
             return "-25% Tickspeed"
            } ,
            cost() { return new Decimal(0) },
            display() { return "Tickspeed is ^0.75 above 1000" },
            canAfford() { return true },
            buyMax() {return true},
            buy() {
                player.t.tickspeedcontrol = player.t.tickspeedcontrol.times(0.75)
            },
        },
        14: {
            title() {
             return "Disable Tickspeed"
            } ,
            cost() { return new Decimal(0) },
            display() { return "Tickspeed is reduced to 1000/s if higher" },
            canAfford() { return true },
            buyMax() {return true},
            buy() {
                player.t.tickspeedcontrol = player.t.tickspeedcontrol.times(0)
            },
        },
        15: {
            title() {
             return "Normal Tickspeed"
            } ,
            cost() { return new Decimal(0) },
            display() { return "Tickspeed is returned to normal" },
            canAfford() { return true },
            buyMax() {return true},
            buy() {
                player.t.tickspeedcontrol = player.t.tickspeedcontrol.max(1)
            },
        },
        
    },

    tabFormat:{
        "Main":{
          content: [["main-display","resource-display"],["infobox","lore"],"prestige-button","milestones","upgrades"]
        },
        "Point gained":{
          content: [["display-text", function(){return "Base Point gained : +1.00"}],
          ["display-text",function(){return hasAchievement('ac',19)?"What's Mastery (Achievement) : x"+format(achievementEffect('ac',19))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 11)?"Counting Faster (Number) : x"+format(upgradeEffect('n',11))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 12)?"Headstart (Number) : x"+format(upgradeEffect('n',12))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 14)?"1st Grade (Number) : x1.20":""}],
          ["display-text",function(){return hasUpgrade('a', 21)?"Addition (Additive) : x"+format(upgradeEffect('a',21))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 13)?"Effective Counting (Number) : x"+format(upgradeEffect('n',13))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 24)?"3rd Grade (Number) : x1.20":""}],
          ["display-text",function(){return buyableEffect('m', 11)>1?"Point Boost (Multiplicative) : x"+format(buyableEffect('m',11))+"":""}],
          ["display-text",function(){return hasChallenge('m', 11)?"Square root challenge (Multiplicative) : x"+format(challengeEffect('m',11))+"":""}],
          ["display-text",function(){return player.d.points.gt(0)?"Divisive Effect (Divisive) : x"+format(tmp.d.effect)+"":""}],
          ["display-text",function(){return player.e.points.gt(0)?"Exponent Effect (Exponent) : x"+format(tmp.e.effect)+"":""}],
          ["display-text",function(){return buyableEffect('al',33).gt(1)?"Algebric Point boost (Algebra - Field) : x"+format(buyableEffect('al',33))+"":""}],
          ["display-text", function(){return hasUpgrade('m',43)?"Glazed Point (Multiplicative) : ^1.05":""}],
          ["display-text", function(){return player.e.points.gt(0)?"Exponent effect (Exponent) : ^"+format(tmp.e.expeffect)+"":""}],
          ]
        },
        "Tickspeed Control": {
            content: [["infobox", "lore2"],"buyables"]
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
        multi = new Decimal(1).times(buyableEffect('r',103)).times(player.r.la2)
        if (hasAchievement('ac',18)) multi = multi.times(1.1)
        if (hasAchievement('ac',25)) multi = multi.times(1.1)
        if (hasAchievement('ac',32)) multi = multi.times(2)


        if (hasUpgrade('a', 22)) multi = multi.times(upgradeEffect('a', 22))
        if (hasUpgrade('s', 31)) multi = multi.times(upgradeEffect('s', 31))
        if (hasUpgrade('n', 21)) multi = multi.times(1.5)
        if (hasUpgrade('m', 41)) multi = multi.times(1.5)
        if (hasUpgrade('a', 34)) multi = multi.times(1.5)
        if (hasUpgrade('n', 22)) multi = multi.times(upgradeEffect('n', 22))
        if (hasChallenge('m', 12)) multi = multi.times(challengeEffect('m',12))
        if (hasUpgrade('a',44)) multi = multi.times(upgradeEffect('a',44))
        if (hasUpgrade('al',31)) multi = multi.times(4)
        if(inChallenge('d',13)) multi = multi.div(player.points)
        if (player.d.unlocked) multi = multi.times(tmp.d.effect)


        return multi
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (inChallenge('al',11)) exp = exp.times(player.al.alteredpow)
        if (inChallenge('m',12)) exp = exp.times(0.5)
        if(inChallenge('d',13)) exp = exp.times(0.1)
        if (inChallenge('d',11)) exp = exp.times(0)
        return exp
    },
    row: 0, 
    hotkeys: [
        {key: "n", description: "N: Reset for Numbers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true} ,
    resetDescription:"Count for ",
    passiveGeneration() { 
        let numpas = new Decimal(0)
        if (hasMilestone('e',2)) numpas = numpas.add(1) 
        if (hasMilestone('r',2)) numpas = numpas.add(1)
        if (hasUpgrade('s', 33)) numpas = numpas.add(upgradeEffect('s', 33)).times(0.01)
        if (hasUpgrade('s', 41)) numpas = numpas.times(upgradeEffect('s', 41))
        let multi = numpas.times(tmp.t.effect.times(0.001))
        if (hasUpgrade('al',32)) multi = multi.add(1)
        if (inChallenge('d',13)) multi = multi.min(1)

        return multi     },
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
            description() {
                let a = "Point gained is x2 "
                let b = hasUpgrade('al',43)?" . Empowered by Mastery":""
                return  a+b
            },
            cost: new Decimal(1),
            effect() {
                let base = new Decimal(2)
                if(hasUpgrade('al',43)) base = base.pow(player.r.mastery.add(2))
                base1 = softcap(base,new Decimal("1e6"),0.04)
                return base1
            }, 
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        12: {
            title: "Headstart",
            description: "Points gained is based on number",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("n", 11) },
            effect() {
                let pow1 = new Decimal("10")
                let startcap1 = new Decimal("1e100")
                let eff = player[this.layer].points.add(2).pow(0.5)
                if (hasUpgrade('al',41)) eff = eff.pow(1.25)
                if (hasUpgrade('s', 32)) eff = eff.times(upgradeEffect('s', 32))
                return softcap(eff,startcap1,1/pow1)
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
                if (hasUpgrade('al',42)) eff = eff.pow(5)
                if (hasUpgrade('s', 32)) eff = eff.times(upgradeEffect('s', 32))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        14: {
            title: "1st Grade",
            description: "Unlock new layer and x1.2 point gained  ",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("n", 13) },
        },
        21: {
            title: "Counting much faster",
            description: "1.5x Number gained",
            cost() {
                let base = new Decimal(1e6)
                if(hasUpgrade('al',44)) base = base.pow(0.25)
                return base
            },
            unlocked() { return hasUpgrade("a", 24) || hasUpgrade('al',44)},
        },
        22:{
            title: "Reverse increase",
            description: "Points boost number gained",
            cost() {
                let base = new Decimal(8e6)
                if(hasUpgrade('al',44)) base = base.pow(0.25)
                return base
            },
            unlocked() { return hasUpgrade("n", 21) },
            effect() {
                let eff = player.points.add(10).log(10).pow(0.5)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        23:{
            title: "Keeping resource",
            description: "Performing a row 2 reset doesn't reset your number upgrade",
            cost() {
                let base = new Decimal(3e7)
                if(hasUpgrade('al',44)) base = base.pow(0.25)
                return base
            },
            unlocked() { return hasUpgrade("n", 22) },
        },
        24:{
            title: "3rd Grade",
            description: "Unlock new layer and x1.2 point gained",
            cost() {
                let base = new Decimal(7e7)
                if(hasUpgrade('al',44)) base = base.pow(0.25)
                return base
            },
            unlocked() { return hasUpgrade("n", 23) },
        },
        31:{
            title: "[ALTER] Upgrade I",
            description: "+1 Alter Shard",
            cost() {
                let base = new Decimal(500)
                return base
            },
            unlocked() { return inChallenge('al',11) },
        },
        32:{
            title: "[ALTER] Upgrade II",
            description: "+1 Alter Shard",
            cost() {
                let base = new Decimal(500)
                return base
            },
            unlocked() { return inChallenge('al',11) },
        },
    },
    microtabs: {
        stuff: {
            "Main": {
                unlocked() { return true },
                content: 
    [
                    ["blank", "25px"],
                    ["infobox","lore"],
                    ["blank","25px"],
                    "prestige-button",
                    ["blank","25px"],
                    ["row", [["upgrade", 11],["upgrade", 12],["upgrade", 13],["upgrade",14]]],
                    ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade",24]]],
                    ["row", [["upgrade", 31],["upgrade", 32]]],



    ],},
},},
    tabFormat: [
        ["raw-html", function () { return "<h3>You have  " + format(player.n.points)+" Number => +"+format(player.r.basemastery)+" Mastery"}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>You are currently gaining " + format(tmp.n.passiveGeneration.times(getResetGain(this.layer)))+" Number/s" }, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],    
        ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
    layerShown() { return true }
})

addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        startsoftcap: new Decimal(100),
        best: new Decimal(0),
        first: new Decimal(0),
    }},

    color: "#32FF00",                       // The color for this layer, which affects many elements.
    resource: "additives",            // The name of this layer's main prestige resource.
    row: 1,         
    branches:['n']  ,                      // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires(){        
        let base =  new Decimal(250).times((player.s.unlocked&&!player.a.unlocked)?10:1)
        if(inChallenge('al',11)) base = base.div(24.8)
        return base
},                         // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.35,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = new Decimal(1).div(player.r.la3)
        if (hasUpgrade('s', 43)) multi = multi.times(upgradeEffect('s', 43).pow(-1))
        if (hasUpgrade('e', 51)) multi = multi.times(upgradeEffect('e', 51).pow(-1)).times(buyableEffect('e',22).pow(-1)).times(buyableEffect('e',24).pow(-1))
        if (hasAchievement('ac',21)) multi = multi.div(2)
        if (hasAchievement('ac',31)) multi = multi.div(5)
        if(inChallenge('al',11)) multi = multi.pow(player.al.alteredpow)

        return multi                      
    },
    gainExp() {
        let exp = new Decimal(1).times(new Decimal(1).add(-player.a.points.div(player.a.startsoftcap.max(1)).floor())).max(0)
        return exp
    },
    resetDescription:"Increase for ",

    layerShown() { return (hasUpgrade('n', 14))||player[this.layer].best>0||player.s.best>0||(hasUpgrade('a', 21))||(hasUpgrade('s', 31)) },          // Returns a bool for if this layer's node should be visible in the tree.
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
            if(hasChallenge('d',13)) base = base.times(1.5)



            if (hasChallenge('e', 12)) base = base.times(1.1)
            player.a.startsoftcap = base


            player.a.first = new Decimal(0)
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
            if (hasUpgrade('m',42)) {
            var aa = (player.points.times(tmp.a.gainMult.pow(-1)).times(1/125).max(2).log(10).add(-new Decimal(2).log(10))).pow(20/27).times(new Decimal(2).log(10).pow(-20/27))
            } else {
            var aa = player.a.points
            }
            let max = aa
            let softcappower = new Decimal(0.6)
            let start = player.a.startsoftcap
            return "You can only buy at most "+format(start)+" additives </br> Cost reduction : /"+format(tmp.a.gainMult.pow(-1))+" </br> Current additive : "+format(softcap(max,start,softcappower))+""  },
    },
},
    upgrades: {
        21: {
            title: "Addition",
            description: "Multiply points gained per unspent additives",
            tooltip() {
                return "Current base : "+format(tmp.a.effect)+""
            },
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
            cost: new Decimal(4),
            unlocked() { return hasUpgrade("a", 22) },
            effect() {
                let eff = player.s.points.add(1).log(10).times(0.1)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+" added to base" }, },
        24: {
            title: "New upgrade",
            description: "Unlock 4 more number upgrade",
            cost: new Decimal(7),
            unlocked() { return hasUpgrade("a", 23) },
            }, 
        31: {
            title: "Crazed addition",
            description: "'Addition' additive upgrade is more effective based on additives",
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
      microtabs: {
        stuff: {
            "Main": {
                unlocked() { return true },
                content: 
    [
                    ["blank", "25px"],
                    ["infobox","lore"],
                    ["blank","25px"],
                    "prestige-button",
                    ["blank","25px"],
                    ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade",24]]],
                    ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33],["upgrade",34]]],
                    ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43],["upgrade",44]]],



    ],},
},},
    tabFormat: [
        ["raw-html", function () { return "<h3>You have  " + format(player.a.points)+" Additive => x"+format(player.r.additivemastery)+" Mastery"}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
    layerShown() { return true }
})

addLayer("s", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        startsoftcap:new Decimal(100),
        best: new Decimal(0),
        first: new Decimal(0),
    }},

    color: "#FF0000",                       // The color for this layer, which affects many elements.
    resource: "subtractives",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    branches:['n'], 
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires(){
        
        let base =  new Decimal(250).times((player.a.unlocked&&!player.s.unlocked)?10:1)
        if(inChallenge('al',11)) base = base.div(24.8)
        return base
},              
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency. (2^x^1.35)
    exponent: 1.35,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                  
        let multi = new Decimal(1).div(player.r.da3)
        if (hasUpgrade('e', 51)) multi = multi.times(upgradeEffect('e', 51).pow(-1)).times(buyableEffect('e',21).pow(-1)).times(buyableEffect('e',24).pow(-1))
        if (hasAchievement('ac',24)) multi = multi.div(10)
        if(inChallenge('al',11)) multi = multi.pow(player.al.alteredpow)

        return multi     
    },
    gainExp() {                  
        let exp = new Decimal(1).times(new Decimal(1).add(-player.s.points.div(player.s.startsoftcap.max(1)).floor())).max(0)
        return exp
    },
    resetDescription:"Reduce for ",


    layerShown() { return (hasUpgrade('n', 14))||player[this.layer].best>0||player.a.best>0||(hasUpgrade('s', 31))||(hasUpgrade('a', 21)) },          // Returns a bool for if this layer's node should be visible in the tree.
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
        lore:{
        title: "Subtractive cost",
        body() {
            if (hasUpgrade('m',42)) {
            var ss = (player.points.times(tmp.s.gainMult.pow(-1)).times(1/125).max(2).log(10).add(-new Decimal(2).log(10))).pow(20/27).times(new Decimal(2).log(10).pow(-20/27))
            } else {
            var ss = player.s.points
            }
            let max = ss
            let softcappower = new Decimal(0.6)
            let start = player.s.startsoftcap
            return "You can only buy at most "+format(start)+" subtractives </br> Cost reduction : /"+format(tmp.s.gainMult.pow(-1))+" </br> Current subtractives :  "+format(softcap(max,start,softcappower))+""  },
        }
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
            if(hasChallenge('d',13)) base = base.times(1.5)

            player.s.startsoftcap = base




            player.s.first = new Decimal(0)


    },
    upgrades: {
        31: {
            title: "Subtract?",
            description: "Increase number gained based on subtractive",
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
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("s", 31) },
            effect() {
                let eff = new Decimal(2).add(player[this.layer].points.times(0.1))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        33: {
            title: "Automatic counting",
            description: "Gain a percentage of your number gained on Number reset per second (based on subtractive)",
            cost: new Decimal(6),
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
            tooltip: "Effect is reduced after 24 subtractives",
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
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('s',52)) base = base.times(1.15)
                if(hasUpgrade('s',53)) base = base.times(1.15)

                return base.floor()
            },
            unlocked() { return buyableEffect("e", 34)>=1 },
            effect() {
                let eff = player.s.points.times(0.02).add(1)
                return eff
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))+"" }, },
        52: {
            title: "Easier Exponent",
            description: "Exponent cost scaling increase 1% slower per Exponent",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('s',51)) base = base.times(1.15)
                if(hasUpgrade('s',53)) base = base.times(1.15)

                return base.floor()
            },
            pay() {return },
            unlocked() { return buyableEffect("e", 34)>=1 }, },
        53: {
            title: "Slow Subtractive",
            description: "Subtractive softcap start x1.1 later",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('s',52)) base = base.times(1.15)
                if(hasUpgrade('s',51)) base = base.times(1.15)

                return base.floor()
            },
            unlocked() { return buyableEffect("e", 34)>=1 }, },
    
    },
     microtabs: {
        stuff: {
            "Main": {
                unlocked() { return true },
                content: 
    [
                    ["blank", "25px"],
                    ["infobox","lore"],
                    ["blank","25px"],
                    "prestige-button",
                    ["blank","25px"],
                    ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33]]],
                    ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43]]],
                    ["row", [["upgrade", 51],["upgrade", 52],["upgrade", 53]]],



    ],},
},},
    tabFormat: [
        ["raw-html", function () { return "<h3>You have  " + format(player.s.points)+" Subtractive => x"+format(player.r.subtractivemastery)+" Mastery"}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
})

addLayer("m", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        first: new Decimal(0),
    }},

    color: "#29AC7F",                       // The color for this layer, which affects many elements.
    resource: "multiplicative",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    branches:['n'], 
    baseResource: "numbers",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.n.points },  // A function to return the current amount of baseResource.

    requires() {
        let req = new Decimal("1e8")
        if(inChallenge('al',11)) req = req.div(100000)
        return req},              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = new Decimal(1).times(buyableEffect('r',101)).times(player.r.da1)
        if (hasUpgrade('m', 42)) multi = multi.times(2)
        if (hasAchievement('ac',26)) multi = multi.times(1.1)


        return multi 
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        let exp = new Decimal(1)
        if(inChallenge('al',11)) exp = exp.times(player.al.alteredpow)
        return exp
    },
    resetDescription:"Multiply for ",

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
             return +getBuyableAmount(this.layer, this.id) + "<br/> Point Boost"
            } ,
            cost(x) { 
                let increase = x.max(600).sub(600)
                
                return (new Decimal(2).add(increase.times(0.0025))).pow(x) },
            display() { return "Multiply point gained by " + format(this.effect()) +"x </br> Cost : " + format(this.cost()) + " Multiplicative" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buyMax() {return true},
            buy() {
                if(!hasAchievement('ac',36)) {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.add(1).pow(0.7)
                let exp = x.add(10).log(10)
                if(hasUpgrade('m',52)) exp = exp.times(1.3)
                if(hasUpgrade('m',54)) exp = exp.times(1.4)
                if(hasChallenge('d',12)) exp = exp.times(1.15)
                if(hasAchievement('ac',47)) exp = exp.times(1.5)
                if(hasUpgrade('m',63)) exp = exp.times(5)

                return base.pow(exp)
            },
            purchaseLimit() {
                let base = new Decimal(100)
                if (hasAchievement('ac',35)) base = base.times(2)

                if(hasUpgrade('a',41)) base = base.times(3)
                if(hasUpgrade('m',64)) base = base.times("1e100")
                return base
            },
        },
      
        automate() {
            player.m.first = new Decimal(0)
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
                if(hasAchievement('ac',41)) m = m.pow(achievementEffect('ac',41)) 
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
                if(hasAchievement('ac',42)) m = m.pow(achievementEffect('ac',42)) 

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
            description: "^1.05 Points gained and Automate additive and subtractive ",
            tooltip:"Autobuyer buy 1 less additive and subtractive than what you can afford",
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
            description: "Divisior effect is ^1.05",
            cost: new Decimal("6.4e17"),
            unlocked() { return hasUpgrade("m", 61) }, },
        63: {
            title: "Significantly Stronger",
            description: "'Point Boost' multiplicative buyable effect is ^5",
            cost: new Decimal("1e1000"),
            unlocked() { return hasAchievement("ac", 56) }, },
        64: {
            title: "Unlimited Boost",
            description: "'Point Boost' multiplicative buyable max level is uncapped , but cost start to increase much faster above lvl 600",
            cost: new Decimal("1e1050"),
            unlocked() { return hasAchievement("ac", 56) }, }
    },
    microtabs: {
        stuff: {
            "Main": {
                unlocked() { return true },
                content: 
    [
                    ["blank", "25px"],
                    ["infobox","lore"],
                    ["blank","25px"],
                    "prestige-button",
                    ["blank","25px"],
                    ["row", [["buyable", 11]]],
                    ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43],["upgrade",44]]],
                    ["row", [["upgrade", 51],["upgrade", 52],["upgrade", 53],["upgrade",54]]],
                    ["row", [["upgrade", 61],["upgrade", 62],["upgrade", 63],["upgrade", 64]]],
                    ["blank","25px"],
                    "challenges",



    ],},
},},
    tabFormat: [
        ["raw-html", function () { return "<h3>You have  " + format(player.m.points)+" Multiplicative => x"+format(player.r.multiplicativemastery)+" Mastery"}, { "color": "teal", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>You are currently gaining " + format(tmp.m.passiveGeneration.times(getResetGain(this.layer)))+" Multiplicative/s" }, { "color": "teal", "font-size": "22px", "font-family": "helvetica" }],    
        ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
})

addLayer("d", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        best: new Decimal(0),   
        first:new Decimal(0)          // "points" is the internal name for the main resource of the layer.
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
        let multi = new Decimal(1).times(buyableEffect('r',102)).times(player.r.da2)
        if (hasAchievement('ac',37)) multi = multi.times(2)
        return multi 
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        let exp = new Decimal(1)
        if(inChallenge('al',11)) exp = exp.times(player.al.alteredpow)
        return exp
    },
    resetDescription:"Divide for ",
    layerShown() { return (hasUpgrade('a', 34))||player[this.layer].best>0},          // Returns a bool for if this layer's node should be visible in the tree.
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

        let effect = Decimal.pow(player[this.layer].points.add(1),power)
        let effect1 = softcap(effect,new Decimal("1.78e308"),0.2)
        return effect1
    },
    effectDescription() {
        return " which is boosting Point and Number gained by " + format(tmp.d.effect) +"x"
    },
    passiveGeneration() { 
        let numpas = new Decimal(0)
        if (hasUpgrade('m',53)) numpas = numpas.add(upgradeEffect('m', 53)).times(0.01)
        if (hasMilestone('e',2)) numpas = numpas.add(1)
        return numpas.times(tmp.t.effect.times(0.001)) },
    infoboxes: {
    lore: {
        title: "Divisive gained",
        body() {
            return "Base : "+format(player.n.points.times("e-18").pow(0.5))+" . Multiplier : x"+format(tmp.d.gainMult)+""  },
    },
    automate() {
        player.d.first = new Decimal(0)
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
            goalDescription() {
                let base = new Decimal("1e12")
                if(inChallenge('al',11)) base = base.pow(0.000001).times(10)                   
                
                let a = "Reach "+format(base)+" points"
                let b = inChallenge('al',11)?" (Require 10.000 276 3 Points ; Altered realm put a 1 million root to this challenge requirement)":""
                return a+b
            },
            rewardDescription: "Unlock a new layer and raise Point Boost multiplicative buyable effect by 1.15",
            canComplete: function() {
                let base = new Decimal("1e12")
                if(inChallenge('al',11)) base = base.pow(0.000001).times(10)
                return player.points.gte(base)},
            unlock() {return true},
        },
        13: {
            name: "Chaotic division",
            challengeDescription: "(1) Points gained is ^0.2 and cannot exceed number^0.5 . (2) Current Point divide Number gained and vice (3) Number gained are ^0.2 and passive generation is capped at 100%/s (4) Disabled Tickspeed " ,
            goalDescription() {
                let base = new Decimal("1e33")           
                let a = "Reach "+format(base)+" points"
                return a
            },
            onEnter() {
                layerDataReset('n',true)
                layerDataReset('a',true)
                layerDataReset('s',true)
                        },
            onExit() {
                if(player.points.gte("1e33")) {
                player.r.prestigetime = player.r.prestigetime.add(player.r.deltatime.times(600))
                } 
            },
            rewardDescription() { return "Delay additive and subtractive softcap by 1.5x . Gain "+formatTime(player.r.deltatime.times(600))+" in Prestige Time everytime you complete this challenge"},
            canComplete: function() {
                let base = new Decimal("1e33")
                 return player.points.gte(base)},
            unlock() {return hasAchievement('ac',57)},
        },
        },
        microtabs: {
            stuff: {
                "Main": {
                    unlocked() { return true },
                    content: 
        [
                        ["blank", "25px"],
                        ["infobox","lore"],
                        ["blank","25px"],
                        "prestige-button",
                        ["blank","25px"],
                        ["row", [["challenge", 11],["challenge", 12],["challenge", 13]]]
    
    
        ],},
    },},
        tabFormat: [
            ["raw-html", function () { return "<h3>You have  " + format(player.d.points)+" Divisive => x"+format(player.r.divisivemastery)+" Mastery"}, { "color": "crimson", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Divisive provide x"+format(tmp.d.effect)+" to Points and Numbers gained"}, { "color": "crimson", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>You are currently gaining " + format(tmp.d.passiveGeneration.times(getResetGain(this.layer)))+" Divisive/s" }, { "color": "crimson", "font-size": "22px", "font-family": "helvetica" }],    
            ["microtabs", "stuff", { 'border-width': '0px' }],
        ],

}) 

addLayer("e", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        best: new Decimal(0),
        perkpower: new Decimal(0),
        effective: new Decimal(0),
        first: new Decimal(0),
        bonus: new Decimal(1),
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
        if(inChallenge('al',11)) multi = multi.pow(player.al.alteredpow)

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
    resetDescription:"Empower for ",
    effectDescription() {
        return " which is raising Points gained by ^" + format(tmp.e.expeffect) +" after x"+ format(tmp.e.effect)
    },
    infoboxes: {
        lore: {
            title: "Exponent cost",
            body() {
                return "Base cost : "+format(new Decimal(2).pow(player.e.points.pow(1.5)).times("e50"))+" </br> Exponent cost scaling : ^"+format(tmp.e.gainExp.pow(-1))+" (Based on current Exponent , up to 10) </br> Total cost : "+format(new Decimal(2).pow(player.e.points.pow(1.5)).pow(tmp.e.gainExp.pow(-1)).times("e50"))+"  </br> Cost reduction : /"+format(tmp.e.gainMult.pow(-1))+""  },
        },
    },
    automate() {
        hasMilestone('e',6)?player.e.perkpower=buyableEffect('e',12):""
        if(player.e.points>0) {
            let multi = new Decimal(1)
            if(hasMilestone('e',5)) multi = multi.times((player.e.perkpower.add(10)).log(10))
            player.e.bonus = multi
            let multi2 = player.e.bonus.times(buyableEffect('r',403))
            if(hasAchievement('ac',43)) multi2 = multi2.times(1.2) 
            if(hasAchievement('ac',44)) multi2 = multi2.times(1.2)
            if(hasAchievement('ac',49)) multi2 = multi2.times(1.1)
            player.e.effective = player.e.points.times(multi2)
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

        player.e.first = new Decimal(0)
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
            effectDescription: "Keep Multiplicative and Divisive challenge completion , unlock Exponent Perk  ",
            done() { return player.e.points.gte(7) }
        },
        6: {
            requirementDescription: "8 Exponent",
            effectDescription: "Keep Multiplicative upgrade , Automate buying all Perk Power buyable and unlock additional Exponent Perk ",
            done() { return player.e.points.gte(8)}
        },
        7: {
            requirementDescription: "9 Exponent",
            effectDescription: "Automaticly perform Exponent reset , Unlock challenge",
            done() { return player.e.points.gte(9) }
        },
        8: {
            requirementDescription: "10 Exponent",
            effectDescription: "Unlock another layer (Require 200 Best Mastery to keep it) ",
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
                let eff1 = softcap(eff,new Decimal("1e500"),0.25)
                return eff1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
         52: {
            title: "Uncosty Exponent",
            description: "Exponent Cost scaling increase 25% slower (per exponent)",
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
                if(hasAchievement('ac',45)) multi = multi.times(1.08)
                if(hasAchievement('ac',49)) multi = multi.times(1.25)

                let exponent = new Decimal(1)
                if(hasAchievement('ac',49)) exponent = exponent.times(1.1)

                let total = (sum.times(multi)).pow(exponent)
                return total
            },
        },
        13: {
            title: "Lose all exponent" ,
            cost(x) { return new Decimal(0) },
            display() { return "Your exponent is reset to 1 for no benefit at all" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.times(0).add(1)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id))
            }, 
        },
        14: {
            title: "Lose all upgrade" ,
            cost(x) { return new Decimal(0) },
            display() { return "Respec all upgrade in this row , for some reason" },
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
            rewardDescription: "x1.14 Perk Point gained , Exponent cost scaling increase 2% slower per Exponent ",
            canComplete: function() {return player.points.gte("1e80")},
            unlock() {return true},
        },
        12: {
            name: "No number",
            challengeDescription: "Point gained are 10^(log(gain)^0.25) which is worsen based on Point . Tickspeed increase the challenge goal" ,
            goalDescription: function() { 
                let base = new Decimal(10000000)
                let ts = tmp.t.effect.div(1000).add(1).pow(0.5)

                let goal = base.times(ts)
                return "Reach "+format(goal)+" points"},
            rewardDescription: "Additive and Subtractive softcap start x1.1 later",
            canComplete: function() {
                let goal = new Decimal(10000000).times(tmp.t.effect.div(1000).add(1).pow(0.5))
                return player.points.gte(goal)},
            unlock() {return true},
        },
        },

        microtabs: {
            stuff: {
                "Main": {
                    unlocked() { return true },
                    content: 
        [
                        ["blank", "25px"],
                        ["infobox","lore"],
                        ["blank","25px"],
                        "prestige-button",
                        ["blank","25px"],
                        ["row", [["upgrade", 51],["upgrade", 52],["upgrade", 53],["upgrade",54]]],
                        ["row", [["upgrade", 61],["upgrade", 62],["upgrade", 63],["upgrade",64]]],


    
    
        ],},
        "Milestone":{
            unlocked() {return true},
            content: [
                ["blank","25px"],
                "milestones",


            ]
        },
                "Perk":{
                    unlocked() {return hasMilestone('e',5)},
                    content: [
                        ["blank", "25px"],
                        ["raw-html", function () { 
                            return "<h3>You have "+format(player.e.perkpower)+" perk power , which boost Effective Exponent by x"+format(player.e.bonus)+" "}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
                        ["blank","25px"],
                        ["row", [["buyable", 11],["buyable", 12],["buyable", 13],["buyable",14]]],
                        ["row", [["buyable", 21],["buyable", 22],["buyable", 23],["buyable",24]]],
                        ["row", [["buyable", 31],["buyable", 32],["buyable", 33],["buyable",34]]],

                    ]
                },
                "Challenge":{
                    unlocked() {return hasMilestone('e',7)},
                    content: [
                        ["blank","25px"],
                        ["row", [["challenge", 11],["challenge", 12]]],

                    ]
                }
    },},
        tabFormat: [

            ["raw-html", function () { 
                let a = !player.e.perkpower.eq(0)?"("+format(player.e.effective)+" Effective)":""
                return "<h3>You have  " + format(player.e.points)+" "+a+" Exponent => x"+format(player.r.exponentmastery)+" Mastery"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Exponent provide these bonuses :  ^"+format(tmp.e.expeffect)+" and x"+format(tmp.e.effect)+" to Points gained"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["microtabs", "stuff", { 'border-width': '0px' }],
        ],

}) 

addLayer("r", {
    startData() { return {
        //basic data                  
        unlocked: true,                     
        points: new Decimal(0),
        best: new Decimal(0),
        prestigetime: new Decimal(0),
        tickspeedbonus : new Decimal(1),
        first:new Decimal(0),
        //basicmastery 
        bestmastery: new Decimal(0),
        mastery: new Decimal(0),
        basemastery : new Decimal(0),
        numbermastery : new Decimal(0),
        additivemastery : new Decimal(0),
        subtractivemastery : new Decimal(0),
        multiplicativemastery : new Decimal(0),
        divisivemastery: new Decimal(0),
        exponentmastery : new Decimal(0),
        researchmastery: new Decimal(0),
        //algebra field mastery
        functionmastery: new Decimal(0),
        extensionmastery: new Decimal(0),
        operationmastery: new Decimal(0),
        //other source of mastery
        researchmilestone3mastery: new Decimal(0),

        //improvement
        improvementfactor : new Decimal(0),
        deltatime : new Decimal(0),
        //field 
        infield: false,
        currentfield: "",
        algebraf: new Decimal(0),
        geometryf: new Decimal(0),
        geometryunlocked: new Decimal(0),
        //meta research
        metaresearch: new Decimal(0),
        nextmetaresearch : new Decimal(0),

        //dark & light sub , add
        lightadd:new Decimal(0),
        lightaddpersec:new Decimal(0),
        darksub:new Decimal(0),
        darksubpersec:new Decimal(0),
        twilight:new Decimal(0),
        twilightpersec:new Decimal(0),

        la1:new Decimal(1),
        la2:new Decimal(1),
        la3:new Decimal(1),
        lb1:new Decimal(1),
        da1:new Decimal(1),
        da2:new Decimal(1),
        da3:new Decimal(1),
        db1:new Decimal(1),
        ta1:new Decimal(1),
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
        {key: "r", description: "R: Reset for Research", onPress(){if (canReset(this.layer) && !player.r.infield) doReset(this.layer)}},
    ],
  
    effect() {
        let exponent = new Decimal(4)
        return player.r.best.add(1).pow(exponent)
    },

    effectDescription() {
        return " which is multipling Tickspeed by x"+format(tmp.r.effect)+" (based on best research)"
    },
    resetDescription:"Research further for ",
    infoboxes: {
        lore: {
            title: "Research cost",
            body() {
                return "Base cost : "+format(new Decimal(1.1).pow(player.r.points.pow(1.2)).times(10))+" . Cost reduction : /"+format(tmp.r.gainMult.pow(-1))+""  },
        },
    },
    automate() {
      let basem = player.n.points.add(1).pow(2).slog()
      if(hasAchievement('ac',52)) basem = basem.pow(1.1)
      let addm = player.a.points.add(10).log(10)
      let subm = player.s.points.add(10).log(10)
      let mulm = player.m.points.add(1).pow(player.m.points.add(10).log(1.01)).slog().max(1)
      if(hasAchievement('ac',53)) mulm = mulm.pow(1.1)
      let divm = player.d.points.add(1).pow(player.d.points.add(10).log(1.01)).slog().max(1)
      let expm = player.e.effective.add(10).pow(2).log(10).sub(1)
      let resm = player.r.points.add(1).pow(0.45)
      let resm1 = softcap(resm,new Decimal(1.35),0.3)

        let functionm = player.al.value.add(10).slog().pow(1.2)
        let extensionm = player.al.extension.add(10).log(10).add(10).log(10).pow(2)
        let operationm = player.al.operation.add(10).slog().pow(0.33)

        
        player.r.basemastery = basem
        player.r.additivemastery = addm
        player.r.subtractivemastery = subm
        player.r.multiplicativemastery = mulm
        player.r.divisivemastery = divm
        player.r.exponentmastery = expm 
        player.r.researchmastery = resm1
        player.r.functionmastery = functionm
        player.r.extensionmastery = extensionm
        player.r.operationmastery = operationm
        player.r.researchmilestone3mastery = player.r.infield?new Decimal(1.2):new Decimal(1)
        player.r.mastery = basem.times(addm).times(subm).times(mulm).times(divm).times(expm).times(resm1).times(functionm).times(extensionm).times(operationm).times(player.r.researchmilestone3mastery)


    let dtime = new Decimal(1)
    if(hasUpgrade('t',21)) dtime = dtime.add(upgradeEffect('t',21))
    if(hasUpgrade('t',22)) dtime = dtime.add(upgradeEffect('t',22))
    if(hasUpgrade('t',23)) dtime = dtime.add(upgradeEffect('t',23))
    if(hasUpgrade('t',24)) dtime = dtime.add(upgradeEffect('t',24))
    if(hasAchievement('ac',51)) dtime = dtime.times(5)

        player.r.deltatime = dtime



        player.r.bestmastery = player.r.mastery.max(player.r.bestmastery)
        player.r.tickspeedbonus = player.r.points.add(1).pow(4)

        player.r.nextmetaresearch = player.r.mastery.div(10000).pow(0.9)


        

        player.r.improvementfactor = getBuyableAmount(this.layer, '101').add(getBuyableAmount(this.layer, '102')).add(getBuyableAmount(this.layer, '103')).add(getBuyableAmount(this.layer, '104'))



        player.r.first = new Decimal(0)

        if(hasMilestone('r',1) && !inChallenge('al',11) && (!inChallenge('d',13) || hasChallenge('d',13))) {
            //number
            buyUpgrade('n',11)
            buyUpgrade('n',12)
            buyUpgrade('n',13)
            buyUpgrade('n',14)
            buyUpgrade('n',21)
            buyUpgrade('n',22)
            buyUpgrade('n',23)
            buyUpgrade('n',24)
            //additive
            buyUpgrade('a',31)
            buyUpgrade('a',32)
            buyUpgrade('a',33)
            buyUpgrade('a',34)
            buyUpgrade('a',21)
            buyUpgrade('a',22)
            buyUpgrade('a',23)
            buyUpgrade('a',24)
            buyUpgrade('a',41)
            buyUpgrade('a',42)
            buyUpgrade('a',43)
            buyUpgrade('a',44)
            //subtractive
            buyUpgrade('s',31)
            buyUpgrade('s',32)
            buyUpgrade('s',33)
            buyUpgrade('s',41)
            buyUpgrade('s',42)
            buyUpgrade('s',43)
            buyUpgrade('s',51)
            buyUpgrade('s',52)
            buyUpgrade('s',53)
            //multiplicative
            buyUpgrade('m',41)
            buyUpgrade('m',42)
            buyUpgrade('m',43)
            buyUpgrade('m',44)
            buyUpgrade('m',51)
            buyUpgrade('m',52)
            buyUpgrade('m',53)
            buyUpgrade('m',54)
            buyUpgrade('m',61)
            buyUpgrade('m',62)
            //exponent
            buyUpgrade('e',51)
            buyUpgrade('e',52)
            buyUpgrade('e',53)
            buyUpgrade('e',54)
            buyUpgrade('e',61)
            buyUpgrade('e',62)
            buyUpgrade('e',63)
            buyUpgrade('e',64)
        }


        let light = buyableEffect('r',201).times(buyableEffect('r',202)).pow(buyableEffect('r',203))

        let dark =  buyableEffect('r',301).times(buyableEffect('r',302)).pow(buyableEffect('r',303))

        let twi = player.r.lightadd.times(player.r.darksub)

        player.r.lightaddpersec = light.div(player.r.darksub.pow(0.5).add(1)).times(buyableEffect('r',401))
        player.r.darksubpersec = dark.div(player.r.lightadd.pow(0.5).add(1)).times(buyableEffect('r',401))
        player.r.twilightpersec = twi.pow(0.25).div(100)

        let leff1 = player.r.lightadd.pow(player.r.lightadd.add(10).log(10).times(4)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let leff11 = softcap(leff1,new Decimal("1e100"),0.1)
        let leff2 = player.r.lightadd.pow(player.r.lightadd.add(10).log(10).times(6)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let leff21 = softcap(leff2,new Decimal("1e200"),0.5)
        let leff3 = player.r.lightadd.pow(player.r.lightadd.add(10).log(10).times(4).pow(1.5)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let leff31 = softcap(leff3,new Decimal("1e500"),0.25)
        let lred1 = player.r.lightadd.pow(0.5).add(1)
        let deff1 = player.r.darksub.pow(player.r.darksub.add(10).log(10).times(3).pow(1.5)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let deff11 = softcap(deff1,new Decimal("1e800"),0.4)
        let deff2 = player.r.darksub.pow(player.r.darksub.add(10).log(10).times(5)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let deff21 = softcap(deff2,new Decimal("1e500"),0.35)
        let deff3 = player.r.darksub.pow(player.r.darksub.add(10).log(10).times(4).pow(1.625)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let deff31 = softcap(deff3,new Decimal("1e500"),0.275)
        let dred1 = player.r.darksub.pow(0.5).add(1)
        let teff = player.r.twilight.pow(0.25).add(1)
        player.r.la1 = leff11
        player.r.la2 = leff21
        player.r.la3 = leff31
        player.r.lb1 = lred1
        player.r.da1 = deff11
        player.r.da2 = deff21
        player.r.da3 = deff31
        player.r.db1 = dred1
        player.r.ta1 = teff


        },
    update(delta) {
        player.r.prestigetime = player.r.prestigetime.add(player.r.deltatime.times(delta))

        player.r.lightadd = player.r.lightadd.add(player.r.lightaddpersec.times(delta))
        player.r.darksub = player.r.darksub.add(player.r.darksubpersec.times(delta))

        player.r.twilight = player.r.twilight.add(player.r.twilightpersec.times(delta))

    },

    milestones: {
        1: {
            requirementDescription: "1 Research (1)",
            effectDescription: "Always buy (most) Perk Power buyable and autobuy Additive & Subtractive , buy Row 1,2,3 upgrade  . Exponent cost scaling increase 7.5% slower per Exponent ",
            done() { return player.r.points.gte(1) }
        },
        2: {
            requirementDescription: "2 Research (2)",
            effectDescription: "Gain +100% Number , Multiplicative passively . Also keep Number and Row 2 upgrade upgrade on Research reset ",
            done() { return player.r.points.gte(2) }
        }, 
        3: {
            requirementDescription: "3 Research (3)",
            effectDescription: "Gain x1.2 Mastery when inside any field and recieve some bonus when inside any field ",
            done() { return player.r.points.gte(3) }
        },             
    },
    upgrades: {
        11: {
            title: "Simple Number",
            description: "Row 2 Number upgrade is always unlocked and cost ^0.25",
            cost: new Decimal("1"),
            tooltip:"Unlock Row 2 Number upgrade , their upgrade cost is ^0.25 . This doesn't stack with 'Number QOL' algebric upgrade",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         12: {
            title: "Passive Number",
            description: "Gain +100% of Number gained per second , and a 1e9x additional multiplier",
            cost: new Decimal("1"),
            tooltip:"Gain 100% of number gained on reset per second (unaffected by tickspeed)",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch", 
            unlocked() { return true }},
         13: {
            title: "Keep Row2 I",
            description: "Keep additive , subtractive upgrade on ALL reset",
            cost: new Decimal("1"),
            tooltip:"Keep all additive , subtractive upgrade on reset ; Even unlocked one",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         14: {
            title: "Passive Row2 I",
            description: "Autobuy Additive , Subtractive at no cost",
            cost: new Decimal("1"),
            tooltip:"Automaticly gained Additive and Subtractive at no cost",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         15: {
            title: "Keep row2 II",
            description: "Keep multiplicative , divisive upgrade and challenge on reset",
            cost: new Decimal("2"),
            tooltip:"Keep all multiplicative , divisive upgrade on reset ; Also keep challenge completion",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         21: {
            title: "Keep Exponent",
            description: "Keep Exponent upgrade , challenge completion on reset and autobuy Exponent",
            cost: new Decimal("3"),
            currencyLocation() { return player.r },
            tooltip:"Always keep Exponent Upgrade , challenge and even autobuy without reaching their respective milestone",
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         22: {
            title: "Easier Perk",
            description: "Perk Point (Exponent) buyable requirement are /4 . You permeantly unlock Exponent Perk subtab ",
            cost: new Decimal("2"),
            currencyLocation() { return player.r },
            tooltip:"Reduce Perk Point buyable cost by /4 and always unlock Perk subtab without reaching 7 Exponent",
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         23: {
            title: "Mistakeless Research",
            description: "Improvement reset do not decrease Prestige Time",
            cost: new Decimal("2"),
            currencyLocation() { return player.r },
            tooltip:"Resetting Research Improvement do not decrease Prestige Time and don't reset anything",
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         24: {
            title: "Effortless Research",
            description: "Best research boost Tickspped instead of current research",
            cost: new Decimal("4"),
            tooltip:"Tickspeed bonus from Research is calculate using best Research instead",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         31: {
            title: "Passive Extension",
            description: "You gain 10% of Extension gained next reset per second (unaffected by Tickspeed)",
            cost: new Decimal("2"),
            tooltip:"gain 10% of Extension gained next reset in Algebra field",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         32: {
            title: "Easier Extension",
            description: "Automaticly buy all variable upgrade and keep algebric upgrade on Operation reset",
            cost: new Decimal("3"),
            tooltip:"Variable upgrade is autobuyed and always keep algebric upgrade on Operation reset",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         33: {
            title: "Algebric Headstart",
            description: "Start every Algebra field with 1e6 Operation , 1e15 Algebric , 1e4 Extension , 1e6 X value",
            cost: new Decimal("2"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         41: {
            title: "Lightness",
            description: "Light additive is +10% stronger",
            cost: new Decimal("2"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         42: {
            title: "Darkness",
            description: "Dark subtractive is +10% stronger",
            cost: new Decimal("2"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         51: {
            title: "Easier Meta",
            description: "2x Meta Research gained",
            cost: new Decimal("10"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
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
                return new Decimal("1e6").pow(cost.pow(1.45)).times("1e100") },
            display() { 
            return "You must be inside of Fatigue (Multiplicative) challenge and reached "+format(this.cost())+" points <br/> Effect : Multiply Multiplicative gained by " + format(this.per()) + " (Slowly increasing) . Current : x"+format(this.effect())+"  " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('m',11)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(4)
                let base = player.r.prestigetime.pow(time)
                let sfcbase = base.pow(x)
                return sfcbase                
            },
            per() {
                let time = player.r.prestigetime.add(10).log(4)
                let base = player.r.prestigetime.pow(time)
                return base
            }
        },
        102: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> More Hardness  "
               } ,
            cost(x) {
                let cost = x.add(player.r.improvementfactor)
                 return new Decimal(10).pow(cost.pow(1.225)).times("1e9") },
            display() { 
                return "You must be inside of Worsen Condition (Divisive) challenge and reached "+format(this.cost())+" points <br/> Effect : Multiply Divisive gained by " + format(this.per()) + "x  (Slowly increasing) . Current : x"+format(this.effect())+"" },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('d',12)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(100)
                let base = player.r.prestigetime.pow(time).pow(1.25)
                let sfcbase = base.pow(x)
                return sfcbase           
            },
            per() {
                let time = player.r.prestigetime.add(10).log(10)
                let base = player.r.prestigetime.pow(time).pow(1.25)
                return base
            }
        },
        103: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> More Equality  "
               } ,
            cost(x) { 
                let cost = x.add(player.r.improvementfactor)
                return new Decimal("1e5").pow(cost.pow(1.7)).times("1e10") },
            display() { 
                return "You must be inside of Equality (Exponent) challenge and reached "+format(this.cost())+" points <br/> Effect : Multiply Number gained by " + format(this.per()) + "x (Slowly increasing). Current : x"+format(this.effect())+"  " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('e',11)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(10)
                let base = player.r.prestigetime.pow(time).pow(1.02)
                let sfcbase = base.pow(x)
                return sfcbase           
            },
            per() {
                let time = player.r.prestigetime.add(10).log(10)
                let base = player.r.prestigetime.pow(time).pow(1.02)
                return base
            }
        },
        104: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> More Letter  "
               } ,
            cost(x) { 
                let cost = x.add(player.r.improvementfactor)
                return new Decimal(10).pow(cost.pow(1.05)).times("1e3") },
            display() { 
                return "You must be inside of No Letter (Exponent) challenge and reached "+format(this.cost())+" points <br/> Effect : Gain +" + format(this.per()) + "x Tickspeed per upgrade (Very slowly increasing) , Current : x"+format(this.effect())+"  " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('e',12)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(100)
                let base = player.r.prestigetime.pow(time)
                let sfcbase = softcap(base,new Decimal(1),0.05)                
                let sfcbase1 = sfcbase.times(x).add(1)
                return sfcbase1           
            },
            per() {
                let time = player.r.prestigetime.add(10).log(100)
                let base = player.r.prestigetime.pow(time)
                let sfcbase = softcap(base,new Decimal(1),0.05) 
                return sfcbase
            }
        },
        110: {
            title() {
                return "META RESET"
               } ,
            cost() { 
                new Decimal(0) },
            canAfford() { return player.r.mastery.gte(100)},
            buy() {
                doReset('r',true)
                //reset algebra (pre extension)
                player.al.buyables[11] = new Decimal(0)
                player.al.buyables[12] = new Decimal(0)
                player.al.buyables[13] = new Decimal(0)
                player.al.buyables[14] = new Decimal(0)

                player.al.x = new Decimal(0)
                player.al.deltax = new Decimal(0)

                player.al.extension = player.al.extension.add(player.al.extensiongain)
                player.al.resetcooldown = new Decimal(5)
                player.al.points = player.al.points.times(0)
        
                    for (let i = 0; i < player.al.upgrades.length; i++) {
                    
                            player.al.upgrades.splice(i, 1);
                            i--;
                        
                    }
             
                //reset algebra (extension phase)
                player.al.extension = new Decimal(0)
            
                player.al.buyables[21] = new Decimal(0)
                player.al.buyables[22] = new Decimal(0)
                player.al.buyables[23] = new Decimal(0)
                player.al.buyables[24] = new Decimal(0)
                player.al.resetcooldown = new Decimal(10)

                //reset Research
                /*player.r.best = new Decimal(0)
                player.r.points = new Decimal(0)
                buyBuyable('r',11)
                
                player.r.prestigetime = new Decimal(0)
                player.r.metaresearch = player.r.metaresearch.add(player.r.nextmetaresearch)*/

                player.r.algebraf = player.r.algebraf.times(0)
                player.r.geometryf = player.r.geometryf.times(0)
                player.r.infield = false

            },
        },
        111: {
            title() {
                return "Algebra field"
               } ,
            cost() { 
                return new Decimal(0) },
            canAfford() { return player.r.mastery.gte(308.25)},
            unlocked() {return !player.r.infield},
            buy() {
                player.r.algebraf = player.r.algebraf.add(1)
                player.r.infield = true
                player.r.currentfield = "Algebra"
            },
            style: { width: '275px', height: '150px', }
        },
        112: {
            title() {
                return "Geometry field"
               } ,
            cost() { return  new Decimal(0) },
            unlocked() {return  !player.r.infield},
            canAfford() { return player.r.mastery.gte(308.25) },
            buy() {
                player.r.geometryf = player.r.geometryf.add(1)
                player.r.infield = true
                player.r.currentfield = "Geometry"
            },
            style: { width: '275px', height: '150px', }
        },
        201: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Light Additive Generator  "
               } ,
            cost(x) { 
                return x.pow(1.25).times(100) },
            display() { 
                return "Generate +"+format(this.effect())+" Light Additive . Req : "+format(this.cost())+" Additive " },
            canAfford() { return player.a.points.gte(this.cost())},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.pow(3).div(1000)
                return base      
            },
        },
        202: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Light Additive Multiplier  "
               } ,
            cost(x) { 
                return new Decimal(1.25).pow(x.pow(1.3)).times(5) },
            display() { 
                return "Generate x"+format(this.effect())+" more Light Additive . Cost : "+format(this.cost())+" Light Additive " },
            canAfford() { return player.r.lightadd.gte(this.cost())},
            buy() {
                player.r.lightadd = player.r.lightadd.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = new Decimal(1.25).pow(x)
                return base      
            },
        },
        203: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Light Additive Powerer  "
               } ,
            cost(x) { 
                return new Decimal(2).pow(x.pow(1.25)).times(10) },
            display() { 
                return "Generate ^"+format(this.effect())+" more Light Additive . Cost : "+format(this.cost())+" Light Additive " },
            canAfford() { return player.r.lightadd.gte(this.cost())},
            buy() {
                player.r.lightadd = player.r.lightadd.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.add(1).pow(0.25)
                return base      
            },
        },
        301: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Dark Subtractive Generator  "
               } ,
            cost(x) { 
                return x.pow(1.25).times(100) },
            display() { 
                return "Generate +"+format(this.effect())+" Light Additive . Req : "+format(this.cost())+" Subtractive " },
            canAfford() { return player.s.points.gte(this.cost())},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.pow(3).div(1000)
                return base      
            },
        },
        302: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Dark Subtractive Multiplier  "
               } ,
            cost(x) { 
                return new Decimal(1.25).pow(x.pow(1.3)).times(5) },
            display() { 
                return "Generate x"+format(this.effect())+" more Dark Subtractive . Cost : "+format(this.cost())+" Dark Subtractive " },
            canAfford() { return player.r.darksub.gte(this.cost())},
            buy() {
                player.r.darksub = player.r.darksub.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = new Decimal(1.25).pow(x)
                return base      
            },
        },
        303: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Dark Subtractive Powerer  "
               } ,
            cost(x) { 
                return new Decimal(2).pow(x.pow(1.25)).times(10) },
            display() { 
                return "Generate ^"+format(this.effect())+" more Dark Subtractive . Cost : "+format(this.cost())+" Dark Subtractive " },
            canAfford() { return player.r.darksub.gte(this.cost())},
            buy() {
                player.r.darksub = player.r.darksub.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.add(1).pow(0.25)
                return base      
            },
        },
        401: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Twilight Booster  "
               } ,
            cost(x) { 
                return new Decimal(2).pow(x) },
            display() { 
                return "x"+format(this.effect())+" Light Additive and Dark Subtractive gained . Cost : "+format(this.cost())+" Twilight " },
            canAfford() { return player.r.twilight.gte(this.cost())},
            buy() {
                player.r.twilight = player.r.twilight.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.pow(1.5).add(1)
                return base      
            },
        },
        402: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Twilight Strength  "
               } ,
            cost(x) { 
                return new Decimal(2).pow(x.pow(1.1)).times(4) },
            display() { 
                return "Increase the effect of Light Additive and Dark Subtractive primary bonus by +"+format(this.effect())+"% . Cost : "+format(this.cost())+" Twilight " },
            canAfford() { return player.r.twilight.gte(this.cost())},
            buy() {
                player.r.twilight = player.r.twilight.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.times(2)
                return base      
            },
        },
        403: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Twilight Improver"
               } ,
            cost(x) { 
                return new Decimal(10).pow(x) },
            display() { 
                return " x"+format(this.effect())+" Effective Exponent . Cost : "+format(this.cost())+" Twilight " },
            canAfford() { return player.r.twilight.gte(this.cost())},
            buy() {
                player.r.twilight = player.r.twilight.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.div(100).add(1)
                return base      
            },
            purchaseLimit:25
        },
       
      
       
    },
    challenges: {

    },

microtabs: {
    stuff: {
        "Research": {
            buttonStyle() { return { 'color': '#8a00a9' } },
            unlocked() { return true },
            content:

                [
        ["microtabs", "research", { 'border-width': '0px' }],
    ]

        },
        "Mastery breakdown": {
            buttonStyle() {return {'color':'#8a00a9'}},
            content :     [
                ["blank", "25px"],
                ["raw-html", function () { return "<h3>Basic Mathmatic " }, { "color": "white", "font-size": "24px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Current number: " + format(player.n.points) + " -> +" + format(player.r.basemastery) + " mastery"}, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Current additive " + format(player.a.points) + " -> " + format(player.r.additivemastery) + "x mastery"}, { "color": "#32FF00", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Current subtractive " + format(player.s.points) + " -> " + format(player.r.subtractivemastery) + "x mastery"}, { "color": "#FF0000", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Current multiplicative " + format(player.m.points) + " -> " + format(player.r.multiplicativemastery) + "x mastery"}, { "color": "#29AC7F", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Current divisive " + format(player.d.points) + " -> " + format(player.r.divisivemastery) + "x mastery"}, { "color": "#822B2B", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Current exponent: " + format(player.e.effective) + "  -> " + format(player.r.exponentmastery) + "x mastery"}, { "color": "#8420EC", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Current research: " + format(player.r.points) + "  -> " + format(player.r.researchmastery) + "x mastery"}, { "color": "#5020EC", "font-size": "18px", "font-family": "helvetica" }],
                ["blank","25px"],
                ["raw-html", function () { return player.r.algebraf.gte(1)?"<h3>Algebra field":"" }, { "color": "lime", "font-size": "24px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.r.algebraf.gte(1)?"<h3>Current function value : " + format(player.al.value) + " -> " + format(player.r.functionmastery) + "x mastery":""}, { "color": "green", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.r.algebraf.gte(1)?"<h3>Current extension point : " + format(player.al.extension) + " -> " + format(player.r.extensionmastery) + "x mastery":""}, { "color": "orange", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.r.algebraf.gte(1)?"<h3>Current Operation point : " + format(player.al.operation) + " -> " + format(player.r.operationmastery) + "x mastery":""}, { "color": "lime", "font-size": "18px", "font-family": "helvetica" }],
                ["blank","25px"],
                ["raw-html", function () { return "<h3>Other source"}, { "color": "grey", "font-size": "24px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.r.best.gte(3)?"<h3>Research milestone 3 : "+format(player.r.researchmilestone3mastery)+"x mastery ":""}, { "color": function(){return player.r.infield?"lime":"red"}, "font-size": "18px", "font-family": "helvetica" }],
                ["blank","25px"],
                ["raw-html", function () { return "<h3>Total mastery: " + format(player.r.mastery) + ""}, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Best ever mastery: " + format(player.r.bestmastery) + ""}, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],

        ]},
        "Meta research": {
            buttonStyle() { return { 'color': '#ff0000' , "border-color" : "orange" } },
            unlocked() { return true },
            content:

                [
        ["microtabs", "metaresearch", { 'border-width': '0px' }],
    ]

        },
        "Other": {
            buttonStyle() { return { 'color': '#ffffff' , "border-color" : "gray" } },
            unlocked() { return true },
            content:

                [
        ["microtabs", "other", { 'border-width': '0px' }],
    ]

        },
    },
    research: {
        "Main": {
            buttonStyle() { return { 'color': '#8a00a9' } },
            unlocked() { return true },
            content:

                [
                    ["blank","25px"],
                    ["infobox","lore"],
                    ["blank", "25px"],
                     ["raw-html", function () { return "<h2>You have " + format(player.r.points) + " Research." }, { "color": "pink", "font-size": "18px", "font-family": "helvetica" }],
                     ["raw-html", function () { return player.r.infield?"<h2>You will lose ALL field progress if you do a Research reset right now!! ":"" }, { "color": "red", "font-size": "19px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3>Which is boosting Tickspeed by  x" + format(player.r.tickspeedbonus) }, { "color": "lime", "font-size": "15px", "font-family": "helvetica" }],
                       ["blank", "25px"],
                       "prestige-button",
                       ["blank", "25px"],
                       "milestones"

                ]

        },
        "Improvement": {
            buttonStyle() { return { 'color': '#8a00a9' } },
            unlocked() { return true },
            content:

                [
                    ["blank", "25px"],
        ["raw-html", function () { return "<h2>Prestige time : " + formatTime(player.r.prestigetime) + " (+"+formatTime(player.r.deltatime)+" per real life second)" }, { "color": "lime", "font-size": "18px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h2>Each improvement bought increase the cost of all other improvement (including itself)" }, { "color": "red", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank", "25px"],
                    ["row", [["buyable", 11]]],
                    ["row", [["buyable", 101], ["buyable", 102], ["buyable", 103], ["buyable", 104]]],
    ]

        },
    },
    metaresearch: {
        "Main": {
            buttonStyle() { return { 'color': '#ff0000' , "border-color" : "orange" } },
            unlocked() { return player.r.bestmastery.gte(10000) },
            content: [
                ["blank", "25px"],
                ["raw-html", function () { return "<h2>You currently have : " + format(player.r.metaresearch)+ " Meta research" }, { "color": "lime", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2>Reset now to gain "+format(player.r.nextmetaresearch) +" Meta research (based on Mastery)" }, { "color": "lime", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2>Meta-research reset will force an Research reset and reset your Research , Improvement , Current Field  . Meta resetting require at least 10K Mastery" }, { "color": "red", "font-size": "18px", "font-family": "helvetica" }],
                            ["blank", "25px"],
                            ["row", [["buyable", 110]]],
            ]

                
        },
        "Field Selector" : {
            buttonStyle() { return { 'color': '#ff0000' , "border-color" : "orange" } },
            unlocked() { return true },
            content: [
                ["blank", "25px"],
                ["raw-html", function () { return "<h2> Select your field here (Selecting require 308.25 Current Mastery)" }, { "color": "orange", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Research progress is RESET everytime you perform a Research reset" }, { "color": "red", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> The Hotkey 'R' (to perform Research) will be disabled while inside any field" }, { "color": "lime", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Meta-research reset is the only way to exit current field" }, { "color": "pink", "font-size": "14px", "font-family": "helvetica" }],
                ["row", [["buyable", 111]]],
                ["blank", "25px"],
                ["row", [["buyable", 112]]],
                ["blank", "25px"],
                ["raw-html", function () { return player.r.infield?"<h2> You are currently in "+player.r.currentfield+" field":"" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                
            ]
        },
        "QOL Upgrade" : {
            buttonStyle() { return { 'color': '#ff0000' , "border-color" : "orange" } },
            unlocked() { return player.r.bestmastery.gte(10000) },
            content: [
                ["blank", "25px"],
                ["raw-html", function () { return "<h2> Meta research QOL will be kept permeantly" }, { "color": "orange", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Meta research QOL cannot be respec . Make sure you understand what you are buying"}, { "color": "red", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Tip : Export your current save before buying anything "}, { "color": "grey", "font-size": "10px", "font-family": "helvetica" }],
                ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14],["upgrade", 15]]],
                ["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24]]],
                ["row", [["upgrade", 31], ["upgrade", 32], ["upgrade", 33]]],
                ["row", [["upgrade", 41], ["upgrade", 42]]],
                ["row", [["upgrade", 51]]],


                
            ]
        },
        "Tree of Math" : {
            buttonStyle() { return { 'color': 'green' , "border-color" : "lime" } },
            unlocked() { return player.r.bestmastery.gte(10000) },
            content: [

                
            ]
        },
    }, 
     other: {
        "Note": {
            buttonStyle() { return { 'color': '#ffffff' , "border-color" : "gray" } },
            unlocked() { return true },
            content: [
                ["blank", "25px"],
                ["raw-html", function () { return "<h2>Permeantly unlock research will be put here" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }]
            ]

                
        },
        "Twilight": {
            buttonStyle() { return { 'color': '#ffffff' , "border-color" : "gray" } },
            unlocked() { return true },
            content: [
                ["blank", "25px"],
                ["raw-html", function () { return "<h2>You have "+format(player.r.lightadd)+" Light Additive (+"+format(player.r.lightaddpersec)+") which boost Points gained by "+format(player.r.la1)+"x , Number gained by "+format(player.r.la2)+"x and decrease Additive cost by /"+format(player.r.la3)+" BUT reduce Dark Subtractive gained by /"+format(player.r.lb1)+"" }, { "color": "lime", "font-size": "14px", "font-family": "helvetica" }],
                ["blank","25px"],
                ["raw-html", function () { return "<h2>You have "+format(player.r.darksub)+" Dark Subtractive (+"+format(player.r.darksubpersec)+") which boost Multiplicative gained by "+format(player.r.da1)+"x , Divisive gained by "+format(player.r.da2)+"x and decrease Subtractive cost by /"+format(player.r.da3)+" BUT reduce Light Additive gained by /"+format(player.r.db1)+" " }, { "color": "red", "font-size": "14px", "font-family": "helvetica" }],
                ["blank","25px"],
                ["raw-html", function () { return "<h2>You have "+format(player.r.twilight)+" Twilight (+"+format(player.r.twilightpersec)+") which boost Tickspeed by "+format(player.r.ta1)+"x . Twilight is generated based on current Light Additive and Dark Subtractive  " }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                ["row", [["buyable", 201], ["buyable", 202], ["buyable", 203]]],
                ["row", [["buyable", 301], ["buyable", 302], ["buyable", 303]]],
                ["row", [["buyable", 401], ["buyable", 402], ["buyable", 403]]],


            ]

                
        },
     
    }
},
tabFormat: [
    ["microtabs", "stuff", { 'border-width': '0px' }],
],
layerShown() { return player.r.bestmastery.gte(200) || player.e.points.gte(10) }


}) 

addLayer("al", {
    startData() { return {
        //basic data                  
        unlocked: true,
        bankedprestigetime: new Decimal(0),                     
        //function and x
        points: new Decimal(0),
        pointsgainal: new Decimal(0),
        x: new Decimal(0),
        a: new Decimal(0),
        b: new Decimal(0),
        c: new Decimal(0),
        y: new Decimal(0),
        value: new Decimal(0),

        cmilestone: new Decimal(0),
        bmilestone: new Decimal(0),
        amilestone: new Decimal(0),

        resetcooldown: new Decimal(0),

        //extension of function
        extension: new Decimal(0),
        extensiongain: new Decimal(0),
        extensionboost: new Decimal(0),
        x1: new Decimal(0),
        a1 : new Decimal(0),
        b1 : new Decimal(0),
        c1: new Decimal(0),
        deltax: new Decimal(0),

        //operation
        operation: new Decimal(0),
        operationgained: new Decimal(0),
        tickspeedreduction1:new Decimal(0.2),
        tickspeedreduction2:new Decimal(1),
        alteredpow:new Decimal(0.25),


        
    }},

    color: "lime",                       // The color for this layer, which affects many elements.
    row: 4,                                 // The row this layer is on (0 is the first row).
    tooltip: "Algebra",
                                            // Also the amount required to unlock the layer.

    type: "none",                         // Determines the formula used for calculating prestige currency.


    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = new Decimal(1)
        return multi 
    },
    gainExp() {   
        let exp = new Decimal(1)                
        return exp
    },
    infoboxes: {
        lore1: {

        }
    },


    automate() {
        //function
        let totalc = new Decimal(0).add(buyableEffect('al',11))
        player.al.c = totalc

        let totalb = new Decimal(0).add(buyableEffect('al',12))
        player.al.b = totalb

        let totala = new Decimal(0).add(buyableEffect('al',13))
        if(hasUpgrade('al',12)) totala = totala.times(upgradeEffect('al',12))
        player.al.a = totala

        let delx = buyableEffect('al',14).times(player.al.extensionboost)
        if(hasUpgrade('al',11)) delx = delx.times(upgradeEffect('al',11))
        player.al.deltax = delx

        let totala1 = player.al.a
        if(hasUpgrade('al',13)) totala1 = totala1.times(upgradeEffect('al',13))

        player.al.x1 = player.al.x
        player.al.a1 = totala1
        player.al.b1 = player.al.b
        player.al.c1 = player.al.c
       let val = player.al.a1.times(player.al.x1.pow(2)).add(player.al.b1.times(player.al.x1)).add(player.al.c1) 
        if(hasUpgrade('al',14)) val = val.times(upgradeEffect('al',14))

        player.al.value = val


        let gainal = player.al.value.times(player.al.extensionboost).times(buyableEffect('al',23))
        player.al.pointsgainal = gainal

        //milestone
        let reqc = new Decimal(16).times(buyableEffect('al',21))
        if(hasUpgrade('al',21)) reqc = reqc.add(upgradeEffect('al',21))
        let reqb = new Decimal(32).times(buyableEffect('al',21))
        let reqa = new Decimal(64).times(buyableEffect('al',21))



        player.al.cmilestone = reqc.max(1)
        player.al.bmilestone = reqb.max(1)
        player.al.amilestone = reqa.max(1)

        // extension
        let limitofext = new Decimal("1e10").times(buyableEffect('al',34))
        deltaextension = player.al.points.div("1e6").pow(0.75)
        deltaextension1 = softcap(deltaextension,new Decimal("1e3"),0.5)
        deltaextension12 = softcap(deltaextension1,limitofext,0.0)
        player.al.extensiongain = deltaextension12.times(buyableEffect('al',24))

        extensionbuff = player.al.extension.add(1).pow(0.9)
        extensionbuff1 = softcap(extensionbuff,new Decimal("100"),0.8)
        extensionbuff12 = softcap(extensionbuff1,new Decimal("10000"),0.7)
        extensionbuff123 = softcap(extensionbuff12,new Decimal("1000000"),0.6)
        extensionbuff1234 = softcap(extensionbuff12,new Decimal("100000000"),0.5)
        player.al.extensionboost = extensionbuff1234.max(1)


        //operation

        let operationgainedal = new Decimal(0)       
        if(inChallenge('al',11)) operationgainedal = operationgainedal.add(new Decimal(2).pow(player.r.mastery.add(4).div(4)).sub(2))
        if(hasUpgrade('al',34)) operationgainedal = operationgainedal.times(upgradeEffect('al',34)) 
    
        let operationgainedal1 = operationgainedal
        let operationgainedal2 = softcap(operationgainedal1,new Decimal("1e6"),0.00).times(operationgainedal1.add(1e6).div(1e6).floor().max(2).log(2))
        player.al.operationgained = operationgainedal2.times(buyableEffect('al',31))

        //tick
        let tickspeedreduction1eff = new Decimal(0.2)
        if(hasUpgrade('al',33)) tickspeedreduction1eff = tickspeedreduction1eff.add(0.3)
        player.al.tickspeedreduction1 = tickspeedreduction1eff

        player.al.tickspeedreduction2 = new Decimal("1e20").div(buyableEffect('al',32))

    },
      
    update(delta) {
    player.al.resetcooldown = player.al.resetcooldown.sub(delta).max(0)
    player.al.x = player.al.x.add(player.al.deltax.times(delta))
    player.al.points = player.al.points.add((player.al.pointsgainal).times(delta)).sub(player.al.resetcooldown.div(6).abs().ceil().times(player.al.points))

    player.al.operation = player.al.operation.add(player.al.operationgained.times(delta))
    },

    milestones: {
        
    },
    buyables: {
        11: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Base C value  "
               } ,
            cost(x) { 
                return new Decimal(1.2).pow(x.pow(1.1)).times(5).sub(5) },
            display() { 
               
            return "Cost : "+format(this.cost())+" algebric . This upgrade effect is doubled every "+format(player.al.cmilestone)+" level <br/> Effect : Increase the base value of c by +" + format(this.effect()) + "  " },
            canAfford() { return player.al.points.gte(this.cost())},
            buy() {
                player.al.points = player.al.points.sub(this.cost())
                if(hasUpgrade('al',22)) {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(player.al.cmilestone))
                } else {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
 
            },
            effect(x) {
                let effect1 = x
                let bonus = x.div(player.al.cmilestone.max(1)).floor()

                return effect1.times(new Decimal(2).pow(bonus))         
            },
    
        },
        12: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Base B value  "
               } ,
            cost(x) { 
                return new Decimal(1.3).pow(x.pow(1.1)).times(25) },
            display() { 
            return "Cost : "+format(this.cost())+" algebric . This upgrade effect is doubled every "+format(player.al.bmilestone)+" level <br/> Effect : Increase the base value of b by +" + format(this.effect()) + "  " },
            canAfford() { return player.al.points.gte(this.cost())},
            buy() {
                player.al.points = player.al.points.sub(this.cost())
                if(hasUpgrade('al',22)) {
                        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(player.al.bmilestone))
                    } else {
                        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    }
              
            },
            effect(x) {
                let effect1 = x.div(5)
                let bonus = x.div(player.al.bmilestone.max(1)).floor()
                return effect1.times(new Decimal(2).pow(bonus))         
            },
    
        },
        13: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Base A value  "
               } ,
            cost(x) { 
                return new Decimal(1.4).pow(x.pow(1.1)).times(125) },
            display() { 
            return "Cost : "+format(this.cost())+" algebric . This upgrade effect is doubled every "+format(player.al.amilestone)+" level <br/> Effect : Increase the base value of a by +" + format(this.effect()) + "  " },
            canAfford() { return player.al.points.gte(this.cost())},
            buy() {
                player.al.points = player.al.points.sub(this.cost())
                if(hasUpgrade('al',22)) {
                        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(player.al.amilestone))
                    } else {
                        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    }
           
            },
            effect(x) {
                let effect1 = x.div(25)
                let bonus = x.div(player.al.amilestone.max(1)).floor()
                return effect1.times(new Decimal(2).pow(bonus))         
            },
    
        },
        14: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Base X value  "
               } ,
            cost(x) { 
                let growth = new Decimal(0.5).div(buyableEffect('al',22))
                let scaling = growth.add(1)
                return scaling.pow(x.pow(1.1)).times(10) },
            display() { 
            return "Cost : "+format(this.cost())+" algebric . This upgrade effect is multiplied by 1.04 per level beyond 10 <br/> Effect : Gain +" + format(this.effect()) + "x / second" },
            canAfford() { return player.al.points.gte(this.cost())},
            buy() {
                player.al.points = player.al.points.sub(this.cost())
                if(hasUpgrade('al',22)) {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).times(1.1).floor())
                } else {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            effect(x) {
                let effect1 = x.div(100)
                let bonus = x.sub(10).max(0)
                let bonuseffect = new Decimal(1.04).pow(bonus)
                if(hasUpgrade('al',23)) effect1 = effect1.times(upgradeEffect('al',23))
                return effect1.times(bonuseffect)         
            },
    
        },
        15: {
            title() {
                return "Extension reset (CD : "+formatTime(player.al.resetcooldown.max(0))+") "
               } ,
            cost(x) { 
                return new Decimal(0) },
            display() { 
            return "" },
            canAfford() { return player.al.points.gte("1e6")},
            tooltip:"After reset , Algebric cannot be gained until the reset cooldown expire",
            buy() {
                player.al.buyables[11] = new Decimal(0)
                player.al.buyables[12] = new Decimal(0)
                player.al.buyables[13] = new Decimal(0)
                player.al.buyables[14] = new Decimal(0)

                player.al.x = new Decimal(0)
                player.al.deltax = new Decimal(0)
                player.al.extension = player.al.extension.add(player.al.extensiongain)
                let ti = new Decimal(5)
                if(hasUpgrade('al',21)) ti = ti.add(upgradeEffect('al',21))
                player.al.resetcooldown = ti
                player.al.points = player.al.points.times(0)
        
                    for (let i = 0; i < player.al.upgrades.length; i++) {
                        if (+player.al.upgrades[i] < 15) {
                            player.al.upgrades.splice(i, 1);
                            i--;
                        }
                    }
             
            

    
        },
    },
    21: {
        title() {
            return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Reduced bonus requirement  "
           } ,
        cost(x) { 
            return new Decimal(4).pow(x.pow(2)).times(4) },
        display() { 
        return "Cost : "+format(this.cost())+" extension points <br/> Effect : A,B,C milestone requirement is decreased by " + format(this.effect()) + "x (Reduce the amount of purchase needed to gain a 2x bonus)" },
        canAfford() { return player.al.extension.gte(this.cost())},
        buy() {
            player.al.extension = player.al.extension.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

        },
        effect(x) {
            let effect1 = new Decimal(1).sub(x.div(16))
            return effect1        
        },
        purchaseLimit:6

    },
    22: {
        title() {
            return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Lower unknown cost  "
           } ,
        cost(x) { 
            return new Decimal(1.1).pow(x).times(10) },
        display() { 
        return "Cost : "+format(this.cost())+" extension points <br/> Effect : Decrease the cost scaling of X by " + format(this.effect()) + "x  " },
        canAfford() { return player.al.extension.gte(this.cost())},
        buy() {
            player.al.extension = player.al.extension.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          
        },
        effect(x) {
            let effect1 = x.add(1).pow(0.1)
  
            return effect1      
        },
        purchaseLimit:1024

    },
    23: {
        title() {
            return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Extra Algebric "
           } ,
        cost(x) { 
            let base = new Decimal(2).add(x).times(2)
            return new Decimal(base).pow(x).times(10) },
        display() { 
        return "Cost : "+format(this.cost())+" extension points <br/> Effect : Multiply Algebric gained by " + format(this.effect()) + " (1.5x per) " },
        canAfford() { return player.al.extension.gte(this.cost())},
        buy() {
            player.al.extension = player.al.extension.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
       
        },
        effect(x) {
            let effect1 = new Decimal(1.5).pow(x)
            return effect1.max(1)        
        },

    },
    24: {
        title() {
            return format(getBuyableAmount(this.layer, this.id),0) + "<br/> More Extension  "
           } ,
        cost(x) { 
            let base = new Decimal(3).add(x).times(1.5)
            return new Decimal(base).pow(x).times(10) },
        display() { 
        return "Cost : "+format(this.cost())+" extension points <br/> Effect : Multiply Extension gained by " + format(this.effect()) + "x (1.25x per , Also bypass extension gained limit)  " },
        canAfford() { return player.al.extension.gte(this.cost())},
        buy() {
            player.al.extension = player.al.extension.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

        },
        effect(x) {
            let effect1 = new Decimal(1.25).pow(x)
            return effect1         
        },

    },
    31: {
        title() {
            return format(getBuyableAmount(this.layer, this.id),0) + "<br/> More Operation "
           } ,
        cost(x) { 
            return new Decimal(10).pow(x).times(10)},
        display() { 
        return "Cost : "+format(this.cost())+" Operation <br/> Effect : Multiply Operation gained by " + format(this.effect()) + "x (2x per)" },
        canAfford() { return player.al.operation.gte(this.cost())},
        buy() {
            player.al.operation = player.al.operation.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

        },
        effect(x) {
            let effect1 = new Decimal(2).pow(x)
            return effect1        
        },

    },
    32: {
        title() {
            return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Lower Tickspeed Penality  "
           } ,
        cost(x) { 
            return new Decimal(4).pow(x).times(10) },
        display() { 
        return "Cost : "+format(this.cost())+" Operation <br/> Effect : Reduce the Tickspeed (divide) penality while altered by " + format(this.effect()) + "x  " },
        canAfford() { return player.al.operation.gte(this.cost())},
        buy() {
            player.al.operation = player.al.operation.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          
        },
        effect(x) {
            let effect1 = new Decimal(1.25).pow(x)
            return effect1      
        },
        purchaseLimit:100

    },
    33: {
        title() {
            return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Algebric Point boost"
           } ,
        cost(x) { 
            let base = new Decimal(4).add(x).times(4)
            return new Decimal(base).pow(x).times(2) },
        display() { 
        return "Cost : "+format(this.cost())+" Operation <br/> Effect : Multiply Point gained by " + format(this.effect()) + " (based on Algebric) . The effect is significantly decreased inside of Alter  " },
        canAfford() { return player.al.operation.gte(this.cost())},
        buy() {
            player.al.operation = player.al.operation.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
       
        },
        effect(x) {
            let fact = player.al.points.add(10).pow(0.25).pow(x)
            fact1 = softcap(fact,new Decimal("1e100"),0.1)
            if(inChallenge('al',11)) fact1 = fact1.pow(0.1)
            return fact1        
        },
        purchaseLimit:5

    },
    34: {
        title() {
            return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Extension limit  "
           } ,
        cost(x) { 
            let base = new Decimal(2).add(x)
            return new Decimal(base).pow(x).times(1000) },
        display() { 
        return "Cost : "+format(this.cost())+" Operation <br/> Effect : Multiply Extension gained by " + format(this.effect()) + "x (1.5x per , bypass extension gained limit)  " },
        canAfford() { return player.al.operation.gte(this.cost())},
        buy() {
            player.al.operation = player.al.operation.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

        },
        effect(x) {
            let effect1 = new Decimal(1.5).pow(x)
            return effect1         
        },
        
    },

    },



    upgrades: {
        11: {
            title: "Constant to Variable",
            description: "Base C value boost X gain",
            cost: new Decimal("1e3"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true },
            effect() {
                let eff = player.al.c.add(10).log(10)
                return eff

            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        12: {
            title: "Linear to Quadratic",
            description: "Base B boost A gain",
            cost: new Decimal("5e3"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true },
            effect() {
                let eff = player.al.b.add(10).log(10)
                return eff

            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        13: {
            title: "Self boosting quadratic",
            description: "Base A boost itself",
            cost: new Decimal("2.5e4"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true },
            effect() {
                let eff = player.al.a.add(1).pow(0.25)
                return eff

            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        14: {
            title: "Self boosting unknown",
            description: "Base X boost function value",
            cost: new Decimal("1.25e5"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true },
            effect() {
                let eff = player.al.x.add(10).pow(0.15)
                return eff

            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        21: {
            title: "Improved C",
            description: "C milestone require 4 less and reduce the extension reset cooldown by 4s",
            cost: new Decimal("6.25e8"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true },
            effect() {
                let eff = new Decimal(-4)
                return eff
            },
            effectDisplay() { return ""+format(upgradeEffect(this.layer, this.id))+" needed" }, 
        },
        22: {
            title: "Fast variable",
            description: "You can buy the next milestone of A,B,C variable and you can buy much more X variable",
            cost: new Decimal("1e15"),
            tooltip:"",
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true }, }, 

        23: {
            title: "Stronger X",
            description: "Variable X effect is increased based on Extension",
            cost: new Decimal("1e24"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true },
            effect() {
                let eff = player.al.extension.add(10).slog().pow(2)
                return eff

            },
            effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id))+"" }, 
        },
        24: {
            title: "Mathmatical operation",
            description: "Unlock Operation",
            cost: new Decimal("1e40"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true },
        },
        31: {
            title: "Numberic Boost ",
            description: "4x Number gained",
            cost: new Decimal("250"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return true }, 
        },
        32: {
            title: "Passive number",
            description: "You gain +100% of number gained (unaffected by tickspeed)",
            cost: new Decimal("500"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return true }, }, 

        33: {
            title: "Stronger Time Exponent",
            description: "Tickspeed exponent is +^0.3 while altered",
            cost: new Decimal("1000"),
            tooltip:"Decrease the penality of Alter ; Tickspeed ^0.2 => Tickspeed ^0.5",
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return true }, 
        },
        34: {
            title: "Number gained",
            description: "You gain more Operation based on Prestige Time",
            cost: new Decimal("2000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            effect() {
                let effect = player.r.prestigetime.add(10).log(10)
                return effect
            },
            effectDisplay() { return ""+format(upgradeEffect(this.layer, this.id))+"x" }, 
            unlocked() { return true },
        },
        41: {
            title: "Stronger Upgrade",
            description: "Increase the strength of Number upgrade 'Headstart' (^1.2 effect)",
            cost: new Decimal("8000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return true }, 
        },
        42: {
            title: "More Effective",
            description: "Increase the strength of Number upgrade 'Effective counting' (^5 effect)",
            cost: new Decimal("32000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return true }, }, 

        43: {
            title: "More Quickly",
            description: "Empowered Number upgrade 'Counting faster' based on Mastery",
            cost: new Decimal("128000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return true }, 
        },
        44: {
            title: "Number QOL",
            description: "The second row of number upgrade cost are ^0.25 and is unlocked instantly",
            cost: new Decimal("512000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return true },
        },
      
    },
    challenges: {
        11: {
            name: "Altered realm",
            challengeDescription: "- Force a 'Research' reset and Remove all of your Research Improvement </br> Your Prestige time will be resetted but you will get it back after exiting this challenge" ,
            canComplete: function() {
                let goal = (player.points.add(1)).times(player.points)
                return player.points.gte(goal)},
            unlock() {return true},
            onEnter() {
                doReset('e',true)
                layerDataReset('n')
                layerDataReset('a')
                layerDataReset('s')
                layerDataReset('m')
                layerDataReset('d')
                layerDataReset('e')
                player.al.bankedprestigetime = player.r.prestigetime
                player.r.prestigetime = new Decimal(0)
                buyBuyable('r',11)
                player.points = new Decimal(10)
            },
            onExit() {
                player.r.prestigetime = player.r.prestigetime.add(player.al.bankedprestigetime)
                player.al.bankedprestigetime = new Decimal(0)
            }
        },
    },

microtabs: {
    stuff: {
        "Function": {
            buttonStyle() { return { 'color': 'lime' } },
            unlocked() { return true },
            content: 

                [
        ["microtabs", "main", { 'border-width': '0px' }],
    ]

        },
        "Equation": {
            buttonStyle() {return {'color':'aqua'}},
            content :     [
                ["raw-html", function () { return "<h3>The function f(x) is defined as f(x) = ax^2 + bx + c " }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],

        ]},
        "Enhancement": {
            buttonStyle() { return { 'color': 'lime' , "border-color" : "green" } },
            unlocked() { return true },
            content:

                [
        ["microtabs", "function", { 'border-width': '0px' }],
    ]

        },
    },
    main: {
        "Variable": {
            buttonStyle() { return { 'color': 'lime' } },
            unlocked() { return true }, 
            content:[
            ["raw-html", function () { return "<h3>x = "+format(player.al.x1)+" (+"+format(player.al.deltax)+"/s)"}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>a = "+format(player.al.a1)+"" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>b = "+format(player.al.b1)+" " }, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>c = "+format(player.al.c1)+" " }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ]
        },
        "Variable increaser": {
            buttonStyle() { return { 'color': 'lime' } },
            unlocked() { return true },
            content: [
                ["blank", "25px"],
                ["row", [["buyable", 11],["buyable", 12],["buyable", 13],["buyable",14]]],
    ]

        },
    },
    function: {
        "Main": {
            buttonStyle() { return { 'color': 'lime' , "border-color" : "green" } },
            unlocked() { return true },
            content: [
                ["blank", "25px"],
                ["row", [["upgrade", 11],["upgrade", 12],["upgrade", 13],["upgrade",14]]],
            ]

                
        },
        "Extension" : {
            buttonStyle() { return { 'color': 'lime' , "border-color" : "orange" } },
            unlocked() { return true },
            content: [
                ["raw-html", function () { return "<h3>You have  " + format(player.al.extension)+" Extension Point" }, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>You will gain +" + format(player.al.extensiongain)+" Extension Point next reset" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Extension Point boost Algebric and X gained by " + format(player.al.extensionboost)+ "x" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                ["blank", "25px"],
                ["row", [["buyable", 15]]],
                ["blank", "25px"],
                ["row", [["buyable", 21],["buyable", 22],["buyable", 23],["buyable",24]]],
                ["blank", "25px"],
                ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade",24]]],
            ]
            
        },
        "Operation" : {
            buttonStyle() { return { 'color': 'lime' , "border-color" : "orange" } },
            unlocked() { return hasUpgrade('al',24) },
            content: [
                ["blank", "25px"],
                ["raw-html", function () { return "<h3>You may alter your realm for Operation (gained passively based on Mastery)" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["raw-html", function () { return "<h3>Altered realm effect :" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Tickspeed^"+format(player.al.tickspeedreduction1)+" and /"+format(player.al.tickspeedreduction2)+" " }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Pre-Research resource multiplier and cost reduction (except Points gained) are ^"+format(player.al.alteredpow)+"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["blank", "25px"],
                ["raw-html", function () { return "<h3>You have "+format(player.al.operation)+" Operation (+"+format(player.al.operationgained)+"/s)" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                ["row", [["challenge", 11]]],
                ["blank", "25px"],
                ["row", [["buyable", 31],["buyable", 32],["buyable", 33],["buyable",34]]],
                ["blank", "25px"],
                ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33],["upgrade",34]]],
                ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43],["upgrade",44]]],
            ]
        },
}},
tabFormat: [
    ["raw-html", function () { return "<h3>You have  " + format(player.al.points)+" Algebric (+"+format(player.al.pointsgainal)+"/s)" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
    ["raw-html", function () { return "<h3>Function f(x) = " + format(player.al.value) }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
    ["raw-html", function () { return "<h3>x = " + format(player.al.x)+ "" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],

    ["microtabs", "stuff", { 'border-width': '0px' }],
],
layerShown() { return player.r.algebraf.gte(1) }


}) 
