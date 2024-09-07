//global stuff
/** 
*Faster way of manually type new Decimal
**/
function d(a) {
    return new Decimal(a)
}
/** 
*Call a layer1 Decimal value
**/
function de(a) {
    return new Decimal(d(10).pow(a))
}
/**  
*Both format(a) and d(a) combined
**/
function fd(a , precision = 2) {
    return format(d(a) , precision)
}
/**
 * 
 * @param {*} a decimal value of layer1
 * @param {*} precision self-explanatory
 * @returns format()
 */
function fde(a , precision = 2) {
    return format(de(a) , precision)
}
/** 
*Faster way of manually type format
**/
function f(a) {
    return format(a)
}
/** 
*Point condenser's multiplicative effect
**/
function getPointCondensereffect_MUL() {
    //1
    let eff10 = d(2)
    if(hasUpgrade('al',43)) eff10 = eff10.pow(player.r.mastery.min(10000).add(2))
    let eff11 = softcap(eff10,d("1e6"),0.04)
    let eff12 = softcap(eff11,d("1e100"),0.2)
    //2
    let eff20 = player.n.points.add(2).pow(0.5)
    if (hasUpgrade('al',41)) eff20 = eff20.pow(1.25)
    if (hasUpgrade('s', 32)) eff20 = eff20.times(d(2).add(player.s.points.min(1500).times(0.1)))
    let eff21 = softcap(eff20,d("1e100"),0.1)
    //3
    let eff30 = player.points.add(11).log(10)
    if (hasUpgrade('al',42)) eff30 = eff30.pow(5)
    if (hasUpgrade('s', 32)) eff30 = eff30.times(d(2).add(player.s.points.min(1500).times(0.1)))
    //4
    let eff40 = tmp.a.effect.pow(player.a.points.add(1))
    let eff41 = softcap(eff40,d("1e600"),0.1)
    //
    let product1 = eff12.times(eff21).times(eff30)
    if(player.r.tetration.gte(9)) product1 = product1.pow(0)    
    let product = product1.times(6).times(eff41)
    return product
}
/** 
*Points condenser's exponential effect
**/
function getPointCondensereffect_POW() {
      //1
      let eff10 = d(2)
      if(hasUpgrade('al',43)) eff10 = eff10.pow(player.r.mastery.add(2))
      if(player.r.tetration.gte(9)) eff10 = eff10.add(10).slog().div(20).add(1)
      //2
      let eff20 = player.n.points.add(2).pow(0.5)
      if (hasUpgrade('al',41)) eff20 = eff20.pow(1.25)
      if (hasUpgrade('s', 32)) eff20 = eff20.times(d(2).add(player.s.points.min(1500).times(0.1)))
      if(player.r.tetration.gte(9)) eff20 = eff20.add(10).slog().div(20).add(1)
      //3
      let eff30 = player.points.add(11).log(10)
      if (hasUpgrade('al',42)) eff30 = eff30.pow(5)
      if (hasUpgrade('s', 32)) eff30 = eff30.times(d(2).add(player.s.points.min(1500).times(0.1)))
      if(player.r.tetration.gte(9)) eff30 = eff30.add(10).slog().div(20).add(1)    
      
      let product = eff10.times(eff20).times(eff30)
      if(player.r.tetration.lt(9)) product = product.pow(0)
      return product
}   
/** 
*Number condenser's multiplicative effect
**/
function getNumberCondensereffect_MUL() {
    //1
    let eff1 = player.points.add(10).log(10).pow(0.75).times(1.5)
    //2
    let eff2 =  player.a.points.add(3).pow(d(0.5).times(buyableEffect('e',32)))
    //3
    let eff3 =  player.e.perkpower.add(1).pow(10)
    //4
    let eff4 = (player.s.points.add(2)).pow( d(1.11).times(buyableEffect('e',31)))

    let product = eff1.times(eff2).times(eff3).times(eff4).times(13.5)
    return product
}
/**
 * @param {*} resource resource value , need to be Decimal
 * @param {*} power softcap strength , how harshly the resource be reduced , need to be Decimal
 * @param {*} corruptionstart softcap start  , when do the softcap activated , need to be Decimal
 * @param {*} c the amount of log10 iterations performed , by default : 1 ; Equal to a ^n exponent softcap
 * @returns post softcap gain
 */
function postcorruptiongain(resource , power , corruptionstart , c = 1) {
    if(resource.lte(corruptionstart)) return resource
    if(isNaN(resource.mag))return d(0)
	corruptionstart=Decimal.iteratedexp(10,c-1,1.0001).max(corruptionstart)
	if(resource.gte(corruptionstart)){
        let cont = corruptionstart.iteratedlog(10,c)
		number=Decimal.iteratedexp(10,c,resource.iteratedlog(10,c).div(cont).pow(power).mul(cont))
	} 

	return number;
 }
/** 
* Approximate effectiveness of the converted compared to normal , return a decimal greater than 1 indicating how much the excess resource above the limit was rooted
**/
function corruptionroot(resource , power , corruptionstart , c = 1) {
    if(resource.lte(corruptionstart)) return d(1)
    if(isNaN(resource.mag))return d(1)
	corruptionstart=Decimal.iteratedexp(10,c-1,1.0001).max(corruptionstart);
	if(resource.gte(corruptionstart)){
        let cont = corruptionstart.iteratedlog(10,c)
		number=Decimal.iteratedexp(10,c,resource.iteratedlog(10,c).div(cont).pow(power).mul(cont))
	}
	return resource.div(corruptionstart).max(1).log(10).div(number.div(corruptionstart).max(10).log(10))

}
/** 
* Costs for static layer
**/
function static_cost(layer , amount , strength = d(0.6)) {
    //Strength is 0.6 for a and s and not e
    switch (layer) {
        case 'a':
                if(tmp.a.gainExp.eq(0)) return d(Infinity)
                let strong = strength
                if (inChallenge('r',11)) strong = strong.div(player.r.chf)
                strong = strong.pow(d(player.g.artifactset2[6]).max(1).pow(-1))
                let projected = d(player.a.startsoftcap)
                let effective = d(amount).gte(projected)?d(amount).div(projected).root(d(strong)).times(projected).div(tmp.a.directMult):d(amount).div(tmp.a.directMult)
                let cost = tmp.a.requires.times(d(2).pow(effective.pow(1.35)))
                if(d(amount).gte(player.g.corruption[1])) cost = d(10).pow(cost.max(10).log(10).pow(d(1).add(d(amount).sub(player.g.corruption[1]).div(player.g.corruption[1]))))
                if(inChallenge('al',11)) cost = cost.div(24.8)
                return cost.times(tmp.a.gainMult).max(tmp.a.requires)
        case 's':
                if(tmp.s.gainExp.eq(0)) return d(Infinity)
                let strong1 = strength
                if(inChallenge('r',11)) strong1 = strong1.div(player.r.chf)
                strong1 = strong1.pow(d(player.g.artifactset2[7]).max(1).pow(-1))
                let projected1 = player.s.startsoftcap
                let effective1 = d(amount).gte(projected1)?d(amount).div(projected1).root(d(strong1)).times(projected1).div(tmp.s.directMult):d(amount).div(tmp.s.directMult)
                let cost1 = tmp.s.requires.times(d(2).pow(effective1.pow(1.35)))
                if(d(amount).gte(player.g.corruption[2])) cost1 = d(10).pow(cost1.max(10).log(10).pow(d(1).add(d(amount).sub(player.g.corruption[2]).div(player.g.corruption[2]))))
                if(inChallenge('al',11)) cost1 = cost1.div(24.8)
                  return cost1.times(tmp.s.gainMult).max(tmp.s.requires)
        case 'e':
                if(tmp.e.gainExp.eq(0)) return d(Infinity)
                let strong2 = d(1).sub(d(tmp.e.gainExp.root(player.e.points.min(10))))
                if(d(amount).gte(player.g.corruption[5])) strong2 = strong2.pow(player.e.points.max(player.g.corruption[5]).div(player.g.corruption[5]).max(1).root(2)).root(amount.div(player.g.corruption[5]).max(1).root(2))
                let cost2 = d(2).pow(d(amount).pow(1.5)).root((d(1).sub(strong2)).pow(amount.min(10))).times(tmp.e.gainMult).times(tmp.e.requires).max(tmp.e.requires) 
                return cost2
        default:
            return d(0)
    }
}


//start layer
addLayer("ac", {
    startData() { return {         
        //general         
        unlocked: true,
        g:d(1), //do not touch
        r:d(1), //page
        super: [],
    }},
    infoboxes: {
    },
    symbol:"AC",
    color: "#FFFF00",                    
    tooltip() {return "Achievements <br> ("+format(player.ac.achievements.filter(x => x<1000).length,0)+" + "+format(-player.ac.achievements.filter(x => x>2100).length + player.ac.achievements.filter(x => x>1000).length,0)+" secret)"},
    ttStyle() {
        return {
            "color":"yellow",
            "width":"150px",
            "border":"2px solid",
            "border-color":"yellow",
        }
    },
    row: "side",                           
    type: "none",                      
    layerShown() { return true },          
    automate() {
        if(hasAchievement('ac',34) && !inChallenge('al',11)) {
            buyUpgrade('n',11)
            buyUpgrade('n',12)
            buyUpgrade('n',13)
            buyUpgrade('n',14)

        }
        if(hasAchievement('ac',37)) {
            buyUpgrade('a',21)
            buyUpgrade('s',31)
            buyUpgrade('m',41)
        }
        if(hasAchievement('ac',105)) {
            buyBuyable('r',201)
            buyBuyable('r',202)
            buyBuyable('r',203)
            buyBuyable('r',301)
            buyBuyable('r',302)
            buyBuyable('r',303)
            buyBuyable('r',401)
            buyBuyable('r',402)
            buyBuyable('r',403)
            buyBuyable('r',501)
            buyBuyable('r',502)
        }
        if(hasAchievement('ac',155)) {
            buyBuyable('r',10)
        }
        if(hasAchievement('ac',156)) {
            buyBuyable('al',16)
            buyBuyable('al',17)
        }
        let highest = player.g.sacrificeactive[0]
        for(let i = 0 ; i < 9 ; i++) {
            if(player.g.sacrificeactive[i].gt(highest)) highest = player.g.sacrificeactive[i]
        }
        if(hasAchievement('ac',146) && player.r.tetrationcost.lte(100) && !inChallenge('c',11)) {
            player.r.tetration = player.r.tetration.add(1)
        }
        if(hasAchievement('ac',148) && highest.eq(0) && player.r.points.gte(4)) {
            let d1 = getMult().pow(getExp().div(2)).times(tmp.t.effect.clampMax(player.t.cap)).times(player.r.truegamespeed)
            let d2 = getMult().add(10).log(10).pow(getExp().times(5)).times(tmp.t.effect.clampMax(player.t.cap)).times(player.r.truegamespeed)
            let d3 = getMult().pow(getExp()).min(player.n.points.pow(0.5)).times(tmp.t.effect.clampMax(player.t.cap)).times(player.r.truegamespeed)
            let d4 = d(10).times(tmp.t.effect.clampMax(player.t.cap)).times(player.r.truegamespeed)
            if(d1.gte(tmp.r.buyables[101].cost)) {
                player.r.buyables[101] = player.r.buyables[101].add(1)
            }
            if(d2.gte(tmp.r.buyables[102].cost)) {
                player.r.buyables[102] = player.r.buyables[102].add(1)
            }
            if(d3.gte(tmp.r.buyables[103].cost)) {
                player.r.buyables[103] = player.r.buyables[103].add(1)
            }
            if(d4.gte(tmp.r.buyables[104].cost)) {
                player.r.buyables[104] = player.r.buyables[104].add(1)
            }
        }
    },
    upgrades: {
       
    },
    buyables: {
        11: {
            title() {return "Achievements page "+formatWhole(player.ac.r,0)+""},
            cost(x) { return d(0)},
            tooltip() {return "Click to go to next page <br> (if unlocked) <br> Hold [shift] to go backward instead"},
            ttStyle() {
                return {
                    "color":"yellow",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            display() { return "" },
            canAfford() { return true },
            buy() {
                let base = d(1)
                if(hasAchievement('ac',34)) base = base.add(1)
                if(hasAchievement('ac',51)) base = base.add(1)
                if(hasAchievement('ac',64)) base = base.add(1)
                if(player.g.rank.gte(2)) base = base.add(1)
                if(hasAchievement('ac',139)) base = base.add(1)
                if(hasAchievement('ac',171)) base = base.add(1)
                if(options.dev) base = d(7)
                if(base.lte(1)) return
                if(player.ac.r.gte(base) && !shiftDown) player.ac.r = d(0)
                if(player.ac.r.lt(base) && !shiftDown) player.ac.r = player.ac.r.add(1)
                if(player.ac.r.eq(1) && shiftDown) player.ac.r = base.add(1)
                if(player.ac.r.neq(1) && shiftDown) player.ac.r = player.ac.r.sub(1)
            },
            style() {
                if (player.ac.r.eq(1) && player.ac.g.eq(1)) return Qcolor('orange')
                if (player.ac.r.eq(2) && player.ac.g.eq(1)) return Qcolor('red')
                if (player.ac.r.eq(3) && player.ac.g.eq(1)) return Qcolor('green')
                if (player.ac.r.eq(4) && player.ac.g.eq(1)) return Qcolor('purple')
                if (player.ac.r.eq(5) && player.ac.g.eq(1)) return Qcolor('grey')
                if (player.ac.r.eq(6) && player.ac.g.eq(1)) return Qcolor('blue')
                if (player.ac.r.eq(7) && player.ac.g.eq(1)) return Qcolor('brown')
            },
            unlocked() {return true},
            },
        12: {
            title() {return "Reset charged achievement"},
            cost(x) { return d(0)},
            tooltip() {return ""},
            display() { return "" },
            canAfford() { return true },
            buy() {
                if(!player.g.sacrificeactive[5].gte(1)) {
                    showModal("You cannot reset charged achievement outside of Exponent sacrifice (Graduation)",'',{textColor : 'crimson'})
                    return
                }
                buyBuyable('g',100)
                player.ac.super = []
            },
            style() {
                if (true) return Qcolor('red')
            },
            unlocked() {return d(player.ac.super.length).gte(1)},
            },
    },
    achievements: {
        11: {
            name: "The Begining",
            done() { return player.n.points.gte("1") },
            tooltip() {return "Goal : Have 1 Number"},
            unlocked() {return player.ac.r.eq(1)}, 
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
        },
        12: {
            name: "Tenth",
            done() { return player.n.points.gte("10") },
            tooltip() {return "Goal : Have 10 Number"},
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
        },
        13: {
            name: "One hundred",
            done() { return player.n.points.gte("100") },
            tooltip() {return "Goal : Have "+f(100)+" number"},
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },

        },
        14: {
            name: "Not Addition",
            done() { return player.a.points.gte("1") },
            tooltip() {return "Goal : Get 1 Additive"},
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },

        },
        15: {
            name: "Not Subtraction",
            done() { return player.s.points.gte("1") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Get 1 Subtractive "},
        },
        16: {
            name: "3 of additive",
            done() { return player.a.points.gte("3") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Get 3 Additive"},
        },
        17: {
            name: "3 of minus",
            done() { return player.s.points.gte("3") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Get 3 Subtractive "},
        },
        18: {
            name: "Equality",
            done() { return player.a.points.eq("5") && player.s.points.eq("5") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {
                let base = "Goal : Have exactly 5 Subtractive and 5 Additive <br> Reward : Gain x1.1 Number"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and ^1.05 Number"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and ^1.05 Number"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
        },
        19: {
            name() {return options.hidemastery?"???":"What's Mastery"},
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            done() { return player.r.bestmastery.gte("3.5") },
            tooltip() {
                let a = "Reach 3.50 mastery"
                if(options.hidemastery) a = "Reach something"
                let base = "Goal : "+a+" <br> Reward : x2 Points gain"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and ^1.02 Points"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and ^1.02 Points"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {    
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')            
            }
        },
        21: {
            name: "Subtractive lord",
            done() { return player.s.points.gte("10") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {
                let base = "Goal : Get 10 Subtractive <br> Reward : Additive cost is /2"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and x1.02 Additive gain"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and x1.02 Additive gain"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            }
        },
        22: {
            name: "Additive legend",
            done() { return player.a.points.gte("15") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Get 15 Additive"},
        },
        23: {
            name: "A billion",
            done() { return player.n.points.gte("1e9") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Get "+format(1e9)+" Number"},
        },
        24: {
            name: "Is this enough?",
            done() { return player.n.points.gte("1e12") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {
                let base = "Goal : Have "+format(1e12)+" Number <br> Reward : Subtractive cost is /10"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and x1.05 Subtractive gain"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and x1.05 Subtractive gain"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            }
        },
        25: {
            name: "Multipling",
            done() { return player.m.points.gte("1") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {
                let base = "Goal : Have 1 Multiplicative <br> Reward : Gain x1.1 Number again"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and x3 Gamespeed"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and x3 Gamespeed"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            }
        },
        26: {
            name: "10th Doubling",
            done() { return player.m.points.gte("1024") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {
                let base = "Goal : Have "+format(1024)+" Multiplicative <br> Reward : Gain x1.1 Multiplicative"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and ^1.05 Multiplicative"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and ^1.05 Multiplicative"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            }
        },
        27: {
            name: "25th Doubling",
            done() { return player.m.points.gte("33534432") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Have "+format(33534432)+" Multiplicative"},
        },
        28: {
            name: "Additional increase",
            done() { return player.a.points.gte("45") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Reach 45 Additive"},
        },
        29: {
            name: "Not Division!",
            done() { return player.d.points.gte("1") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {
                return ctrlDown?"Tickspeed boosts points generation and all row1 and row2 resource passive generation":"Goal : Get 1 Divisive <br> Reward : x1.15 Tickspeed <br> (Hold [ctrl] to see what <i>Tickspeed</i> does)"
            },
            style() {
                return Qcolor3('aqua')
            }
        },
        31: {
            name: "~40th doubling",
            done() { return player.m.points.gte("1e12") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {
                let base = "Goal : Get "+format(d("1e12"))+" Multiplicative <br> Reward : Additive cost is /5"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and x1.04 Additive gain"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and x1.04 Additive gain"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            }
        },
        32: {
            name: "A lot of Divisive!",
            done() { return player.d.points.gte("1e20") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {
                let base = "Goal : Get "+format(1e20)+" Divisive <br> Reward : x2 to Number gain"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) Make Divisive effect more powerful , but nullify (Operation) upgrade 'Super Divisive' first effect"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Make Divisive effect more powerful , but nullify (Operation) upgrade 'Super Divisive' first effect"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            }

        },
        33: {
            name: "~75 doubling",
            done() { return player.m.points.gte("3.778e25") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Get "+format(d("3.778e25"))+" Multiplicative"},
        },
        34: {
            name: "EXPONENTATION!",
            done() { return player.e.points.gte("1") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Reach 1 Exponent <br> QOL : Automaticly buy the first row of Number upgrades <br> Next page of achievement unlocked"},
            style() {
                return Qcolor3('aqua')
            }
        },
        35: {
            name: "MAXED?",
            done() { return player.m.buyables[11].gte("100") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Buy 100 levels of 'Points Boost' buyable <br> Reward : Extend the level limit of 'Points Boost' by 2x "},
            style() {
                return Qcolor3('aqua')
            }

        },
        36: {
            name: "Googol",
            done() { return player.points.gte("1e100") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Gather "+format(1e100)+" Points <br> QOL : Automaticly buy 'Points Boost' buyable  <br><i> This autobuyer can buy multiple at once . Its bulks scales with current Multiplicative"},
            style() {
                return Qcolor3('aqua')
            }
        },
        37: {
            name: "Third exponent",
            done() { return player.e.points.gte("3") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {
                let base = "Goal : Reach 3 Exponent <br> QOL : Automaticly buy the first upgrade of every Row 2 layer <br> Reward : x2 Divisive gain"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and ^1.04 Divisive gain"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and ^1.04 Divisive gain"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            }
        },
        38: {
            name: "Eighth exponent",
            done() { return player.e.points.gte("8") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Reach 8 Exponent"},
        },
        39: {
            name: "Researcher",
            done() { return player.r.points.gte("1") },
            unlocked() {return player.ac.r.eq(1)},
            ttStyle() {
                return {
                    "color":"orange",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            tooltip() {return "Goal : Have 1 Research <br> Reward : 2x Multiplier to Tickspeed"},
            style() {
                return Qcolor3('aqua')
            }
        },
        41: {
            name: "Not tired at all",
            done() { return player.points.gte("1e90") && inChallenge('m',11) && hasAchievement('ac',34) },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },
            tooltip() {
                let base = "Reach "+format(1e90)+" Points in 'Fatigue' challenge <br> Reward : 'Fatigue' challenge reward ^"+format(this.effect())+" (based on Multiplicative)"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) : Bonus increased to ^"+format(this.effect().add(1).pow(1.3))+""
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
            effect() {
                let a = player.m.points.add(10).slog()
                let b = a.pow(1.5)
                if(hasSuperAchievement('ac',41)) b = b.add(1).pow(1.3)
                return b
            },
        },
        42: {
            name: "Not even halted",
            done() { return player.n.points.gte("1e90") && inChallenge('m',12) && hasAchievement('ac',34)},
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },
            tooltip() {
                let base = "Reach "+format(1e90)+" Number in 'Halted Counter' challenge <br> Reward : 'Halted Counter' challenge reward ^"+format(this.effect())+" (based on Multiplicative)"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) : Bonus increased to ^"+format(this.effect().add(1).pow(1.2))+""
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
            effect() {
                let a = player.m.points.add(10).slog()
                let b = a.pow(2)
                if(hasSuperAchievement('ac',42)) b = b.add(1).pow(1.2)
                return b
            },

        },
        43: {
            name: "Why",
            done() { return player.points.gte("1.78e308") && inChallenge('d',11) && hasAchievement('ac',34)},
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },
            tooltip() {
                let base = "Reach "+format(d("1.78e308"))+" Points in 'No Counting' challenge <br> Reward : x1.2 Effective Exponent "
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and Exponent effect is 15% stronger"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and Exponent effect is 15% stronger"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
        },
        44: {
            name: "Not enough",
            done() { return player.points.gte("1e20") && inChallenge('d',12) && hasAchievement('ac',34)},
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },
            tooltip() {
                let base = "Reach "+format(1e20)+" Points in 'Worsen Condition' challenge <br> Reward : x1.2 Effective Exponent "
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and x1.15 Meta-research gain"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and x1.15 Meta-research gain "
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },

        },
        45: {
            name: "Torture",
            done() { return  player.points.gte("1e100") && inChallenge('e',11) && hasAchievement('ac',34)},
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },
            tooltip() {return "Reach "+format(1e100)+" Points in 'Equality' challenge <br> Reward : x1.08 max Perk Power"},
            style() {
                return Qcolor3('aqua')
            },

        },
        46: {
            name: "The Waiting Challenge",
            done() { return   player.points.gte(d(10000000).times(tmp.t.effect.clampMax(player.t.cap).div(1000).add(1).pow(0.5))) && player.t.tickspeedcontrol.eq(1) && inChallenge('e',12) && hasAchievement('ac',34) },
            tooltip() { 
                let base = "Complete 'No Number' challenge without disabling Tickspeed <br> Reward : x2 Tickspeed"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and 4 new Tickspeed upgrade (Effect only work when charging this achievement)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and new Tickspeed upgrade (Effect only work when charging this achievement)"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },
        },
        47: {
            name: "Impossible Challenge",
            done() { return   inChallenge('e',12) && inChallenge('d',12) && player.points.gte("1e9") && hasAchievement('ac',34)},
            tooltip() {return "Reach "+format(1e9)+" Points while inside 'No Number' and 'Worsen Condition' challenge <br> Reward : 'Points Boost' buyable effect ^1.5"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        48: {
            name: "Specfic requirement",
            done() { return   inChallenge('e',12) && inChallenge('d',12) && player.t.tickspeedcontrol.eq(0) && player.points.lte(11000) && player.points.gte(9000) && hasAchievement('ac',34)},
            tooltip() {return "Reach "+format(9000)+" - "+format(11000)+" Points inside 'No Number' and 'Worsen Condition' challenge while disabling Tickspeed <br> Reward : ^1.1 max Perk Power"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        49: {
            name: "What the hell",
            done() { return   inChallenge('e',12) && inChallenge('d',12) && player.t.tickspeedcontrol.eq(0) && player.r.mastery.gte(1000) && player.points.lte(25000) && hasAchievement('ac',34) },
            tooltip() {
                let a = "Reach "+format(1000)+" Mastery"
                if(options.hidemastery) a = "Do something"
                return ""+a+" inside 'No Number' and 'Worsen Condition' challenge while disabling Tickspeed with less than 25000 Points <br> Reward : x1.1 Effective Exponent , x1.25 max Perk Power , x5 Tickspeed"},
                style() {
                    return Qcolor3('aqua')
                },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        51: {
            name: "Unrelated challenge",
            done() { return  inChallenge('al',11) && hasAchievement('ac',39)},
            tooltip() {return "Discover the second realm (enter Altered realm) <br> Reward : 2x to Prestige Time gain <br> Next page of achievement unlocked  new ticks upgrade"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)}, 
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        52: {
            name: "True Equality",
            done() { return   player.points.floor().eq(player.n.points.floor()) && inChallenge('e',11) && hasAchievement('ac',39)},
            tooltip() {
                let a = "<br> Reward : Number to Mastery formula is better , granting ~15% more Mastery"
                if(options.hidemastery) a = ""
                return "Get current Points equal to current Number (rounded down) while in 'Equality' challenge "+a+""
            },
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        53: {
            name: "Real Equality",
            done() { return   player.m.points.floor().eq(player.d.points.floor()) && player.m.points.gte(1) && player.d.points.gte(1) && inChallenge('e',11) && hasAchievement('ac',39)} ,
            tooltip() {
                let a = "<br> Reward : Multiplicative to Mastery formula is better , granting ~15% more Mastery"
                if(options.hidemastery) a = ""
                return "Get current Multiplicative , Divisive to be equal (rounded down) inside 'Equality' challenge "+a+" <br> You are also required to have 1 or more Multiplicative and Divisive"
            },
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        54: {
            name: "Postivity",
            done() { return   player.a.points.gte(400) && inChallenge('e',11) && inChallenge('m',11) && hasAchievement('ac',39)},
            tooltip() {return options.hidemastery?"Get 400 Additive inside of 'Equality' & 'Fatigued' challenge <br> Conditional reward : Unlock a permeant reward , sometimes":"Get 400 Additive inside of 'Equality' & 'Fatigued' <br> Conditional reward : Unlock a permeant research if your mastery is above "+format(1000)+""},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        55: {
            name: "Negativity",
            done() { return   player.s.points.gte(555) && inChallenge('e',11) && inChallenge('m',11) && hasAchievement('ac',39)},
            tooltip() {
                let base = "Get 555 Subtractive inside of 'Equality  & 'Fatigued' <br> Reward : 'Points Boost' buyable cost is ^"+format(this.effect())+" (based on Subtractive)"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect increased to ^"+format(this.effect().pow(1.25))+""
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },         
            effect() {
                let subtracti = player.s.points.add(1)
                if(hasSuperAchievement('ac',55)) subtracti = subtracti.pow(1.25)
                return subtracti.pow(-0.1)
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        56: {
            name: "More Multiplicative content",
            done() { return   player.m.points.gte("1e500") && player.r.buyables[101].eq(0) && hasAchievement('ac',39)},
            tooltip() {
                let base = "Get "+f(d("e500"))+" Multiplicative without any 'More fatigued' Improvement <br> Reward : Unlock 2 more Multiplicative upgrade"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and retain all Multiplicative upgrade on Graduation or lower reset"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and retain all Multiplicative upgrade on Graduation or lower reset"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            unlocked() {return player.ac.r.eq(2)},            
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        57: {
            name: "More Divisive content",
            done() { return   player.d.points.gte("1e500") && player.r.buyables[102].eq(0) && hasAchievement('ac',39)},
            tooltip() {return "Get "+format(d("e500"))+" Divisive without any 'More hardness' Improvement <br> Reward : Unlock 1 more Divisive challenge ('Chaotic Division')"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        58: {
            name: "Relativity",
            done() { return   tmp.t.effect.clampMax(player.t.cap).gte("2.5e13") && player.r.buyables[104].eq(0) && hasAchievement('ac',39)},
            tooltip() {
                let base = "Reach "+format(2.5e13)+" Tickspeed without any 'More letter' Improvement <br> Reward : Unlock 2 more tickspeed upgrade"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) <i> and 1.25x ticks gain per tickspeed upgrade bought</i> (x"+format(d(1.25).pow(d(player.t.upgrades.length)))+")"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and 1.25x ticks gain per tickspeed upgrade bought"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        59: {
            name: "Old age",
            done() { return   player.r.prestigetime.gte("2628000") && hasAchievement('ac',39)},
            tooltip() {
                let base = "Reach 1 month (31 days) worth of Prestige Time <br> Reward : Unlock 1 more Research Improvement (More Operation)"
                if(player.ac.super.includes(toNumber(this.id))) base = "Reach 1 month (31 days) worth of Prestige Time <br> (Charged) Reward : 'More Operation' improvement effect is ^1.1 <br> <i> This achievement unlocks 'More Operation' improvement </i>"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base = "Reach 1 month (31 days) worth of Prestige Time <br> (ifCharged) Reward : 'More Operation' improvement effect is ^1.1 <br> <i> This achievement unlocks 'More Operation' improvement </i>"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        61: {
            name: "Points Boost++",
            done() { return   player.m.buyables[11].gte(4000)},
            tooltip() {return "Reach 'Points Boost' level "+format(4000)+" <br> Reward : Unlock 4 more Multiplicative upgrade"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        62: {
            name: "Elder age",
            done() { return   player.r.prestigetime.gte("31556926")},
            tooltip() {
                let base = "Reach 1 year worth of Prestige Time <br> Reward : "+format(2)+"x Prestige time gain again"
                if(player.ac.super.includes(toNumber(this.id))) base = "Reach 1 year worth of Prestige Time <br> (Charged) Reward : Gain 4% more Prestige time per total Improvement level , plus 25 . Currently : "+format(this.effect())+"x"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base = "Reach 1 year worth of Prestige Time <br> (ifCharged) Reward : Gain 4% more Prestige time per total Improvement level , plus 25 . Currently : "+format(this.effect())+"x"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },    
            effect() {
                let base = d(2)
                if(hasSuperAchievement('ac',62)) base = base.add(d(0.04).times(getBuyableAmount('r', '101').add(getBuyableAmount('r', '102')).add(getBuyableAmount('r', '103')).add(getBuyableAmount('r', '104')).add(getBuyableAmount('r','105'))))
                return base
            },
            unlocked() {return player.ac.r.eq(2)}, 

        },
        63: {
            name: "What have you done?",
            done() { return player.n.points.gte("1e2000") },
            tooltip() {
                let base = "Reach "+f(d("e2000"))+" Number <br> Reward : +"+format(this.effect(),4)+" 'Addition' upgrade base (based on Number)"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) Reduce Exponent cost scaling base by /"+format(d(1).add(this.effect().div(1.5)),4)+""
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Reduce Exponent cost scaling base by /"+format(d(1).add(this.effect().div(1.5)),4)+""
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },    

            effect() {
                return player.n.points.add(10).slog().add(10).slog().sub(1)
            },
            unlocked() {return player.ac.r.eq(2)}, 

        },
        64: {
            name: "A new research",
            done() { return   player.r.mastery.gte(10000)},
            tooltip() {
                let a = "Get "+format(10000)+" Mastery"
                if(options.hidemastery) a = "Have enough to Meta-reset"
                return ""+a+"<br> Reward : Perk Power effect is 5% stronger <br> Next page of achievement unlocked"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        65: {
            name: "Even more research",
            done() { return   player.r.mastery.gte(10830)},
            tooltip() {
                let a = "Get "+format(10830)+" Mastery"
                if(options.hidemastery) a = "Have more than enough to Meta-reset"
                return ""+a+"<br> Reward : +1 MR , once"},
            onComplete() {
                player.r.metaresearch = player.r.metaresearch.add(1)
            },
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        66: {
            name: "What's next",
            done() { return   player.e.effective.gte(75)},
            tooltip() {
                let base = "Get 75 effective exponent <br> Reward : Exponent effect is 5% stronger <i> Only affects the exponental bonus to points </i>"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and cube Energy effect as well"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and cube Energy effect as well"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        67: {
            name: "Infinite Ticks",
            done() { return   player.t.total.gte("1e8")},
            tooltip() {return "Earned a total of "+format(1e8)+" Ticks <br> Reward : You may spent ticks to boost gamespeed"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        68: {
            name: "Twilight gatherer",
            done() { return   player.r.twilight.gte("1e6")},
            tooltip() {return "Reach "+format(1e6)+" Twilight <br> Reward : Twilight effect is squared (increase tickspeed)"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        69: {
            name: "Repeated Exponentation",
            done() { return   player.e.effective.gte(100)},
            tooltip() {return "Reach 100 effective exponent <br> Reward : Unlock 1 more reset layer (in Research)"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(2)},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },

        },
        71: {
            name: "Back to square one",
            done() { return  player.s.points.gte(1) && player.a.points.gte(1) && inChallenge('al',11)},
            tooltip() {
                let base = "Get 1 Additive and Subtractive <br> Reward : 16x Number gain"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) Perk : When replacing artifacts , always keep the bottommost effect of the replaced artifacts"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Perk : When replacing artifacts , always keep the bottommost effect of the replaced artifacts"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },

        },
        72: {
            name: "Three of each",
            done() { return  player.s.points.gte(3) && player.a.points.gte(3) && inChallenge('al',11)},
            tooltip() {
                let base = "Get 3 Additive and Subtractive <br> Reward : /10 Additive & Subtractive cost"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and x1.05 Additive & Subtractive cost scaling start"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and x1.05 Additive & Subtractive cost scaling start"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },    
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },

        },
        73: {
            name: "Small Multiplication",
            done() { return player.m.points.gte("2") && inChallenge('al',11)},
            
            tooltip() {
                let bonus = player.r.tetration.gte(18)?"(unaffected by all level-modifying amplifier)":""
                let base =  "Reach 2 Multiplicative <br> Reward : 'Points Boost' level "+bonus+" affects Number gain  (Currently : x"+format(this.effect())+")"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect increased to x"+format(this.effect().pow(player.m.buyables[11].pow(0.3).div(2)))+""
                return base
            },
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            effect() {
                let level = player.m.buyables[11]
                let effect = level.add(1).pow(2)
                if(hasSuperAchievement('ac',73)) effect = effect.pow(level.pow(0.3).div(2))
                if(player.g.sacrificeactive[4].gte(1)) effect = d(1)
                return effect
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },

        },
        74: {
            name: "Slight Multiplication",
            done() { return   player.m.points.gte("128") && inChallenge('al',11)},
            tooltip() {
                let base = "Reach 128 Multiplicative <br> Reward : Reduce the tickspeed penality while altered by 4x"
                if(player.ac.super.includes(toNumber(this.id))) base = "(Charged) Reach 128 Multiplicative <br> Reward : 'More operation' buyable effect increased from 2.0x => 2.2x and no longer reduce Operation on purchase <br><i>x4 Tickspeed while altered</i>"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base = "(ifCharged) Reach 128 Multiplicative <br> Reward : 'More operation' buyable effect increased from x2 => x2.2 per <br><i>x4 Tickspeed while Altered</i>"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },  
            unlocked() {return player.ac.r.eq(3)}, 

        },
        75: {
            name: "Very long grind",
            done() { return   player.points.gte("1e25") && inChallenge('al',11)},
            tooltip() {
                let base = "Reach "+format(1e25)+" points <br> Reward : +^0.05 Altered Pre-research resource and cost reduction  <br> Reward 2 : Unlock more Altered upgrade"
                if(player.ac.super.includes(toNumber(this.id))) base = "<br> (Charged) Reach "+format(1e25)+" points<br> <i>+^0.05 Altered Pre-research resource and cost reduction</i> <br> Reward : Improved Operation effect"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base = "<br> (ifCharged) Reach "+format(1e25)+" points<br> <i>+^0.05 Altered Pre-research resource and cost reduction</i> <br> Improved Operation effect"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },   
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },

        },
        76: {
            name: "Tedious work",
            done() { return   player.d.points.gte(1) && inChallenge('al',11)},
            tooltip() {return "Get 1 Divisive <br> Reward : +^0.1 Altered Tickspeed"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },

        },
        77: {
            name: "Extreme work",
            done() { return   player.d.points.gte("1e2") && inChallenge('al',11)},
            tooltip() {return "Get 100 Divisive <br> Reward : Square root 'Points Boost' cost"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },

        },
        78: {
            name:  "Exponent again",
            done() { return   player.points.gte("1e50") && inChallenge('al',11)},
            tooltip() {return "Reach "+format(1e50)+" points <br> Reward : +^0.1 Altered Tickspeed again"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },

        },
        79: {
            name: "Exponentation II",
            done() { return   player.e.points.gte(1) && inChallenge('al',11)},
            tooltip() {return "Reach 1 Exponent <br> Reward : +^0.1 Altered Pre-research resource and cost reduction <br> QOL : When exiting altered realm , regain all improvements you have before entering altered realm"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },

        },
        81: {
            name: "Altered number",
            done() {return player.n.points.gte("1e500") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {
                let base = "Have 1e500 Number <br> Reward : Best altered number ever ("+format(player.r.nbest)+") boosts Number gain by "+format(this.effect())+"x outside of altered"
                if(player.r.bestmastery.gte("40000")) base = "Have 1e500 Number <br> Reward : Best altered number this Graduation ("+format(player.r.nbest)+") boosts Number gain by "+format(this.effect())+"x outside of altered"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect is around ^5 stronger"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            effect() {
            let eff = player.r.nbest
            let eff1 = eff.pow(0.5).add(1)
            if(hasSuperAchievement('ac',81)) eff1 = eff1.pow(5)
            let softcap1 = d(0.1)
            if(hasAchievement('ac',123)) softcap1 = softcap1.add(0.9)
            let eff2 = softcap(eff1,d("1e100"),softcap1)
            let eff3 = softcap(eff2,d("1.8e308"),0.1)
            return eff3
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },

        },
        82: {
            name: "Altered additive",
            done() {return player.a.points.gte("400") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {
                let base = "Have 400 Additive <br> Reward : Best altered additive ever ("+format(player.r.abest)+") reduces Additive cost by /"+format(this.effect())+" outside of altered"
                if(player.r.bestmastery.gte("40000")) base = "Have 400 Additive <br> Reward : Best altered additive this Graduation ("+format(player.r.abest)+") reduces Additive cost by /"+format(this.effect())+" outside of altered"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect is raised to around 3.3"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            effect() {
            let eff = player.r.abest
            let base = d(2)
            if(hasSuperAchievement('ac',82)) base = base.times(5)
            if(hasAchievement('ac',123)) base = base.times(eff.pow(0.25).add(1).pow(0.5))
            return d(base).pow(eff)
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },

        },
        83: {
            name: "Altered subtractive",
            done() {return player.s.points.gte("350") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {
                let unl = player.r.bestmastery.gte("4e4")?"this Graduation":"ever"
                let base = "Have 350 subtractive <br> Reward : Best altered subtractive "+unl+" ("+format(player.r.sbest)+") reduces subtractive cost by /"+format(this.effect())+" outside of altered"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect is raised to around 3.3"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            effect() {
            let eff = player.r.sbest
            let base = d(2)
            if(hasSuperAchievement('ac',83)) base = base.times(5)
            if(hasAchievement('ac',123)) base = base.times(eff.pow(0.25).add(1).pow(0.5))
            return d(base).pow(eff)
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },
        }, 
        84: {
            name: "Altered multiplicative",
            done() {return player.m.points.gte("1e250") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {
                let unl = player.r.bestmastery.gte("4e4")?"this Graduation":"ever"
                let base = "Have "+f(d("e250"))+" Multiplicative <br> Reward : Best altered multiplicative "+unl+" ("+format(player.r.mbest)+") boosts Multiplicative gain by "+format(this.effect())+"x outside of altered"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect scaling is improved , up to ^5"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            effect() {
            let eff = player.r.mbest
            if(hasSuperAchievement('ac',84)) eff = eff.pow(5)
            if(hasAchievement('ac',123)) eff = eff.pow(5)
            let eff1 = eff.pow(0.5).add(1)
            let eff2 = softcap(eff1,d("1e100"),0.5)
            let eff3 = softcap(eff2,d("1.8e308"),0.25)
            let eff4 = softcap(eff3,d("1e500"),0.125)
            return eff4
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },
        },
        85: {
            name: "Altered divisive",
            done() {return player.d.points.gte("1e200") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {
                let unl = player.r.bestmastery.gte("4e4")?"this Graduation":"ever"
                let base = "Have "+f(d("e200"))+" Divisive <br> Reward : Best altered divisive "+unl+" ("+format(player.r.dbest)+") boosts Divisive gain by "+format(this.effect())+"x outside of altered"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect scaling is improved , up to ^5"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            effect() {
            let eff = player.r.dbest
            if(hasSuperAchievement('ac',85)) eff = eff.pow(5)
            if(hasAchievement('ac',123)) eff = eff.pow(5)
            let eff1 = eff.pow(0.5).add(1)
            let eff2 = softcap(eff1,d("1e100"),0.5)
            let eff3 = softcap(eff2,d("1.8e308"),0.25)
            let eff4 = softcap(eff3,d("1e500"),0.125)
            return eff4
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },
        },
        86: {
            name: "Altered exponent",
            done() {return player.e.effective.gte("50") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {
                let unl = player.r.bestmastery.gte("4e4")?"this Graduation":"ever"
                let base = "Reach 50 effective exponent <br> Reward : Best altered exponent "+unl+" ("+format(player.r.ebest)+") increases max Perk Power by +"+format(this.effect(),3)+" outside of altered"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect is 10x stronger"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            effect() {
            let eff = player.r.ebest
            let eff1 = eff.div(20)
            let eff2 = softcap(eff1,d("2"),0.5)
            let eff3 = softcap(eff2,d("4"),0.33)
            let eff4 = softcap(eff3,d("6"),0.25) 
            if(hasSuperAchievement('ac',86)) eff4 = eff4.times(10)
            return eff4
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },
        },
        87: {
            name: "Altered points",
            done() {return player.points.gte("1e1000") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {
                let unl = player.r.bestmastery.gte("4e4")?"this Graduation":"ever"
                let base = "Have "+f(d("e1000"))+" Points <br> Reward : Best altered points "+unl+" ("+format(player.r.pointbest)+") boosts Number gain by "+format(this.effect())+"x outside of altered"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect scaling improved , up to ^5"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            effect() {
            let eff = player.r.pointbest
            let eff1 = eff.pow(0.5).add(1)
            if(hasSuperAchievement('ac',87)) eff1 = eff1.pow(5)
            let softcap1 = d(0.1)
            if(hasAchievement('ac',123)) softcap1 = softcap1.add(1.4)
            let eff2 = softcap(eff1,d("1e100"),softcap1)
            let eff3 = softcap(eff2,d("1.8e308"),0.1)
            let eff4 = softcap(eff3,d("1e500"),0.25)
            return eff4
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },
        }, 
        88: {
            name() {return options.hidemastery?"Altered power":"Altered mastery"},
            done() {return player.r.mastery.gte(7500) && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {
                let c = d(12500)
                if(hasSuperAchievement('ac',88)) c = d(11000)
                let b = player.r.bestmastery.gte("4e4")?"this Graduation":"ever"
                let a = "Reach "+format(7500)+" Mastery <br> Reward : Best altered mastery "+b+" ("+format(player.r.mabest)+") boosts"
                if(options.hidemastery) a = "Get various resource in Altered realm <br> Reward : Boost"
                let base = ""+a+" ticks gain by "+format(this.effect(),2)+"x <br> (Effect compound every "+f(c)+" Mastery after reaching "+f(50000)+")"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) The compounding effect happen every "+f(12500)+" => "+f(11000)+" Mastery"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },    
            effect() {
            let interval = d(12500)
            if(hasSuperAchievement('ac',88)) interval = interval.sub(1500)
            let eff = player.r.mabest
            let eff1 = eff.add(1).pow(0.75)
            let eff2 = softcap(eff1, d("1.2"),0.8)
            let eff3 = softcap(eff2,d("1.5"),0.6)
            let eff4 = softcap(eff3,d("2"),0.4).pow((eff.max(50000).sub(37500).div(interval)))
            if(hasAchievement('ac',123)) eff4 = eff4.pow(2)
            return eff4

            },
            unlocked() {return player.ac.r.eq(3)}, 
        },
        89: {
            name: "Altered tickspeed",
            done() {return tmp.t.effect.clampMax(player.t.cap).gte("1e4") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {
                return "Obtain "+format(d("1e4"))+" Altered Tickspeed <br> Reward : Best altered tickspeed this Graduation ("+format(player.r.tbest)+") boosts tickspeed by "+format(this.effect())+"x outside of altered"
            },
            effect() {
            let eff = player.r.tbest
            let eff1 = eff.add(1).pow(0.9)
            let eff2 = softcap(eff1, d("10"),0.5)
            let eff3 = softcap(eff2,d("1e10"),0.5)
            let eff4 = softcap(eff3,d("1e25"),0.5)
            if(hasAchievement('ac',123)) eff4 = eff4.pow(1.25)
            return eff4
            },
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(3)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"green",
                }
            },
        },
        91: {
            name: "The meta",
            done() {return player.r.metaresearch.gte(1)},
            tooltip() {return "Perform a Meta-reset (get 1 MR) <br> Reward : 'Unlimited boost' multiplicative upgrade costs less (1e1050 => "+format(1e21)+") <br> Other : You will no longer recieve popup from Exponent milestones"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },
        },
        92: {
            name: "More Meta",
            done() {return player.r.metaresearch.gte(5)},
            tooltip() {
                let base = "Get 5 MR <br> Reward : Unspent MR gives a bonus to Number gain (Currently : ^"+format(this.effect(),4)+""
                if(!hasSuperAchievement('ac',92)) base += ", capped at ^1.05)"
                if(player.ac.super.includes(toNumber(this.id))) base += ")<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect uncapped , but increase way less"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },     
            effect() {
            let eff = player.r.metaresearch.div(2).add(1)
            if(hasSuperAchievement('ac',92)) return player.r.metaresearch.add(10).log(10).div(100).add(1.04)
            else return eff.pow(0.02).min(1.05)
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        93: {
            name: "Tetrate I",
            done() {return player.r.tetration.gte(1)},
            tooltip() {
                let base = "Reach 1 tetration <br> Reward : Tickspeed boosts itself (^"+format(this.effect(),4)+")"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and ^1.5 Energy"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and ^1.5 Energy"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },   
            effect() {
                let a = tmp.t.effect.clampMax(player.t.cap).max(1024).log(2).div(1024).add(1).min(2)
                return a
                
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        }, 
        94: {
            name: "Tetrate II",
            done() {return player.r.tetration.gte(2)},
            tooltip() {
                return "Reach 2 tetration <br> Reward : 'Additive cheapener' (subtractive) upgrade effect also apply to subtractive as well"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },
        },
        95: {
            name: "Tetrate III",
            done() {return player.r.tetration.gte(6)},
            tooltip() {
                let base = "Reach 6 tetration <br> Reward : 'Worsen condition' challenge reward is increased from ^1.15 to ^1.25"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged) and reducing Graduation 'Early game nerf' duration by 75%"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) and reducing Graduation 'Early game nerf' duration by 75%"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },   
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },
        },
        96: {
            name: "Tetrate IV",
            done() {return player.r.tetration.gte(9)},
            tooltip() {return "Reach 9 tetration <br> Reward : Unlock Energy in Twilight research"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(4)}, 
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        97: {
            name: "Many Exponent",
            done() {return player.e.effective.gte("280")},
            tooltip() {return "Reach 280 effective exponent <br> QOL : Exponent no longer resets anything and become automated"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        }, 
        98: {
            name: "Meta challenger 0",
            done() {return inChallenge('r',11)},
            tooltip() {return "Enter a MR challenge"},
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        99: {
            name: "Too slow",
            done() {return inChallenge('r',11) && player.r.c3.gte(8) && player.r.mastery.gte(1500)},
            tooltip() {
                return options.hidemastery?"Enter a MR challenge with Frozen time 8 and try completing it <br> Reward : 2x Gamespeed":"Achieve "+format(1500)+" Mastery inside of a MR challenge with Frozen Time 8 <br> Reward : 2x Gamespeed</i>"
            },
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        101: {
            name: "Insane Age",
            done() {return player.r.prestigetime.gte("315360000")},
            tooltip() {
                let base = "Reach 10 years worth of Prestige time <br> Reward : Increase Gamespeed by +2.5% per year of Prestige time you have (Currently : x"+format(this.effect(),3)+" , up to x2.5)"
                if(player.ac.super.includes(toNumber(this.id))) base = "(Charged) Reach 10 years worth of Prestige time <br> Reward : Increase Gamespeed by +50% per digit of Prestige time , and +150% extra (in year) = x"+format(this.effect())+""
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base = "(ifCharged) Reach 10 years worth of Prestige time <br> Reward : Increase Gamespeed by +50% per digit of Prestige time , and +150% extra (in year)"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },   
            effect() {
                let f = player.r.prestigetime.div(31536000).floor().times(0.025).add(1).min(2.5)
                if(hasSuperAchievement('ac',101)) f = d(2.5).add(player.r.prestigetime.div(31536000).add(1).log(10).div(2))
                return f
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        102: {
            name: "Meta challenger 1",
            done() {return inChallenge('r',11) && player.r.mastery.gte(10000)},
            tooltip() {
                let base = "Complete a meta research challenge <br> Reward : Challenge shard boosts Dark Subtractive (twilight) gain (Currently : x"+format(this.effect())+")"
                if(player.ac.super.includes(toNumber(this.id))) base += "<br> (Charged)"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base += "<br> (ifCharged) Effect increased to x"+format(this.effect().pow(4))+""
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },   
            effect() {
            let eff = player.r.challengeshard
            if(hasSuperAchievement('ac',102)) eff = eff.times(4)
            return d(1.25).pow(eff)
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        103: {
            name: "Condensed upgrade",
            done() {return player.r.buyables[121].gte(1)},
            tooltip() {
                let base = "Condense your upgrade <br> Reward : -25 raw Tetration cost <br><i> raw Tetration cost is applied after all Tetration cost multiplier , divisor , etc <i>"
                if(player.ac.super.includes(toNumber(this.id))) base = "(Charged) Condense your upgrade <br> Reward : -25 raw Tetration cost and +1 max Tetration"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base = "(ifCharged) Condense your upgrade <br> Reward : -25 raw Tetration cost and +1 max Tetration"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },   
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        }, 
        104: {
            name: "Tetration V",
            done() {return player.r.tetration.gte(10)},
            tooltip() {
                let base = "Reach 10 tetration <br> Reward : 'More letter' improvement is weakened but provides multiplicative boost instead"
                if(player.ac.super.includes(toNumber(this.id))) base = "(Charged) Reach 10 tetration <br><i>'More letter' improvement is weakened but provides multiplicative boost</i> , smaller exponental boost to other Improvement instead"
                if(player.ac.super.includes(toNumber(this.id))) return base
                if(this.chargeUnl() && !player.ac.super.includes(toNumber(this.id))) base = "(ifCharged) Reach 10 tetration <br><i>'More letter' improvement is weakened but provides multiplicative boost</i> , smaller exponental boost to other Improvement instead"
                return base
            },
            chargeUnl() {return !player.ac.super.includes(toNumber(this.id)) && player.g.sacrificeactive[5].gte(1) && player.g.chargeToken.gt(0)},
            chargeCan() {return true},
            style() {
                if(player.ac.super.includes(toNumber(this.id))) return Qcolor3('purple')
                else return Qcolor3('aqua')
            },   
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        105: {
            name: "Twilight master",
            done() {return player.r.twilight.gte("1e27")},
            tooltip() {return "Have "+format(1e27)+" twilight <br> Reward : Automaticly buy Twilight(s) buyables at no cost"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        106: {
            name: "Almost forgotten!",
            done() {return player.al.points.gte("1e80")},
            tooltip() {return "Reach "+format(1e80)+" Algebric (algebra field)"},
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        
        107: {
            name: "Meta-hoarder",
            done() {return player.r.metaresearch.gte(5)},
            tooltip() {return "Have 5 MR <br> Reward : x1.2 twilight reward strength"},
            style() {
                return Qcolor3('aqua')
                
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

          
        }, 
        108: {
            name: "Meta challenger 2",
            done() {return inChallenge('r',11) && player.r.mastery.gte("10000") && player.r.potshard.gte(8)},
            tooltip() {return "Complete a meta research challenge with 8 total modifier level"},
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        109: {
            name: "The End?",
            done() {return d(player.ac.achievements.filter(x => x<1000).length).gte(80) && player.r.bestmastery.gte(35000)},
            tooltip() {return "Complete at least 80 achievements (You have done "+format(player.ac.achievements.filter(x => x<1000).length,0)+") and "+format(35000)+" Mastery <br> Reward : Graduation task can now be attempted"},
            style() {
                return Qcolor3('aqua')
            },
            unlocked() {return player.ac.r.eq(4)},
            ttStyle() {
                return {
                    "color":"pink",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },

        },
        //Graduation II
        111: {
            name: "Graduated",
            done() {return player.g.rank.gte("2")},
            tooltip() {return "Advance your Graduation rank to II <br> Reward : Total achievement completed powers Ticks gain (Currently : ^"+format(this.effect(),4)+") , Secret achievements are excluded "},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
            effect() {
                return d(player.ac.achievements.filter(x => x<1000).length).root(12.5)
            },


        },
        112: {
            name: "Isn't that ...",
            done() {return player.g.ud.gte("1")},
            tooltip() {return "Unlock Bits <br> QOL : Research resets no longer reset anything <br> Other : You will no longer recieve popup from Research milestones"},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
        },
        113: {
            name: "Bits I",
            done() {return player.g.bits.gte("10")},
            tooltip() {return "Reach 10 Bits"},
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        
        114: {
            name: "Bits II",
            done() {return player.g.bits.gte("1000")},
            tooltip() {return "Reach "+format(1000)+" Bits "},
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        115: {
            name: "Tetration VI",
            done() {return player.r.tetration.gte("15")},
            tooltip() {
                if(player.r.buyables[1101].eq(0)) return "Reach 15 Tetration <br> <s>Reward : +"+format(this.effect())+"% (based on Tetration and failed attempt) <br> for any Meta-reset to give 2x reward and reset nothing</s> <br> Effect disabled due to Metabit respec on Meta-resets"
                else return "Reach 15 Tetration <br> Reward : +"+format(this.effect())+"% (based on Tetration and failed attempt) <br> for any Meta-reset to give 2x reward and reset nothing "
            },
            style() {
                if(player.r.buyables[1101].eq(0)) return Qcolor3('red')
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
            effect() {
                return d(1).sub(d(1).div(player.r.tetration.add(1).pow(0.1))).times(100).times(d(1.1).pow(player.r.failedattempt))
            }
        },
        116: {
            name: "Bits III",
            done() {return player.g.totalmetabits.gte("1")},
            tooltip() {return "Obtain 1 metabits (total)<br> Reward : Total Metabit boosts Bits gain by x"+format(this.effect())+""},
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                return (player.g.totalmetabits.add(1)).root(1.5)
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        117: {
            name: "Bits IV",
            done() {return player.g.totalmetabits.gte("5")},
            tooltip() {return "Obtain 5 metabits (total) <br> Reward : -20 raw Tetration cost"},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
        },
        118: {
            name: "Tetration VII",
            done() {return player.r.tetration.gte("18")},
            tooltip() {return "Reach 18 Tetration <br> Reward : Current Prestige time multiply Tickspeed by "+format(this.effect())+"x (capped at "+format(d("1e100"))+"x)"},
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                return (player.r.prestigetime.add(10)).log(10).tetrate(2).min("1e100")
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        119: {
            name: "Bits V",
            done() {return player.g.totalmetabits.gte("10")},
            tooltip() {return "Obtain 10 metabits (total) <br> Reward : +1 Enmetalized Bits capacity & conversion"},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        121: {
            name: "Meta-challenger 3",
            done() {return player.r.potshard.gte(15) && inChallenge('r',11) && player.r.mastery.gte(10000)},
            tooltip() {return "Complete a MR challenge with 15 modifier level <br> Reward : Current challenge shard also provides "+format(this.effect())+"x Gamespeed"},
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                return (player.r.challengeshard.max(0).add(1)).pow(0.25)
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
        },
        122: {
            name: "Meta-challenger 4",
            done() {return player.r.potshard.gte(25) && inChallenge('r',11) && player.r.mastery.gte(10000)},
            tooltip() {return "Complete a MR challenge with 25 modifier level <br> Reward : Increase your Tetration limit by +1 every 14 Challenge shard (+"+formatWhole(this.effect())+" to max Tetration)"},
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                return (player.r.challengeshard.div(14)).floor()
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
        },
        123: {
            name: "Meta-challenger 5",
            done() {return player.r.potshard.gte(32) && inChallenge('r',11) && player.r.mastery.gte(10000)},
            tooltip() {return "Complete a MR challenge with 32 modifier level <br> Reward : All altered realm resource achievements are stronger , bonus may varies"},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
        },
        124: {
            name: "Meta-challenger 6",
            done() {return player.r.potshard.gte(40) && inChallenge('r',11) && player.r.mastery.gte(10000)},
            tooltip() {return "Complete a MR challenge with 40 modifier level <br> Reward : Add a variable Y into Algebric function , which increase the multiplier per Coefficients/Variable purchase"},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
        },
        125: {
            name: "Halfway-done?",
            done() {return inChallenge('e',13) && getPointGen().gte("1e220")},
            tooltip() {return "Reach "+f(d("e220"))+" Points gain/s inside of 'No Basic' challenge <br> Reward : 'Reduced bonus requirement' (Extension) max level is increased by +3"},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        126: {
            name: "Improving Operator",
            done() {return player.al.operation.gte("1e600")},
            tooltip() {
                return "Reach "+f(d("e600"))+" Operation <br> Reward : ^1.5 to base Operation gain per digit of unspent MR , minus 1 <br> Currently : ^"+format(this.effect())+" , effect nerfed above ^8" 
            },
            effect() {
                let base = d(1.5).pow(player.r.metaresearch.max(1).log(10).floor())
                if(base.gte(8)) base = base.times("1.25e7").log(10)
                return base
            },
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
        },
        127: {
            name: "Fast graduator",
            done() {return player.g.fastest.lte(1200)},
            tooltip() {return "Perform Graduate in 20 minutes or less (Your fastest graduation is : "+formatTime(player.g.fastest)+") <br> Reward : Gain "+format(this.effect())+"% more gamespeed <br><i>(Reward is inversely proportional to fastest graduation , up to +40%)"},
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                return d(4800).div(player.g.fastest.max(120)).max(2)
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        128: {
            name: "Number inflation",
            done() {return player.n.points.gte("1e12800") && getBuyableAmount('r',103).eq(0)},
            tooltip() {return "Have "+f(d("e12800"))+" Number without any 'More Equality' improvement <br> Reward : <i> Balance (Equalize) the effect of 'Fastest Automation' and 'Stronger Subtractive' upgrade so that their product remain the same </i><br> which Slightly increase Additive and Subtractive cost reduction"},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        129: {
            name: "Useless variable?",
            done() {return player.al.points.gte("1e195")},
            tooltip() {return "Have "+format(d("1e195"))+" Algebric <br> Reward : 2 more Algebric upgrades"},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        131: {
            name: "Many Exponent 2",
            done() {return player.e.points.gte(150)},
            tooltip() {return "Obtain 150 Exponent (not effective exponent) <br> Reward : Perk Power gain is 1.05x faster per Exponent (not effective exponent) <br> (Currently : "+format(this.effect())+"x)"},
            effect() {
                return d(1.05).pow(player.e.points)
            },
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        132: {
            name: "Masterful",
            done() {return player.r.bestmastery.gte("100000")},
            tooltip() {return options.hidemastery?"Just wait , i guess":"Reach "+format(d("100000"))+" Mastery"},
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
        },
        133: {
            name: "Speed limit",
            done() {return tmp.t.effect.clampMax(player.t.cap).gte("1e1000")},
            tooltip() {return "Reach "+f(d("e1000"))+" Tickspeed <br><i> Tickspeed is capped at 1e1000 </i><br> Reward : Each level of 'Light additive generator' buyable raise the cost of 'Light additive multiplier' buyable by ^0.95 <br> (Currently : ^"+format(this.effect())+")"},
            effect() {
                return d(0.95).pow(getBuyableAmount('r',201))
            },
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
        },
        134: {
            name: "Deep darkness",
            done() {return tmp.t.effect.gte("1e750") && inChallenge('al',11)},
            tooltip() {return "Reach "+f(d("e750"))+" Tickspeed but while Altered <br> Reward : Each level of 'Light additive generator' buyable raise the cost of 'Dark subtractive powerer' buyable by ^0.95 <br> (Currently : ^"+format(this.effect())+")"},
            effect() {
                return d(0.95).pow(getBuyableAmount('r',301))
            },
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)}, 
        },
        135: {
            name: "Imbalanced",
            done() {return tmp.t.effect.gte("1e350") && inChallenge('r',11) && player.r.potshard.gte(64)},
            tooltip() {return "Reach "+f(d("e350"))+" Tickspeed , in MR challenge with 64 modifier level <br> Reward : 'Twilight booster' buyable effect is slightly stronger"},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        136: {
            name: "Power supplier",
            done() {return player.r.energy.gte("1e1000")},
            tooltip() {return "Reach "+f(d("e1000"))+" Energy <br> Reward : 'Energy booster' buyable effect is more powerful"},
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        137: {
            name: "Simplification",
            done() {return player.r.mastery.gte(50000) && player.r.tetration.lte(8)},
            tooltip() {return "Reach "+f(50000)+" Mastery without having more than 8 Tetration this Graduation" },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},             
            effect() {
                return
            }
        },
        138: {
            name: "Divider provider",
            done() {return player.d.points.gte("1e9001") && player.g.timer2.eq(player.r.timer2) && player.g.sacrificeactive[0].eq(0)},
            tooltip() {
                let a = "<br>Checking : Failed"
                if(player.g.timer2.eq(player.r.timer2)) a = "<br>Checking : Still possible"
                if(hasAchievement(this.layer,this.id)) a = ""
                let b = "or inside Number sacrifice"
                if(!hasAchievement('ac',139)) b = ""
                return "Obtain "+format(d("1e9001"))+" Divisive without having Meta-resets , entering Altered realm this Graduation "+b+" "+a+" <br> Reward : 'Worsen condition' challenge reward is increased from ^1.25 to ^1.4"
            },
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},        
         },
        139: {
            name: "Sacrificial",
            done() {return hasUpgrade('n',71)},
            tooltip() {
                return "Unlock Graduation sacrifice <br> Unlock the next page of achievement "
            },
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },
            unlocked() {return player.ac.r.eq(5)},         
        },
        141: {
            name: "A brutal world I",
            done() {return (player.g.SacrificeUnlock[0]).gte(1)},
            tooltip() {return "Unlock the first sacrifice (S1) <br> On reset , gain 1 extra Graduate every "+f(d("5e4"))+" Mastery" },
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
            effect() {
                return
            }
        },
        142: {
            name: "Weaken producer I",
            done() {return player.g.sacrificeactive[0].gte(1)},
            tooltip() {return "Enter Number sacrifice (S1)" },
            unlocked() {return player.ac.r.eq(6)},
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        143: {
            name: "Weaken producer II",
            done() {return player.g.sacrificeactive[0].gte(1) && player.n.points.gte("1e2000")},
            tooltip() {return "Enter Number sacrifice (S1) and reach "+format(d("1e2000"))+" Number <br> Reward : Improved the (S1) effect based on highest Number in (S1) , upward of "+fde(4000)+" Number <br> Currently : ^"+format(d(1).div(this.effect().log(10)),4)+"" },
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
            effect() {
                if(!hasAchievement('ac',143)) return d(10)
                return d(9).times(d(0.8).pow(player.g.s1best.min("1e4000").add(10).log(10).div(1000))).add(1)
            }
        },
        144: {
            name: "A brutal world II",
            done() {return player.g.SacrificeUnlock[1].gte(1)},
            tooltip() {return "Unlock the second sacrifice (S2) <br> Reward : +50 Artifact quality" },
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
            effect() {
                return
            }
        },
        145: {
            name: "Incredible age",
            done() {return player.r.prestigetime.gte(d("7e17").div(22).times(13.678))},
            tooltip() {return "Reach "+formatTime(d("7e17").div(22).times(13.678))+" worth of Prestige time <br> Prestige time boosts Operation gain (x"+format(this.effect())+")" },
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
            effect() {
                return player.r.prestigetime.pow(2).max(1)
            }
        },
        146: {
            name: "Tetration VIII",
            done() {return player.r.tetration.gte(23)},
            tooltip() {return "Reach 23 Tetration <br> QOL : If Tetration cost is less than 100 , instantly purchase it without performing any reset"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        147: {
            name: "Infinite Ticks 2",
            done() {return player.t.points.gte("1e50")},
            tooltip() {return "Obtain "+format(d("1e50"))+" Ticks <br>"},
            unlocked() {return player.ac.r.eq(6)}, 
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        148: {
            name: "Never again",
            done() {return player.g.SacrificeUnlock[2].gte(1)},
            tooltip() {return "Unlock the third sacrifice (S3) <br> QOL : Autobuy all Improvements outside of their respective challenge (Disabled in all Graduation sacrifice) , requiring at least 4 Research"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        149: {
            name: "New milestone??",
            done() {return player.g.sacrificeactive[2].gte(1) && hasMilestone('g',2)},
            tooltip() {return "Achieve 2 milestones in Time sacrifice (S3)<br> Reward : Each S3 milestone add 2.5% to Twilight perk strength , currently : +"+format(this.effect())+"%"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                return d(player.g.milestones.length).times(2.5)
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        151: {
            name: "Masterful II",
            done() {return player.r.bestmastery.gte("170000")},
            tooltip() {return "Achieve "+format(170000)+" Mastery"},
            unlocked() {return player.ac.r.eq(6)}, 
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        152: {
            name: "Crystallized",
            done() {return player.r.buyables[601].gte(15)},
            tooltip() {return "Have 15 Twilight crystal <br> Reward : Each 'Twilight crystal' make Perk power increase by x4 faster per <br> Currently : x"+f(this.effect())+""},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                return d(4).pow(player.r.buyables[601])
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        153: {
            name: "Energy flow",
            done() {return player.r.buyables[501].gte(1000)},
            tooltip() {return "Have "+format(1000)+" Energy booster buyable level <br> <i> QOL : Unlock Bulk-buying for Energy buyables , bulk is 5% of its original level , rounded down </i> <br> Reward : 'Energy conductor' (buyable) is significantly stronger"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        154: {
            name: "Energetic power",
            done() {return player.r.energy.gte("1e10000")},
            tooltip() {return "Obtain  "+format(d("1e10000"))+" Energy <br> Reward : Unspent MR boosts Energy gain <br> Currently : "+f(this.effect())+"x <br> (capped at "+f(d("1e3000"))+"x at "+f(1506630)+" MR)"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                let b = d(10).times(player.r.metaresearch.add(10).log(10)).pow(1.5)
                let a = player.r.metaresearch.add(2).pow(b)
                return a.min("1e3000")
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        155: {
            name: "Powerful researcher",
            done() {return player.r.points.gte(28) && player.r.timer2.lte(2.5)},
            tooltip() {return "Obtain 28 Research within 2.5s of a Meta-reset <br> Reward : Automaticly buy Research"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        156: {
            name: "Empowered variables",
            done() {return player.al.y.gte("1e21")},
            tooltip() {
            let base = "Reach "+f(d("e21"))+" variable Y value <br> QOL : Automate variable Y buyables <br> Reward : Variable Y raises the value of B <br>(Currently : ^"+f(this.effect())+")"
            return base
            },
            unlocked() {return player.ac.r.eq(6)}, 
            effect() {
                let a = player.al.y.max(10)
                let b = a.log(10).div(2).root(3).add(1) 
                return b
            },
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        157: {
            name: "Algebra Mastery I",
            done() {return player.al.points.gte("1e400")},
            tooltip() {return "Reach "+f(d("e400"))+" Algebric"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        158: {
            name: "Realm Explorer",
            done() {return player.g.s4best.gte(2)},
            tooltip() {return "Reach depth 2 of Altered realm <br> Reward : All Exponent upgrade cost is 10 less (cannot be negative)"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        159: {
            name: "Bits VI",
            done() {return player.g.totalmetabits.gte(80)},
            tooltip() {return "Have 80 total Metabits <br> Reward : Metabits and Mastery boost Prestige time gain <br> Effect : "+f(this.effect())+"x"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                let time = player.r.mastery.add(10).root(10)
                let mb = player.g.totalmetabits.add(10).log(10)
                return mb.pow(time)
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        161: {
            name: "Generational hoarder",
            done() {return player.g.points.gte(100)},
            tooltip() {return "Have 100 Graduate <br> Reward : Unspent Graduate improve Artifact Quality , up to +100  <br> Improved : +"+format(this.effect(),0)+" Artifact Quality"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                return player.g.points.root(3).times(10).add(4).floor().min(100)
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        162: {
            name: "Points overload",
            done() {return player.points.gte("e15000")},
            tooltip() {return "Obtain "+f(d("e15000"))+" Points <br> Reward : +2 Enmetalized Bits capacity and conversion"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                return player.g.points.root(3).times(10).add(4).floor().min(100)
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        163: {
            name: "No higher study?",
            done() {return player.n.points.gte("1e12000") && player.m.points.eq(0) && player.d.points.eq(0)},
            tooltip() {return "Reach "+f(d("e12000"))+" Numbers without having any Multiplicative , Divisive <br> Reward : Multiplicative reduces Exponent cost by /"+f(this.effect())+""},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            effect() {
                let exponent = player.m.points.add(10).log(10).add(10).log(10).div(15)
                return player.m.points.add(1).pow(exponent)
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        164: {
            name: "Master of Slowness",
            done() {return player.r.truegamespeed.lte("1e-6") && player.r.mastery.gte(100000)},
            tooltip() {return "Reach "+f(100000)+" Mastery while having less than "+f(d("1e-6"))+" Gamespeed multiplier  <br> Reward : Exponent cost scaling base is 5% less"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        165: {
            name: "Long-lasting Milestone",
            done() {return hasMilestone('g',8)},
            tooltip() {return "Complete the eighth ("+f(300000)+" Mastery) milestone in S3"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        166: {
            name: "Super Equality",
            done() {
                let add = player.a.points.floor().max(1)
                let a2 = player.s.points.floor().eq(add)
                let a3 = player.e.points.floor().eq(add)
                return a2 && a3 && player.g.sacrificeactive[0].gte(1)
            },
            tooltip() {return "Have Additive , Exponent and Subtractive amount equal to each other (must be greater than 0) while inside Equality challenge <br> You must also enter Number sacrifice <br> Reward : Additive and Subtractive to Mastery formula is slightly improved , around 10% more Mastery"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        167: {
            name: "Operation-insanity",
            done() {
                return player.al.operation.gte(d("e2000"))
            },
            tooltip() {return "Reach "+fde(2000)+" Operation"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        168: {
            name: "Over-tier upgrade",
            done() {
                return player.al.extension.gte(d("e300"))
            },
            tooltip() {return "Reach "+fde(300)+" Extension"},
            unlocked() {return player.ac.r.eq(6)}, 
            style() {
                return Qcolor3('')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        169: {
            name: "Powerful charges",
            done() {
                return d(player.ac.super.length).gte(9)
            },
            tooltip() {return "Charge 9 achievements <br> Current endgame"},
            unlocked() {return player.ac.r.eq(6)}, 
            onComplete() {
                player.subtabs.c.curses = "Cursed realm"
            },
            style() {
                return Qcolor3('aqua')
            },
            ttStyle() {
                return {
                    "color":"#b3c3f5",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"indigo",
                }
            },
        },
        //secret
        1001: {
            name: "[s]Powerpoint simulation",
            done() { return pastTickTimes[0] >= 250},
            goalTooltip: "Hint : 4fps game",
            doneTooltip: "Goal : Have a frame that lasts at least 250ms",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
        1002: {
            name: "[s]Wrong combination",
            done() { return inChallenge('e',12) && inChallenge('d',11) },
            goalTooltip: "Hint : Oops , mouse slipped",
            doneTooltip: "Goal : You accidently enter 'No counting' instead of 'Worsen condition' for the challenge requirement.",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },        
        },
        1003: {
            name: "[s]How the table have turned",
            done() { return getMult().lt(getExp()) },
            goalTooltip: "Hint : Points multiplier is usually lower than Points exponent",
            doneTooltip: "Goal : Have points multiplier be less than points exponent",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
        1004: {
            name: "[s]The patience",
            done() { return player.t.tickspeedcontrol.neq(0) && player.t.tickspeedcontrol.pow(-1).gte("1e1000") },
            goalTooltip: "Hint : What can be controlled?",
            doneTooltip: "Goal : Have your tickspeed be raised to ^1e-1000 or lower . But not ^0",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
        1005: {
            name: "[s]Cruelity",
            done() { return player.r.potshard.gte(64) && inChallenge('e',12) && inChallenge('d',13) && inChallenge('r',11) },
            goalTooltip: "Hint : Hinder progression as much as possible <br> Hint 2 : Only Graduation I resources need to be used",
            doneTooltip: "Goal : Enter a MR challenge with max modifier level , 'No Number' challenge and 'Chaotic division' challenge at once",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
        1006: {
            name: "[s]Broken calculation",
            done() { return player.g.metabits.lt(0) || options.instantcalculation },
            goalTooltip: "Hint : Buying way too fast",
            doneTooltip: "Goal : Buying Metabits buyable so fast that your Metabits is negative",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
        1007: {
            name: "[s]Absolute precision",
            done() { return player.o.gsbase.floor().eq(1000000) },
            goalTooltip() {return "Hint : 1% , 5% , -1% , -5%? and ... "+fde(6)+"x?"},
            doneTooltip() {return "Goal : Using the gamespeed factor button to reach a speed up multiplier of exactly "+fde(6)},
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
        1008: {
            name: "[s]",
            done() { return player.points.gte(3600) && getMult().eq(1) && player.r.truegamespeed.eq(1) },
            goalTooltip: "Hint : Extreme waiting",
            doneTooltip() {return "Goal : Get "+format(3600)+" points , with a Points and Gamespeed multiplier of x1"},
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
        1009: {
            name() {return "[s]Misfortunate"},
            done() { 
                let date = new Date()
                return (date.getDate() === 13 && date.getDay() === 5) },
            goalTooltip() { 
                return "Hint : Paraskevidekatriaphobia"},
            doneTooltip: "Goal : Play the game on Friday the 13th (in your local time zone)",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
        1011: {
            name: "[s]Technically correct",
            done() { return false },
            goalTooltip: "Hint : You followed the instruction",
            doneTooltip: "Goal : You imported 'save' as instructed",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
        1012: {
            name: "[s]Grand balance",
            done() { return player.r.mastery.times(50).floor().div(50).eq(1) && inChallenge('r',11) && !player.g.sacrificeactive[6].gte(1)},
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
            goalTooltip() {return options.hidemastery?"Hint : No hint":player.g.sacrificeactive[6].gte(1)?"Hint : You have satisfied some important condition , though some external factors hinder your ability to obtain this achievement":"Hint : The balance of the multiplier and divider of Mastery shall be the key."},
            doneTooltip() {return options.hidemastery?"Goal : I have no idea how did you get this achievement":"Goal : Have roughly 1 Mastery (within 0.98 to 1.02 is acceptable) . Moreover , your mastery must be divided by some external source ; You cannot do this in Challenge sacrifice"},        
        },
        1013: {
            name: "[s]Unintended feature",
            done() { return player.r.buyables[105].gte(1) && !inChallenge('al',11) && !hasUpgrade('r',106)},
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
            goalTooltip() {return hasUpgrade('r',106)?"By purchasing some upgrades , you have forfeited the right to obtain this achievement!":"Hint : Try to create Altered realm with some upgrade"},
            doneTooltip: "Goal : Buy 'Operation' improvement outside of altered realm <br> This is done while enter 'No Number' and 'Worsen condition' and having the upgrade 'Operationless'",
        },
        1014: {
            name: "[s] Knife edge",
            done() { return false},
            goalTooltip() {return "Hint : Nothing will be left after this"},
            doneTooltip() {return "Goal : Type in the prompt to hard reset AND CONFIRM , but it didn't work"},
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
        1015: {
            name: "[s] Puzzled",
            done() { return false },
            goalTooltip: "Hint : I'm a digital promise , a catchy refrain, <br> A video's embrace, where joy and surprise reign.<br> I've lured countless clicks, a playful deceit <br> A pop culture icon, a memorable feat <br> What am I?",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
            doneTooltip: "Goal : Input the youtube link to a video of the original rick-roll video (https://www.youtube.com/watch?v=dQw4w9WgXcQ) to your save input",
        },
        1016: {
            name: "[s]What did you expected",
            done() { return getBuyableAmount('r',113).gt(0) },
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
            goalTooltip() {return "Hint : Pay more attention when reading"},
            doneTooltip() {return "Goal : You clicked the 'get a free secret achievement' button  <br> You can now safely perform Meta-reset now"},
        },
        1017: {
            name: "[s]Reverse time",
            done() { return player.o.gsbase.lte(-1) },
            goalTooltip: "Hint : Negative time , what is that?",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
            doneTooltip: "Goal : Set your Gamespeed multiplier to a negative number",
        },
        1018: {
            name: "[s]Nothing happened",
            done() { return player.r.potshard.eq(0) && player.r.mastery.gte("10000") && inChallenge('r',11)},
            goalTooltip: "Hint : Question your decision to torture yourself for no benefits", 
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
            doneTooltip: "Goal : Complete a Meta-research challenge with no modifier , giving no reward.",
        },
        1019: {
            name() {return "[s]Luckiness"},
            done() { return options.randomNumber === 100 && options.DD === "Random number"},
            goalTooltip: "Hint : Hope that luck is on your side",
            doneTooltip: "Select 'Random number' additional display option and roll exactly 100",
            ttStyle() {
                return {
                    "color":"#AAAAAA",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },   
        },
    },
    microtabs: {
        stuff: {
        },
graduation: {
    "Achievements" : {
        unlocked() {return true},
        content: [
            ["blank","25px"],
            ["row",[["buyable",11],["buyable",12]]],
            ["blank","15px"],
            ["raw-html", function () { return player.g.sacrificeactive[5].gte(1)?"<h3> You can charge up "+format(player.g.chargeToken,0)+" more Graduation I achievement (Total : "+format(player.g.s6best,0)+"/40)":"" }, { "color": "aqua", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(1)?"<h3>Pre-research achievement":"" }, { "color": "pink", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(2)?"<h3>Research achievement":"" }, { "color": "red", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(3)?"<h3>Altered achievement":"" }, { "color": "lime", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(4)?"<h3>Meta-research achievement":"" }, { "color": "purple", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(5)?"<h3>Graduation II achievement":"" }, { "color": "white", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(5)?"<h3>Every completed achievement additionally increases Graduate gain by 4% <br> (Currently : "+format(player.ac.achievements.filter(x => x>=111 && x<=139).length * 0.04 + 1,2)+"x)":"" }, { "color": "white", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(6)?"<h3>Graduation sacrifice achievement":"" }, { "color": "aqua", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(6)?"<h3>Every completed achievement additionally increases Graduate and Bits gain by 3% <br> (Currently : "+format(player.ac.achievements.filter(x => x>=141 && x<=169).length * 0.03 + 1,2)+"x)":"" }, { "color": "aqua", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(7)?"<h3>Cursed realm achievement":"" }, { "color": "brown", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(7)?"<h3>":"" }, { "color": "brown", "font-size": "18px"}],
            ["blank","15px"],
            ["raw-html", function () { return player.ac.r.eq(3)?"<h3>* You must complete these achievement inside of Altered realm * <br>* The second row cannot be completed until you have 6 or more Tetration *":"" }, { "color": "lime", "font-size": "18px"}],
            ["raw-html", function () { return player.ac.r.eq(7)?"<h3>In Cursed realm ":"" }, { "color": "brown", "font-size": "18px"}],
            ["blank","15px"],
            ["row", [["achievement", 11], ["achievement", 12], ["achievement", 13], ["achievement", 14], ["achievement", 15], ["achievement", 16], ["achievement", 17], ["achievement", 18], ["achievement", 19]]],
            ["row", [["achievement", 21], ["achievement", 22], ["achievement", 23], ["achievement", 24], ["achievement", 25], ["achievement", 26], ["achievement", 27], ["achievement", 28], ["achievement", 29]]],
            ["row", [["achievement", 31], ["achievement", 32], ["achievement", 33], ["achievement", 34], ["achievement", 35], ["achievement", 36], ["achievement", 37], ["achievement", 38], ["achievement", 39]]],
            ["row", [["achievement", 41], ["achievement", 42], ["achievement", 43], ["achievement", 44], ["achievement", 45], ["achievement", 46], ["achievement", 47], ["achievement", 48], ["achievement", 49]]],
            ["row", [["achievement", 51], ["achievement", 52], ["achievement", 53], ["achievement", 54], ["achievement", 55], ["achievement", 56], ["achievement", 57], ["achievement", 58], ["achievement", 59]]],
            ["row", [["achievement", 61], ["achievement", 62], ["achievement", 63], ["achievement", 64], ["achievement", 65], ["achievement", 66], ["achievement", 67], ["achievement", 68], ["achievement", 69]]],
            ["row", [["achievement", 71], ["achievement", 72], ["achievement", 73], ["achievement", 74], ["achievement", 75], ["achievement", 76], ["achievement", 77], ["achievement", 78], ["achievement", 79]]],
            ["row", [["achievement", 81], ["achievement", 82], ["achievement", 83], ["achievement", 84], ["achievement", 85], ["achievement", 86], ["achievement", 87], ["achievement", 88], ["achievement", 89]]],
            ["row", [["achievement", 91], ["achievement", 92], ["achievement", 93], ["achievement", 94], ["achievement", 95], ["achievement", 96], ["achievement", 97], ["achievement", 98], ["achievement", 99]]],
            ["row", [["achievement", 101], ["achievement", 102], ["achievement", 103], ["achievement", 104], ["achievement", 105], ["achievement", 106], ["achievement", 107], ["achievement", 108], ["achievement", 109]]],
            ["row", [["achievement", 111], ["achievement", 112], ["achievement", 113], ["achievement", 114], ["achievement", 115], ["achievement", 116], ["achievement", 117], ["achievement", 118], ["achievement", 119]]],
            ["row", [["achievement", 121], ["achievement", 122], ["achievement", 123], ["achievement", 124], ["achievement", 125], ["achievement", 126], ["achievement", 127], ["achievement", 128], ["achievement", 129]]],
            ["row", [["achievement", 131], ["achievement", 132], ["achievement", 133], ["achievement", 134], ["achievement", 135], ["achievement", 136], ["achievement", 137], ["achievement", 138], ["achievement", 139]]],
            ["row", [["achievement", 141], ["achievement", 142], ["achievement", 143], ["achievement", 144], ["achievement", 145], ["achievement", 146], ["achievement", 147], ["achievement", 148], ["achievement", 149]]],
            ["row", [["achievement", 151], ["achievement", 152], ["achievement", 153], ["achievement", 154], ["achievement", 155], ["achievement", 156], ["achievement", 157], ["achievement", 158], ["achievement", 159]]],
            ["row", [["achievement", 161], ["achievement", 162], ["achievement", 163], ["achievement", 164], ["achievement", 165], ["achievement", 166], ["achievement", 167], ["achievement", 168], ["achievement", 169]]],
            ["row", [["achievement", 171], ["achievement", 172], ["achievement", 173], ["achievement", 174], ["achievement", 175], ["achievement", 176], ["achievement", 177], ["achievement", 178], ["achievement", 179]]],
            ["row", [["achievement", 181], ["achievement", 182], ["achievement", 183], ["achievement", 184], ["achievement", 185], ["achievement", 186], ["achievement", 187], ["achievement", 188], ["achievement", 189]]],
            ["row", [["achievement", 191], ["achievement", 192], ["achievement", 193], ["achievement", 194], ["achievement", 195], ["achievement", 196], ["achievement", 197], ["achievement", 198], ["achievement", 199]]],
            ["row", [["achievement", 201], ["achievement", 202], ["achievement", 203], ["achievement", 204], ["achievement", 205], ["achievement", 206], ["achievement", 207], ["achievement", 208], ["achievement", 209]]],
            ["row", [["achievement", 211], ["achievement", 212], ["achievement", 213], ["achievement", 214], ["achievement", 215], ["achievement", 216], ["achievement", 217], ["achievement", 218], ["achievement", 219]]],
            ["row", [["achievement", 221], ["achievement", 222], ["achievement", 223], ["achievement", 224], ["achievement", 225], ["achievement", 226], ["achievement", 227], ["achievement", 228], ["achievement", 229]]],
            ["row", [["achievement", 231], ["achievement", 232], ["achievement", 233], ["achievement", 234], ["achievement", 235], ["achievement", 236], ["achievement", 237], ["achievement", 238], ["achievement", 239]]],
            ["row", [["achievement", 241], ["achievement", 242], ["achievement", 243], ["achievement", 244], ["achievement", 245], ["achievement", 246], ["achievement", 247], ["achievement", 248], ["achievement", 249]]],
            ["row", [["achievement", 251], ["achievement", 252], ["achievement", 253], ["achievement", 254], ["achievement", 255], ["achievement", 256], ["achievement", 257], ["achievement", 258], ["achievement", 259]]],
            ["row", [["achievement", 261], ["achievement", 262], ["achievement", 263], ["achievement", 264], ["achievement", 265], ["achievement", 266], ["achievement", 267], ["achievement", 268], ["achievement", 269]]],
            ["row", [["achievement", 271], ["achievement", 272], ["achievement", 273], ["achievement", 274], ["achievement", 275], ["achievement", 276], ["achievement", 277], ["achievement", 278], ["achievement", 279]]],
            ["row", [["achievement", 281], ["achievement", 282], ["achievement", 283], ["achievement", 284], ["achievement", 285], ["achievement", 286], ["achievement", 287], ["achievement", 288], ["achievement", 289]]],
            ["row", [["achievement", 291], ["achievement", 292], ["achievement", 293], ["achievement", 294], ["achievement", 295], ["achievement", 296], ["achievement", 297], ["achievement", 298], ["achievement", 299]]],
            ["row", [["achievement", 301], ["achievement", 302], ["achievement", 303], ["achievement", 304], ["achievement", 305], ["achievement", 306], ["achievement", 307], ["achievement", 308], ["achievement", 309]]],

        ]
        
    },
    "Secret achievements" : {
        buttonStyle() {return {'color' : 'gray' , 'border-color' : 'gray'}},
        unlocked() {return true},
        content: [
            ["raw-html", function () { return "<h3><i>Secret achievement</i> requirement is hidden until you discovered them (there is hint for them)" }, { "color": "white", "font-size": "18px"}],
            ["raw-html", function () { return "<h3>These achievements do not grant any bonuses nor affect any achievement count related bonuses" }, { "color": "white", "font-size": "18px"}],
            ["blank","100px"],
            ["row", [["achievement", 1001], ["achievement", 1002], ["achievement", 1003], ["achievement", 1004], ["achievement", 1005], ["achievement", 1006], ["achievement", 1007], ["achievement", 1008], ["achievement", 1009]]],
            ["row", [["achievement", 1011], ["achievement", 1012], ["achievement", 1013], ["achievement", 1014], ["achievement", 1015], ["achievement", 1016], ["achievement", 1017], ["achievement", 1018], ["achievement", 1019]]],

        ]
    },
},
},
    tabFormat: [
        ["raw-html", function () { return "<h3>Achievement may also spoil next content" }, { "color": "red", "font-size": "22px"}],
        ["microtabs", "graduation", { 'border-width': '0px' }],
    ],
    

})
addLayer("t", {
    startData() { return {                  
        //actual feature
        unlocked: true,
        points: d(0), 
        cap:d("1e1000"),
        total: d(0),  
        tickspeedcontrol: d(1),
        banked: d(0),
        bankedgain: d(0), 
    }},
    infoboxes: {
        lore: {
            title: "Tickspeed & Ticks",
            body() {          
                let a = "???"
                if(!options.hidemastery) a = "Best mastery"
                return ""+Qcolor2('a','Tickspeed')+" : "+Qcolor2('a','Tickspeed')+" boosts Points , Number , Multiplicative and Divisive generation </br> Ticks : You have "+format(player.t.total)+" total , You are gaining +"+format(tmp.t.passiveGeneration)+" ticks/s (Based on "+a+")"},
        },

        
         lore2: {
            title: "Tickspeed Control",
            body() {                
                return "Current "+Qcolor2('a','Tickspeed')+" is ^"+format(player.t.tickspeedcontrol)+" above 1 000"},
        },        
    },
    symbol:"T",
    color: "#FFDEAD",                       
    resource: "Tick",           
    row: "side",                           
    tooltip() {
        return ""+format(player.t.points)+" Ticks<h3>"
    },
    ttStyle() {
        return {
            "color":"#ffdead",
            "width":"150px",
            "border":"2px solid",
            "border-color":"#ffdead",
        }
    },

    baseResource: "points",                
    baseAmount() { return player.points},  

    requires: d(0),              
    canReset() {return player.r.bestmastery.gte(5)},
    passiveGeneration() {
        let speed = d(1)
        if (hasAchievement('ac',88)) speed = speed.times(achievementEffect('ac',88))
        let mas = player.r.bestmastery.max(5).times(100).root(2)
        let multi = mas.times(10)
        let multi1 = multi

        let totalspeed = speed.times(multi1).times(player.t.banked.add(1).pow(0.15))
        if(hasSuperAchievement('ac',58)) totalspeed = totalspeed.times(d(1.25).pow(d(player.t.upgrades.length)))
        if(hasAchievement('ac',111)) totalspeed = totalspeed.pow(achievementEffect('ac',111))
        return totalspeed.times(player.r.truegamespeed).div(player.r.gamespeed.max(1))

    },

    type: "normal",                        
    exponent: 0,                          
    resetDescription:"Why do you even reset points for ",

    gainMult() {                            
        return d(1)             
    },
    gainExp() {  return d(1)},
    effectMult() {
        let base = d(1).times(player.r.tickspeedbonus).times(buyableEffect('r',104)).times(player.r.ta1)
        if (hasUpgrade('t', 11)) base = base.times(upgradeEffect('t', 11))
        if (hasUpgrade('t', 12)) base = base.times(upgradeEffect('t', 12))
        if (hasUpgrade('t', 13)) base = base.times(upgradeEffect('t', 13))
        if (hasUpgrade('t', 14)) base = base.times(upgradeEffect('t', 14))
        if (hasUpgrade('t', 31)) base = base.times(upgradeEffect('t', 31))
        if (hasUpgrade('t', 32)) base = base.times(upgradeEffect('t', 32))
        if (hasUpgrade('t', 33)) base = base.times(upgradeEffect('t', 33))
        if (hasUpgrade('t', 34)) base = base.times(upgradeEffect('t', 34))

        if (hasAchievement('ac', 29)) base = base.times(1.15)
        if (hasAchievement('ac', 39)) base = base.times(2)
        if(hasAchievement('ac',45)) base = base.times(2)
        if(hasAchievement('ac',49)) base = base.times(5)
        if(hasAchievement('ac',118)) base = base.times(achievementEffect('ac',118))
        if (hasAchievement('ac',89) && !inChallenge('al',11)) base = base.times(achievementEffect('ac',88))
        if(hasUpgrade('n',52)) base = base.times(buyableEffect('n',41)).times(buyableEffect('n',42)).times(buyableEffect('n',43))
        return base
    },   
    effectExp() {
        let exp = d(1)
        if(hasUpgrade('t',15)) exp = exp.times(1.1)
        if(hasUpgrade('t',16)) exp = exp.times(upgradeEffect('t',16))
        exp = exp.times(player.g.artifactset4[1])
        if(hasAchievement('ac',93)) exp = exp.times(achievementEffect('ac',93))
        if(hasUpgrade('n',52)) exp = exp.times(buyableEffect('n',73))
        if(player.g.sacrificeactive[6].gte(1)) exp = exp.times(player.r.chl)
        if(player.g.sacrificeactive[5].gte(1)) exp = exp.times(4)
        if(true) exp = exp.times(player.g.timer.min(600).div(600))
        return exp
    },
    effect() {
        let base = tmp.t.effectMult
        let exp = tmp.t.effectExp
        let total = base.pow(exp)
        if(inChallenge('e',13)) total = total.add(10).log(10).pow(2)
        let total1 = softcap(total,d(1),player.t.tickspeedcontrol)
        if(inChallenge('d',13)) total1 = total1.pow(0)
        if(player.g.sacrificeactive[1].gte(1)) total1 = d(1)
        if(inChallenge('al',11)) total1 = softcap(total1,d(1),player.al.tickspeedreduction1)
        if(inChallenge('al',11)) total1 = total1.div(player.al.tickspeedreduction2)
        if(inChallenge('c',11)) total1 = d(1)
        if(inChallenge('al',11) && player.g.s4best.gte(3)) total1 = d(1)
        return total1.times(1000)
    },
    automate() {
        let limit = d("1e1000")
        if(player.g.sacrificeactive[5].gte(1)) limit = limit.times("1e1500")
        if(player.g.sacrificeactive[7].gte(1)) limit = limit.root(20)
        player.t.cap = limit

        let basegain = player.t.banked.add(1).pow(0.5).times(player.r.truegamespeed).div(player.r.gamespeed.max(1))
        player.t.bankedgain = basegain

    },
    update(delta) {
        if(!player.t.banked.eq(0)) {
        player.t.banked = player.t.banked.add(player.t.bankedgain.times(delta))
        }
},  


    layerShown() { return player.r.bestmastery.gte(5) },        
    upgrades: {
        11: {
            title: "Faster Time I",
            description: "x2 Tickspeed",
            cost: d(1800000),
            effect() {
                return d(2)
            },
            effectDisplay() {return format(upgradeEffect(this.layer,this.id))+"x"}},
        
        12: {
            title: "Faster Time II",
            description: "Tickspeed is increased based on Ticks",
            cost: d(1800000),
            tooltip: "Multi : log<sub>10</sub>(tick/1000+10)<sup>0.75</sup>",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },   
            effect() {
                let multiplier1 = player[this.layer].points.div(1000).add(10).log(10).pow(0.75)
                let multiplier2 = d(1)
                return multiplier1.times(multiplier2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        13: {
            title: "Faster Time III",
            description: "Tickspeed is increased based on Points",
            cost: d(1800000),
            tooltip:"Multi : log<sub>10</sub>(log<sub>10</sub>(points<sup>1.2</sup>+10)+1)<sup>1.5</sup>",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            effect() {
                let multiplier1 = player.points.pow(1.2).add(10).log(10).add(9).log(10).pow(1.5)
                 return multiplier1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        14: {
            title: "Faster Time IV",
            description: "Tickspeed is increased based on total ticks",
            cost: d(1800000),
            tooltip:"Multi : 0.5log<sub>10</sub>(totaltick/1000+1)+1",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            effect() {
                let multiplier1 = player[this.layer].total.div(1000).add(1).log(10).times(0.5).add(1)
                 return multiplier1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        15: {
            title: "Faster Time V",
            description: "Tickspeed is ^1.1",
            cost: d(3600000),
            effect() {
                let multiplier1 = d(1.1)
                return multiplier1
            },
            unlocked() {return hasUpgrade('a',41) || hasUpgrade('t',15)},
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))+"" }, 
        },
        16: {
            title: "Faster Time VI",
            description: "Tickspeed is increased based on itself",
            cost: d(3600000),
            tooltip:"Exponent : 1+log<sub>10</sub>(log<sub>10</sub>(tickspeed+10)+10)<sup>3</sup>/20",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            effect() {
                let multiplier1 = tmp.t.effect.clampMax(player.t.cap).add(10).log(10).add(10).log(10).pow(3).div(20).add(1)
                multiplier1 = softcap(multiplier1,d(1.5),0.25)
                 return multiplier1
            },
            unlocked() {return hasUpgrade('a',41) || hasUpgrade('t',16)},
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))+"" }, 
        },
        21: {
            title: "Prestige Time I",
            description: "Increase Prestige time gain by +4s",
            cost: d(2400000),
            unlocked() {return hasAchievement('ac',51)},
            effect() {
                return d(4)
            } ,
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id),0)+"s"}
         },
        22: {
            title: "Prestige Time II",
            description() {return "Increase Prestige time based on points"},
            cost: d(2400000),
            tooltip() {
                let a = hasSuperAchievement('ac',46) && !hasUpgrade('t',63)
                let b = d(player.timePlayed).mod(6).gte(3)
                let base = d(0.2)
                base = base.add(player.t.points.add(10).log(10).div(1250))
                let eff = player.points.pow(0.1).add(10).log(10).pow(base).times(base).times(10)
                if(hasUpgrade('t',63) && hasSuperAchievement('ac',46)) return "Improved Bonus : "+Qcolor2('y',format(base.times(10),2))+"log<sub>10</sub>(points<sup>0.1</sup>+10)<sup>"+Qcolor2('y',format(base,4))+"</sup>"
                if(a && b) return "Bonus after "+Qcolor2('blue3','Empowering Tick III')+" : "+Qcolor2('y',format(base.times(10),2))+"log<sub>10</sub>(points<sup>0.1</sup>+10)<sup>"+Qcolor2('y',format(base,4))+"</sup> <br> +"+format(upgradeEffect(this.layer,this.id))+" => +"+format(eff)+""
                return "Bonus <br> 2log<sub>10</sub>(points<sup>0.1</sup>+10)<sup>0.2</sup>"
            },
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            unlocked() {return hasAchievement('ac',51)},
            effect() {
                let base = d(0.2)
                if(hasUpgrade('t',63) && hasSuperAchievement('ac',46)) base = base.add(player.t.points.add(10).log(10).div(1250))
                let a = player.points.pow(0.1).add(10).log(10).pow(base).times(base).times(10)
                return a
            }, 
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+"s"}
        },
        23: {
            title: "Prestige Time III",
            description() {
                return "Increase Prestige time based on Research"
            },
            cost: d(2400000),
            tooltip:"Bonus equal to current research",
            unlocked() {return hasAchievement('ac',51)},
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            effect() {
                let mast = player.r.points
                return mast
            } ,
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+"s"}
         },
        24: {
            title: "Prestige Time IV",
            description: "Increase Prestige time based on Multiplicative",
            cost: d(2400000),
            tooltip() {
                let a = hasSuperAchievement('ac',46) && !hasUpgrade('t',63)
                let b = d(player.timePlayed).mod(6).gte(3)
                let base = d(0.06)
                base = base.add(player.t.points.add(10).log(10).div(2000))
                let eff = player.m.points.add(10).log(10).pow(base).times(base).times(50)
                if(hasUpgrade('t',63) && hasSuperAchievement('ac',46)) return "Improved Bonus : "+Qcolor2('y',format(base.times(50)))+"log<sub>10</sub>(multiplicative+10)<sup>"+Qcolor2('y',format(base,4))+"</sup>"
                if(a && b) return "Bonus after "+Qcolor2('blue3','Empowering Tick III')+" : "+Qcolor2('y',format(base.times(50)))+"log<sub>10</sub>(multiplicative+10)<sup>"+Qcolor2('y',format(base,4))+"</sup> <br> +"+format(upgradeEffect(this.layer,this.id))+" => +"+format(eff)+""
                return "Bonus : 2.25log<sub>10</sub>(multiplicative+10)<sup>0.06</sup>"
            },
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            unlocked() {return hasAchievement('ac',51)},
            effect() {
                let base = d(0.06).add(player.t.points.add(10).log(10).div(2000))
                if(!(hasUpgrade('t',63) && hasSuperAchievement('ac',46))) base = d(0.06)
                return player.m.points.add(10).log(10).pow(base).times(base.times(50))
            }, 
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+"s"}
        },
        31: {
            title: "Faster Time VII",
            description: "Multiply Tickspeed based on normal exponent",
            cost: d(10800000),
            tooltip:"Bonus : (exponent+1)<sup>0.6</sup>",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            unlocked() {return hasAchievement('ac',58)},
            effect() {
                return player.e.points.add(1).pow(0.6)
            }, 
            effectDisplay() {return ""+format(upgradeEffect(this.layer,this.id))+"x"}
        },
        32: {
            title: "Faster Time VIII",
            description: "Multiply Tickspeed based on effective exponent",
            cost: d(10800000),
            tooltip:"Bonus : (exponent+1)<sup>0.4</sup>",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            unlocked() {return hasAchievement('ac',58)},
            effect() {
                return player.e.effective.add(1).pow(0.4)
            }, 
            effectDisplay() {return ""+format(upgradeEffect(this.layer,this.id))+"x"}
        },
        33: {
            title: "Faster Time IX",
            description: "Unspent Graduate boosts Tickspeed",
            cost: d("1e9"),
            tooltip:"Bonus : (Graduate/4 + 1)<sup>3</sup>",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },              
            unlocked() {return hasAchievement('ac',109)},
            effect() {
                return player.g.points.div(4).add(1).pow(3)
            }, 
            effectDisplay() {return ""+format(upgradeEffect(this.layer,this.id))+"x"}
        },
        34: {
            title: "Faster Time X",
            description: "Mastery boosts Tickspeed",
            cost: d("1e9"),
            tooltip:"Tickspeed multiplier equal to (Mastery / 10 + 1) ",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            unlocked() {return hasAchievement('ac',109)},
            effect() {
                return player.r.mastery.div(10).add(1)
            }, 
            effectDisplay() {return ""+format(upgradeEffect(this.layer,this.id))+"x"}
        },
        41: {
            title: "Gamepeed I",
            description: "Tickspeed additionally affects Gamespeed at a severely reduced rate",
            cost: d("1e10"),
            tooltip:"Bonus : log<sub>10</sub>(log<sub>10</sub>(Tickspeed+10)+10)",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            unlocked() {return hasAchievement('ac',109)},
            effect() {
                return tmp.t.effect.clampMax(player.t.cap).add(10).log(10).add(10).log(10)
            }, 
            effectDisplay() {return ""+format(upgradeEffect(this.layer,this.id))+"x"}
        },
        42: {
            title: "Deposit Ticks",
            description() {return "Immediately bank 90% + "+format("1e10")+" of your ticks "},
            cost: d("1e10"),
            tooltip:"Hold shift to deposit all",
            ttStyle() {
                return {
                    "color":"yellow",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"orange",
                }
            },  
            unlocked() {return hasAchievement('ac',109)},
            onPurchase() {
                   if(shiftDown) {
                    player.t.banked = player.t.banked.add(player.t.points.add("1e10"))
                    player.t.points = d(0)
                   } else {
                    player.t.banked = player.t.banked.add(player.t.points.times(0.9).add("1e10"))
                    player.t.points = player.t.points.div(10)
                   }
                    player.t.upgrades.splice(player.t.upgrades.length-1,1) 
            },
            effect() {
                if(shiftDown) return player.t.points
                return (player.t.points.times(0.9).add("1e9"))
            }, 
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+" to banked ticks"}
        },
        43: {
            title: "Withdraw Ticks",
            description: "Immediately withdraw 50% of your banked ticks",
            cost: d("0"),
            tooltip:"Hold shift to withdraw all",
            ttStyle() {
                return {
                    "color":"yellow",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"orange",
                }
            },  
            unlocked() {return hasAchievement('ac',109)},
            onPurchase() {
                if(shiftDown) {
                    player.t.points = player.t.points.add(player.t.banked)
                    player.t.banked = d(0)
                   } else {
                    player.t.points = player.t.points.add(player.t.banked.div(2))
                    player.t.banked = player.t.banked.div(2)
                   }
                    player.t.upgrades.splice(player.t.upgrades.length-1,1) 

            },
            effect() {
                if(shiftDown) return player.t.banked
                return player.t.banked.times(0.5)
            }, 
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+" to ticks"}
        },
        44: {
            title: "Prestige Time V",
            description: "Current Banked ticks boosts Prestige Time gain",
            cost: d("1e10"),
            tooltip:"Bonus : log<sub>10</sub>(log<sub>10</sub>(banked ticks + 10)+10)^5",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            unlocked() {return hasAchievement('ac',109)},
            effect() {
                return player.t.banked.add(10).log(10).add(10).log(10).pow(5)
            }, 
            effectDisplay() {return ""+format(upgradeEffect(this.layer,this.id))+"x"}
        },
        51: {
            title: "Tetration cost I",
            description: "Current Challenge shard reduce Tetration cost",
            cost: d("1e14"),
            tooltip:"Cost reduction : (challenge shard+2)<sup>1.6</sup> , effect reduced to ^0.25 above -100",
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },  
            unlocked() {return player.r.tetration.gte(12)},
            effect() {
                return softcap(player.r.challengeshard.add(2).pow(1.6),d(100),0.25)
            }, 
            effectDisplay() {return "-"+format(upgradeEffect(this.layer,this.id),0)+" raw cost"}
        },
        52: {
            title: "Tetration cost II",
            description() {return options.hidemastery?"Slightly reduced Tetration cost":"Current Mastery reduce Tetration cost"},
            cost: d("1e14"),
            tooltip() {return options.hidemastery?"Reduce Tetration cost":"Cost reduction : (mastery+1)^0.47 , result floored , capped at -400 raw Tetration"},
            ttStyle() {
                return {
                    "color":"#beed72",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            }, 
            unlocked() {return player.r.tetration.gte(12)},
            effect() {
                return player.r.mastery.add(1).pow(0.47).min(400)
            }, 
            effectDisplay() {return "-"+format(upgradeEffect(this.layer,this.id),0)+" raw cost"}
        },
        61: {
            title: "Empowering Ticks I",
            description() {
                if(!hasSuperAchievement('ac',46)) return "<s>Total ticks boost Bits gain"
                return "Total ticks boost Bits gain"
            },
            cost: d("1e75"),
            tooltip() {return "Effect formula : log<sub>10</sub>Γ[log<sub>10</sub>(total+100)] <br> <i> where log<sub>10</sub>Γ returns the logarithm of the gamma function <br> log<sub>10</sub>Γ(x) = log<sub>10</sub>(x-1)! for x > 0 </i>"},
            ttStyle() {
                return {
                    "color":"white",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },  
            unlocked() {return hasSuperAchievement('ac',46) || hasUpgrade(this.layer,this.id)},
            effect() {
                if(!hasSuperAchievement('ac',46)) return d(1)
                return player.t.total.add(100).log(10).gamma().log(10)
            }, 
            effectDisplay() {return ""+format(upgradeEffect(this.layer,this.id))+"x"}
        },
        62: {
            title: "Empowering Ticks II",
            description() {
                if(!hasSuperAchievement('ac',46)) return "<s>Banked ticks increase max Perk Power"
                return "Banked ticks increase max Perk Power"
            },
            cost: d("1e80"),
            tooltip() {return "Effect formula : 1+log<sub>10</sub>(Banked)/50"},
            ttStyle() {
                return {
                    "color":"white",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },  
            unlocked() {return hasSuperAchievement('ac',46) || hasUpgrade(this.layer,this.id)},
            effect() {
                if(!hasSuperAchievement('ac',46)) return d(1)
                return player.t.banked.add(10).log(10).div(50).add(1)
            }, 
            effectDisplay() {return ""+format(upgradeEffect(this.layer,this.id))+"x"}
        },
        63: {
            title: "Empowering Ticks III",
            description() {
                if(!hasSuperAchievement('ac',46)) return "<s>Current ticks strengthen Prestige time II and IV upgrade"
                return "Current ticks strengthen Prestige time II and Prestige time IV upgrade"
            },
            cost: d("1e85"),
            tooltip() {return "An formula improvement for "+Qcolor2('blue3','Prestige time II')+" and "+Qcolor2('blue3','Prestige time IV')+" upgrade that scale based on Ticks <br> The formula will cycle between its boosted and base form every few second"},
            ttStyle() {
                return {
                    "color":"white",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },  
            unlocked() {return hasSuperAchievement('ac',46) || hasUpgrade(this.layer,this.id)},
            effect() {
                if(!hasSuperAchievement('ac',46)) return d(0)
                return d(1)
            }, 
        },
         64: {
            title: "Empowering Ticks IV",
            description() {
                if(!hasSuperAchievement('ac',46)) return "<s>Current Ticks gain reduce Exponent cost scaling base , the effect is way stronger inside of Exponent sacrifice"
                return "Current Ticks gain reduce Exponent cost scaling base ; The effect is way stronger inside of Exponent sacrifice "
            },
            cost: d("1e90"),
            tooltip() {return "Formula : (f+log<sub>10</sub>gain)/f <br> where f is "+f(33)+" inside of Exponent sacrifice and "+f(d("e3"))+" otherwise"},
            ttStyle() {
                return {
                    "color":"white",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"aqua",
                }
            },  
            unlocked() {return hasSuperAchievement('ac',46) || hasUpgrade(this.layer,this.id)},
            effect() {
                if(!hasSuperAchievement('ac',46)) return d(1)
                let f = d(1000)
                if(player.g.sacrificeactive[5].gte(1)) f = d(33)
                let base = (f.div(f.add(tmp.t.passiveGeneration.max(10).log(10)))).recip()
                return base
            }, 
            effectDisplay() {return "/"+format(upgradeEffect(this.layer,this.id),4)+""}
        },
       
    },
    buyables: {
        11: {
            title() {
             return "-1% Tickspeed"
            } ,
            cost() { return d(0) },
            tooltip() { return "Tickspeed is ^0.99 above 1000" },
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            }, 
            canAfford() { return true },
            buyMax() {return true},
            buy() {
                player.t.tickspeedcontrol = player.t.tickspeedcontrol.times(0.99)
            },
            style() {
                return {
                     'border-radius': '0%',
                     'color':'red',
                     'background-color':'white',
                     'border':'2px solid',
                     'height':'100px'
                 }},
        },
        12: {
            title() {
             return "-5% Tickspeed"
            } ,
            cost() { return d(0) },
            tooltip() { return "Tickspeed is ^0.95 above 1000" },
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },
            canAfford() { return true },
            buyMax() {return true},
            buy() {
                player.t.tickspeedcontrol = player.t.tickspeedcontrol.times(0.95)
            },
            style() {
                return {
                     'border-radius': '0%',
                     'color':'red',
                     'background-color':'white',
                     'border':'2px solid',
                     'height':'100px'
                 }},
        },
        13: {
            title() {
             return "-25% Tickspeed"
            } ,
            cost() { return d(0) },
            tooltip() { return "Tickspeed is ^0.75 above 1000" },
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"crimson",
                }
            },
            canAfford() { return true },
            buyMax() {return true},
            buy() {
                player.t.tickspeedcontrol = player.t.tickspeedcontrol.times(0.75)
            },
            style() {
                return {
                     'border-radius': '0%',
                     'color':'red',
                     'background-color':'white',
                     'border':'2px solid',
                     'height':'100px'
                 }},
        },
        14: {
            title() {
             return "Disable Tickspeed"
            } ,
            cost() { return d(0) },
            tooltip() { return "Tickspeed is reduced to 1000/s if higher" },
            ttStyle() {
                return {
                    "color":"brown",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"brown",
                }
            },
            canAfford() { return true },
            buyMax() {return true},
            buy() {
                player.t.tickspeedcontrol = player.t.tickspeedcontrol.times(0)
            },
            style() {
                return {
                     'border-radius': '0%',
                     'color':'red',
                     'background-color':'white',
                     'border':'2px solid',
                     'height':'100px'
                 }},
        },
        15: {
            title() {
             return "Normal Tickspeed"
            } ,
            cost() { return d(0) },
            tooltip() { return "Tickspeed is returned to normal" },
            ttStyle() {
                return {
                    "color":"yellow",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            canAfford() { return true },
            buyMax() {return true},
            buy() {
                player.t.tickspeedcontrol = player.t.tickspeedcontrol.max(1)
            },
            style() {
                return {
                     'border-radius': '0%',
                     'color':'green',
                     'background-color':'white',
                     'border':'2px solid',
                     'height':'100px'
                 }},
        },
        21: {
            title() {
             return "Disabled"
            } ,
            effect(x) {
                return d(1)
            },
                
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
        ["row", [["upgrade", 11],["upgrade", 12],["upgrade", 13],["upgrade",14],["upgrade",15],["upgrade",16]]],
        ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade",24]]],
        ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33],["upgrade",34]]],
        ["row", [["upgrade", 41],["upgrade", 44]]],
        ["row", [["upgrade", 51],["upgrade", 52]]],
        ["row", [["upgrade", 61],["upgrade", 62],["upgrade", 63],["upgrade",64]]],
        ["blank","25px"],        
        ["row", [["upgrade", 42],["upgrade", 43]]],
    ],},

    "Tickspeed control": {
    unlocked() { return true },
    content: 
    [ 
        ["blank", "25px"],
        ["row", [["buyable", 11],["buyable", 12],["buyable", 13],["buyable",14],["buyable",15]]],

    ],},
    },},
    tabFormat: [
        ["raw-html", function () { 
            return "<h3>You have  " + format(player.t.points)+" Ticks (+"+format(tmp.t.passiveGeneration)+"/s)"}, { "color": "#ffdead", "font-size": "22px"}],
        ["raw-html", function () { 
            return player.t.banked.gt(0)?"<h3><i> You also have "+format(player.t.banked)+" Banked Ticks (+"+format(player.t.bankedgain)+"/s) , which multiply Ticks gain by "+format(player.t.banked.add(1).pow(0.15))+"":""}, { "color": "#ffdead", "font-size": "18px"}],
        ["microtabs", "stuff", { 'border-width': '0px' }],
    ],

})
addLayer("n", {
    name: "Number",
    symbol: "N",
    position: 0, 
    startData() { return {
        unlocked: true,
		points: d(0),
    }},
    nodeStyle() {
        if(player.g.ud.eq(0)) return 
        if(player.g.ud.gte(1)) return {
            "background-image": "linear-gradient(90deg, #00F9FF, #ffff00, #00F9FF)",
            "width": 40,
            "height": 40,
            'min-height': '40px',
            'min-width': '40px',
        }
    },
    tooltip() {
        let a = ""+f(player.n.points)+" Number <br>"
        if(!options.subCurrency) return a
        if(player.g.ud.gte(1)) a += f(player.g.bits)+" Bits <br>"
        if(player.g.ud.gte(1)) a += formatWhole(player.g.metabits)+ " / "+formatWhole(player.g.totalmetabits)+" Metabits <br>"    
        return a    
    },
    ttStyle() {
        return {
            "color":"#00F9FF",
            "width":"200px",
            "border":"2px solid",
            "border-color":"aqua",
        }
    },
    color: "#00F9FF",
    requires: d(10),
    resource: "numbers", 
    baseResource: "points", 
    baseAmount() {return player.points}, 
    type: "normal",
    exponent: 0.5, 
    gainMult() { 
        multi = d(1).times(buyableEffect('r',103)).times(player.r.la2)
        if (player.g.s1best.gte(1)) multi = multi.times(buyableEffect('g',201))
        if (hasAchievement('ac',18)) multi = multi.times(1.1)
        if (hasAchievement('ac',25)) multi = multi.times(1.1)
        if (hasAchievement('ac',32)) multi = multi.times(2)
        if (hasAchievement('ac',71)) multi = multi.times(16)
        if (hasAchievement('ac',73)) multi = multi.times(achievementEffect('ac',73))
        if (player.r.buyables[121].gte(1)) multi = multi.times(buyableEffect('e',25))
        if (hasUpgrade('a', 22) && !player.r.buyables[121].gte(1)) multi = multi.times(upgradeEffect('a', 22))
        if (hasUpgrade('s', 31)&& !player.r.buyables[121].gte(1)) multi = multi.times(upgradeEffect('s', 31))
        if (hasUpgrade('n', 21)&& !player.r.buyables[121].gte(1)) multi = multi.times(1.5)
        if (hasUpgrade('m', 41)&& !player.r.buyables[121].gte(1)) multi = multi.times(1.5)
        if (hasUpgrade('a', 34)&& !player.r.buyables[121].gte(1)) multi = multi.times(1.5)
        if (hasUpgrade('n', 22)&& !player.r.buyables[121].gte(1)) multi = multi.times(upgradeEffect('n', 22))
        if (hasChallenge('m', 12)) multi = multi.times(challengeEffect('m',12))
        if (hasUpgrade('a',44) && !player.r.buyables[121].gte(1)) multi = multi.times(upgradeEffect('a',44))
        if (hasUpgrade('al',31) && !player.r.buyables[121].gte(1)) multi = multi.times(4)
        if (hasUpgrade('r', 12)) multi = multi.times("1e9")
        if(inChallenge('d',13)) multi = multi.div(player.points.add(1))
        if (hasUpgrade('n',32)) multi = multi.times(getNumberCondensereffect_MUL())
        if (hasAchievement('ac',81) && !inChallenge('al',11)) multi = multi.times(achievementEffect('ac',81))
        if (hasAchievement('ac',87) && !inChallenge('al',11)) multi = multi.times(achievementEffect('ac',87))
        if (player.d.unlocked) multi = multi.times(tmp.d.effect)
        if(player.g.effectWeight[0].gte(1)) multi = multi.times(tmp.e.effect.root(100).pow(player.g.effectWeight[0]))
        if(player.g.timer2.lte(0.5)) multi = d(1)
        return multi
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = d(1)
        if (inChallenge('al',11)) exp = exp.times(player.al.alteredpow)
        if (inChallenge('r',11)) exp = exp.times(player.r.chb)
        if(hasSuperAchievement('ac',18)) exp = exp.times(1.05)
        if(player.g.effectWeight[0].gte(1)) exp = exp.times(tmp.e.expeffect.root(100).pow(player.g.effectWeight[0]))
        exp = exp.times(player.g.artifactset1[0])
        if (inChallenge('m',12)) exp = exp.times(0.5)
        if(inChallenge('d',13)) exp = exp.times(0.1)
        if (hasAchievement('ac',92)) exp = exp.times(achievementEffect('ac',92))
        if (inChallenge('d',11)) exp = exp.times(0)
        if (inChallenge('e',13)) exp = exp.times(0)
        if (hasUpgrade('n',52)) exp = exp.times(buyableEffect('n',21))
        if(player.g.sacrificeactive[0].gte(1)) exp = exp.div(20)
        if(player.r.c10.gt(0) && player.r.c10.neq(1)) exp = d(0)
        return exp
    },
    directMult() {
        let mult = d(1)
        if(tmp.n.resourcegain.gte(player.g.corruption[0])) mult = mult.times(postcorruptiongain(tmp.n.resourcegain,0.25,player.g.corruption[0])).div(player.g.corruption[0]).max(0)
        return mult
    },
    resourcegain() {
        return player.points.div(tmp.n.requires).root(2).times(tmp.n.gainMult).pow(tmp.n.gainExp)

    },
    row: 0, 
    softcap() {return player.g.corruption[0]},
    softcapPower:0,
    hotkeys: [
        {key: "n", description: "N: Reset for Number", onPress(){buyBuyable('n',10)} , unlocked() {return tmp[this.layer].layerShown}},
    ],
    layerShown(){return true} ,
    resetDescription:"Count for ",
    passiveGeneration() { 
        let numpas = d(0)
        if (hasMilestone('e',2) && !inChallenge('e',11) && !inChallenge('e',12)) numpas = numpas.add(1) 
        if (hasMilestone('r',2)) numpas = numpas.add(1)
        if (hasUpgrade('s', 33) && player.r.buyables[121].lt(1)) numpas = numpas.add(upgradeEffect('s', 33)).times(0.01)
        let multi = numpas.times(tmp.t.effect.clampMax(player.t.cap).times(0.001))
        if (hasUpgrade('al',32)) multi = multi.add(1)
        if (hasUpgrade('r',12)) multi = multi.add(1)
        if (hasUpgrade('s',41)) multi = multi.times(upgradeEffect('s',41))
        if (inChallenge('d',13)) multi = multi.min(1)
        let multi1 = multi.times(player.r.truegamespeed)
        return multi1     },
    doReset(resettingLayer) {
			let keep = [];
			if ((hasUpgrade("n", 23) || hasMilestone("e",1)) && resettingLayer=="a") keep.push("upgrades")
			if ((hasUpgrade("n", 23) || hasMilestone("e",1))&& resettingLayer=="s") keep.push("upgrades")
            if ((hasUpgrade("n", 23) || hasMilestone("e",1))&& resettingLayer=="m") keep.push("upgrades")
            if ((hasUpgrade("n", 23) || hasMilestone("e",1))&& resettingLayer=="d") keep.push("upgrades")
            if (hasMilestone("e",4) && resettingLayer=="a") keep.push("points")
			if (hasMilestone("e",4) && resettingLayer=="s") keep.push("points")
            if (hasMilestone("e", 1) && resettingLayer=="e") keep.push("upgrades")
            if (hasUpgrade('n',41)) keep.push("buyables")
            if (hasUpgrade('n',41)) keep.push("upgrades")
			if (layers[resettingLayer].row > this.row) layerDataReset("n", keep)
            
        },
    infoboxes: {
        lore: {
            title: "Number gain",
            body() {
                let a = ""
                if(tmp.n.resourcegain.gte(player.g.corruption[0])) a = a += "<br> Corruption : /"+Qcolor2('d',format(((player.points.div(10).pow(0.5).times(tmp.n.gainMult)).pow(tmp.n.gainExp)).div(player.g.corruption[0]).pow(1)))+" <br> Post corruption multiplier : "+Qcolor2('n',format(tmp.n.directMult))+""
                return "Base : +"+Qcolor2('a',format(player.points.times(0.1).pow(0.5)))+" <br> Multiplier : x"+Qcolor2('n',format(tmp.n.gainMult))+" <br> Exponent : ^"+Qcolor2('e',format(tmp.n.gainExp))+" <br> Total gain : "+Qcolor2('m',format(((player.points.div(10).pow(0.5).times(tmp.n.gainMult)).pow(tmp.n.gainExp))))+" "+a+" <br> Passive generation : x"+Qcolor2('r',format(tmp.n.passiveGeneration))+" <br> Passive gain : +"+Qcolor2('a',format(generateAmount('n')))+"/s"},
            unlocked() {return true}
        },
    },
    upgrades: {
        11: {
            title: "Counting faster",
            description() {
                let a = "Points generation is doubled"
                let d = options.hidemastery?"":"and Empowered by Mastery"
                let e = options.hidemastery?"something":"mastery"
                let b = hasUpgrade('al',43)?" "+d+"":""
                let c =  a+b
                return player.r.tetration.gte(9)?"Points gain is raised based on "+e+"":c
            },
            cost: d(1),
            effect() {
                let base = d(2)
                if(hasUpgrade('al',43)) base = base.pow(player.r.mastery.add(2))
                let base1 = softcap(base,d("1e6"),0.04)
                let base2 = softcap(base1,d("1e100"),0.2)
                if(player.r.tetration.gte(9)) base2 = base2.slog().div(20).add(1)
                if(player.r.buyables[121].gte(1)) base2 = base2.pow(0)
                return base2
            }, 
            effectDisplay() { return player.r.tetration.lt(9)?format(upgradeEffect(this.layer, this.id))+"x":"^"+format(upgradeEffect(this.layer,this.id),4)+"" }, 
            unlocked() {return !player.r.buyables[121].gte(1)}
        },
        12: {
            title: "Headstart",
            description: "Points gain is boosted based on number",
            cost: d(3),
            unlocked() { return hasUpgrade("n", 11) && !player.r.buyables[121].gte(1)},
            effect() {
                let pow1 = d("10")
                let startcap1 = d("1e100")
                let eff = player[this.layer].points.add(2).pow(0.5)
                if (hasUpgrade('al',41)) eff = eff.pow(1.25)
                if (hasUpgrade('s', 32)) eff = eff.times(upgradeEffect('s', 32))
                let eff1 = softcap(eff,startcap1,1/pow1)
                if(player.r.tetration.gte(9)) eff1 = eff1.slog().div(20).add(1)
                if(player.r.buyables[121].gte(1)) eff1 = eff1.pow(0)
                return eff1
            },
            effectDisplay() { return player.r.tetration.lt(9)?format(upgradeEffect(this.layer, this.id))+"x":"^"+format(upgradeEffect(this.layer,this.id),4)+"" }, 
        },
        13: {
            title: "Effective counting",
            description: "Points gain boost itself",
            cost: d(6),
            unlocked() { return hasUpgrade("n", 12) && !player.r.buyables[121].gte(1)},
            effect() {
                let eff = player.points.add(11).log(10)
                if (hasUpgrade('al',42)) eff = eff.pow(5)
                if (hasUpgrade('s', 32)) eff = eff.times(upgradeEffect('s', 32))
                if (player.r.tetration.gte(9)) eff = eff.slog().div(20).add(1)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)
                return eff
            },
            effectDisplay() { return player.r.tetration.lt(9)?format(upgradeEffect(this.layer, this.id))+"x":"^"+format(upgradeEffect(this.layer,this.id),4)+""}, 
        },
        14: {
            title: "1st Grade",
            description() {return player.r.tetration.lt(9)?"Unlock new layer and x1.2 points gain":"^1.01 to Points gain"},
            cost: d(10),
            unlocked() { return hasUpgrade("n", 13) && !player.r.buyables[121].gte(1) },
        },
        21: {
            title: "Counting much faster",
            description: "1.5x Number gain",
            cost() {
                let base = d(500000)
                if(hasUpgrade('al',44) || hasUpgrade('r',11)) base = base.pow(0.25)
                if(player.r.buyables[121].gte(1)) base = base.pow(0)

                return base
            },
            unlocked() { return (hasUpgrade("a", 24) || hasUpgrade('al',44) || hasUpgrade('r',11) || hasMilestone('e',1)) && !player.r.buyables[121].gte(1)},
        },
        22:{
            title: "Reverse increase",
            description: "Points boost number gain",
            cost() {
                let base = d(4e6)
                if(hasUpgrade('al',44) || hasUpgrade('r',11)) base = base.pow(0.25)
                return base
            },
            unlocked() { return hasUpgrade("n", 21) && !player.r.buyables[121].gte(1)},
            effect() {
                let eff = player.points.add(10).log(10).pow(0.75)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        23:{
            title: "Keeping resource",
            description: "Keep number upgrade on all Row2 reset",
            cost() {
                let base = d(1e12)
                if(hasUpgrade('al',44) || hasUpgrade('r',11) ) base = base.pow(0.25)
                return base
            },
            unlocked() { return hasUpgrade("n", 22) ||  player.r.buyables[121].gte(1) },
        },
        24:{
            title: "3rd Grade",
            description: "Unlock a new layer and x1.2 points gain",
            cost() {
                let base = d(5e7)
                if((hasUpgrade('al',44) || hasUpgrade('r',11)) ) base = base.pow(0.25)
                return base
            },
            onPurchase() {
                player.m.unlocked = true
            },
            unlocked() { return hasUpgrade("n", 22) && !player.r.buyables[121].gte(1) },
        }, 
        31: {
            title: "Condensed points upgrade",
            description() {return "Multiply Points gain based on various resource."},
            tooltip() {return "Total effect : x"+format(getPointCondensereffect_MUL())+" and ^"+format(getPointCondensereffect_POW(),4)+" to Points gain "},
            ttStyle() {
                return {
                    "width":"250px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            cost: d(32),
            unlocked() { return player.r.buyables[121].gte(1) },
            effect() {
                return d(1)
            },
        },
        32: {
            title: "Condensed Number upgrade",
            description() {return "Multiply Number gain based on various resource."},
            tooltip() {return "Total effect : x"+format(getNumberCondensereffect_MUL())+" to Number gain "},
            ttStyle() {
                return {
                    "width":"250px",
                    "border":"2px solid",
                    "border-color":"yellow",
                }
            },
            cost: d(32),
            unlocked() { return player.r.buyables[121].gte(1) },
            effect() {
                return d(1)
            },
        },
        41: {
            title: "Bits?",
            description() {return "Generate Bits based on Number"},
            cost: d(0),
            currencyLocation() { return player.g },
            currencyDisplayName: "Bits",
            currencyInternalName: "bits",
            unlocked() { return player.g.ud.gte(1)},
            effect() {
                let eff1 = player.n.points.add(10).log(10).root(2).div(10000)
                return eff1
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer,this.id),3)+"/s" }, 
        },
        51: {
            title: "MORE bits",
            description() {return "Bits boosts its own gain , up to 100.00x"},
            cost: d(1),
            currencyLocation() { return player.g },
            currencyDisplayName: "Bits",
            currencyInternalName: "bits",
            unlocked() { return true},
            effect() {
                let eff1 = player.g.bits.times(100).add(1).root(8).min(100)
                return eff1
            },
            effectDisplay() { return "x"+format(upgradeEffect(this.layer,this.id))+"" }, 
        },
        52: {
            title: "...",
            description() {return "Unlock Bittree ... what?"},
            cost: d(100),
            currencyLocation() { return player.g },
            currencyDisplayName: "Bits",
            currencyInternalName: "bits",
            unlocked() { return true},  
        },
        61: {
            title: "Even more Bits",
            description() {return "Bits boost its own gain again , but stronger <br> Reduced effect above "+f(1000)+"x"},
            cost: d(10000),
            currencyLocation() { return player.g },
            currencyDisplayName: "Bits",
            currencyInternalName: "bits",
            unlocked() { return inChallenge('e',13) || hasUpgrade('n',61)},
            effect() {
                let eff1 = player.g.bits.times(100).add(1).root(5)
                eff1 = postcorruptiongain(eff1,d(0.75),d(1000))
                return eff1
            },
            effectDisplay() { return "x"+format(upgradeEffect(this.layer,this.id))+"" }, 
        },
        62: {
            title: "More enmetalization",
            description() {return "You can enmetalize with Number"},
            cost: d(1000000),
            currencyLocation() { return player.g },
            currencyDisplayName: "Bits",
            currencyInternalName: "bits",
            unlocked() { return inChallenge('e',13) || hasUpgrade('n',62)},
        },
        63: {
            title: "Discounted bits",
            description() {return "Reduce the Bits cost for enmetalization (^0.5)"},
            cost: d("1e8"),
            currencyLocation() { return player.g },
            currencyDisplayName: "Bits",
            currencyInternalName: "bits",
            unlocked() { return inChallenge('e',13) || hasUpgrade('n',63)},
            
        },
        71: {
            title: "Sacrificed",
            description() {return "Unlock Graduation sacrifice"},
            cost: d("9e24"),
            currencyLocation() { return player.g },
            currencyDisplayName: "Bits",
            currencyInternalName: "bits",
            unlocked() { return player.r.tetration.gte(20) || hasUpgrade('n',71)},
            
        },
        72: {
            title: "Even more Operation",
            description() {return "+2 more Operation buyable . Algebric upgrades is retained permeantly"},
            cost: d("4.35e22"),
            currencyLocation() { return player.g },
            currencyDisplayName: "Bits",
            currencyInternalName: "bits",
            unlocked() { return player.r.tetration.gte(20) || hasUpgrade('n',72)},
            
        },
        73: {
            title: "More enmetalization II",
            description() {return "You can enmetalize with Mastery"},
            cost: d("3e31"),
            currencyLocation() { return player.g },
            currencyDisplayName: "Bits",
            currencyInternalName: "bits",
            unlocked() { return player.r.tetration.gte(20) || hasUpgrade('n',72)},
            
        },
        74: {
            title: "Additional Depth",
            description() {return "More Bits tree content"},
            cost: d("3e31"),
            currencyLocation() { return player.g },
            currencyDisplayName: "Bits",
            currencyInternalName: "bits",
            unlocked() { return player.r.tetration.gte(20) || hasUpgrade('n',72)},
            
        },


    },
    buyables: {    
        10: {
            title() {
                let a = ""
                if(getResetGain('n').lt(100)) a += "<br><br> Next at "+format(getNextAt('n'))+" Points" 
                return tmp[this.layer].gainExp.eq(0)?"Cannot reset":"Reset for +"+format(getResetGain('n'),0)+ " Number"+a
               } ,
            cost(x) { 
                return d(0) },
            tooltip() {return ""},
            canAfford() {
                return (player.points.gte(tmp[this.layer].requires) && getResetGain(this.layer).neq(0))
            },
            buy() {
                player[this.layer].points = player[this.layer].points.add(getResetGain(this.layer))
                doReset(this.layer,true)
            },
            style() {
                if (this.canAfford())  return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': tmp[this.layer].color,
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
                else if (tmp[this.layer].gainExp.neq(0))  return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': 'red',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
				else return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': 'crimson',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } }
        },
        11: {
            title() {
                return formatWhole(getBuyableAmount(this.layer, this.id),0) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(1) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Raise "+Qcolor2('e','points')+" gain by "+Qcolor2('a',"^"+format(this.effect(),3))+" <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() {
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) 
                return player.g.metabits.gte(this.cost())
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = x.div(200).add(1)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        21: {
            title() {
                return formatWhole(getBuyableAmount(this.layer, this.id),0) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(1) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Raise "+Qcolor2('e','number')+" gain by "+Qcolor2('a',"^"+format(this.effect()))+" <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() {
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[11].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[11].gte(2) 
            },            
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = x.div(100).add(1)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)},
        },
        22: {
            title() {
                return formatWhole(getBuyableAmount(this.layer, this.id),0) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(1) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},

            display() { 
                return "Raise "+Qcolor2('e','multiplicative')+" gain by "+Qcolor2('a',"^"+format(this.effect()))+" <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() {
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[11].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[11].gte(2) 
            },            
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = x.div(100).add(1)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)},

        },
        31: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(1) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},

            display() { 
                return "Raise "+Qcolor2('e','divisive')+" gain by "+Qcolor2('a',"^"+format(this.effect()))+" <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() {
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[11].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[11].gte(2) 
            },            
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = x.div(100).add(1)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        32: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(1) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Reduce "+Qcolor2('e','exponent')+" cost scaling base by "+Qcolor2('a',""+format(this.effect(),3)+"x")+" <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() {
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[11].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[11].gte(2) 
            },            
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = d(1).add(x.div(250))
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        33: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(1) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Decrease "+Qcolor2('e','research')+" cost by "+Qcolor2('a',"/"+format(this.effect())+"")+" <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[11].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[11].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = d(1.15).pow(x)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        41: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(1) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Increase "+Qcolor2('e','tickspeed')+" & Additive cost reduction by "+Qcolor2('a',"x"+format(this.effect())+"")+" , which "+Qcolor2('green2','increases')+" over time (Reset on Graduation) <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = d(2).pow(x).pow(player.g.timer.add(2).log(2)).root(5)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        42: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(1) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Increase "+Qcolor2('e','tickspeed')+" & Subtractive cost reduction by "+Qcolor2('a',"x"+format(this.effect())+"")+" <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = d(5).pow(x)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        43: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(1) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Increase "+Qcolor2('e','tickspeed')+" & Exponent cost reduction by "+Qcolor2('a',"x"+format(this.effect())+"")+" , which "+Qcolor2('red2','decreases')+" over time (Reset on Graduation) <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = d(10000).pow(x).root(player.g.timer.add(2).log(2).div(2).add(1))
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        51: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(2) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Multiply "+Qcolor2('e','Light additive & Dark subtractive')+" gain by "+Qcolor2('a',"x"+format(this.effect())+"")+" <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = d(10).pow(x.add(1).pow(1.416).sub(1))
                return base      
            },
            unlocked() {return true},
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        52: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(2) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Multiply "+Qcolor2('e','Twilight')+" gain by "+Qcolor2('a',"x"+format(this.effect())+"")+" <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            effect(x) {
                let base = d(10).pow(x.add(1).pow(1.6).sub(1))
                return base      
            },
            unlocked() {return true},
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        53: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(2) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Multiply "+Qcolor2('e','Energy')+" gain by "+Qcolor2('a',"x"+format(this.effect())+"")+" <br> Cost : "+Qcolor2('n',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return true},
            effect(x) {
                let base = d(10).pow(x.add(1).pow(2.581).sub(1))
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        61: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(2) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Multiply "+Qcolor2('n','Bits')+" gain by "+Qcolor2('n',""+format(this.effect())+"")+" <br> Cost : "+Qcolor2('a',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return true},
            effect(x) {
                let base = x.div(100).add(1).pow(100)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        62: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(2) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Multiply "+Qcolor2('n','MR')+" gain by "+Qcolor2('n',"x"+format(this.effect())+"")+" <br> Cost : "+Qcolor2('a',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return true},
            effect(x) {
                let base = x.div(40).add(1)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        63: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(2) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Multiply "+Qcolor2('n','Prestige time')+" gain by "+Qcolor2('n',"x"+format(this.effect())+"")+" <br> Cost : "+Qcolor2('a',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return true},
            effect(x) {
                let base = x.div(100).add(1).pow(25)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        71: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(3) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Multiply "+Qcolor2('n','Tetration cost')+" by "+Qcolor2('blue3',"x"+format(this.effect())+"")+" <br> Cost : "+Qcolor2('a',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return true},
            effect(x) {
                let base = x.div(40).add(1).pow(-1)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        72: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(3) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Multiply "+Qcolor2('n','Gamespeed')+" by "+Qcolor2('blue3',"x"+format(this.effect())+"")+" <br> Cost : "+Qcolor2('a',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return true},
            effect(x) {
                let base = x.div(8).add(1).pow(2)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        73: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(3) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            display() { 
                return "Raise "+Qcolor2('n','Tickspeed')+" by "+Qcolor2('n',"^"+format(this.effect())+"")+" <br> Cost : "+Qcolor2('a',format(this.cost(),0))+" "+Qcolor2('a',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[toNumber(this.id) - 10].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return true},
            effect(x) {
                let base = x.div(25).add(1)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        81: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + ""
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                return d(15) },
            tooltip() {return this.display()+"<br> Perk ID : "+format(d(this.id),0)},
            
            display() { 
                return "Perk : "+Qcolor2('e','Exponent')+" cost reduction "+Qcolor2('e',"based on Additive and Subtractive cost reduction")+" . Currently : "+Qcolor2('y',"/"+format(this.effect()))+" <br> Cost : "+Qcolor2('s',format(this.cost(),0))+" "+Qcolor2('s',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && player.n.buyables[71].gte(2) && player.n.buyables[72].gte(2) && player.n.buyables[73].gte(2) 
                return player.g.metabits.gte(this.cost()) && player.n.buyables[71].gte(2) && player.n.buyables[72].gte(2) && player.n.buyables[73].gte(2) 
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return player.n.buyables[71].gte(2) && player.n.buyables[72].gte(2) && player.n.buyables[73].gte(2)},
            effect(x) {
                let base = tmp.a.gainMult.times(tmp.s.gainMult)
                return base.root(-2)      
            },
            purchaseLimit() {return d(1)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('aqua',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        91: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + " <br> ACTIVE BONUS"
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(4) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            
            display() { 
                return "Multiplier to "+Qcolor2('y','Graduate')+" , which "+Qcolor2('red2',"decays")+" over time in this Graduation reset (CAN go below x1) <br> Effect : "+Qcolor2('y',"x"+format(this.effect(),5))+" <br> Cost : "+Qcolor2('s',format(this.cost(),0))+" "+Qcolor2('s',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && !(getBuyableAmount('n',92).gte(1) || getBuyableAmount('n',93).gte(1)) && (player.n.buyables[71].gte(2))&& hasUpgrade('n',74)
                return player.g.metabits.gte(this.cost()) && !(getBuyableAmount('n',92).gte(1) || getBuyableAmount('n',93).gte(1)) && (player.n.buyables[71].gte(2))&& hasUpgrade('n',74)
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return hasUpgrade('n',74)},
            effect(x) {
                let base = d(0.95).pow(x).pow(player.g.timer2.times(10).add(10).log(10).pow(0.6).sub(2.5))
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (getBuyableAmount('n',92).gte(1) || getBuyableAmount('n',93).gte(1)) return Qcolor('crimson',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        92: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + " <br> PASSIVE BONUS"
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(4) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            
            display() { 
                return ""+Qcolor2('y',"x"+format(this.effect(),5)+" Graduate")+" <br> Cost : "+Qcolor2('s',format(this.cost(),0))+" "+Qcolor2('s',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && !(getBuyableAmount('n',91).gte(1) || getBuyableAmount('n',93).gte(1)) && (player.n.buyables[72].gte(2) )&& hasUpgrade('n',74)
                return player.g.metabits.gte(this.cost()) && !(getBuyableAmount('n',91).gte(1) || getBuyableAmount('n',93).gte(1)) && (player.n.buyables[72].gte(2) )&& hasUpgrade('n',74)
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return hasUpgrade('n',74)},
            effect(x) {
                let base = d(1.02).pow(x)
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (getBuyableAmount('n',91).gte(1) || getBuyableAmount('n',93).gte(1)) return Qcolor('crimson',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        93: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + " <br> IDLE BONUS"
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let base = d(4) 
                if(shiftDown) base = d(5).min(this.purchaseLimit().sub(player.n.buyables[this.id])).times(base)
                return base
            },
            tooltip() {return this.display()+"<br> ID : "+format(d(this.id),0)},
            
            display() { 
                return "Reduced "+Qcolor2('y','Graduate')+" gain . But gain an "+Qcolor2('y',"increasing")+" Graduate bonus over time in this Graduation <br> Effect : "+Qcolor2('a',"x"+format(this.effect(),5))+" <br> Cost : "+Qcolor2('s',format(this.cost(),0))+" "+Qcolor2('s',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && !(getBuyableAmount('n',92).gte(1) || getBuyableAmount('n',91).gte(1)) && (player.n.buyables[73].gte(2) )&& hasUpgrade('n',74)
                return player.g.metabits.gte(this.cost()) && !(getBuyableAmount('n',92).gte(1) || getBuyableAmount('n',91).gte(1)) && (player.n.buyables[73].gte(2) )&& hasUpgrade('n',74)
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return hasUpgrade('n',74)},
            effect(x) {
                let base = d(1.1).pow(x).pow(player.g.timer2.times(2).add(10).log(10).pow(0.4).sub(1.5))
                return base      
            },
            purchaseLimit() {return d(10)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('green',100)
                if (getBuyableAmount('n',91).gte(1) || getBuyableAmount('n',92).gte(1)) return Qcolor('crimson',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        101: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + " <br> ACTIVE BONUS"
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                return d(20) },
            tooltip() {return this.display()+"<br> Perk ID : "+format(d(this.id),0)},
            
            display() { 
                return "Gain a "+Qcolor2('y','6.4x Gamespeed')+" multiplier , only when you are "+Qcolor2('green2','multipling')+" your Points by at least "+Qcolor2('green2',fde(10)+'x')+" in a second <br> Currently : "+this.effect()+"x  <br> Cost : "+Qcolor2('s',format(this.cost(),0))+" "+Qcolor2('s',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && getBuyableAmount('n',91).gte(2)
                return player.g.metabits.gte(this.cost()) && getBuyableAmount('n',91).gte(2)
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return hasUpgrade('n',74)},
            effect(x) {
                let base = d(6.4)
                let ticks = d(pastTickTimes[0])
                if(ticks === undefined) ticks = d(1000)
                let points = player.points
                let lastPoints = tmp.other.lastPoints
                let ratio = points.max(10).div(lastPoints.max(10)).log(10).times(d(1000).div(ticks.max(1)))
                if(ratio.lt(10)) base = d(1)
                if(player.n.buyables[this.id].eq(0)) base = base.pow(x)
                return base      
            },
            purchaseLimit() {return d(1)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('blue',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        103: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + " <br> IDLE BONUS"
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                return d(20) },
            tooltip() {return this.display()+"<br> Perk ID : "+format(d(this.id),0)},
            
            display() { 
                return "Gain a "+Qcolor2('y','Gamespeed multiplier')+" , based on the "+Qcolor2('red2','ratio')+" between your "+Qcolor2('pink2','Points')+" and your "+Qcolor2('pink2','Points generation')+" <br> Ratio : "+Qcolor2('green2',format(player.points.div(getPointGen().max(1))))+" => "+Qcolor2('y',"x"+format(player.points.div(getPointGen().max(1)).max(1).add(9).log(10).max(1).root(3).div(2).add(0.5),3))+" <br> Cost : "+Qcolor2('s',format(this.cost(),0))+" "+Qcolor2('s',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && getBuyableAmount('n',93).gte(2)
                return player.g.metabits.gte(this.cost()) && getBuyableAmount('n',93).gte(2)
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return hasUpgrade('n',74)},
            effect(x) {
                let ratio = player.points.div(getPointGen().max(1)).max(1).add(9).log(10)
                let base = ratio.max(1).root(3).div(2).add(0.5)
                return base.pow(x)      
            },
            purchaseLimit() {return d(1)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('blue',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
        102: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + " <br> PASSIVE BONUS"
               } ,
            cost(x) { 
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return d(0)
                return d(20) },
            tooltip() {return this.display()+"<br> Perk ID : "+format(d(this.id),0)},
            
            display() { 
                return "x3 "+Qcolor2('y','Gamespeed')+" <br> Cost : "+Qcolor2('s',format(this.cost(),0))+" "+Qcolor2('s',"metabits")+" " },
            canAfford() { 
                if(options.instantcalculation) return (player.g.spentmetabits.add(this.cost())).lte(player.g.totalmetabits) && getBuyableAmount('n',92).gte(2)
                return player.g.metabits.gte(this.cost()) && getBuyableAmount('n',92).gte(2)
            },
            buy() {
                let base = d(1)
                if(shiftDown) base = d(5) 
                player.g.spentmetabits = player.g.spentmetabits.add(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(base).min(this.purchaseLimit()))

            },
            unlocked() {return hasUpgrade('n',74)},
            effect(x) {
                let base = d(3)
                return base.pow(x)      
            },
            purchaseLimit() {return d(1)},
            style() {
                if (player.n.buyables[this.id].gte(this.purchaseLimit())) return Qcolor('blue',100)
                if (!this.canAfford()) return Qcolor('gray',100)
				else return Qcolor('rgb(128,128,32)',100)}
        },
    },
    clickables: {
        11: {
            title() { return "UNLOCK BITS (Graduation II) <br> 5 Research required" },
            canClick() { return player.r.points.gte(5) },
            unlocked() { return player.g.rank.gte(2) && player.g.ud.eq(0) },
            onClick() {
                player.g.ud = d(1)
            },
            style() {   
           if(player.r.points.lte(4)) return Qcolor('black',100)
           else return Qcolor('aqua',100)
         },
         },
        12: {
            title() { return "Fix negative Metabit" },
            canClick() { return true },
            tooltip() {return "Prevent negative Metabit"},
            unlocked() { return hasAchievement('ac',1006) },
            onClick() {
                options.instantcalculation = !options.instantcalculation
            },
            style() {   
           if(options.instantcalculation) return Qcolor('green',100)
           else return Qcolor('red',100)
         },
        },
        13: {
            title() { return "Toggle respec on Meta-reset" },
            canClick() { return true },
            unlocked() { return true },
            onClick() {
                buyBuyable('r',1101)
            },
            style() {   
            return tmp.r.buyables[1101].style
        },
        },
        14: {
            title() { return "Meta-reset <br> +"+format(player.r.nextmetaresearch)+" MR" },
            canClick() { return true },
            unlocked() { return true },
            onClick() {
                buyBuyable('r',110)
            },
            style() {   
            return Qcolor('cyan',100)
        },
        },
        15: {
            title() { return "Import Bittree" },
            canClick() { return true },
            unlocked() { return true },
            onClick() {
                BitsTreeImport()
            },
            style() {   
            return Qcolor('purple',100)
        },
        },
        16: {
            title() { return "Export Bittree" },
            canClick() { return player.n.buyables[11].gte(1) },
            unlocked() { return true },
            onClick() {
                let str = BitsTreeExport()
                const el = document.createElement("textarea");
                el.value = str;
                document.body.appendChild(el);
                el.select();
                el.setSelectionRange(0, 99999);
                document.execCommand("copy");
                document.body.removeChild(el);
                showModal('Copied to clipboard','',{textColor:'purple'})
            },
            style() {   
            if(this.canClick()) return Qcolor('purple',100)
            else return Qcolor('')
        },
        },
        21: {
                title() { return player.s.unlocked?"Unlock Additive ("+format(5000)+" points)":"Unlock Additive (250 points)" },
                canClick() {
                    if(player.s.unlocked) return player.points.gte(5000)
                    else return player.points.gte(250)
                    },
                unlocked() { return hasUpgrade('n',14) && !player.a.unlocked},
                onClick() {
                    player.a.unlocked = true
                },
                style() {   
                return Qcolor('lime',100)
            },
        },
         22: {
                title() { return player.a.unlocked?"Unlock Subtractive ("+format(25000)+" points) ":"Unlock Subtractive (250 points)" },
                canClick() { 
                    if(player.a.unlocked) return player.points.gte(25000)
                    else return player.points.gte(250)
                },
                unlocked() { return hasUpgrade('n',14) && !player.s.unlocked},
                onClick() {
                    player.s.unlocked = true
                },
                style() {   
                return Qcolor('red',100)
            },
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
            ["infobox","lore2"],
            ["blank","25px"],
            ["row", [["buyable", 10]]],
            ["blank","25px"],
            ["row", [["upgrade", 11],["upgrade", 12],["upgrade", 13],["upgrade",14]]],
            ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 24],["upgrade",23]]],
            ["row", [["upgrade", 31],["upgrade",32]]],
            ["blank","25px"],
            ["row",[["clickable",11],["clickable",21],["clickable",22]]],

    ],},
    "Bits": {
        unlocked() { return player.g.ud.gte(1) },
        content: 
        [
            ["blank", "25px"],
            ["raw-html", function () { return "<h3> You have "+format(player.g.bits)+" bits (+"+format(player.g.bitspersec)+"/s)" }, { "color": "white", "font-size": "22px"}],
            ["raw-html", function () { return "<h3><i> Post graduation feature will not reset on graduation or lower reset" }, { "color": "white", "font-size": "22px"}],
            ["blank","25px"],
            ["row", [["upgrade", 41]]],
            ["row", [["upgrade", 51],["upgrade", 52]]],
            ["row", [["upgrade", 61],["upgrade", 62],["upgrade", 63]]],
            ["row", [["upgrade", 72],["upgrade", 71],["upgrade", 73],["upgrade", 74]]],
            ["row", [["upgrade", 81],["upgrade", 82],["upgrade", 83],["upgrade", 84],["upgrade", 85]]],
            ["row", [["upgrade", 91],["upgrade", 92],["upgrade", 93],["upgrade", 94],["upgrade", 95],["upgrade", 96]]],
],},
    "Bittree": {
    unlocked() { return player.g.ud.gte(1) && hasUpgrade('n',52) },
    shouldNotify() {return player.g.metabits.gt(0)},
    content: 
[
        ["blank", "25px"],
        ["raw-html", function () { return "<h3> You have "+format(player.g.bits)+" bits (+"+format(player.g.bitspersec)+"/s)" }, { "color": "white", "font-size": "22px"}],
        ["raw-html", function () { return "<h3> You have "+formatWhole(player.g.metabits)+" / "+formatWhole(player.g.totalmetabits)+" metabits" }, { "color": "lime", "font-size": "22px"}],
        ["raw-html", function () { return "<h3> <i> New features unlocked at Meta-research tab <br> hold [Shift] to buy 5x" }, { "color": "gray", "font-size": "18px"}],
        ["raw-html", function () { return "<h3> <i> The Metabits tree contains various skills <br> Use your Metabits and buy skills to gain bonus <br> Reaching level 2 in most skills unlock the next" }, { "color": "gray", "font-size": "18px"}],
        ["blank","25px"],
        ["row", [["clickable",12],["clickable",13],["clickable",14],["clickable",16],["clickable",15]]],
        ["blank","25px"],   
        ["row", [["buyable", 11]]],
        ["row", [["buyable", 21],["buyable" , 22]]],
        ["row", [["buyable", 31],["buyable" , 32],["buyable" , 33]]],
        ["row", [["buyable", 41],["buyable" , 42],["buyable" , 43]]],
        ["row", [["buyable", 51],["buyable" , 52],["buyable" , 53]]],
        ["row", [["buyable", 61],["buyable" , 62],["buyable" , 63]]],
        ["row", [["buyable", 71],["buyable" , 72],["buyable" , 73]]],
        ["row", [["buyable", 81]]],
        ["row", [["buyable", 91],["buyable" , 92],["buyable" , 93]]],
        ["row", [["buyable", 101],["buyable" , 102],["buyable" , 103]]],
        ["row", [["buyable", 111],["buyable" , 112],["buyable" , 113]]],
        ["row", [["buyable", 121],["buyable" , 122],["buyable" , 123]]],
        ["row", [["buyable", 131],["buyable" , 132],["buyable" , 133]]],
        ["row", [["buyable", 141],["buyable" , 142]]],
        ["row", [["buyable", 151],["buyable" , 152]]],

],},
        
    },
    
},
    tabFormat: [
        ["raw-html", function () { 
            let a = options.hidemastery?"":"=> +"+format(player.r.basemastery)+" Mastery"
            return "<h3>You have  " + format(player.n.points)+" Number "+a+""}, { "color": "cyan", "font-size": "22px"}],
        ["raw-html", function () { return tmp.n.passiveGeneration.times(getResetGain(this.layer)).gt(0)?"<h3>You are currently gaining " + format(tmp.n.passiveGeneration.times(getResetGain(this.layer)))+" Number/s":"" }, { "color": "cyan", "font-size": "22px"}],
        ["raw-html", function () { return tmp.n.resourcegain.gt(player.g.corruption[0]) && shiftDown?"<h3>Number corruption : Starting at "+format(player.g.corruption[0])+" number gain , Excessive number gain is rooted by "+format(corruptionroot(tmp.n.resourcegain,0.25,player.g.corruption[0]),4)+"":"" }, { "color": "red", "font-size": "20px"}],    
    
        ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
    layerShown() { return !inChallenge('c',11) },
    deactivated() {
        return false
    }
})

addLayer("a", {
    startData() { return {                 
        unlocked: false,                   
        points: d(0),
        startsoftcap: d(100),
        startsoftcap2: d(2048),
        first: d(0), //there's some error with the removal of these 'first' variable that flood localStorage . Yes fixOldSave() should do the work ... 
    }},
    directMult() {
        let base = d(1)
        base = base.times(player.g.artifactset1[1])
        if(hasSuperAchievement('ac',21)) base = base.times(1.02)
        return base
    },
    tooltip() {return ""+format(player.a.points,0)+" Additive </br> Next at "+format(static_cost('a',player.a.points,d(0.6)))+""},
    ttStyle() {
        return {
            "color":"#32FF00",
            "width":"200px",
            "border":"2px solid",
            "border-color":"green",
        }
    },
    color: "#32FF00",               
    resource: "additives",          
    row: 1,         
    branches:['n']  ,                    
    baseResource: "points",                 
    baseAmount() { return player.points }, 

    requires(){        
        let base =  d(250).times((player.s.unlocked&&!player.a.unlocked)?20:1)
        if(inChallenge('al',11)) base = base.div(24.8)
        return base
    },   
    type: "static",                         
    exponent: 1.35,                       
    gainMult() {                          
        let multi = d(1).div(player.r.la3)
        if (hasUpgrade('s', 43)) multi = multi.times(upgradeEffect('s', 43).pow(-1))
        if (hasUpgrade('e', 51)) multi = multi.times(upgradeEffect('e', 51).pow(-1)).times(buyableEffect('e',22).pow(-1)).times(buyableEffect('e',24).pow(-1))
        if (hasAchievement('ac',21)) multi = multi.div(2)
        if (hasAchievement('ac',31)) multi = multi.div(5)
        if (hasAchievement('ac',72)) multi = multi.div(10)
        if (hasAchievement('ac',82) && !inChallenge('al',11)) multi = multi.div(achievementEffect('ac',82))
        if (hasUpgrade('n',52)) multi = multi.div(buyableEffect('n',41))
        if(inChallenge('al',11)) multi = multi.pow(player.al.alteredpow)
        if (inChallenge('r',11)) multi = multi.pow(player.r.chb)
        if(inChallenge('al',11) && hasUpgrade('m',43)) multi = multi.div(24.8)

        return multi                      
    },
    gainExp() {
        let exp  = d(1)
        if(inChallenge('e',13)) exp = d(0)
        if(player.r.c10.gt(0) && player.r.c10.neq(2)) exp = d(0)
        if(player.g.sacrificeactive[4].gte(1)) exp = d(0)
        return exp
    },
    resetDescription:"Increase for ",
    layerShown() { return (hasUpgrade('n', 14)||hasAchievement('ac',14)||hasAchievement('ac',15)) && !player.g.sacrificeactive[4].gte(1) },
    hotkeys: [
        {key: "a", description: "A: Reset for Additive", onPress(){if (true) buyBuyable('a',10)} , unlocked() {return tmp[this.layer].layerShown}},
    ],
    automate() {
        if((hasUpgrade('m',43) || hasMilestone('r',1)) && (!(inChallenge('al',11) && !hasUpgrade('m',43)) && !inChallenge('e',13) && tmp.a.gainExp.neq(0)) ) {
            if(player.points.pow(buyableEffect('t',21)).gte(static_cost('a',player.a.points.add(0),d(0.6)))) player.a.points = player.a.points.add(1)
            if(player.points.pow(buyableEffect('t',21)).gte(static_cost('a',player.a.points.add(9),d(0.6)))) player.a.points = player.a.points.add(10)
            if(player.points.pow(buyableEffect('t',21)).gte(static_cost('a',player.a.points.add(99),d(0.6)))) player.a.points = player.a.points.add(100)
            if(player.points.pow(buyableEffect('t',21)).gte(static_cost('a',player.a.points.add(999),d(0.6)))) player.a.points = player.a.points.add(1000)
        }

            let base = d(100)
            if (hasUpgrade('e', 53)) base = base.add(upgradeEffect('e', 53))
            if (hasUpgrade('a', 42)) base = base.add(upgradeEffect('a', 42))
            if(hasChallenge('d',13)) base = base.times(challengeEffect('d',13))
            if (player.r.tetration.gte(3)) base = base.times(1.25)
            if(hasSuperAchievement('ac',72)) base = base.times(1.05)

            if (hasChallenge('e', 12)) base = base.times(challengeEffect('e',12))
            if (inChallenge('r',11)) base = base.div(player.r.che)
            player.a.startsoftcap = base.max(1)
            player.a.first = d(0)
    },
    doReset(resettingLayer) {
        let keep = [];
        if ( hasMilestone("e",3) && resettingLayer=="e") keep.push("upgrades")
        if ( hasMilestone("e",3) && resettingLayer=="e" && (inChallenge('e',12) || inChallenge('e',11))) keep.push("points")
        if (layers[resettingLayer].row > this.row && !hasUpgrade('r',13)) layerDataReset("a", keep)
    },
    effect() {
    //
        let a1 = player.s.points.add(1).log(10).times(0.1)
        let a2 =  player[this.layer].points.add(1).log(10).times(0.07)
        let base = d(1.5)
        if (hasUpgrade('a', 23) && !player.r.buyables[121].gte(1)) base = base.add(a1)
        if (hasUpgrade('a', 31) && !player.r.buyables[121].gte(1)) base = base.add(a2)
        if(player.r.buyables[121].gte(1)) base =  base.add(a1).add(a2).add(0.15)
        if (hasUpgrade('a', 32) && !player.r.buyables[121].gte(1)) base = base.add(0.05)
        if (hasUpgrade('m',73)&& !player.r.buyables[121].gte(1)) base = base.add(0.1)
        if (player.r.tetration.gte(3)) base = base.add(0.2)
        if (hasAchievement('ac',63)) base = base.add(achievementEffect('ac',63))
        return base
    },
   
    infoboxes: {
    lore: {
        title: "Additive cost",
        body() {
            let start = player.a.startsoftcap
            return "Additive cost scaling starting : "+Qcolor2('a',format(start),0)+" </br> Additive gain multiplier : x"+Qcolor2('a',format(tmp.a.directMult))+"<br> Cost reduction : /"+Qcolor2('n',format(tmp.a.gainMult.pow(-1)))+" </br> Current additive : "+Qcolor2('a',format(player.a.points))+""  },
    },
},
    buyables: {
        10: {
            title() {
                if(!player.a.unlocked) return "You haven't unlocked this layer yet"
                let a = ""
                a += "<br><br> Next at "+format(static_cost('a',player.a.points,d(0.6)))+" Points" 
                return tmp[this.layer].gainExp.eq(0)?"Cannot reset":"Reset for +1 Additive"+a
               } ,
            cost(x) { 
                return d(0) },
            tooltip() {return ""},
            canAfford() {
                return player.points.gte(static_cost('a',player.a.points,d(0.6))) && tmp[this.layer].gainExp.neq(0)
            },
            buy() {
                doReset(this.layer,true)
                player[this.layer].points = player[this.layer].points.add(getResetGain(this.layer))
            },
            style() {
                if (this.canAfford())  return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': tmp[this.layer].color,
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
                else if (tmp[this.layer].gainExp.neq(0))  return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': 'red',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
				else return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': 'crimson',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } }
        },
    },
    upgrades: {
        21: {
            title: "Addition",
            description: "Multiply points gain per unspent additive",
            tooltip() {
                let a  = ""
                if(upgradeEffect(this.layer,this.id).gte("1e600")) a = Qcolor2('red2','<i>Effect reduced above 1e600x (^0.1)')
                return "Current upgrade base : "+format(tmp.a.effect,3)+" <br> Base bonus : "+format(d(1.5).pow(player.a.points))+"x <br> Additional bonus : "+format(tmp.a.effect.div(1.5).pow(player.a.points))+"x "+a
            },
            ttStyle() {
                return {
                    "color": "#32FF00",
                    "width":"250px",
                    "border":"2px solid",
                    "border-color":"#32FF00",
                }
            },
            cost: d(1),
            effect() {
                let eff = player[this.layer].points.add(1)
                let base = tmp.a.effect

                let base1 = base.pow(eff)
                let base2 = softcap(base1,d("1e600"),0.1)
                return base2
            },
            effectDisplay() { 
                let a = ""
                if(upgradeEffect(this.layer,this.id).gte("1e600")) a = "()"
                return shiftDown?""+format(d(1.5).pow(player.a.points))+"x (base bonus)":format(upgradeEffect(this.layer, this.id))+"x "+a+""
            },
            unlocked() {return !player.r.buyables[121].gte(1)} },
        22: {
            title: "Numberic increase",
            description: "Increase Numbers gain based on additive",
            cost: d(3),
            unlocked() { return hasUpgrade("a", 21) },
            effect() {
                let eff = player[this.layer].points.add(3).pow(0.5)
                let eff2 =  eff.pow(buyableEffect('e',32))
                if(player.r.buyables[121].gte(1)) eff2 = eff2.pow(0)
                return eff2
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        23: {
            title: "More addition",
            description: "Addtive upgrade 'Addition' is more effective based on subtractive",
            tooltip() {return player.s.unlocked?"":"Because you haven't unlocked Subtractive yet , you will be refunded on purchase"},
            cost: d(4),
            onPurchase() {
                if(!player.s.unlocked) player.a.points = player.a.points.add(4)
            },
            unlocked() { return hasUpgrade("a", 22) && !player.r.buyables[121].gte(1) },
            effect() {
                let eff = player.s.points.add(1).log(10).times(0.1)
                if(player.r.buyables[121].gte(1)) eff = eff.times(0)
                return eff
            },
            effectDisplay() { return ""+format(upgradeEffect(this.layer, this.id))+" base" },},
        24: {
            title: "New upgrade",
            description: "Unlock 4 more number upgrade",
            cost: d(7),
            unlocked() { return hasUpgrade("a", 23) && !player.r.buyables[121].gte(1) },
            }, 
        31: {
            title: "Crazed addition",
            description() {return "'Addition' additive upgrade is more effective based on additives"},
            cost: d(48),
            unlocked() { return (hasUpgrade("m" , 51) || hasUpgrade('a',31)) && !player.r.buyables[121].gte(1)},
            effect() {
                let eff = player[this.layer].points.add(1).log(10).times(0.07)
                if(player.r.buyables[121].gte(1)) eff = eff.times(0)
                return eff
            },
            effectiveness() {
                return (d(1).add(upgradeEffect(this.layer,this.id).div(1.5))).pow(player.a.points.min(600))
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+" base" },},
        32: {
            title: "Stronger additive",
            description: "Increase 'Addition' additive upgrade base",
            cost: d(51),
            unlocked() { return hasUpgrade("a", 31) && !player.r.buyables[121].gte(1) },
            effectiveness() {
                return (d(1).add(d(0.05).div(1.5))).pow(player.a.points.min(600))
            },
            effectDisplay() { return "+0.05 base" }
        },
        33: {
            title: "Multiplier automation",
            description: "Gain a percentage of your multiplicatives passively per second (based on additives)",
            cost: d(54),
            unlocked() { return hasUpgrade("a", 32) && !player.r.buyables[121].gte(1)},
            effect() {
                let eff = player[this.layer].points.add(1).times(0.2)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"%" }, },
        34: {
            title: "5th Grade",
            description: "Unlock a new layer and x1.5 Number gain",
            cost: d(57),
            unlocked() { return hasUpgrade("a", 33) && !player.r.buyables[121].gte(1)},
            onPurchase() {
                player.d.unlocked = true   
            },
            },    
        41: {
            title: "Multiplicative Extension",
            description: "3x 'Points Boost' max level and unlock additional tick upgrades",
            cost() {
                let base = d(160)
                if(hasUpgrade('a',42)) base = base.add(10)
                if(hasUpgrade('a',43)) base = base.add(8)
                if(hasUpgrade('a',44)) base = base.add(6)

                return base
            },
            unlocked() { return buyableEffect("e",33).gte(1) },},
        42: {
            title: "Delay additive ",
            description: "Additive cost scaling starts later based on Perk Power",
            cost() {
                let base = d(160)
                if(hasUpgrade('a',41)) base = base.add(4)
                if(hasUpgrade('a',43)) base = base.add(8)
                if(hasUpgrade('a',44)) base = base.add(6)

                return base
            },
            unlocked() { return buyableEffect("e", 33).gte(1) && !player.r.buyables[121].gte(1) },
            effect() {
                let eff = player.e.perkpower.add(2).pow(1.2).times(1/2).max(1).min(250)
                if(player.r.buyables[121].gte(1)) eff = eff.times(0)
                return eff
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+"" }, },
        43: {
            title: "Additive Perk",
            description: "Multiply Perk points gain based on Additive",
            cost() {
                let base = d(160)
                if(hasUpgrade('a',41)) base = base.add(4)
                if(hasUpgrade('a',42)) base = base.add(10)
                if(hasUpgrade('a',44)) base = base.add(6)
                
                return base
            },
            unlocked() { return buyableEffect("e", 33).gte(1) },
            effect() {
                let eff = player.a.points.min(1750).times(0.0004).add(1)
                if(player.r.buyables[121].gte(1)) eff = eff.times(1.18)
                return eff
            },
            effectDisplay() { return ""+format(upgradeEffect(this.layer, this.id))+"x" }, },
        44: {
            title: "Spectral Perk",
            description: "Multiply Number gain based on Perk Power",
            cost() {
                let base = d(160)
                if(hasUpgrade('a',42)) base = base.add(10)
                if(hasUpgrade('a',43)) base = base.add(8)
                if(hasUpgrade('a',41)) base = base.add(4)

                return base
            },
            unlocked() { return buyableEffect("e", 33).gte(1) && !player.r.buyables[121].gte(1) },
            effect() {
                let eff = player.e.perkpower.add(1).pow(10)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)

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
                    ["row", [["buyable", 10]]],
                    ["blank","25px"],
                    ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade",24]]],
                    ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33],["upgrade",34]]],
                    ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43],["upgrade",44]]],



    ],},
},},
    tabFormat: [
        ["raw-html", function () { 
            let a = !options.hidemastery?"=> x"+format(player.r.additivemastery)+" Mastery":""
            return "<h3>You have  " + format(player.a.points,0)+" Additive "+a+""}, { "color": "lime", "font-size": "22px"}],
        ["raw-html", function () { return player.a.points.gt(player.g.corruption[1]) && shiftDown?"<h3>Additive corruption : After "+format(player.g.corruption[1],0)+" additive , increase total additive cost from <br> (cost) => 10^(log<sub>10</sub>cost)^" +format((player.a.points.div(player.g.corruption[1])).max(1),4)+"":"" }, { "color": "red", "font-size": "20px"}],    

        ["microtabs", "stuff", { 'border-width': '0px' }],
        ["blank","100px"],
    ],
    deactivated() {
        return player.g.sacrificeactive[4].gte(1)
    },
})

addLayer("s", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: d(0),
        startsoftcap:d(100),
        startsoftcap2:d(2048),
        best: d(0),
        first: d(0),
    }},
    directMult() {
        let base = d(1)
        base = base.times(player.g.artifactset1[2])
        if(hasSuperAchievement('ac',24)) base = base.times(1.05)
        return base
    },
    tooltip() {
        return ""+format(player.s.points,0)+" Subtractive </br> Next at "+format(static_cost('s',player.s.points,d(0.6)))+""},
    ttStyle() {
        return {
            "color":"#FF0000",
            "width":"200px",
            "border":"2px solid",
            "border-color":"red",
        }
    },

    color: "#FF0000",                       // The color for this layer, which affects many elements.
    resource: "subtractives",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    branches:['n'], 
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.
    requires(){
        
        let base =  d(250).times((player.a.unlocked&&!player.s.unlocked)?100:1)
        if(inChallenge('al',11)) base = base.div(24.8)
        return base
},              
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency. (2^x^1.35)
    exponent: 1.35,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                  
        let multi = d(1).div(player.r.da3)
        if (hasUpgrade('e', 51)) multi = multi.times(upgradeEffect('e', 51).pow(-1)).times(buyableEffect('e',21).pow(-1)).times(buyableEffect('e',24).pow(-1))
        if (hasAchievement('ac',24)) multi = multi.div(10)
        if (hasAchievement('ac',72)) multi = multi.div(10)
        if (hasAchievement('ac',83) && !inChallenge('al',11)) multi = multi.div(achievementEffect('ac',83))
        if (hasAchievement('ac',94) && hasUpgrade('s',43)) multi = multi.div(upgradeEffect('s',43))
        if(inChallenge('al',11)) multi = multi.pow(player.al.alteredpow) 
        if (inChallenge('r',11)) multi = multi.pow(player.r.chb)
        if(inChallenge('al',11) && hasUpgrade('m',43)) multi = multi.div(24.8)
        if (hasUpgrade('n',52)) multi = multi.div(buyableEffect('n',42))
        return multi     
    },
    gainExp() {                  
        let exp = d(1)
        if(inChallenge('e',13)) exp = d(0)
        if(player.r.c10.gt(0) && player.r.c10.neq(3)) exp = d(0)
        if(player.g.sacrificeactive[4].gte(1)) exp = d(0)
        return exp
    },
    resetDescription:"Reduce for ",


    layerShown() { return (hasUpgrade('n', 14)||hasAchievement('ac',15)||hasAchievement('ac',14)) && !player.g.sacrificeactive[4].gte(1) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "s", description: "S: Reset for Subtractive", onPress(){if (true) buyBuyable('s',10)} , unlocked() {return tmp[this.layer].layerShown}},
    ],
    doReset(resettingLayer) {
        let keep = [];
        if ( hasMilestone("e",3) && resettingLayer=="e") keep.push("upgrades")
        if ( hasMilestone("e",3) && resettingLayer=="e" && (inChallenge('e',12) || inChallenge('e',11))) keep.push("points")
        if (layers[resettingLayer].row > this.row && !hasUpgrade('r',13)) layerDataReset("s", keep)
    },
    infoboxes: {
        lore: {
            title: "Subtractive cost",
            body() {
                let start = player.s.startsoftcap
                return "Subtractive cost scaling starting : "+Qcolor2('a',format(start),0)+" </br> Subtractive gain multiplier : x"+Qcolor2('a',format(tmp.s.directMult))+"<br> Cost reduction : /"+Qcolor2('n',format(tmp.s.gainMult.pow(-1)))+" </br> Current subtractive : "+Qcolor2('a',format(player.s.points))+""  },
        },
    },
    automate() {
        if((hasUpgrade('m',43) || hasMilestone('r',1)) && (!(inChallenge('al',11) && !hasUpgrade('m',43)) && !inChallenge('e',13) && tmp.s.gainExp.neq(0))) {
            if(player.points.pow(buyableEffect('t',21)).gte(static_cost('s',player.s.points.add(0),d(0.6)))) player.s.points = player.s.points.add(1)
            if(player.points.pow(buyableEffect('t',21)).gte(static_cost('s',player.s.points.add(9),d(0.6)))) player.s.points = player.s.points.add(10)
            if(player.points.pow(buyableEffect('t',21)).gte(static_cost('s',player.s.points.add(99),d(0.6)))) player.s.points = player.s.points.add(100)
            if(player.points.pow(buyableEffect('t',21)).gte(static_cost('s',player.s.points.add(999),d(0.6)))) player.s.points = player.s.points.add(1000)           
        }
            let base = d(100)
            if (hasUpgrade('e', 54)) base = base.add(upgradeEffect('e', 54))


            if (hasChallenge('e', 12)) base = base.times(challengeEffect('e',12))
            if (hasUpgrade('s', 53)) base = base.times(1.1)
            if(hasChallenge('d',13)) base = base.times(challengeEffect('d',13))
            if (player.r.tetration.gte(3)) base = base.times(1.25)
            if(hasSuperAchievement('ac',72)) base = base.times(1.05)
            if (inChallenge('r',11)) base = base.div(player.r.che)
            player.s.startsoftcap = base.max(1)




            player.s.first = d(0)


    },
    buyables: {    
        10: {
            title() {
                if(!player.s.unlocked) return "You haven't unlocked this layer yet"
                let a = ""
                a += "<br><br> Next at "+format(static_cost('s',player.s.points,d(0.6)))+" Points" 
                return tmp[this.layer].gainExp.eq(0)?"Cannot reset":"Reset for +1 Subtractive"+a
               } ,
            cost(x) { 
                return d(0) },
            tooltip() {return ""},
            canAfford() {
                return player.points.gte(static_cost('s',player.s.points,d(0.6))) && tmp[this.layer].gainExp.neq(0)
            },
            buy() {
                player[this.layer].points = player[this.layer].points.add(getResetGain(this.layer))
                doReset(this.layer,true)
            },
            style() {
                if (this.canAfford())  return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': tmp[this.layer].color,
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
                else if (tmp[this.layer].gainExp.neq(0))  return {
                    'border-radius': '25%',
                    'color':'white',
                    'background-color': 'gray',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
				else return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': 'crimson',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } }
        },
    },
    upgrades: {
        31: {
            title: "Subtract?",
            description: "Increase number gain based on subtractive",
            cost: d(1),
            effect() {
                let eff = player[this.layer].points.add(2)
                let ex = d(1.11).times(buyableEffect('e',31))
                eff = eff.pow(ex)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return !player.r.buyables[121].gte(1)} },
        32: {
            title: "Postive synergy",
            description: "Number upgrade 'Headstart' and 'Effective counting' is boosted based on additive",
            tooltip() {return player.a.unlocked?"":"Because you haven't unlocked Additive yet , you will be refunded on purchase"},
            onPurchase() {
                if(!player.a.unlocked) player.s.points = player.s.points.add(3)
            },
            cost: d(3),
            unlocked() { return hasUpgrade("s", 31) && !player.r.buyables[121].gte(1) },
            effect() {
                let eff = d(1.3).add(player.a.points.times(0.1))
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)
                return eff
            },
            effectDisplay() { return !shiftDown?format(upgradeEffect(this.layer, this.id))+"x":"Effective : "+format(upgradeEffect(this.layer,this.id).pow(2))+"x to Points gain" }, },
        33: {
            title: "Automatic counting",
            description: "Gain a percentage of your number gain on Number reset per second (based on subtractive)",
            cost: d(6),
            unlocked() { return hasUpgrade("s", 32) && !player.r.buyables[121].gte(1) },
            effect() {
                 let eff = d(5).times(player[this.layer].points.add(1))
                 if(player.r.buyables[121].gte(1)) eff = eff.times(0)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"%" }, },
        41: {
            title: "Faster Automation",
            description: "Speed up number passive production based on subtractive",
            cost() {
               let base = d(18)
               if(hasUpgrade('s',42)) base = base.add(2)
               if(hasUpgrade('s',43)) base = base.times(1.5).add(8).floor()
               return base
            },
            unlocked() { return hasUpgrade("m", 44) || hasUpgrade('s',41)},
            effect() {
                 let eff = player[this.layer].points.add(2).pow(1.5)
                 if(hasUpgrade('s',51)) eff = eff.pow(upgradeEffect('s',51))
                 if(hasUpgrade('s',42)) eff = eff.pow(upgradeEffect('s',42))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        42: {
            title: "Stronger Subtractive",
            description: "Subtractive strengthens the effect of all upgrade in this row",
            tooltip() {return !hasUpgrade('m',72)?"+0.5% per subtractive and is capped at +20%":"+0.5% per subtractive and is softcapped at +20%"},
            cost() {
               let base = d(18)
               if(hasUpgrade('s',41)) base = base.add(4)
               if(hasUpgrade('s',43)) base = base.times(1.5).add(8).floor()
               return base
            },
            unlocked() { return hasUpgrade('m',44) || hasUpgrade('s',42)},
            effect() {
                let point = player[this.layer].points.max(0).times(0.5)
                if(!hasUpgrade('m',72)) point = point.min(20)
                if (hasUpgrade('m',72)) point = softcap(point,d(20),0.5)
                let multi = d(1).add(point.times(0.01))

                let eff = player.s.points.times(0.02).add(1)
                eff = softcap(eff,d(32),0.5)

                if(hasAchievement('ac',128)) multi = multi.times(eff).root(2)
                return multi
            } ,
            effectDisplay() {
                if(hasAchievement('ac',128)) return "^"+format(upgradeEffect(this.layer,this.id))+" (Balanced)"
                if(!hasAchievement('ac',128)) return "^"+format(upgradeEffect(this.layer,this.id))+""}
            },
        43: {
            title: "Additive cheapener",
            description() {return hasAchievement('ac',94)?"Divide the cost of additive and subtractive based on subtractive":"Divide the cost of additive based on subtractive"},
            cost() {
               let base = d(18)
               if(hasUpgrade('s',42)) base = base.add(2)
               if(hasUpgrade('s',41)) base = base.add(3)
               return base
            },
            tooltip() {return "Effect is reduced after 24 subtractives"},
            unlocked() { return hasUpgrade("m",44) || hasUpgrade('s',43)},
            effect() {
                 let eff = player[this.layer].points.add(1).times(2)
                 let power = player[this.layer].points.times(0.5).add(1).min(14)
                 let effect1 = eff.pow(power)
                 if(hasUpgrade('s',42)) effect1 = effect1.pow(upgradeEffect('s',42))
                return effect1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        51: {
            title: "Fastest automation",
            description: "Subtractive affects 'Faster automation' even more",
            cost() {
                let base = d(160)
                if(hasUpgrade('s',52)) base = base.times(1.15)
                if(hasUpgrade('s',53)) base = base.times(1.15)

                return base.floor()
            },
            unlocked() { return buyableEffect("e", 34).gte(1) },
            effect() {
                let eff = player.s.points.times(0.02).add(1)
                eff = softcap(eff,d(32),0.5)

                let point = player[this.layer].points.max(0).times(0.5)
                if(!hasUpgrade('m',72)) point = point.min(20)
                if (hasUpgrade('m',72)) point = softcap(point,d(20),0.5)
                let multi = d(1).add(point.times(0.01))
                
                if(hasAchievement('ac',128)) eff = eff.times(multi).root(2)
                return eff
            },
            effectDisplay() { 
                if(hasAchievement('ac',128)) return "^"+format(upgradeEffect(this.layer,this.id))+" (Balanced)"
                if(!hasAchievement('ac',128)) return "^"+format(upgradeEffect(this.layer, this.id))+"" },
             },
        52: {
            title: "Easier Exponent",
            description: "Reduce Exponent cost scaling base by 1%",
            cost() {
                let base = d(160)
                if(hasUpgrade('s',51)) base = base.times(1.15)
                if(hasUpgrade('s',53)) base = base.times(1.15)

                return base.floor()
            },
            unlocked() { return buyableEffect("e", 34).gte(1) && !player.r.buyables[121].gte(1) }, },
        53: {
            title: "Slow Subtractive",
            description: "Subtractive cost scaling starts x1.1 later",
            cost() {
                let base = d(160)
                if(hasUpgrade('s',52)) base = base.times(1.15)
                if(hasUpgrade('s',51)) base = base.times(1.15)

                return base.floor()
            },
            unlocked() { return buyableEffect("e", 34).gte(1) }, },
    
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
                    ["row", [["buyable", 10]]],
                    ["blank","25px"],
                    ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33]]],
                    ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43]]],
                    ["row", [["upgrade", 51],["upgrade", 52],["upgrade", 53]]],



    ],},
},},
    tabFormat: [
        ["raw-html", function () { 
            let a = options.hidemastery?"":"=> x"+format(player.r.subtractivemastery)+" Mastery"
            return "<h3>You have  " + format(player.s.points,0)+" Subtractive "+a+""}, { "color": "red", "font-size": "22px"}],
        ["raw-html", function () { return player.s.points.gt(player.g.corruption[2]) && shiftDown?"<h3>Subtractive corruption : After "+format(player.g.corruption[2],0)+" subtractive , increase total subtractive cost from <br>(cost) => 10^(log<sub>10</sub>cost)^" +format((player.s.points.div(player.g.corruption[2])).max(1),4)+"":"" }, { "color": "red", "font-size": "20px"}],    
        ["microtabs", "stuff", { 'border-width': '0px' }],
        ["blank","100px"],
    ],
    deactivated() {
        return player.g.sacrificeactive[4].gte(1)
    },
})

addLayer("m", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: d(0),
        first: d(0),
    }},

    color: "#29AC7F",                       // The color for this layer, which affects many elements.
    resource: "multiplicative",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    branches:['n'], 
    baseResource: "numbers",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.n.points },  // A function to return the current amount of baseResource.
    automate() {
        player.m.first = player.points.times(0)
    },
    tooltip() {
        return ""+format(player.m.points)+" Multiplicative"
    },
    ttStyle() {
        return {
            "color":"#68e3ac",
            "width":"200px",
            "border":"2px solid",
            "border-color":"cyan",
        }
    },
    requires() {
        let req = d("1e8")
        if(inChallenge('al',11)) req = req.div(100000)
        return req},              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    softcap() {return player.g.corruption[3]},
    softcapPower() {return 0},
    directMult() {
        let mult = d(1)
        if(tmp.m.resourcegain.gte(player.g.corruption[3])) mult = mult.times(postcorruptiongain(tmp.m.resourcegain,0.225,player.g.corruption[3])).div(player.g.corruption[3]).max(1)
        return mult
    },
    resourcegain() {
        return (player.n.points.div(tmp.m.requires).pow(0.5).times(tmp.m.gainMult)).pow(tmp.m.gainExp)
    },
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = d(1).times(buyableEffect('r',101)).times(player.r.da1)
        if (hasUpgrade('m', 42)) multi = multi.times(2)
        if (hasAchievement('ac',26)) multi = multi.times(1.1)
        if (hasAchievement('ac',84) && !inChallenge('al',11)) multi = multi.times(achievementEffect('ac',84))
        if(player.g.effectWeight[1].gte(1)) multi = multi.times(tmp.e.effect.root(100).pow(player.g.effectWeight[1]))

        return multi 
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        let exp = d(1)
        if(inChallenge('al',11)) exp = exp.times(player.al.alteredpow)
        if (inChallenge('r',11)) exp = exp.times(player.r.chb)
        if(player.g.effectWeight[1].gte(1)) exp = exp.times(tmp.e.expeffect.root(100).pow(player.g.effectWeight[1]))
        if (inChallenge('e',13)) exp = exp.times(0)
        if(player.r.c10.gt(0) && player.r.c10.neq(4)) exp = d(0)
        exp = exp.times(player.g.artifactset1[3])
        if(hasSuperAchievement('ac',26)) exp = exp.times(1.05)
        if (hasUpgrade('n',52)) exp = exp.times(buyableEffect('n',22))
        if(player.g.sacrificeactive[0].gte(1)) exp = exp.times(2.5)
        if(player.g.sacrificeactive[4].gte(1)) exp = d(0)
        return exp
    },
    resetDescription:"Multiply for ",

    layerShown() { return (hasUpgrade('n', 24)||hasAchievement('ac',25)) && !player.g.sacrificeactive[4].gte(1) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "m", description: "M: Reset for Multiplicative", onPress(){if (true) buyBuyable('m',10)} , unlocked() {return tmp[this.layer].layerShown}},
    ],
    passiveGeneration() { 
        let numpas = d(0)
        if (hasMilestone('r',2)) numpas = numpas.add(1)
        if (hasUpgrade('a', 33)) numpas = numpas.add(upgradeEffect('a', 33)).times(0.01)
        if (hasMilestone('e',2) && !inChallenge('e',11) && !inChallenge('e',12)) numpas = numpas.add(1)
        return numpas.times(tmp.t.effect.clampMax(player.t.cap).times(0.001)).times(player.r.truegamespeed) },
    infoboxes: {
            lore: {
                title: "Multiplicative gain",
                body() {
                    let a = ""
                    if(player.m.points.gte(player.g.corruption[3])) a = a += "<br> Corruption : /"+Qcolor2('d',format(((player.n.points.div(tmp.m.requires).pow(0.5).times(tmp.m.gainMult)).pow(tmp.m.gainExp)).div(player.g.corruption[3]).pow(1)))+" <br> Post corruption multiplier : "+Qcolor2('n',format(tmp.m.directMult))+""
                    return "Base : +"+Qcolor2('a',format(player.n.points.div(tmp.m.requires).pow(0.5)))+" <br> Multiplier : x"+Qcolor2('n',format(tmp.m.gainMult))+" <br> Exponent : ^"+Qcolor2('e',format(tmp.m.gainExp))+" <br> Total gain : "+Qcolor2('m',format(((player.n.points.div(tmp.m.requires).pow(0.5).times(tmp.m.gainMult)).pow(tmp.m.gainExp))))+" "+a+" <br> Passive generation : x"+Qcolor2('r',format(tmp.m.passiveGeneration))+" <br> Passive gain : +"+Qcolor2('a',format(generateAmount('m')))+"/s"},
                unlocked() {return true}
            },
        },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("e",5) && resettingLayer=="e") keep.push("challenges")
        if (hasMilestone("e",6) && resettingLayer=="e")  keep.push("upgrades")
        if (layers[resettingLayer].row > this.row && !hasUpgrade('r',15) && !hasSuperAchievement('ac',56)) layerDataReset("m", keep)
    },
    update(delta) {
        if(hasAchievement('ac',36)) {
            let v = d(0)
            let u = player.m.points.max(1)
            if(hasAchievement("ac",55)) u = u.root(achievementEffect('ac',55))
            if (hasAchievement('ac',77)) u = u.root(0.5)
            u = u.root(player.g.artifactset2[1])
            let base = d(100)
            if (hasAchievement('ac',35)) base = base.times(2)

            if(hasUpgrade('a',41)) base = base.times(3)
            if(hasUpgrade('m',64)) base = base.times("1e100")

            if(u.lte(d(2).pow(600))) v = u.log(2)
            if(u.gt(d(2).pow(600))) v = (u.log(2).div(600)).root(1.5).times(600)

            v = v.add(1).floor().max(player.m.buyables[11]).min(base)

            let tv = player.m.points.add(10).log(10).root(1.5)
            let qv = (v.sub(player.m.buyables[11])).div(20)
            dv = (tv.add(qv)).times(delta).ceil()
            if(hasMilestone('g',4)) dv = d("1e100")
            if(player.g.sacrificeactive[4].gte(1)) dv = d(0)
            player.m.buyables[11] = (player.m.buyables[11].add(dv)).min(v)
        }
    },
    buyables: {
        10: {
                title() {
                    let a = ""
                    if(getResetGain('m').lt(100)) a += "<br><br> Next at "+format(getNextAt('m'))+" Number" 
                    return tmp[this.layer].gainExp.eq(0)?"Cannot reset":"Reset for +"+format(getResetGain('m'),0)+ " Multiplicative"+a
                   } ,
                cost(x) { 
                    return d(0) },
                tooltip() {return ""},
                canAfford() {
                    return player.n.points.gte(tmp[this.layer].requires) && getResetGain(this.layer).neq(0)
                },
                buy() {
                    player[this.layer].points = player[this.layer].points.add(getResetGain(this.layer))
                    doReset(this.layer,true)
                },
                style() {
                    if (this.canAfford())  return {
                        'border-radius': '25%',
                        'color':'black',
                        'background-color': tmp[this.layer].color,
                        'border':'2px solid',
                        'border-color':'black',
                        'height': '125px'
                    } 
                    else if (tmp[this.layer].gainExp.neq(0))  return {
                        'border-radius': '25%',
                        'color':'black',
                        'background-color': 'red',
                        'border':'2px solid',
                        'border-color':'black',
                        'height': '125px'
                    } 
                    else return {
                        'border-radius': '25%',
                        'color':'black',
                        'background-color': 'crimson',
                        'border':'2px solid',
                        'border-color':'black',
                        'height': '125px'
                    } }
            },
        11: {
            title() {
            let c = this.bonuslevel().eq(1)?"":" * "+this.bonuslevel()+" = "+format(player.m.buyables[11].times(this.bonuslevel()))+""
            let b = format(player.m.buyables[this.id],0)
            let a = player.m.buyables[11].gt(600)?"Expensive":""
             return b +""+c+"<br/> "+a+" Points Boost"
            },
            bonuslevel() {
                let bonus = d(1)
                if(player.r.tetration.gte(19)) bonus = bonus.times(player.r.challengeshard.div(100).times(3).add(1))
                return bonus
            },
            cost(x) { 
                let level = x
                if(level.gt(600)) level = (level.div(600)).pow(1.5).times(600)    
                let cost =  (d(2)).pow(level)
            
                if(hasAchievement("ac",55)) cost = cost.pow(achievementEffect('ac',55))
                if (hasAchievement('ac',77)) cost = cost.pow(0.5) 
                cost = cost.pow(player.g.artifactset2[1])

                return cost
            },
            tooltip() {
                let text = ""
                if(this.effect().gte("1e1000")) text = Qcolor2('red2',"(Corrupted) @ Effect decreased")
                 return "Multiply "+Qcolor2('n',"points")+" gain by " +Qcolor2('n',format(this.effect())) +"x => "+Qcolor2('n',format(this.nexteffect()))+"x <br> ("+format(this.nexteffect().max(1).div(this.effect().max(1)))+"x per) <br> Cost : " +Qcolor2('n',format(this.cost())+" Multiplicative") +" <br>"+text 
                },
            ttStyle() {
                return {
                    "color": "#68e3ac",
                    "width":"250px",
                    "border":"2px solid",
                    "border-color":"#68e3ac",
                }
            },
            canAfford() { return player.m.points.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',36)) {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let level = x
                if(x.lte(5)) level = level.times(3)
                if(x.gte(6) && x.lte(30)) level = level.times(0.6).add(12)
                level = level.times(this.bonuslevel())
                let base = level.add(1).pow(0.75)
                let exp = level.add(10).log(10)
                if(hasUpgrade('m',52)) exp = exp.times(1.3)
                if(hasUpgrade('m',52) && player.r.buyables[121].gte(1)) exp = exp.times(7)
                if(hasUpgrade('m',54) && !player.r.buyables[121].gte(1)) exp = exp.times(1.4)
                if(hasChallenge('d',12)) exp = exp.times(challengeEffect('d',12))
                if(hasAchievement('ac',47)) exp = exp.times(1.5)
                if(hasUpgrade('m',63) && !player.r.buyables[121].gte(1)) exp = exp.times(5)
                let effect = base.pow(exp)
                if(player.r.tetration.gte(2)) effect = effect.times(d(2).pow(level.div(25))) 
                effect = effect.pow(player.g.artifactset3[2])
                effect = postcorruptiongain(effect , d(0.8) , d("1e1000"))
                if(player.g.sacrificeactive[4].gte(1)) effect = d(1)
                return effect
            },
            nexteffect() {
                return this.effect(player.m.buyables[this.id].add(1))
            },
            purchaseLimit() {
                let base = d(100)
                if (hasAchievement('ac',35)) base = base.times(2)

                if(hasUpgrade('a',41)) base = base.times(3)
                if(hasUpgrade('m',64)) base = base.times("1e100")
                return base
            },
            style() {
                if (player.m.buyables[11].gte(this.purchaseLimit())) return Qcolor('green')
                else if (this.effect().gte("1e1000")) return Qcolor('rgb(128,0,0)')
				else if (player.m.points.lt(this.cost())) return Qcolor()
				else return Qcolor('rgb(128,128,32)')
        }
    },
     
    },
    challenges: {
        11: {
            name: "Fatigued",
            challengeDescription() { return ""+Qcolor2('d','Square root')+" "+Qcolor2('n','points')+" gain"} ,
            goalDescription() {
                let base = d("1e9")
                if(player.g.sacrificeactive[6].gte(1)) base = base.times(256)
                if(player.r.tetration.gte(12) || player.g.sacrificeactive[6].gte(1)) base = base.tetrate(1.2)
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                return "Reach "+Qcolor2('n',format(base))+" points"},
            rewardDescription() { 
                let b = ""
                if(player.g.sacrificeactive[6].gte(1)) b = "& "+Qcolor2('blue3','Bits')+""
                return ""+Qcolor2('n','Points')+" "+b+" gain are boosted based on "+Qcolor2('n','multiplicative')+""
            },
            rewardEffect() {
                let m = player[this.layer].points.add(4).log(2).pow(1.25)
                if(hasUpgrade('r',104)) m = m.pow(player.r.buyables[101].div(100).add(1))
                if(player.r.tetration.gte(12)) m = m.tetrate(1.15)
                if(hasAchievement('ac',41)) m = m.pow(achievementEffect('ac',41)) 
                if(inChallenge('r',11)) m = m.pow(player.r.chj)
                return m
            },
            rewardDisplay() {
                let b = player.g.sacrificeactive[6].gte(1)?" "+Qcolor2('n','Points')+" , "+Qcolor2('green2',format(this.rewardEffect().add(10).log(10).tetrate(1.25)))+"x "+Qcolor2('blue3','Bits')+"":""
                return Qcolor2('a',format(this.rewardEffect()))+"x" + b
            },
            canComplete: function() {
                let base = d("1e9")
                if(player.g.sacrificeactive[6].gte(1)) base = base.times(1000)
                if(player.r.tetration.gte(12) || player.g.sacrificeactive[6].gte(1)) base = base.tetrate(1.2)
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                return player.points.gte(base)
            },
            style() {
                if(this.canComplete() && inChallenge('m',11)) return Qcolor('rgb(128,128,32)',250)
                if(hasChallenge('m',11)) return Qcolor('green',250)
                else return Qcolor('black',250)
            }
        },
        12: {
            name: "Halted Counter",
            challengeDescription() {return Qcolor2('d','Square root')+" "+Qcolor2('n','number')+" gain"} ,
            goalDescription() {
                let base = d("1e9")
                if(player.g.sacrificeactive[6].gte(1)) base = base.times(200)
                if(player.r.tetration.gte(12) || player.g.sacrificeactive[6].gte(1)) base = base.tetrate(1.225)
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                return "Reach "+Qcolor2('n',format(base))+" numbers"},
            rewardDescription() { 
                let a = ""
                if(player.g.sacrificeactive[6].gte(1)) a = " and "+Qcolor2('yellow3','All twilight resources')+""
                return ""+Qcolor2('n','Number')+" "+a+" gain are boosted based on "+Qcolor2('n','multiplicative')+""
            
            },
            rewardEffect() {
                let m = player[this.layer].points.add(3.5).log(2).pow(2)
                if(player.r.tetration.gte(12)) m = m.tetrate(1.15)
                if(hasAchievement('ac',42)) m = m.pow(achievementEffect('ac',42)) 
                if(inChallenge('r',11)) m = m.pow(player.r.chj)
                return m
            },
            rewardDisplay() {
                let b = ""
                if(player.g.sacrificeactive[6].gte(1)) b = " Number , "+Qcolor2('a',format(this.rewardEffect().add(10).log(10).pow(1.25).tetrate(1.15)))+"x "+Qcolor2('yellow3','All twilight resources')+""
                return Qcolor2('a',format(this.rewardEffect()))+"x"+b
            },
            canComplete: function() {
                let base = d("1e9")
                if(player.g.sacrificeactive[6].gte(1)) base = base.times(200)
                if(player.r.tetration.gte(12) || player.g.sacrificeactive[6].gte(1)) base = base.tetrate(1.225)
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                return player.n.points.gte(base)
            },
            style() {
                if(this.canComplete() && inChallenge('m',12)) return Qcolor('rgb(128,128,32)',250)
                if(hasChallenge('m',12)) return Qcolor('green',250)
                else return Qcolor('black',250)
            }
        },
        },


    
    upgrades: {
        41: {
            title: "Numberic increase 2",
            description: "x1.5 Number gain",
            cost: d(1),
            unlocked() {return !player.r.buyables[121].gte(1)}
        },
        42: {
            title: "Increased multiplicative",
            description: "x2 Multiplicatives gain",
            cost: d(10),
            unlocked() { return hasUpgrade("m", 41) }, },

        43: {
            title: "Glazed Points",
            description() {return"^1.05 Points gain <br> autobuy additive and subtractive "},
            cost: d(100),
            unlocked() { return hasUpgrade("m", 42) || player.r.buyables[121].gte(1)},
            },            
        44: {
            title: "Minus Upgrade",
            description: "Unlock 3 more subtractive upgrade",
            cost: d(700),
            unlocked() { return hasUpgrade("m", 43) },
            },    
        51: {
            title: "Additive upgrade",
            description: "Unlock 3 more additive upgrade",
            cost: d("2.5e8"),
            unlocked() { return hasUpgrade("m", 44) },},
        52: {
            title: "Greater Boost",
            description() { 
                let a = d("1.3")
                if(player.r.buyables[121].gte(1)) a = a.add(7.8)
                return "'Points Boost' multiplicative buyable effect is ^"+format(a)+" "},
            cost: d("1e12"),
            unlocked() { return hasUpgrade("m", 51) },},
        53: {
            title: "Automatic Division",
            description: "Gain a percentage of your divisive gain on reset per second (based on multiplicative)",
            cost: d("1e25"),
            unlocked() { return hasChallenge("d", 11) },
            effect() {
                 let eff = (player[this.layer].points.add(3).log(2).times(2).pow(1.5))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"%" }, },
        54: {
            title: "Greatest Boost",
            description: "'Points Boost' multiplicative buyable effect is ^1.40",
            cost: d("1e33"),
            unlocked() { return hasUpgrade("m", 53) && !player.r.buyables[121].gte(1)},},
        61: {
            title: "Strange 5",
            description: "Multiply your points gain by 5x",
            cost: d("1e36"),
            unlocked() { return hasUpgrade("m", 54) && !player.r.buyables[121].gte(1)}, },
        62: {
            title: "Better effect ",
            description: "Divisive effect is slightly better (^1.05)",
            cost: d("1e40"),
            unlocked() { return hasUpgrade("m", 61) }, },
        63: {
            title: "Significantly Stronger",
            description: "'Points Boost' multiplicative buyable effect is ^5",
            cost: d("1e1000"),
            unlocked() { return hasAchievement("ac", 56) && !player.r.buyables[121].gte(1) }, },
        64: {
            title: "Unlimited Boost",
            description: "Remove 'Points Boost' multiplicative buyable max level , but cost starts to increase much faster above level 600",
            cost() {
                let base = d("1e1050")
                if(hasAchievement('ac',91)) base = base.pow(0.02)
                return base},
            unlocked() { return hasAchievement("ac", 56) }, },
        71: {
            title: "More Exponent",
            description: "x1.02 Effective Exponent",
            cost: d("1e1250"),       
            unlocked() { return hasAchievement('ac',61) }, },
        72: {
            title: "Strongest Subtraction",
            description: "'Stronger Subtractive' upgrade is no longer capped at 20% , with diminishing effect afterwards",
            cost: d("1e1350"),
            unlocked() { return hasAchievement("ac", 61) }, },
        73: {
            title: "Additional Boost",
            description: "'Addition' additive upgrade base is increased by +0.1",
            cost: d("1e1500"),
            unlocked() { return hasAchievement("ac", 61) && !player.r.buyables[121].gte(1)}, },
        74: {
            title: "Slowest Exponent",
            description: "Reduce Exponent cost scaling base by 5%",
            cost: d("1e1600"),
            unlocked() { return hasAchievement("ac", 61) && !player.r.buyables[121].gte(1)}, }
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
                    ["row", [["buyable", 10]]],
                    ["blank","25px"],
                    ["row", [["buyable", 11]]],
                    ["blank","25px"],
                    ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43],["upgrade",44]]],
                    ["row", [["upgrade", 51],["upgrade", 52],["upgrade", 53],["upgrade",54]]],
                    ["row", [["upgrade", 61],["upgrade", 62],["upgrade", 63],["upgrade", 64]]],
                     ["row", [["upgrade", 71],["upgrade", 72],["upgrade", 73],["upgrade", 74]]],
                    ["blank","25px"],
                    "challenges",



    ],},
},},
    tabFormat: [
        ["raw-html", function () {  
            let a = options.hidemastery?"":"=> x"+format(player.r.multiplicativemastery)+" Mastery"
            return "<h3>You have  " + format(player.m.points)+" Multiplicative "+a+""}, { "color": "teal", "font-size": "22px"}],
        ["raw-html", function () { return tmp.m.passiveGeneration.times(getResetGain(this.layer)).gt(0)?"<h3>You are currently gaining " + format(tmp.m.passiveGeneration.times(getResetGain(this.layer)))+" Multiplicative/s":"" }, { "color": "teal", "font-size": "22px"}],
        ["raw-html", function () { return tmp.m.resourcegain.gt(player.g.corruption[3]) && shiftDown?"<h3>Multiplicative corruption : Starting at "+format(player.g.corruption[3])+" multiplicative gain . Excessive Multiplicative gain is rooted by "+format(corruptionroot(tmp.m.resourcegain,0.225,player.g.corruption[3]),4)+"":"" }, { "color": "red", "font-size": "20px"}],    
 
                ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
    deactivated() {
        return player.g.sacrificeactive[4].gte(1)
    },
})

addLayer("d", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: d(0),
        best: d(0),   
        first:d(0),
        timereq: d(1),
        reward: d(1), //Chaotic division reward
    }},

    color: "#822B2B",                       // The color for this layer, which affects many elements.
    resource: "divisive",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    tooltip() {
        return ""+f(player.d.points)+" Divisive"
    },
    ttStyle() {
        return {
            "color":"crimson",
            "width":"200px",
            "border":"2px solid",
            "border-color":"pink",
        }
    },

    baseResource: "numbers",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.n.points },  // A function to return the current amount of baseResource.

    requires() {
    let base = d("1e33")
    if(inChallenge('al',11)) base = base.div("1e15")
    if(inChallenge('al',11)) base = base.pow(0.4)
    return base },              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,
    branches:['n'],                           // "normal" prestige gain is (currency^exponent).
    softcap() {return player.g.corruption[4]},
    softcapPower() {return 0},
    resourcegain() {
        return (player.n.points.div(tmp.d.requires).pow(0.5).times(tmp.d.gainMult)).pow(tmp.d.gainExp)
    },
    directMult() {
        let mult = d(1)
        if(tmp.d.resourcegain.gte(player.g.corruption[4])) mult = mult.times(postcorruptiongain(tmp.d.resourcegain,0.275,player.g.corruption[4])).div(player.g.corruption[4])
        return mult
    },

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = d(1).times(buyableEffect('r',102)).times(player.r.da2)
        if (hasAchievement('ac',37)) multi = multi.times(2)
        if (hasAchievement('ac',85) && !inChallenge('al',11)) multi = multi.times(achievementEffect('ac',85))
        if(player.g.effectWeight[2].gte(1)) multi = multi.times(tmp.e.effect.root(100).pow(player.g.effectWeight[2]))
        return multi 
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        let exp = d(1)
        if (player.r.tetration.gte(5)) exp = exp.times(1.1)
        if(hasSuperAchievement('ac',37)) exp = exp.times(1.04)
        exp = exp.times(player.g.artifactset1[4])
        if(player.g.effectWeight[2].gte(1)) exp = exp.times(tmp.e.expeffect.root(100).pow(player.g.effectWeight[2]))
        if (inChallenge('r',11)) exp = exp.times(player.r.chb)
        if(inChallenge('al',11)) exp = exp.times(player.al.alteredpow)
        if (inChallenge('e',13)) exp = exp.times(0)
        if (hasUpgrade('n',52)) exp = exp.times(buyableEffect('n',31))
        if(player.g.sacrificeactive[0].gte(1)) exp = exp.times(2.5)
        if(player.r.c10.gt(0) && player.r.c10.neq(5)) exp = d(0)
        if(player.g.sacrificeactive[4].gte(1)) exp = d(0)
        return exp
    },
    resetDescription:"Divide for ",
    layerShown() { return (hasUpgrade('a', 34)||hasAchievement('ac',29)) && !player.g.sacrificeactive[4].gte(1)},          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "d", description: "D: Reset for Divisive", onPress(){if (true) buyBuyable('d',10)} , unlocked() {return tmp[this.layer].layerShown}},
    ],
    buyables: {    
        10: {
            title() {
                let a = ""
                if(getResetGain('d').lt(100)) a += "<br><br> Next at "+format(getNextAt('d'))+" Number" 
                return tmp[this.layer].gainExp.eq(0)?"Cannot reset":"Reset for +"+format(getResetGain('d'),0)+ " Divisive"+a
               } ,
            cost(x) { 
                return d(0) },
            tooltip() {return ""},
            canAfford() {
                return player.n.points.gte(tmp[this.layer].requires) && getResetGain(this.layer).neq(0)
            },
            buy() {
                player[this.layer].points = player[this.layer].points.add(getResetGain(this.layer))
                doReset(this.layer,true)
            },
            style() {
                if (this.canAfford())  return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': tmp[this.layer].color,
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
                else if (tmp[this.layer].gainExp.neq(0))  return {
                    'border-radius': '25%',
                    'color':'white',
                    'background-color': 'gray',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
				else return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': 'crimson',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } }
        },
        11: {
            title() {
                return "Reset your Number"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() {
                return player.r.timer.gte(1)
            },
            buy() {
                player.n.points = d(0)
                player.r.timer = d(0)
            },
            unlocked() {
                return inChallenge('d',13)
            },
            style() {
				 return {
                    'border-radius': '25%',
                    'color':'red',
                    'background-color': 'white',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } }
        },
    },
    automate() {
        player.d.first = d(0)
        player.d.timereq = d("1e30").pow(d(1.075).pow(player.r.cdcomp.add(1).pow(1.1).sub(1)))
        if(inChallenge('e',13)) {
            player.n.points = d(10)
            player.m.points = d(10)
            player.a.points = d(10)
            player.d.points = d(10)
            player.s.points = d(10)
            player.points = getStartPoints()
        }
    },

    effect() {   
        let power = d(0.5)
        if (hasUpgrade('m', 62)) power = power.times(1.05)
        if (hasUpgrade('al',54) && inChallenge('al',11) && !hasSuperAchievement('ac',32)) power = power.times(2) 
        if(hasSuperAchievement('ac',32)) power = power.times(1.5)
        let effect = Decimal.pow(player[this.layer].points.add(1),power)
        let effect1 = softcap(effect,d("1.78e308"),0.2)
        effect1 = postcorruptiongain(effect1 , d(0.25) , d("1e2000"))
        return effect1
    },
    effectDescription() {
        return " which is boosting Points and Number gain by " + format(tmp.d.effect) +"x"
    },
    passiveGeneration() { 
        let numpas = d(0)
        if (hasUpgrade('m',53)) numpas = numpas.add(upgradeEffect('m', 53)).times(0.01)
        if (hasMilestone('e',2) && !inChallenge('e',11) && !inChallenge('e',12)) numpas = numpas.add(1)
        if (hasMilestone('r',2)) numpas = numpas.add(1)
        return numpas.times(tmp.t.effect.clampMax(player.t.cap).times(0.001)).times(player.r.truegamespeed) },
  
    infoboxes: {
         lore: {
            title: "Divisive gain",
            body() {
                let a = ""
                if(tmp.d.resourcegain.gte(player.g.corruption[4])) a = a += "<br> Corruption : /"+Qcolor2('d',format((tmp.d.resourcegain.div(player.g.corruption[4]).pow(1))))+" <br> Post corruption multiplier : "+Qcolor2('n',format(tmp.d.directMult))+""
                return "Base : +"+Qcolor2('a',format(player.n.points.div(tmp.d.requires).pow(0.5)))+" <br> Multiplier : x"+Qcolor2('n',format(tmp.d.gainMult))+" <br> Exponent : ^"+Qcolor2('e',format(tmp.d.gainExp))+" <br> Total gain : "+Qcolor2('m',format(tmp.d.resourcegain))+" "+a+" <br> Passive generation : x"+Qcolor2('r',format(tmp.d.passiveGeneration))+" <br> Passive gain : +"+Qcolor2('a',format(generateAmount('d')))+"/s"},
                unlocked() {return true}
            },
        },
    
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("e",5) && resettingLayer=="e") keep.push("challenges")
        if (hasMilestone("e",6) && resettingLayer=="e")  keep.push("upgrades")
        if (layers[resettingLayer].row > this.row && !hasUpgrade('r',15)) layerDataReset("d", keep)
    },

    

    challenges: {
        11: {
            name: "No counting",
            challengeDescription() {return ""+Qcolor2('n','Number')+" "+Qcolor2('d','cannot be gained')+"" },
            goalDescription() {
                let base = d("4.85e30")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                if(player.g.sacrificeactive[6].gte(1)) base = base.pow(125)
                return "Reach "+Qcolor2('n',format(base))+" points"
            },
            rewardDescription() { return "Unlock +4 more "+Qcolor2('n','multiplicative')+" upgrade"},
            canComplete: function() {
            let base = d("4.85e30")
            if(inChallenge('r',11)) base = base.pow(player.r.chi)
            base = base.pow(player.g.artifactset4[5])
            if(player.g.sacrificeactive[6].gte(1)) base = base.pow(125)
            return player.points.gte(base)
        },
            onEnter() {
                player.n.points = d(0)
                if(inChallenge('e',11) || inChallenge('e',12)) {
                    player.m.points = d(0)
                    player.d.points = d(0)
                }
            },
            unlocked() {return true},
            style() {
                if(this.canComplete() && inChallenge('d',11)) return Qcolor('rgb(128,128,32)',250)
                if(hasChallenge('d',11)) return Qcolor('green',250)
                else return Qcolor('black',250)
            }
        },
        12: {
            name: "Worsen condition",
            challengeDescription() {return "Apply "+Qcolor2('d','log<sub>10</sub>')+" to all "+Qcolor2('n','Points')+" gain "+Qcolor2('n','multiplier')+" but "+Qcolor2('a','raise')+" "+Qcolor2('n','Points')+" gain by "+Qcolor2('la','5')+"" },
            goalDescription() {
                let base = d("3.16e10")
                if(inChallenge('al',11)) base = base.pow(0.0000001).times(10)                   
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                let a = "Reach "+Qcolor2('n',format(base))+" points"
                return a
            },
            onEnter() {
            player.n.points = d(0)
            if(inChallenge('e',11) || inChallenge('e',12)) {
                player.m.points = d(0)
                player.d.points = d(0)
            }
                        },
            onComplete() {
                player.e.unlocked = true
            },
            rewardDescription() {
                return "Unlock a new layer and improve "+Qcolor2('a',"'Points boost'")+" effect to "+Qcolor2('a',"effect<sup>"+format(this.rewardEffect()))+"</sup>"},
            canComplete: function() {
                let base = d("3.16e10")
                if(inChallenge('al',11)) base = base.pow(0.0000001).times(10)
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                return player.points.gte(base)},
            unlocked() {return true},
            rewardEffect() {
                let base = d(1.15)
                if(hasAchievement('ac',95)) base = base.add(0.1)
                if(hasAchievement('ac',138)) base = base.add(0.15)

                if(hasUpgrade('r',104)) base = base.sub(1).times(player.r.buyables[102].div(40).add(1)).add(1)
                if(inChallenge('r',11)) base = base.pow(player.r.chj)
                return base
            },
            style() {
                if(this.canComplete() && inChallenge('d',12)) return Qcolor('rgb(128,128,32)',250)
                if(hasChallenge('d',12)) return Qcolor('green',250)
                else return Qcolor('black',250)
            }
        },
        13: {
            name: "Chaotic division", 
            challengeDescription() {return "(1) "+Qcolor2('n','Points')+" gain is reduced to "+Qcolor2('d','points<sup>0.2</sup>')+" and also "+Qcolor2('d','cannot exceed Number<sup>0.5</sup>')+" <br> (3) "+Qcolor2('n','Points and number')+" "+Qcolor2('d','divide their own gain')+" <br> (3) "+Qcolor2('n','Number')+" gain is reduced to "+Qcolor2('d','Number<sup>0.1<sup>')+" and "+Qcolor2('d','capped its passive generation')+" at 1x <br> (4) "+Qcolor2('d','Tickspeed cannot be increased')+""} ,
            goalDescription() { 
                let base = d("1e30")
                if(inChallenge('al',11)) base = base.div(10000)
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                return "Reach "+Qcolor2('n',format(base))+" "+Qcolor2('n','points')+" to "+Qcolor2('green2','complete this challenge')+" <br><i> "+Qcolor2('y','Achieve')+" "+Qcolor2('n',format(player.d.timereq))+" "+Qcolor2('n','points')+" to "+Qcolor2('y','permeantly')+" gain "+Qcolor2('a','x1.1 more')+" "+Qcolor2('e','Prestige time')+" (Current bonus : "+Qcolor2('a',format(d(1.1).pow(player.r.cdcomp))+"x")+")"
            },
            onEnter() {
                let keep = [] ;
                if (hasUpgrade('n',41)) keep.push("buyables")
                if (hasUpgrade('n',41)) keep.push("upgrades")

                layerDataReset('n',keep)
                layerDataReset('a')
                layerDataReset('s')
                if(inChallenge('e',11) || inChallenge('e',12)) {
                    player.m.points = d(0)
                    player.d.points = d(0)
                }
                 
            },
            onExit() {
                if(player.points.gte(player.d.timereq)) {
                player.r.cdcomp = player.r.cdcomp.add(1)
                } 

            },
            rewardDescription() { 
                return "Delay "+Qcolor2('a','additive')+" and "+Qcolor2('s','subtractive')+" cost scaling by "+Qcolor2('a',format(this.rewardEffect())+"x")+""},
            canComplete: function() {
                let base = d("1e30")
                if(inChallenge('al',11)) base = base.div(10000)
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                 return player.points.gte(base)
                },
            unlocked() {return hasAchievement('ac',57)},
            rewardEffect() {
                let base = d(1.5)
                if(inChallenge('r',11)) base = base.pow(player.r.chj)
                return base
            },
            style() {
                if( player.points.gte(player.d.timereq) && inChallenge('d',13)) return Qcolor('pink',400)
                if(this.canComplete() && inChallenge('d',13)) return Qcolor('rgb(128,128,32)',400)
                if(hasChallenge('d',13)) return Qcolor('green',400)
                else return Qcolor('black',400)
            }
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
                        ["row", [["buyable", 10],["buyable",11],["buyable",12]]],
                        ["blank","25px"],
                        ["row", [["challenge", 11],["challenge", 12],["challenge", 13]]]
    
    
        ],},
    },},
        tabFormat: [
            ["raw-html", function () { 
                let a = options.hidemastery?"":"=> x"+format(player.r.divisivemastery)+" Mastery"
                return "<h3>You have  " + format(player.d.points)+" Divisive "+a+""}, { "color": "crimson", "font-size": "22px"}],
            ["raw-html", function () { return "<h3>Divisive provide x"+format(tmp.d.effect)+" to Points and Numbers gain"}, { "color": "crimson", "font-size": "22px"}],
            ["raw-html", function () { return tmp.d.passiveGeneration.times(getResetGain(this.layer)).gt(0)?"<h3>You are currently gaining " + format(tmp.d.passiveGeneration.times(getResetGain(this.layer)))+" Divisive/s":"" }, { "color": "crimson", "font-size": "22px"}],
            ["raw-html", function () { return tmp.d.resourcegain.gt(player.g.corruption[4]) && shiftDown?"<h3>Divisive corruption : After "+format(player.g.corruption[4])+" Divisive gain . Excessive Divisive gain is rooted by "+format(corruptionroot(tmp.d.resourcegain,0.275,player.g.corruption[4]),4)+"":"" }, { "color": "red", "font-size": "20px"}],    
    
            ["microtabs", "stuff", { 'border-width': '0px' }],
        ],
    deactivated() {
        return player.g.sacrificeactive[4].gte(1)
    },
 }) 

addLayer("e", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: d(0),
        best: d(0),
        perkpower: d(0),
        maxperkpower: d(0),
        perkpowerinterval: d(60),
        perkpowerinterval2: d(60),
        effective: d(0),
        perkpowerincrease: d(0),
        first: d(0),
        bonus: d(1),
        strength: d(0.6),
        ticked: d(0),
    }},
    tooltip() {
        let a = f(player.e.perkpower)+" Perk power </br>"
        if(!options.subCurrency) a = ""
        let cost = static_cost('e',player.e.points,player.e.strength)
        return ""+formatWhole(player.e.points)+" Exponent </br> "+a+"  Next at "+format(cost)+""},
    ttStyle() {
        return {
            "color":"#ff99f1",
            "width":"200px",
            "border":"2px solid",
            "border-color":"pink",
        }
    },
    

    color: "#8420EC",                       // The color for this layer, which affects many elements.
    resource: "Exponent",            // The name of this layer's main prestige resource.
    layerName: "Exponent",
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: d(1e50),              // The amount of the base needed to  gain 1 of the prestige currency.
    branches:['a','s','d','m'],                                        // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.5,                          // "normal" prestige gain is (currency^exponent).

    milestonePopups() {return !hasAchievement('ac',91)},

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = d(1).times(buyableEffect('e',23).pow(-1)).times(buyableEffect('e',24).pow(-1))
        if (hasUpgrade('n',52)) multi = multi.div(buyableEffect('n',43))
        if(hasUpgrade('n',52) && player.n.buyables[81].gte(1)) multi = multi.div(buyableEffect('n',81))
        if(hasAchievement('ac',163)) multi = multi.div(achievementEffect('ac',163))
        if(hasUpgrade('e',63)) multi = multi.pow(1.25)  
        if(player.r.tetration.gte(7)) multi = multi.pow(1.5)
        if(inChallenge('al',11)) multi = multi.pow(player.al.alteredpow)
        if (inChallenge('r',11)) multi = multi.pow(player.r.chb)
       

        return multi 
    },
    gainExp() { 
        let cont = d(0.5)
        if (hasUpgrade('e',52)) cont = cont.times(0.75)
        if (hasUpgrade('e',52) && player.r.buyables[121].gte(1)) cont = cont.times(0.9)
        if (hasUpgrade('s',52) && !player.r.buyables[121].gte(1)) cont = cont.times(0.99)
        if (hasChallenge('e',11)) cont = cont.times(0.98)
        if (hasMilestone('r',1)) cont = cont.times(0.925)
        if (hasUpgrade('m',74) && !player.r.buyables[121].gte(1)) cont = cont.times(0.95)
        if (player.r.tetration.gte(6)) cont = cont.times(0.96)
        if(hasAchievement('ac',164)) cont = cont.times(0.95)
        if (hasUpgrade('n',52)) cont = cont.div(buyableEffect('n',32))
        if(!player.g.artifactset4 === undefined) cont = cont.times((101 - player.g.artifactset4[4]) / 100)
        if(hasSuperAchievement('ac',63)) cont = cont.div(d(1).add(achievementEffect('ac',63).div(1.5)))
        if(hasUpgrade('t',64)) cont = cont.div(upgradeEffect('t',64))
        if (player.g.sacrificeactive[5].gte(1)) cont = cont.root(5)
        if (player.e.points.gt(player.g.corruption[5])) cont = cont.root((player.e.points.div(player.g.corruption[5])).max(1).root(2))
        let base = d(1).add(cont.times(-1))
        let exp = d(1)
        if(player.r.c10.gt(0) && player.r.c10.neq(6)) exp = d(0)      
        let point = player.e.points.min(10).max(1)
        let mul = base.pow(point)
        return exp.times(mul)
    },

    layerShown() { return (hasChallenge('d', 12)||hasAchievement('ac',34)) && !inChallenge('c',11)},          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "e", description: "E: Reset for Exponent", onPress(){if (true) buyBuyable('e',10)} , unlocked() {return tmp[this.layer].layerShown}},
    ],
    update(delta) {
         /*
        The constant 2.30258509299 is equal to log(10)/log(e) , where e is Euler's number
        - Perk power gain
        */
       let overTime = d(delta).sub(0.1).max(0)
       let ticks = d(delta).min(0.1).times(player.r.truegamespeed)
       if(player.r.c10.gt(0) && player.r.c10.neq(7)) ticks = d(0)
       if(!hasMilestone('e',5)) ticks = d(0)
       let k = d(2).log(10).times(2.30258509299).div(player.e.perkpowerinterval).times(-1)
       player.e.perkpower = player.e.perkpower.add(player.e.maxperkpower.sub(player.e.perkpower).sub((player.e.maxperkpower.sub(player.e.perkpower)).times(d(Math.E).pow(ticks.times(k)))).min(player.e.maxperkpower.sub(player.e.perkpower).div(4)))
       player.e.ticked = player.e.ticked.add(overTime)
    },
    power() {
        let power = d(0.05)
        if(inChallenge('r',11)) power = power.times(player.r.chd)
        return power
    },

    expeffect() {   
        let power = tmp.e.power
        if(hasAchievement('ac',66)) power = power.times(1.05)
        if(player.r.tetration.gte(7)) power = power.times(1.1)
        if(hasSuperAchievement('ac',43)) power = power.times(1.15)
        return Decimal.pow(player[this.layer].effective.add(1),power)
    },
    effect() {
        let base = d(5)
        if(inChallenge('r',11)) base = base.pow(player.r.chd)
        base = base.pow(player.g.artifactset4[6])
        let effect = base.pow(player[this.layer].effective) 
        return effect
    },
    resetDescription:"Empower for ",
    infoboxes: {
        lore: {
            title: "Exponent cost",
            body() {
                return "Base cost : "+Qcolor2('e',format(d(2).pow(player.e.points.pow(1.5))))+" </br> Cost scaling : ^"+Qcolor2('d',format(tmp.e.gainExp.pow(-1)))+" <br> Cost multiplier : x"+Qcolor2('s',format("1e50"))+" </br> Total cost : "+Qcolor2('e',format(d(2).pow(player.e.points.pow(1.5)).pow(tmp.e.gainExp.pow(-1)).times("e50")))+"  </br> Cost reduction : /"+Qcolor2('a',format(tmp.e.gainMult.pow(-1)))+""  },
        },
    },
    
    automate() {
        if(player.e.points.gt(0)) {
            let multi = d(1)
            if(hasMilestone('e',5)) multi = multi.times((player.e.perkpower.add(10)).log(10))
            if(hasAchievement('ac',74)) multi = multi.pow(1.05)
            player.e.bonus = multi
            let multi2 = player.e.bonus.times(buyableEffect('r',403))
            if(hasAchievement('ac',43)) multi2 = multi2.times(1.2) 
            if(hasAchievement('ac',44)) multi2 = multi2.times(1.2)
            if(hasAchievement('ac',49)) multi2 = multi2.times(1.1)
            if(hasUpgrade('m',71)) multi2 = multi2.times(1.02)
            multi2 = multi2.times(player.g.artifactset1[5])
            player.e.effective = player.e.points.times(multi2)
        } else {
            player.e.effective = d(0)
        }

        //interval
        let b = d(60)
        b = b.times(d(2).pow(player.e.perkpower.div(10)))
        b = b.div(buyableEffect('e',42))
        if(hasAchievement('ac',131)) b = b.div(achievementEffect('ac',131))
        if(hasAchievement('ac',152)) b = b.div(achievementEffect('ac',152))
        player.e.perkpowerinterval2 = b
        b = b.div(player.e.ticked.add(1).max(1))
        player.e.ticked = d(0)
        player.e.perkpowerinterval = b
        let k = d(2).log(10).times(2.30258509299).div(player.e.perkpowerinterval2).times(-1)
        player.e.perkpowerincrease = player.e.maxperkpower.sub(player.e.perkpower).sub((player.e.maxperkpower.sub(player.e.perkpower)).times(d(Math.E).pow(d(player.r.truegamespeed).times(k))))

        if(true) {
            buyBuyable('e',11)
            buyBuyable('e',12)
            buyBuyable('e',21)
            buyBuyable('e',22)
            buyBuyable('e',23)
            buyBuyable('e',24)
            buyBuyable('e',31)
            buyBuyable('e',32)
            buyBuyable('e',15)
            buyBuyable('e',33)
            buyBuyable('e',34)
        }
        if((hasMilestone('e',7) || hasUpgrade('r',21)) && !hasAchievement('ac',97)) {
            buyBuyable('e',10)
        }
        if(hasAchievement('ac',97) && player.e.points.eq(0)) {
            if(player.points.gte("1e50")) player.e.points = d(1)
        }
        if(hasAchievement('ac',97) && player.e.points.lt(10)) {
            if(player.points.gte(getNextAt('e'))) player.e.points = player.e.points.add(1)
        }
        if(hasAchievement('ac',97) && player.e.points.gte(10)) {
            if(player.points.gte(static_cost('e',player.e.points))) player.e.points = player.e.points.add(1)
            if(player.points.gte(static_cost('e',player.e.points.add(9)))) player.e.points = player.e.points.add(4)
            if(player.points.gte(static_cost('e',player.e.points.add(99)))) player.e.points = player.e.points.add(16)
        }
        player.e.strength = tmp.e.gainExp.max(1).root(player.e.points.max(1).min(10).times(-1)).sub(1)
        player.e.first = d(0)       
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasUpgrade('r',21) && resettingLayer=="r") keep.push("challenges")
        if (hasUpgrade('r',21) && resettingLayer=="r")  keep.push("upgrades")
        if (hasUpgrade('r',22) && resettingLayer=="r")  keep.push("milestones")
        if (hasMilestone('g',5)) keep.push("milestones")
        if (hasMilestone('g',5)) keep.push("upgrades")

        if (layers[resettingLayer].row > this.row) layerDataReset("e", keep)
    },


    milestones: {
        1: {
            requirementDescription: "2 Exponent",
            effectDescription() {return ""+Qcolor2('n','Keep Number upgrade')+" on "+Qcolor2('pink2','Exponent')+" reset"},
            done() { return player.e.points.gte(2) || hasMilestone('g',5)}
        },
        2: {
            requirementDescription: "4 Exponent",
            effectDescription() {return ""+Qcolor2('pink2','Generate 100% ')+""+Qcolor2('s','of number , multiplicative and divisive')+" gain per second <br> "+Qcolor2('s','Disabled')+" while in any "+Qcolor2('pink2','Exponent challenge')+""},
            done() { return player.e.points.gte(4) || hasMilestone('g',5)}
        },
        3: {
            requirementDescription: "5 Exponent",
            effectDescription() {return ""+Qcolor2('m','Keep additive & subtractive upgrade')+" on "+Qcolor2('pink2','Exponent')+" reset"},
            done() { return player.e.points.gte(5)|| hasMilestone('g',5) }
        },
        4: {
            requirementDescription: "6 Exponent",
            effectDescription() {return ""+Qcolor2('m','Additive and Subtractive no longer reset your Number')+""},
            done() { return player.e.points.gte(6) || hasMilestone('g',5)}
        },
        5: {
            requirementDescription: "7 Exponent",
            effectDescription() {return ""+Qcolor2('m','Keep Multiplicative and Divisive challenge completion')+" on "+Qcolor2('pink2','Exponent')+" reset <br> Unlock "+Qcolor2('pink2','Exponent perk')+"  "},
            done() { return player.e.points.gte(7) || hasMilestone('g',5)}
        },
        6: {
            requirementDescription: "8 Exponent",
            effectDescription() {return ""+Qcolor2('m','Keep Multiplicative upgrade')+" on "+Qcolor2('pink2','Exponent')+" reset"},
            done() { return player.e.points.gte(8) || hasMilestone('g',5)}
        },
        7: {
            requirementDescription: "9 Exponent",
            effectDescription() {return "Automaticly perform "+Qcolor2('pink2','Exponent')+" reset <br> Unlock "+Qcolor2('pink2','Exponent challenge')+""},
            done() { return player.e.points.gte(9) || hasMilestone('g',5)}
        },
        8: {
            requirementDescription: "10 Exponent",
            effectDescription() {return "Unlock another layer"},
            done() { return player.e.points.gte(10) || hasMilestone('g',5)}
        },
        
    },
    upgrades: {
        51: {
            title: "Power Boost",
            description: "Number also reduce Additive and Subtractive cost at a reduced rate",
            cost() {
              let base = d(3)
              if(hasAchievement('ac',158)) base = base.sub(10)
              return base.max(0)
            },
            effect() {
                let eff = player.n.points.pow(0.5).add(1)
                let eff1 = softcap(eff,d("1e500"),0.25)
                return eff1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        52: {
            title: "Uncosty Exponent",
            cost() {
                let base = d(5)
                if(hasAchievement('ac',158)) base = base.sub(10)
                return base.max(0)
              },            
            description() {
                let a = player.r.buyables[121].gte(1)?"(real effect : 32.5%)":""
                return "Exponent cost scaling base is reduced by 25% "+a+""},},
        53: {
            title: "Delay additive scaling",
            description() {
                let a =  player.r.buyables[121].gte(1)?"and Perk Power":""
                return "Additive cost scaling is delayed based on exponent "+a+" (Base : 100)"
            },
            cost() {
                let base = d(7)
                if(hasAchievement('ac',158)) base = base.sub(10)
                return base.max(0)
            },
            effect() {
                let a = player.e.perkpower.add(2).pow(1.2).times(1/2).max(1).min(350)
                if(player.r.buyables[121].lt(1)) a = a.times(0)
                let eff = player.e.effective.times(0.5).add(1).pow(1.5).min(500)
                return eff.add(a)
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+" delay" },
        },
        54: {
            title: "Delay subtractitive scaling",
            description: "Subtractive cost scaling is delayed based on exponent (Base : 100)",
            cost() {
                let base = d(7)
                if(hasAchievement('ac',158)) base = base.sub(10)
                return base.max(0)
            },            
            effect() {
                let eff = player.e.effective.times(0.5).add(1).pow(1.4).min(500)
                return eff
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+" delay" },
        },
        61: {
            title : "Strong Perk",
            description: "1.08x max Perk Power",
            cost() {
                let base = d(8)
                if(hasAchievement('ac',158)) base = base.sub(10)
                return base.max(0)
            },            
            unlocked() {return hasMilestone('e',6) && !player.r.buyables[121].gte(1)},
        },
        62: {
            title : "Powerful Perk",
            description: "Perk Power gain from Exponent is ^1.08",
            cost() {
                let base = d(8)
                if(hasAchievement('ac',158)) base = base.sub(10)
                return base.max(0)
            },              
            unlocked() {return hasMilestone('e',6)},
        },
        63: {
            title : "Extra cheap",
            description: "Increase the effect of all Exponent cost divider by ^1.25",
            cost() {
                let base = d(9)
                if(hasAchievement('ac',158)) base = base.sub(10)
                return base.max(0)
            },              
            unlocked() {return hasMilestone('e',7)},
        },
     64: {
            title : "Strengthen Perk",
            description: "1.07x max Perk Power",
            cost() {
                let base = d(9)
                if(hasAchievement('ac',158)) base = base.sub(10)
                return base.max(0)
            },
            unlocked() {return hasMilestone('e',7) && !player.r.buyables[121].gte(1)},
        }
    },
    clickables: {
        11: {
            title() { return "Add weight to Number" },
            canClick() { return player.g.EWid.neq(0)},
            onClick() {
            player.g.EWid = d(0)
            },
            style() {
            if(!this.canClick()) return Qcolor('aqua',40)   
            return Qcolor('black',40)
        },
        },
        12: {
            title() { return "Add weight to Multiplicative" },
            canClick() { return player.g.EWid.neq(1)},
            onClick() {
            player.g.EWid = d(1)
            },
            style() {
            if(!this.canClick()) return Qcolor('teal',40)   
            return Qcolor('black',40)
        },
        },
        13: {
            title() { return "Add weight to Divisive" },
            canClick() { return player.g.EWid.neq(2)},
            onClick() {
            player.g.EWid = d(2)
            },
            style() {
            if(!this.canClick()) return Qcolor('crimson',40)   
            return Qcolor('black',40)
        },
        },
        14: {
            title() { return "+1 weight" },
            canClick() { return player.g.EW.gte(1)},
            onClick() {
            player.g.EW = player.g.EW.sub(1)
            player.g.effectWeight[toNumber(player.g.EWid)] =  player.g.effectWeight[toNumber(player.g.EWid)].add(1)
            },
            style() {
            if(this.canClick()) return Qcolor('lime',40)   
            return Qcolor('black',40)
        },
        },
        15: {
            title() { return "+5 weight" },
            canClick() { return player.g.EW.gte(5)},
            onClick() {
                player.g.EW = player.g.EW.sub(5)
                player.g.effectWeight[toNumber(player.g.EWid)] =  player.g.effectWeight[toNumber(player.g.EWid)].add(5)
                },
            style() {
            if(this.canClick()) return Qcolor('green',40)   
            return Qcolor('black',40)
        },
        },
        16: {
            title() { return "25% of current weight <br> ("+format(player.g.EW.div(4).floor(),0)+" weight)" },
            canClick() { return player.g.EW.gte(4)},
            onClick() {
                let amt = player.g.EW.div(4).floor()
                player.g.EW = player.g.EW.sub(amt)
                player.g.effectWeight[toNumber(player.g.EWid)] =  player.g.effectWeight[toNumber(player.g.EWid)].add(amt)
                },
            style() {
            if(this.canClick()) return Qcolor('cyan',40)   
            return Qcolor('black',40)
        },
        },
        17: {
            title() { return "Current weight <br> ("+format(player.g.EW,0)+" weight)" },
            canClick() { return player.g.EW.gte(1)},
            onClick() {
                let amt = player.g.EW
                player.g.EW = player.g.EW.sub(amt)
                player.g.effectWeight[toNumber(player.g.EWid)] =  player.g.effectWeight[toNumber(player.g.EWid)].add(amt)
                },
            style() {
            if(this.canClick()) return Qcolor('teal',40)   
            return Qcolor('black',40)
        },
        },
        18: {
            title() { return "Evenly splits 25% weight <br> ("+format(player.g.EW.div(12).floor(),0)+" weight each)" },
            canClick() { return player.g.EW.gte(12)},
            onClick() {
                let amt = player.g.EW.div(12).floor()
                player.g.EW = player.g.EW.sub(amt.times(3))
                player.g.effectWeight[0] =  player.g.effectWeight[0].add(amt)
                player.g.effectWeight[1] =  player.g.effectWeight[1].add(amt)
                player.g.effectWeight[2] =  player.g.effectWeight[2].add(amt)

                },
            style() {
            if(this.canClick()) return Qcolor('blue',40)   
            return Qcolor('black',40)
        },
        },
        19: {
            title() { return "Evenly splits 100% weight <br> ("+format(player.g.EW.div(3).floor(),0)+" weight each)" },
            canClick() { return player.g.EW.gte(3)},
            onClick() {
                let amt = player.g.EW.div(3).floor()
                player.g.EW = player.g.EW.sub(amt.times(3))
                player.g.effectWeight[0] =  player.g.effectWeight[0].add(amt)
                player.g.effectWeight[1] =  player.g.effectWeight[1].add(amt)
                player.g.effectWeight[2] =  player.g.effectWeight[2].add(amt)              
            },
            style() {
            if(this.canClick()) return Qcolor('indigo',40)   
            return Qcolor('black',40)
        },
        },
    },
    buyables: {
        10: {
            title() {
                let a = ""
                a += "<br><br> Next at "+format(static_cost('e',player.e.points,player.e.strength))+" Points" 
                return tmp[this.layer].gainExp.eq(0)?"Cannot reset":"Reset for +1 Exponent"+a
               } ,
            cost(x) { 
                return d(0) },
            tooltip() {return ""},
            canAfford() {
                return player.points.gte(static_cost('e',player.e.points,player.e.strength)) && tmp[this.layer].gainExp.neq(0)
            },
            buy() {
                if(!hasAchievement('ac',97)) doReset(this.layer,true)
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                if (this.canAfford())  return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': tmp[this.layer].color,
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
                else if (tmp[this.layer].gainExp.neq(0))  return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': 'red',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
				else return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': 'crimson',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } }
        },
        11: {
            canAfford() { return true },
            buy() {
                let base = player.e.points
                setBuyableAmount(this.layer, this.id , base)
            },
            unlocked() {
                return hasMilestone('e',5)
            },
            effect(x) {
                let base = (x.times(100)).pow(0.3)
                if(hasUpgrade('r',22)) base = base.times(1.23)
               if(hasUpgrade('e',62)) base = base.pow(1.08)   
               base = base.pow(player.g.artifactset3[0])          
                return base
            },
        },
        12: {
            canAfford() { return true },
            buy() {
                player[this.layer].maxperkpower = this.effect()
            }, 
            effect(x) {
                let a1 = buyableEffect('e',11)
                let a2 = buyableEffect('e',15)
                let sum = a1.add(a2)
                if (hasAchievement('ac',86) && !inChallenge('al',11)) sum = sum.add(achievementEffect('ac',86))
                sum = sum.add(player.g.artifactset4[7] - 1)
                let multi = d(1)
                let e11r = challengeEffect('e',11)
                if(hasUpgrade('e',61) && !player.r.buyables[121].gte(1)) multi = multi.times(1.08)
                if(hasUpgrade('a',43)) multi = multi.times(upgradeEffect('a',43))
                if(hasUpgrade('e',64) && !player.r.buyables[121].gte(1)) multi = multi.times(1.07)  
                if(hasChallenge('e',11)) multi = multi.times(e11r)
                if(hasAchievement('ac',45)) multi = multi.times(1.08)
                if(hasAchievement('ac',49)) multi = multi.times(1.25)
                if(hasUpgrade('t',62)) multi = multi.times(upgradeEffect('t',62))
                multi = multi.times(player.g.artifactset1[6])
                if(player.g.artifactset3[6] >0 && getBuyableAmount('e',41).gte(10)) multi = multi.times(tmp.e.expeffect.add(1).pow(0.5))

                let exponent = d(1)
                if (player.r.tetration.gte(4)) exponent = exponent.times(1.04)
                if (hasUpgrade('al',54)) exponent = exponent.times(1.1)
                if (inChallenge('r',11)) exponent = exponent.times(player.r.chd)

                let total = (sum.times(multi)).pow(exponent)
                return total
            },
        },
        15: {
            canAfford() { return true },
            buy() {
                let base = player.r.points
                setBuyableAmount(this.layer, this.id, base)
            },
            effect(x) {
                let base = x.times(0.5).add(1) 
                base = base.pow(player.g.artifactset3[1])      
                return base
            },
            unlocked() {
                return player.r.tetration.gte(4)
            },
        },
        21: {
            cost(x) { return (x.times(0.04).add(1)).pow(1.3) },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {return !player.r.buyables[121].gte(1) && getBuyableAmount('e',41).gte(3)},
            buy() {                
                setBuyableAmount(this.layer, this.id, player.e.perkpower.root(1.3).sub(1).times(25))
            },
            effect(x) {
                let base = x.times(1.2).pow(0.8)                
                let eff = d(10).pow(base)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)
                return eff
            },
        },
        22: {
            cost(x) { return (x.times(0.04).add(1)).pow(1.3) },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) && getBuyableAmount('e',41).gte(4)},
            unlocked() { return !player.r.buyables[121].gte(1) && getBuyableAmount('e',41).gte(4)},
            buy() {
                 setBuyableAmount(this.layer, this.id, player.e.perkpower.root(1.3).sub(1).times(25))
            },
            effect(x) {
                let base = x.times(1.2).pow(0.8)                
                let eff = d(10).pow(base)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)

                return eff
            },
        },
        23: {
            cost(x) { return (x.times(0.1).add(1)).pow(1.5) },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() { return !player.r.buyables[121].gte(1) && getBuyableAmount('e',41).gte(2)},
            buy() {
                setBuyableAmount(this.layer, this.id, player.e.perkpower.root(1.5).sub(1).times(10))

            },
            effect(x) {
                let base = x.times(3).pow(0.9)                
                let eff =  d(10).pow(base)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)
                return eff
            },
        },
        24: {
            cost(x) { return (x.times(0.2).add(1)).pow(1.5) },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {return getBuyableAmount('e',41).gte(1)},

            buy() {
                setBuyableAmount(this.layer, this.id, player.e.perkpower.root(1.5).sub(1).times(5))
            },
            effect(x) {
                let base = x.times(6).pow(0.9)                
                let eff =  d(10).pow(base)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(2)
                eff = eff.pow(player.g.artifactset3[5])
                return eff
            },
        },
        25: {
            cost(x) { return (x.times(0.8).add(1)).pow(1.1) },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {return player.r.buyables[121].gte(1) && getBuyableAmount('e',41).gte(9)},
            buy() {
                setBuyableAmount(this.layer, this.id, player.e.perkpower.root(1.1).sub(1).times(1.25))

            },
            effect(x) {
                let q = d("1e6")
                let base = x       
                let eff =  d(q).pow(base)
                return eff
            },
        },
        31: {
            cost(x) { return (x.times(0.14).add(1)).pow(1.4) },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {return !player.r.buyables[121].gte(1) && getBuyableAmount('e',41).gte(5)},
            buy() {
                setBuyableAmount(this.layer, this.id, player.e.perkpower.root(1.4).sub(1).div(0.14))
            },
            effect(x) {
                let base = (x.times(0.9).add(1)).pow(0.7) 
                if(player.r.buyables[121].gte(1)) base = base.pow(0)               
                return base
            },
        },
        32: {
            cost(x) { return (x.times(0.1).add(1)).pow(1.2) },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {return !player.r.buyables[121].gte(1) && getBuyableAmount('e',41).gte(6)},
            buy() {
                setBuyableAmount(this.layer, this.id, player.e.perkpower.root(1.2).sub(1).times(10))

            },
            effect(x) {
                let base = (x.times(0.9).add(1)).pow(0.8)
                if(player.r.buyables[121].gte(1)) base = base.pow(0)               
                
                return base
            },
        },
        33: {
            title: "Additive upgrader" ,
            cost(x) { return d(6)},
            display() { return "Unlock a new row of additive upgrade </br> Cost : " +Qcolor2('e',format(this.cost())) + " Perk Power" },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Buying any upgrade in that row increase the cost of the other",
            buy() {

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x                
                return base
            },
            purchaseLimit:1,
            unlocked() {return hasMilestone('e',6) && getBuyableAmount('e',41).gte(7)},
            style() {
				if (player.e.buyables[33].eq(1)) return Qcolor('green')
                else if (player.e.perkpower.lt(this.cost())) return Qcolor()
                else return Qcolor('rgb(128,128,32)')},
        },
        34: {
            title: "Subtractive upgrader" ,
            cost(x) { return d(6)},
            display() { return "Unlock a new row of subtractive upgrade </br> Cost : " +Qcolor2('e',format(this.cost())) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Buying any upgrade in that row increase the cost of the other",
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x                
                return base
            },
            purchaseLimit:1,
            unlocked() {return hasMilestone('e',6) && getBuyableAmount('e',41).gte(8)},
            style() {
				if (player.e.buyables[34].eq(1)) return Qcolor('green')
                 else if (player.e.perkpower.lt(this.cost())) return Qcolor()
				else return Qcolor('rgb(128,128,32)')}
        },
        41: {
            title() {return getBuyableAmount(this.layer,this.id)+" <br> More bonuses"},
            cost(x) { 
                if (player[this.layer].buyables[this.id].gte(this.purchaseLimit())) return d(0)
                let a = [d(7),d(8),d(9),d(9),d(9),d(9),d(10),d(10),d(75),d(100)]
                return a[x]
            },
            tooltip() { return "Unlock more Perk bonus </br> Req : " +format(this.cost(),0) + " Exponent" },
            ttStyle() {
                return {
                    "color":"#ff99f1",
                    "width":"250px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return true},
            purchaseLimit() {
                let base = d(8)
                if(getBuyableAmount('r',121)) base = base.add(1)
                if(player.g.artifactset3[6] > 1) base = base.add(1)
                return base
            },
            style() {
                 if (player.e.points.lt(this.cost())) return Qcolor()
                 if (getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return Qcolor('green')
				else return Qcolor('rgb(128,128,32)')}
        },
        42: {
            title() {return getBuyableAmount(this.layer,this.id)+" <br> Faster power"},
            cost(x) { 
                return x.add(7)
            },
            ttStyle() {
                return {
                    "color":"#ff99f1",
                    "width":"250px",
                    "border":"2px solid",
                    "border-color":"pink",
                }
            }, 
            tooltip() { return "Perk power increase "+format(this.effect())+"x faster </br> Req : "+format(this.cost().add(1),0) + " Exponent" },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(x) {
                return (x.add(1)).pow(0.4).pow(x.max(15).div(15))
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer,this.id).max(player.e.points.sub(7)))
            },
            unlocked() {return true},
            style() {
                 if (player.e.points.lte(this.cost())) return Qcolor()
				else return Qcolor('rgb(128,128,32)')}
        },
    },
    challenges: {
        11: {
            name: "Equality",
            challengeDescription() {return ""+Qcolor2('d','Points gain')+" "+Qcolor2('d','cannot exceed Number^0.5')+""} ,
            goalDescription() {
                let base = d("1e80")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                return "Reach "+Qcolor2('n',format(base))+" points"},
            rewardDescription() {
                let effect2 = d(2)
                if(inChallenge('r',11)) effect2 = effect2.pow(player.r.chj)
                return ""+Qcolor2('e',"x"+format(this.rewardEffect())+" Perk Power")+" gain , "+Qcolor2('e','Exponent')+" cost scaling base is reduced by "+Qcolor2('e',"2%")+""},
            canComplete: function() {
                let base = d("1e80")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                base = base.pow(player.g.artifactset4[5])
                return player.points.gte(base)
            },
            rewardEffect() {
                let a = d(1.14)
                if(hasUpgrade('r',104)) a = a.sub(1).times(player.r.buyables[103].div(25).add(1)).add(1)
                if(inChallenge('r',11)) a = a.pow(player.r.chj) 
        
                return a
            },
            unlocked() {return hasMilestone('e',7)},
            onEnter() {
                player.points = d(10)
                player.n.points = d(0)
                player.m.points = d(0)
                player.d.points = d(0)
            },
            style() {
                if(this.canComplete() && inChallenge('e',11)) return Qcolor('rgb(128,128,32)',250)
                if(hasChallenge('e',11)) return Qcolor('green',250)
                else return Qcolor('black',250)
            }
        },
        12: {
            name: "No number",
            challengeDescription() {return ""+Qcolor2('d',"Points gain ")+" is "+Qcolor2('d','reduced to 10^[log(gain)^0.25]')+" which is "+Qcolor2('s','worsen based on Points')+""},
            goalDescription: function() { 
                let base = d(10000000)
                let ts = tmp.t.effect.clampMax(player.t.cap).div(1000).add(1).pow(0.5)

                let goal = base.times(ts)
                if(inChallenge('r',11)) goal = goal.pow(player.r.chi)
                goal = goal.pow(player.g.artifactset4[5])
                if(player.r.tetration.gte(14)) goal = goal.pow(1.25)
                return "Reach "+Qcolor2('n',format(goal))+" points <br> "+Qcolor2('d','Tickspeed')+" slightly increases the "+Qcolor2('d','challenge goal')+""},
            rewardDescription() {
                let base = d(1.1)
                if(player.r.tetration.gte(14)) base = base.pow(2)
                if(inChallenge('r',11)) base = base.pow(player.r.chj)
                return ""+Qcolor2('a','Additive')+" and "+Qcolor2('s','Subtractive')+" cost scaling start "+Qcolor2('a',"x"+format(this.rewardEffect()))+" later"},
            rewardEffect() {
                    let m = d(1.1)
                    if(player.r.tetration.gte(14)) m = m.pow(2)
                    if(hasUpgrade('r',104)) m = m.sub(1).times(player.r.buyables[104].div(40).add(1)).add(1)
                    if(inChallenge('r',11)) m  = m.pow(player.r.chj)
                    return m
             },
            canComplete: function() {
                let goal = d(10000000).times(tmp.t.effect.clampMax(player.t.cap).div(1000).add(1).pow(0.5))
                if(inChallenge('r',11)) goal = goal.pow(player.r.chi)
                goal = goal.pow(player.g.artifactset4[5])
                if(player.r.tetration.gte(14)) goal = goal.pow(1.25)
                return player.points.gte(goal)},
            unlocked() {return hasMilestone('e',7)},
            onEnter() {
                player.points = getStartPoints()
                player.n.points = d(0)
                player.m.points = d(0)
                player.d.points = d(0)
            },
            style() {
                if(this.canComplete() && inChallenge('e',12)) return Qcolor('rgb(128,128,32)',250)
                if(hasChallenge('e',12)) return Qcolor('green',250)
                else return Qcolor('black',250)
            }
        },
        13: {
            name: "No Basics",
            challengeDescription() {

            return "(1)"+Qcolor2('y','All Pre-Exponent resources')+" including "+Qcolor2('n','current Points')+" is fixed at 10 <br> (2) "+Qcolor2('d','Points gain')+" is reduced to "+Qcolor2('d','log10(gain)^^1.5')+" <br> (3) "+Qcolor2('d','Tickspeed')+" becomes "+Qcolor2('d','log(tickspeed)^2')+""} 
            ,
            goalDescription: function() { 
                let a = player.r.timer.gte(1)?Qcolor2('green2','Time condition met'):Qcolor2('red1','Please wait for '+formatTime(d(1).sub(player.r.timer),2)+'')
                if(!inChallenge('e',13)) a = '<i>Note : You must spent at least 1s in this challenge</i>'
                return "Reach "+Qcolor2('a',format(d("1e290"))+"")+" Points gain/s <br>"+a},
            rewardDescription() {
                return Qcolor2('green5',f(d("2").pow(24)))+"x to "+Qcolor2('n','Bits')+" gain permeantly <br><i> While in this challenge : Unlock "+Qcolor2('a','additional')+" "+Qcolor2('n','Bits')+" upgrade , "+Qcolor2('a',format(50)+'x Gamespeed')+" and Bits gain BUT "+Qcolor2('d','disable Prestige time gain')+""},
            canComplete: function() {
                if(player.g.ud.gte(2)) return false
                if(player.g.ud.lte(1)) return (d(getPointGen()).gte(d("1e290")) && player.r.timer.gte(1))
            },
            onComplete() {
                if(player.g.ud.eq(1)) {
                    player.g.ud = d(2)
                }
            },
            onExit() {
                player.e.challenges[13] = d(0) //Quick fix 
            },
            unlocked() {return hasMilestone('e',7) && player.r.tetration.gte(17)},
            onEnter() {
                player.r.timer = d(0)
                player.points = getStartPoints()
                player.n.points = d(0)
                player.m.points = d(0)
                player.d.points = d(0)
            },
            style() {
                if(player.g.ud.gte(2)) return Qcolor('green',380)
                if(this.canComplete() && inChallenge('e',13)) return Qcolor('rgb(128,128,32)',380)
                else return Qcolor('black',368)
            }
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
                    ["row", [["buyable", 10]]],
                    ["blank","25px"],
                    ["row", [["upgrade", 51],["upgrade", 52],["upgrade", 53],["upgrade",54]]],
                    ["row", [["upgrade", 61],["upgrade", 62],["upgrade", 63],["upgrade",64]]],
                    ["blank","25px"],


                ],},
            "Milestone":{
                unlocked() {return true},
                content: [
                    ["blank","25px"],
                    "milestones",
                    ["raw-html", function () { 
                        return "<h3><i> There is a setting to disable all type of popup entirely <br> Alternatively , you can hold [shift] make all popup disappear 10x faster"
                    }, { "color": "white", "font-size": "15px"}],
                    ["raw-html", function () { 
                        return shiftDown?"<h3><i>You are currently holding shift":""
                    }, { "color": "white", "font-size": "15px"}]

                ]
            },
            "Perk":{
                unlocked() {return hasMilestone('e',5)},
                content: [
                    ["blank", "25px"],
                    ["raw-html", function () { return "<h3>You have "+format(player.e.perkpower)+"/"+format(player.e.maxperkpower)+" ("+format(player.e.perkpowerincrease)+"/s) perk power , which boost Effective Exponent by x"+format(player.e.bonus)+" "}, { "color": "purple", "font-size": "22px"}],
                    ["raw-html", function () { return "<h3>The difference between <i>current perk power</i> and <i>max perk power</i> is <i>halved</i> every "+formatTime(player.e.perkpowerinterval2.max(1))+" <br> The <i>interval</i> is <i>doubled every 10 perk power</i> and can be decreased based on various bonuses "}, { "color": "white", "font-size": "17px"}],
                    ["raw-html", function () { return "<h3>Perk power also give additional scaling bonuses"}, { "color": "purple", "font-size": "22px"}],
                    ["raw-html", function () { return getBuyableAmount('e',41).gte(1)?"<h3>Divide Exponent , Additive and Subtractive cost by /"+format(buyableEffect('e',24))+"":""}, { "color": "pink", "font-size": "18px"}],
                    ["raw-html", function () { return getBuyableAmount('e',41).gte(2)&&getBuyableAmount('r',121).neq(1)?"<h3>Divide Exponent cost by /"+format(buyableEffect('e',23))+"":""}, { "color": "pink", "font-size": "18px"}],
                    ["raw-html", function () { return getBuyableAmount('e',41).gte(3)&&getBuyableAmount('r',121).neq(1)?"<h3>Divide Subtractive cost by /"+format(buyableEffect('e',21))+"":""}, { "color": "pink", "font-size": "18px"}],
                    ["raw-html", function () { return getBuyableAmount('e',41).gte(4)&&getBuyableAmount('r',121).neq(1)?"<h3>Divide Additive cost by /"+format(buyableEffect('e',22))+"":""}, { "color": "pink", "font-size": "18px"}],
                    ["raw-html", function () { return getBuyableAmount('e',41).gte(5)&&getBuyableAmount('r',121).neq(1)?"<h3>'Subtract?' subtractive upgrade effect ^"+format(buyableEffect('e',31))+"":""}, { "color": "pink", "font-size": "18px"}],
                    ["raw-html", function () { return getBuyableAmount('e',41).gte(6)&&getBuyableAmount('r',121).neq(1)?"<h3>'Numberic increase' additive upgrade effect ^"+format(buyableEffect('e',32))+"":""}, { "color": "pink", "font-size": "18px"}],
                    ["raw-html", function () { return getBuyableAmount('e',41).gte(9)?"<h3>Multiply Number gain by x"+format(buyableEffect('e',25))+"":""}, { "color": "pink", "font-size": "18px"}],
                    ["raw-html", function () { return getBuyableAmount('e',41).gte(10)?"<h3>x"+format(tmp.e.expeffect.add(1).pow(0.5))+" max Perk Power (Boosted by Exponent instead of Perk Power)":""}, { "color": "pink", "font-size": "18px"}],


                    ["blank","25px"],
                    ["row", [["buyable", 33],["buyable",34]]],
                    ["row", [["buyable", 41],["buyable",42]]],

                ]
            },
            "Challenge":{
                unlocked() {return hasMilestone('e',7)},
                content: [
                    ["blank","25px"],
                    ["row", [["challenge", 11],["challenge", 12],["challenge",13]]],

                ]
            },
            "Effect weight":{
                unlocked() {return player.g.s4best.gte(2)},
                content: [
                    ["blank", "25px"],
                    ["raw-html", function () { return "<h3>You have "+format(player.g.EW,0)+" Exponent weight remaining"}, { "color": "lime", "font-size": "22px"}],
                    ["raw-html", function () { return "<h3>Assign Exponent weight to resources (Number , Multiplicative , Divisive) to boost them"}, { "color": "white", "font-size": "17px"}],
                    ["raw-html", function () { return "<h3>You can respec weight on Graduation reset"}, { "color": "white", "font-size": "17px"}],
                    ["raw-html", function () { return "<h3>Each Exponent weight boost a resource equal to 1% of the Exponent effect <br> Equal to "+f(tmp.e.effect.root(100))+"x and ^"+format(tmp.e.expeffect.root(100),4)+" to that resource gain"}, { "color": "lime", "font-size": "22px"}],
                    ["blank","25px"],
                    ["row", [["clickable", 11],["clickable",12],["clickable",13]]],
                    ["blank","25px"],
                    ["raw-html", function () { return "<h3>Number : "+format(player.g.effectWeight[0],0)+" weight => "+f(tmp.e.effect.root(100).pow(player.g.effectWeight[0]))+"x and ^"+format(tmp.e.expeffect.root(100).pow(player.g.effectWeight[0]),4)+" to Number gain"}, { "color": function() {return player.g.EWid.eq(0)?"yellow":"white"}, "font-size": "22px"}],
                    ["raw-html", function () { return "<h3>Multiplicative : "+format(player.g.effectWeight[1],0)+" weight => "+f(tmp.e.effect.root(100).pow(player.g.effectWeight[1]))+"x and ^"+format(tmp.e.expeffect.root(100).pow(player.g.effectWeight[1]),4)+" to Multiplicative gain"}, { "color": function() {return player.g.EWid.eq(1)?"yellow":"white"}, "font-size": "22px"}],
                    ["raw-html", function () { return "<h3>Divisive : "+format(player.g.effectWeight[2],0)+" weight => "+f(tmp.e.effect.root(100).pow(player.g.effectWeight[2]))+"x and ^"+format(tmp.e.expeffect.root(100).pow(player.g.effectWeight[2]),4)+" to Divisive gain"}, { "color": function() {return player.g.EWid.eq(2)?"yellow":"white"}, "font-size": "22px"}],
                    ["blank","25px"],
                    ["row", [["clickable", 14],["clickable",15],["clickable",16],["clickable",17],["clickable",18],["clickable",19]]],
                ]
            },
    },},
        tabFormat: [

            ["raw-html", function () { 
                let a = !player.e.perkpower.eq(0)?"("+format(player.e.effective)+" Effective)":""
                let b = options.hidemastery?"":"=> x"+format(player.r.exponentmastery)+" Mastery"
                return "<h3>You have  " + formatWhole(player.e.points)+" "+a+" Exponent "+b+""}, { "color": "purple", "font-size": "22px"}],
            ["raw-html", function () { 
                return "<h3>Exponent provide these bonuses :  ^"+format(tmp.e.expeffect,4)+" and x"+format(tmp.e.effect)+" to Points gain"
            }, { "color": "purple", "font-size": "22px"}],
            ["raw-html", function () { 
                return player.g.s4best.gte(2)?"<h3><i>Unspent Exponent weight : "+format(player.g.EW,0)+" (Altered realm depth 2)":""
            }, { "color": "lime", "font-size": "18px"}],
              ["raw-html", function () { 
                return player.g.rank.gte(2)?"<h3>[Graduation II] : Exponent boosts Energy effect by ^"+format(tmp.e.expeffect.pow(1.5))+"":""
            }, { "color": "aqua", "font-size": "22px"}],
            ["raw-html", function () { return player.e.points.gte(player.g.corruption[5]) && shiftDown?"<h3>Exponent corruption : After "+format(player.g.corruption[5],0)+" Exponent , Exponent cost scaling base is ^"+format((player.e.points.div(player.g.corruption[5])).max(1).root(-2),4)+"":""}, { "color": "red", "font-size": "22px"}],

            ["microtabs", "stuff", { 'border-width': '0px' }],
        ],
        deactivated() {
            return inChallenge('c',11)
        },
}) 

addLayer("r", {
    startData() { return {
        //basic data                  
        unlocked: true,                     
        points: d(0),
        best: d(0),
        prestigetime: d(0),
        tickspeedbonus : d(1),
        first:d(0),
        spenttick: d(0),
        //basicmastery 
        bestmastery: d(0),
        mastery: d(0),
        basemastery : d(0),
        numbermastery : d(0),
        additivemastery : d(0),
        subtractivemastery : d(0),
        multiplicativemastery : d(0),
        divisivemastery: d(0),
        exponentmastery : d(0),
        researchmastery: d(0),
        tetrationmastery:d(0),
        //algebra field mastery
        functionmastery: d(0),
        extensionmastery: d(0),
        operationmastery: d(0),
        //other source of mastery
        researchmilestone3mastery: d(0),
        metaresearchmastery: d(0),
        ptsacrificemastery: d(0),
        // Meta-research challenge requirement
        MRCreq:d(10000),
        //improvement
        improvementfactor : d(0),
        deltatime : d(0),
        //field 
        infield: false,
        currentfield: "",
        algebraf: d(0),
        geometryf: d(0),
        geometryunlocked: d(0),
        //meta research
        metaresearch: d(0),
        nextmetaresearch : d(0),

        //dark & light sub , add
        lightadd:d(0),
        lightaddpersec:d(0),
        darksub:d(0),
        darksubpersec:d(0),
        twilight:d(0),
        twilightpersec:d(0),
        energy: d(0),
        energypersec: d(0),

        la1:d(1),
        la2:d(1),
        la3:d(1),
        da1:d(1),
        da2:d(1),
        da3:d(1),
        ta1:d(1),
        ee1: d(1),
        //
        cdcomp: d(0),
        //best resource (altered)
        nbest: d(0),
        abest: d(0),
        sbest: d(0),
        mbest: d(0),
        dbest: d(0),
        ebest: d(0),
        mabest: d(0),
        pointbest: d(0),
        tbest: d(0),
        //gamespeed
        gamespeed: d(1),
        gsreq: d(1),
        gssoftcap: d(5),
        gsbase: d(1),
        gsupkeep: d(1),
        truegamespeed: d(1),
        //tet
        tetration: d(0),
        tetrationpower: d(1),
        tetrationcost: d(100),
        timer: d(0), //Tetration timer
        timer2: d(100), //Challenge timer
        random : d(0),
        failedattempt: d(0),
        //challenge
        challengeshard: d(0),
        potshard: d(0),
        savedtetration : d(0),
        savedresearch: d(0),

        c1: d(0),  //modifier 1 (Points shredder)
        c2: d(0),  //modifier 2 (Resource reducer)
        c3: d(0),  //modiifer 3 (Frozen time)
        c4: d(0),  //modifier 4 (Weaken exponent)
        c5: d(0),  //modifier 5 (Cost superscaler)
        c6: d(0),  //modifier 6 (Algebric failure)
        c7: d(0),  //modifier 7 (Harden challenge)
        c8: d(0), //modifier 8 (Ultimatium)
        c9: d(0), //Modifier 9 , Exclusive to Challenge sacrifice (Tickspeed Overdrive)
        c10: d(1), //Modifier 10 , Exclusive to Challenge sacrifice (Curse of Corruption) ; 1:N , 2:A , 3:S , 4:M , 5:D , 6:E , 7:PP , 8:R , 9:PT , 10:MR , 11:LA , 12:DS , 13:Tw , 14:En , 15:T


        cha: d(1), //reduce points gain (1)
        chb: d(1), //reduce pre-research resource & divisor (2)
        chc: d(1), //reduce gamespeed (3)
        chd: d(1), //reduce exponent effect and perk power gain (4)
        che: d(1), //cost scaling for additive & subtractive start earlier (5)
        chf: d(1), //the cost scaling for additive and subtractive is stronger (5)
        chg: d(1), //Decrease A,B,C,X variable gained (6)
        chh: d(1), //Decrease Extension and operation gain (6)
        chi: d(1), //Increase pre-research challenge goal (7)
        chj: d(1), //Decrease pre-research challenge reward (7)
        chk: d(1), //Decrease Mastery per incompleted challenge (7)
        chl: d(1), //Decrease Tickspeed exponent (9 - exclusive)
    }},
    hotkeys: [
        {key: "H", description: "Shift + H: Reset for Research", onPress(){if (true) buyBuyable('r',10)} , unlocked() {return hasAchievement('ac',39) && !inChallenge('c',11)}},
        {key: "M", description: "Shift + M: Reset for Meta-research", onPress(){if (true) buyBuyable('r',110)} , unlocked() {return hasAchievement('ac',91) && !inChallenge('c',11)}},
        {key: "T", description: "Shift + T: Reset for Tetration", onPress(){if (true) buyBuyable('r',120)} , unlocked() {return hasAchievement('ac',93) && !inChallenge('c',11)}},

    ],
    tooltip() {
    let a = "<br> "+formatWhole(player.r.points)+" R"
    if(hasMilestone('r',4)) a += ", "+formatTime(player.r.prestigetime)+" PT"
    if(player.r.bestmastery.gte("e4")) a += "<br> "+f(player.r.metaresearch)+" MR"
    if(hasAchievement('ac',89)) a += ", "+formatWhole(player.r.tetration)+" Tetr" 
    if(player.r.lightadd.gt(0)) a += "<br> "+f(player.r.lightadd)+" LA"
    if(player.r.darksub.gt(0)) a += ", "+f(player.r.darksub)+" DS"
    if(player.r.twilight.gt(0)) a += "<br>"+f(player.r.twilight)+" Tw"
    if(player.r.energy.gt(0)) a += ", "+f(player.r.energy)+" En"
    if(player.r.challengeshard.gt(0)) a += "<br>"+formatWhole(player.r.challengeshard)+" CS"

    if(!options.subCurrency) a = ""
    if(inChallenge('c',11)) return "Old Research"
    return "-- Research --"+a
    },
    ttStyle() {
        return {
            "color":"#b598eb",
            "width":"200px",
            "border":"2px solid",
            "border-color":"purple",
        }
    },
    
    color: "#5020EC",                       // The color for this layer, which affects many elements.
    resource: "Research",            // The name of this layer's main prestige resource.
    layerName: "Research",
    row: 5,                                 // The row this layer is on (0 is the first row).
    branches:['al'],  
    baseResource: "exponents",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.e.points },  // A function to return the current amount of baseResource.

    requires: d(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.2,                          // "normal" prestige gain is (currency^exponent).
    base:1.1,

    milestonePopups() {return !hasAchievement('ac',112)},

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = d(1)
        multi = multi.div(player.g.artifactset2[0])
        if (hasUpgrade('n',52)) multi = multi.div(buyableEffect('n',33))

        return multi 
    },
    gainExp() {   
        let exp = d(1) 
        if(player.r.c10.gt(0) && player.r.c10.neq(8)) exp = d(0)
        return exp
    },
    directMult() {
        let base = d(1)
        base = base.times(player.g.artifactset1[7])
        return base
    },

    layerShown() { return (hasMilestone('e', 8)||hasAchievement('ac',39))},          // Returns a bool for if this layer's node should be visible in the tree.
    deactivated() {
        return inChallenge('c',11)
    },

    effect() {
        if(player.r.points.eq(0)) return d(1)
        let power = d(2).add(player.r.points.pow(1.25).max(1).div(15))
        if(hasUpgrade('r',24)) power = power.pow(1.1)
        let base = (d(power).pow(player.r.points).add(player.r.points.add(1).pow(power)).add(d(7).pow(player.r.points.pow(1.25).div(7)))).times(d(power.pow(0.15)).pow(player.r.points.add(1).pow(1.25))).div(2.5)
        return base
    },
    resetDescription:"Research further for ",
    infoboxes: {
        lore: {
            title: "Research cost",
            body() {
                return ""+Qcolor2('r','Base cost')+" : "+Qcolor2('r',format(d(1.1).pow(player.r.points.pow(1.2)).times(10)))+" . "+Qcolor2('a','Cost reduction')+" : /"+Qcolor2('a',format(tmp.r.gainMult.pow(-1)))+""  },
        },
    },
    automate() {
//Mastery
        let basem = player.n.points.add(1).pow(2).slog()
        if(player.n.points.eq(0)) basem = d(0)
        if(hasAchievement('ac',52)) basem = basem.pow(1.15)
        let addm = player.a.points.add(10).log(10)
        if(hasAchievement('ac',166)) addm = addm.pow(1.05)
        let subm = player.s.points.add(10).log(10)
        if(hasAchievement('ac',166)) subm = subm.pow(1.05)
        let mulm = player.m.points.add(10).slog().max(1).pow(1.2)
        if(hasAchievement('ac',53)) mulm = mulm.pow(1.15)
        let divm = player.d.points.add(10).slog().max(1).pow(1.2)
        let expm = player.e.effective.add(10).pow(2).log(10).sub(1)
        let resm = player.r.points.add(1).pow(0.45)
        let resm1 = softcap(resm,d(1.35),0.3)
        let tetm = player.r.tetration.add(1).pow(0.5)
        let tetm1 = softcap(tetm,d(1.15),0.25)

        let functionm = player.al.value.add(10).slog().pow(1.2)
        let extensionm = player.al.extension.add(10).log(10).add(9).log(10).pow(2)
        if(extensionm.gte(4)) extensionm = (extensionm.times(2497.5).add(10)).log(10)
        let operationm = player.al.operation.add(10).slog().pow(0.33)
        if(hasUpgrade('al',51)) operationm = operationm.pow(1.15)

        
        player.r.basemastery = basem
        player.r.additivemastery = addm
        player.r.subtractivemastery = subm
        player.r.multiplicativemastery = mulm
        player.r.divisivemastery = divm
        player.r.exponentmastery = expm 
        player.r.researchmastery = resm1
        player.r.tetrationmastery = tetm1
        player.r.functionmastery = functionm
        player.r.extensionmastery = extensionm
        player.r.operationmastery = operationm
        player.r.researchmilestone3mastery = player.r.infield?d(1.2):d(1)
        //harden challenge modifier stuff
        let completedpreresearchchallenge = d(0)
        if(hasChallenge('m',11)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('m',12)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('d',11)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('d',12)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('d',13)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('e',11)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('e',12)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)

        if(!inChallenge('r',11)) completedpreresearchchallenge = d(7)
        let masterydivide = player.r.chk.pow(completedpreresearchchallenge.sub(7).abs())
        player.r.metaresearchmastery = masterydivide
        player.r.ptsacrificemastery = player.g.sacrificeactive[2].gte(1)?d(1.67):d(1)
        player.r.mastery = basem.times(addm).times(subm).times(mulm).times(divm).times(expm).times(resm1).times(functionm).times(extensionm).times(operationm).times(player.r.researchmilestone3mastery).times(tetm1).div(masterydivide).times(player.r.ptsacrificemastery)
        let dtime = d(1)
        if(hasUpgrade('t',21)) dtime = dtime.add(upgradeEffect('t',21))
        if(hasUpgrade('t',22)) dtime = dtime.add(upgradeEffect('t',22))
        if(hasUpgrade('t',23)) dtime = dtime.add(upgradeEffect('t',23))
        if(hasUpgrade('t',24)) dtime = dtime.add(upgradeEffect('t',24))
        if(hasAchievement('ac',51)) dtime = dtime.times(2)
        if(hasAchievement('ac',159)) dtime = dtime.times(achievementEffect('ac',159))
        if(hasAchievement('ac',62)) dtime = dtime.times(achievementEffect('ac',62))
        if(hasUpgrade('t',44)) dtime = dtime.times(upgradeEffect('t',44))
        if(player.r.tetration.gte(10)) dtime = dtime.times(player.r.challengeshard.add(1))
        if(player.r.tetration.gte(11)) dtime = dtime.times(2)
        if(inChallenge('e',13)) dtime = dtime.times(0)
        if(player.r.c10.gt(0) && player.r.c10.neq(9)) dtime = d(0)
        if(player.g.sacrificeactive[2].gte(1)) dtime = d(0)
        dtime = dtime.times(player.g.artifactset4[2]).times(buyableEffect('n',63))
        player.r.deltatime = dtime.times(player.r.truegamespeed).times(d(1.1).pow(player.r.cdcomp))
        player.r.bestmastery = player.r.mastery.max(player.r.bestmastery)
        let a = tmp.r.effect
        player.r.tickspeedbonus = a 

        //Meta-research
        let mr = player.r.mastery.div(10000).pow(0.75)
        if(player.g.sacrificeactive[3].gte(1)) mr = mr.times(3)
        if(hasSuperAchievement('ac',44)) mr = mr.times(1.15)
        player.r.nextmetaresearch = mr.times(buyableEffect('n',62))

        let t = getBuyableAmount(this.layer, '101').add(getBuyableAmount(this.layer, '102')).add(getBuyableAmount(this.layer, '103')).add(getBuyableAmount(this.layer, '104')).add(getBuyableAmount(this.layer,'105'))
        if(hasUpgrade('r',101)) t = t.div(2)
        player.r.improvementfactor = t
        player.r.first = d(0)
        if((hasMilestone('r',4) && !inChallenge('al',11) && (!inChallenge('d',13) || hasChallenge('d',13))) || player.r.tetration.gte(5)) {
            for (let i = 0 ; i < 10 ; i++) {
                let j = i % 4 + 1
                let k = Math.floor(i / 4) * 10 + 10
                let l = j + k 
                buyUpgrade('n',l)
            }           
        autobuyUpgrades('a')
        autobuyUpgrades('s')
        autobuyUpgrades('d')
        autobuyUpgrades('e')
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
        if (player.r.tetration.gte(1)) {
            buyUpgrade('m',63)
            buyUpgrade('m',64)
            buyUpgrade('m',71)
            buyUpgrade('m',72)
            buyUpgrade('m',73)
            buyUpgrade('m',74)
        }
    }
        if(hasUpgrade('r',32)) {
            buyBuyable('al',11)
            buyBuyable('al',12)
            buyBuyable('al',13)
            buyBuyable('al',14)
            buyUpgrade('al',11)
            buyUpgrade('al',12)
            buyUpgrade('al',13)
            buyUpgrade('al',14)

        }
        if (hasUpgrade('r',33)) {
            buyBuyable('al',31)
            buyBuyable('al',32)
            buyBuyable('al',33)
            buyBuyable('al',34)
            buyUpgrade('al',31)
            buyUpgrade('al',32)
            buyUpgrade('al',33)
            buyUpgrade('al',34)
            buyUpgrade('al',41)
            buyUpgrade('al',42)
            buyUpgrade('al',43)
            buyUpgrade('al',44)
            buyUpgrade('al',51)
            buyUpgrade('al',52)
            buyUpgrade('al',53)
            buyUpgrade('al',54)

        }
        if (hasUpgrade('r',31)) {
            buyBuyable('al',21)
            buyBuyable('al',22)
            buyBuyable('al',23)
            buyBuyable('al',24)
            buyUpgrade('al',21)
            buyUpgrade('al',22)
            buyUpgrade('al',23)
            buyUpgrade('al',24)
        }
        if(true) {
            buyBuyable('r',111)
        }
        if(hasUpgrade('r',103)) {
            buyBuyable('r',101)
            buyBuyable('r',102)
            buyBuyable('r',103)
            buyBuyable('r',104)
        }
        if (player.r.buyables[201].eq(0)) {
            player.r.lightadd = d(0)
            player.r.twilight = d(0)
        }
        if (player.r.buyables[301].eq(0)) {
            player.r.darksub = d(0)
            player.r.twilight = d(0)
        }
        if (player.r.buyables[501].eq(0)) {
            player.r.energy = d(0)
        }
        if (hasUpgrade('r',22)) {
            for (id in tmp.e.buyables)
            if (isPlainObject(tmp.e.buyables[id]) && (layers.e.buyables[id].canAfford === undefined || layers.e.buyables[id].canAfford() === true))
                buyBuyable('e', id) 
        }
        if(player.r.gsupkeep.lt(10)) {
            buyBuyable('r',1004)
        }

        //twilight
        let light = buyableEffect('r',201).times(buyableEffect('r',202)).pow(buyableEffect('r',203))
        if(hasUpgrade('r',41)) light = light.times(10)
        if(player.r.tetration.gte(10)) light = light.times(player.r.challengeshard.add(1))
        if (hasUpgrade('n',52)) light = light.times(buyableEffect('n',51))
        if(hasUpgrade('r',105)) light = light.times(upgradeEffect('r',105))
        if(player.r.c10.gt(0) && player.r.c10.neq(11)) light = d(0)



        let dark =  buyableEffect('r',301).times(buyableEffect('r',302)).pow(buyableEffect('r',303))
        if(hasUpgrade('r',41)) dark = dark.times(10)
        if(hasAchievement('ac',102)) dark = dark.times(achievementEffect('ac',102))
        if(player.r.tetration.gte(10)) dark = dark.times(player.r.challengeshard.add(1))
        if (hasUpgrade('n',52)) dark = dark.times(buyableEffect('n',51))
        if(hasUpgrade('r',105)) dark = dark.times(upgradeEffect('r',105))
        if(player.r.c10.gt(0) && player.r.c10.neq(12)) dark = d(0)


        let twi = player.r.lightadd.times(player.r.darksub).pow(0.5).div(100)
        if(player.r.tetration.gte(10)) twi = twi.times(player.r.challengeshard.add(1))
        if (hasUpgrade('n',52)) twi = twi.times(buyableEffect('n',52))
        if(hasUpgrade('r',105)) twi = twi.times(upgradeEffect('r',105))
        if(player.r.c10.gt(0) && player.r.c10.neq(13)) twi = d(0)


        player.r.lightaddpersec = light.times(buyableEffect('r',401)).times(player.r.truegamespeed)
        player.r.darksubpersec = dark.times(buyableEffect('r',401)).times(player.r.truegamespeed)
        player.r.twilightpersec = twi.times(player.r.truegamespeed).times(player.r.ee1)

        let leff1 = player.r.lightadd.pow(player.r.lightadd.add(10).log(10).times(4)).pow(d(1).add(buyableEffect('r',402).div(100)))
        let leff11 = softcap(leff1,d("1e100"),0.05)
        let leff110 = softcap(leff11,d("1e1000"),0.25)
        let leff111 = postcorruptiongain(leff110,0.1,d("1e1500"))
        let leff2 = player.r.lightadd.pow(player.r.lightadd.add(10).log(10).times(6)).pow(d(1).add(buyableEffect('r',402).div(100)))
        let leff21 = softcap(leff2,d("1e200"),0.25)
        let leff210 = softcap(leff21,d("1e1000"),0.2)
        let leff211 = postcorruptiongain(leff210 ,0.1, d("1e2500"))
        let leff3 = player.r.lightadd.pow(player.r.lightadd.add(10).log(10).times(4).pow(1.5)).pow(d(1).add(buyableEffect('r',402).div(100)))
        let leff31 = softcap(leff3,d("1e500"),0.05)
        let leff310 = softcap(leff31,d("1e2000"),0.1)
        let leff311 = postcorruptiongain(leff310,0.2 , d("1e4000"))
        let deff1 = player.r.darksub.pow(player.r.darksub.add(10).log(10).times(3).pow(1.5)).pow(d(1).add(buyableEffect('r',402).div(100)))
        let deff11 = softcap(deff1,d("1e800"),0.2)
        let deff110 = softcap(deff11,d("1e4000"),0.1)
        let deff111 = postcorruptiongain(deff110,0.15 , d("1e6000"))
        let deff2 = player.r.darksub.pow(player.r.darksub.add(10).log(10).times(5)).pow(d(1).add(buyableEffect('r',402).div(100)))
        let deff21 = softcap(deff2,d("1e500"),0.15)
        let deff210 = softcap(deff21,d("1e1000"),0.1)
        let deff211 = postcorruptiongain(deff210 , 0.15 , d("1e2000"))
        let deff3 = player.r.darksub.pow(player.r.darksub.add(10).log(10).times(4).pow(1.625)).pow(d(1).add(buyableEffect('r',402).div(100)))
        let deff31 = softcap(deff3,d("1e500"),0.05)
        let deff310 = softcap(deff31,d("1e2500"),0.1)
        let deff311 = postcorruptiongain(deff310 , 0.2 ,  d("1e4000"))
        let teff = player.r.twilight.pow(0.25).add(1)
        let ee1 = player.r.energy.add(2).log(2).pow(3.5)
        if(hasSuperAchievement('ac',66)) ee1 = ee1.pow(3)
        if(player.g.rank.gte(2)) ee1 = ee1.pow(tmp.e.expeffect.pow(1.5))
        
        if(hasAchievement('ac',68)) teff = teff.pow(2)
        player.r.la1 = leff111.max(1)
        player.r.la2 = leff211.max(1)
        player.r.la3 = leff311.max(1)
        player.r.da1 = deff111.max(1)
        player.r.da2 = deff211.max(1)
        player.r.da3 = deff311.max(1)
        player.r.ta1 = teff.max(1)
        player.r.ee1 = ee1.max(1)
        //
        player.r.gssoftcap = d(1.5)
        let basetime =  player.r.gsbase.pow(2).times(1000)
        if(player.r.gsbase.times(5).gt(player.r.gssoftcap.times(5))) basetime = basetime.times(d(d(2).add(player.r.gsbase.times(0.2))).pow(player.r.gsbase.times(5).sub(player.r.gssoftcap.times(5))))
        player.r.gsreq = basetime.sub(1000).floor()
        player.r.gsupkeep = player.t.points.div(player.r.gsreq.max(1))

        let gspd = player.r.gamespeed
        let ospd = player.o.gamespeed

        //Gamespeed
        let basegamespeed = d(1)
        if (inChallenge('r',11)) basegamespeed = basegamespeed.div(player.r.chc)
        if (hasAchievement('ac',99)) basegamespeed = basegamespeed.times(2)
        if (hasAchievement('ac',101)) basegamespeed = basegamespeed.times(achievementEffect('ac',101))
        if (hasAchievement('ac',121)) basegamespeed = basegamespeed.times(achievementEffect('ac',121))
        basegamespeed = basegamespeed.times(player.g.artifactset4[0]).times(buyableEffect('n',72))
        if(inChallenge('e',13)) basegamespeed = basegamespeed.times(50)
        if (player.g.sacrificeactive[1].gte(1)) basegamespeed = basegamespeed.times(player.r.mastery.max(1))
        if(hasUpgrade('t',41)) basegamespeed = basegamespeed.times(upgradeEffect('t',41))
        if(player.r.tetration.gte(16)) basegamespeed = basegamespeed.times(3)
        basegamespeed = basegamespeed.times(buyableEffect('g',202))
        basegamespeed = basegamespeed.times(buyableEffect('n',101)).times(buyableEffect('n',102)).times(buyableEffect('n',103))
        if(hasSuperAchievement('ac',25)) basegamespeed = basegamespeed.times(3)
        if(hasAchievement('ac',127)) basegamespeed = basegamespeed.times(achievementEffect('ac',127).div(100).add(1))
        if(options.gamepaused) basegamespeed = d(0)
        if(!inChallenge('al',11) && player.g.sacrificeactive[3].eq(1)) basegamespeed = d(0)
        if(player.g.sacrificeactive[6].gte(1) && !(player.r.potshard.eq(56) && inChallenge('r',11))) basegamespeed = d(0)
        if(player.r.timer2.lte(0.5)) basegamespeed = d(0)
        if(player.g.timer2.lte(0.5)) basegamespeed = d(0)
        if(inChallenge('c',11)) basegamespeed = d(1)
        if(player.o.heat.gte(player.o.maxHeat.div(2))) basegamespeed = basegamespeed.times(d(1).sub(player.o.heat.div(player.o.maxHeat).sub(0.5).times(2).pow(1.5)))
        player.r.truegamespeed = basegamespeed.times(gspd.times(ospd))

        //End of Gamespeed
        //Tetration cost
        let abase = d(1.09)
        if(player.r.tetration.gte(20)) abase = abase.add(player.r.tetration.sub(19).div(100))
        basetetcost = d(100).times(d(abase).pow(player.r.tetration)).floor()
        if(player.r.tetration.gte(6)) basetetcost = basetetcost.add(player.r.tetration.pow(2))
        if(hasUpgrade('n',52)) basetetcost = basetetcost.times(buyableEffect('n',71))
        if(hasAchievement('ac',103)) basetetcost = basetetcost.sub(25)
        if(hasUpgrade('t',51)) basetetcost = basetetcost.sub(upgradeEffect('t',51))
        if(hasUpgrade('t',52)) basetetcost = basetetcost.sub(upgradeEffect('t',52))
        let tetlimit = d(10)
        if(hasAchievement('ac',122)) tetlimit = tetlimit.add(player.r.challengeshard.div(14).floor())
        if(hasSuperAchievement('ac',103)) tetlimit = tetlimit.add(1)
        if(player.g.rank.gte(2)) tetlimit = tetlimit.add(10)
        if(player.r.tetration.gte(tetlimit)) basetetcost = Decimal.dInf
        if(player.r.c10.gt(0) && player.r.c10.neq(15)) basetetcost = Decimal.dInf

        player.r.tetrationcost = d(basetetcost)
        // best
        if(inChallenge('al',11)) {
            player.r.nbest = player.r.nbest.max(player.n.points)
            player.r.abest = player.r.abest.max(player.a.points)
            player.r.sbest = player.r.sbest.max(player.s.points)
            player.r.mbest = player.r.mbest.max(player.m.points)
            player.r.dbest = player.r.dbest.max(player.d.points)
            player.r.ebest = player.r.ebest.max(player.e.effective)
            player.r.pointbest = player.r.pointbest.max(player.points) 
            player.r.mabest = player.r.mabest.max(player.r.mastery)
            player.r.tbest = player.r.tbest.max(tmp.t.effect.clampMax(player.t.cap))

        }
        if(!inChallenge('al',11) && player.g.sacrificeactive[3].gte(1)) {
            buyUpgrade('al',24)
            startChallenge('al',11)
        }
        if(player.g.sacrificeactive[6].gte(1) && !(player.r.potshard.eq(56) && inChallenge('r',11))) {
            player.r.c1 = d(8)
            player.r.c2 = d(8)
            player.r.c3 = d(0)
            player.r.c4 = d(8)
            player.r.c5 = d(8)
            player.r.c6 = d(8)
            player.r.c7 = d(8)
            player.r.c8 = d(8)

            startChallenge('r',11)
            
        }
        //Challenge timer ... || is OR logical
        if(player.r.timer2.lte(0.25)) {
            player.points = getStartPoints()
            player.n.points = d(0)
            player.a.points = d(0)
            player.s.points = d(0)
            player.m.points = d(0)
            if(inChallenge('al',11)) player.d.points = d(0)
            if(inChallenge('al',11)) player.e.points = d(0)
        }
        if(inChallenge('r',11) && player.g.sacrificeactive[6].gte(1)) {
            player.r.c10 = (player.g.timer2.div(900).sub(player.g.timer2.div(900).floor())).times(15).ceil()
        } else {
            player.r.c10 = d(0)
        }
        //challenge stuff 
            let weaken = (100 - (player.g.artifactset4[3] - 1 )) / 100
            player.r.potshard = player.r.c1.add(player.r.c2).add(player.r.c3).add(player.r.c4).add(player.r.c5).add(player.r.c6).add(player.r.c7).add(player.r.c8)
            let ulti = player.r.c8.times(0.25)
            player.r.cha = d(0.84).pow(player.r.c1.add(ulti)).pow(weaken)
            player.r.chb = d(0.917).pow(player.r.c2.add(ulti)).pow(weaken)
            player.r.chc = player.r.c3.add(ulti).add(1).pow(player.r.c3.add(ulti).pow(1.25)).pow(weaken ** 2)
            player.r.chd = d(0.9).pow(player.r.c4.add(ulti)).pow(weaken)
            player.r.che = d(1.25).pow(player.r.c5.add(ulti)).pow(weaken)
            player.r.chf = d(1.08).pow(player.r.c5.add(ulti)).pow(weaken)
            player.r.chg = d(0.92).pow(player.r.c6.add(ulti)).pow(weaken)
            player.r.chh = d(0.94).pow(player.r.c6.add(ulti)).pow(weaken)
            player.r.chi = d(1.14).pow(player.r.c7.add(ulti)).pow(weaken)
            player.r.chj = d(1).sub(player.r.c7.pow(weaken).add(ulti).div(2.5))
            player.r.chk = d(1.0125).pow(player.r.c7.add(ulti))
            player.r.chl = d(1).sub(d(0.995).pow(player.points.add(10).log(10).add(1).pow(0.5).times(2).add(1)))
            //Energy
            let energygain = (d(1).times(buyableEffect('r',501)).times((player.r.energy.add(1)).pow(-0.25))).times(buyableEffect('r',502))
            if(player.r.tetration.gte(10)) energygain = energygain.times(player.r.challengeshard.add(1))
            if (hasUpgrade('n',52)) energygain = energygain.times(buyableEffect('n',53))
            if (hasUpgrade('r',105)) energygain = energygain.times(upgradeEffect('r',105))
            if(hasAchievement('ac',154)) energygain = energygain.times(achievementEffect('ac',154))
            energygain = energygain.pow(buyableEffect('r',503))
            if(player.r.c10.gt(0) && player.r.c10.neq(14)) energygain = d(0)
            if(hasSuperAchievement('ac',93)) energygain = energygain.pow(1.5)
            player.r.energypersec = energygain.times(player.r.truegamespeed)
        },
    update(delta) {
        if (hasMilestone('r',3) || player.g.sacrificeactive[6].gte(1)) {
        player.r.prestigetime = player.r.prestigetime.add(player.r.deltatime.times(delta))
        }
        if(player.r.mastery.gte(1000)) {
        player.r.lightadd = player.r.lightadd.add(player.r.lightaddpersec.times(delta))
        player.r.darksub = player.r.darksub.add(player.r.darksubpersec.times(delta))

        player.r.twilight = player.r.twilight.add(player.r.twilightpersec.times(delta))
        player.r.energy = player.r.energy.add(player.r.energypersec.times(delta))
        }
        player.r.timer = player.r.timer.add(delta)
        player.r.timer2 = player.r.timer2.add(delta)
        if(player.r.gamespeed.gt(1)) {
            player.t.points = player.t.points.sub(player.r.gsreq.times(delta))
            player.r.spenttick = player.r.spenttick.add(player.r.gsreq.times(delta))
        }
        if(hasMilestone('g',7)) player.r.metaresearch = player.r.metaresearch.add(player.r.nextmetaresearch.times(0.2).times(delta).times(player.o.gamespeed))
    },

    milestones: {
        1: {
            requirementDescription: "1 Research (1)",
            effectDescription() {return ""+Qcolor2('t','Autobuy')+" "+Qcolor2('a','additive')+" & "+Qcolor2('s','subtractive')+" <br> "+Qcolor2('pink3','Reduce Exponent')+" cost scaling base by "+Qcolor2('n','/1.075')+""},
            done() { return player.r.points.gte(1) || hasUpgrade('r',14) }
        },
        2: {
            requirementDescription: "2 Research (2)",
            effectDescription() {return ""+Qcolor2('t','Passively')+" gain "+Qcolor2('n','100% Number')+" , "+Qcolor2('blue4','Multiplicative')+" and "+Qcolor2('d','Divisive')+" /s <br> "+Qcolor2('t','Keep')+" "+Qcolor2('n','Number')+" and "+Qcolor2('t','all Row2 upgrade')+" on "+Qcolor2('r','Research')+" reset"},
            done() { return player.r.points.gte(2) }
        }, 
        3: {
            requirementDescription: "3 Research (3)",
            effectDescription() {return options.hidemastery?""+Qcolor2('t','Unlock')+" "+Qcolor2('blue5','Research improvements')+"":"Gain "+Qcolor2('pink2','x1.2')+" "+Qcolor2('pink1','Mastery')+" <br> "+Qcolor2('t','Unlock')+" "+Qcolor2('blue5','Research improvements')+""},
            done() { return player.r.points.gte(3) }
        },       
        4: {
            requirementDescription: "4 Research (4)",
            effectDescription() {return ""+Qcolor2('t','Autobuy')+" "+Qcolor2('pink3','Row1 - row3 upgrades')+""},
            done() { return player.r.points.gte(4) }
        },
                   
    },
    upgrades: {
        11: {
            title: "Simple Number",
            description: "'Number QOL' operation upgrade is always active",
            cost: d("1"),
            tooltip:"Effect : Always unlock Row 2 Number upgrade with lowered Number cost (^0.25)",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         12: {
            title: "Passive Number",
            description() {return "'Passive Number' operation upgrade is always active <br> and "+fde(9)+"x Number gain"},
            cost: d("1"),
            tooltip(){return "Gain 100% of number gain on reset per second (ignoring tickspeed) and additional "+format(d("1e9"))+"x Number gain"},
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch", 
            unlocked() { return true }},
         13: {
            title: "Keep Row2 I",
            description: "Keep Additive and Subtractive resources on Meta-reset or prior resets",
            cost: d("2"),
            tooltip:"Prevent current currency , upgrades from being reset , Do not work when entering altered realm",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         14: {
            title: "Passive Row2 I",
            description: "Retain the 1st Research milestone on reset",
            tooltip:"Effect : Autobuy Additive & Subtractive and 7.5% lower Exponent cost scaling base",
            cost: d("1"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         15: {
            title: "Keep row2 II",
            description: "Keep multiplicative , divisive resources on Meta-reset or prior resets",
            cost: d("2"),
            tooltip:"Prevent all currency , upgrades , challenges from being reset <br> do not work when entering altered realm",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         21: {
            title: "Keep Exponent",
            description() {return "Keep Exponent upgrade , challenge on Research reset / Meta-reset <br> Autobuy Exponent"},
            cost: d("3"),
            currencyLocation() { return player.r },
            tooltip(){return "Always keep Exponent Upgrade , challenge on resets <br> Also autobuy Exponent"},
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         22: {
            title: "Easier Perk",
            description: "Increase max Perk Power and Keep Exponent Milestone on Research reset / Meta-reset",
            cost: d("1"),
            currencyLocation() { return player.r },
            tooltip(){return "Exponent provides ~23% more Perk Power <br> Keep Exponent Milestone on reset (not when entering altered realm)"},
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         23: {
            title: "No mistake",
            description: "Improvement reset do not decrease Prestige Time",
            cost: d("1"),
            currencyLocation() { return player.r },
            tooltip:"Resetting Research Improvement do not reduce Prestige Time by 25% . But still force an Exponent reset",
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         24: {
            title: "Effortless Research",
            description: "Research boost Tickspeed even more",
            cost: d("1"),
            tooltip:"Research tickspeed bonus now scale 10% faster ",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         31: {
            title: "Passive Extension",
            description: "Gain 10% of Extension gain next reset/s <br> Autobuy all operation upgrade and buyable",
            cost: d("4"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         32: {
            title: "Easier Extension",
            description: "Automaticly buy all coefficient , variable and main upgrade <br> Keep all (4) algebric upgrade on Extension reset",
            cost: d("4"), 
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         33: {
            title: "Simple Operation",
            description: "Automaticly buy Operation upgrade and buyable",
            cost: d("3"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         41: {
            title: "Lightness",
            description: "x10 Light additive gain",
            cost: d("10"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         42: {
            title: "Darkness",
            description: "x10 Dark subtractive gain",
            cost: d("10"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         51: {
            title: "Operationless",
            description() {                
                return "Passive Operation generation based on Points"
            },
            tooltip() {
                let base = d(2).pow((player.points.add(10).log(10).pow(2.5)).add(4).div(4)).sub(2)
                if(base.gte("1e6")) base = d("1e6").times(base.div(500000).max(2).log(2))
                return "Effect : +"+format(base)+" Operation/s"
            },
            cost: d("10"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
        101: {
            title: "Effective Improvement",
            description: "Decrease the cost increase to all improvement when buying improvement by 50%",
            cost() {
                let base = d(100)
                if(hasUpgrade('r',102)) base = base.times(1.3)
                if(hasUpgrade('r',103)) base = base.times(1.3)
                if(hasUpgrade('r',104)) base = base.times(1.3)
                if(hasUpgrade('r',105)) base = base.times(1.3)
                if(hasUpgrade('r',106) && !hasAchievement('ac',1013)) base = base.times(1.3)
                return base},
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
        102: {
            title: "Cheaper Improvement",
            description: "All Improvements cost is raised ^0.67",
            cost() {
                let base = d(100)
                if(hasUpgrade('r',101)) base = base.times(1.3)
                if(hasUpgrade('r',103)) base = base.times(1.3)
                if(hasUpgrade('r',104)) base = base.times(1.3)
                if(hasUpgrade('r',105)) base = base.times(1.3)
                if(hasUpgrade('r',106) && !hasAchievement('ac',1013)) base = base.times(1.3)
                return base},            
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
        103: {
            title: "Automated Improvement",
            description: "Improvement is automaticly bought inside their respective challenge",
            cost() {
                let base = d(100)
                if(hasUpgrade('r',102)) base = base.times(1.3)
                if(hasUpgrade('r',101)) base = base.times(1.3)
                if(hasUpgrade('r',104)) base = base.times(1.3)
                if(hasUpgrade('r',105)) base = base.times(1.3)
                if(hasUpgrade('r',106) && !hasAchievement('ac',1013)) base = base.times(1.3)
                return base},            
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
        104: {
            title: "Versatile Improvement",
            description: "All Improvements increase the reward of their respective challenge . Effect varies across challenge",
            cost() {
                let base = d(100)
                if(hasUpgrade('r',102)) base = base.times(1.3)
                if(hasUpgrade('r',103)) base = base.times(1.3)
                if(hasUpgrade('r',101)) base = base.times(1.3)
                if(hasUpgrade('r',105)) base = base.times(1.3)
                if(hasUpgrade('r',106) && !hasAchievement('ac',1013)) base = base.times(1.3)
                return base},            
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         105: {
            title: "Energetic Improvement",
            description: "Product of improvement levels multiply all twilight resources gain",
            tooltip() {return "All twilight resources is referred to Light additive , Dark subtractive , Twilight and Energy"},
            cost() {
                let base = d(100)
                if(hasUpgrade('r',102)) base = base.times(1.3)
                if(hasUpgrade('r',103)) base = base.times(1.3)
                if(hasUpgrade('r',101)) base = base.times(1.3)
                if(hasUpgrade('r',104)) base = base.times(1.3)
                if(hasUpgrade('r',106) && !hasAchievement('ac',1013)) base = base.times(1.3)
                return base},            
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true },
            effect() {
                let base = d(1)
                base = base.times(d(player.r.buyables[101]).add(1))
                base = base.times(d(player.r.buyables[102]).add(1))
                base = base.times(d(player.r.buyables[103]).add(1))
                base = base.times(d(player.r.buyables[104]).add(1))
                base = base.times(d(player.r.buyables[105]).add(1))
                return base
            }, 
            effectDisplay() { return "x"+format(upgradeEffect(this.layer,this.id))+"" }, 
            },
        106: {
            title: "??? Improvement",
            description() {return hasUpgrade('r',106)?"Check 'More Operation' improvement for more detail":"Buy this upgrade for more detail"},
            cost() {
                let base = d(100)
                if(hasUpgrade('r',102)) base = base.times(1.3)
                if(hasUpgrade('r',103)) base = base.times(1.3)
                if(hasUpgrade('r',101)) base = base.times(1.3)
                if(hasUpgrade('r',105)) base = base.times(1.3)
                if(hasUpgrade('r',106)) base = base.times(1.3)
                if(hasAchievement('ac',1013)) base = base.times(0)
                return base},            
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},

    },



    buyables: {
        10: {
            title() {
                let a = ""
                a += "<br><br> Next at "+format(getNextAt('r').ceil(),0)+" Exponent" 
                return tmp[this.layer].gainExp.eq(0)?"Cannot reset":"Reset for +1 Research"+a
               } ,
            cost(x) { 
                return d(0) },
            tooltip() {return ""},
            canAfford() {
                return player.e.points.gte(getNextAt('r')) && tmp[this.layer].gainExp.neq(0)
            },
            buy() {
                if(!hasAchievement('ac',112)) {
                    doReset(this.layer,true)
                }
                player[this.layer].points = player[this.layer].points.add(1)
            },
            style() {
                if (this.canAfford())  return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': tmp[this.layer].color,
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
                else if (tmp[this.layer].gainExp.neq(0))  return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': 'red',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } 
				else return {
                    'border-radius': '25%',
                    'color':'black',
                    'background-color': 'crimson',
                    'border':'2px solid',
                    'border-color':'black',
                    'height': '125px'
                } }
        },
        11: {
            title() {
                   return hasUpgrade('r',23)?"Reset all Improvements":"Reset all Improvements but lose 25% of your Prestige time"
               } ,
            tooltip() {return "Force a Exponent reset as well"},
            ttStyle() {
                return {
                    "color":"#b598eb",
                    "width":"200px",
                    "border":"2px solid",
                    "border-color":"purple",
                }
            },
            cost() { return d(0) },
            canAfford() { return player.points.gte(this.cost())},
            buy() {
                player.r.prestigetime = player.r.prestigetime.times(0.75)
                setBuyableAmount(this.layer, '101', d(0))
                setBuyableAmount(this.layer, '102', d(0))
                setBuyableAmount(this.layer, '103', d(0))
                setBuyableAmount(this.layer, '104', d(0))
                setBuyableAmount(this.layer, '105' ,d(0))

                player.n.points = d(0)
                player.m.points = d(0)
                player.d.points = d(0)
                doReset('e',true)
                if(hasUpgrade('r',23)) {
                    player.r.prestigetime = player.r.prestigetime.times(4).div(3)
                }
            },
            style() {
               return Qcolor('green')}

        },
        101: {
            title() {
                let l = player.r.buyables[101]
                let a = 'More'
                if(l.gte(10)) a = ''
                if(l.gte(10) && l.lt(20)) a = a += 'Super'
                if(l.gte(20) && l.lt(30)) a = a += 'Hyper'
                if(l.gte(30) && l.lt(50)) a = a += 'Extremely'
                if(l.gte(50)) a = a += 'Insanely'
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> "+a+" Fatigued  "
               } ,
            cost(x) { 
                let level = x
                if(player.r.buyables[101].gte(10)) level = (level.div(10)).pow(3).times(10)
                if(player.r.buyables[101].gte(20)) level = level.times(d(1.2).pow(level.div(80))) 
                if(player.r.buyables[101].gte(30)) level = level.times(d(10).pow((level.div(400).log(10)).pow(2)))
                if(player.r.buyables[101].gte(50)) level = (level.div(8829727.26)).tetrate(1.05).times(8829727.26)

                let extralevel = player.r.improvementfactor
                let cost = level.add(extralevel)
                let basecost = d("1e6").pow(cost.pow(1.45)).times("1e100") 
                basecost = basecost.pow(player.g.artifactset2[2])
                if(hasUpgrade('r',102)) basecost = basecost.pow(0.67)
                if(player.g.sacrificeactive[6].gte(1)) basecost = basecost.add(10).log(10).pow(10)
                return basecost
            },
            tooltip() {
                return this.display()
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"purple",
                }
            },
            display() { 
            return "Effect : Multiply "+Qcolor2('n','Multiplicative')+" gain by "+Qcolor2('a',format(this.per())) + " <br> Current Effect : "+Qcolor2('a',format(this.effect())+"x")+"  </br> Requirement : Reach "+Qcolor2('s',format(this.cost()))+" points in "+Qcolor2('s',"'Fatigue'")+" challenge. " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('m',11)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(4)
                let base = player.r.prestigetime.pow(time)
                if(hasSuperAchievement('ac',104)) base = base.pow(tmp.r.buyables[104].effect2)
                let sfcbase = base.pow(x)
                sfcbase = sfcbase.pow(player.g.artifactset3[3])
                return sfcbase.max(1)                
            },
            per() {
                let time = player.r.prestigetime.add(10).log(4)
                let base = player.r.prestigetime.pow(time).pow(player.g.artifactset3[3])
                if(hasSuperAchievement('ac',104)) base = base.pow(tmp.r.buyables[104].effect2)
                return base
            },
            style() {
                 if (!inChallenge('m',11)) return Qcolor()
				
				else if (player.points.lt(this.cost())) return Qcolor('crimson')
				else return Qcolor('green')}
        },
        102: {
            title() {
                let l = player.r.buyables[102]
                let a = 'More'
                if(l.gte(10)) a = ''
                if(l.gte(10) && l.lt(20)) a = a += 'Super'
                if(l.gte(20) && l.lt(30)) a = a += 'Hyper'
                if(l.gte(30) && l.lt(50)) a = a += 'Extremely'
                if(l.gte(50)) a = a += 'Insanely'
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> "+a+" Hardness  "
               },
            cost(x) {
                let level = x
                if(player.r.buyables[102].gte(10)) level = (level.div(10)).pow(3).times(10)
                if(player.r.buyables[102].gte(20)) level = level.times(d(1.2).pow(level.div(80))) 
                if(player.r.buyables[102].gte(30)) level = level.times(d(10).pow((level.div(400).log(10)).pow(2)))
                if(player.r.buyables[102].gte(50)) level = (level.div(8829727.26)).tetrate(1.05).times(8829727.26)                
                let extralevel = player.r.improvementfactor
                let cost = level.add(extralevel)
                let basecost = d(10).pow(cost.pow(1.225)).times("1e9")
                basecost = basecost.pow(player.g.artifactset2[2])
                if(hasUpgrade('r',102)) basecost = basecost.pow(0.67)
                if(player.g.sacrificeactive[6].gte(1)) basecost = basecost.add(10).log(10).pow(10)

                return basecost },
            tooltip() {
                return this.display()
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"purple",
                }
            },
            display() { 
                return "Effect : Multiply "+Qcolor2('n','Divisive')+" gain by "+Qcolor2('a',format(this.per())) + " <br> Current Effect : "+Qcolor2('a',format(this.effect())+"x")+"  </br> Requirement : Reach "+Qcolor2('s',format(this.cost()))+" points in "+Qcolor2('s',"'Worsen condition'")+" challenge. " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('d',12)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(40)
                let base = player.r.prestigetime.pow(time).pow(1.25)
                let sfcbase = base.pow(x)
                if(hasSuperAchievement('ac',104)) sfcbase = sfcbase.pow(tmp.r.buyables[104].effect2)
                sfcbase = sfcbase.pow(player.g.artifactset3[3])
                return sfcbase.max(1)           
            },
            per() {
                let time = player.r.prestigetime.add(10).log(40)
                let base = player.r.prestigetime.pow(time).pow(1.25).pow(player.g.artifactset3[3])
                if(hasSuperAchievement('ac',104)) base = base.pow(tmp.r.buyables[104].effect2)
                return base
            },
            style() {
                if (!inChallenge('d',12)) return Qcolor()
				else if (player.points.lt(this.cost())) return Qcolor('crimson')
				else return Qcolor('green')}
        },
        103: {
            title() {
                let l = player.r.buyables[103]
                let a = 'More'
                if(l.gte(10)) a = ''
                if(l.gte(10) && l.lt(20)) a = a += 'Super'
                if(l.gte(20) && l.lt(30)) a = a += 'Hyper'
                if(l.gte(30) && l.lt(50)) a = a += 'Extremely'
                if(l.gte(50)) a = a += 'Insanely'
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> "+a+" Equality  "
               } ,
            cost(x) { 
               let level = x
               if(player.r.buyables[103].gte(10)) level = (level.div(10)).pow(3).times(10)
               if(player.r.buyables[103].gte(20)) level = level.times(d(1.2).pow(level.div(80))) 
               if(player.r.buyables[103].gte(30)) level = level.times(d(10).pow((level.div(400).log(10)).pow(2)))
               if(player.r.buyables[103].gte(50)) level = (level.div(8829727.26)).tetrate(1.05).times(8829727.26)                        
               let extralevel = player.r.improvementfactor
                let cost = level.add(extralevel)
                let basecost = d("1e5").pow(cost.pow(1.7)).times("1e10")
                basecost = basecost.pow(player.g.artifactset2[2])
                if(hasUpgrade('r',102)) basecost = basecost.pow(0.67)
                if(player.g.sacrificeactive[6].gte(1)) basecost = basecost.add(10).log(10).pow(10)
                return basecost
            },
            tooltip() {
                return this.display()
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"purple",
                }
            },
            display() { 
                return "Effect : Multiply "+Qcolor2('n','Number')+" gain by "+Qcolor2('a',format(this.per())) + " <br> Current Effect : "+Qcolor2('a',format(this.effect())+"x")+"  </br> Requirement : Reach "+Qcolor2('s',format(this.cost()))+" points in "+Qcolor2('s',"'Equality'")+" challenge. " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('e',11)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(10)
                let base = player.r.prestigetime.pow(time).pow(1.02)
                let sfcbase = base.pow(x)
                if(hasSuperAchievement('ac',104)) sfcbase = sfcbase.pow(tmp.r.buyables[104].effect2)
                sfcbase = sfcbase.pow(player.g.artifactset3[3])
                return sfcbase.max(1)           
            },
            per() {
                let time = player.r.prestigetime.add(10).log(10)
                let base = player.r.prestigetime.pow(time).pow(1.02).pow(player.g.artifactset3[3])
                if(hasSuperAchievement('ac',104)) base = base.pow(tmp.r.buyables[104].effect2)
                return base
            },
            style() {
                if (!inChallenge('e',11)) return Qcolor()
				else if (player.points.lt(this.cost())) return Qcolor('crimson')
				else return Qcolor('green')}
        },
        104: {
            title() {
                let l = player.r.buyables[104]
                let a = 'More'
                if(l.gte(10)) a = ''
                if(l.gte(10) && l.lt(20)) a = a += 'Super'
                if(l.gte(20) && l.lt(30)) a = a += 'Hyper'
                if(l.gte(30) && l.lt(50)) a = a += 'Extremely'
                if(l.gte(50)) a = a += 'Insanely'
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> "+a+" Letter  "
               } ,
            cost(x) { 
                let level = x
                if(player.r.buyables[104].gte(10)) level = (level.div(10)).pow(3).times(10)
                if(player.r.buyables[104].gte(20)) level = level.times(d(1.2).pow(level.div(80))) 
                if(player.r.buyables[104].gte(30)) level = level.times(d(10).pow((level.div(400).log(10)).pow(2)))
                if(player.r.buyables[104].gte(50)) level = (level.div(8829727.26)).tetrate(1.05).times(8829727.26)                         
                let extralevel = player.r.improvementfactor
                let cost = level.add(extralevel)
                let basecost =  d(10).pow(cost.pow(1.05)).times("1e3")
                basecost = basecost.pow(player.g.artifactset2[2])
                if(hasUpgrade('r',102)) basecost = basecost.pow(0.67)
                if(player.g.sacrificeactive[6].gte(1)) basecost = basecost.add(10).log(10).pow(10)
                return basecost
            },
            tooltip() {
                return this.display()
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"purple",
                }
            },
            display() { 
                return hasSuperAchievement('ac',104)?"Effect : Boost "+Qcolor2('n','Tickspeed')+" by "+Qcolor2('a',"x"+format(this.per())) + " and "+Qcolor2('y','other Improvements')+" by "+Qcolor2('green3','^'+format(this.per2(),4))+" <br> Current Effect : "+Qcolor2('a',format(this.effect())+"x")+" and "+Qcolor2('green3',"^"+format(this.effect2(),4))+" </br> Requirement : Reach "+Qcolor2('s',format(this.cost()))+" points in "+Qcolor2('s',"'No letter'")+" challenge. ":hasAchievement('ac',104)?"Effect : Multiply "+Qcolor2('n','Tickspeed')+" by "+Qcolor2('a',format(this.per())) + " <br> Current Effect : "+Qcolor2('a',format(this.effect())+"x")+"  </br> Requirement : Reach "+Qcolor2('s',format(this.cost()))+" points in "+Qcolor2('s',"'No letter'")+" challenge. ":"Effect : Increase "+Qcolor2('n','Tickspeed')+" factor by +"+Qcolor2('a',format(this.per())) + " <br> Current Effect : "+Qcolor2('a',format(this.effect())+"x")+"  </br> Requirement : Reached "+Qcolor2('s',format(this.cost()))+" points in "+Qcolor2('s',"'No letter'")+" challenge. " },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('e',12)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(100)
                let base = player.r.prestigetime.pow(time)
                let sfcbase = softcap(base,d(1),0.05)
                if(hasAchievement('ac',104)) sfcbase = sfcbase.pow(2).add(2).log(2)                
                let sfcbase1 = sfcbase.times(x).add(1)
                if(hasAchievement('ac',104)) sfcbase1 = sfcbase1.times(0).add(sfcbase.pow(x))
                sfcbase1 = sfcbase1.pow(player.g.artifactset3[3])
                return sfcbase1.max(1)           
            },
            per() {
                let time = player.r.prestigetime.add(10).log(100)
                let base = player.r.prestigetime.pow(time)
                let sfcbase = softcap(base,d(1),0.05) 
                if(hasAchievement('ac',104)) sfcbase = sfcbase.pow(2).add(2).log(2)                
                return sfcbase.pow(player.g.artifactset3[3])
            },
            per2() {
                let base = this.per().add(10).slog().pow(4).div(1000).add(1)
                return base
            }, 
            effect2() {
                let base = this.per2()
                base = base.pow(getBuyableAmount(this.layer,this.id))
                return base
            },
            style() {
                if (!inChallenge('e',12)) return Qcolor()
				else if (player.points.lt(this.cost())) return Qcolor('crimson')
				else return Qcolor('green')}
        },
        105: {
            title() {
                let l = player.r.buyables[105]
                let a = 'More'
                if(l.gte(10)) a = ''
                if(l.gte(10) && l.lt(20)) a = a += 'Super'
                if(l.gte(20)) a = a += 'Hyper'
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> "+a+" Operation  "
               } ,
            cost(x) { 
                 let level = x
                 if(player.r.buyables[105].gte(10)) level = (level.div(10)).pow(3).times(10)
                 if(player.r.buyables[105].gte(20)) level = level.times(d(1.2).pow(level.div(80))) 
                 let extralevel = player.r.improvementfactor
                let cost = level.add(extralevel)
                let basecost = d(10).pow(cost.pow(1.5)).times("1e3") 
                basecost = basecost.pow(player.g.artifactset2[2])
                if(hasUpgrade('r',102)) basecost = basecost.pow(0.67)
                if(player.g.sacrificeactive[6].gte(1)) basecost = basecost.add(10).log(10).pow(10)
                return basecost
            },
            tooltip() {
                return this.display()
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"purple",
                }
            },
            display() { 
                let a = (hasAchievement('ac',1013) || hasUpgrade('r',106))?" or inside "+Qcolor2('s',"'No number'")+" and "+Qcolor2('s',"'Worsen condition'")+" challenge":""
                return "Effect : Multiply "+Qcolor2('n','Operation')+" gain by "+Qcolor2('a',format(this.per())) + " <br> Current Effect : "+Qcolor2('a',format(this.effect())+"x")+"  </br> Requirement : Reach "+Qcolor2('s',format(this.cost()))+" points while "+Qcolor2('s',"'Altered'")+""+a
             },
            canAfford() { return player.points.gte(this.cost()) && (inChallenge('al',11) || ((hasUpgrade('r',51) || hasUpgrade('r',106)) && inChallenge('e',12) && inChallenge('d',12))) }, 
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(100)
                let base = player.r.prestigetime.pow(time)
                let sfcbase = softcap(base,d(1),0.05)                
                let sfcbase1 = sfcbase.pow(x)
                sfcbase1 = sfcbase1.pow(player.g.artifactset3[3])
                if(hasSuperAchievement('ac',59)) sfcbase1 = sfcbase1.pow(1.1)
                if(hasSuperAchievement('ac',104)) sfcbase1 = sfcbase1.pow(tmp.r.buyables[104].effect2)
                return sfcbase1.max(1)           
            },
            per() {
                let time = player.r.prestigetime.add(10).log(100)
                let base = player.r.prestigetime.pow(time)
                let sfcbase = softcap(base,d(1),0.05) 
                if(hasSuperAchievement('ac',59)) sfcbase = sfcbase.pow(1.1)
                if(hasSuperAchievement('ac',104)) sfcbase = sfcbase.pow(tmp.r.buyables[104].effect2)
                return sfcbase.pow(player.g.artifactset3[3])
            },
            unlocked() {return hasAchievement('ac',59) && player.r.algebraf.gte(1)},
            style() {
                if (!inChallenge('al',11) && !(inChallenge('e',12) && inChallenge('d',12) && (hasUpgrade('r',51) ||  hasUpgrade('r' ,106)))) return Qcolor()
				else if (player.points.lt(this.cost())) return Qcolor('crimson')
				else return Qcolor('green')}
        },
        110: {
            title() {
                return !this.canAfford()?"Cannot Meta-research reset":"Meta-research reset"
               } ,
            cost() { 
                d(0) },
            canAfford() { return  player.r.timer2.gte(1) && player.r.mastery.gte(10000) && !(inChallenge('al',11) && !player.g.sacrificeactive[3].gte(1) ) && !(player.r.c10.gt(0) && player.r.c10.neq(12))},
            buy() {
                if (!(shiftDown || player.r.buyables[1101].eq(0)) && !confirm("Performing a Meta-reset will reset EVERY PRIOR layer , including field study and non-permeant research (Improvement , Research milestone). Are you sure?")) return
                if(hasUpgrade('n',52) && player.g.enmetalizedbits.gt(0)) player.g.totalmetabits = player.g.totalmetabits.add(player.g.enmetalizedconvert.min(player.g.enmetalizedbits))
                if(hasUpgrade('n',52) && player.g.enmetalizedbits.gt(0)) player.g.enmetalizedbits = player.g.enmetalizedbits.sub(player.g.enmetalizedconvert.min(player.g.enmetalizedbits))
                player.r.metaresearch = player.r.metaresearch.add(player.r.nextmetaresearch)
                if(player.r.buyables[1101].eq(0)) {
                    for (let i = 0 ; i < 100 ; i++) {
                        let j = i % 4 + 1
                        let k = Math.floor(i / 4) * 10 + 10
                        let l = j + k 
                        player.n.buyables[l] = d(0)
                    }
                    player.r.buyables[1101] = d(1)
                    player.g.spentmetabits = d(0)
                    player.r.random = d("0")
                    player.r.failedattempt = player.r.failedattempt.sub(1)
                }
                let a = d(100)
                if(hasAchievement('ac',115)) a = a.sub(achievementEffect('ac',115))
                if(player.r.random.gte(a)) {
                    player.r.failedattempt = d(0)
                    player.r.metaresearch = player.r.metaresearch.add(player.r.nextmetaresearch)
                } else {
                    MRreset()
                    player.r.timer2 = d(0)
                    player.r.failedattempt = player.r.failedattempt.add(1)
                }
                player.r.random = d(Math.random() * 100)
                
                if(!hasAchievement('ac',115)) player.r.failedattempt = d(0)
            },  
            style() {
              return {
					'border-radius': '0%',
					'color':'rgb(255,255,255)',
					'background-color':'rgb(0,0,0)',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        111: {
            title() {
                return ""
               } ,
            cost() { 
                return d(0) },
            canAfford() { return player.r.mastery.gte(308.25) || player.g.sacrificeactive[3].eq(1)},
            unlocked() {return !player.r.infield},
            buy() {
                player.r.algebraf = player.r.algebraf.add(1)
                player.r.infield = true
                player.r.currentfield = "Algebra"
            },
        },
        113: {
            title() {
                return "Click here to earn a secret achievement"
               } ,
            cost() { 
                return d(0) },
            canAfford() { return true},
            buy() {
                setBuyableAmount(this.layer,this.id,d(1))
            },
        style() {
            return Qcolor()
        }
        },
        120: {
            title() {
                return "Tetration reset"
               } ,
            cost() { 
                d(0) },
            canAfford() { return player.e.effective.gte(player.r.tetrationcost) && player.r.timer.gte(0.25)},
            unlocked() {
                return true
            },
            buy() {
                if(player.r.tetration.gte(15)) {
                    player.r.tetration = player.r.tetration.add(1)
                    player.r.timer = d(0)
                } else {
                if (!confirm("Increasing your Tetration will allow you to gain powerful reward but force a Meta-reset . Are you sure?")) return 
                player.r.tetration = player.r.tetration.add(1)
                MRreset()
                player.r.timer = d(0)
            }},  
            style() {
				if (player.e.effective.lt(player.r.tetrationcost) || player.r.timer.lte(0.25)) return Qcolor()
				else return Qcolor('red')}
        },
        121: {
            title() {
                return "Upgrade Condenser"
               } ,
            cost(x) { 
                if (player[this.layer].buyables[this.id].gte(this.purchaseLimit())) return d(0)
                return d(1) },
            display() { 
            return "All Pre Research upgrade with similar buff is condensed to 1 upgrade . Any other upgrade with important purpose will not be condensed . Require : 1 Challenge shard" },
            canAfford() { return player.r.challengeshard.gte(this.cost())},
            buy() {
                if (!confirm("Condensing upgrade will alter the game and force all existing upgrade to be removed . You will need to condense anyway .")) return
                layerDataReset('n')
                layerDataReset('a')
                layerDataReset('s')
                layerDataReset('m')
                layerDataReset('e')
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                
            },
            purchaseLimit() {return d(1)},
            style() {
                 if (player.r.challengeshard.lt(this.cost())) return Qcolor()
				else return Qcolor('green')}
        },
        201: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Light Additive Generator  "
               } ,
            cost(x) {
                let base = d(2)
                base = base.root(player.g.artifactset2[4]) 
                return x.pow(base).times(100) 
            
            },
            tooltip() {
                return "Generate "+Qcolor2('green2',format(this.effect()))+" => "+Qcolor2('green2',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" "+Qcolor2('la','Light additive')+" . Requirement : "+Qcolor2('green1',format(this.cost())+" addtive")+""
            },
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },
            display() { 
                return "Requirement : "+Qcolor2('green1',format(this.cost())+" addtive")+"" },
            canAfford() { return player.a.points.gte(this.cost())},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let a = d(3).times(buyableEffect('r',601))
                a = a.pow(player.g.artifactset3[4])
                let base = x.pow(a).div(1000)
                return base      
            },
            style() {
                if (player.a.points.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
            
        },
        202: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Light Additive Multiplier  "
               } ,
            cost(x) { 
                let base = d(1.25).pow(x.pow(1.5)).times(5) 
                if(x.gte(50)) base = base.pow(x.sub(40).div(10))
                if(hasAchievement('ac',133)) base = base.pow(achievementEffect('ac',133))
                return base
            },
            tooltip() {
                return "Generate "+Qcolor2('green3',"x"+format(this.effect()))+" => "+Qcolor2('green3',"x"+format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" more "+Qcolor2('la','Light additive')+" . Cost : "+Qcolor2('green5',format(this.cost()))+" "+Qcolor2('la','Light additive')+" " 
            },
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },
            display() { 
                return "Cost : "+Qcolor2('green5',format(this.cost()))+" "+Qcolor2('la','Light additive')+" " },
            canAfford() { return player.r.lightadd.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',105)) {
                    player.r.lightadd = player.r.lightadd.sub(this.cost())
                }
                
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = d(1.25).pow(x).pow(buyableEffect('r',601))
                return base      
            },
            style() {
                if (player.r.lightadd.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        203: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Light Additive Powerer  "
               } ,
            cost(x) { 
                return d(2).pow(x.pow(1.4)).times(10) },
            tooltip() {
                return "Generate "+Qcolor2('green5',"x"+format(this.effect2()))+" => "+Qcolor2('green5',"x"+format(this.effect1()))+" more "+Qcolor2('la','Light additive')+" (based on total upgrade level) . Cost : "+Qcolor2('green5',format(this.cost()))+" "+Qcolor2('la','Light additive')+" " 
            },
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"lime",
                }
            },
            display() { 
                return "Cost : "+Qcolor2('green5',format(this.cost()))+" "+Qcolor2('la','Light additive')+" " },
            canAfford() { return player.r.lightadd.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',105)) {
                    player.r.lightadd = player.r.lightadd.sub(this.cost())
                }           
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.add(1).pow(0.25).pow(buyableEffect('r',601))
                return base      
            },
            effect2() {
                return buyableEffect('r',201).times(buyableEffect('r',202)).add(1).pow(this.effect().sub(1))
            },
            effect1() {
                return buyableEffect('r',201).times(buyableEffect('r',202)).add(1).pow(this.effect(getBuyableAmount(this.layer,this.id).add(1)).sub(1))
            },
            style() {
                if (player.r.lightadd.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        301: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Dark Subtractive Generator  "
               } ,
            cost(x) { 
                let base = d(2)
                base = base.root(player.g.artifactset2[5]) 
                return x.pow(base).times(100) },
            tooltip() {
                return "Generate "+Qcolor2('red1',format(this.effect()))+" => "+Qcolor2('red1',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" "+Qcolor2('ds','Dark subtractive')+" . Requirement : "+Qcolor2('blue2',format(this.cost()))+" "+Qcolor2('s','Subtractive')+" " 
            },
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"red",
                }
            },
            display() { 
                return "Requirement : "+Qcolor2('blue2',format(this.cost()))+" "+Qcolor2('s','Subtractive')+" " },
            canAfford() { return player.s.points.gte(this.cost())},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let a = d(3).times(buyableEffect('r',601))
                a = a.pow(player.g.artifactset3[4])
                let base = x.pow(a).div(1000)
                return base      
            },
            style() {
                if (player.s.points.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        302: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Dark Subtractive Multiplier  "
               } ,
            cost(x) { 
                return d(1.25).pow(x.pow(1.6)).times(5) },
            tooltip() { 
                return "Generate "+Qcolor2('red2','x'+format(this.effect()))+" => "+Qcolor2('red2',"x"+format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" more "+Qcolor2('ds','Dark subtractive')+" . Cost : "+Qcolor2('blue2',format(this.cost()))+" "+Qcolor2('ds','Dark subtractive')+"  " 
            },
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"red",
                }
            },
            display() { 
                return "Cost : "+Qcolor2('blue2',format(this.cost()))+" "+Qcolor2('ds','Dark subtractive')+"  " 
            },
            canAfford() { return player.r.darksub.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',105)) {
                    player.r.darksub = player.r.darksub.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = d(1.25).pow(x).pow(buyableEffect('r',601))
                return base      
            },
            style() {
                if (player.r.darksub.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        303: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Dark Subtractive Powerer"
               } ,
            cost(x) { 
                let base = d(2).pow(x.pow(1.3)).times(10) 
                if(x.gte(50)) base = base.pow(x.sub(40).div(10))
                if(hasAchievement('ac',134)) base = base.pow(achievementEffect('ac',134))
                return base
            },
            tooltip() { 
                return "Generate "+Qcolor2('red3',"x"+format(this.effect2()))+" => "+Qcolor2('red3',"x"+format(this.effect1()))+" times more "+Qcolor2('ds','Dark subtractive')+" (based on total upgrade level) . Cost : "+Qcolor2('blue2',format(this.cost()))+" "+Qcolor2('ds','Dark subtractive')+"" 
            },
            ttStyle() {
                return {
                    "color":"red",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"red",
                }
            },
            display() { 
                return "Cost : "+Qcolor2('blue2',format(this.cost()))+" "+Qcolor2('ds','Dark subtractive')+"" 
            },
            canAfford() { return player.r.darksub.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',105)) {
                    player.r.darksub = player.r.darksub.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.add(1).pow(0.25).pow(buyableEffect('r',601))
                return base      
            },
            effect2() {
                return buyableEffect('r',301).times(buyableEffect('r',302)).add(1).pow(this.effect().sub(1))
            },
            effect1() {
                return buyableEffect('r',301).times(buyableEffect('r',302)).add(1).pow(this.effect(getBuyableAmount(this.layer,this.id).add(1)).sub(1))
            },
            style() {
                if (player.r.darksub.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        401: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Twilight Booster  "
               } ,
            cost(x) { 
                let base = d(2)
                if(x.gte(100)) base = base.times(x.div(100))
                return d(base).pow(x) 
            },
            tooltip() { 
                return ""+Qcolor2('pink1','x'+format(this.effect()))+" => "+Qcolor2('pink1',"x"+format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" "+Qcolor2('la','Light additive')+" & "+Qcolor2('ds','Dark subtractive')+" gain . Cost : "+Qcolor2('pink3',format(this.cost()))+" "+Qcolor2('pink4','Twilight')+" " 
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },
            display() { 
                return "Cost : "+Qcolor2('pink3',format(this.cost()))+" "+Qcolor2('pink4','Twilight')+" " 
            },
            canAfford() { return player.r.twilight.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',105)) {
                    player.r.twilight = player.r.twilight.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let c = d(1.25)
                if(hasAchievement('ac',135)) c = c.add(0.05)
                let base = d(c).pow(x).pow(buyableEffect('r',601))
                return base      
            },
            style() {
                if (player.r.twilight.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        402: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Twilight Strength  "
               } ,
            cost(x) { 
                let level = x
                if(level.gte(100)) level = level.div(100).pow(3).times(100)
                return  d(2).pow(level.pow(1.1)).times(4) 
            },
            tooltip() { 
                return "Increase the "+Qcolor2('pink2','strength')+" of "+Qcolor2('la','Light additive')+" & "+Qcolor2('ds','Dark subtractive')+" bonus by "+Qcolor2('pink3',''+format(this.base()))+"%  => "+Qcolor2('pink3',format(this.base1()))+"%. Cost : "+Qcolor2('pink3',format(this.cost()))+" "+Qcolor2('pink4','Twilight')+""
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },
            display() { 
                return "Cost : "+Qcolor2('pink3',format(this.cost()))+" "+Qcolor2('pink4','Twilight')+""
            },
            canAfford() { return player.r.twilight.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',105)) {
                    player.r.twilight = player.r.twilight.sub(this.cost())
                }                
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.times(2).pow(buyableEffect('r',601))
                let base1 = softcap(base,d(20),0.5)
                if(hasAchievement('ac',107)) base1 = (base1.add(100)).times(1.2).sub(100)
                base1 = base1.add((player.g.artifactset3[7]-1)*40/39)
                if(player.g.sacrificeactive[4].gte(1)) base1 = base1.add(250)
                if (inChallenge('al',11)) base1 = base1.times(0).sub(100)
                if (inChallenge('r',11) && player.g.sacrificeactive[6].eq(0)) base1 = base1.times(0).sub(100)
                return base1
            },
            base() {
                let base = player.r.buyables[402].times(2).pow(buyableEffect('r',601))
                let base1 = softcap(base,d(20),0.5)
                return base1
            }, 
            base1() {
                let base = player.r.buyables[402].add(1).times(2).pow(buyableEffect('r',601))
                let base1 = softcap(base,d(20),0.5)
                return base1
            }, 
            style() {
                if (player.r.twilight.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        403: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "/25 <br/> Twilight Improver"
               } ,
            cost(x) { 
                if (player[this.layer].buyables[this.id].gte(this.purchaseLimit())) return d(0)
                return d(3).pow(x).times(x) },
            tooltip() { 
                return ""+Qcolor2('n',"x"+format(this.effect(),3))+" "+Qcolor2('e','Effective Exponent')+" . Cost : "+Qcolor2('pink3',format(this.cost()))+" "+Qcolor2('pink4','Twilight')+" " 
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                }
            },
            display() { 
                return "Cost : "+Qcolor2('pink3',format(this.cost()))+" "+Qcolor2('pink4','Twilight')+" " 
            },
            canAfford() { return player.r.twilight.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',105)) {
                    player.r.twilight = player.r.twilight.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.div(100).add(1).pow(buyableEffect('r',601))
                return base      
            },
            style() {
                if (player.r.twilight.lt(this.cost())) return Qcolor()
                if (getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return Qcolor('rgb(0,128,0)')
				else return Qcolor('gray')},
            purchaseLimit() {return d(25)}
        },
        501: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Energy Booster  "
               } ,
            cost(x) {
                let lvl = x
                let level = x
                if(lvl.gte(25)) level = (level.div(25)).pow(1.25).times(25)
                if(lvl.gte(100)) level = level.times(lvl.div(100))

                let base = (d(2).pow(level.pow(1.1))).sub(1) 
                base = base.pow(player.g.artifactset2[3])
                return base

            },
            unlocked() {return hasAchievement('ac',96)},
            tooltip() { 
                let bulk = d(1)
                if(hasAchievement('ac',153)) bulk = bulk.add(getBuyableAmount(this.layer,this.id).div(20).floor())
                return "Generate "+Qcolor2('purple1',""+format(this.effect()))+" => "+Qcolor2('purple1',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(bulk))))+" "+Qcolor2('blue2','Energy')+" . Cost : "+Qcolor2('blue1',format(this.cost()))+" "+Qcolor2('blue2','Energy')+"" 
            },
            ttStyle() {
                return {
                    "color":"cyan",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"cyan",
                }
            },
            display() { 
                return "Cost : "+Qcolor2('blue1',format(this.cost()))+" "+Qcolor2('blue2','Energy')+"" 
            },
            canAfford() { return player.r.energy.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',105)) {
                    player.r.energy = player.r.energy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if(hasAchievement('ac',153)) {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).times(1.05).floor())
                }
            },
            effect(x) {
                let b = d(1.25)
                if(hasAchievement('ac',136)) b = b.add(0.03)
                let base = d(2).pow(x.pow(b)).pow(buyableEffect('r',601)).sub(1)
                return base      
            },
            style() {
                if (player.r.energy.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        502: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Energy Conductor"
               } ,
            cost(x) {
                let lvl = x
                let level = x
                if(lvl.gte(25)) level = (level.div(25)).pow(1.5).times(25)
                let base = (d(10).pow(level.pow(1.25))).sub(1) 
                return base

            },
            unlocked() {return hasAchievement('ac',96) && player.g.rank.gte(2)},
            tooltip() { 
                let bulk = d(1)
                if(hasAchievement('ac',153)) bulk = bulk.add(getBuyableAmount(this.layer,this.id).div(20).floor())
                return ""+Qcolor2('purple1',"x"+format(this.effect()))+" => "+Qcolor2('purple1',"x"+format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(bulk))))+" "+Qcolor2('blue2','Energy')+" gain ("+Qcolor2('la','based on')+" "+Qcolor2('blue2','Energy')+") . Cost : "+Qcolor2('blue1',format(this.cost()))+" "+Qcolor2('blue2','Energy')+" " 
            },
            ttStyle() {
                return {
                    "color":"cyan",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"cyan",
                }
            },
            display() { 
                return "Cost : "+Qcolor2('blue1',format(this.cost()))+" "+Qcolor2('blue2','Energy')+" " 
            },
            canAfford() { return player.r.energy.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',105)) {
                    player.r.energy = player.r.energy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if(hasAchievement('ac',153)) {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).times(1.05).floor())
                }
            },
            effect(x) {
                let base = player.r.energy.add(10).log(10).pow(x).pow(buyableEffect('r',601))
                return base      
            },
            style() {
                if (player.r.energy.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        503: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Energy Enhancer"
               } ,
            cost(x) {
                let lvl = x
                let level = x
                if(lvl.gte(10)) level = (level.div(10)).pow(5).times(10)
                let base = (d(100).pow(level.pow(1.67))).times("1e10") 
                return base

            },
            unlocked() {return player.r.tetration.gte(21) || getBuyableAmount(this.layer,this.id).gt(0) },
            tooltip() { 
                return ""+Qcolor2('purple1','^'+format(this.effect()))+" => "+Qcolor2('purple1','^'+format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" "+Qcolor2('blue2','Energy')+" gain . Cost : "+Qcolor2('blue1',format(this.cost()))+" "+Qcolor2('blue2','Energy')+" " 
            },
            ttStyle() {
                return {
                    "color":"cyan",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"cyan",
                }
            },
            display() { 
                return "Cost : "+Qcolor2('blue1',format(this.cost()))+" "+Qcolor2('blue2','Energy')+" " }
                ,
            canAfford() { return player.r.energy.gte(this.cost())},
            buy() {
                if(!hasAchievement('ac',105)) {
                    player.r.energy = player.r.energy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = d(1.05).pow(x).pow(buyableEffect('r',601))
                return base      
            },
            style() {
                if (player.r.energy.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        601: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Twilight crystal"
               } ,
            cost(x) {
                return d("1e100").pow(x.add(1).tetrate(x.div(100).add(1.2))).div(buyableEffect('r',602))
            },
            unlocked() {return player.r.tetration.gte(22) || getBuyableAmount(this.layer,this.id).gt(0)},
            tooltip() { 
                return ""+Qcolor2('a','Increase')+" the "+Qcolor2('a','strength')+" of "+Qcolor2('n','all prior twilight resources')+" buyable by "+Qcolor2('y',format(this.effect().times(100).sub(100),0)+"%")+" . Requirement : "+Qcolor2('blue1',format(this.cost()))+" "+Qcolor2('blue2','Energy')+"" 
            },
            ttStyle() {
                return {
                    "color":"brown",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"brown",
                }
            },
            display() { 
                return "Requirement : "+Qcolor2('blue1',format(this.cost()))+" "+Qcolor2('blue2','Energy')+"" 
            },
            canAfford() { return player.r.energy.gte(this.cost())},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = d(0.01).times(x).add(1)
                return base      
            },
            style() {
                if (player.r.energy.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },
        602: {
            title() {
                return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Twilight star"
               } ,
            cost(x) {
                return d("1e10").pow(x.add(1).tetrate(x.div(100).add(1.3)))
            },
            unlocked() {return player.r.tetration.gte(24) || getBuyableAmount(this.layer,this.id).gt(0)},
            tooltip() { 
                return ""+Qcolor2('a','Reduce')+" the "+Qcolor2('a','cost')+" of <i>"+Qcolor2('n','Twilight crystal')+"</i> by "+Qcolor2('blue2','currentEnergy')+"^"+Qcolor2('y',format(d(1.2).pow(getBuyableAmount(this.layer,this.id).sub(1))))+" = "+Qcolor2('y',"/"+format(this.effect()))+" . Requirement : "+Qcolor2('blue1',format(this.cost()))+" "+Qcolor2('blue2','Energy')+"" 
            },
            ttStyle() {
                return {
                    "color":"brown",
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"brown",
                }
            },
            display() { 
                return "Requirement : "+Qcolor2('blue1',format(this.cost()))+" "+Qcolor2('blue2','Energy')+"" 
            },
            canAfford() { return player.r.energy.gte(this.cost())},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = player.r.energy.add(1).pow(d(1.2).pow(x).sub(1))
                return base      
            },
            style() {
                if (player.r.energy.lt(this.cost())) return Qcolor()
				else return Qcolor('gray')}
        },

        1001: {
            title() {
                return "+0.2 factor"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return player.r.gamespeed.eq(1)},
            buy() {
               player.r.gsbase = player.r.gsbase.add(0.2)

            },
            style() {
                if (player.r.gamespeed.gt(1)) {
                    return Qcolor()
                }
				 else return Qcolor('green')}
        },
        1002: {
            title() {
                return "-0.2 factor"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() { return player.r.gamespeed.eq(1) && player.r.gsbase.gt(1)},
            buy() {
                player.r.gsbase = player.r.gsbase.sub(0.2)
            },
            style() {
                if (player.r.gamespeed.gt(1) || player.r.gsbase.eq(1)) {
                    return Qcolor()
                }
                else return Qcolor('red')}
        },
        1003: {
            title() {
                return "Activate (Current : "+format(player.r.gamespeed,0)+"x)"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return !player.o.overheat && player.r.gsbase.gte(1) && player.r.gamespeed.eq(1) && !player.r.gsbase.eq(1) && player.r.gsupkeep.gte(10)},
            buy() {
               player.r.gamespeed = player.r.gsbase

            },
            style() {
                if (!this.canAfford()) {
                    return Qcolor()
                }
                else return Qcolor('green')}
        },
        1004: {
            title() {
                return "Deactivate"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() { return player.r.gsbase.gte(1) && !player.r.gamespeed.eq(1)},
            buy() {
                player.r.gamespeed = d(1)
            },
            style() {
                if (player.r.gamespeed.eq(1)) {
                    return Qcolor()
                }
                else return Qcolor('red')}
        
        },
        1010: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return player.r.c1.gte(1)},
            buy() {
               player.r.c1 = player.r.c1.sub(1)

            },
            style() {
                if (player.r.c1.lt(1)) {
                    return Qcolor()
                }
				 else return Qcolor('red')}
        },
        1011: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() { return player.r.c1.gte(0) && player.r.c1.lt(8)},
            buy() {
                player.r.c1 = player.r.c1.add(1)
            },
            style() {
                if (player.r.c1.eq(8)) {
                    return Qcolor()
                }
                else return Qcolor('green')}
        },
        1020: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return player.r.c2.gte(1)},
            buy() {
               player.r.c2 = player.r.c2.sub(1)

            },
            style() {
                if (player.r.c2.lt(1)) {
                    return Qcolor()
                }
				 else return Qcolor('red')}},
        1021: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() { return player.r.c2.gte(0) && player.r.c2.lt(8)},
            buy() {
                player.r.c2 = player.r.c2.add(1)
            },
            style() {
                if (player.r.c2.eq(8)) {
                    return Qcolor()
                }
                else return Qcolor('green')}
        },
        1030: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return player.r.c3.gte(1)},
            buy() {
               player.r.c3 = player.r.c3.sub(1)

            },
            style() {
                if (player.r.c3.lt(1)) {
                    return Qcolor()
                }
				 else return Qcolor('red')}
        },
        1031: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() { return player.r.c3.gte(0) && player.r.c3.lt(8)},
            buy() {
                player.r.c3 = player.r.c3.add(1)
            },
            style() {
                if (player.r.c3.eq(8)) {
                    return Qcolor()
                }
                else return  Qcolor('green')}
               
        },
       1040: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return player.r.c4.gte(1)},
            buy() {
               player.r.c4 = player.r.c4.sub(1)

            },
            style() {
                if (player.r.c4.lt(1)) {
                    return Qcolor()
                }
				 else return Qcolor('red')}
        },
        1041: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() { return player.r.c4.gte(0) && player.r.c4.lt(8)},
            buy() {
                player.r.c4 = player.r.c4.add(1)
            },
            style() {
                if (player.r.c4.eq(8)) {
                    return Qcolor()
                }
                else return Qcolor('green')}
        },
        1050: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return player.r.c5.gte(1)},
            buy() {
               player.r.c5 = player.r.c5.sub(1)

            },
            style() {
                if (player.r.c5.lt(1)) {
                    return Qcolor()
                }
				 else return Qcolor('red')}
        },
        1051: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() { return player.r.c5.gte(0) && player.r.c5.lt(8)},
            buy() {
                player.r.c5 = player.r.c5.add(1)
            },
            style() {
                if (player.r.c5.eq(8)) {
                    return Qcolor()
                }
                else return Qcolor('green')}
        },
        1060: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return player.r.c6.gte(1)},
            buy() {
               player.r.c6 = player.r.c6.sub(1)

            },
            style() {
                if (player.r.c6.lt(1)) {
                    return Qcolor()
                }
				 else return Qcolor('red')}
        },
        1061: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() { return player.r.c6.gte(0) && player.r.c6.lt(8)},
            buy() {
                player.r.c6 = player.r.c6.add(1)
            },
            style() {
                if (player.r.c6.eq(8)) {
                    return Qcolor()
                }
                else return Qcolor('green')}
        },
        1070: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return player.r.c7.gte(1)},
            buy() {
               player.r.c7 = player.r.c7.sub(1)

            },
            style() {
                if (player.r.c7.lt(1)) {
                    return Qcolor()
                }
				 else return Qcolor('red')}
        },
        1071: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() { return player.r.c7.gte(0) && player.r.c7.lt(8)},
            buy() {
                player.r.c7 = player.r.c7.add(1)
            },
            style() {
                if (player.r.c7.eq(8)) {
                    return Qcolor()
                }
                else return Qcolor('green')}
        },
        1080: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return player.r.c8.gte(1)},
            buy() {
               player.r.c8 = player.r.c8.sub(1)

            },
            style() {
                if (player.r.c8.lt(1)) {
                    return Qcolor()
                }
				 else return Qcolor('red')}
        },
        1081: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return d(0) },
            canAfford() { return player.r.c8.gte(0) && player.r.c8.lt(8)},
            buy() {
                player.r.c8 = player.r.c8.add(1)
            },
            style() {
                if (player.r.c8.eq(8)) {
                    return Qcolor()
                }
                else return Qcolor('green')}
        },
        
        1101: {
            title() {
                return "Respec all Metabit spent"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return true},
            tooltip() {return "Respec spent Metabit also disable Tetration VI achievement"},
            unlocked() {return hasUpgrade('n',52)},
            buy() {
               player.r.buyables[this.id] = player.r.buyables[this.id].sub(1).times(-1)

            },
            style() {
                if (player.r.buyables[this.id].eq(0)) {
                    return Qcolor('green',40)
                }
				 else return Qcolor('red',40)}
        },
        1102: {
            title() {
                return "Enmetalize Bits <br> Cost : "+format(this.cost(),0)+" Bits"
               } ,
            cost(x) { 
                let a =  d(10).pow(x)
                if(hasUpgrade('n',63)) a = a.pow(0.5)
                return a
            },
            canAfford() { return player.g.enmetalizedbits.lt(player.g.storagedbitscap) && player.g.bits.gte(this.cost()) && player.r.timer.gte(0.25)},
            unlocked() {return hasUpgrade('n',52)},
            buy() {
                let base = d(1)
                player.g.bits = player.g.bits.sub(this.cost())
                player.g.enmetalizedbits = player.g.enmetalizedbits.add(base)
                player.r.buyables[this.id] = player.r.buyables[this.id].add(1)
                player.r.timer = d(0)

            },
            style() {
                if (this.canAfford()) {
                    return Qcolor('green',120)
                }
				 else return Qcolor('red',120)}
        },
        1103: {
            title() {
                return "Enmetalize Bits <br> Require :  "+format(this.cost2(),0)+" Number"
               } ,
            cost2(x) {
                return softcap2(player.r.buyables[this.id].add(11).times(2).pow(3).tetrate(1.7),d("1e10000"),d(0.8))
            },
            canAfford() { return player.g.enmetalizedbits.lt(player.g.storagedbitscap) && player.n.points.gte(this.cost2()) && player.r.timer.gte(0.25)},
            unlocked() {return hasUpgrade('n',62)},
            buy() {
                let base = d(1)
                player.g.enmetalizedbits = player.g.enmetalizedbits.add(base)
                player.r.buyables[this.id] = player.r.buyables[this.id].add(1)
                player.r.timer = d(0)

            },
            style() {
                if (this.canAfford()) {
                    return Qcolor('green',120)
                }
				 else return Qcolor('red',120)}
        },
        1104: {
            title() {
                return "Enmetalize Bits <br> Require : "+format(this.cost2(),0)+" Mastery"
               } ,
            cost2(x) {
                return player.r.buyables[this.id].times(5000).add(200000)
            },
            canAfford() { return player.g.enmetalizedbits.lt(player.g.storagedbitscap) && player.r.mastery.gte(this.cost2()) && player.r.timer.gte(0.25)},
            unlocked() {return hasUpgrade('n',73)},
            buy() {
                let base = d(1)
                player.g.enmetalizedbits = player.g.enmetalizedbits.add(base)
                player.r.buyables[this.id] = player.r.buyables[this.id].add(1)
                player.r.timer = d(0)

            },
            style() {
                if (this.canAfford()) {
                    return Qcolor('green',120)
                }
				 else return Qcolor('red',120)}
        },
      
       
    },
    clickables: {
        11: {
            title() { return ""+formatWhole(player.r.points,0)+" Research <br> ----- <br> "+formatWhole(player.e.points,0)+"/"+formatWhole(getNextAt('r').ceil(),0)+" Exponent" },
            canClick() { return canReset(this.layer) },
            unlocked() { return player.r.bestmastery.gte(10000) },
            onClick() {
                buyBuyable('r',10)
            },
            style() {   
            return Qcolor('purple',50)
        },
        },
        12: {
            title() {
                let error = ""
                if(player.r.mastery.lt(10000)) error = "Mastery"
                if(player.r.c10.gt(0) && player.r.c10.neq(12)) error = "Challenge sacrifice"
                if(inChallenge('al',11) && !player.g.sacrificeactive[3].gte(1) ) error = "Altered realm"
                 return !tmp.r.buyables[110].canAfford?""+format(player.r.metaresearch)+" MR <br> ----- <br> Cannot reset <br> Because of "+error:""+format(player.r.metaresearch)+" MR <br> ----- <br> +"+format(player.r.nextmetaresearch)+" MR" 
                },
            canClick() { return tmp.r.buyables[110].canAfford},
            unlocked() { return player.r.bestmastery.gte(10000) },
            onClick() {
                buyBuyable('r',110)
            },
            style() {   
            return Qcolor('aqua',50)
        },
        },
        13: {
            title() { 
                let def = player.r.tetrationcost.gte("1e100")?"":" / "+format(player.r.tetrationcost.max(0),1)+""
                return ""+formatWhole(player.r.tetration,0)+" Tetration <br> ----- <br> "+format(player.e.effective,1)+""+def+" E.Exponent" 
        },
            canClick() { return tmp.r.buyables[120].canAfford },
            unlocked() { return hasAchievement('ac',69)},
            onClick() {
                buyBuyable('r',120)
            },
            style() {   
            return Qcolor('green',50)
        },
        },
    },
    
    challenges: {
        11: {
            name: "Meta Research challenge",
            canComplete: function() {
                return player.r.mastery.gte(player.r.MRCreq)},

            goalDescription() {return "Reach "+format(player.r.MRCreq)+" Mastery"},
            rewardDescription() {return "Increase your Challenge shard to be equal to total Modifier level"},
            unlocked() {return true},
            onEnter() {
                player.r.timer2 = d(0)
                player.r.savedtetration = player.r.tetration
                player.r.savedresearch = player.r.points
                let keep = []
                if (hasUpgrade('n',41)) keep.push("buyables")
                if (hasUpgrade('n',41)) keep.push("upgrades")
                layerDataReset('e')
                layerDataReset('d')
                layerDataReset('m')
                layerDataReset('s')
                layerDataReset('a')
                layerDataReset('n',keep)
                player.r.points = d(0)
                MRreset()
                
                player.r.tetration = d(0)
                player.al.bankedprestigetime = player.r.prestigetime
                player.r.prestigetime = d(0)
                player.points = getStartPoints()
                player.al.bank1 = player.r.buyables[101]
                player.al.bank2 = player.r.buyables[102]
                player.al.bank3 = player.r.buyables[103]
                player.al.bank4 = player.r.buyables[104]
                player.r.buyables[101] = d(0)
                player.r.buyables[102] = d(0)
                player.r.buyables[103] = d(0)
                player.r.buyables[104] = d(0)
                player.r.buyables[105] = d(0)
                    for (let i = 0; i < player.r.milestones.length; i++) {
                        player.r.milestones.splice(i, 1);
                        i--;   
                    }
                player.r.timer2 = d(0)
                player.points = getStartPoints()
                player.n.points = d(0)
            },
            onExit() {
                if(player.r.mastery.gte(10000) && player.r.timer2.gte(1)) {
                    player.r.challengeshard = player.r.challengeshard.max(player.r.potshard)
                }
                player.r.tetration = player.r.tetration.max(player.r.savedtetration)
                player.r.points = player.r.points.max(player.r.savedresearch)
                player.r.savedresearch = d(0)
                player.r.savedtetration = d(0)
                player.r.prestigetime = player.r.prestigetime.max(player.al.bankedprestigetime)
                player.al.bankedprestigetime = d(0)
                if(hasAchievement('ac',79)) {
                    player.r.buyables[101] = player.al.bank1
                    player.r.buyables[102] = player.al.bank2
                    player.r.buyables[103] = player.al.bank3
                    player.r.buyables[104] = player.al.bank4 
                }
                    player.al.bank1 = d(0)
                    player.al.bank2 = d(0)
                    player.al.bank3 = d(0)
                    player.al.bank4 = d(0)
                
            },
            style() {
                if(player.r.mastery.gte(10000) && inChallenge('r',11) && player.r.timer2.gte(1)) return Qcolor('rgb(128,128,32)',250)
                else return Qcolor('black',250)
            }

        },
    },

microtabs: {
    stuff: {
        "Research": {
            buttonStyle() { return { 'color': '#8a00a9' } },
            unlocked() { return !inChallenge('c',11) },
            content:

                [
        ["microtabs", "research", { 'border-width': '0px' }],
    ]

        },
        "Mastery breakdown": {
            buttonStyle() {return {'color':'#8a00a9'}},
            unlocked() {return !options.hidemastery},
            content :     [
                ["blank", "25px"],
                ["raw-html", function () { return "<h3>Basic resource " }, { "color": "white", "font-size": "24px"}],
                ["raw-html", function () { return "<h3>Current number: " + format(player.n.points) + " -> +" + format(player.r.basemastery) + " mastery"}, { "color": "white", "font-size": "18px"}],
                ["raw-html", function () { return "<h3>Current additive " + format(player.a.points) + " -> " + format(player.r.additivemastery) + "x mastery"}, { "color": "#32FF00", "font-size": "18px"}],
                ["raw-html", function () { return "<h3>Current subtractive " + format(player.s.points) + " -> " + format(player.r.subtractivemastery) + "x mastery"}, { "color": "#FF0000", "font-size": "18px"}],
                ["raw-html", function () { return "<h3>Current multiplicative " + format(player.m.points) + " -> " + format(player.r.multiplicativemastery) + "x mastery"}, { "color": "#29AC7F", "font-size": "18px"}],
                ["raw-html", function () { return "<h3>Current divisive " + format(player.d.points) + " -> " + format(player.r.divisivemastery) + "x mastery"}, { "color": "#822B2B", "font-size": "18px"}],
                ["raw-html", function () { return "<h3>Current exponent: " + format(player.e.effective) + "  -> " + format(player.r.exponentmastery) + "x mastery"}, { "color": "#8420EC", "font-size": "18px"}],
                ["raw-html", function () { return "<h3>Current research: " + format(player.r.points,0) + "  -> " + format(player.r.researchmastery) + "x mastery"}, { "color": "#5020EC", "font-size": "18px"}],
                ["raw-html", function () { return player.r.tetration.gte(1)?"<h3>Current tetration: " + format(player.r.tetration,0) + "  -> " + format(player.r.tetrationmastery) + "x mastery":""}, { "color": "white", "font-size": "18px"}],
                ["blank","25px"],
                ["raw-html", function () { return player.r.algebraf.gte(1)?"<h3>Algebra field":"" }, { "color": "lime", "font-size": "24px"}],
                ["raw-html", function () { return player.r.algebraf.gte(1)?"<h3>Current function value : " + format(player.al.value) + " -> " + format(player.r.functionmastery) + "x mastery":""}, { "color": "green", "font-size": "18px"}],
                ["raw-html", function () { return player.r.algebraf.gte(1)?"<h3>Current extension : " + format(player.al.extension) + " -> " + format(player.r.extensionmastery) + "x mastery":""}, { "color": "orange", "font-size": "18px"}],
                ["raw-html", function () { return player.r.algebraf.gte(1)?"<h3>Current operation : " + format(player.al.operation) + " -> " + format(player.r.operationmastery) + "x mastery":""}, { "color": "lime", "font-size": "18px"}],
                ["blank","25px"],
                ["raw-html", function () { return "<h3>Other source"}, { "color": "white", "font-size": "24px"}],
                ["raw-html", function () { return player.r.best.gte(3)?"<h3>Research milestone 3 : "+format(player.r.researchmilestone3mastery)+"x mastery ":""}, { "color": function(){return player.r.infield?"lime":"red"}, "font-size": "18px"}],
                ["raw-html", function () { return inChallenge('r',11)?"<h3>MR challenge : /"+format(player.r.metaresearchmastery)+" mastery ":""}, { "color": function(){return "red"}, "font-size": "18px"}],
                ["raw-html", function () { return player.r.ptsacrificemastery.gt(1)?"<h3>Active sacrifice : "+format(player.r.ptsacrificemastery)+"x mastery ":""}, { "color": function(){return "purple"}, "font-size": "18px"}],

                ["blank","25px"],
                ["raw-html", function () { return "<h3>Total mastery: " + format(player.r.mastery) + ""}, { "color": "white", "font-size": "18px"}],
                ["raw-html", function () { return "<h3>Best ever mastery: " + format(player.r.bestmastery) + ""}, { "color": "white", "font-size": "18px"}],

        ]},
        "Meta research": {
            buttonStyle() { return { 'color': '#ff0000' , "border-color" : "orange" } },
            unlocked() { return player.r.bestmastery.gte("10000")},
            content:
                [
        ["microtabs", "metaresearch", { 'border-width': '0px' }],
    ]

        },
        "Challenge" : {
            buttonStyle() { return { 'color': 'red' , "border-color" : "red" } },
            unlocked() { return (player.r.tetration.gte(8) || inChallenge('r',11) || player.g.rank.gte(2)) && !inChallenge('c',11) },
            content: [
                


        ["microtabs", "challenge", { 'border-width': '0px' }],
     
            ]
        },
        "Permeant research": {
            buttonStyle() { return { 'color': '#ffffff' , "border-color" : "white" } },
            unlocked() { return hasAchievement('ac',54)},
            content:

                [
        ["microtabs", "other", { 'border-width': '0px' }],
    ]

        },
    },
    modifier : {
        "Points shredder" : {
            content : [
                ["raw-html", function () { return "<h2> Points shredder : Points gain is ^"+format(player.r.cha)+"" }, { "color": "red", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c1,0)+"/8" }, { "color": "white", "font-size": "14px"}],
                ["blank" , "25px"],
                ["row", [["buyable", 1010], ["buyable", 1011]]],


            ]
        }, 
        "Resource reduction" : {
            content : [
                ["raw-html", function () { return "<h2> Resource reduction : Pre-Research resource gain and cost reduction are ^"+format(player.r.chb)+"" }, { "color": "orange", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> <i> Affecting : Number , Multiplicative , Divisive gain and Additive , Subtractive , Exponent cost reduction" }, { "color": "white", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c2,0)+"/8" }, { "color": "white", "font-size": "14px"}],
                ["blank" , "25px"],
                ["row", [["buyable", 1020], ["buyable", 1021]]],


            ]

        },
        "Frozen time" : {
            content : [
                ["raw-html", function () { return "<h2> Frozen time : Gamespeed is divided by /"+format(player.r.chc)+"" }, { "color": "yellow", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c3,0)+"/8" }, { "color": "white", "font-size": "14px"}],
                ["blank" , "25px"],
                ["row", [["buyable", 1030], ["buyable", 1031]]],


            ]
        },
        "Weaken exponent" : {
            content : [
                ["raw-html", function () { return "<h2> Weaken exponent : Exponent effect and max Perk Power is raised ^"+format(player.r.chd)+"" }, { "color": "lime", "font-size": "14px"}],
                ["raw-html", function () { return "<h2><i>Any bonuses that increase Exponent effect are also affected indirectly" }, { "color": "white", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c4,0)+"/8" }, { "color": "white", "font-size": "14px"}],
                ["blank" , "25px"],
                ["row", [["buyable", 1040], ["buyable", 1041]]],

 
            ]
        },
        "Cost superscaler" : {
            content : [
                ["raw-html", function () { return "<h2> Cost superscaler : Additive , Subtractive cost scaling start "+format(player.r.che)+"x earlier and are "+format(player.r.chf)+"x stronger" }, { "color": "cyan", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c5,0)+"/8" }, { "color": "white", "font-size": "14px"}],
                ["blank" , "25px"],
                ["row", [["buyable", 1050], ["buyable", 1051]]],

            ]
        },
        "Algebric failure" : {
            content : [
                ["raw-html", function () { return "<h2> Algebric failure : Coefficients and variable gain are ^"+format(player.r.chg)+" and Extension gain is ^"+format(player.r.chh)+" " }, { "color": "purple", "font-size": "14px"}],
                ["raw-html", function () { return "<h2><i> Reminder : You cannot enter Altered realm while in Meta-research challenge" }, { "color": "white", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c6,0)+"/8" }, { "color": "white", "font-size": "14px"}],
                ["blank" , "25px"],
                ["row", [["buyable", 1060], ["buyable", 1061]]],

            ]
        },
        "Harden Challenge" : {
            content : [
                ["raw-html", function () { return options.hidemastery?"<h2> Harden challenge : Pre-Research challenge goal are ^"+format(player.r.chi)+" and raise their reward by ^"+format(player.r.chj)+"":"<h2> Harden challenge : Pre-Research challenge goal are ^"+format(player.r.chi)+" and raise their reward by ^"+format(player.r.chj)+" . Each incomplete Pre-Research challenge additionally reduce your Mastery by /"+format(player.r.chk)+"." }, { "color": "pink", "font-size": "14px"}],
                ["raw-html", function () { return "<h2><i>When challenge reward is raised to a negative number , its reward will be inverted and hurts you instead <br> There are 7 Pre-Research challenges" }, { "color": "white", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c7,0)+"/8" }, { "color": "white", "font-size": "14px"}],
                ["blank" , "25px"],

                ["row", [["buyable", 1070], ["buyable", 1071]]],
            ]
        },
        "Ultimatum" : {
            content : [
                ["raw-html", function () { return "<h2> Ultimatium : +"+format(player.r.c8.div(4),1)+" to all modifier difficulty" }, { "color": "rgb(192,192,192)", "font-size": "14px"}],
                ["raw-html", function () { return "<h2><i>Adding to all modifier difficulty will ignore the level limit" }, { "color": "white", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c8,0)+"/8" }, { "color": "white", "font-size": "14px"}],
                ["blank" , "25px"],

                ["row", [["buyable", 1080], ["buyable", 1081]]],
            ]
        },
    },
    challenge: {
        "Main" : {
            content : [
            ["blank", "25px"],
            ["raw-html", function () { return "<h2> You have "+format(player.r.challengeshard,0)+" challenge shard" }, { "color": "white", "font-size": "14px"}],
            ["raw-html", function () { return "<h2> Total modifier level : "+format(player.r.potshard,0)+"" }, { "color": function() {return player.r.potshard.gt(player.r.challengeshard)?"lime":player.r.potshard.eq(player.r.challengeshard)?"yellow":"red"}, "font-size": "14px"}],
            ["blank", "25px"],
            ["raw-html", function () { return player.r.c8.gt(0)?"<h2> Ultimatium : +"+format(player.r.c8.div(4),1)+" to all modifier difficulty":"" }, { "color": "rgb(192,192,192)", "font-size": "14px"}],
            ["raw-html", function () { return "<h2> All of the following modifier will be applied : " }, { "color": "brown", "font-size": "14px"}],
            ["raw-html", function () { return "<h2> Points shredder : Points gain is ^"+format(player.r.cha)+"" }, { "color": "red", "font-size": "14px"}],
            ["raw-html", function () { return "<h2> Resource reduction : Pre-research resource gain and cost reduction  are ^"+format(player.r.chb)+"" }, { "color": "orange", "font-size": "14px"}],
            ["raw-html", function () { return "<h2> Frozen time : Gamespeed is divided by /"+format(player.r.chc)+"" }, { "color": "yellow", "font-size": "14px"}],
            ["raw-html", function () { return "<h2> Weaken exponent : Exponent effect and max Perk Power is raised ^"+format(player.r.chd)+"" }, { "color": "lime", "font-size": "14px"}],
            ["raw-html", function () { return "<h2> Cost superscaler : Additive , Subtractive cost scaling start "+format(player.r.che)+"x earlier and are "+format(player.r.chf)+"x stronger" }, { "color": "cyan", "font-size": "14px"}],
            ["raw-html", function () { return "<h2> Algebric failure : Coefficients and variable are ^"+format(player.r.chg)+" and Extension gain is ^"+format(player.r.chh)+"" }, { "color": "purple", "font-size": "14px"}],
            ["raw-html", function () { return options.hidemastery?"<h2> Harden challenge : Pre-Research challenge goal are ^"+format(player.r.chi)+" and raise their reward by ^"+format(player.r.chj)+"":"<h2> Harden challenge : Pre-Research challenge goal are ^"+format(player.r.chi)+" and raise their reward by ^"+format(player.r.chj)+" . Each incomplete Pre-Research challenge additionally reduce your Mastery by /"+format(player.r.chk)+"." }, { "color": "pink", "font-size": "14px"}],
            ["raw-html", function () { return player.g.sacrificeactive[6].gte(1)?"<h2>** Tickspeed overdrive : Tickspeed is ^"+format(player.r.chl)+" (Increase based on Points)":"" }, { "color": "white", "font-size": "14px"}],
            ["raw-html", function () { return player.g.sacrificeactive[6].gte(1)?"<h2>** Curse of corruption : You can only gain 1 out of 15 Graduation I resource per minute <br> Resources cycle every 15 minutes and all Algebric resources remain unaffected":"" }, { "color": "white", "font-size": "14px"}],
            ["raw-html", function () { return player.g.sacrificeactive[6].gte(1)?"<h2>** Brutal challenge : All pre-MR challenge are harder":"" }, { "color": "white", "font-size": "14px"}],

            ["blank", "25px"],
            ["raw-html", function () { return !player.g.sacrificeactive[6].gte(1)?"":"<h2><i>In this sacrifice , Improvements cost way less and All twilight perk aren't disabled <i>" }, { "color": "green", "font-size": "14px"}],
            ["raw-html", function () { return player.g.sacrificeactive[6].gte(1)?"<h2><i>You do not start with any Tetration in this Sacrifice":"<h2> <i>Entering this challenge will reset your research and tetration<i>" }, { "color": "white", "font-size": "14px"}],
            ["raw-html", function () { return player.g.sacrificeactive[6].gte(1)?"<h2><i>":"<h2> <i>All Twilight perk are disabled in this challenge <i>" }, { "color": "white", "font-size": "14px"}],
            ["raw-html", function () { return player.g.sacrificeactive[6].gte(1)&&player.g.artifactset4[3]>1?"<h2><i> Your charm's effect (Weaken challenge modifier) is stronger ("+format(player.g.artifactset4[3] - 1)+"% => "+format(player.g.artifactset4[3] * 2.5 - 1)+"%) inside this Sacrifice":"" }, { "color": "green", "font-size": "14px"}],

            ["blank", "25px"],
            ["row", [["challenge",11]]]


        ]
        },
        "Modifier" : {
            unlocked() {return !inChallenge('r',11)},
            content : [
            ["microtabs", "modifier", { 'border-width': '0px' }]
            ]
        },
        "Upgrade" : {
            unlocked() {return true}, 
            content: [
                ["row", [["buyable", 121]]],

            ],
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
                     ["raw-html", function () { return "<h2>You have " + format(player.r.points,0) + " Research => x"+format(player.r.researchmastery)+" Mastery" }, { "color": "pink", "font-size": "18px"}],
                     ["raw-html", function () { return player.r.infield&&!hasAchievement('ac',112)?"<h2>You will lose ALL field progress if you do a Research reset right now ":"" }, { "color": "red", "font-size": "18px"}],
                    ["raw-html", function () { return "<h3>Which is boosting Tickspeed by x" + format(player.r.tickspeedbonus) }, { "color": "lime", "font-size": "15px"}],
                       ["blank", "25px"],
                       ["row",[["buyable",10]]],
                       ["blank", "25px"],
                       "milestones"

                ]

        },
        "Improvement": {
            buttonStyle() { return { 'color': '#8a00a9' } },
            unlocked() { return hasMilestone('r',3) || player.g.sacrificeactive[6].gte(1)},
            content:

                [
                    ["blank", "25px"],
        ["raw-html", function () { return "<h2>Prestige time : " + formatTime(player.r.prestigetime) + " (+"+formatTime(player.r.deltatime)+"/s)" }, { "color": "lime", "font-size": "18px"}],
        ["raw-html", function () { return "<h2>Each improvement bought increase the cost of all other improvement (including itself)" }, { "color": "red", "font-size": "18px"}],
                    ["blank", "25px"],
                    ["row", [["buyable", 11]]],
                    ["row", [["buyable", 101], ["buyable", 102], ["buyable", 103], ["buyable", 104],["buyable",105]]],                    
    ]

        },
    },
    metaresearch: {
        //Field selector is currently being disabled for now! 
        "???" : {
            buttonStyle() { return { 'color': '#ff0000' , "border-color" : "orange" } },
            unlocked() { return false },
            content: [
                ["blank", "25px"],
               // ["raw-html", function () { return options.hidemastery?"<h2> Select your field here":"<h2> Select your field here (Selecting require 308.25 Current Mastery)" }, { "color": "orange", "font-size": "14px"}],
               // ["raw-html", function () { return "<h2> Field progress is RESETED everytime you perform a Research reset" }, { "color": "red", "font-size": "14px"}],
               // ["raw-html", function () { return "<h2> MR reset is the only way to exit current field" }, { "color": "pink", "font-size": "14px"}],
                ["row", [["buyable", 111]]],
                ["blank", "25px"],
                ["row", [["buyable", 113]]],
                ["blank", "25px"],
               // ["raw-html", function () { return player.r.infield?"<h2> You are currently in "+player.r.currentfield+" field":"" }, { "color": "white", "font-size": "14px"}],
                
            ]
        },
        "Main": {
            buttonStyle() { return { 'color': '#ff0000' , "border-color" : "orange" } },
            unlocked() { return !inChallenge('r',11) },
            content: [
                ["blank", "25px"],
                ["raw-html", function () { return "<h2>You have " + format(player.r.metaresearch)+ " Meta-research (MR)" }, { "color": "lime", "font-size": "14px"}],
                ["raw-html", function () { return !tmp.r.buyables[110].canAfford?"<h2>Cannot perform Meta-reset!":options.hidemastery?"<h2>Reset now to gain "+format(player.r.nextmetaresearch) +" MR":"<h2>Reset now to gain "+format(player.r.nextmetaresearch) +" MR (based on Mastery)" }, { "color": "lime", "font-size": "14px"}],
                ["raw-html", function () { return tmp.r.buyables[110].canAfford?"<h2>Meta-reset will force an Research reset and reset your Research and Improvements":"" }, { "color": "red", "font-size": "14px"}],
                ["raw-html", function () { return tmp.r.buyables[110].canAfford?"<h2><i> Hold shift to override confirmation":"" }, { "color": "white", "font-size": "14px"}],
                ["raw-html", function () { return !tmp.r.buyables[110].canAfford?"":hasAchievement('ac',115)?"<h2>"+format(achievementEffect('ac',115))+"% for Meta-reset to reset nothing and give 2x reward":"" }, { "color": "cyan", "font-size": "14px"}],
                ["blank", "10px"],
                ["row",[["buyable",1101]]],
                ["blank","15px"],
                ["row", [["buyable", 110]]],
                ["blank","20px"],
                ["raw-html", function () { return hasUpgrade('n',52)&&!hasMilestone('g',8)?"<h2>You have " + format(player.g.enmetalizedbits,0) + "/ "+format(player.g.storagedbitscap,0)+" Enmetalized Bits <br> Automaticly convert up to "+format(player.g.enmetalizedconvert,0)+" Enmetalized Bits to Metabit on Meta-research reset":"" }, { "color": "yellow", "font-size": "14px"}],
                ["blank","10px"],
                ["row", [["buyable", 1102],["buyable",1103],["buyable",1104],["buyable",1105]]],

            ]

                
        },
        "Upgrade" : {
            buttonStyle() { return { 'color': '#ff0000' , "border-color" : "orange" } },
            unlocked() { return player.r.tetration.gte(18) },
            content: [
                ["blank", "25px"],
                ["raw-html", function () { return "<h2>You have " + format(player.r.metaresearch)+ " Meta-research (MR)" }, { "color": "lime", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> <i> Meta research upgrade will be kept on Graduation reset " }, { "color": "white", "font-size": "14px"}],
                ["blank","25px"],
                ["row", [["upgrade", 101], ["upgrade", 102], ["upgrade", 103], ["upgrade", 104],["upgrade", 105],["upgrade",106]]],
                ["row", [["upgrade", 111], ["upgrade", 112], ["upgrade", 113], ["upgrade", 114]]],
                ["row", [["upgrade", 121], ["upgrade", 122], ["upgrade", 123]]],
                ["row", [["upgrade", 131], ["upgrade", 132]]],
                ["row", [["upgrade", 141]]],


                
            ]
        },
        "Qol Upgrade" : {
            buttonStyle() { return { 'color': '#ff0000' , "border-color" : "orange" } },
            unlocked() { return player.r.bestmastery.gte(10000) },
            content: [
                ["blank", "25px"],
                ["raw-html", function () { return "<h2>You have " + format(player.r.metaresearch)+ " Meta-research (MR)" }, { "color": "lime", "font-size": "14px"}],
                ["raw-html", function () { return "<h2> <i> Meta research QOL will kept on Meta-reset" }, { "color": "white", "font-size": "14px"}],
                ["blank","25px"],
                ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14],["upgrade", 15]]],
                ["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24]]],
                ["row", [["upgrade", 31], ["upgrade", 32], ["upgrade", 33]]],
                ["row", [["upgrade", 41], ["upgrade", 42]]],
                ["row", [["upgrade", 51]]],


                
            ]
        },
    }, 
     other: {
        "Twilight": {
            buttonStyle() { return { 'color': '#ffffff' , "border-color" : "white" } },
            unlocked() { return hasAchievement('ac',54) },
            content: [
                ["raw-html", function () { return options.hidemastery?"<h2>Twilight resource sometimes not generate . Get more resources and maybe it will":"<h2>Twilight resource will not generate if your Mastery is below "+format(1000)+"" }, { "color": function() {return player.r.mastery.gte(1000)?"lime":"red"}, "font-size": "14px"}],
                ["raw-html", function () { return "<h2>Twilight reward strength : "+format(buyableEffect('r',402).add(100))+"% (Improve Light additive & Dark subtractive reward)" }, { "color": "white", "font-size": "14px"}],
                ["blank","25px"],
                ["raw-html", function () { return "<h2>You have "+format(player.r.lightadd)+" Light Additive (+"+format(player.r.lightaddpersec)+"/s) , translated to </br> "+format(player.r.la1)+"x to Points gain </br> "+format(player.r.la2)+"x to Number gain </br> /"+format(player.r.la3)+" to additive cost" }, { "color": "lime", "font-size": "14px"}],
                ["blank","25px"],
                ["raw-html", function () { return "<h2>You have "+format(player.r.darksub)+" Dark Subtractive (+"+format(player.r.darksubpersec)+"/s) , translated to </br> "+format(player.r.da1)+"x to Multiplicative gain </br> "+format(player.r.da2)+"x to Divisive gain </br> /"+format(player.r.da3)+" to subtractive cost" }, { "color": "red", "font-size": "14px"}],
                ["blank","25px"],
                ["raw-html", function () { return "<h2>You have "+format(player.r.twilight)+" Twilight (+"+format(player.r.twilightpersec)+"/s) , which multiply tickspeed by "+format(player.r.ta1)+" </br> Twilight is generated based on current Light Additive and Dark Subtractive" }, { "color": "white", "font-size": "14px"}],
                ["blank","25px"],
                ["raw-html", function () {return hasAchievement('ac',96)?"<h2>You have "+format(player.r.energy)+" Energy (+"+format(player.r.energypersec)+"/s) which improve twilight gain by "+format(player.r.ee1)+"x </br> Energy gain is decreased based on current Energy":"" }, { "color": "cyan", "font-size": "14px"}],
                ["blank","25px"],
                ["row", [["buyable", 201], ["buyable", 202], ["buyable", 203]]],
                ["row", [["buyable", 301], ["buyable", 302], ["buyable", 303]]],
                ["row", [["buyable", 401], ["buyable", 402], ["buyable", 403]]],
                ["row", [["buyable", 501], ["buyable", 502], ["buyable", 503]]],
                ["row", [["buyable", 601], ["buyable", 602]]],
            
            ]
        },
         "Tetration" : {
                buttonStyle() { return { 'color': 'green' , "border-color" : "lime" } },
                unlocked() { return hasAchievement('ac',69) },
                content: [
                    ["blank", "25px"],
                    ["raw-html", function () { return options.hidemastery?"<h2> You have "+format(player.r.tetration,0)+" Tetration":"<h2> You have "+format(player.r.tetration,0)+" Tetration => x"+format(player.r.tetrationmastery)+" Mastery" }, { "color": "white", "font-size": "14px"}],
                    ["raw-html", function () { return "<h2> Tetration reset force an Meta-reset but do not give any Meta research"}, { "color": "red", "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetrationcost.lte("1e100")?"<h2> Next tetration require "+format(player.r.tetrationcost.max(0),1)+" effective exponent":""}, { "color": "white", "font-size": "10px"}],
                    ["raw-html", function () { return "<h2> There is a 0.25s cooldown between Tetration reset"}, { "color": "white", "font-size": "10px"}],

                    ["blank","25px"],
                    ["raw-html", function () { return "<h2> At Tetration 1 : Points gain is ^1.1 . Extend 4 Research milestone autobuyer to buy more upgrade"}, { "color": function(){return player.r.tetration.gte(1)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(1)?"<h2> At Tetration 2 : Improve 'Points Boost' bonus":""}, { "color": function(){return player.r.tetration.gte(2)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(2)?"<h2> At Tetration 3 : Additive and Subtractive cost scaling start 1.25x later .":""}, { "color": function(){return player.r.tetration.gte(3)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(3)?"<h2> At Tetration 4 : ^1.04 max Perk Power and you can gain Perk Power from Research":""}, { "color": function(){return player.r.tetration.gte(4)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(4)?"<h2> At Tetration 5 : ^1.1 Divisive gain . The 4 Research milestone is always active":""}, { "color": function(){return player.r.tetration.gte(5)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(5)?"<h2> At Tetration 6 : Exponent cost scaling base is x0.96 . Additional Altered realm achievement":""}, { "color": function(){return player.r.tetration.gte(6)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(6)?"<h2> At Tetration 7 : Exponent boost is 10% stronger and its cost divisor is ^1.5":""}, { "color": function(){return player.r.tetration.gte(7)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(7)?"<h2> At Tetration 8 : Unlock Meta research Challenge":""}, { "color": function(){return player.r.tetration.gte(8)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(8)?"<h2> At Tetration 9 : The first row of number upgrade now provide an exponental boost to points gain":""}, { "color": function(){return player.r.tetration.gte(9)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(9)?"<h2> At Tetration 10 : Multiplier to All twilight resource and Prestige Time gain equal to current Challenge Shard":""}, { "color": function(){return player.r.tetration.gte(10)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(10) && player.g.rank.gte(2)?"<h2> At Tetration 11 : 2x Prestige Time gain":""}, { "color": function(){return player.r.tetration.gte(11)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(11)?"<h2> At Tetration 12 : Increase 'Fatigue' and 'Halted counter' challenge reward and challenge goal . Unlock more ticks upgrade":""}, { "color": function(){return player.r.tetration.gte(12)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(12)?"<h2> At Tetration 14 : Increase 'No Number' challenge reward and slightly increase its goal":""}, { "color": function(){return player.r.tetration.gte(14)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(14)?"<h2> At Tetration 15 : Tetration no longer reset anything":""}, { "color": function(){return player.r.tetration.gte(15)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(15)?"<h2> At Tetration 16 : 3x Gamespeed":""}, { "color": function(){return player.r.tetration.gte(16)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(16)?"<h2> At Tetration 17 : +1 more Exponent challenge":""}, { "color": function(){return player.r.tetration.gte(17)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(17)?"<h2> At Tetration 18 : Unlock more MR upgrade":""}, { "color": function(){return player.r.tetration.gte(18)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(18)?"<h2> At Tetration 19 : +3% 'Points Boost' level per Challenge Shard":""}, { "color": function(){return player.r.tetration.gte(19)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(19)?"<h2> At Tetration 20 : Unlock more Bits content":""}, { "color": function(){return player.r.tetration.gte(20)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(20)?"<h2> At Tetration 21 : Unlock 'Energy Enhancer' , giving more Energy":""}, { "color": function(){return player.r.tetration.gte(21)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(21)?"<h2> At Tetration 22 : Unlock Twilight crystal , boosting the effectiveness of ALL twilight resource buyables":""}, { "color": function(){return player.r.tetration.gte(22)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(22)?"<h2> At Tetration 23 : +2 and x1.5 Graduate gain":""}, { "color": function(){return player.r.tetration.gte(23)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(23)?"<h2> At Tetration 24 : Unlock Twilight star , reducing the cost of <i>Twilight crystal</i>":""}, { "color": function(){return player.r.tetration.gte(24)?"green":"red"}, "font-size": "14px"}],
                    ["raw-html", function () { return player.r.tetration.gte(24)?"<h2> At Tetration 25 : Nothing?":""}, { "color": function(){return player.r.tetration.gte(25)?"orange":"red"}, "font-size": "14px"}],

                    ["blank","25px"],
                    ["row",[["buyable",120]]],
                ]
            },
         "Gamespeed" : {
                buttonStyle() { return { 'color': 'white' , "border-color" : "white" } },
                unlocked() { return hasAchievement('ac',67) },
                content: [
                    ["blank", "25px"],
                    ["raw-html", function () { return "<h2> Consuming "+format(player.r.gsreq,0)+" Ticks/s for "+format(player.r.gsbase,1)+"x Gamespeed"}, { "color": "green", "font-size": "14px"}],
                    ["raw-html", function () { return "<h2> Ticks isn't affected by this Gamespeed multiplier"}, { "color": "red", "font-size": "12px"}],
                    ["raw-html", function () { return "<h2> Inflicts Heat every second of usage"}, { "color": "red", "font-size": "12px"}],
                    ["raw-html", function () { return "<h2> You can upkeep this for "+formatTime(player.r.gsupkeep)+" , which may depend based on your Heat"}, { "color": "white", "font-size": "10px"}],
                    ["blank","25px"],
                    ["row", [["buyable", 1001], ["buyable", 1002]]],
                    ["blank","25px"],
                    ["row", [["buyable", 1003], ["buyable", 1004]]],
                ]
            },
                
        
     
    }
},
tabFormat: [
    ["row" , [["clickable",11],["clickable",12],["clickable",13]]],
    ["blank","25px"],
    ["microtabs", "stuff", { 'border-width': '0px' }],
],
layerShown() { return hasAchievement('ac',39) || player.e.points.gte(10) }


}) 

addLayer("al", {
    startData() { return {
        //basic data                  
        unlocked: true,
        bankedprestigetime: d(0),                     
        //function and x
        points: d(0),
        pointsgainal: d(0),
        x: d(0),
        a: d(0),
        b: d(0),
        c: d(0),
        y: d(0),
        value: d(0),

        cmilestone: d(0),
        bmilestone: d(0),
        amilestone: d(0),

        resetcooldown: d(0),

        //extension of function
        extension: d(0),
        extensiongain: d(0),
        extensionboost: d(0),
        x1: d(0),
        a1 : d(0),
        b1 : d(0),
        c1: d(0),
        deltax: d(0),
        deltay: d(0),
        purchasemultiplier: d(1),

        //operation
        operation: d(0),
        operationgain: d(0),
        tickspeedreduction1:d(0.2),
        tickspeedreduction2:d(1),
        alteredpow:d(0.25),
        operationeffect: d(0),
        //
        bank1: d(0),
        bank2: d(0),
        bank3: d(0),
        bank4: d(0),
        resetTime: d(0)

        
    }},
    color: "lime",                       // The color for this layer, which affects many elements.
    row: 4,                                 // The row this layer is on (0 is the first row).
    tooltip() {
        return "Algebra"
    },
    type: "none",                         // Determines the formula used for calculating prestige currency.
    ttStyle() {
        return {
            "color":"lime",
            "width":"200px",
            "border":"2px solid",
            "border-color":"green",
        }
    },
    

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = d(1)
        return multi 
    },
    gainExp() {   
        let exp = d(1)                
        return exp
    },
    infoboxes: {
        lore1: {

        }
    },
    doReset(resettingLayer) {
        let keep =  [];
        if (layers[resettingLayer].row > this.row && !(player.g.sacrificeactive[3].gte(1) || hasUpgrade('n',72))) layerDataReset("al", keep)
    },

    automate() {
        player.al.resetTime = player.points.times(0)
        //function
        let totalc = d(0).add(buyableEffect('al',11))
        if(inChallenge('r',11)) totalc = totalc.pow(player.r.chg)
        player.al.c = totalc

        let totalb = d(0).add(buyableEffect('al',12))
        if(inChallenge('r',11)) totalb = totalb.pow(player.r.chg)
        player.al.b = totalb

        let totala = d(0).add(buyableEffect('al',13))
        if(hasUpgrade('al',12)) totala = totala.times(upgradeEffect('al',12))
        if(inChallenge('r',11)) totala = totala.pow(player.r.chg)
        player.al.a = totala

        let delx = buyableEffect('al',14).times(player.al.extensionboost)
        if(hasUpgrade('al',11)) delx = delx.times(upgradeEffect('al',11))
        if(hasUpgrade('n',72)) delx = delx.times(buyableEffect('al',51))
        if(inChallenge('r',11)) delx = delx.pow(player.r.chg)
        if(player.al.resetcooldown.gt(0)) delx = d(0)
        player.al.deltax = delx.times(player.r.truegamespeed)

        let deltay = buyableEffect('al',16).times(player.r.truegamespeed)
        if(!hasAchievement('ac',124)) deltay = d(0)
        player.al.deltay = deltay

        player.al.purchasemultiplier = player.al.y.max(10).log(10).add(5).log(6).div(5).times(buyableEffect('al',17).div(100).add(1)).add(0.8)

        let totala1 = player.al.a
        if(hasUpgrade('al',13)) totala1 = totala1.times(upgradeEffect('al',13))

        player.al.x1 = player.al.x
        player.al.a1 = totala1
        player.al.b1 = player.al.b
        player.al.c1 = player.al.c
       let val = player.al.a1.times(player.al.x1.pow(2)).add(player.al.b1.times(player.al.x1)).add(player.al.c1) 
       if(inChallenge('c',11)) val = d(0)
        player.al.value = val


        let gainal = player.al.value.times(player.al.extensionboost).times(buyableEffect('al',23))
        if(hasUpgrade('al',14)) gainal = gainal.times(upgradeEffect('al',14))
        if(player.al.resetcooldown.gt(0)) gainal = gainal.times(0)
        player.al.pointsgainal = gainal.times(player.r.truegamespeed)

        if(player.al.resetcooldown.gt(0)) {
            player.al.points = d(0)
        }

        //milestone
        let reqc = d(16).times(buyableEffect('al',21))
        if(hasUpgrade('al',21)) reqc = reqc.add(upgradeEffect('al',21))
        let reqb = d(32).times(buyableEffect('al',21))
        let reqa = d(64).times(buyableEffect('al',21))



        player.al.cmilestone = reqc.max(1)
        player.al.bmilestone = reqb.max(1)
        player.al.amilestone = reqa.max(1)

        // extension
        let d1 = d("1e3")
        if(inChallenge('r',11)) d1 = d1.pow(player.r.chh)
        let limitofext = d("1e10")
        deltaextension = player.al.points.div("1e6").pow(0.75)
        if(inChallenge('r',11)) deltaextension = deltaextension.pow(player.r.chh)
        deltaextension1 = softcap(deltaextension,player.r.chh,0.5)
        deltaextension12 = softcap(deltaextension1,limitofext,player.al.operationeffect.div(100).max(0).min(1))
        if(player.g.timer2.lte(0.5)) deltaextension12 = d(0)
        player.al.extensiongain = deltaextension12.times(buyableEffect('al',24)).times(buyableEffect('al',34))

        extensionbuff = player.al.extension.add(1).pow(0.9)
        extensionbuff1 = softcap(extensionbuff,d("100"),0.8)
        extensionbuff12 = softcap(extensionbuff1,d("10000"),0.7)
        extensionbuff123 = softcap(extensionbuff12,d("1000000"),0.6)
        extensionbuff1234 = softcap(extensionbuff12,d("100000000"),0.5)
        player.al.extensionboost = extensionbuff1234.max(1)


        //operation

        let operationgainal = d(0)
        let operationgainal1 = d(0)
        if(inChallenge('al',11)) operationgainal = operationgainal.add(d(2).pow(player.r.mastery.add(4).div(4)).sub(2))
        if (hasUpgrade('r',51)) operationgainal1 = operationgainal1.add(d(2).pow((player.points.add(10).log(10).pow(2.5)).add(4).div(4)).sub(2))
    
        let operationgainal2 = operationgainal1.min("1e6").times(operationgainal1.div(5e5).floor().max(2).log(2))
        operationgainal2 = operationgainal2.add(operationgainal.min("1e6").times(operationgainal.div(5e5).floor().max(2).log(2)))
        if(hasAchievement('ac',126)) operationgainal2 = operationgainal2.pow(achievementEffect('ac',126))
        if(hasUpgrade('al',34)) operationgainal2 = operationgainal2.times(upgradeEffect('al',34)) 

        let operationgain = operationgainal2.times(buyableEffect('al',31)).times(buyableEffect('r',105)).times(player.r.truegamespeed)
        if(hasAchievement('ac',145)) operationgain = operationgain.times(achievementEffect('ac',145))
        if(player.g.timer2.lte(1)) operationgain = d(0)
        player.al.operationgain = operationgain.pow(buyableEffect('al',52))
        //tick
        let tickspeedreduction1eff = d(0.2)
        if(hasUpgrade('al',33)) tickspeedreduction1eff = tickspeedreduction1eff.add(0.3)
        if(hasAchievement('ac',76)) tickspeedreduction1eff = tickspeedreduction1eff.add(0.1)
        if(hasAchievement('ac',78)) tickspeedreduction1eff = tickspeedreduction1eff.add(0.1)
        player.al.tickspeedreduction1 = tickspeedreduction1eff

        let tickspeedreduction2eff = d("1e20").div(buyableEffect('al',32))
        if(hasAchievement('ac',74)) tickspeedreduction2eff = tickspeedreduction2eff.div(4)
        if(inChallenge('d',13)) tickspeedreduction2eff = tickspeedreduction2eff.root(5)
        player.al.tickspeedreduction2 = tickspeedreduction2eff

        let alteredpower = d(0.25)
        if(hasAchievement('ac',75)) alteredpower = alteredpower.add(0.05)
        if(hasAchievement('ac',79)) alteredpower = alteredpower.add(0.1)
        if(hasUpgrade('al',53)) alteredpower = alteredpower.add(0.1)
        player.al.alteredpow = alteredpower 

        let op1 = d(100).sub(d(100).div(player.al.operation.add(10).slog()))
        if(hasSuperAchievement('ac',75)) op1 = op1.pow(0.9)
        player.al.operationeffect = op1
    },
      
    update(delta) {
    player.al.resetcooldown = player.al.resetcooldown.sub(delta).max(0)
    player.al.x = player.al.x.add(player.al.deltax.times(delta))
    player.al.points = player.al.points.add((player.al.pointsgainal).times(delta))

    player.al.operation = player.al.operation.add(player.al.operationgain.times(delta))
        if(hasUpgrade('r',31)) {
            player.al.extension = player.al.extension.add(player.al.extensiongain.div(10).times(player.r.truegamespeed).times(delta))
        }
        if(hasAchievement('ac',124)) {
            player.al.y = player.al.y.add(player.al.deltay.times(delta))
        }
    },

    milestones: {
        
    },
    buyables: {
        11: {
            title() {
                return format(getBuyableAmount(this.layer,this.id),0) + "<br/> Base C value  "
               } ,
            cost(x) { 
                let cost = d(1.2).pow(x.pow(1.1)).times(5).sub(5) 
                cost = postcorruptiongain(cost , d(5) , d("1e500"))
                return cost
            },
            tooltip() {               
            return "Cost : "+Qcolor2('a',format(this.cost()))+" algebric <br/> Effect : Increase "+Qcolor2('a','c')+" by " +Qcolor2('a',format(this.effect())) +" => "+Qcolor2('a',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" <br> "+Qcolor2('n','Coefficient purchase multiplier')+" applied every "+Qcolor2('n',format(player.al.cmilestone,0))+" levels" },
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

                return effect1.times(this.multiplier().pow(bonus))         
            },
            style() {
				if (player.al.points.lt(this.cost())) return Qcolor()
				else return Qcolor('rgb(128,128,32)')},
            multiplier() {
                let base = d(1)
                base = base.times(player.al.purchasemultiplier)
                return base.add(1)
            },
    
        },
        12: {
            title() {
                return format(getBuyableAmount(this.layer,this.id),0) + "<br/> Base B value  "
               } ,
            cost(x) { 
                let cost = d(1.3).pow(x.pow(1.1)).times(25) 
                cost = postcorruptiongain(cost , d(5) , d("1e500"))
                return cost
            },
            tooltip() { 
                let power = d(1)
                if(hasAchievement('ac',156)) power = power.times(achievementEffect('ac',156))
                if(power.eq(1)) return "Cost : "+Qcolor2('a',format(this.cost()))+" algebric <br/> Effect : Increase "+Qcolor2('a','b')+" by " +Qcolor2('a',format(this.effect())) +" => "+Qcolor2('a',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" <br> "+Qcolor2('n','Coefficient purchase multiplier')+" applied every "+Qcolor2('n',format(player.al.bmilestone,0))+" levels"
                else return "Cost : "+Qcolor2('a',format(this.cost()))+" algebric <br/> Effect ("+Qcolor2('y','^'+f(power))+") : Increase "+Qcolor2('a','b')+" by " +Qcolor2('a',format(this.effect())) +" => "+Qcolor2('a',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" <br> "+Qcolor2('n','Coefficient purchase multiplier')+" applied every "+Qcolor2('n',format(player.al.bmilestone,0))+" levels" },
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
                let eff =  effect1.times(this.multiplier().pow(bonus))      
                if(hasAchievement('ac',156)) eff = eff.pow(achievementEffect('ac',156)) 
                return eff  
            },
            style() {
				if (player.al.points.lt(this.cost())) return Qcolor()
				else return Qcolor('rgb(128,128,32)')},
            multiplier() {
                let base = d(1)
                base = base.times(player.al.purchasemultiplier)
                return base.add(1)
            },
    
        },
        13: {
            title() {
                return format(getBuyableAmount(this.layer,this.id),0) + "<br/> Base A value  "
               } ,
            cost(x) { 
                let cost = d(1.4).pow(x.pow(1.1)).times(125) 
                cost = postcorruptiongain(cost , d(5) , d("1e500"))
                return cost
            },
            tooltip() { 
                return "Cost : "+Qcolor2('a',format(this.cost()))+" algebric <br/> Effect : Increase "+Qcolor2('a','a')+" by " +Qcolor2('a',format(this.effect())) +" => "+Qcolor2('a',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" <br> "+Qcolor2('n','Coefficient purchase multiplier')+" applied every "+Qcolor2('n',format(player.al.amilestone,0))+" levels" },
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
                let eff =  effect1.times(this.multiplier().pow(bonus))    
                return eff     
            },
            style() {
				if (player.al.points.lt(this.cost())) return Qcolor()
				else return Qcolor('rgb(128,128,32)')},
            multiplier() {
                let base = d(1)
                base = base.times(player.al.purchasemultiplier)
                return base.add(1)
            },
    
        },
        14: {
            title() {
                return format(getBuyableAmount(this.layer,this.id),0) + "<br/> Base X value  "
               } ,
            cost(x) { 
                let growth = d(0.5).div(buyableEffect('al',22))
                let scaling = growth.add(1)
                let cost = scaling.pow(x.pow(1.1)).times(10) 
                cost = postcorruptiongain(cost , d(5) , d("1e500"))
                return cost
            },
            tooltip() { 
                return "Cost : "+Qcolor2('a',format(this.cost()))+" algebric <br/> Effect : Increase "+Qcolor2('a','x')+" by " +Qcolor2('a',format(this.effect())) +" => "+Qcolor2('a',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" <br> "+Qcolor2('n','Variable X purchase multiplier')+" applied every level "+Qcolor2('green3','above 10')+"" },
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
                let effect2 = this.multiplier().pow(bonus)
                if(hasUpgrade('al',23)) effect1 = effect1.times(upgradeEffect('al',23))
                return effect1.times(effect2)         
            },
            style() {
				if (player.al.points.lt(this.cost())) return Qcolor()
				else return Qcolor('rgb(128,128,32)')},
            multiplier() {
                let base = d(0.04)
                base = base.times(player.al.purchasemultiplier)
                return base.add(1)
            },
    
        },
        15: {
            title() {
                return "Extension reset (CD : "+formatTime(player.al.resetcooldown.max(0))+") "
               } ,
            cost(x) { 
                return d(0) },
            display() { 
            return "" },
            canAfford() { return player.al.points.gte("1e6")},
            tooltip() {return "After reset , Algebric cannot be gain until the reset cooldown expire"},
            buy() {
                player.al.buyables[11] = d(0)
                player.al.buyables[12] = d(0)
                player.al.buyables[13] = d(0)
                player.al.buyables[14] = d(0)

                player.al.x = d(0)
                player.al.deltax = d(0)
                player.al.extension = player.al.extension.add(player.al.extensiongain)
                let ti = d(5)
                if(hasUpgrade('al',21)) ti = ti.add(upgradeEffect('al',21))
                player.al.resetcooldown = ti
                player.al.points = player.al.points.times(0)
        
                 if(!hasUpgrade('r',32)) { 
                    for (let i = 0; i < player.al.upgrades.length; i++) {
                        if (+player.al.upgrades[i] < 15) {
                            player.al.upgrades.splice(i, 1);
                            i--;
                        }
                    }}
             
            

    
        },
        style() {
           return {
                'border-radius': '0%',
                'color':'orange',
                'background-color':'black',
                'border':'2px solid',
                'height':'100px'
            }}
    },
    16: {
        title() {
            return format(getBuyableAmount(this.layer,this.id),0) + "<br/> Base Y value  "
           } ,
        cost(x) { 
            let growth = d(2)
            let scaling = growth.add(1)
            let cost =  scaling.pow(x.pow(1.1)).times(d("1e50")) 
            cost = postcorruptiongain(cost , d(5) , d("1e500"))
            return cost
        },
        tooltip() {
            return "Cost : "+Qcolor2('a',format(this.cost()))+" algebric <br/> Effect : Increase "+Qcolor2('a','y')+" by " +Qcolor2('a',format(this.effect())) +" => "+Qcolor2('a',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+"" },
        canAfford() { return player.al.points.gte(this.cost())},
        buy() {
            player.al.points = player.al.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
            let effect1 = x.add(1).tetrate(1.25).div(100)
            return effect1         
        },
        style() {
            if (player.al.points.lt(this.cost())) return Qcolor()
            else return Qcolor('rgb(128,128,32)')},
        unlocked() {return hasAchievement('ac',124)},

    },
    17: {
        title() {
            return format(getBuyableAmount(this.layer,this.id),0) + "<br/> Stronger Y"
           } ,
        cost(x) { 
            let growth = d(9)
            let scaling = growth.add(1)
            let cost = scaling.pow(x.pow(1.05)).times(d("1e75")) 
            cost = postcorruptiongain(cost , d(5) , d("1e500"))
            return cost
        },
        tooltip() {
            return "Cost : "+Qcolor2('a',format(this.cost()))+" algebric <br/> Effect : Variable "+Qcolor2('a','y')+" effect is " +Qcolor2('a',format(this.effect())) +" => "+Qcolor2('a',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" % stronger" },
        canAfford() { return player.al.points.gte(this.cost())},
        buy() {
            player.al.points = player.al.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) {
            let effect1 = x.add(1).root(1.25).sub(1)
            return effect1         
        },
        style() {
            if (player.al.points.lt(this.cost())) return Qcolor()
            else return Qcolor('rgb(128,128,32)')},
        unlocked() {return hasAchievement('ac',124)},

    },
    21: {
        title() {
            return formatWhole(getBuyableAmount(this.layer,this.id)) + "/"+format(this.purchaseLimit(),0)+" <br/> Reduced bonus requirement  "
           } ,
        cost(x) { 
            if (player[this.layer].buyables[this.id].gte(this.purchaseLimit())) return d(0)
            return d(4).pow(x.pow(2)).times(4) },
        tooltip() { 
        return "Effect : "+Qcolor2('e','Coefficients purchase multiplier')+" activates " +Qcolor2('r',format(this.effect().pow(-1))) + "x sooner" },
        display() {
        return "Cost : "+Qcolor2('a',format(this.cost())+" extension")+""
        },
        canAfford() { return player.al.extension.gte(this.cost())},
        buy() {
            player.al.extension = player.al.extension.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

        },
        effect(x) {
            let effect1 = d(1).sub(x.div(16))
            return effect1        
        },
        purchaseLimit() {
            let base = d(6)
            if(hasAchievement('ac',125)) base = base.add(3)
            return base
        },
        style() {
        if(getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return Qcolor('green')
        if (player.al.extension.lt(this.cost())) return Qcolor()
		else return Qcolor('rgb(128,128,32)')}

    },
    22: {
        title() {
            return formatWhole(getBuyableAmount(this.layer,this.id)) + "/"+format(this.purchaseLimit(),0)+" <br/> Lower unknown cost  "
           } ,
        cost(x) { 
            if (player[this.layer].buyables[this.id].gte(this.purchaseLimit())) return d(0)
            let level = x
            if(level.gt(32)) level = level.tetrate(1.05)
            return d(1.1).pow(level.times(10)).times(10) },
        tooltip() { 
        return "Effect : Reduce the "+Qcolor2('s','cost increase')+" of "+Qcolor2('m','variable X')+" by " +Qcolor2('a',format(this.effect()))+"x => "+Qcolor2('a',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+"x" },
        display() {
            return "Cost : "+Qcolor2('a',format(this.cost())+" extension")+""
        },
        canAfford() { return player.al.extension.gte(this.cost())},
        buy() {
            player.al.extension = player.al.extension.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          
        },
        effect(x) {
            let effect1 = x.add(1).pow(0.2)
            if(x.gt(32)) effect1 = effect1.times(d(1.01).pow(x.sub(32)))
            return effect1      
        },
        purchaseLimit() {
            let base = d(32)
            if(hasUpgrade('al',62)) base = base.add(upgradeEffect('al',62))
            return base
        },
        style() {
            if(getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return Qcolor('green')
            if (player.al.extension.lt(this.cost())) return Qcolor()
            else return Qcolor('rgb(128,128,32)')}

    },
    23: {
        title() {
            return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> More Algebric "
           } ,
        cost(x) { 
            let base = d(2).add(x).times(2)
            return d(base).pow(x).times(10) },
        tooltip() { 
        return "Effect : Multiply "+Qcolor2('la','Algebric')+" gain by " +Qcolor2('e',format(this.effect())) + " => "+Qcolor2('e',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+"" },
        display() {
            return "Cost : "+Qcolor2('a',format(this.cost())+" extension")+""
        },
        canAfford() { return player.al.extension.gte(this.cost())},
        buy() {
            player.al.extension = player.al.extension.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
       
        },
        effect(x) {
            let effect1 = d(1.5).pow(x)
            return effect1.max(1)        
        },
        style() {
            if (player.al.extension.lt(this.cost())) return Qcolor()
                    else return Qcolor('rgb(128,128,32)')}

    },
    24: {
        title() {
            return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Extension Booster I  "
           } ,
        cost(x) { 
            let base = d(3).add(x).times(1.5)
            return d(base).pow(x).times(10) },
        tooltip() { 
        return "Effect : Multiply "+Qcolor2('y','Extension')+" gain by " +Qcolor2('e',format(this.effect()))+ " => "+Qcolor2('e',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+"" },
        display() {
            return "Cost : "+Qcolor2('a',format(this.cost())+" extension")+""
        },
        canAfford() { return player.al.extension.gte(this.cost())},
        buy() {
            player.al.extension = player.al.extension.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

        },
        effect(x) {
            let effect1 = d(1.25).pow(x)
            return effect1         
        },
        style() {
            if (player.al.extension.lt(this.cost())) return Qcolor()
                    else return Qcolor('rgb(128,128,32)')}

    },
    31: {
        title() {
            return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> More Operation "
           } ,
        cost(x) { 
            return d(10).pow(x).times(10)},
        tooltip() { 
        return "Effect : Multiply "+Qcolor2('la','Operation')+" gain by " + format(this.effect()) + " => "+format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1)))+"" },
        display() {
        return "Cost : "+Qcolor2('a',format(this.cost())+" Operation")
        },
        canAfford() { return player.al.operation.gte(this.cost())},
        buy() {
            if(!hasSuperAchievement('ac',74)) player.al.operation = player.al.operation.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            if(hasSuperAchievement('ac',74)) {
                setBuyableAmount(this.layer,this.id,player.al.operation.max(10).log(10).floor())
            }
        },
        effect(x) {
            let base = d(2)
            if(hasSuperAchievement('ac',74)) base = base.times(1.1)
            let effect1 = base.pow(x)
            return effect1        
        },
        style() {
				if (player.al.operation.lt(this.cost())) return Qcolor()
				else return Qcolor('rgb(128,128,32)')}

    },
    32: {
        title() {
            return formatWhole(getBuyableAmount(this.layer,this.id)) + "/100 <br/> Lower Tickspeed Penality  "
           } ,
        cost(x) { 
            if (player[this.layer].buyables[this.id].gte(this.purchaseLimit())) return d(0)
            let base = d(4).pow(x).times(10)
            if(hasUpgrade('al',52)) base = base.pow(0.4)
            return base
        },
        tooltip() { 
            return "Effect : Divide "+Qcolor2('y','Tickspeed divider')+" penality by " + format(this.effect()) + " => "+format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1)))+"" },
        display() {
            return "Cost : "+Qcolor2('a',format(this.cost())+" Operation")
         },
        canAfford() { return player.al.operation.gte(this.cost())},
        buy() {
            player.al.operation = player.al.operation.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          
        },
        effect(x) {
            let effect1 = d(1.25).pow(x)
            return effect1      
        },
        style() {
                if (player.al.buyables[32].gte(this.purchaseLimit())) return Qcolor('green')
				else if (player.al.operation.lt(this.cost())) return Qcolor()
				else return Qcolor('rgb(128,128,32)')},
        purchaseLimit() {return d(100)}

    },
    33: {
        title() {
            return formatWhole(getBuyableAmount(this.layer,this.id)) + "/"+format(this.purchaseLimit(),0)+" <br/> Algebric Points boost"
           } ,
        cost(x) { 
            if (player[this.layer].buyables[this.id].gte(this.purchaseLimit())) return d(0)
            let base = d(4).add(x).times(4)
            if(x.gt(5)) base = base.tetrate(1.5)
            return d(base).pow(x).times(2) },
        tooltip() { 
            return "Effect : Multiply "+Qcolor2('n','points')+" gain by " +Qcolor2('n',format(this.effect()))+ " => "+Qcolor2('n',format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1))))+" (based on "+Qcolor2('la','Algebric')+") . Effect weakened inside Altered realm" },
        display() {
            return "Cost : "+Qcolor2('a',format(this.cost())+" Operation")
        },
        canAfford() { return player.al.operation.gte(this.cost())},
        buy() {
            player.al.operation = player.al.operation.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
       
        },
        effect(x) {
            let fact = player.al.points.add(10).pow(0.25).pow(x)
            if(x.gt(5)) fact = fact.pow(x.div(5).add(1))
            if(inChallenge('al',11)) fact = fact.pow(0.1)
            fact1 = softcap(fact,d("1e100"),0.1)
            fact1 = postcorruptiongain(fact1,d(0.25),d("1e500"))
            return fact1        
        },
        style() {
            if (player.al.buyables[33].gte(this.purchaseLimit())) return Qcolor('green')
            else if (player.al.operation.lt(this.cost())) return Qcolor()
            else return Qcolor('rgb(128,128,32)')},
        purchaseLimit() {
            let base = d(5)
            if(hasUpgrade('al',61)) base = base.add(upgradeEffect('al',61))
            return base
        } 

    },
    34: {
        title() {
            return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Extension booster II  "
           } ,
        cost(x) { 
            let base = d(2).add(x)
            return d(base).pow(x).times(1000) },
        tooltip() { 
                return "Effect : Multiply "+Qcolor2('y','Extension')+" gain by " + format(this.effect()) + " => "+format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1)))+"" },
        display() {
                return "Cost : "+Qcolor2('a',format(this.cost())+" Operation")
        },
        canAfford() { return player.al.operation.gte(this.cost())},
        buy() {
            player.al.operation = player.al.operation.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

        },
        effect(x) {
            let effect1 = d(1.5).pow(x)
            return effect1         
        },
        style() {
            if (player.al.operation.lt(this.cost())) return Qcolor()
            else return Qcolor('rgb(128,128,32)')},
    },
    51: {
        title() {
            return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> Stronger Unknown "
           } ,
        cost(x) { 
            let base = x.times(100).pow(x.add(1).root(1.25))
            return d(base).pow(x).times(d("100")) },
        tooltip() { 
                return "Effect : "+Qcolor2('y','X')+" gain is multiplied by " + format(this.effect()) + " => "+format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1)))+"" },
        display() {
                return "Cost : "+Qcolor2('a',format(this.cost())+" Operation")
        },
        canAfford() { return player.al.operation.gte(this.cost())},
        buy() {
            player.al.operation = player.al.operation.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

        },
        effect(x) {
            let effect1 = x.add(1).tetrate(1.5)
            return effect1         
        },
        unlocked() {
            return hasUpgrade('n',72)
        },
        style() {
            if (player.al.operation.lt(this.cost())) return Qcolor()
            else return Qcolor('rgb(128,128,32)')},
    },
    52: {
        title() {
            return formatWhole(getBuyableAmount(this.layer,this.id)) + "<br/> More operation II"
           } ,
        cost(x) { 
            let base = d(2).add(x).tetrate(2)
            return d(base).pow(x).pow(1.5).times(100) },
        tooltip() { 
                return "Effect : Raise "+Qcolor2('a','Operation')+" gain by " + format(this.effect(),3) + " => "+format(this.effect(d(getBuyableAmount(this.layer,this.id)).add(1)),3)+" <br> Effect significantly reduced above ^1.250" },
        display() {
                return "Cost : "+Qcolor2('a',format(this.cost())+" Operation")
        },
        canAfford() { return player.al.operation.gte(this.cost())},
        buy() {
            player.al.operation = player.al.operation.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

        },
        effect(x) {
            let effect1 = softcap(d(1.01).pow(x).times(d("1e10")),d("1.25e10"),0.1).div("1e10")
            return effect1         
        },
        unlocked() {
            return hasUpgrade('n',72)
        },
        style() {
            if (player.al.operation.lt(this.cost())) return Qcolor()
            else return Qcolor('rgb(128,128,32)')},
    },

    },

    upgrades: {
        11: {
            title: "Constant to Variable",
            description() {return "Current C value multiply X gain"},
            cost: d("1e3"),
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
            description: "Current B value boosts A",
            cost: d("5e3"),
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
            description: "Current A value self-boosts",
            cost: d("2.5e4"),
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
            description: "Current X value increases algebric gain",
            cost: d("1.25e5"),
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
            description: "C milestone require 4 less",
            cost: d("6.25e8"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true },
            effect() {
                let eff = d(-4)
                return eff
            },
            effectDisplay() { return ""+format(upgradeEffect(this.layer, this.id))+" needed" }, 
        },
        22: {
            title: "Fast purchases",
            description: "Enable the ability to purchase much more coefficients and variables",
            cost: d("1e15"),
            tooltip:"",
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true }, }, 

        23: {
            title: "Stronger variable",
            description: "Extension provide additional multiplier to variable X gain",
            tooltip() {return player.al.extension.gte("1e300")?"Over-tier : "+format(player.al.extension.add(10).log(10).div(30).floor(),0)+" <br> This upgrade's power will be slightly boosted , by an ever-dimishing amount , at "+format(d(10).pow(player.al.extension.add(10).log(10).div(30).floor().add(1).times(30)))+" Extension":"Tier : "+format(player.al.extension.add(10).log(10).div(30).floor(),0)+" <br> This upgrade's power will be boosted at "+format(d(10).pow(player.al.extension.add(10).log(10).div(30).floor().add(1).times(30)))+" Extension"},
            cost: d("1e24"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true },
            effect() {
                let x = player.al.extension.add(10).log(10).min(300).div(30).floor().add(1)
                let y = player.al.extension.add(10).log(10).max(300).div(30).floor().div(10).pow(0.75).add(0.5)
                let pow = d(2)
                pow = pow.times(x).pow(x.add(1).pow(0.2)).times(y)
                let eff = player.al.extension.add(10).slog().pow(pow)
                return eff

            },
            effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id))+"" }, 
        },
        24: {
            title: "Mathmatical operation",
            description: "Unlock Operation",
            cost() {
                let base = d(0)
                if(!player.g.sacrificeactive[3].eq(1)) base = base.add("1e40")
                if(hasUpgrade('r',51)) base = d(0)
                return base
                },
            currencyLocation() { return player.al },
            currencyDisplayName: "Algebric",
            currencyInternalName: "points",
            unlocked() { return true },
        },
        31: {
            title: "Numberic Boost 3",
            description: "4x Number gain",
            cost: d("250"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return !player.r.buyables[121].gte(1) }, 
        },
        32: {
            title: "Passive number",
            description: "You gain +100% of number gain (unaffected by tickspeed)",
            cost: d("500"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return true }, }, 

        33: {
            title: "Stronger Time Exponent",
            description: "Tickspeed exponent is +^0.3 while altered",
            cost: d("1000"),
            tooltip:"Decrease the penality of Altered realm : Tickspeed ^0.2 => Tickspeed ^0.5",
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return true }, 
        },
        34: {
            title: "Extra operation",
            description: "Prestige time boosts Operation gain",
            cost: d("2000"),
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
            description: "Number upgrade 'Headstart' is slightly stronger",
            cost: d("8000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return !player.r.buyables[121].gte(1) }, 
        },
        42: {
            title: "More Effective",
            description: "Number upgrade 'Effective counting' is slightly stronger",
            cost: d("32000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return !player.r.buyables[121].gte(1) }, }, 

        43: {
            title: "More Quickly",
            description: "Number upgrade 'Counting faster' is more effective based on Mastery",
            cost: d("128000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return !player.r.buyables[121].gte(1) }, 
        },
        44: {
            title: "Number QOL",
            description: "The second row of number upgrades cost are ^0.25 and is unlocked instantly",
            cost: d("512000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return !player.r.buyables[121].gte(1) },
        },
        51: {
            title: "Better Conversion",
            description() {return options.hidemastery?"No effect":"Improve Operation to Mastery conversion"},
            cost: d("1e10"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return hasAchievement('ac',75) }, 
        },
        52: {
            title: "Altered Time",
            description: "'Better Tickspeed penality' buyable cost ^0.4",
            cost: d("1e13"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return hasAchievement('ac',75) }, }, 

        53: {
            title: "Lower penality",
            description: "Weaken the Altered realm resource penality",
            cost: d("1e16"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return hasAchievement('ac',75) }, 
        },
        54: {
            title: "Super Divisive",
            description() {
                return hasSuperAchievement('ac',32)?"<s>Divisive effect is drastically improved in Altered realm</s> and ^1.1 max Perk Power":
                "Divisive effect is drastically improved in Altered realm and ^1.1 max Perk Power"},
            cost: d("1e20"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return hasAchievement('ac',75) },
        },
        61: {
            title: "More level",
            description: "Completed achievements increase 'Algebric points boost' buyable max level linearly",
            cost: d("1e15"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Y",
            currencyInternalName: "y",
            unlocked() { return hasAchievement('ac',129) },
            effect() {
                let eff = d(player.ac.achievements.filter(x => x<1000).length).div(4).floor()
                return eff

            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id),0)+"" }, 
        },
        62: {
            title: "Greater unknown",
            description: "Completed achievements affect 'Lower unknown cost' buyable max level linearly'",
            cost: d("1e20"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Y",
            currencyInternalName: "y",
            unlocked() { return hasAchievement('ac',129) },
            effect() {
                let eff = d(player.ac.achievements.filter(x => x<1000).length).div(10).floor()
                return eff

            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id),0)+"" }, 
        },
},
    challenges: {
        11: {
            name: "Altered realm",
            challengeDescription: "" ,
            canComplete: function() {
                return false},
            unlocked() {return !inChallenge('r',11)},
            onEnter() {
                player.r.timer2 = d(0)
                player.al.bank1 = player.r.buyables[101]
                player.al.bank2 = player.r.buyables[102]
                player.al.bank3 = player.r.buyables[103]
                player.al.bank4 = player.r.buyables[104]
                player.r.buyables[101] = d(0)
                player.r.buyables[102] = d(0)
                player.r.buyables[103] = d(0)
                player.r.buyables[104] = d(0)

                let keep = []
                if (hasUpgrade('n',41)) keep.push("buyables")
                if (hasUpgrade('n',41)) keep.push("upgrades")
                layerDataReset('e')
                layerDataReset('d')
                layerDataReset('m')
                layerDataReset('s')
                layerDataReset('a')
                layerDataReset('n',keep)
                player.al.bankedprestigetime = player.r.prestigetime
                player.r.prestigetime = d(0)
                doReset('e',true)
                player.points = getStartPoints()

            },
            onExit() {
                player.r.prestigetime = player.r.prestigetime.add(player.al.bankedprestigetime)
                player.al.bankedprestigetime = d(0)
                player.r.buyables[105] = d(0)
                if(hasAchievement('ac',79)) {
                    player.r.buyables[101] = player.al.bank1
                    player.r.buyables[102] = player.al.bank2
                    player.r.buyables[103] = player.al.bank3
                    player.r.buyables[104] = player.al.bank4
                    player.al.bank1 = d(0)
                    player.al.bank2 = d(0)
                    player.al.bank3 = d(0)
                    player.al.bank4 = d(0)
                    

                }
                options.theme = themes[0]
                changeTheme()
                resizeCanvas()
            },
            style() {
                return {
                     'border-radius': '0%',
                     'color':'lime',
                     'background-color':'black',
                     'border':'4px solid',
                     'height':'250px'
                 }}

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
        "Increaser": {
            buttonStyle() { return { 'color': 'lime' } },
            unlocked() { return true },
            content: [
                ["raw-html", function () { return "<h3>Coefficient purchase multiplier : "+format(tmp.al.buyables[11].multiplier,3)+"x"}, { "color": "lime", "font-size": "22px"}],
                ["raw-html", function () { return "<h3>Variable X purchase multiplier : "+format(tmp.al.buyables[14].multiplier,3)+"x"}, { "color": "lime", "font-size": "22px"}],
                ["blank", "25px"],
                ["row", [["buyable", 11],["buyable", 12],["buyable", 13],["buyable",14]]],
                ["blank", "25px"],
                ["raw-html", function () { return player.al.points.gte("1e500")?"<h3>All algebric buyable costs scale faster at "+f(d("e500"))+" Algebric":""}, { "color": "red", "font-size": "22px"}],
                ["raw-html", function () { return hasAchievement('ac',124)?"<h3>y = "+format(player.al.y)+" (+"+format(player.al.deltay)+"/s) , translated to "+format(player.al.purchasemultiplier,4)+"x bigger Coefficients and Variable X purchase multiplier":""}, { "color": "lime", "font-size": "22px"}],
                ["blank","25px"],
                ["row", [["buyable", 16],["buyable" , 17]]],
    ]

        },
        "Current value": {
            buttonStyle() { return { 'color': 'lime' } },
            unlocked() { return true }, 
            content:[
            ["raw-html", function () { return "<h3>x = "+format(player.al.x1)+" (+"+format(player.al.deltax)+"/s)"}, { "color": "green", "font-size": "22px"}],
            ["raw-html", function () { return hasAchievement('ac',124)?"<h3>y = "+format(player.al.y)+" (+"+format(player.al.deltay)+"/s)":""}, { "color": "lime", "font-size": "22px"}],
            ["raw-html", function () { return "<h3>a = "+format(player.al.a1)+"" }, { "color": "yellow", "font-size": "22px"}],
            ["raw-html", function () { return "<h3>b = "+format(player.al.b1)+" " }, { "color": "orange", "font-size": "22px"}],
            ["raw-html", function () { return "<h3>c = "+format(player.al.c1)+" " }, { "color": "red", "font-size": "22px"}],
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
                ["raw-html", function () { return "<h3>You have  " + format(player.al.extension)+" Extension" }, { "color": "orange", "font-size": "22px"}],
                ["raw-html", function () { return "<h3>You will gain +" + format(player.al.extensiongain)+" Extension on reset" }, { "color": "yellow", "font-size": "22px"}],
                ["raw-html", function () { return "<h3><i> Base Extension gain is capped at "+format(d("1e10"))+"" }, { "color": "white", "font-size": "18px"}],
                ["raw-html", function () { return "<h3>Extension boost Algebric and variable gain by " + format(player.al.extensionboost)+ "x" }, { "color": "lime", "font-size": "22px"}],
                ["blank", "25px"],
                ["row", [["buyable", 15]]],
                ["blank", "25px"],
                ["row", [["buyable", 21],["buyable", 22],["buyable", 23],["buyable",24]]],
                ["blank", "25px"],
                ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade",24],["upgrade",62]]],
            ]
            
        },
        "Operation" : {
            buttonStyle() { return { 'color': 'lime' , "border-color" : "orange" } },
            unlocked() { return hasUpgrade('al',24) },
            content: [
                ["raw-html", function () { return "<h3>Altered realm effect :" }, { "color": "red", "font-size": "22px"}],
                ["raw-html", function () { return "<h3>Tickspeed^"+format(player.al.tickspeedreduction1)+" and /"+format(player.al.tickspeedreduction2)+" " }, { "color": "red", "font-size": "22px"}],
                ["raw-html", function () { return "<h3>Pre-Research resource gain and cost reduction are ^"+format(player.al.alteredpow)+"" }, { "color": "red", "font-size": "22px"}],
                ["raw-html", function () { return "<h3><i> Points gain is not included in this" }, { "color": "white", "font-size": "18px"}],
                ["raw-html", function () { return "<h3><i> After entry , Game is temporarily paused for 1s" }, { "color": "white", "font-size": "18px"}],
                ["blank" , "25px"],
                ["row", [["challenge", 11]]],
                ["blank", "25px"],
                ["raw-html", function () { 
                    let a = options.hidemastery?"based on resources":"based on Mastery inside Altered realm"
                    return "<h3>You have "+format(player.al.operation)+" Operation (+"+format(player.al.operationgain)+"/s) <br> Operation gain is "+a+"" }, { "color": "lime", "font-size": "22px"}],
                ["raw-html", function () { return "<h3>Base Extension gain is raised ^"+format((player.al.operationeffect.div(100)),4)+" above the cap" }, { "color": "pink", "font-size": "22px"}],
                ["blank", "25px"],
                ["row", [["buyable", 31],["buyable", 32],["buyable", 33],["buyable",34]]],
                ["row", [["buyable", 51],["buyable", 52]]],
                ["blank", "25px"],
                ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33],["upgrade",34]]],
                ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43],["upgrade",44]]],
                ["blank","25px"],
                ["row", [["upgrade", 51],["upgrade", 52],["upgrade", 53],["upgrade",54],["upgrade",61]]],
            ]

        },
}},
tabFormat: [
    ["raw-html", function () { return "<h3>You have  " + format(player.al.points)+" Algebric (+"+format(player.al.pointsgainal)+"/s)" }, { "color": "lime", "font-size": "22px"}],
    ["raw-html", function () { return "<h3>Function f(x) = " + format(player.al.value)+"" }, { "color": "lime", "font-size": "22px"}],
    ["raw-html", function () { return shiftDown?"<h3><i> f(x) = ax² + bx + c":""}, { "color": "white", "font-size": "18px"}],
    ["raw-html", function () { return "<h3>x = " + format(player.al.x)+ "" }, { "color": "lime", "font-size": "22px"}],

    ["microtabs", "stuff", { 'border-width': '0px' }],
],
layerShown() { return player.r.algebraf.gte(1) && !inChallenge('c',11) },
deactivated() {return inChallenge('c',11)},

}) 

addLayer("c", {
    startData() { return {
        unlocked: true, 
        stage: d(1),
    }},
    color: "#671c4d",                      
    row: 5,
    branches: ['r'],                              
    tooltip() {return "Cursed realm <br>"},
    ttStyle() {
        return {
            "color":"#984e7e",
            "width":"200px",
            "border":"2px solid",
            "border-color":"#c81e7a",
        }
    },
    type: "none",
    automate() {

    },
    update(delta) {

    },  

    milestones: {
        
    },
    buyables: {
       
    },
    upgrades: {
       
    },
    clickables: {
      11: {
            title() { return inChallenge('c',11)?"Leave cursed realm":"Explore cursed realm" },
            canClick() {return true},
            unlocked() { return hasAchievement('ac',169)},
            onClick() {
               if(!inChallenge('c',11)) { 
                    startChallenge('c',11) 
                    return
                } else {
                    completeChallenge('c',11)
                    return
                }
               
            },
            style() {   
            return Qcolor('brown',100)
        },
     },
    },
    challenges: {
        11: {
            name: "Cursed realm",
            challengeDescription: "" ,
            canComplete: function() {
                return true
            },
            unlocked() {return !inChallenge('c',11)},
            onEnter() {
                player.e.points = d(0)
                player.r.points = d(0)
                player.subtabs.r.stuff = "Mastery breakdown"
                player.subtabs.g.main = "Graduate"
                player.subtabs.o.calc72 = "Cursed Multiplier"
                player.r.metaresearch = d(0)
                player.r.tetration = d(0)
                player.g.timer2 = d(0)
                player.al.resetcooldown = d("1e100")
                player.al.points = d(0)
            },
            onExit() {
                player.al.resetcooldown = d(0)
                player.subtabs.o.calc72 = "Multiplier"
            },

        },
    },
    microtabs: {
        main: {
            "Main": {
            buttonStyle() { return { 'color': 'purple' } },
            unlocked() { return true},
            content:  [
            ["microtabs", "curses", { 'border-width': '0px' }],
            ]
        },
        },
        curses : {
            ".": {
                buttonStyle() { return { 'color': 'red' , "border-color" : "red" } },
                unlocked() { return false },
                content: [
                    ["raw-html", function () { return "<h3> You cannot enter this Realm yet" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
                ]      
            },
            "Cursed realm": {
                buttonStyle() { return { 'color': 'red' , "border-color" : "red" } },
                unlocked() { return hasAchievement('ac',169) && options.dev},
                content: [
                    ["raw-html", function () { return "<h3> Cursed realm : Stage "+format(player[this.layer].stage,0)+" " }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () {
                        let a = "" 
                        let stage = player[this.layer].stage
                        if(stage.eq(1)) a = "The Blighted Forest"
                        if(stage.eq(2)) a = "The Haunted Village"
                        if(stage.eq(3)) a = "The Shadowed Caverns"
                        if(stage.eq(4)) a = "The Desolate Wasteland"
                        if(stage.eq(5)) a = "The Burning Peak"
                        if(stage.eq(6)) a = "The Cursed Core" 
                        if(stage.eq(7)) a = "The Hidden Portal"
                        return "<h3> - "+a+" -" 
                    }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () {
                        let a = "" 
                        let stage = player[this.layer].stage
                        if(stage.eq(1)) a = "A dense forest with boundless resource , with basic resource somewhat accessable"
                        if(stage.eq(2)) a = "A cursed village , haunted by creatures of the realm"
                        if(stage.eq(3)) a = "..."
                        if(stage.eq(4)) a = "..."
                        if(stage.eq(5)) a = "..."
                        if(stage.eq(6)) a = "..." 
                        return "<h3> - "+a+" -" 
                    }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
                    ["blank" , "50px"],
                    ["raw-html", function () { return "<h3> While inside Cursed realm" }, { "color": "brown", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3> Deactivate most resource that aren't disabled by Herbivore sacrifice" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3> Tickspeed is disabled" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3> Gamespeed can only be altered from Heat and Offline time" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3> Want to enter? click here and you will be transported shortly" }, { "color": "brown", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3> Hotkeys are extremely useful inside Cursed realm" }, { "color": "gray", "font-size": "22px", "font-family": "helvetica" }],
                    ["blank" , "50px"],
                    ["row" , [["clickable",11]]],
                ]      
            },
        },
    },
       
        tabFormat: [
            ["microtabs", "main", { 'border-width': '0px' }],
        ],
    layerShown() { return player.g.sacrificeactive[4].gte(1)}


})