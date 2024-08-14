//Other

/** 
*Return the costs scaling effectiveness of a static layer
**/
function getCostScaling(layer , amount , strength = d(0.6)) {
    switch (layer) {
        case 'a':
            if(tmp.a.gainExp.eq(0)) return d(1) 
            if(player.a.points.lte(player.a.startsoftcap)) return d(1)
            let strong = strength
            if (inChallenge('r',11)) strong = strong.div(player.r.chf)
            strong = strong.pow(d(player.g.artifactset2[6]).max(1).pow(-1))
            let projected = d(amount).gte(player.g.corruption[1])?player.a.startsoftcap.times(((player.a.points.div(player.g.corruption[1])).max(1))).div(d(amount).div(player.g.corruption[1]).max(1)):player.a.startsoftcap
            let effective = d(amount).gte(projected)?d(amount).div(projected).root(d(strong)).times(projected).div(tmp.a.directMult):d(amount).div(tmp.a.directMult)
            let cost = tmp.a.requires.times(d(2).pow(effective.pow(1.35)))
            if(inChallenge('al',11)) cost = cost.div(24.8)
            
            let base = d(2).pow(d(amount).div(tmp.a.directMult).pow(1.35)).times(tmp.a.requires)
            if(inChallenge('al',11)) base = base.div(24.8)


            let diff = cost.max(10).log(10).div(base.max(10).log(10))
            return diff
        case 's':
            if(tmp.a.gainExp.eq(0)) return d(1) 
            if(player.s.points.lte(player.s.startsoftcap)) return d(1)
            let strong2 = strength
            if (inChallenge('r',11)) strong2 = strong2.div(player.r.chf)
            strong2 = strong2.pow(d(player.g.artifactset2[7]).max(1).pow(-1))
            let projected2 = d(amount).gte(player.g.corruption[2])?player.s.startsoftcap.times(((player.s.points.div(player.g.corruption[2])).max(1))).div(d(amount).div(player.g.corruption[2]).max(1)):player.s.startsoftcap
            let effective2 = d(amount).gte(projected2)?d(amount).div(projected2).root(d(strong2)).times(projected2).div(tmp.s.directMult):d(amount).div(tmp.s.directMult)
            let cost2 = tmp.a.requires.times(d(2).pow(effective2.pow(1.35)))
            if(inChallenge('al',11)) cost2 = cost2.div(24.8)
            
            let base2 = d(2).pow(d(amount).div(tmp.a.directMult).pow(1.35)).times(tmp.s.requires)
            if(inChallenge('al',11)) base2 = base2.div(24.8)

            let diff2 = cost2.max(10).log(10).div(base2.max(10).log(10))
            return diff2
        default:
            break;
    }
}

addLayer("p", {
    startData() { return {
        unlocked: true,
        planet: d(0), //Planet number , [0] refer to its star instead
        moon: d(0), //Moon number , [0] refer to its planet instead
        resource: [],
        pname: '',
        money: d(0),
        lore: d(1),
        chapter: d(1),
        lorem: d(1), //Unlocked story
        chapterm: d(1), //Unlocked chapter 
        start: d(0),
    }},
    color: "gray",                      
    row: 'side',                              
    tooltip() {return "Planets <br> "},
    ttStyle() {
        return {
            "color":"#c9b1bd",
            "width":"150px",
            "border":"2px solid",
            "border-color":"pink",
        }
    },
    type: "none",
    automate() {
        // Solar system : [0] refers to Sun , [9] refers to Dwarf planet / Oort cloud object . All planet order are based on their distance to the sun
        let ss = ['Sun','Mercury','Venus',['Earth','Moon'],['Mars','Phobos'],['Jupiter','Io','Europa','Ganymede','Callisto'],['Saturn','Titan','Mimas','Enceladus'],['Uranus','Oberon'],['Neptune','Triton','Proteus'],['Pluto','Makemake','Eris','Senda']]
        // 
    },
    update(delta) {

    },  

    milestones: {
        
    },
    /*
    Technical note :
     -   These aren't really a save-bank like others
     -   This is just a collection of saves from testing 
     -   These 'saves' work by injecting the content directly to current save
     -   Though one might use these multiple times as there is no realistic restrictions other than its mastery requirement
     -   Layer upgrades and buyables override when applying new save , resulting in no errors
     -   Apart from massive amount of achievements being grant , which is filtered out directly
    */
    buyables: {
        10: {
            title() {return "[1] Early Number (1.43 Mastery)"},
            cost(x) { return d(0)},
            tooltip() {return "21 Number , 29 Points <br> all Number upgrade bought"},
            display() { return "" },
            canAfford() { return player.r.bestmastery.lte(1.43)},
            buy() {
                player.n.points = d(21)
                player.points = d(29)
                player.n.upgrades = [11,12,13,14]
            },
            style() {
                if (true) return Qcolor('aqua')
            },
            unlocked() {return true},
            },
        11: {
            title() {return "[2a] Early additive (1.69 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "3 Additive , "+format(1159)+" Points , 44 Number <br> 2 additive upgrade bought , all number upgrade bought" },
            canAfford() { return player.r.bestmastery.lte(1.69)},
            buy() {
                player.n.points = d(44)
                player.points = d(1159)
                player.n.upgrades = [11,12,13,14]
                player.a.points = d(3)
                player.a.upgrades = [21,22]
                player.a.unlocked = true
            },
            style() {
                if (true) return Qcolor('lime')
            },
            unlocked() {return true},
            },
        12: {
            title() {return "[2b] Early subtractive (1.80 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "3 Additive , "+format(958)+" Points , 114 Number <br> 2 subtractive upgrade bought , all number upgrade bought" },
            canAfford() { return player.r.bestmastery.lte(1.8)},
            buy() {
                player.n.points = d(114)
                player.points = d(958)
                player.n.upgrades = [11,12,13,14]
                player.s.points = d(3)
                player.s.upgrades = [31,32]
                player.s.unlocked = true
            },
            style() {
                if (true) return Qcolor('red')
            },
            unlocked() {return true},
            },
        13: {
            title() {return "[3] Unlocked Additive & subtractive (2.23 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "4 Additive & Subtractive , "+format(8200)+" Points , 309 Number" },
            canAfford() { return player.r.bestmastery.lte(2.23)},
            buy() {
                player.n.points = d(309)
                player.points = d(8200)
                player.n.upgrades = [11,12,13,14]
                player.s.points = d(4)
                player.a.points = d(4)
                player.s.upgrades = [31,32]
                player.a.upgrades = [21,22,23]
                player.s.unlocked = true
                player.a.unlocked = true
            },
            style() {
                if (true) return Qcolor('rgb(128,128,0)')
            },
            unlocked() {return true},
            },
        14: {
            title() {return "[4] Mid AS (~2.66 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "6AS , 'Equality' achievement , "+format(150394)+" Points , "+format(1498)+" Number" },
            canAfford() { return player.r.bestmastery.lte(2.66)},
            buy() {
                player.n.points = d(1498)
                player.points = d(150394)
                player.n.upgrades = [11,12,13,14]
                player.s.points = d(6)
                player.a.points = d(6)
                player.s.upgrades = [31,32,33]
                player.a.upgrades = [21,22,23]
                player.s.unlocked = true
                player.a.unlocked = true
                player.ac.achievements = [...new Set(player.ac.achievements.concat('18'))]
            },
            style() {
                if (true) return Qcolor('rgb(128,128,0)')
            },
            unlocked() {return true},
            },
        15: {
            title() {return "[5] Mid AS (~3.05 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "7AS , 'New upgrade' unlocked , "+format(d("1.19e7"))+" Points , "+format(259843)+" Number <br> no new Number upgrade yet" },
            canAfford() { return player.r.bestmastery.lte(3.05)},
            buy() {
                player.n.points = d(259843)
                player.points = d("1.19e7")
                player.n.upgrades = [11,12,13,14]
                player.s.points = d(7)
                player.a.points = d(7)
                player.s.upgrades = [31,32,33]
                player.a.upgrades = [21,22,23,24]
                player.s.unlocked = true
                player.a.unlocked = true
                player.ac.achievements = [...new Set(player.ac.achievements.concat('18'))]
            },
            style() {
                if (true) return Qcolor('rgb(128,128,0)')
            },
            unlocked() {return true},
            },
        16: {
            title() {return "[6] Mid Number (~3.38 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "9AS , 6/8 N upg , "+format(d("3.49e9"))+" Points , "+format(d("9.48e6"))+" Number <br>" },
            canAfford() { return player.r.bestmastery.lte(3.38)},
            buy() {
                player.n.points = d("9.48e6")
                player.points = d("3.49e9")
                player.n.upgrades = [11,12,13,14,21,22]
                player.s.points = d(9)
                player.a.points = d(9)
                player.s.upgrades = [31,32,33]
                player.a.upgrades = [21,22,23,24]
                player.s.unlocked = true
                player.a.unlocked = true
                player.ac.achievements = [...new Set(player.ac.achievements.concat('18'))]
            },
            style() {
                if (true) return Qcolor('aqua')
            },
            unlocked() {return true},
            },
        17: {
            title() {return "[7] Early Multiplicative (~4.22 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "8 Multiplicative , 12AS<br> No PB yet" },
            canAfford() { return player.r.bestmastery.lte(4.22)},
            buy() {
                player.n.points = d("2.59e8")
                player.points = d("1.158e11")
                player.m.points = d(8)
                player.n.upgrades = [11,12,13,14,21,22,24]
                player.s.points = d(12)
                player.a.points = d(12)
                player.s.upgrades = [31,32,33]
                player.a.upgrades = [21,22,23,24]
                player.m.upgrades = [41]
                player.s.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.ac.achievements = [...new Set(player.ac.achievements.concat('18'))]
            },
            style() {
                if (true) return Qcolor('rgb(0,0,128)')
            },
            unlocked() {return true},
            },
        18: {
            title() {return "[8] late-Early Multiplicative (~5.87 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "149 Multiplicative , 6 PB" },
            canAfford() { return player.r.bestmastery.lte(5.87)},
            buy() {
                player.m.buyables[11] = d(6)
                player.n.points = d("2.58e9")
                player.points = d("3.59e13")
                player.m.points = d(149)
                player.n.upgrades = [11,12,13,14,21,22,24]
                player.s.upgrades = [31,32,33]
                player.a.upgrades = [21,22,23,24]
                player.m.upgrades = [41,42,43]
                player.s.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.ac.achievements = [...new Set(player.ac.achievements.concat('18'))]
            },
            style() {
                if (true) return Qcolor('rgb(0,0,128)')
            },
            unlocked() {return true},
            }, 
        19: {
            title() {return "[9] Mid Subtractive (~7.09 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return ""+format(1094)+" Multiplicative , 8 PB" },
            canAfford() { return player.r.bestmastery.lte(7.09)},
            buy() {
                player.m.buyables[11] = d(8)
                player.n.points = d("1.54e12")
                player.points = d("5.42e14")
                player.m.points = d(1094)
                player.n.upgrades = [11,12,13,14,21,22,24]
                player.s.upgrades = [31,32,33]
                player.a.upgrades = [21,22,23,24]
                player.m.upgrades = [41,42,43,44]
                player.s.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.ac.achievements = [...new Set(player.ac.achievements.concat('18'))]
            },
            style() {
                if (true) return Qcolor('rgb(0,0,128)')
            },
            unlocked() {return true},
            }, 
        20: {
            title() {return "[10] Mid Subtractive (~7.34 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "only 'Faster automation' upgrade" },
            canAfford() { return player.r.bestmastery.lte(7.34)},
            buy() {
                player.m.buyables[11] = d(10)
                player.n.points = d("8.33e13")
                player.points = d("2.09e15")
                player.m.points = d(1095)
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.s.upgrades = [31,32,33,41]
                player.a.upgrades = [21,22,23,24]
                player.m.upgrades = [41,42,43,44]
                player.s.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.ac.achievements = [...new Set(player.ac.achievements.concat('18'))]
            },
            style() {
                if (true) return Qcolor('rgb(180,0,0)')
            },
            unlocked() {return true},
            },
        21: {
            title() {return "[10b] Mid Subtractive (~10 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "only 'Additive cheapener' upgrade" },
            canAfford() { return player.r.bestmastery.lte(10)},
            buy() {
                player.m.buyables[11] = d(15)
                player.m.points = d("1.98e5")
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.s.upgrades = [31,32,33,43]
                player.a.upgrades = [21,22,23,24]
                player.m.upgrades = [41,42,43,44]
                player.s.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.ac.achievements = [...new Set(player.ac.achievements.concat('18'))]
            },
            style() {
                if (true) return Qcolor('rgb(180,0,0)')
            },
            unlocked() {return true},
            },
        22: {
            title() {return "[11] Mid Multiplicative (~16 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "all Subtractive upgrade bought , all Additive upgrade bought , all Multiplicative challenge completed " },
            canAfford() { return player.r.bestmastery.lte(16)},
            buy() {
                player.points = d("1e34")
                player.m.buyables[11] = d(40)
                player.m.points = d("3.48e12")
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.s.upgrades = [31,32,33,41,42,43]
                player.a.upgrades = [21,22,23,24,31,32,33,34]
                player.m.upgrades = [41,42,43,44,51,52]
                player.s.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.d.unlocked = true
                player.m.challenges[11] = 1
                player.m.challenges[12] = 1
                player.ac.achievements = [...new Set(player.ac.achievements.concat('18'))]

            },
            style() {
                if (true) return Qcolor('rgb(0,80,240)')
            },
            unlocked() {return true},
            }, 
        23: {
            title() {return "[12] Early divisive (~22.9 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "78 Divisive" },
            canAfford() { return player.r.bestmastery.lte(22.9)},
            buy() {
                player.points = d("1e44")
                player.m.buyables[11] = d(41)
                player.m.points = d("1e14")
                player.d.points = d("78")
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.s.upgrades = [31,32,33,41,42,43]
                player.a.upgrades = [21,22,23,24,31,32,33,34]
                player.m.upgrades = [41,42,43,44,51,52]
                player.s.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.d.unlocked = true
                player.m.challenges[11] = 1
                player.m.challenges[12] = 1
                player.ac.achievements = [...new Set(player.ac.achievements.concat('18'))]
            },
            style() {
                if (true) return Qcolor('rgb(89,0,0)')
            },
            unlocked() {return true},
            } ,
        24: {
            title() {return "[13] Early Exponent (~29.2 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "1 Exponent , no other progress" },
            canAfford() { return player.r.bestmastery.lte(29.2)},
            buy() {
                player.r.bestmastery = d(29.21)
                player.e.points = d(1)
                player.s.unlocked = true
                player.e.unlocked = true
                player.d.unlocked = true
                player.m.unlocked = true
                player.a.unlocked = true
                for (let i = 0; i < 20; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
            },
            style() {
                if (true) return Qcolor('purple')
            },
            unlocked() {return true},
            },
        25: {
            title() {return "[14] Early Exponent II (~45.5 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "3 Exponent , no other progress" },
            canAfford() { return player.r.bestmastery.lte(45.5)},
            buy() {
                player.r.bestmastery = d(36)
                player.e.points = d(3)
                player.s.unlocked = true
                player.e.unlocked = true
                player.d.unlocked = true
                player.m.unlocked = true
                player.a.unlocked = true
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                for (let i = 0; i < 20; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(35)))]
            },
            style() {
                if (true) return Qcolor('purple')
            },
            unlocked() {return true},
            },
        26: {
            title() {return "[15] Early Exponent III (~81.2 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "5 Exponent , 'Uncosty exponent' " },
            canAfford() { return player.r.bestmastery.lte(81.2)},
            buy() {
                player.r.bestmastery = d(81.2)
                player.e.points = d(5)
                player.s.unlocked = true
                player.e.unlocked = true
                player.d.unlocked = true
                player.m.unlocked = true
                player.a.unlocked = true
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.e.upgrades = [52]
                for (let i = 0; i < 20; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(35)))]
            },
            style() {
                if (true) return Qcolor('purple')
            },
            unlocked() {return true},
            },
        27: {
            title() {return "[16] Perk power unlocked (~103.8 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "Perk power unlocked , "+format(d("2408588"))+" Ticks" },
            canAfford() { return player.r.bestmastery.lte(103.8)},
            buy() {
                player.r.bestmastery = d(103.8)
                player.t.points = d(2408588)
                player.e.points = d(7)
                player.s.unlocked = true
                player.e.unlocked = true
                player.d.unlocked = true
                player.m.unlocked = true
                player.a.unlocked = true
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.e.upgrades = [51,52]
                for (let i = 0; i < 20; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(35)))]
            },
            style() {
                if (true) return Qcolor('purple')
            },
            unlocked() {return true},
            },
        28: {
            title() {return "[17] Perk power II (~134.1 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "Perk power unlocked , 2 more Exponent upgrade , "+format(d("5028548"))+" Ticks" },
            canAfford() { return player.r.bestmastery.lte(134.1)},
            buy() {
                player.r.bestmastery = d(134.1)
                player.t.points = d(5028548)
                player.t.total = d(5028548)
                player.e.points = d(8)
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.s.upgrades = [31,32,33,41,42,43]
                player.a.upgrades = [21,22,23,24,31,32,33,34]
                player.m.upgrades = [41,42,43,44,51,52]
                player.s.unlocked = true
                player.e.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.d.unlocked = true
                player.m.challenges[11] = 1
                player.m.challenges[12] = 1
                for (let i = 0; i < 20; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(35)))]
            },
            style() {
                if (true) return Qcolor('purple')
            },
            unlocked() {return true},
            },
        29: {
            title() {return "[18] R1 (~186 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "Research unlocked" },
            canAfford() { return player.r.bestmastery.lte(186)},
            buy() {
                player.r.bestmastery = d(186.40)
                player.t.points = d(2059815)
                player.t.total = d(9259815)
                player.t.upgrades = [11,12,13,14]
                player.r.points = d(1)
                player.s.unlocked = true
                player.e.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.d.unlocked = true
                for (let i = 0; i < 35; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
            },
            style() {
                if (true) return Qcolor('rgb(150,20,40)')
            },
            unlocked() {return true},
            },
        30: {
            title() {return "[19] R2 (~391 Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "2 Research , Algebric contents ignored" },
            canAfford() { return player.r.bestmastery.lte(391)},
            buy() {
                player.r.bestmastery = d(391.15)
                player.t.points = d(15544594)
                player.t.total = d(22744594)
                player.t.upgrades = [11,12,13,14]
                player.e.upgrades = [51,52,53,54,61,62,63,64]
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.s.upgrades = [31,32,33,41,42,43,51,52,53]
                player.a.upgrades = [21,22,23,24,31,32,33,34,41,42,43,44]
                player.m.upgrades = [41,42,43,44,51,52]
                player.r.points = d(2)
                player.s.unlocked = true
                player.e.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.d.unlocked = true
                for (let i = 0; i < 35; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
            },
            style() {
                if (true) return Qcolor('rgb(150,20,40)')
            },
            unlocked() {return true},
            },
        31: {
            title() {return "[20] R3 (~"+format(2028.5)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "3 Research , some algebric contents completed" },
            canAfford() { return player.r.bestmastery.lte(2028.5)},
            buy() {
                player.al.points = d("2.56359e40")
                player.al.extension = d("1.196653e11")
                player.al.upgrades = [11,12,13,14,21,22,23,24]
                player.al.buyables[11] = d(288)
                player.al.buyables[12] = d(224)
                player.al.buyables[13] = d(192)
                player.al.buyables[14] = d(138)
                player.al.buyables[21] = d(5)
                player.al.buyables[22] = d(24)
                player.al.buyables[23] = d(8)
                player.al.buyables[24] = d(8)

                player.m.challenges[11] = d(1)
                player.m.challenges[12] = d(1)
                player.d.challenges[11] = d(1)
                player.d.challenges[12] = d(1)
                player.e.challenges[11] = d(1)
                player.e.challenges[12] = d(1)

                player.e.buyables[41] = d(8)
                player.e.buyables[42] = d(5)
                player.r.bestmastery = d(2028.5)
                player.t.points = d(42000000)
                player.t.total = d(66000000)
                player.t.upgrades = [11,12,13,14,15,16,21,22,23,24]
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.s.upgrades = [31,32,33,41,42,43,51,52,53]
                player.a.upgrades = [21,22,23,24,31,32,33,34,41,42,43,44]
                player.m.upgrades = [41,42,43,44,51,52,53,54,61,62]
                player.e.upgrades = [51,52,53,54,61,62,63,64]
                player.r.points = d(3)
                player.e.points = d(12)
                player.e.perkpower = d(11)
                player.s.unlocked = true
                player.e.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.d.unlocked = true
                for (let i = 0; i < 36; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
            },
            style() {
                if (true) return Qcolor('rgb(150,20,40)')
            },
            unlocked() {return true},
            },
        32: {
            title() {return "[21] 3R + Improvements (~"+format(3498.29)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "3 Research , improvements , some algebric contents completed" },
            canAfford() { return player.r.bestmastery.lte(3498.29)},
            buy() {
                player.al.points = d("2.852958e45")
                player.al.extension = d("2.547583e14")
                player.al.operation = d("1.598394e9")
                player.al.upgrades = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44]
                player.al.buyables[11] = d(288)
                player.al.buyables[12] = d(224)
                player.al.buyables[13] = d(192)
                player.al.buyables[14] = d(138)
                player.al.buyables[21] = d(5)
                player.al.buyables[22] = d(30)
                player.al.buyables[23] = d(8)
                player.al.buyables[24] = d(8)
                player.al.buyables[31] = d(7)
                player.al.buyables[32] = d(11)
                player.al.buyables[33] = d(5)
                player.al.buyables[34] = d(4)

                player.m.challenges[11] = d(1)
                player.m.challenges[12] = d(1)
                player.d.challenges[11] = d(1)
                player.d.challenges[12] = d(1)
                player.e.challenges[11] = d(1)
                player.e.challenges[12] = d(1)

                player.e.buyables[41] = d(8)
                player.e.buyables[42] = d(5)
                player.r.bestmastery = d(3498.29)
                player.t.points = d(42000000)
                player.t.total = d(66000000)
                player.t.upgrades = [11,12,13,14,15,16,21,22,23,24]
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.s.upgrades = [31,32,33,41,42,43,51,52,53]
                player.a.upgrades = [21,22,23,24,31,32,33,34,41,42,43,44]
                player.m.upgrades = [41,42,43,44,51,52,53,54,61,62]
                player.e.upgrades = [51,52,53,54,61,62,63,64]
                player.r.points = d(3)
                player.e.points = d(14)
                player.e.perkpower = d(11)
                player.s.unlocked = true
                player.e.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.d.unlocked = true
                for (let i = 0; i < 37; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
                for (let i = 54; i < 56; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
            },
            style() {
                if (true) return Qcolor('rgb(150,20,40)')
            },
            unlocked() {return true},
            },
        33: {
            title() {return "[22] Can Meta-reset (~"+format(10230)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "6 Research , improvements , algebric contents completed" },
            canAfford() { return player.r.bestmastery.lte(10230)},
            buy() {
                player.al.points = d("4.19538e66")
                player.al.extension = d("3.948367e18")
                player.al.operation = d("1.098563e20")
                player.al.upgrades = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44,51,52,53,54]
                player.al.buyables[11] = d(450)
                player.al.buyables[12] = d(340)
                player.al.buyables[13] = d(280)
                player.al.buyables[14] = d(403)
                player.al.buyables[21] = d(6)
                player.al.buyables[22] = d(32)
                player.al.buyables[23] = d(12)
                player.al.buyables[24] = d(13)
                player.al.buyables[31] = d(20)
                player.al.buyables[32] = d(82)
                player.al.buyables[33] = d(5)
                player.al.buyables[34] = d(15)

                player.m.challenges[11] = d(1)
                player.m.challenges[12] = d(1)
                player.d.challenges[11] = d(1)
                player.d.challenges[12] = d(1)
                player.d.challenges[13] = d(1)
                player.e.challenges[11] = d(1)
                player.e.challenges[12] = d(1)

                player.e.buyables[41] = d(8)
                player.e.buyables[42] = d(25)
                player.r.bestmastery = d(10230)
                player.t.points = d(76000000)
                player.t.total = d(100000000)
                player.t.upgrades = [11,12,13,14,15,16,21,22,23,24]
                player.n.upgrades = [11,12,13,14,21,22,23,24]
                player.s.upgrades = [31,32,33,41,42,43,51,52,53]
                player.a.upgrades = [21,22,23,24,31,32,33,34,41,42,43,44]
                player.m.upgrades = [41,42,43,44,51,52,53,54,61,62,63,64,71,72,73,74]
                player.e.upgrades = [51,52,53,54,61,62,63,64]
                player.r.points = d(6)
                player.e.points = d(32)
                player.e.perkpower = d(35)
                player.s.unlocked = true
                player.e.unlocked = true
                player.a.unlocked = true
                player.m.unlocked = true
                player.d.unlocked = true
                player.r.lightadd = d("894856")
                player.r.darksub = d("405945")
                player.r.twilight = d("2.948e8")
                player.r.prestigetime = d("11094")
                player.r.buyables[101] = d(9)
                player.r.buyables[102] = d(8)
                player.r.buyables[103] = d(6)
                player.r.buyables[201] = d(3)
                player.r.buyables[202] = d(14)
                player.r.buyables[203] = d(7)
                player.r.buyables[301] = d(3)
                player.r.buyables[302] = d(7)
                player.r.buyables[303] = d(8)
                player.r.buyables[401] = d(24)
                player.r.buyables[402] = d(18) 
                player.r.buyables[403] = d(15)

                for (let i = 0; i < 38; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
                for (let i = 40; i < 47; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) * 10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(54)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(64)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(66)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(67)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(68)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(69)))]


                for (let i = 54; i < 63; i++) {
                    let k = i % 9 + 11 + Math.floor(i / 9) *  10
                    player.ac.achievements = [... new Set(player.ac.achievements.concat(String(k)))]
                }
            },
            style() {
                if (true) return Qcolor('purple')
            },
            unlocked() {return true},
            },
        34: {
            title() {return "[23] 2 Meta-research (~"+format(11850)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "Upgrade Keep row2 II" },
            canAfford() { return player.r.bestmastery.lte(11850)},
            buy() {
                buyBuyable('p',33)
                player.r.upgrades = [15]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(91)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(92)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(53)))]
                player.r.bestmastery = d(11850)
            },
            style() {
                if (true) return Qcolor('purple')
            },
            unlocked() {return true},
            },
        35: {
            title() {return "[24] (~"+format(12059)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "All keep upg" },
            canAfford() { return player.r.bestmastery.lte(12059)},
            buy() {
                buyBuyable('p',33)
                player.r.upgrades = [13,15,21]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(91)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(92)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(53)))]
                player.r.bestmastery = d(12059)
            },
            style() {
                if (true) return Qcolor('purple')
            },
            unlocked() {return true},
            },
        36: {
            title() {return "[25] (~"+format(12190)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "All keep upg" },
            canAfford() { return player.r.bestmastery.lte(12190)},
            buy() {
                buyBuyable('p',33)
                player.r.upgrades = [13,15,21]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(91)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(92)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(53)))]
                player.r.bestmastery = d(12190)
            },
            style() {
                if (true) return Qcolor('purple')
            },
            unlocked() {return true},
            },
        37: {
            title() {return "[26] (~"+format(15984)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "All keep upg , 2 Tetration" },
            canAfford() { return player.r.bestmastery.lte(15984)},
            buy() {
                buyBuyable('p',33)
                player.r.tetration = d(2)
                player.r.upgrades = [13,15,21]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(91)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(92)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(53)))]
                player.r.bestmastery = d(15984)
            },
            style() {
                if (true) return Qcolor('green')
            },
            unlocked() {return true},
            },
        38: {
            title() {return "[27] (~"+format(19858)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "ALL qol upgrade , 6.29 spare MR , 4 Tetration" },
            canAfford() { return player.r.bestmastery.lte(19858)},
            buy() {
                buyBuyable('p',33)
                player.r.tetration = d(4)
                player.r.metaresearch = d(6.29)
                player.r.upgrades = [11,12,13,14,15,21,22,23,24,31,32,33,41,42,51]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(91)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(92)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(53)))]
                player.r.bestmastery = d(19868)
            },
            style() {
                if (true) return Qcolor('green')
            },
            unlocked() {return true},
            },
        39: {
            title() {return "[28] (~"+format(19858)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "ALL qol upgrade , 43.97 spare MR , 4 Tetration" },
            canAfford() { return player.r.bestmastery.lte(19858)},
            buy() {
                buyBuyable('p',33)
                player.r.tetration = d(4)
                player.r.metaresearch = d(43.97)
                player.r.upgrades = [11,12,13,14,15,21,22,23,24,31,32,33,41,42,51]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(91)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(92)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(53)))]
                player.r.bestmastery = d(19868)
            },
            style() {
                if (true) return Qcolor('green')
            },
            unlocked() {return true},
            },
        40: {
            title() {return "[29] (~"+format(24095)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "ALL qol upgrade, 6 Tetration" },
            canAfford() { return player.r.bestmastery.lte(24095)},
            buy() {
                buyBuyable('p',33)
                player.r.tetration = d(6)
                player.r.metaresearch = d(34.51)
                player.r.upgrades = [11,12,13,14,15,21,22,23,24,31,32,33,41,42,51]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(91)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(92)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(53)))]
                player.r.bestmastery = d(24095)
            },
            style() {
                if (true) return Qcolor('green')
            },
            unlocked() {return true},
            },
        41: {
            title() {return "[30] (~"+format(27622)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "(...)" },
            canAfford() { return player.r.bestmastery.lte(27622)},
            buy() {
                buyBuyable('p',33)
                player.r.tetration = d(8)
                player.r.metaresearch = d(34.51)
                player.r.upgrades = [11,12,13,14,15,21,22,23,24,31,32,33,41,42,51]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(91)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(92)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(53)))]
                player.r.bestmastery = d(27622)
            },
            style() {
                if (true) return Qcolor('green')
            },
            unlocked() {return true},
            },
        42: {
            title() {return "[31] 8 Challenge shard (~"+format(34503)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "(...)" },
            canAfford() { return player.r.bestmastery.lte(34503)},
            buy() {
                buyBuyable('p',33)
                player.r.tetration = d(8)
                player.r.challengeshard = d(8)
                player.r.metaresearch = d(59.24)
                player.r.upgrades = [11,12,13,14,15,21,22,23,24,31,32,33,41,42,51]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(91)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(92)))]
                player.ac.achievements = [... new Set(player.ac.achievements.concat(String(53)))]
                addAchievement('ac',81)
                addAchievement('ac',82)
                addAchievement('ac',83)
                addAchievement('ac',84)
                addAchievement('ac',85)
                addAchievement('ac',86)
                addAchievement('ac',88)
                addAchievement('ac',87)
                addAchievement('ac',89)

                player.r.bestmastery = d(34503)
            },
            style() {
                if (true) return Qcolor('green')
            },
            unlocked() {return true},
            },
        43: {
            title() {return "[32] Facing the end (~"+format(36000)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "No tasks completed yet" },
            canAfford() { return player.r.bestmastery.lte(36000)},
            buy() {
                player.r.bestmastery = d(36000)
                options.earlyskip = 1
                earlyskip()
            },
            style() {
                if (true) return Qcolor('orange')
            },
            unlocked() {return true},
            },
        44: {
            title() {return "[33] -End of Graduation I- (~"+format(45864)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "All tasks completed" },
            canAfford() { return player.r.bestmastery.lte(45864)},
            buy() {
                player.r.bestmastery = d(45864)
                player.g.req[0] = d(1)
                player.g.req[1] = d(1)
                options.earlyskip = 1
                earlyskip()
            },
            style() {
                if (true) return Qcolor('orange')
            },
            unlocked() {return true},
            },
        45: {
            title() {return "[34] -Start of Graduation II- (~"+format(50000)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "8 challenge shard , 1 graduate" },
            canAfford() { return player.r.bestmastery.lte(50000)},
            buy() {
                player.r.bestmastery = d(50000)
                player.g.req[0] = d(1)
                player.g.req[1] = d(1)
                player.g.rank = d(2)
                player.r.challengeshard = d(8)
                player.r.buyables[121] = d(1)
                player.g.points = d(1)
                options.earlyskip = 1
                earlyskip()
                buyBuyable('g',100)
            },
            style() {
                if (true) return Qcolor('black')
            },
            unlocked() {return true},
            },
        46: {
            title() {return "[2,1] Bits unlocked (~"+format(50000)+" Mastery)"},
            cost(x) { return d(0)},
            display() {return ""},
            tooltip() { return "Bits" },
            canAfford() { return player.r.bestmastery.lte(50000) && player.g.ud.lt(2)},
            buy() {
                buyBuyable('p',21)
                buyBuyable('p',45)
                player.g.ud = d(2)
                player.r.points = d(5)
                player.g.timer = d(1200)
            },
            style() {
                if (true) return Qcolor('aqua')
            },
            unlocked() {return true},
            },
    },
    upgrades: {
       
    },
    challenges: {
       
    },

microtabs: {
    graduation: {
        "???" : {
            unlocked() {return true},
            content: [
                ["blank","25px"],
            ]
            
        },
        "Save bank (dev)" : {
            buttonStyle() {return {'color' : 'gray' , 'border-color' : 'gray'}},
            unlocked() {return options.dev},
            content: [
                ["blank","50px"],
                ["row", [["buyable", 10],["buyable",11],["buyable",12],["buyable",13],["buyable",14]]],
                ["row", [["buyable", 15],["buyable",16],["buyable",17],["buyable",18],["buyable",19]]],
                ["row", [["buyable", 20],["buyable",21],["buyable",22],["buyable",23],["buyable",24]]],
                ["row", [["buyable", 25],["buyable",26],["buyable",27],["buyable",28],["buyable",29]]],
                ["row", [["buyable", 30],["buyable",31],["buyable",32],["buyable",33],["buyable",34]]],
                ["row", [["buyable", 35],["buyable",36],["buyable",37],["buyable",38],["buyable",39]]],
                ["row", [["buyable", 40],["buyable",41],["buyable",42],["buyable",43],["buyable",44]]],
                ["row", [["buyable", 45],["buyable",46],["buyable",47],["buyable",48],["buyable",49]]],
                ["row", [["buyable", 50],["buyable",51],["buyable",52],["buyable",53],["buyable",54]]],
                ["row", [["buyable", 55],["buyable",56],["buyable",57],["buyable",58],["buyable",59]]],


            ]
        }
    
    },
    },
tabFormat: [
    ["blank","25px"],
    ["microtabs", "graduation", { 'border-width': '0px' }],

],
layerShown() { return true}


})

addLayer("o", {
    startData() { return {         
        //general         
        unlocked: true,
        time: d(0),
        realtime: d(0),
        gamespeed: d(1),
        gsupkeep:d(1),
        gsbase: d(1),
        gscost: d(1),
        rerolltime: d(0),
        hourwarp: [0,0,0],
        tenminutewarp: [0,0,0],
        minutewarp: [0,0,0],
        cost: [d(0),d(0),d(0)],
        basecost: [d(0),d(0),d(0)],
        //Heat
        heat: d(0),
        maxHeat: d(100),
        heatResistance: d(1),
        cooling: d(0.4),
        heating: d(0),
        overheat: false,

    }},
    infoboxes: {
    },
    symbol:"O",
    color: "#FF00FF",                       
    tooltip() {return "- "+formatTime(player.o.time)+" Offline time </br> - "+formatTime(player.o.realtime)+" Real time"},
    ttStyle() {
        return {
            "color":"#FF00FF",
            "width":"150px",
            "border":"2px solid",
            "border-color":"#FF00FF",
        }
    },
    row: "side",                           
    type: "none",                        
    automate() {
        let cost = player.o.gsbase

        if(player.o.gsbase.gt(100)) cost = cost.times(player.o.gsbase.div(100).pow(d(1).add(player.o.gsbase.div(100)).pow(0.1)).times(100).ceil().div(100).pow(buyableEffect('o',28)))
        let cost1 = cost.sub(1).times(10).div(9).min(111).times(100).floor().div(100)
        let cost2 = cost.sub(100).max(0)
        let total = cost1.add(cost2)

        let maxHeat = d(100).add(buyableEffect('o',25)).times(buyableEffect('o',29))
        if(hasUpgrade('o',41)) maxHeat = maxHeat.times(1.25)
        
        let heating = d(0)
        if(player.r.gamespeed.gt(1)) heating = heating.add(player.r.gamespeed.sub(1).div(2))
        if(player.o.gamespeed.gt(1)) heating = heating.add(player.o.gamespeed.sub(1).div(2))
        if(hasUpgrade('o',42)) heating = heating.times(0.75)
        if(true) heating = heating.times(buyableEffect('o',26)).div(buyableEffect('o',29))
        let cooling = d(0.25)
        if(hasUpgrade('o',43)) cooling = cooling.times(1.25)
        if(true) cooling = cooling.times(buyableEffect('o',27)).times(buyableEffect('o',29))
        if(hasUpgrade('o',44) && player.o.overheat) cooling = cooling.times(1.25)
        player.o.heating = heating
        player.o.cooling = cooling
        player.o.maxHeat = maxHeat

        player.o.gscost = total.clampMin(0)
        if(options.dev) total = d(1)
        player.o.gsupkeep = player.o.realtime.div(total.max(0.01))

        if(player.o.gsupkeep.lt(10) && player.o.gamespeed.neq(1)) {
            buyBuyable('o',24)
            doPopup("achievement", "You don't have enough Real time", "Gamespeed multiplier off", 3, tmp.o.color)
        }
        if(player.o.heat.gte(player.o.maxHeat)) {
            buyBuyable('o',24)
            buyBuyable('r',1004)
            doPopup("Machine", "OVERHEATED", "", 3, 'red')
            player.o.overheat = true
        }
        if(player.o.heat.lte(player.o.maxHeat.div(2)) && player.o.overheat) {
            doPopup("Machine", "Cooled down", "", 3, 'green')
            player.o.overheat = false
        }
    },
    update(delta) {
        if(!player.o.gamespeed.eq(1) && !options.dev) {
            player.o.realtime = player.o.realtime.sub(player.o.gscost.times(delta))
        }
        player.o.rerolltime = player.o.rerolltime.sub(d(1).times(delta))
        player.o.heat = player.o.heat.add(player.o.heating.sub(player.o.cooling).times(d(delta).clampMax(0.05))).clampMin(0).clampMax(player.o.maxHeat)
    },

    layerShown() { return true }, 
upgrades: {
    11: {
        title: "Better converter I",
        description: "",
        cost() {return d(500)},
        tooltip() {return "Converter is 1% more effective <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
        unlocked() {return !hasUpgrade('o',this.id)},
    },
    12: {
        title: "Better converter II",
        description: "",
        cost() {return d(2000)},
        tooltip() {return "Converter is 1% more effective <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
        unlocked() {return hasUpgrade('o',this.id - 1) && !hasUpgrade('o',this.id)},
    },
    13: {
        title: "Better converter III",
        description: "",
        cost() {return d(8000)},
        tooltip() {return "Converter is 1% more effective <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
        unlocked() {return hasUpgrade('o',this.id - 1) && !hasUpgrade('o',this.id)},

    },
    14: {
        title: "Better converter IV",
        description: "",
        cost() {return d(28000)},
        tooltip() {return "Converter is 1% more effective <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
        unlocked() {return hasUpgrade('o',this.id - 1) && !hasUpgrade('o',this.id)},

    },
    21: {
        title: "Better converter V",
        description: "",
        cost() {return d(98000)},
        tooltip() {return "Converter is 1% more effective <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
        unlocked() {return hasUpgrade('o',14) && !hasUpgrade('o',this.id)},
    },
    22: {
        title: "Better converter VI",
        description: "",
        cost() {return d(294000)},
        tooltip() {return "Converter is 1% more effective <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
        unlocked() {return hasUpgrade('o',this.id - 1) && !hasUpgrade('o',this.id)},
    },
    23: {
        title: "Better converter VII",
        description: "",
        cost() {return d(876000)},
        tooltip() {return "Converter is 1% more effective <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
        unlocked() {return hasUpgrade('o',this.id - 1) && !hasUpgrade('o',this.id)},
    },
    24: {
        title: "Better converter VIII",
        description: "",
        cost() {return d(1752000)},
        tooltip() {return "Converter is 1% more effective <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
        unlocked() {return hasUpgrade('o',this.id - 1) && !hasUpgrade('o',this.id)},
    },
    31: {
        title: "Better converter IX",
        description: "",
        cost() {return d(3504000)},
        tooltip() {return "Converter is 1% more effective <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
        unlocked() {return hasUpgrade('o',24) && !hasUpgrade('o',this.id)},
    },
    32: {
        title: "Better converter X",
        description: "",
        cost() {return d(35040000)},
        tooltip() {return "Converter is 1% more effective <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
        unlocked() {return hasUpgrade('o',31) && !hasUpgrade('o',32)},
    },
    41: {
        title: "Endurance",
        description: "",
        cost() {return d(36000)},
        tooltip() {return "You can endure 25% more Heat <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
    },
    42: {
        title: "Effective control",
        description: "",
        cost() {return d(36000)},
        tooltip() {return "Heat from all time-speedup increase 25% slower  <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
    },
    43: {
        title: "Cooling measure",
        description: "",
        cost() {return d(48000)},
        tooltip() {return "You lose 25% more heat passively <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
    },
    44: {
        title: "Emergency coolants",
        description: "",
        cost() {return d(72000)},
        tooltip() {return "You lose 25% more heat passively , but only while OVERHEATED <br> Cost : "+formatTime(this.cost())+" Offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        currencyLocation() { return player.o },
        currencyDisplayName: "second Offline Time",
        currencyInternalName: "time",
    },
        },        
buyables: {
    11: {
        title() {
            return +getBuyableAmount(this.layer, this.id) + "/40 <br/> Better converter"
        } ,
        cost(x) { 
            let cost = x.add(1).pow(1.5).tetrate(1.3).times(60)
            return cost.floor()},
        tooltip() {return "Converter is "+format(this.effect().times(100).sub(25),0)+"% more effective </br> Cost : " +formatTime(this.cost()) + " offline time"},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        canAfford() { return player[this.layer].time.gte(this.cost()) },
        buy() {
            player.o.time = player.o.time.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
            let effect = x.div(100).add(0.25)
            return effect
        },
        purchaseLimit() {
            let a = d(40)
            return a
        },
        style() {
            if (player.o.buyables[11].gte(this.purchaseLimit())) return Qcolor('green')
            else if (player.o.time.lt(this.cost())) return Qcolor('black')
            else return Qcolor('rgb(128, 128, 32)' )
            },
        unlocked() {return !getBuyableAmount(this.layer,this.id).gte(40)},
        },
    12: {
        title() {
            return "Convert Offline time to Real time"
        },
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        cost(x) { 
            let cost = x.add(1).pow(1.5).times(60)
            return cost.floor()},
        display() { return Qcolor2('y',"Require at least 10 seconds of offline time") },
        canAfford() { return player[this.layer].time.gte(10) },
        buy() {
            let eff = d(0)
            eff = eff.add(buyableEffect('o',11).times(100).sub(25))
            eff = eff.add(player.o.upgrades.filter(x => x<33).length)
            let a = player.o.time.times(eff.div(100))
            player.o.realtime = player.o.realtime.add(a)
            player.o.time = d(0)
        },
        tooltip() {
            let eff = d(0)
            eff = eff.add(buyableEffect('o',11).times(100).sub(25))
            eff = eff.add(player.o.upgrades.filter(x => x<33).length)
            let a = player.o.time.times(eff.div(100))
            return "You will gain "+formatTime(a)+" real time <br> Conversion efficiency : "+format(eff,0)+"% <br> "
        },
        style() {
            return Qcolor('aqua')
        }
    },
    21: {
        title() {
            let a = shiftDown?5:1
            a = d(a).times(player.o.gsbase.div(100).max(0).floor().add(1))
            return "+"+format(a,0)+" Gamespeed factor"
        } ,
        cost(x) { 
            return d(0)},
        tooltip() {return "Hold shift to increase by 5x instead"},
        ttStyle() {
            return {
                "color":"lime",
                "width":"250px",
                "border":"2px solid",
                "border-color":"green",
            }
        },
        canAfford() { return player.o.gamespeed.eq(1)},
        buy() {
            if(shiftDown) player.o.gsbase = player.o.gsbase.add(d(5).times(player.o.gsbase.div(100).max(0).floor().add(1)))
        if(!shiftDown) player.o.gsbase = player.o.gsbase.add(d(1).times(player.o.gsbase.div(100).max(0).floor().add(1)))

        },
        style() {
            if (player.o.gamespeed.gt(1)) {
                return Qcolor()
            }
            else return Qcolor('green')
            }
    },
    22: {
        title() {
            let a = shiftDown?5:1
            let b = ctrlDown?player.o.gsbase.sub(1):d(a).times(player.o.gsbase.div(100).max(0).floor().add(1))
            return "-"+format(b,0)+" Gamespeed factor"
        } ,
        tooltip() {return "Hold shift to decrease by 5x instead or ctrl to set it to 1 . Do not hold both <br>"},
        ttStyle() {
            return {
                "color":"red",
                "width":"250px",
                "border":"2px solid",
                "border-color":"crimson",
            }
        },
        cost(x) { 
            return d(0) },
        canAfford() { return player.o.gamespeed.eq(1) && player.o.gsbase.gt(1)},
        buy() {
            if(ctrlDown && !shiftDown) player.o.gsbase = d(1)
            if(shiftDown && !ctrlDown) player.o.gsbase = player.o.gsbase.sub(d(5).times(player.o.gsbase.div(100).max(0).floor().add(1)))
            if(!shiftDown && !ctrlDown) player.o.gsbase = player.o.gsbase.sub(d(1).times(player.o.gsbase.div(100).max(0).floor().add(1)))
        },
        style() {
            if (!this.canAfford()) {
                return Qcolor()
            }
            else return Qcolor('red')}
    },
    23: {
        title() {
            return "Activate (currently : "+format(player.o.gamespeed,0)+"x)"
        } ,
        cost(x) { 
            return d(0)},
        canAfford() { return player.o.gamespeed.eq(1) && player.o.gsbase.gt(1) && player.o.gsupkeep.gte(10) && !player.o.overheat},
        buy() {
            player.o.gamespeed = player.o.gsbase
        },
        style() {
            if (!this.canAfford()) {
                return Qcolor()
            }
            else return Qcolor('green')}
    },
    24: {
        title() {
            return "Deactivate"
        } ,
        cost(x) { 
            return d(0) },
        canAfford() { return player.o.gsbase.neq(1) && !player.o.gamespeed.eq(1)},
        buy() {
            player.o.gamespeed = d(1)
        },
        style() {
            if (player.o.gamespeed.eq(1)) {
                return Qcolor()
            }
            else return Qcolor('green')}

    },
    25: {
        title() {
            return +getBuyableAmount(this.layer, this.id) + "<br/> Adaptation"
        } ,
        cost(x) { 
            let sum = d(0)
            for (let i = 1; i < Math.min(50 - x , 11); i++) {
                sum = sum.add(postcorruptiongain(getBuyableAmount(this.layer,this.id).add(i).pow(getBuyableAmount(this.layer,this.id).add(i).div(3).add(5).log(5).div(3).add(1)).times(30),d(1.21),d(86400)))
            }
            let cost = postcorruptiongain(x.add(1).pow(x.div(3).add(5).log(5).div(3).add(1)).times(30),d(1.21),d(86400))
            if(shiftDown) cost = sum
            return cost.floor()},
        tooltip() {return this.display()},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        display() { return "Increase Max heat by "+Qcolor2('e',format((this.effect()),2)+"")+" => "+Qcolor2('e',format(this.nexteffect(),2))+" </br> Cost : " +Qcolor2('e',formatTime(this.cost())) + " offline time" },
        canAfford() { return player[this.layer].time.gte(this.cost()) },
        buy() {
            player.o.time = player.o.time.sub(this.cost())
            if(shiftDown) {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(10).min(50))

            } else {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        effect(x) {
            let effect = d(10).times(x)
            return effect
        },
        nexteffect() {
            let effect = d(10).times(d(getBuyableAmount(this.layer,this.id)).add(1).min(50))
            let effect2 = d(10).times(d(getBuyableAmount(this.layer,this.id)).add(10).min(50))
            if(shiftDown) effect = effect2
            return effect
        },
        purchaseLimit() {
            return d(50)
        },
        style() {
            if(getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return Qcolor('aqua')
            if (player.o.time.lt(this.cost())) return Qcolor('black')
            else return Qcolor('rgb(128, 128, 32)' )
            },
        unlocked() {return player.r.bestmastery.gte(25000)},
        },
     26: {
        title() {
            return +getBuyableAmount(this.layer, this.id) + "<br/> Better Material"
        } ,
        cost(x) { 
            let sum = d(0)
            for (let i = 1; i < Math.min(50 - x , 11); i++) {
                sum = sum.add(postcorruptiongain(getBuyableAmount(this.layer,this.id).add(i).times(1).pow(getBuyableAmount(this.layer,this.id).add(i).div(3).log(3).div(3).add(1)).times(60),d(1.125),d(86400)))
            }
            let cost = postcorruptiongain(x.times(1).add(1).pow(x.div(3).log(3).div(3).add(1)).times(60),d(1.125),d(86400))
            if(shiftDown) cost = sum
            return cost.floor()},
        tooltip() {return this.display()},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        display() { return "Multiply heat increase from all time-speedup machine by "+Qcolor2('e',format((this.effect()),4)+"x")+" => "+Qcolor2('e',format(this.nexteffect(),4))+"x </br> Cost : " +Qcolor2('e',formatTime(this.cost())) + " offline time" },
        canAfford() { return player[this.layer].time.gte(this.cost()) },
        buy() {
            player.o.time = player.o.time.sub(this.cost())
            if(shiftDown) {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(10).min(50))

            } else {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        effect(x) {
            let effect = d(0.98).pow(d(x))
            return effect
        },
        nexteffect() {
            let effect = d(0.98).pow(d(getBuyableAmount(this.layer,this.id)).add(1).min(50))
            let effect2 = d(0.98).pow(d(getBuyableAmount(this.layer,this.id)).add(10).min(50))
            if(shiftDown) effect = effect2
            return effect
        },
        purchaseLimit() {
            return d(50)
        },
        style() {
            if(getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return Qcolor('aqua')
            if (player.o.time.lt(this.cost())) return Qcolor('black')
            else return Qcolor('rgb(128, 128, 32)' )
            },
        unlocked() {return player.r.bestmastery.gte(50000)},
        },
    27: {
        title() {
            return +getBuyableAmount(this.layer, this.id) + "<br/> Cooling machine"
        } ,
        cost(x) { 
            let sum = d(0)
            for (let i = 1; i < Math.min(80 - x , 11); i++) {
                sum = sum.add(postcorruptiongain(getBuyableAmount(this.layer,this.id).add(i).times(0.5).pow(getBuyableAmount(this.layer,this.id).add(i).div(3).log(3).div(2.75).add(1.5)).times(120),d(1.15),d(86400)))
            }
            let cost = postcorruptiongain(x.times(0.5).add(1).pow(x.div(3).log(3).div(2.75).add(1.5)).times(120),d(1.15),d(86400))
            if(shiftDown) cost = sum
            return cost.floor()},
        tooltip() {return this.display()},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        display() { return "Increase Heat loss by "+Qcolor2('e',format((this.effect()),2)+"x")+" => "+Qcolor2('e',format(this.nexteffect(),2))+"x </br> Cost : " +Qcolor2('e',formatTime(this.cost())) + " offline time" },
        canAfford() { return player[this.layer].time.gte(this.cost()) },
        buy() {
            player.o.time = player.o.time.sub(this.cost())
            if(shiftDown) {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(10).min(80))

            } else {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        effect(x) {
            let effect = d(40).pow(d(x).div(80))
            return effect
        },
        nexteffect() {
            let effect = d(40).pow(d(getBuyableAmount(this.layer,this.id)).add(1).min(80).div(80))
            let effect2 = d(40).pow(d(getBuyableAmount(this.layer,this.id)).add(10).min(80).div(80))
            if(shiftDown) effect = effect2
            return effect
        },
        purchaseLimit() {
            return d(80)
        },
        style() {
            if(getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return Qcolor('aqua')
            if (player.o.time.lt(this.cost())) return Qcolor('black')
            else return Qcolor('rgb(128, 128, 32)' )
            },
        unlocked() {return player.r.bestmastery.gte(75000)},
        },
     28: {
        title() {
            return +getBuyableAmount(this.layer, this.id) + "<br/> Effective scaling"
        } ,
        cost(x) { 
            let sum = d(0)
            for (let i = 1; i <  Math.min(100 - x , 11); i++) {
                sum = sum.add(postcorruptiongain(getBuyableAmount(this.layer,this.id).add(i).times(0.6).pow(getBuyableAmount(this.layer,this.id).add(i).div(3).log(2.5).div(16).add(2)).times(240),d(1.225),d(86400)))
            }
            let cost = postcorruptiongain(x.times(0.6).add(1).pow(x.div(3).log(2.5).div(16).add(2)).times(240),d(1.225),d(86400))
            if(shiftDown) cost = sum
            return cost.floor()},
        tooltip() {return this.display()},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        purchaseLimit() {
            return d(100)
        },
        display() { return "Multiply the strength of the cost scaling by "+Qcolor2('e',format((this.effect()),2)+"x")+" => "+Qcolor2('e',format(this.nexteffect(),2))+"x </br> Cost : " +Qcolor2('e',formatTime(this.cost())) + " offline time" },
        canAfford() { return player[this.layer].time.gte(this.cost()) },
        buy() {
            player.o.time = player.o.time.sub(this.cost())
            if(shiftDown) {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(10).min(100))

            } else {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        effect(x) {
            let effect = d(0.95).pow(d(x).add(1).pow(0.8)).add(0.05)
            return effect
        },
        nexteffect() {
            let effect = d(0.95).pow(d(getBuyableAmount(this.layer,this.id)).add(2).min(100).pow(0.8)).add(0.05)
            let effect2 = d(0.95).pow(d(getBuyableAmount(this.layer,this.id)).add(11).min(100).pow(0.8)).add(0.05)
            if(shiftDown) effect = effect2
            return effect
        },
        style() {
            if(getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return Qcolor('aqua')
            if (player.o.time.lt(this.cost())) return Qcolor('black')
            else return Qcolor('rgb(128, 128, 32)' )
            },
        unlocked() {return player.r.bestmastery.gte(100000)},
        },
    29: {
        title() {
            return +getBuyableAmount(this.layer, this.id) + "<br/> Facility Improvements"
        } ,
        cost(x) { 
            let sum = d(0)
            for (let i = 1; i <  Math.min(50 - x , 11); i++) {
                sum = sum.add(postcorruptiongain(getBuyableAmount(this.layer,this.id).add(i).times(1.5).pow(1.5).times(10),d(1.25),d(10)))
            }
            let cost = postcorruptiongain(x.add(1).times(1.5).pow(1.5).times(10),d(1.25),d(10))
            if(shiftDown) cost = sum
            return cost.floor()},
        tooltip() {return this.display()},
        ttStyle() {
            return {
                "color":"#FF00FF",
                "width":"250px",
                "border":"2px solid",
                "border-color":"#FF00FF",
            }
        },
        display() { return "Increase Max heat , divide Heat gained from time-speedup machine , heat cooling by "+Qcolor2('e',format((this.effect()),2)+"x")+" => "+Qcolor2('e',format(this.nexteffect(),2)+"x")+" </br> Cost : " +Qcolor2('e',formatTime(this.cost())) + " offline time" },
        canAfford() { return player[this.layer].time.gte(this.cost()) },
        buy() {
            player.o.time = player.o.time.sub(this.cost())
            if(shiftDown) {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(10).min(50))

            } else {
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        effect(x) {
            let effect = d(1.0225).pow(d(x))
            return effect
        },
        nexteffect() {
            let effect = d(1.0225).pow(d(getBuyableAmount(this.layer,this.id)).add(1).min(50))
            let effect2 = d(1.0225).pow(d(getBuyableAmount(this.layer,this.id)).add(10).min(50))
            if(shiftDown) effect = effect2
            return effect
        },
        purchaseLimit() {
            return d(50)
        },
        style() {
            if(getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return Qcolor('aqua')
            if (player.o.time.lt(this.cost())) return Qcolor('black')
            else return Qcolor('rgb(128, 128, 32)' )
            },
        unlocked() {return player.r.bestmastery.gte(125000)},
        },
        
    31: {
        title() {
        return +getBuyableAmount(this.layer, this.id) + " unused </br> 1 minute warp"
        } ,
        tooltip() { return "Grant 1 min worth of production instantly <br> +5% Heat" },
        ttStyle() {
            return {
                "color":"yellow",
                "width":"250px",
                "border":"2px solid",
                "border-color":"yellow",
            }
        },
        canAfford() { return !options.gamepaused && !player.o.overheat},
        buy() {
            let a = shiftDown?3:1
            if(player.o.buyables[31].gte(a)) {
                player.o.buyables[31] = player.o.buyables[31].sub(a)
                player.o.rerolltime = player.o.rerolltime.add(60 * a)
                player.timePlayed = player.timePlayed - 60 * a
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(20)).times(a))
                gameLoop(60 * a)
            } else if (player.o.buyables[32].gte(1)) {
                player.o.buyables[32] = player.o.buyables[32].sub(1)
                player.o.buyables[31] = player.o.buyables[31].add(10 - a)
                player.o.rerolltime = player.o.rerolltime.add(60 * a)
                player.timePlayed = player.timePlayed - (60 * a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(20)).times(a))

                gameLoop(60 * a)
            } else if (player.o.buyables[33].gte(1)) {
                player.o.buyables[33] = player.o.buyables[33].sub(1)
                player.o.buyables[31] = player.o.buyables[31].add(60 - a)
                player.o.rerolltime = player.o.rerolltime.add(60)
                player.timePlayed = player.timePlayed - (60 * a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(20)).times(a))
                gameLoop(60 * a)
            } else if (player.o.realtime.gte(60 * a)) {
                player.o.realtime = player.o.realtime.sub(60 * a)
                player.o.rerolltime = player.o.rerolltime.add(60 * a)
                player.timePlayed = player.timePlayed - (60 * a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(20)).times(a))
                gameLoop(60 * a)
            } else {
                alert("Not enough real time to warp")
            }
        },
        style() {
            return Qcolor('green')
    }
    },
    32: {
        title() {
        return +getBuyableAmount(this.layer, this.id) + " unused </br> 10 minutes warp"
        } ,
        tooltip() { return "Grant 10 mins worth of production instantly <br> +10% Heat" },
        ttStyle() {
            return {
                "color":"yellow",
                "width":"250px",
                "border":"2px solid",
                "border-color":"yellow",
            }
        },
        canAfford() { return !options.gamepaused && !player.o.overheat },
        buy() {
            let a = shiftDown?3:1
            if(player.o.buyables[32].gte(a)) {
                player.o.buyables[32] = player.o.buyables[32].sub(a)
                player.o.rerolltime = player.o.rerolltime.add(600 * a)
                player.timePlayed = player.timePlayed - (600 * a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(10)).times(a))
                gameLoop(600 * a)
            } else if (player.o.buyables[31].gte(10 * a)) {
                player.o.buyables[31] = player.o.buyables[31].sub(10 * a)
                player.o.rerolltime = player.o.rerolltime.add(600 * a)
                player.timePlayed = player.timePlayed - (600 * a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(10)).times(a))
                gameLoop(600 * a)
            } else if (player.o.buyables[33].gte(1)) {
                player.o.buyables[33] = player.o.buyables[33].sub(1)
                player.o.buyables[32] = player.o.buyables[32].add(6 - a)
                player.o.rerolltime = player.o.rerolltime.add(600 * a)
                player.timePlayed = player.timePlayed - (600 * a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(10)).times(a))
                gameLoop(600 * a)
            } else if (player.o.realtime.gte(600 * a)) {
                player.o.realtime = player.o.realtime.sub(600 * a)
                player.o.rerolltime = player.o.rerolltime.add(600 * a)
                player.timePlayed = player.timePlayed - (600 * a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(10)).times(a))
                gameLoop(600 * a)
            } else {
                alert("Not enough real time to warp")

            }
        },
        style() {
        return Qcolor('green')
    }
    },
    33: {
        title() {
        return +getBuyableAmount(this.layer, this.id) + " unused </br> 1 hour warp"
        } ,
        tooltip() { return "Grant 1h worth of production instantly <br> +20% Heat" },
        ttStyle() {
            return {
                "color":"yellow",
                "width":"250px",
                "border":"2px solid",
                "border-color":"yellow",
            }
        },
        canAfford() { return !options.gamepaused && !player.o.overheat },
        buy() {
            let a = shiftDown?3:1
            if(player.o.buyables[33].gte(a)) {
                player.o.buyables[33] = player.o.buyables[33].sub(a)
                player.o.rerolltime = player.o.rerolltime.add(3600 * a)
                player.timePlayed = player.timePlayed - (3600* a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(5)).times(a))
                gameLoop(3600 * a)
            } else if (player.o.buyables[31].gte(60 * a)) {
                player.o.buyables[31] = player.o.buyables[31].sub(60 * a)
                player.o.rerolltime = player.o.rerolltime.add(3600 * a)
                player.timePlayed = player.timePlayed - (3600 * a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(5)).times(a))
                gameLoop(3600 * a)
            } else if (player.o.buyables[32].gte(6 * a)) {
                player.o.buyables[32] = player.o.buyables[32].sub(6 * a)
                player.o.rerolltime = player.o.rerolltime.add(3600 * a)
                player.timePlayed = player.timePlayed - (3600 * a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(5)).times(a))
                gameLoop(3600 * a)
            } else if (player.o.realtime.gte(3600 * a)) {
                player.o.realtime = player.o.realtime.sub(3600 * a)
                player.o.rerolltime = player.o.rerolltime.add(3600 * a)
                player.timePlayed = player.timePlayed - (3600 * a)
                player.o.heat = player.o.heat.add(d(player.o.maxHeat.div(5)).times(a))
                gameLoop(3600 * a)
            } else {
                alert("Not enough real time to warp")

            }
        },
        style() {
        return Qcolor('green')
    }
    },
    34: {
        title() {
        return "FULL WARP"
        } ,
        canAfford() { return player[this.layer].realtime.gte(10) && player.o.gamespeed.eq(1) && !options.gamepaused },
        tooltip() {
            let a = player.o.realtime
            let b = softcap(a,3600,0.97) //1h 
            let c = softcap(b,86400,0.94) //1d
            let d = softcap(c,604800,0.91) //1w
            let e = softcap(d,2592000,0.88) //1mo
            let f = softcap(e,31536000,0.85) //1y
            return "Consume all of your real time to instantly gain "+formatTime(f)+" worth of production <br> No heat increase"
        },
        ttStyle() {
            return {
                "color":"orange",
                "width":"250px",
                "border":"2px solid",
                "border-color":"orange",
            }
        },
        buy() {
            if (!confirm("Are you sure? This action cannot be undone ")) return
            let a = player.o.realtime
            let b = softcap(a,d(3600),0.97) //1h 
            let c = softcap(b,d(86400),0.94) //1d
            let d = softcap(c,d(604800),0.91) //1w
            let e = softcap(d,d(2592000),0.88) //1mo
            let f = softcap(e,d(31536000),0.85) //1y
            let g = f
            player.timePlayed = player.timePlayed - (g)
            gameLoop(g)
            player.o.realtime = d(0)
        },
        style() {
            return Qcolor('purple')
    }
    },
    35: {
        title() {
        return "ALL unused WARP"
        } ,
        canAfford() { return player.o.gamespeed.eq(1) && !options.gamepaused },
        tooltip() {
            let a = player.o.buyables[31].times(60)
            let b = player.o.buyables[32].times(600)
            let c = player.o.buyables[33].times(3600)
        
            let f = a.add(b).add(c)
            return "Consume all unused warp to instantly gain "+formatTime(f)+" worth of production <br> No heat increase"
        },
        ttStyle() {
            return {
                "color":"orange",
                "width":"250px",
                "border":"2px solid",
                "border-color":"orange",
            }
        },
        buy() {
            if (!confirm("Are you sure? This action cannot be undone")) return
            let a = player.o.buyables[31].times(60)
            let b = player.o.buyables[32].times(600)
            let c = player.o.buyables[33].times(3600)
        
            let f = a.add(b).add(c)
            player.timePlayed = player.timePlayed - (f)
            gameLoop(f)
            player.o.buyables[31] = d(0)
            player.o.buyables[32] = d(0)
            player.o.buyables[33] = d(0)

        },
        style() {
            return Qcolor('purple')
    }
    },
    41: {
        title() {
        return "Reroll bundle"
        } ,
        display() { return "" },
        canAfford() { return player[this.layer].rerolltime.lte(0) },
        buy() {
        player.o.rerolltime = d(60)
        player.o.hourwarp[0] = 0
        player.o.hourwarp[1] = Math.floor(Math.random()*2)
        player.o.hourwarp[2] = Math.floor(Math.random()*4)
        player.o.tenminutewarp[0] = Math.floor(Math.random()*4)
        player.o.tenminutewarp[1] = Math.floor(Math.random()*7)
        player.o.tenminutewarp[2] = Math.floor(Math.random()*13)
        player.o.minutewarp[0] = Math.floor(Math.random()*31)
        player.o.minutewarp[1] = Math.floor(Math.random()*61)
        player.o.minutewarp[2] = Math.floor(Math.random()*61)

        player.o.basecost[0] = (player.o.hourwarp[0] * 3600) + (player.o.tenminutewarp[0] * 600) + (player.o.minutewarp[0] * 60)
        player.o.basecost[1] = (player.o.hourwarp[1] * 3600) + (player.o.tenminutewarp[1] * 600) + (player.o.minutewarp[1] * 60)
        player.o.basecost[2] = (player.o.hourwarp[2] * 3600) + (player.o.tenminutewarp[2] * 600) + (player.o.minutewarp[2] * 60)

        player.o.cost[0] = player.o.basecost[0] * (1 - Math.random() * 0.1)
        player.o.cost[1] = player.o.basecost[1] * (1 - Math.random() * 0.15)
        player.o.cost[2] = player.o.basecost[2] * (1 - Math.random() * 0.2)


        },
        style() {
            if (player.o.rerolltime.gt(0)) {
                return Qcolor()
            }    else return Qcolor('green')
    }
    },
    42: {
        title() {
        return "Small bundle"
        } ,
        tooltip() { return "Cost : "+formatTime(player.o.cost[0])+" real time . Recieve : "+format(player.o.tenminutewarp[0],0)+"x 10m warp & "+format(player.o.minutewarp[0],0)+"x 1m warp" },
        ttStyle() {
            return {
                "color":"yellow",
                "width":"250px",
                "border":"2px solid",
                "border-color":"yellow",
            }
        },
        canAfford() { return player.o.realtime.gte(player.o.cost[0]) },
        buy() {
            player.o.realtime = player.o.realtime.sub(player.o.cost[0])
        player.o.buyables[32] = player.o.buyables[32].add(player.o.tenminutewarp[0])
        player.o.buyables[31] = player.o.buyables[31].add(player.o.minutewarp[0])
        player.o.hourwarp[0] = 0
        player.o.tenminutewarp[0] = 0
        player.o.minutewarp[0] = 0

        player.o.cost[0] = 0


        },
        style() {
            if (player.o.realtime.lt(player.o.cost[0])) {
                return Qcolor()
            }    else return Qcolor('green')
    }
    },
    43: {
        title() {
        return "Medium bundle"
        } ,
        tooltip() { return "Cost : "+formatTime(player.o.cost[1])+" real time . Recieve : "+format(player.o.hourwarp[1],0)+"x 1h warp , "+format(player.o.tenminutewarp[1],0)+"x 10m warp & "+format(player.o.minutewarp[1],0)+"x 1m warp" },
        canAfford() { return player.o.realtime.gte(player.o.cost[1]) },
        ttStyle() {
            return {
                "color":"yellow",
                "width":"250px",
                "border":"2px solid",
                "border-color":"yellow",
            }
        },
        buy() {
            player.o.realtime = player.o.realtime.sub(player.o.cost[1])
        player.o.buyables[33] = player.o.buyables[33].add(player.o.hourwarp[1])
        player.o.buyables[32] = player.o.buyables[32].add(player.o.tenminutewarp[1])
        player.o.buyables[31] = player.o.buyables[31].add(player.o.minutewarp[1])
        player.o.hourwarp[1] = 0
        player.o.tenminutewarp[1] = 0
        player.o.minutewarp[1] = 0

        player.o.cost[1] = 0


        },
        style() {
            if (player.o.realtime.lt(player.o.cost[1])) {
                return Qcolor()
            }    else return Qcolor('green')
    }
    },
    44: {
        title() {
        return "Large bundle"
        } ,
        tooltip() { return "Cost : "+formatTime(player.o.cost[2])+" real time . Recieve : "+format(player.o.hourwarp[2],0)+"x 1h warp, "+format(player.o.tenminutewarp[2],0)+"x 10m warp and "+format(player.o.minutewarp[2],0)+"x 1m warp" },
        canAfford() { return player.o.realtime.gte(player.o.cost[2]) },
        ttStyle() {
            return {
                "color":"yellow",
                "width":"250px",
                "border":"2px solid",
                "border-color":"yellow",
            }
        },
        buy() {
            player.o.realtime = player.o.realtime.sub(player.o.cost[2])
        player.o.buyables[33] = player.o.buyables[33].add(player.o.hourwarp[2])
        player.o.buyables[32] = player.o.buyables[32].add(player.o.tenminutewarp[2])
        player.o.buyables[31] = player.o.buyables[31].add(player.o.minutewarp[2])
        player.o.hourwarp[2] = 0
        player.o.tenminutewarp[2] = 0
        player.o.minutewarp[2] = 0

        player.o.cost[2] = 0


        },
        style() {
            if (player.o.realtime.lt(player.o.cost[2])) {
                return Qcolor()
            }    else return Qcolor('green')
    }
    },
        },
    microtabs: {
        main: {
            "Offline time": {
                buttonStyle() { return { 'color': 'pink' } },
                unlocked() { return true },
                content:  [
            ["microtabs", "stuff", { 'border-width': '0px' }],
                ]
        },
            "Resource gain breakdown": {
            buttonStyle() { return { 'color': 'pink' } },
            unlocked() { return options.nerdy},
            content:  [
            ["raw-html", function () { return "<h3>Resources are categorized into Game stage" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["microtabs", "calc", { 'border-width': '0px' }],
            ]
    },
    },
    calc1: {
        "Overview": {
            buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
            unlocked() { return true },
            content: [
                ["raw-html", function () { return "<h3>Base point gain : +1" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Total point multiplier : x"+format(getMult())+"" }, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Total point exponent : ^"+format(getExp())+"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Totalling : "+format(getMult().pow(getExp()))+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return inChallenge('d',13)?"<h3>ACTIVE CHALLENGE Chaotic Division <br> (Points gain is divided by current Number and cannot exceed Number<sup>0.5</sup>) <br>  Point gain is divided by /"+format(player.n.points.add(1))+" and is capped at "+format(player.n.points.pow(0.5))+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return inChallenge('e',11)?"<h3>ACTIVE CHALLENGE Equality <br> (Points gain cannot exceed Number<sup>0.5</sup>) <br> Point gain is capped at "+format(player.n.points.pow(0.5))+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return inChallenge('e',12)?"<h3>ACTIVE CHALLENGE No Number <br> (Points gain is reduced to 10<sup>log(gain)<sup>"+format(d(0.25).times(player.points.max(10).log(10).pow(-0.1)),6)+"</sup></sup>) <br> Point gain is reduced to "+format(d(10).pow(getMult().pow(getExp()).max(10).log(10).pow(d(0.25).times(player.points.max(10).log(10).pow(-0.1)))))+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No Basic <br> (Points gain is reduced to log(gain)^^1.5 <br> Point gain is reduced to "+format(getMult().pow(getExp()).max(10).log(10).tetrate(1.5))+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Tickspeed : x"+format(tmp.t.effect.div(1000).clampMax(player.t.cap.div(1000)))+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Gamespeed : x"+format(player.r.truegamespeed)+"" }, { "color": "gray", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Point gain : "+format(getPointGen())+"/s" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ]      
        },
        "Multiplier": {
            buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
            unlocked() { return true },
            content: [
                ["raw-html", function () { return hasUpgrade('n',11)&&player.r.tetration.lt(9)?"<h3>Counting faster upgrade : x"+format(upgradeEffect('n',11))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('n',12)&&player.r.tetration.lt(9)?"<h3>Headstart upgrade : x"+format(upgradeEffect('n',12))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('n',13)&&player.r.tetration.lt(9)?"<h3>Effective counting upgrade : x"+format(upgradeEffect('n',13))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('n',14)&&player.r.tetration.lt(9)?"<h3>1st Grade upgrade : x1.2":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('a',21)?"<h3>Addition upgrade : x"+format(upgradeEffect('a',21))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasAchievement('ac',19)?"<h3>"+tmp.ac.achievements[19].name+" achievement : x2":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return getBuyableAmount('m',11).gt(0)?"<h3>Point Boost buyable :  x"+format(buyableEffect('m',11))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasChallenge('m',11)?"<h3>Fatigued challenge completion :  x"+format(challengeEffect('m',11))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('m',61)?"<h3>Strange 5 upgrade :  x5":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.d.points.gt(0)?"<h3>Divisive effect :  x"+format(tmp.d.effect)+"":""}, { "color": "crimson", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.e.effective.gt(0)?"<h3>Exponent effect :  x"+format(tmp.e.effect)+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.r.la1.gt(1)?"<h3>Light additive effect :  x"+format(player.r.la1)+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return getBuyableAmount('al',33).gt(0)?"<h3>Algebric point boost buyable :  x"+format(buyableEffect('al',33))+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('n',31)?"<h3>Point condenser upgrade :  x"+format(getPointCondensereffect_MUL())+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],

                ["blank" , "25px"],
                ["raw-html", function () { return inChallenge('d',12)?"<h3>ACTIVE CHALLENGE Worsen condition (Multiplier is equal to its log<sub>10</sub>)":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["raw-html", function () { return "<h3>Total : x"+format(getMult())+" to base Points gain"}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ]      
        },
        "Exponent": {
            buttonStyle() { return { 'color': 'red' , "border-color" : "purple" } },
            unlocked() { return true },
            content: [
                ["raw-html", function () { return hasUpgrade('n',11)&&player.r.tetration.gte(9)&&getBuyableAmount('r',121).neq(1)?"<h3>Counting faster upgrade : x"+format(upgradeEffect('n',11))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('n',12)&&player.r.tetration.gte(9)&&getBuyableAmount('r',121).neq(1)?"<h3>Headstart upgrade : x"+format(upgradeEffect('n',12))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('n',13)&&player.r.tetration.gte(9)&&getBuyableAmount('r',121).neq(1)?"<h3>Effective counting upgrade : x"+format(upgradeEffect('n',13))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('n',14)&&player.r.tetration.gte(9)&&getBuyableAmount('r',121).neq(1)?"<h3>1st Grade upgrade : x1.01":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('m',43)?"<h3>Glazed point upgrade : x1.05":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.e.effective.gt(0)?"<h3>Exponent effect :  x"+format(tmp.e.expeffect)+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.r.tetration.gte(1)?"<h3>Tetration 1 reward :  x1.1":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasUpgrade('n',31)?"<h3>Point condenser upgrade :  x"+format(getPointCondensereffect_POW())+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return buyableEffect('n',11).neq(1)?"<h3>Bits tree - Point exponent increase : x"+format(buyableEffect('n',11))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasSuperAchievement('ac',19)?"<h3>"+tmp.ac.achievements[19].name+" charged achievement : x1.02":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["raw-html", function () { return inChallenge('d',12)?"<h3>ACTIVE CHALLENGE Worsen condition (Exponent is multiplied by x5)":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return inChallenge('m',11)?"<h3>ACTIVE CHALLENGE Fatigued : (Exponent is multiplied by x0.5)":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return inChallenge('d',13)?"<h3>ACTIVE CHALLENGE Chaotic Division : (Exponent is multiplied by x0.2)":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Point shredder : (Exponent is multiplied by x"+format(player.r.cha)+")":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["raw-html", function () { return player.g.timer.lt(600)?"<h3>GRADUATION Early game nerf : Exponent is multiplied by x"+format(player.g.timer.min(600).div(600))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["raw-html", function () { return "<h3>Total : ^"+format(getExp())+" to base Points gain"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],

            ]      
        },
},
calc21: {
    "Overview": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Base number gain : +"+format(player.points.times(0.1).pow(0.5))+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total number multiplier : x"+format(tmp.n.gainMult)+"" }, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total number exponent : ^"+format(tmp.n.gainExp)+"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Totalling : "+format(tmp.n.resourcegain)+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return tmp.n.resourcegain.gte(player.g.corruption[0])?"<h3>CORRUPTED! <br> After "+format(player.g.corruption[0])+" number gain , excessive number gain is rooted by "+format(corruptionroot(tmp.n.resourcegain,d(0.25),player.g.corruption[0]))+" <br> "+format(tmp.n.resourcegain)+" => "+format(player.g.corruption[0].times(tmp.n.directMult))+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('d',11)?"<h3>ACTIVE CHALLENGE No counting <br> (Number gain is always 0) <br>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No basic <br> (Number gain is always 0) <br>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(1)?"<h3>ACTIVE SACRIFICE Challenge sacrifice <br> (Number gain is always 0) <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Passive generation : x"+format(tmp.n.passiveGeneration.div(tmp.t.effect.div(1000).div(player.r.truegamespeed)))+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Tickspeed : x"+format(tmp.t.effect.div(1000).clampMax(player.t.cap.div(1000)))+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Gamespeed : x"+format(player.r.truegamespeed)+"" }, { "color": "gray", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Number passive gain : "+format(generateAmount('n'))+"/s" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
//Layer_NM
    "Multiplier": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return hasAchievement('ac',18)?"<h3>"+tmp.ac.achievements[18].name+" achievement : x1.1":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',25)?"<h3>"+tmp.ac.achievements[25].name+" achievement : x1.1":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',32)?"<h3>"+tmp.ac.achievements[32].name+" achievement : x2":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',71)?"<h3>"+tmp.ac.achievements[71].name+" achievement : x16":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',73)?"<h3>"+tmp.ac.achievements[73].name+" achievement : x"+format(achievementEffect('ac',73))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',81)&&!inChallenge('al',11)?"<h3>"+tmp.ac.achievements[81].name+" achievement : x"+format(achievementEffect('ac',81))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',87)&&!inChallenge('al',11)?"<h3>"+tmp.ac.achievements[87].name+" achievement : x"+format(achievementEffect('ac',87))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('s',31)&&getBuyableAmount('r',121).neq(1)?"<h3>Subtract upgrade : x"+format(upgradeEffect('s',31))+"":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('a',22)&&getBuyableAmount('r',121).neq(1)?"<h3>Numberic increase upgrade : x"+format(upgradeEffect('a',22))+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',21)&&getBuyableAmount('r',121).neq(1)?"<h3>Counting much faster upgrade : x1.5":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('m',41)&&getBuyableAmount('r',121).neq(1)?"<h3>Numberic increase 2 upgrade : x1.5":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('a',34)&&getBuyableAmount('r',121).neq(1)?"<h3>5th Grade upgrade : x1.5":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',22)&&getBuyableAmount('r',121).neq(1)?"<h3>Reverse increase upgrade : x"+format(upgradeEffect('n',22))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return getBuyableAmount('r',121).eq(1)?"<h3>Number booster perk : x"+format(buyableEffect('e',25))+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasChallenge('m',12)?"<h3>Halted counter challenge :  x"+format(challengeEffect('m',12))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('a',44)&&getBuyableAmount('r',121).neq(1)?"<h3>Spectral perk upgrade : x"+format(upgradeEffect('a',44))+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('al',31)&&getBuyableAmount('r',121).neq(1)?"<h3>Numberic increase 3 upgrade : x4":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('r',12)?"<h3>Passive number upgrade :  x"+format(d(1e9))+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return getBuyableAmount('r',103).gt(0)?"<h3>More equality improvement :  x"+format(buyableEffect('r',103))+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.d.points.gt(0)?"<h3>Divisive effect :  x"+format(tmp.d.effect)+"":""}, { "color": "crimson", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.la2.gt(1)?"<h3>Light additive effect :  x"+format(player.r.la2)+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',32)?"<h3>Number condenser upgrade :  x"+format(getNumberCondensereffect_MUL())+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.s1best.gt(0)?"<h3>Number sacrifice :  x"+format(buyableEffect('g',201))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.effectWeight[0].gte(1)?"<h3> Exponent weight :  x"+format(tmp.e.effect.root(100).pow(player.g.effectWeight[0]))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('d',13)?"<h3>ACTIVE CHALLENGE Chaotic division (Number gain is divided by current Points) : /"+format(player.points.add(1))+"":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Total : x"+format(tmp.n.gainMult)+" to base Number gain"}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    //Layer_NE
    "Exponent": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "purple" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return hasAchievement('ac',92)?"<h3>"+tmp.ac.achievements[92].name+" achievement : x"+format(achievementEffect('ac',92))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasSuperAchievement('ac',18)?"<h3>"+tmp.ac.achievements[18].name+" achievement : x1.05":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return buyableEffect('n',21).neq(1)?"<h3>Bits tree - Number exponent increase : x"+format(buyableEffect('n',21))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.artifactset1[0]>1?"<h3>Artifacts - Active Orb : x"+format(player.g.artifactset1[0])+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.effectWeight[0].gte(1)?"<h3> Exponent weight :  x"+format(tmp.e.expeffect.root(100).pow(player.g.effectWeight[0]))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('m',12)?"<h3>ACTIVE CHALLENGE Halted counter : (Exponent is multiplied by x0.5)":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('d',13)?"<h3>ACTIVE CHALLENGE Chaotic Division : (Exponent is multiplied by x0.1)":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Resource reduction : (Exponent is multiplied by x"+format(player.r.chb)+")":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('al',11)?"<h3>GLOBAL : Altered realm - Resource reduction : (Exponent is multiplied by x"+format(player.al.alteredpow)+")":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.sacrificeactive[0].gte(1)?"<h3>ACTIVE SACRIFICE Number sacrifice : (Exponent is multiplied by x0.05)":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('d',11)?"<h3>ACTIVE CHALLENGE No counting <br> (Exponent always equal to 0) <br>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No basic <br> (Exponent always equal to 0) <br>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Total : ^"+format(tmp.n.gainExp)+" to base Number gain"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
},
calc22: {
    "Overview": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Starting cost : "+format(250)+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('al',11)?"<h3> GLOBAL - Altered realm : Starting additive cost is 10.08 instead":"" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Base cost : x"+format(d(2).pow(player.a.points.pow(1.35)))+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No basic <br> (Additive is always 1) <br>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(2)?"<h3>ACTIVE SACRIFICE Challenge sacrifice <br> (Additive cannot be gained) <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Cost scaling start at "+format(player.a.startsoftcap)+" additive" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Cost scaling : ^"+format(getCostScaling('a',player.a.points,d(0.6)),4)+" (avg : "+format(getCostScaling('a',player.a.points,d(0.6)).sub(1).div(player.a.points.max(player.a.startsoftcap.add(1)).sub(player.a.startsoftcap)))+")" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Direct additive gain : ^"+format(tmp.a.directMult.pow(-1))+" to costs" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.a.points.gte(player.g.corruption[1])?"<h3>CORRUPTED! After "+format(player.g.corruption[1])+" Additive , cost becomes 10^(log<sub>10</sub>cost)^"+format((player.a.points.div(player.g.corruption[1])).max(1),4)+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Cost reduction : /"+format(tmp.a.gainMult.pow(-1))+"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total cost : "+format(static_cost('a',player.a.points,d(0.6)))+"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    //Layer_Acr
    "Cost reduction": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return hasAchievement('ac',21)?"<h3>"+tmp.ac.achievements[21].name+" achievement : /2":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',31)?"<h3>"+tmp.ac.achievements[31].name+" achievement : /5":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',72)?"<h3>"+tmp.ac.achievements[72].name+" achievement : /10":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',82)&&!inChallenge('al',11)?"<h3>"+tmp.ac.achievements[82].name+" achievement : /"+format(achievementEffect('ac',82))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('s',43)?"<h3>Additive cheapener upgrade :  /"+format(upgradeEffect('s',43))+"":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.la3.gt(1)?"<h3>Light additive effect :  /"+format(player.r.la3)+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.e.perkpower.gt(0)?"<h3>Exponent perk : /"+format(buyableEffect('e',22).times(buyableEffect('e',24)))+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('e',51)?"<h3>Power Boost upgrade : /"+format(upgradeEffect('e',51))+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',52)?"<h3>Bits tree - Additive cost reduction :  /"+format(buyableEffect('n',41))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('al',11)?"<h3>GLOBAL : Altered realm - Resource reduction : ^"+format(player.al.alteredpow)+" to cost reduction":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Resource reduction : ^"+format(player.r.chb)+" to cost reduction":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('al',11)?"<h3>GLOBAL : Altered realm : /"+format(24.8)+" (Applied after exponent)":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total Cost reduction : /"+format(tmp.a.gainMult.pow(-1))+"" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return player.g.artifactset1[1] > 1?"<h3>Artifacts - Active Orb : x"+format(player.g.artifactset1[1])+" to Additive gain":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasSuperAchievement('ac',21)?"<h3>Subtractive lord charged achievement : x1.02 to Additive gain":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasSuperAchievement('ac',31)?"<h3>~40th doubling charged achievement : x1.04 to Additive gain":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    //Layer_Acs
    "Cost scaling start": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "purple" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Base : +"+format(100)+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('e',53)?"<h3>Delay additive scaling upgrade : +"+format(upgradeEffect('e',53))+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('a',42)?"<h3>Additive perk upgrade : +"+format(upgradeEffect('a',42))+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return hasChallenge('d',13)?"<h3>Chaotic Division challenge completion : x"+format(challengeEffect('d',13))+"":""}, { "color": "crimson", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasChallenge('d',13)?"<h3>No Number challenge completion : x"+format(challengeEffect('e',12))+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.tetration.gte(3)?"<h3> : 3 Tetration reward : x"+format(1.25)+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasSuperAchievement('ac',72)?"<h3>Three of each charged achievement : x1.05":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE - Meta-research - Cost superscaler : /"+format(player.r.chb)+"":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total : "+format(player.a.startsoftcap)+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
},
calc23: {
    "Overview": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Starting cost : +"+format(250)+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('al',11)?"<h3> GLOBAL - Altered realm : Starting subtractive cost is 10.08 instead":"" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Base cost : x"+format(d(2).pow(player.s.points.pow(1.35)))+"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Cost scaling start at "+format(player.s.startsoftcap)+" subtractive" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No basic <br> (Subtractive is always 1) <br>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(3)?"<h3>ACTIVE SACRIFICE Challenge sacrifice <br> (Subtractive cannot be gained) <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Cost scaling : ^"+format(getCostScaling('s',player.s.points,d(0.6)),4)+" (avg : "+format(getCostScaling('s',player.s.points,d(0.6)).sub(1).div(player.s.points.max(player.s.startsoftcap.add(1)).sub(player.s.startsoftcap)))+")" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Direct subtractive gain : ^"+format(tmp.s.directMult.pow(-1))+" to costs" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.s.points.gte(player.g.corruption[2])?"<h3>CORRUPTED! After "+format(player.g.corruption[2])+" Subtractive , cost becomes 10^(log<sub>10</sub>cost)^"+format((player.s.points.div(player.g.corruption[2])).max(1),4)+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Cost reduction : /"+format(tmp.s.gainMult.pow(-1))+"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total cost : "+format(static_cost('s',player.s.points,d(0.6)))+"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
    //Layer_Scr
    "Cost reduction": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return hasAchievement('ac',41)?"<h3>"+tmp.ac.achievements[24].name+" achievement : /10":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',72)?"<h3>"+tmp.ac.achievements[72].name+" achievement : /10":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',83)&&!inChallenge('al',11)?"<h3>"+tmp.ac.achievements[83].name+" achievement : /"+format(achievementEffect('ac',83))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('s',43)&&hasAchievement('ac',94)?"<h3>Additive cheapener upgrade :  /"+format(upgradeEffect('s',43))+" (<i>Thanks to "+tmp.ac.achievements[94].name+" achievement</i>)":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.da3.gt(1)?"<h3>Dark subtractive effect :  /"+format(player.r.da3)+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.e.perkpower.gt(0)?"<h3>Exponent perk : /"+format(buyableEffect('e',21).times(buyableEffect('e',24)))+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('e',51)?"<h3>Power Boost upgrade : /"+format(upgradeEffect('e',51))+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',52)?"<h3>Bits tree - Subtractive cost reduction :  /"+format(buyableEffect('n',42))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('al',11)?"<h3>GLOBAL : Altered realm - Resource reduction : ^"+format(player.al.alteredpow)+" to cost reduction":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Resource reduction : ^"+format(player.r.chb)+" to cost reduction":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('al',11)?"<h3>GLOBAL : Altered realm : /"+format(24.8)+" (Applied after exponent)":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total Cost reduction : /"+format(tmp.s.gainMult.pow(-1))+"" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return player.g.artifactset1[2] > 1?"<h3>Artifacts - Active Orb : x"+format(player.g.artifactset1[2])+" to Subtractive gain":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasSuperAchievement('ac',24)?"<h3>Is this enough? charged achievement : x1.05 to Subtractive gain":"" }, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Estimated : you can purchase "+format(((player.points.times(tmp.s.gainMult.pow(-1)).times(1/125).max(2).log(10).add(-d(2).log(10))).pow(20/27).times(d(2).log(10).pow(-20/27))).times(tmp.s.directMult).floor())+" additive" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    //Layer_Scs
    "Cost scaling start": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "purple" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Base : +"+format(100)+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('e',54)?"<h3>Delay subtractive scaling upgrade : +"+format(upgradeEffect('e',54))+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return hasChallenge('d',13)?"<h3>Chaotic Division challenge completion : x"+format(challengeEffect('d',13))+"":""}, { "color": "crimson", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasChallenge('d',13)?"<h3>No Number challenge completion : x"+format(challengeEffect('e',12))+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.tetration.gte(3)?"<h3> : 3 Tetration reward : x"+format(1.25)+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasSuperAchievement('ac',72)?"<h3>Three of each charged achievement : x1.05":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE - Meta-research - Cost superscaler : /"+format(player.r.chb)+"":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total : "+format(player.s.startsoftcap)+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
},
calc24: {
    "Overview": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Base multiplicative gain : +"+format(player.n.points.times(tmp.m.requires.pow(-1)).pow(0.5))+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total number multiplier : x"+format(tmp.m.gainMult)+"" }, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total number exponent : ^"+format(tmp.m.gainExp)+"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Totalling : "+format(tmp.m.resourcegain)+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return tmp.m.resourcegain.gte(player.g.corruption[3])?"<h3>CORRUPTED! <br> After "+format(player.g.corruption[3])+" multiplicative gain , excessive multiplicative gain is rooted by "+format(corruptionroot(tmp.m.resourcegain,d(0.225),player.g.corruption[3]))+" <br> "+format(tmp.m.resourcegain)+" => "+format(player.g.corruption[3].times(tmp.m.directMult))+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No basic <br> (Multiplicative gain is always 0) <br>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(4)?"<h3>ACTIVE SACRIFICE Multiplicative <br> (Multiplicative cannot be gained) <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Passive generation : x"+format(tmp.m.passiveGeneration.div(tmp.t.effect.div(1000).div(player.r.truegamespeed)))+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Tickspeed : x"+format(tmp.t.effect.div(1000).clampMax(player.t.cap.div(1000)))+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Gamespeed : x"+format(player.r.truegamespeed)+"" }, { "color": "gray", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Multiplicative passive gain : "+format(generateAmount('m'))+"/s" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    //Layer_MM
    "Multiplier": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return hasAchievement('ac',26)?"<h3>"+tmp.ac.achievements[26].name+" achievement : x1.1":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',84)&&!inChallenge('al',11)?"<h3>"+tmp.ac.achievements[84].name+" achievement : x"+format(achievementEffect('ac',84))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('m',42)?"<h3>Increased multiplicative upgrade : x2":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return getBuyableAmount('r',101).gt(0)?"<h3>More fatigued improvement :  x"+format(buyableEffect('r',101))+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.da1.gt(1)?"<h3>Dark subtractive effect :  x"+format(player.r.da1)+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.effectWeight[1].gte(1)?"<h3> Exponent weight :  x"+format(tmp.e.effect.root(100).pow(player.g.effectWeight[1]))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Total : x"+format(tmp.m.gainMult)+" to base multiplicative gain"}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    //Layer_ME
    "Exponent": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "purple" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return buyableEffect('n',22).neq(1)?"<h3>Bits tree - Multiplicative exponent increase : x"+format(buyableEffect('n',22))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasSuperAchievement('ac',26)?"<h3>10th Doubling charged achievement : x1.05":"" }, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.artifactset1[3]>1?"<h3>Artifacts - Active Orb : x"+format(player.g.artifactset1[3])+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.effectWeight[1].gte(1)?"<h3> Exponent weight :  x"+format(tmp.e.expeffect.root(100).pow(player.g.effectWeight[1]))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Resource reduction : (Exponent is multiplied by x"+format(player.r.chb)+")":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('al',11)?"<h3>GLOBAL : Altered realm - Resource reduction : (Exponent is multiplied by x"+format(player.al.alteredpow)+")":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.sacrificeactive[0].gt(1)?"<h3>ACTIVE SACRIFICE Number sacrifice : (Exponent is multiplied by x2.50)":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No basic <br> (Exponent always equal to 0) <br>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Total : ^"+format(tmp.m.gainExp)+" to base multiplicative gain"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
},
calc25: {
    "Overview": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Base divisive gain : +"+format(player.n.points.times(tmp.d.requires.pow(-1)).pow(0.5))+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total number multiplier : x"+format(tmp.d.gainMult)+"" }, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total number exponent : ^"+format(tmp.d.gainExp)+"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Totalling : "+format(tmp.d.resourcegain)+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return tmp.d.resourcegain.gte(player.g.corruption[4])?"<h3>CORRUPTED! <br> After "+format(player.g.corruption[4])+" divisive gain , excessive divisive gain is rooted by "+format(corruptionroot(tmp.d.resourcegain,d(0.275),player.g.corruption[4]))+" <br> "+format(tmp.d.resourcegain)+" => "+format(player.g.corruption[4].times(tmp.d.directMult))+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No basic <br> (Divisive gain is always 0) <br>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(5)?"<h3>ACTIVE SACRIFICE Challenge sacrifice <br> (Divisive cannot be gained) <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Passive generation : x"+format(tmp.d.passiveGeneration.div(tmp.t.effect.div(1000).div(player.r.truegamespeed)))+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Tickspeed : x"+format(tmp.t.effect.div(1000).clampMax(player.t.cap.div(1000)))+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Gamespeed : x"+format(player.r.truegamespeed)+"" }, { "color": "gray", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Divisive passive gain : "+format(generateAmount('m'))+"/s" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    //Layer_DM
    "Multiplier": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return hasAchievement('ac',37)?"<h3>"+tmp.ac.achievements[37].name+" achievement : x2":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',85)&&!inChallenge('al',11)?"<h3>"+tmp.ac.achievements[85].name+" achievement : x"+format(achievementEffect('ac',85))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return getBuyableAmount('r',102).gt(0)?"<h3>More hardness improvement :  x"+format(buyableEffect('r',102))+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.da2.gt(1)?"<h3>Dark subtractive effect :  x"+format(player.r.da2)+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.effectWeight[2].gte(1)?"<h3> Exponent weight :  x"+format(tmp.e.effect.root(100).pow(player.g.effectWeight[2]))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Total : x"+format(tmp.d.gainMult)+" to base divisive gain"}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    //Layer_DE
    "Exponent": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "purple" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return player.r.tetration.gte(5)?"<h3> 5 Tetration reward : x1.1":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return buyableEffect('n',31).neq(1)?"<h3>Bits tree - Divisive exponent increase : x"+format(buyableEffect('n',31))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.artifactset1[4]>1?"<h3>Artifacts - Active Orb : x"+format(player.g.artifactset1[4])+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasSuperAchievement('ac',37)?"<h3>Third exponent charged achievement : x1.04":"" }, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.effectWeight[2].gte(1)?"<h3> Exponent weight :  x"+format(tmp.e.expeffect.root(100).pow(player.g.effectWeight[2]))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Resource reduction : (Exponent is multiplied by x"+format(player.r.chb)+")":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('al',11)?"<h3>GLOBAL : Altered realm - Resource reduction : (Exponent is multiplied by x"+format(player.al.alteredpow)+")":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.sacrificeactive[0].gt(1)?"<h3>ACTIVE SACRIFICE Number sacrifice : (Exponent is multiplied by x2.50)":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No basic <br> (Exponent always equal to 0) <br>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Total : ^"+format(tmp.d.gainExp)+" to base divisive gain"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
},
calc31: {
    "Overview": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Cost increase : +"+format(d(2).pow(player.e.points.pow(1.5)))+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Cost scaling : ^"+format(tmp.e.gainExp.pow(-1))+"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Cost reduction : /"+format(tmp.e.gainMult.pow(-1))+"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Requirement : x"+format(d("1e50"))+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total cost : "+format(static_cost('e',player.e.points))+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(6)?"<h3>ACTIVE SACRIFICE Challenge sacrifice <br> (Exponent cannot be gained) <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
    //Layer_Ecr
    "Cost reduction": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return player.e.perkpower.gt(0)?"<h3>Exponent perk : /"+format(buyableEffect('e',23).times(buyableEffect('e',24)))+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',52)?"<h3>Bits tree - Exponent cost reduction :  /"+format(buyableEffect('n',43).times(buyableEffect('n',81)))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('e',63)?"<h3>Extra cheap upgrade : ^1.25 to cost reduction":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.tetration.gte(7)?"<h3>7 Tetration reward : ^1.5 to cost reduction":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return inChallenge('al',11)?"<h3>GLOBAL : Altered realm - Resource reduction : ^"+format(player.al.alteredpow)+" to cost reduction":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Resource reduction : ^"+format(player.r.chb)+" to cost reduction":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Total cost reduction : /"+format(tmp.e.gainMult.pow(-1))+"" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    //Layer_Ecs
    "Cost scaling base": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "purple" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Base : "+format(0.5)+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('e',52)?"<h3>Uncosty exponent upgrade : x0.75":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('e',52)&&player.r.buyables[121].gte(1)?"<h3>Upgrade condenser : x0.90":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('s',52)&&!player.r.buyables[121].gte(1)?"<h3>Easier exponent upgrade : x0.99":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('m',74)&&!player.r.buyables[121].gte(1)?"<h3>Slowest exponent upgrade : x0.99":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasChallenge('e',11)?"<h3>No number challenge completion : x0.98":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasMilestone('r',1)?"<h3>Research milestone 1 : x0.925":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.tetration.gte(6)?"<h3>6 Tetration reward : x0.96":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',52)?"<h3>Bits tree - Exponent cost reduction :  /"+format(buyableEffect('n',32))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.artifactset4[4]>1?"<h3>Active Charm - Exponent cost reduction :  x"+format((101 - player.g.artifactset4[4]) / 100)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasSuperAchievement('ac',63)?"<h3>What have you done charged achievement : /"+format(achievementEffect('ac',63).add(1).div(1.5))+"":"" }, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return player.g.sacrificeactive[5].gte(1)?"<h3>Active sacrifice Exponent sacrifice : ^0.20 to cost scaling base":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.e.points.gt(player.g.corruption[5])?"<h3>CORRUPTED! <br> : ^"+format(player.e.points.div(player.g.corruption[5]).max(1).pow(-0.5))+" to cost scaling base":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"], 
            ["raw-html", function () { return tmp.e.gainExp.eq(0)?"<h3>You cannot gain this resource":"<h3>Result : "+format(player.e.strength.add(1).pow(-1).times(-1).add(1))+" " }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return tmp.e.gainExp.eq(0)?"":"<h3><i>Your exponent cost base will be equal to (1 - result)^(-1) - 1 = "+format(player.e.strength)+"" }, { "color": "gray", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return tmp.e.gainExp.eq(0)?"":"<h3><i>To calculate the cost increase , do (cost scaling base + 1 = "+format(player.e.strength.add(1))+")^(currentExponent = "+format(player.e.points.min(10))+" , capped at 10)" }, { "color": "gray", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return tmp.e.gainExp.eq(0)?"":"<h3>Which is equal to : ^"+format(tmp.e.gainExp.pow(-1))+" to cost" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    //Layer_EE
    "Effective Exponent": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "purple" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Base : +"+format(player.e.points)+"" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.e.bonus.neq(1)?"<h3>Perk power : x"+format(player.e.bonus)+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('m',71)?"<h3>More exponent upgrade : x1.02":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',43)?"<h3>"+tmp.ac.achievements[43].name+" achievement : x1.2":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',44)?"<h3>"+tmp.ac.achievements[44].name+" achievement : x1.2":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',49)?"<h3>"+tmp.ac.achievements[49].name+" achievement : x1.1":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.artifactset1[5]>1?"<h3>Active Orb :  x"+format(player.g.artifactset1[5])+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank","25px"],
            ["raw-html", function () { return "<h3>Effective Exponent : "+format(player.e.effective)+"" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    }
},
calc32: {
    //Layer_PPmax
    "Max Perk Power gain": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3># From Exponent : +"+format(buyableEffect('e',11))+"" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3><i>Base : +"+format(player.e.points.times(100).pow(0.3))+"" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('r',22)?"<h3><i>Easier Perk upgrade : x"+format(1.23)+"":"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('e',62)?"<h3><i>Powerful Perk upgrade : ^"+format(1.08)+"":"" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.artifactset3[0] > 1?"<h3><i>Active Ring : ^"+format(player.g.artifactset3[0])+"":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.tetration.gte(4)?"<h3># From Research : +"+format(buyableEffect('e',15))+"":"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.tetration.gte(4)?"<h3><i>Base : +"+format(player.r.points.times(0.5).add(1))+"":"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.artifactset3[1] > 1?"<h3><i>Active Ring : ^"+format(player.g.artifactset3[0])+"":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',86) && !inChallenge('al',11)?"<h3># Altered Perk achievement : +"+format(achievementEffect('ac',86))+"":"" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.artifactset4[7] > 1?"<h3># Active Charm : +"+format(player.g.artifactset4[7] - 1)+"":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('e',61)&&!player.r.buyables[121].gte(1)?"<h3>Strong Perk upgrade : x"+format(1.08)+"":"" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('e',64)&&!player.r.buyables[121].gte(1)?"<h3>Strengthen Perk upgrade : x"+format(1.07)+"":"" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasChallenge('e',11)?"<h3>Equality challenge completion : x"+format(challengeEffect('e',11))+"":"" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('a',43)?"<h3>Additive perk upgrade : x"+format(upgradeEffect('a',43))+"":"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',45)?"<h3>"+tmp.ac.achievements[45].name+" achievement : x"+format(1.08)+"":"" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',49)?"<h3>"+tmp.ac.achievements[49].name+" achievement : x"+format(1.25)+"":"" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return d(player.g.artifactset1[6]).gt(1)?"<h3>Active Orb : x"+format(player.g.artifactset1[6])+"":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return getBuyableAmount('e',41).gte(10)?"<h3>Exponent perk : x"+format(tmp.e.expeffect.add(1).pow(0.5))+" <i>Thanks to active ring</i>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],

            ["blank", "25px"],
            ["raw-html", function () { return player.r.tetration.gte(4)?"<h3>4 Tetration reward : ^1.04":"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('al',54)?"<h3>Super Divisive upgrade : ^1.1":"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Weaken Exponent : ^"+format(player.r.chd)+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(7)?"<h3>ACTIVE SACRIFICE Challenge sacrifice <br> (Perk Power cannot be gained) <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank", "25px"],
            ["raw-html", function () { return "<h3>Max Perk Power : "+format(buyableEffect('e',12))+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
    //Layer_PPint
    "Perk Power interval": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Base time : 10 seconds"}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Interval scaling - x2 Interval per 10 Perk Power => x"+format(d(2).pow(player.e.perkpower.div(10)))+""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Faster power buyable : /"+format(buyableEffect('e',42))+""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Gamespeed : /"+format(player.r.truegamespeed)+""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+tmp.ac.achievements[131].name+" achievement : /"+format(achievementEffect('ac',131))+""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Time : "+formatTime(player.e.perkpowerinterval.max(1))+" , interval increased to 1 second if lower" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
}, 
calc33: {
    "Overview": {
        buttonStyle() { return { 'color': 'purple' , "border-color" : "purple" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Starting cost : "+format(10)+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Base cost : x"+format(d(1.1).pow(player.r.points.pow(1.2)))+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Cost reduction : /"+format(tmp.r.gainMult.pow(-1))+"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(8)?"<h3>ACTIVE SACRIFICE Challenge sacrifice <br> (Research cannot be gained) <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
    //Layer_Rcr
    "Cost reduction": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return player.g.artifactset2[0] > 1?"<h3>Artifacts - Active ring : /"+format(player.g.artifactset2[0])+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',52)?"<h3>bits tree - Research cost reduction : /"+format(buyableEffect('n',33))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total cost reduction : /"+format(tmp.r.gainMult.pow(-1))+"" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return player.g.artifactset1[7] > 1?"<h3>Artifacts - Active Orb : x"+format(player.g.artifactset1[7])+" to Research gain":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
        ]      
    },
},
calc34: {
    //Layer_PTm
    "Gain": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Base : +1"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('t',21)?"<h3> Prestige time I Upgrade : +"+format(upgradeEffect('t',21))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('t',22)?"<h3> Prestige time II Upgrade : +"+format(upgradeEffect('t',22))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('t',23)?"<h3> Prestige time III Upgrade : +"+format(upgradeEffect('t',23))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('t',24)?"<h3> Prestige time IV Upgrade : +"+format(upgradeEffect('t',24))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',51)?"<h3> "+tmp.ac.achievements[51].name+" achievement : x2":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',62)?"<h3> "+tmp.ac.achievements[62].name+" achievement : x"+format(achievementEffect('ac',62))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',159)?"<h3> "+tmp.ac.achievements[159].name+" achievement : x"+f(achievementEffect('ac',159))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('t',44)?"<h3> Prestige time V Upgrade : x"+format(upgradeEffect('t',44))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.tetration.gte(10)?"<h3> 10 Tetration reward : x"+format(player.r.challengeshard.add(1))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.tetration.gte(11)?"<h3> 11 Tetration reward : x2":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.g.artifactset4[2]>1?"<h3> Artifacts - Active charm : x"+format(player.g.artifactset4[2])+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',52)?"<h3> Bits tree - Prestige time multiplier : x"+format(buyableEffect('n',63))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.cdcomp.gte(1)?"<h3> Chaotic division challenge (secondary) reward : x"+format(d(1.1).pow(player.r.cdcomp))+"":""}, { "color": "crimson", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.truegamespeed.neq(1)?"<h3> Current gamespeed : x"+format(player.r.truegamespeed)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return inChallenge('e',13)?"<h3> No basic challenge : x0":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(9)?"<h3> ACTIVE SACRIFICE Challenge sacrifice : x0":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.g.sacrificeactive[2].gte(1)?"<h3> ACTIVE SACRIFICE Prestige time sacrifice : x0":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return "<h3> Totalling : "+format(player.r.deltatime)+"/s"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3> Converted to : "+formatTime(player.r.deltatime)+"/s"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
},
calc41: {
    //Layer_Ts
    "Light additive": {
        buttonStyle() { return { 'color': 'lime' , "border-color" : "aqua" } },
        unlocked() { return hasAchievement('ac',54) },
        content: [
        ["raw-html", function () { return "<h3>Base : +"+format(buyableEffect('r',201))+""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('r',41)?"<h3> Lightness upgrade : x10":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('r',202).gt(1)?"<h3> Light additive multiplier buyable : x"+format(buyableEffect('r',202))+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('r',203).gt(1)?"<h3> Light additive powerer buyable : x"+format(buyableEffect('r',203))+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',52)?"<h3> Bits tree - Light additive multiplier : x"+format(buyableEffect('n',51))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(11)?"<h3> ACTIVE SACRIFICE Challenge sacrifice : x0":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return player.r.tetration.gte(10)?"<h3> 10 Tetration reward : x"+format(player.r.challengeshard.add(1))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('r',105)?"<h3> Energetic Improvement upgrade : x"+format(upgradeEffect('r',105))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('r',401).gt(1)?"<h3> Twilight booster : x"+format(buyableEffect('r',401))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.truegamespeed.neq(1)?"<h3> Current gamespeed : x"+format(player.r.truegamespeed)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return "<h3> Totalling : "+format(player.r.lightaddpersec)+""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    "Dark subtractive": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Base : +"+format(buyableEffect('r',301))+""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('r',42)?"<h3> Darkness upgrade : x10":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('r',302).gt(1)?"<h3> Dark subtractive multiplier buyable : x"+format(buyableEffect('r',302))+"":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('r',303).gt(1)?"<h3> Dark subtractive powerer buyable : x"+format(buyableEffect('r',303))+"":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',52)?"<h3> Bits tree - Dark subtractive multiplier : x"+format(buyableEffect('n',51))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(12)?"<h3> ACTIVE SACRIFICE Challenge sacrifice : x0":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return player.r.tetration.gte(10)?"<h3> 10 Tetration reward : x"+format(player.r.challengeshard.add(1))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('r',105)?"<h3> Energetic Improvement upgrade : x"+format(upgradeEffect('r',105))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('r',401).gt(1)?"<h3> Twilight booster : x"+format(buyableEffect('r',401))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.truegamespeed.neq(1)?"<h3> Current gamespeed : x"+format(player.r.truegamespeed)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return "<h3> Totalling : "+format(player.r.darksubpersec)+""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    "Twilight": {
        buttonStyle() { return { 'color': 'white' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Base : +"+format(player.r.lightadd.times(player.r.darksub).pow(0.5).times(0.01))+" <i>(1/100 the Geometric mean of Light additive/Dark subtractive)"}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',52)?"<h3> Bits tree - Twilight multiplier : x"+format(buyableEffect('n',52))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.ee1.gt(1)?"<h3> Energy effect : x"+format(player.r.ee1)+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(13)?"<h3> ACTIVE SACRIFICE Challenge sacrifice : x0":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return player.r.tetration.gte(10)?"<h3> 10 Tetration reward : x"+format(player.r.challengeshard.add(1))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('r',105)?"<h3> Energetic Improvement upgrade : x"+format(upgradeEffect('r',105))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('r',401).gt(1)?"<h3> Twilight booster : x"+format(buyableEffect('r',401))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.truegamespeed.neq(1)?"<h3> Current gamespeed : x"+format(player.r.truegamespeed)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return "<h3> Totalling : "+format(player.r.twilightpersec)+""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    "Energy": {
        buttonStyle() { return { 'color': 'aqua' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Base : +"+format(buyableEffect('r',501))+""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',52)?"<h3> Bits tree - Energy multiplier : x"+format(buyableEffect('n',53))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('r',502).gt(1)?"<h3> Energy conductor buyable : x"+format(buyableEffect('r',502))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Current energy : /"+format((player.r.energy.add(1)).pow(0.25))+""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(13)?"<h3> ACTIVE SACRIFICE Challenge sacrifice : x0":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return hasAchievement('ac',154)?"<h3> Energetic Improvement upgrade : x"+format(achievementEffect('ac',154))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.tetration.gte(10)?"<h3> 10 Tetration reward : x"+format(player.r.challengeshard.add(1))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('r',105)?"<h3> Energetic Improvement upgrade : x"+format(upgradeEffect('r',105))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return buyableEffect('r',503).gt(1)?"<h3> Energy powerer buyable : ^"+format(buyableEffect('r',503))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasSuperAchievement('ac',92)?"<h3> Tetration I charged achievement : ^1.5":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.truegamespeed.neq(1)?"<h3> Current gamespeed : x"+format(player.r.truegamespeed)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3> Totalling : "+format(player.r.energypersec)+""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
},
calc42: {
    //Layer_MR
    "Gain": {
        buttonStyle() { return { 'color': 'purple' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Base : +"+format(player.r.mastery.div(10000).pow(0.75))+""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',52)?"<h3> Bits tree - Meta-research multiplier : x"+format(buyableEffect('n',62))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasSuperAchievement('ac',44)?"<h3> 'Not enough' charged achievement : x1.15":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(10)?"<h3> ACTIVE SACRIFICE Challenge sacrifice : x0":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.g.sacrificeactive[3].gte(1)?"<h3> ACTIVE SACRIFICE Realm sacrifice : x3":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return "<h3> On reset : +"+format(player.r.nextmetaresearch)+""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
},
calc43: {
    //Layer_Tetr
    "Cost": {
        buttonStyle() { return { 'color': 'green' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Base : +100"}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Cost multiplier : "+format(player.r.tetration.sub(10).div(100).add(1).max(1.09))+"x per Tetration = x"+format(player.r.tetration.sub(10).div(100).add(1).max(1.09).pow(player.r.tetration),2)+""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return "<h3>Cost increaser , at 6 tetration : +"+format(player.r.tetration.pow(2))+""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.g.sacrificeactive[3].gte(1)?"<h3> ACTIVE SACRIFICE Tetration sacrifice : x2.5 to cost and add +250 after":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',52)?"<h3> Bits tree - Tetration cost multiplier : x"+format(buyableEffect('n',71))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',103)?"<h3> Condensed upgrade achievement : -25 to cost":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('t',51)?"<h3> Tetration cost I upgrade : -"+format(upgradeEffect('t',51))+" to cost":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('t',52)?"<h3> Tetration cost II upgrade : -"+format(upgradeEffect('t',52))+" to cost":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return player.r.c10.gt(0)&&player.r.c10.neq(10)?"<h3> ACTIVE SACRIFICE Challenge sacrifice : Cost is set to Infinity":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return "<h3> Total cost : "+format(player.r.tetrationcost)+""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3> Note : If the total cost is Infinity , It means that you have reached your Tetration cap <br> The large number is just in place to disallow buying more"}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
},
calc51: {
    //Layer_Alg
    "Function value": {
        buttonStyle() { return { 'color': 'lime' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Formula : f(x) = ax<sup>2</sup> + bx + c"}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Terms ax<sup>2</sup> : "+format(player.al.a1)+" * "+format(player.al.x1.pow(2))+" = "+format(player.al.a1.times(player.al.x1.pow(2)))+""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Terms bx : "+format(player.al.b1)+" * "+format(player.al.x1)+" = "+format(player.al.b1.times(player.al.x1))+""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Constant c : "+format(player.al.c1)+""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Function value is f("+format(player.al.x1)+") = "+format(player.al.value)+""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    "Algebric gain": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Base function value f("+format(player.al.x1)+") = +"+format(player.al.value)+""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('al',14)?"<h3> Self boosting unknown upgrade : x"+format(upgradeEffect('al',14))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('al',23).gt(1)?"<h3> More algebric buyable : x"+format(buyableEffect('al',23))+"":""}, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.al.extensionboost.neq(1)?"<h3> Extension effect : x"+format(player.al.extensionboost)+"":""}, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["blank" , "25px"],
        ["raw-html", function () { return player.al.resetcooldown.gt(0)?"<h3> Reset cooldown : Disable gain , for "+formatTime(player.al.resetcooldown.max(0))+"":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.truegamespeed.neq(1)?"<h3> Current gamespeed : x"+format(player.r.truegamespeed)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return "<h3> Totalling : "+format(player.al.pointsgainal)+""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    "X gain": {
        buttonStyle() { return { 'color': 'aqua' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Base : +"+format(buyableEffect('al',14))+""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.al.extensionboost.neq(1)?"<h3> Extension effect : x"+format(player.al.extensionboost)+"":""}, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('al',11)?"<h3> Constant to Variable : x"+format(upgradeEffect('al',11))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('al',51).gt(1)?"<h3> Stronger unknown buyable : x"+format(buyableEffect('al',51))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.truegamespeed.neq(1)?"<h3> Current gamespeed : x"+format(player.r.truegamespeed)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Algebric failure : ^"+format(player.r.chg)+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3> Totalling : "+format(player.al.deltax)+""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    "Y gain": {
        buttonStyle() { return { 'color': 'aqua' , "border-color" : "aqua" } },
        unlocked() { return hasAchievement('ac',124) },
        content: [
        ["raw-html", function () { return "<h3>Base : +"+format(buyableEffect('al',16))+""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',124)?"<h3>":"<h3> Actually , you haven't unlock this resource yet"}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.truegamespeed.neq(1)?"<h3> Current gamespeed : x"+format(player.r.truegamespeed)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["blank" , "25px"],
        ["raw-html", function () { return "<h3> Totalling : "+format(player.al.deltay)+""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
},
calc52: {
    //Layer_Ex
    "Extension gain": {
        buttonStyle() { return { 'color': 'green' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Gain base Extension based on Algebric"}, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>base Extension : "+format(player.al.points.div("1e6").pow(0.75))+""}, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Algebric failure : ^"+format(player.r.chh)+" to base gain AND first softcap start":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["blank","25px"],
        ["raw-html", function () { return player.al.points.div("1e6").pow(0.75).gte(1000)?inChallenge('r',11)?"<h3>Softcapped once at "+format(d(1000).pow(player.r.chh))+" base Extension : ^0.5 above "+format(d(1000).pow(player.r.chh))+"":"<h3>Softcapped once at "+format(1000)+" base Extension : ^0.5 above "+format(1000)+"<h3>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { 
            let base = player.al.points.div("1e6").pow(0.75)
            let formula = "Extension => "+format(1000)+" * (Extension/"+format(1000)+")<sup>0.5</sup> <br> ("+format(base)+" => "+format(base.div("1000").pow(0.5).times(1000))+")"
            if(inChallenge('r',11)) formula = "Extension<sup>"+format(player.r.chh)+"</sup> => "+format(d(1000).pow(player.r.chh))+" * (Extension<sup>"+format(player.r.chh)+"<sup>/"+format(d(1000).pow(player.r.chh))+")<sup>0.5</sup> <br> ("+format(base.pow(player.r.chh))+" => "+format(base.pow(player.r.chh).div(d(1000).pow(player.r.chh)).pow(0.5))+")"
            return player.al.points.div("1e6").pow(0.75).gte(1000)?"<h3>Base Extension gain will become : "+formula:"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }
        ],
        ["raw-html", function () {
            let a = d(1000)
            if(inChallenge('r',11)) a = d(1000).pow(player.r.chh)
            let base = player.al.points.div("1e6").pow(0.75)
            if(inChallenge('r',11)) base = base.pow(player.r.chh)
            let eff = softcap(base,a,0.5)
            let truth = softcap(eff,d("1e10"),player.al.operationeffect.div(100)).div("1e10")
             return eff.gte("1e10")?"<h3>Normally is capped at "+format(d("1e10"))+" <br> Current operation amount weakens the cap , and allow a ^"+format(player.al.operationeffect.div(100),4)+" to base Extension above cap <br> Translated to an effective multiplier of x"+format(truth)+" from Operation":""
            }
             ,{ "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('al',24).gt(1)?"<h3> More Extension I buyable : x"+format(buyableEffect('al',24))+"":""}, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('al',34).gt(1)?"<h3> More Extension II buyable : x"+format(buyableEffect('al',34))+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3> Total gain : "+format(player.al.extensiongain)+""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
},
calc53: {
    //Layer_OP
    "Operation gain": {
        buttonStyle() { return { 'color': 'green' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Gain Operation based on Mastery"}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Base Operation : +"+format(d(2).pow(player.r.mastery.add(4).div(4)).sub(2))+""}, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return !inChallenge('al',11)?"<h3>While not inside Altered realm , Base Operation from Mastery is equal to 0":""}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('r',51)?"<h3>Operationless upgrade [] Base Operation : +"+format(d(2).pow((player.points.add(10).log(10).pow(2.5)).add(4).div(4)).sub(2))+" from Points":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["blank","25px"],

        ["raw-html", function () { 
            let base = d(2).pow(player.r.mastery.add(4).div(4)).sub(2)
            if(!inChallenge('al',11)) base = d(0)
            if (hasUpgrade('r',51)) base = base.add(d(2).pow((player.points.add(10).log(10).pow(2.5)).add(4).div(4)).sub(2))
            let after = d("1e6").times(base.div("5e5").max(2).log(2))
            if(hasAchievement('ac',126)) after = after.pow(achievementEffect('ac',126))
            let formula = "baseOperation => "+format(1000000)+" * log<sub>2</sub>(baseOperation/"+format(500000)+") <br> ("+format(base)+" => "+format(after)+")"
            if(hasAchievement('ac',126)) formula = "baseOperation <br>=> ("+format(1000000)+" * log<sub>2</sub>(baseOperation/"+format(500000)+"))<sup>"+f(achievementEffect('ac',126))+"</sup> <br> ("+format(base)+" => "+format(after)+") <br> the exponent ^"+f(achievementEffect('ac',126))+" is from Improving Operator achievement"

            return base.gte("1e6")?"<h3>Base Operation gain will be massively reduced above "+format(1000000)+" : "+formula:"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }
        ],        ["raw-html", function () { return hasUpgrade('al',34)?"<h3> Extra Operation upgrade : x"+format(upgradeEffect('al',34))+"":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',145)?"<h3> Incredible Age achievement : x"+format(achievementEffect('ac',145))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('al',31).gt(1)?"<h3> More Operation buyable : x"+format(buyableEffect('al',31))+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('r',105).gt(1)?"<h3> More Operation improvement : x"+format(buyableEffect('r',105))+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return buyableEffect('al',52).gt(1)?"<h3> More Operation II buyable : ^"+format(buyableEffect('al',52))+"":""}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],

        ["raw-html", function () { return "<h3> Total gain : "+format(player.al.operationgain)+""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
},
calc61: {
    //Layer_Gr
    "Graduate": {
        buttonStyle() { return { 'color': 'white' , "border-color" : "white" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Base : +1"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',141)?"<h3> "+tmp.ac.achievements[141].name+" achievement : +"+format(player.r.mastery.div(50000).floor())+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.tetration.gte(23)?"<h3> 23 Tetration reward : +2 then x1.5":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',52)?"<h3> Bits tree - Graduate multiplier : x"+format(buyableEffect('n',91).times(buyableEffect('n',92)).times(buyableEffect('n',93)))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',111)?"<h3> Graduation II achievements multiplier : x"+format(player.ac.achievements.filter(x => x>=111 && x<=139).length * 0.04 + 1)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',139)?"<h3> Graduation Sacrifice achievements multiplier : x"+format(player.ac.achievements.filter(x => x>=141 && x<=169).length * 0.03 + 1)+"":""}, { "color": "teal", "font-size": "22px", "font-family": "helvetica" }],

        ["blank","25px"],
        ["raw-html", function () { return "<h3> Adding up to : +"+format(buyableEffect('g',10))+" on reset (rounded down)"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
},
calc62: {
    //Layer_Gr
    "Bits": {
        buttonStyle() { return { 'color': 'aqua' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
        ["raw-html", function () { return "<h3>Base : +"+format(upgradeEffect('n',41))+""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',116)?"<h3> "+tmp.ac.achievements[116].name+" achievement : x"+format(achievementEffect('ac',116))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.tetration.gte(23)?"<h3> 23 Tetration reward : +2 then x1.5":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',51)?"<h3> More Bits upgrade : x"+format(upgradeEffect('n',51))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',61)?"<h3> More Bits upgrade : x"+format(upgradeEffect('n',61))+"":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasUpgrade('n',52)?"<h3> Bits tree - Bits multiplier : x"+format(buyableEffect('n',61))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return hasAchievement('ac',139)?"<h3> Graduation Sacrifice achievements multiplier : x"+format(player.ac.achievements.filter(x => x>=141 && x<=169).length * 0.03 + 1)+"":""}, { "color": "teal", "font-size": "22px", "font-family": "helvetica" }],
        ["blank","25px"],
        ["raw-html", function () { return inChallenge('e',13)?"<h3> INSIDE No Basic challenge : x50.00 Bits gain":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.g.ud.gte(2)?"<h3> No Basic challenge effect : "+format(d(2).pow(24))+" Bits gain":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.truegamespeed.neq(1)?"<h3> Current gamespeed : x"+format(player.r.truegamespeed)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3> Gaining : "+format(player.g.bitspersec)+" Bits/s"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
},
calc71: {
    "Summary": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Base tickspeed : +"+format(1)+"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total tickspeed multiplier : x"+format(tmp.t.effectMult)+"" }, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total tickspeed exponent : ^"+format(tmp.t.effectExp)+"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Totalling : "+format(tmp.t.effectMult.pow(tmp.t.effectExp))+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('d',13)?"<h3>ACTIVE CHALLENGE Chaotic Division <br> (Tickspeed is disabled)":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.sacrificeactive[1].gte(1)?"<h3>ACTIVE SACRIFICE Tickspeed Sacrifice <br> (Tickspeed is sacrificed)":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No Basic <br> Tickspeed become : Tickspeed => (log<sub>10</sub>Tickspeed)<sup>2</sup>":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.t.tickspeedcontrol.neq(1)?"<h3>Tickspeed control : ^"+format(player.t.tickspeedcontrol)+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('al',11)?"<h3>Altered realm : Tickspeed is ^"+format(player.al.tickspeedreduction1)+" , then /"+format(player.al.tickspeedreduction2)+"":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Special tickspeed multiplier : x"+format(1000)+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Total tickspeed : "+format(tmp.t.effect)+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Above "+format(player.t.cap)+" Tickspeed , Excess Tickspeed will not provide effects" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Which speed up Points , Row1 and Row2 resource generation by x"+format(tmp.t.effect.div(1000).clampMax(player.t.cap.div(1000)))+"" }, { "color": "gray", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    "Multiplier": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return hasUpgrade('t',11)?"<h3>Faster Time I upgrade : x"+format(upgradeEffect('t',11))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('t',12)?"<h3>Faster Time II upgrade : x"+format(upgradeEffect('t',12))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('t',13)?"<h3>Faster Time III upgrade : x"+format(upgradeEffect('t',13))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('t',14)?"<h3>Faster Time IV upgrade : x"+format(upgradeEffect('t',14))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('t',31)?"<h3>Faster Time VII upgrade : x"+format(upgradeEffect('t',31))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('t',32)?"<h3>Faster Time VIII upgrade : x"+format(upgradeEffect('t',32))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('t',33)?"<h3>Faster Time IX upgrade : x"+format(upgradeEffect('t',33))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('t',34)?"<h3>Faster Time X upgrade : x"+format(upgradeEffect('t',34))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',29)?"<h3>"+tmp.ac.achievements[29].name+" achievement : x1.15":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',39)?"<h3>"+tmp.ac.achievements[39].name+" achievement : x2":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',45)?"<h3>"+tmp.ac.achievements[45].name+" achievement : x2":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',49)?"<h3>"+tmp.ac.achievements[49].name+" achievement : x5":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',118)?"<h3>"+tmp.ac.achievements[118].name+" achievement : x"+format(achievementEffect('ac',118))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',89)&&!inChallenge('al',11)?"<h3>"+tmp.ac.achievements[89].name+" achievement : x"+format(achievementEffect('ac',89))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.points.gt(0)?"<h3>Research effect :  x"+format(player.r.tickspeedbonus)+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.ta1.gt(1)?"<h3>Twilight effect :  x"+format(player.r.ta1)+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return getBuyableAmount('r',104).gt(1)?"<h3>More Letter Improvement :  x"+format(buyableEffect('r',104))+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',52)?"<h3>Bits tree - Tickspeed multiplier increase : x"+format(buyableEffect('n',41).times(buyableEffect('n',42)).times(buyableEffect('n',43)))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Total : x"+format(tmp.t.effectMult)+" to Tickspeed"}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
    "Exponent": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "purple" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return hasUpgrade('t',15)?"<h3>Faster Time V upgrade : x"+format(upgradeEffect('t',15))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('t',16)?"<h3>Faster Time VI upgrade : x"+format(upgradeEffect('t',16))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',93)?"<h3>"+tmp.ac.achievements[93].name+" achievement : x"+format(achievementEffect('ac',93))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',52)?"<h3>Bits tree - Tickspeed exponent increase : x"+format(buyableEffect('n',73))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.artifactset4[1] > 1?"<h3>Artifacts - Active Charm : x"+format(player.g.artifactset4[1])+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return player.g.sacrificeactive[6].gte(1)?"<h3>ACTIVE SACRIFICE Challenge sacrifice <br> Tickspeed exponent is x"+format(player.r.chl)+" <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.sacrificeactive[5].gte(1)?"<h3>ACTIVE SACRIFICE Exponent sacrifice <br> Tickspeed exponent is x4 <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.timer.lt(600)?"<h3>GRADUATION Early game nerf : Exponent is multiplied by x"+format(player.g.timer.min(600).div(600))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return "<h3>Total : ^"+format(tmp.t.effectExp)+" to Tickspeed"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],

        ]      
    },
},
calc72: {
    "Multiplier": {
        buttonStyle() { return { 'color': 'white' , "border-color" : "yellow" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return player.o.gamespeed.neq(1)?"<h3>Offline Time-speedup : x"+format(player.o.gamespeed)+"":""}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.gamespeed.neq(1)?"<h3>Research Time-speedup : x"+format(player.r.gamespeed)+"":""}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('t',41)?"<h3>Gamespeed I upgrade : x"+format(upgradeEffect('t',41))+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasSuperAchievement('ac',25)?"<h3>"+tmp.ac.achievements[25].name+" charged achievement : x1.5":""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',99)?"<h3>"+tmp.ac.achievements[99].name+" achievement : x2":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',101)?"<h3>"+tmp.ac.achievements[101].name+" achievement : x"+format(achievementEffect('ac',101))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',127)?"<h3>"+tmp.ac.achievements[127].name+" achievement : x"+format(achievementEffect('ac',127).div(100).add(1))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasAchievement('ac',121)?"<h3>"+tmp.ac.achievements[121].name+" achievement : x"+format(achievementEffect('ac',121))+"":""}, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.tetration.gte(16)?"<h3> 16 Tetration reward : x3":""}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.artifactset4[0] > 1?"<h3>Artifacts - Active Charm : x"+format(player.g.artifactset4[0])+"":""}, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return hasUpgrade('n',52)?"<h3>Bits tree - Gamespeed multiplier increase : x"+format(buyableEffect('n',101).times(buyableEffect('n',102)).times(buyableEffect('n',103)).times(buyableEffect('n',72)))+"":""}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.o.heat.gte(player.o.maxHeat.div(2))?"<h3>Overheating Effect : x"+format(d(1).sub(player.o.heat.div(player.o.maxHeat).sub(0.5).times(2).pow(1.5)))+"":""}, { "color": "crimson", "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["raw-html", function () { return buyableEffect('g',202).gt(1)?"<h3>Tickspeed sacrifice reward : x"+format(buyableEffect('g',202))+" Gamespeed <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.sacrificeactive[1].gte(1)?"<h3>ACTIVE SACRIFICE Tickspeed sacrifice : x"+format(player.r.mastery)+" Gamespeed (equal to currentMastery) <br>":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('r',11)?"<h3>ACTIVE CHALLENGE Meta-research - Frozen time : /"+format(player.r.chc)+" Gamespeed":"" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return inChallenge('e',13)?"<h3>ACTIVE CHALLENGE No Basic : x"+format(50)+" Gamespeed":"" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["blank","25px"],
            ["raw-html", function () { return player.r.timer2.lte(0.25)?"<h3>Game is currently paused for "+format(d(0.25).sub(player.r.timer2))+"":"" }, { "color": "brown", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.g.sacrificeactive[6].gte(1) && !(player.r.potshard.eq(56) && inChallenge('r',11))?"<h3>You are not in Meta-research challenge with the correct modifier <br> Paused game":"" }, { "color": "brown", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return !inChallenge('al',11) && player.g.sacrificeactive[3].eq(1)?"<h3>You are not in Altered realm inside of Realm sacrifice <br> Paused game":"" }, { "color": "brown", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return options.gamepaused?"<h3> The game is currently being paused (in Option)":"" }, { "color": "brown", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Gamespeed is fastened by x"+format(player.r.truegamespeed)+""}, { "color": "aqua", "font-size": "22px", "font-family": "helvetica" }],
        ]      
    },
},
calc2: {
    "Number": {
        buttonStyle() { return { 'color': 'cyan' , "border-color" : "yellow" } },
        unlocked() { return true },
        content: [
            ["microtabs", "calc21", { 'border-width': '0px' }],
        ]      
    },
    "Additive": {
        buttonStyle() { return { 'color': 'lime' , "border-color" : "aqua" } },
        unlocked() { return hasAchievement('ac',14) },
        content: [
            ["microtabs", "calc22", { 'border-width': '0px' }],
        ]      
    },
    "Subtractive": {
        buttonStyle() { return { 'color': 'red' , "border-color" : "aqua" } },
        unlocked() { return hasAchievement('ac',15) },
        content: [           
           ["microtabs", "calc23", { 'border-width': '0px' }],
        ]      
    },
    "Multiplicative": {
        buttonStyle() { return { 'color': 'green' , "border-color" : "yellow" } },
        unlocked() { return hasAchievement('ac',25) },
        content: [
            ["microtabs", "calc24", { 'border-width': '0px' }],
        ]      
    },
    "Divisive": {
        buttonStyle() { return { 'color': 'crimson' , "border-color" : "yellow" } },
        unlocked() { return hasAchievement('ac',29) },
        content: [
            ["microtabs", "calc25", { 'border-width': '0px' }],
        ]      
    },
},
calc3: {
    "Exponent": {
        buttonStyle() { return { 'color': 'pink' , "border-color" : "yellow" } },
        unlocked() { return hasAchievement('ac',34) },
        content: [
            ["microtabs", "calc31", { 'border-width': '0px' }],
        ]      
    },
    "Perk power": {
        buttonStyle() { return { 'color': 'pink' , "border-color" : "aqua" } },
        unlocked() { return hasMilestone('e',5) || hasAchievement('ac',38) },
        content: [
            ["microtabs", "calc32", { 'border-width': '0px' }],
        ]      
    },
    "Research": {
        buttonStyle() { return { 'color': 'purple' , "border-color" : "aqua" } },
        unlocked() { return hasAchievement('ac',39) },
        content: [
            ["microtabs", "calc33", { 'border-width': '0px' }],
        ]      
    },
    "Prestige time": {
        buttonStyle() { return { 'color': 'purple' , "border-color" : "yellow" } },
        unlocked() { return hasMilestone('r',4) || hasAchievement('ac',51) || hasAchievement('ac',91)},
        content: [
            ["microtabs", "calc34", { 'border-width': '0px' }],
        ]      
    },
},
calc4: {
    "Twilights": {
        buttonStyle() { return { 'color': 'white' , "border-color" : "white" } },
        unlocked() { return hasAchievement('ac',54) },
        content: [
            ["microtabs", "calc41", { 'border-width': '0px' }],
        ]      
    },
    "MR gain": {
        buttonStyle() { return { 'color': 'purple' , "border-color" : "yellow" } },
        unlocked() { return hasAchievement('ac',91) },
        content: [
            ["microtabs", "calc42", { 'border-width': '0px' }],
        ]      
    },
    "Tetration": {
        buttonStyle() { return { 'color': 'green' , "border-color" : "yellow" } },
        unlocked() { return player.r.tetration.gte(1) },
        content: [
            ["microtabs", "calc43", { 'border-width': '0px' }],
        ]      
    },
},
calc5: {
    "Algebric": {
        buttonStyle() { return { 'color': 'cyan' , "border-color" : "yellow" } },
        unlocked() { return true },
        content: [
            ["microtabs", "calc51", { 'border-width': '0px' }],
        ]      
    },
    "Extension": {
        buttonStyle() { return { 'color': 'orange' , "border-color" : "green" } },
        unlocked() { return true },
        content: [
            ["microtabs", "calc52", { 'border-width': '0px' }],
        ]      
    },
    "Operation": {
        buttonStyle() { return { 'color': 'green' , "border-color" : "yellow" } },
        unlocked() { return hasAchievement('ac',51) },
        content: [
            ["microtabs", "calc53", { 'border-width': '0px' }],
        ]      
    },
},
calc6: {
    "Graduate": {
        buttonStyle() { return { 'color': 'white' , "border-color" : "lime" } },
        unlocked() { return player.g.rank.gte(2) },
        content: [
            ["microtabs", "calc61", { 'border-width': '0px' }],
        ]      
    },
    "Bits": {
        buttonStyle() { return { 'color': 'cyan' , "border-color" : "lime" } },
        unlocked() { return player.g.ud.gte(1) },
        content: [
            ["microtabs", "calc62", { 'border-width': '0px' }],
        ]      
    },
},
calc7: {
    "Tickspeed": {
        buttonStyle() { return { 'color': 'white' , "border-color" : "white" } },
        unlocked() { return true },
        content: [
            ["microtabs", "calc71", { 'border-width': '0px' }],
        ]      
    },
    "Gamespeed": {
        buttonStyle() { return { 'color': 'gray' , "border-color" : "white" } },
        unlocked() { return true },
        content: [
            ["microtabs", "calc72", { 'border-width': '0px' }],
        ]      
    },
},
calc: {
    "Point gain": {
        buttonStyle() { return { 'color': 'yellow' , "border-color" : "orange" } },
        unlocked() { return true },
        content: [
            ["raw-html", function () { return "<h3>Point gain : "+format(getPointGen())+"/s" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
            ["microtabs", "calc1", { 'border-width': '0px' }],
        ]

            
    },
    "Pre-exponent": {
        buttonStyle() { return { 'color': 'pink' , "border-color" : "white" } },
        unlocked() { return true },
        content: [
            ["microtabs", "calc2", { 'border-width': '0px' }],
        ]

            
    },
    "Research": {
        buttonStyle() { return { 'color': 'purple' , "border-color" : "white" } },
        unlocked() { return hasAchievement('ac',39) },
        content: [
            ["microtabs", "calc3", { 'border-width': '0px' }],
        ]

            
    },
    "Meta-research": {
        buttonStyle() { return { 'color': 'gray' , "border-color" : "white" } },
        unlocked() { return hasAchievement('ac',91) },
        content: [
            ["microtabs", "calc4", { 'border-width': '0px' }],
        ]

            
    },
    "Algebric": {
        buttonStyle() { return { 'color': 'green' , "border-color" : "white" } },
        unlocked() { return player.r.bestmastery.gte(308.25) },
        content: [
            ["microtabs", "calc5", { 'border-width': '0px' }],
        ]

            
    },
    "Graduation": {
        buttonStyle() { return { 'color': 'white' , "border-color" : "white" } },
        unlocked() { return player.g.rank.gte(2) },
        content: [
            ["microtabs", "calc6", { 'border-width': '0px' }],
        ]

            
    },
    "Speed modifier": {
        buttonStyle() { return { 'color': 'orange' , "border-color" : "red" } },
        unlocked() { return true },
        content: [
            ["microtabs", "calc7", { 'border-width': '0px' }],
        ]

            
    },
},

        stuff: {
            "Conversion": {
                buttonStyle() { return { 'color': 'purple' } },
                unlocked() { return true },
                content:  [
            ["microtabs", "upgrade", { 'border-width': '0px' }],
        ]
    
            },
            "Time speedup": {
                buttonStyle() {return {'color':'white'}},
                content :     [
                    ["raw-html", function () { return "<h3>You cannot use both machines at the same time or when OVERHEATED" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3>For more information about Heat , hold [shift] and [ctrl]" }, { "color": "red", "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return shiftDown&&ctrlDown?"<h3> Using any time-altering machine will generate a byproduct of Heat <br> Having at least 50% Heat will progressively slow the game down <br> At 100% Heat , all Time-altering machines will malfunction and cannot work <br> Heat slowly reduces overtime <br> IF YOU ARE NOT COMFORTABLE WITH THE BACKGROUND COLORING , DISABLE IT IN SETTING":"" }, { "color": "red", "font-size": "14px", "font-family": "helvetica" }],
                    ["microtabs", "speed", { 'border-width': '0px' }],
    
            ]},
            "Time warp": {
                buttonStyle() { return { 'color': 'white'} },
                unlocked() {return player.o.gamespeed.eq(1) && player.r.truegamespeed.neq(0)},
                content:
                
                    [
             ["raw-html", function () { return "<h3>You cannot use both machines at the same time or when OVERHEATED" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
             ["raw-html", function () { return shiftDown?"<h3>[Holding shift] . You will bulk buy 3 warps instead of 1":"" }, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],


            ["microtabs", "warp", { 'border-width': '0px' }],
        ]
    
            },
        },
        upgrade: {
            "Main": {
                buttonStyle() { return { 'color': 'lime' } },
                unlocked() { return true }, 
                content:[
                    ["row", [["buyable",12]]],  
                    ["blank", "25px"],
                    ["raw-html", function () { return "<h3>Your buyable is adding +"+format(buyableEffect('o',11).times(100).sub(25),0)+"% to converter efficiency" }, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3>Your bought upgrade grant +"+format(player.o.upgrades.filter(x => x<33).length,0)+"% to converter efficiency" }, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank", "25px"],
                    ["row", [["buyable",11]]],
                    ["blank", "25px"],
                    ["row" , [["upgrade",11],["upgrade",12],["upgrade",13],["upgrade",14]]],
                    ["row" , [["upgrade",21],["upgrade",22],["upgrade",23],["upgrade",24]]],
                    ["row" , [["upgrade",31],["upgrade",32]]],
                ]
            },
        },
        speed: {
            "Main": {
                buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return "<h3>Multiply gamespeed* by "+format(player.o.gsbase,0)+"x ; Costing "+formatTime(player.o.gscost)+" real time/s" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3><i> Cost to speedup increases exponentially above 100x"}, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3><i> Boosted Gamespeed last "+formatTime(player.o.gsupkeep)+"" }, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3><i> Automaticly deactivate if you cannot keep up for more than 10s"}, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3><i> Inflicts heat every second of usage , which reduce your gamespeed "}, { "color": "red", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return !options.dev?"":"<h3><i> Developer mode : Prevent Real time from decreasing , require 10s real time" }, { "color": "orange", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank", "50px"],
                    ["row", [["buyable",21], ["buyable",22]]],
                    ["blank", "25px"],
                    ["row", [["buyable",23], ["buyable",24]]],
                    ["blank", "25px"],
                    ["row", [["upgrade",41],["upgrade",42],["upgrade",43],["upgrade",44]]],
                    ["blank", "25px"],
                    ["raw-html", function () { return options.hidemastery?"<h3><i> Unlock 1 buyable here very rarely , up to 5 <br> Hold shift to buy x10":"<h3><i> Unlock 1 buyable here every "+format(25000)+" max Mastery , up to 5 <br> Hold shift to buy x10"}, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank", "25px"],
                    ["row", [["buyable",25],["buyable",26],["buyable",27],["buyable",28],["buyable",29]]],
                ]
    
                    
            },
    },
        warp: {
        "Normal warp": {
            buttonStyle() { return { 'color': 'green' , "border-color" : "green" } },
            unlocked() { return true },
            content: [
                ["raw-html", function () { return !options.dev?"":"<h3><i> Developer mode : Free , unlimited warp" }, { "color": "orange", "font-size": "18px", "font-family": "helvetica" }],
                ["blank", "50px"],
                ["row", [["buyable",31],["buyable",32],["buyable",33]]],

            ]

                
        },
        "Full warp" : {
            buttonStyle() { return { 'color': 'lime' , "border-color" : "green" } },
            unlocked() { return true },
            content: [
                ["blank", "50px"],
                ["row", [["buyable",34],["buyable",35]]],

            ]
            
        },
        "Bundle": {
            buttonStyle() { return { 'color': 'green' , "border-color" : "green" } },
            unlocked() { return player.r.bestmastery.gte(1000) },
            content: [
                ["raw-html", function () { return !options.dev?"":"<h3><i> Developer mode : All bundles are free" }, { "color": "orange", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3> Each bundle contains random amount of normal warp that is sold at a reduced price" }, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3> You can refresh bundles every 60s (Remaining cooldown : "+formatTime(player.o.rerolltime.max(0))+")" }, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["row",[["buyable",41]]],
                ["blank", "50px"],
                ["row", [["buyable",42],["buyable",43],["buyable",44]]],

            ]

                
        },

       
}

},
    tabFormat: [
        ["raw-html", function () { return "<h3>You have "+formatTime(player.o.time)+" offline time and "+formatTime(player.o.realtime)+" real time" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
        ["microtabs", "main", { 'border-width': '0px' }],
    ],
})