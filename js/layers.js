//global

function getPointCondensereffect_MUL() {
    //1
    let eff10 = new Decimal(2)
    if(hasUpgrade('al',43)) eff10 = eff10.pow(player.r.mastery.min(10000).add(2))
    let eff11 = softcap(eff10,new Decimal("1e6"),0.04)
    let eff12 = softcap(eff11,new Decimal("1e100"),0.2)
    //2
    let eff20 = player.s.points.add(2).pow(0.5)
    if (hasUpgrade('al',41)) eff20 = eff20.pow(1.25)
    if (hasUpgrade('s', 32)) eff20 = eff20.times(new Decimal(2).add(player.s.points.min(1500).times(0.1)))
    let eff21 = softcap(eff20,new Decimal("1e100"),0.1)
    //3
    let eff30 = player.points.add(11).log(10)
    if (hasUpgrade('al',42)) eff30 = eff30.pow(5)
    if (hasUpgrade('s', 32)) eff30 = eff30.times(new Decimal(2).add(player.s.points.min(1500).times(0.1)))
    //4
    let eff40 = tmp.a.effect.pow(player.a.points.add(1))
    let eff41 = softcap(eff40,new Decimal("1e600"),0.1)
    //
    let product1 = eff12.times(eff21).times(eff30)
    if(player.r.tetration.gte(9)) product1 = product1.pow(0)    
    let product = product1.times(6).times(eff41)
    return product
}
function getPointCondensereffect_POW() {
      //1
      let eff10 = new Decimal(2)
      if(hasUpgrade('al',43)) eff10 = eff10.pow(player.r.mastery.min(10000).add(2))
      let eff11 = softcap(eff10,new Decimal("1e6"),0.04)
      let eff12 = softcap(eff11,new Decimal("1e100"),0.2)
      if(player.r.tetration.gte(9)) eff12 = eff12.add(10).slog().div(20).add(1)
      //2
      let eff20 = player.s.points.add(2).pow(0.5)
      if (hasUpgrade('al',41)) eff20 = eff20.pow(1.25)
      if (hasUpgrade('s', 32)) eff20 = eff20.times(new Decimal(2).add(player.s.points.min(1500).times(0.1)))
      let eff21 = softcap(eff20,new Decimal("1e100"),0.1)
      if(player.r.tetration.gte(9)) eff21 = eff21.add(10).slog().div(20).add(1)
      //3
      let eff30 = player.points.add(11).log(10)
      if (hasUpgrade('al',42)) eff30 = eff30.pow(5)
      if (hasUpgrade('s', 32)) eff30 = eff30.times(new Decimal(2).add(player.s.points.min(1500).times(0.1)))
      if(player.r.tetration.gte(9)) eff30 = eff30.add(10).slog().div(20).add(1)    
      
      let product = eff12.times(eff21).times(eff30)
      if(player.r.tetration.lt(9)) product = product.pow(0)
      return product.times(1.05)
}   
function getNumberCondensereffect_MUL() {
    //1
    let eff1 = player.points.add(10).log(10).pow(0.75).times(1.5)
    //2
    let eff2 =  player.a.points.add(3).pow(new Decimal(0.5).times(buyableEffect('e',32)))
    //3
    let eff3 =  player.e.perkpower.add(1).pow(10)
    //4
    let eff4 = (player.s.points.add(2)).pow( new Decimal(1.11).times(buyableEffect('e',31)))

    let product = eff1.times(eff2).times(eff3).times(eff4).times(13.5)
    return product
}


//start layer
addLayer("o", {
    startData() { return {         
        //general         
        unlocked: true,
        time: new Decimal(0),
        realtime: new Decimal(0),
        gamespeed: new Decimal(1),
        gsupkeep:new Decimal(1),
        gsbase: new Decimal(1),
        gscost: new Decimal(1),
        rerolltime: new Decimal(0),
        hourwarp: [0,0,0],
        tenminutewarp: [0,0,0],
        minutewarp: [0,0,0],
        cost: [new Decimal(0),new Decimal(0),new Decimal(0)],
        basecost: [new Decimal(0),new Decimal(0),new Decimal(0)],
    }},
    infoboxes: {
    },
    symbol:"O",
    color: "#FF00FF",                       // The color for this layer, which affects many elements.
    tooltip() {return "- "+formatTime(player.o.time)+" Offline time </br> - "+formatTime(player.o.realtime)+" Real time"},
    row: "side",                           
    type: "none",                         // Determines the formula used for calculating prestige currency.

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    automate() {
        let cost1 = player.o.gsbase.sub(1).times(10).div(9).min(10).times(100).floor().div(100)
        let cost2 = player.o.gsbase.sub(10).max(0)
        let cost = cost1.add(cost2)

        if(player.o.gsbase.gt(10)) cost = cost.div(10).pow(1.5).times(1000).ceil().div(100)
        if(player.o.gsbase.gt(25)) cost = cost.div(39.53).pow(2).times(3953).ceil().div(100)
        if(player.o.gsbase.gt(50)) cost = cost.div(319.2).pow(3).times(31920).ceil().div(100)
        if(player.o.gsbase.gt(100)) cost = cost.div(158897.72).pow(new Decimal(1).add(player.o.gsbase.div(25))).times(15889572).ceil().div(100)

        player.o.gscost = cost

        player.o.gsupkeep = player.o.realtime.div(player.o.gscost.max(1))

        if(player.o.gsupkeep.lt(10)) {
            buyBuyable('o',24)
        }
    },
    update(delta) {
        if(!player.o.gamespeed.eq(1)) {
            player.o.realtime = player.o.realtime.sub(player.o.gscost.times(delta))
        }
        player.o.rerolltime = player.o.rerolltime.sub(new Decimal(1).times(delta))
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    buyables: {
        11: {
            title() {
             return +getBuyableAmount(this.layer, this.id) + "<br/> Offline Effectiveness"
            } ,
            cost(x) { 
                let cost = x.add(1).pow(1.5).times(60)
                return cost.floor()},
            display() { return "Improve offline time to Real time conversion from 1s to 0.25s =>  1s to " + format(this.effect()) +"s (+0.01s per upgrade) </br> Cost : " + formatTime(this.cost()) + " Offline Time" },
            canAfford() { return player[this.layer].time.gte(this.cost()) },
            buyMax() {return true},
            buy() {
                player.o.time = player.o.time.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let effect = x.div(100).add(0.25)
                return effect
            },
            purchaseLimit() {
                let a = new Decimal(25)
                return a
            },
            style() {
                if (player.o.buyables[11].gte(this.purchaseLimit())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'100px'
				} 
				else if (player.o.time.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}
        }
    },
    12: {
        title() {
         return "Convert Offline time to Real time"
        } ,
        cost(x) { 
            let cost = x.add(1).pow(1.5).times(60)
            return cost.floor()},
        display() { return "Convert all of your offline time to real time . Require at least 10 seconds of offline time" },
        canAfford() { return player[this.layer].time.gte(10) },
        buy() {
            player.o.realtime = player.o.realtime.add(player.o.time.times(buyableEffect('o',11)))
            player.o.time = new Decimal(0)
        },
        tooltip() {
            let a = player.o.time.times(buyableEffect('o',11))
            return "You will gain "+formatTime(a)+" real time"
        },
        style() {
          return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'aqua',
                'border':'2px solid',
                'height':'100px'
            }
    }
},
  13: {
            title() {
             return +getBuyableAmount(this.layer, this.id) + "<br/> More Offline time"
            } ,
            cost(x) { 
                let cost = x.add(1).pow(1.2).times(60)
                return cost.floor()},
            display() { return "Increase max offline time by 10 additional minutes , Current : +"+formatTime(this.effect())+" extra offline time </br> Cost : " + formatTime(this.cost()) + " Offline Time" },
            canAfford() { return player[this.layer].time.gte(this.cost()) },
            buyMax() {return true},
            buy() {
                player.o.time = player.o.time.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let effect = x.times(600)
                return effect
            },
            purchaseLimit() {
                let a = new Decimal(500)
                return a
            },
            style() {
                if (player.o.buyables[13].gte(this.purchaseLimit())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'100px'
				} 
				else if (player.o.time.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}
        }
    },
21: {
    title() {
        return "+1 Gamespeed factor"
       } ,
    cost(x) { 
        return new Decimal(0)},
    canAfford() { return player.o.gamespeed.eq(1)},
    buy() {
       player.o.gsbase = player.o.gsbase.add(1)

    },
    style() {
        if (player.o.gamespeed.gt(1)) {
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'black',
                'border':'2px solid',
                'height':'125px'
            } 
        }
         else return {
            'border-radius': '0%',
            'color':'white',
            'background-color':'green',
            'border':'2px solid',
            'height':'125px'
        }}
},
22: {
    title() {
        return "-1 Gamespeed factor"
       } ,
    cost(x) { 
        return new Decimal(0) },
    canAfford() { return player.o.gamespeed.eq(1) && player.o.gsbase.gt(1)},
    buy() {
        player.o.gsbase = player.o.gsbase.sub(1)
    },
    style() {
        if (player.o.gamespeed.gt(1) || player.o.gsbase.eq(1)) {
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'black',
                'border':'2px solid',
                'height':'125px'
            } 
        }
        else return {
           'border-radius': '0%',
           'color':'white',
           'background-color':'red',
           'border':'2px solid',
           'height':'125px'
       }}
},
23: {
    title() {
        return "Activate Gamespeed (Current : "+format(player.o.gamespeed,0)+"x)"
       } ,
    cost(x) { 
        return new Decimal(0)},
    canAfford() { return player.o.gsbase.gte(1) && player.o.gamespeed.eq(1) && !player.o.gsbase.eq(1) && player.o.gsupkeep.gte(10)},
    buy() {
       player.o.gamespeed = player.o.gsbase

    },
    style() {
        if (!player.o.gamespeed.eq(1) || player.o.gsbase.eq(1) || player.o.gsupkeep.lt(10)) {
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'black',
                'border':'2px solid',
                'height':'125px'
            } 
        }
        else return {
           'border-radius': '0%',
           'color':'white',
           'background-color':'green',
           'border':'2px solid',
           'height':'125px'
       }}
},
24: {
    title() {
        return "Deactivate Gamespeed"
       } ,
    cost(x) { 
        return new Decimal(0) },
    canAfford() { return player.o.gsbase.gte(1) && !player.o.gamespeed.eq(1)},
    buy() {
        player.o.gamespeed = new Decimal(1)
    },
    style() {
        if (player.o.gamespeed.eq(1)) {
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'black',
                'border':'2px solid',
                'height':'125px'
            } 
        }
        else return {
           'border-radius': '0%',
           'color':'white',
           'background-color':'red',
           'border':'2px solid',
           'height':'125px'
       }}

},
31: {
    title() {
     return +getBuyableAmount(this.layer, this.id) + " free </br> 1 minute warp"
    } ,
    display() { return "Grant 60s worth of normal production instantly" },
    canAfford() { return (player[this.layer].realtime.gte(60) || player.o.buyables[31].gt(0)) && player.o.gamespeed.eq(1) },
    buy() {
        if(player.o.buyables[31].eq(0)) player.o.realtime = player.o.realtime.sub(60)
        if(player.o.buyables[31].gt(0)) player.o.buyables[31] = player.o.buyables[31].sub(1)
        player.o.rerolltime = player.o.rerolltime.add(60)
        gameLoop(60)
    },
    style() {
        if (!player.o.gamespeed.eq(1) || (player.o.realtime.lt(60) && player.o.buyables[31].eq(0))) {
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'red',
                'border':'2px solid',
                'height':'125px'
            } 
        }    else return {
            'border-radius': '0%',
            'color':'white',
            'background-color':'green',
            'border':'2px solid',
            'height':'125px'
        }
}
},
32: {
    title() {
     return +getBuyableAmount(this.layer, this.id) + " free </br> 10 minutes warp"
    } ,
    display() { return "Grant 600s (10 minutes) worth of normal production instantly" },
    canAfford() { return (player[this.layer].realtime.gte(600) || player.o.buyables[32].gt(0)) && player.o.gamespeed.eq(1) },
    buy() {
         if(player.o.buyables[32].eq(0)) player.o.realtime = player.o.realtime.sub(600)
        if(player.o.buyables[32].gt(0)) player.o.buyables[32] = player.o.buyables[32].sub(1)
        player.o.rerolltime = player.o.rerolltime.add(600)
        gameLoop(600)
    },
    style() {
        if (!player.o.gamespeed.eq(1) || (player.o.realtime.lt(600) && !player.o.buyables[32].gt(0))) {
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'red',
                'border':'2px solid',
                'height':'125px'
            } 
        }    else return {
            'border-radius': '0%',
            'color':'white',
            'background-color':'green',
            'border':'2px solid',
            'height':'125px'
        }
}
},
33: {
    title() {
     return +getBuyableAmount(this.layer, this.id) + " free </br> 1 hour warp"
    } ,
    display() { return "Grant 3600s (1h) worth of normal production instantly" },
    canAfford() { return (player[this.layer].realtime.gte(3600) || player.o.buyables[33].gt(0) )&& player.o.gamespeed.eq(1) },
    buy() {
         if(player.o.buyables[33].eq(0)) player.o.realtime = player.o.realtime.sub(3600)
        if(player.o.buyables[33].gt(0)) player.o.buyables[33] = player.o.buyables[33].sub(1)
        player.o.rerolltime = player.o.rerolltime.add(3600)
        gameLoop(3600)
    },
    style() {
        if (!player.o.gamespeed.eq(1) || (player.o.realtime.lt(3600) && !player.o.buyables[33].gt(0))) {
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'red',
                'border':'2px solid',
                'height':'125px'
            } 
        }    else return {
            'border-radius': '0%',
            'color':'white',
            'background-color':'green',
            'border':'2px solid',
            'height':'125px'
        }
}
},
34: {
    title() {
     return "FULL WARP"
    } ,
    display() { return "Consuming all of your real time to warp time . Require 10 seconds" },
    canAfford() { return player[this.layer].realtime.gte(10) && player.o.gamespeed.eq(1) },
    tooltip() {
        let a = player.o.realtime
        let b = softcap(a,new Decimal(3600),0.97) //1h 
        let c = softcap(b,new Decimal(86400),0.94) //1d
        let d = softcap(c,new Decimal(604800),0.91) //1w
        let e = softcap(d,new Decimal(2592000),0.88) //1mo
        let f = softcap(e,new Decimal(31536000),0.85) //1y
        return "Consume "+formatTime(player.o.realtime)+" real time to advance time by "+formatTime(f)+""
    },
    buy() {
        if (!confirm("This will consume ALL of your real time , there is no going back.")) return
        let a = player.o.realtime
        let b = softcap(a,new Decimal(3600),0.97) //1h 
        let c = softcap(b,new Decimal(86400),0.94) //1d
        let d = softcap(c,new Decimal(604800),0.91) //1w
        let e = softcap(d,new Decimal(2592000),0.88) //1mo
        let f = softcap(e,new Decimal(31536000),0.85) //1y
        let g = f
        gameLoop(g)
        player.o.realtime = player.o.realtime.times(0)
    },
    style() {
        return {
            'border-radius': '0%',
            'color':'white',
            'background-color':'purple',
            'border':'2px solid',
            'height':'100px'
        }
}
},
35: {
    title() {
     return "ALL 'BOUGHT' WARP"
    } ,
    display() { return "Consuming all of your unused warp to advanced time (no penality)" },
    canAfford() { return player.o.gamespeed.eq(1) },
    tooltip() {
        let a = player.o.buyables[31].times(60)
        let b = player.o.buyables[32].times(600)
        let c = player.o.buyables[33].times(3600)
    
        let f = a.add(b).add(c)
        return "Consume all unused warp to advance time by "+formatTime(f)+""
    },
    buy() {
        if (!confirm("This will consume ALL of your unused warp , there is no going back.")) return
        let a = player.o.buyables[31].times(60)
        let b = player.o.buyables[32].times(600)
        let c = player.o.buyables[33].times(3600)
    
        let f = a.add(b).add(c)
        gameLoop(f)
        player.o.buyables[31] = player.o.buyables[31].times(0)
        player.o.buyables[32] = player.o.buyables[32].times(0)
        player.o.buyables[33] = player.o.buyables[33].times(0)

    },
    style() {
        return {
            'border-radius': '0%',
            'color':'white',
            'background-color':'purple',
            'border':'2px solid',
            'height':'100px'
        }
}
},
41: {
    title() {
     return "Reroll warp bundle"
    } ,
    display() { return "" },
    canAfford() { return player[this.layer].rerolltime.lte(0) },
    buy() {
       player.o.rerolltime = player.o.rerolltime.times(0).add(60)
       player.o.hourwarp[0] = new Decimal(0)
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
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'black',
                'border':'2px solid',
                'height':'125px'
            } 
        }    else return {
            'border-radius': '0%',
            'color':'white',
            'background-color':'green',
            'border':'2px solid',
            'height':'125px'
        }
}
},
42: {
    title() {
     return "Small bundle"
    } ,
    display() { return "For "+formatTime(player.o.cost[0])+" real time , you will recieve "+format(player.o.tenminutewarp[0],0)+"x 10 minutes warp and "+format(player.o.minutewarp[0],0)+"x 1 minute warp" },
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
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'black',
                'border':'2px solid',
                'height':'125px'
            } 
        }    else return {
            'border-radius': '0%',
            'color':'white',
            'background-color':'green',
            'border':'2px solid',
            'height':'125px'
        }
}
},
43: {
    title() {
     return "Medium bundle"
    } ,
    display() { return "For "+formatTime(player.o.cost[1])+" real time , you will recieve "+format(player.o.hourwarp[1],0)+"x 1 hour warp, "+format(player.o.tenminutewarp[1],0)+"x 10 minutes warp and "+format(player.o.minutewarp[1],0)+"x 1 minute warp" },
    canAfford() { return player.o.realtime.gte(player.o.cost[1]) },
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
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'black',
                'border':'2px solid',
                'height':'125px'
            } 
        }    else return {
            'border-radius': '0%',
            'color':'white',
            'background-color':'green',
            'border':'2px solid',
            'height':'125px'
        }
}
},
44: {
    title() {
     return "Large bundle"
    } ,
    display() { return "For "+formatTime(player.o.cost[2])+" real time , you will recieve "+format(player.o.hourwarp[2],0)+"x 1 hour warp, "+format(player.o.tenminutewarp[2],0)+"x 10 minutes warp and "+format(player.o.minutewarp[2],0)+"x 1 minute warp" },
    canAfford() { return player.o.realtime.gte(player.o.cost[2]) },
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
            return {
                'border-radius': '0%',
                'color':'white',
                'background-color':'black',
                'border':'2px solid',
                'height':'125px'
            } 
        }    else return {
            'border-radius': '0%',
            'color':'white',
            'background-color':'green',
            'border':'2px solid',
            'height':'125px'
        }
}
},
    },
    microtabs: {
        stuff: {
            "Main": {
                buttonStyle() { return { 'color': 'purple' } },
                unlocked() { return true },
                content:  [
            ["microtabs", "upgrade", { 'border-width': '0px' }],
        ]
    
            },
            "Time Speedup": {
                buttonStyle() {return {'color':'white'}},
                content :     [
                    ["raw-html", function () { return "<h3>You cannot time warp during time speedup" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                    ["microtabs", "speed", { 'border-width': '0px' }],
    
            ]},
            "Time Warp": {
                buttonStyle() { return { 'color': 'white'} },
                content:
                
                    [
             ["raw-html", function () { return "<h3>Time Warp give you production instantly , cannot stack with time speedup" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],

            ["microtabs", "warp", { 'border-width': '0px' }],
        ]
    
            },
        },
        upgrade: {
            "Efficiency": {
                buttonStyle() { return { 'color': 'lime' } },
                unlocked() { return true }, 
                content:[
                    ["blank", "50px"],
                    ["row", [["buyable",11]]],  
                    ["blank", "50px"],
                    ["row", [["buyable",12]]],


                ]
            },
            "More offline time": {
                buttonStyle() { return { 'color': 'lime' } },
                unlocked() { return true }, 
                content:[
                    ["blank", "50px"],
                    ["row", [["buyable",13]]],  
                ]
            },},
        speed: {
            "Main": {
                buttonStyle() { return { 'color': 'red' , "border-color" : "orange" } },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return "<h3>Multiply Gamespeed by "+format(player.o.gsbase,0)+"x , which boost most resource gained (apply after exponent , etc) at a cost of "+formatTime(player.o.gscost)+" real time per second (You can upkeep this for "+formatTime(player.o.gsupkeep)+")" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
                    ["blank", "50px"],
                    ["row", [["buyable",21], ["buyable",22]]],
                    ["blank", "25px"],
                    ["row", [["buyable",23], ["buyable",24]]]

                ]
    
                    
            },
    },
    warp: {
        "Small Warp": {
            buttonStyle() { return { 'color': 'green' , "border-color" : "green" } },
            unlocked() { return true },
            content: [
                ["blank", "50px"],
                ["row", [["buyable",31],["buyable",32],["buyable",33]]],

            ]

                
        },
        "Full Warp" : {
            buttonStyle() { return { 'color': 'lime' , "border-color" : "green" } },
            unlocked() { return true },
            content: [
                ["raw-html", function () { return "<h3>This will consume all of your Real Time " }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                ["blank", "50px"],
                ["row", [["buyable",34],["buyable",35]]],

            ]
            
        },
        "Warp bundle": {
            buttonStyle() { return { 'color': 'green' , "border-color" : "green" } },
            unlocked() { return true },
            content: [
                ["raw-html", function () { return "<h3> Buying warp bundles are cheaper than buying them manually , up to 20% discount" }, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3> All Warp bundle can only be bought once and is restored whenever you reroll warp bundle" }, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3> Reset cooldown : "+formatTime(player.o.rerolltime.max(0))+" (REAL TIME)" }, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["row",[["buyable",41]]],
                ["blank", "50px"],
                ["row", [["buyable",42],["buyable",43],["buyable",44]]],

            ]

                
        },

       
}

},
    tabFormat: [
        ["raw-html", function () { return "<h3>You have "+formatTime(player.o.time)+" offline time" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>You have "+formatTime(player.o.realtime)+" real time" }, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
        ["blank","25px"],
        ["raw-html", function () { return "<h3>You gain 1s of Offline time every second you're offline , up to "+formatTime(Decimal.add(86400,buyableEffect('o',13)))+"" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
        ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
}),
addLayer("ac", {
    startData() { return {         
        //general         
        unlocked: true,
    }},
    infoboxes: {
    },
    symbol:"AC",
    color: "#FFFF00",                       // The color for this layer, which affects many elements.
    tooltip:"Achievement",
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
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
            buyBuyable('m',11)
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
        },
        12: {
            name: "1,2,3,4 and ?",
            done() { return player.n.points.gte("5") },
            tooltip: "Goal : Get 5 Number .",
        },
        13: {
            name: "Twenty five",
            done() { return player.n.points.gte("25") },
            tooltip: "Goal : Get 25 Number .",
        },
        14: {
            name: "Not Addition",
            done() { return player.a.points.gte("1") },
            tooltip: "Goal : Get 1 Additive .",
        },
        15: {
            name: "Not Subtraction",
            done() { return player.s.points.gte("1") },
            tooltip: "Goal : Get 1 Subtractive . ",
        },
        16: {
            name: "3 of additive",
            done() { return player.a.points.gte("3") },
            tooltip: "Goal : Get 3 Additive . ",
        },
        17: {
            name: "3 of minus",
            done() { return player.s.points.gte("3") },
            tooltip: "Goal : Get 3 Subtractive . ",
        },
        18: {
            name: "Equality",
            done() { return player.a.points.eq("5") && player.s.points.eq("5") },
            tooltip: "Goal : Have exactly 5 Subtractive and 5 Additive . Reward : Number gained x1.1 ",
        },
        19: {
            name: "What's Mastery",
            done() { return player.r.bestmastery.gte("10") },
            tooltip() {return "Goal : Reach 10 Mastery . Reward : Multipliy Point gained by 2"},
        },
        21: {
            name: "Subtractive lord",
            done() { return player.s.points.gte("8") },
            tooltip: "Goal : Get 8 Subtractive . Reward : Additive cost /2 ",
        },
        22: {
            name: "Additive legend",
            done() { return player.a.points.gte("10") },
            tooltip: "Goal : Get 10 Additive .",
        },
        23: {
            name: "1 million",
            done() { return player.n.points.gte("1e6") },
            tooltip: "Goal : Get 1e6 Number .",
        },
        24: {
            name: "Nice number!",
            done() { return player.n.points.gte("6.9e7") },
            tooltip: "Goal : Get 6.9e7 Number . Reward : Subtractive cost /10",
        },
        25: {
            name: "Multipling",
            done() { return player.m.points.gte("1") },
            tooltip: "Goal : Get 1 Multiplicative . Reward : Number gained x1.1",
        },
        26: {
            name: "Fifth Doubling",
            done() { return player.m.points.gte("32") },
            tooltip: "Goal : Get 32 Multiplicative . Reward : Multiplicative gained x1.1",
        },
        27: {
            name: "Tenth Doubling",
            done() { return player.m.points.gte("1024") },
            tooltip: "Goal : Get 1 024 Multiplicative . ",
        },
        28: {
            name: "+30 would be insane",
            done() { return player.a.points.gte("25") },
            tooltip: "Goal : Have 30 Additive ",
        },
        29: {
            name: "Division!",
            done() { return player.d.points.gte("1") },
            tooltip() {return "Goal : Get 1 Divisive . Reward : Multiply tickspeed by 1.15 , which increase Row1 and Row2 passive production and points gained"},
        },
        31: {
            name: "A lot of Multiplicative",
            done() { return player.m.points.gte("40000") },
            tooltip: "Goal : Reach 40 000 Multiplicative . Reward : Additive cost /5",
        },
        32: {
            name: "A lot of Divisive!",
            done() { return player.d.points.gte("1e20") },
            tooltip: "Goal : Get 1e20 Divisive . Reward : x2 Number gained",

        },
        33: {
            name: "Actually Multiplin'",
            done() { return player.m.points.gte("1e25") },
            tooltip: "Goal : Get 1e25 Multiplicative .",
        },
        34: {
            name: "EXPONENTATION!",
            done() { return player.e.points.gte("1") },
            tooltip: "Goal : Reach 1 Exponent . Reward : Automaticly buy the first row of Number upgrade",
        },
        35: {
            name: "MAXED?",
            done() { return player.m.buyables[11].gte("100") },
            tooltip: "Goal : Buy 100 level of 'Point Boost' (x) buyable . Reward : Extend the level limit of 'Point Boost' by 2x ",

        },
        36: {
            name: "More like Google",
            done() { return player.points.gte("1e100") },
            tooltip: "Goal : Have 1e100 Points . Reward : Automaticly buy 'Point Boost' buyable for free",
        },
        37: {
            name: "Third one",
            done() { return player.e.points.gte("3") },
            tooltip: "Goal : Reach 3 Exponent . Reward : x2 Divisive gained ",
        },
        38: {
            name: "Literally Eight Exponent",
            done() { return player.e.points.gte("8") },
            tooltip: "Goal : Have 8 Exponent ",
        },
        39: {
            name: "Researcher",
            done() { return player.r.points.gte("1") },
            tooltip() {return "Goal : Have 1 Research . Reward : Tickspeed x2"},
        },
        41: {
            name: "Not tired at all",
            done() { return player.points.gte("1e90") && inChallenge('m',11) },
            tooltip() {return "Reach 1e90 Points in  (x) challenge 'Fatigue' . Reward : 'Fatigue' Challenge reward ^"+format(this.effect())+" (based on Multiplicative)"},
            effect() {
                let a = player.m.points.add(10).slog()
                return a.pow(1.5)
            },
        },
        42: {
            name: "Not even halted",
            done() { return player.n.points.gte("1e9") && player.points.lt("1e20") && inChallenge('m',12) },
            tooltip() {return "Complete (x) challenge 'Halted Counter' while having less than 1e20 Points  . Reward : 'Halted Counter' Challenge reward ^"+format(this.effect())+" (based on Multiplicative)"},
            effect() {
                let a = player.m.points.add(10).slog()
                return a.pow(2)
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
            name: "Hopeful Master",
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
            done() { return   player.points.floor().eq(player.n.points.floor()) && inChallenge('e',11)},
            tooltip() {return "Get Number amount EXACTLY equal to Point amount while in Equality (^) challenge . Reward : Number to Mastery formula is better"},

        },
        53: {
            name: "Real Equality",
            done() { return   player.m.points.floor().eq(player.d.points.floor()) && player.m.points.gte(1) && player.d.points.gte(1) && inChallenge('e',11)},
            tooltip() {return "Get Multiplicative amount EXACTLY equal to Divisive amount while both of them is above 1 inside Equality (^) challenge. Reward : Multiplicative to Mastery formula is better"},

        },
        54: {
            name: "Postivity",
            done() { return   player.a.points.gte(444)},
            tooltip() {return "Get 444 Additive . Reward : Unlock Twilight research "},

        },
        55: {
            name: "Negativity",
            done() { return   player.s.points.gte(444)},
            tooltip() {return "Get 444 Subtractive  . Reward : 'Point Boost' multiplicative buyable cost is ^"+format(this.effect())+" (based on Subtractive) "},
            effect() {
                let subtracti = player.s.points.add(1)
                return subtracti.pow(-0.1)
            }

        },
        56: {
            name: "More Multiplicative content",
            done() { return   player.m.points.gte("1e1000")},
            tooltip() {return "Get 1e1000 Multiplicative . Reward : Unlock 2 more Multiplicative upgrade (Which boost 'Point Boost' buyable effect)"},

        },
        57: {
            name: "More Divisive content",
            done() { return   player.d.points.gte("1e1000")},
            tooltip() {return "Get 1e1000 Divisive . Reward : Unlock 1 more Divisive challenge (Chaotic Division)"},

        },
        58: {
            name: "Relativity",
            done() { return   tmp.t.effect.gte("1e15")},
            tooltip() {return "Reach 1e15 Tickspeed/s . Reward : Unlock 2 more tickspeed upgrade"},

        },
        59: {
            name: "Old age",
            done() { return   player.r.prestigetime.gte("2628000")},
            tooltip() {return "Reach 1 Month (31 days) worth of Prestige Time . Reward : Unlock 1 more Research Improvement"},

        },
        61: {
            name: "Point Boost++",
            done() { return   player.m.buyables[11].gte(4000)},
            tooltip() {return "Reach 'Point Boost' multiplicative buyable level 4000 . Reward : Unlock 4 more Multiplicative upgrade"},

        },
        62: {
            name: "Elder age",
            done() { return   player.r.prestigetime.gte("31556926")},
            tooltip() {return "Reach 1 'year' (365.25 days) worth of Prestige Time . Reward : Every second while not altering , gain 1/300 of the time difference between Prestige Time and 1 year if Prestige Time is below 1 year    "},

        },
        63: {
            name: "What have you done?",
            done() { return player.n.points.gte("1e2000") },
            tooltip() {return "Reach 1e2000 Number . Reward : +"+format(this.effect(),4)+" Addition upgrade base (based on Number)"},
            effect() {return player.n.points.add(10).slog().add(10).slog().sub(1)}

        },
        64: {
            name: "Its Metain' time",
            done() { return   player.r.mastery.gte(10000)},
            tooltip() {return "Get 10000 Mastery . Reward : Perk Power effect is increased ^1.05"},

        },
        65: {
            name: "Slightly more ...",
            done() { return   player.r.mastery.gte(10830)},
            tooltip() {return "Get 10830 Mastery  . Reward : Gain 1 Meta-research instantly"},
            onComplete() {
                player.r.metaresearch = player.r.metaresearch.add(1)
            },
        },
        66: {
            name: "What's next",
            done() { return   player.e.effective.gte(75)},
            tooltip() {return "Get 75 effective exponent . Reward : Exponent effect is 5% more effective"},

        },
        67: {
            name: "Infinite Ticks",
            done() { return   player.t.total.gte("1e8")},
            tooltip() {return "Earned a total of 100M Ticks . Reward : You may spent ticks to boost gamespeed"},

        },
        68: {
            name: "Twilight gatherer",
            done() { return   player.r.twilight.gte("1e6")},
            tooltip() {return "Reach 1e6 Twilight . Reward : Square the tickspeed bonus given by Twilight"},

        },
        69: {
            name: "Repeated Exponentation",
            done() { return   player.e.effective.gte(100)},
            tooltip() {return "Reach 100 effective exponent . Reward : Unlock 1 more reset layer (in Research)"},

        },
        71: {
            name: "Back to square one",
            done() { return  player.s.points.gte(1) && player.a.points.gte(1) && inChallenge('al',11)},
            tooltip() {return "Get 1 additive and subtractive . Reward : 16x Number gained"},

        },
        72: {
            name: "Three of each",
            done() { return  player.s.points.gte(3) && player.a.points.gte(3) && inChallenge('al',11)},
            tooltip() {return "Get 3 additive and subtractive . Reward : /10 Additive and Subtractive cost"},

        },
        73: {
            name: "Small Multiplication",
            done() { return player.m.points.gte("2") && inChallenge('al',11)},
            
            tooltip() {return "Reach 2 Multiplicative . Reward : Multiply Number based on Point Boost buyable level . Current : x"+format(this.effect())+""},
            effect() {
                let level = player.m.buyables[11]
                return level.add(1).pow(2)
            },

        },
        74: {
            name: "Slight Multiplication",
            done() { return   player.m.points.gte("128") && inChallenge('al',11)},
            tooltip() {return "Reach 128 Multiplicative . Reward : Reduce the tickspeed penality while altered by /4"},

        },
        75: {
            name: "Very long grind",
            done() { return   player.points.gte("1e25") && inChallenge('al',11)},
            tooltip() {return "Reach 1e25 points  . Reward : +^0.05 Altered Pre-research resource and cost reduction . Unlock more altered upgrade"},
        },
        76: {
            name: "Tedious work",
            done() { return   player.d.points.gte(1) && inChallenge('al',11)},
            tooltip() {return "Get 1 divisive . Reward : +^0.1 Altered Tickspeed . Autobuy 'More Operation' (Improvement) buyable in Research"},

        },
        77: {
            name: "Extreme work",
            done() { return   player.d.points.gte("1e2") && inChallenge('al',11)},
            tooltip() {return "Get 100 divisive . Reward : ^0.5 Point Boost cost"},

        },
        78: {
            name: "Halfway to Exponent",
            done() { return   player.points.gte("1e50") && inChallenge('al',11)},
            tooltip() {return "Reach 1e50 points . Reward : +^0.1 Altered Tickspeed"},

        },
        79: {
            name: "Exponentation",
            done() { return   player.e.points.gte(1) && inChallenge('al',11)},
            tooltip() {return "Reach 1 exponent . Reward : +^0.1 Altered Pre-research resource and cost reduction . Improvement is now saved across alter"},

        },
        81: {
            name: "Altered number",
            done() {return player.n.points.gte("1e500") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {return "Have 1e500 Number . Reward : Best altered number ever ("+format(player.r.nbest)+") boost Number gained by "+format(this.effect())+"x outside of altered"},
            effect() {
            let eff = player.r.nbest
            let eff1 = eff.pow(0.5).add(1)
            let eff2 = softcap(eff1,new Decimal("1e100"),0.1)
            let eff3 = softcap(eff2,new Decimal("1.8e308"),0.1)
            return eff3
            },
        },
        82: {
            name: "Altered additive",
            done() {return player.a.points.gte("400") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {return "Have 400 additive . Reward : Best altered additive ever ("+format(player.r.abest)+") reduce additive cost by /"+format(this.effect())+" outside of altered"},
            effect() {
            let eff = player.r.abest
            return new Decimal(2).pow(eff)
            },
        },
        83: {
            name: "Altered subtractive",
            done() {return player.s.points.gte("350") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {return "Have 350 subtractive . Reward : Best altered subtractive ever ("+format(player.r.sbest)+") reduce subtractive cost by /"+format(this.effect())+" outside of altered"},
            effect() {
            let eff = player.r.sbest
            return new Decimal(2).pow(eff)
            },
        }, 
        84: {
            name: "Altered multiplicative",
            done() {return player.m.points.gte("1e250") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {return "Have 1e250 Multiplicative . Reward : Best altered multiplicative ever ("+format(player.r.mbest)+") boost Multiplicative gained by "+format(this.effect())+"x outside of altered"},
            effect() {
            let eff = player.r.mbest
            let eff1 = eff.pow(0.5).add(1)
            let eff2 = softcap(eff1,new Decimal("1e100"),0.5)
            let eff3 = softcap(eff2,new Decimal("1.8e308"),0.25)
            let eff4 = softcap(eff3,new Decimal("1e500"),0.125)
            return eff4
            },
        },
        85: {
            name: "Altered divisive",
            done() {return player.d.points.gte("1e200") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {return "Have 1e200 Divisive . Reward : Best altered divisive ever ("+format(player.r.dbest)+") boost Divisive gained by "+format(this.effect())+"x outside of altered"},
            effect() {
            let eff = player.r.dbest
            let eff1 = eff.pow(0.5).add(1)
            let eff2 = softcap(eff1,new Decimal("1e100"),0.5)
            let eff3 = softcap(eff2,new Decimal("1.8e308"),0.25)
            let eff4 = softcap(eff3,new Decimal("1e500"),0.125)
            return eff4
            },
        },
         86: {
            name: "Altered exponent",
            done() {return player.e.effective.gte("50") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {return "Reach 50 effective exponent . Reward : Best altered exponent ever ("+format(player.r.ebest)+") increase base Perk Power by +"+format(this.effect(),3)+" outside of altered"},
            effect() {
            let eff = player.r.ebest
            let eff1 = eff.div(5)
            let eff2 = softcap(eff1,new Decimal("2"),0.5)
            let eff3 = softcap(eff2,new Decimal("4"),0.33)
            let eff4 = softcap(eff3,new Decimal("6"),0.25)
            return eff4
            },
        },
         87: {
            name: "Altered point",
            done() {return player.points.gte("1e1000") && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {return "Have 1e1000 Points. Reward : Best altered points ever ("+format(player.r.pointbest)+") boost Number gained by "+format(this.effect())+"x outside of altered"},
            effect() {
            let eff = player.r.pointbest
            let eff1 = eff.pow(0.5).add(1)
            let eff2 = softcap(eff1,new Decimal("1e100"),0.1)
            let eff3 = softcap(eff2,new Decimal("1.8e308"),0.1)
            let eff4 = softcap(eff3,new Decimal("1e500"),0.25)
            return eff4
            },
        }, 
        88: {
            name: "Altered mastery",
            done() {return player.r.mastery.gte(7500) && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {return "Reach 7500 Mastery . Reward : Best altered mastery ever ("+format(player.r.mabest)+") boost Ticks gained by "+format(this.effect(),4)+"x"},
            effect() {
            let eff = player.r.mabest
            let eff1 = eff.add(1).pow(0.75)
            let eff2 = softcap(eff1, new Decimal("1.2"),0.3)
            let eff3 = softcap(eff2,new Decimal("1.5"),0.4)
            let eff4 = softcap(eff3,new Decimal("2"),0.5)
            return eff4

            },
        },
        89: {
            name: "Altered tickspeed",
            done() {return tmp.t.effect.gte(1000) && inChallenge('al',11) && player.r.tetration.gte(6)},
            tooltip() {return "Obtain 1000 Altered Tickspeed . Reward : Best altered tickspeed ever ("+format(player.r.tbest)+") boost Tickspeed by "+format(this.effect())+"x outside of altered"},
            effect() {
            let eff = player.r.tbest
            let eff1 = eff.add(1).pow(0.75)
            let eff2 = softcap(eff1, new Decimal("1.5"),0.5)
            let eff3 = softcap(eff2,new Decimal("2.5"),0.5)
            let eff4 = softcap(eff3,new Decimal("4"),0.5)
            return eff4
            },
        },
        91: {
            name: "The meta",
            done() {return player.r.metaresearch.gte(1)},
            tooltip() {return "Perform a meta research (get 1 meta research) . 'Unlimited boost' multiplicative upgrade cost is rooted by 50"},
        },
        92: {
            name: "2 Meta research",
            done() {return player.r.metaresearch.gte(2)},
            tooltip() {return "Get 2 meta research . Reward : Small bonus to Number gained based on unspent Meta Research , currently : ^"+format(this.effect(),4)+" (capped at ^1.05)"},
            effect() {
            let eff = player.r.metaresearch.add(1)
            return eff.pow(0.02).min(1.05)
            },
        },
        93: {
            name: "Tetrate!",
            done() {return player.r.tetration.gte(1)},
            tooltip() {return "Reach 1 tetration . Reward : ^2 Tickspeed"},
        }, 
        94: {
            name: "Double-Tetrated",
            done() {return player.r.tetration.gte(2)},
            tooltip() {return "Reach 2 tetration . Reward : 'Additive cheapener' subtractive upgrade effect also apply to subtractive as well."},
        },
        95: {
            name: "Insane tetrating",
            done() {return player.r.tetration.gte(6)},
            tooltip() {return "Reach 6 tetration . Reward : 'Worsen condition' divisive challenge reward is increased by 66.7% (^1.15 to ^1.25) "},
        },
        96: {
            name: "Exponental madness",
            done() {return player.r.tetration.gte(9)},
            tooltip() {return "Reach 9 tetration . Reward : Unlock Energy in Twilight research"},

        },
        97: {
            name: "Too much Exponent",
            done() {return player.e.effective.gte("256")},
            tooltip() {return "Reach 256 effective exponent . Reward : Exponent can be automaticly bought (much faster) at no cost"},
          
        }, 
        98: {
            name: "Meta challenger 0",
            done() {return inChallenge('r',11)},
            tooltip() {return "Enter a meta research challenge."},
        },
        99: {
            name: "Slowest game",
            done() {return inChallenge('r',11) && player.r.c3.gte(8) && player.r.mastery.gte(1500)},
            tooltip() {return "Achieve 1500 Mastery inside of a Meta challenge with Frozen Time 8 . Reward : 2x Gamespeed"},
        },
        101: {
            name: "Insane Age",
            done() {return player.r.prestigetime.gte("315360000")},
            tooltip() {return "Reach 10 years worth of Prestige time . Reward : Increase Gamespeed by 10% per year of Prestige time you have (up to 10x) . Current : x"+format(this.effect(),3)+""},
            effect() {
                let f = player.r.prestigetime.div(31536000).floor()
                return f.times(0.1).add(1).min(10)
            }
        },
        102: {
            name: "Meta challenger 1",
            done() {return inChallenge('r',11) && player.r.mastery.gte(10000)},
            tooltip() {return "Complete a meta research challenge (no modifier requirement) . Reward : Challenge shard boost Dark Subtractive (twilight) gain . Current : x"+format(this.effect())+""},
            effect() {
            let eff = player.r.challengeshard
            return new Decimal(1.2).pow(eff)
            },
        },
        103: {
            name: "Condensed upgrade",
            done() {return player.r.buyables[121].gte(1)},
            tooltip() {return "Condense your upgrade . Reward : Tetration cost is reduced by -15"},
        }, 
        104: {
            name: "Final tetration ...",
            done() {return player.r.tetration.gte(10)},
            tooltip() {return "Reach 10 tetration . Reward : Improvement 'More Letter' now provide a Multiplicative buff and rooted its requirement by 4"},
        },
        105: {
            name: "Twilight mastery",
            done() {return player.r.twilight.gte("1e27")},
            tooltip() {return "Have 1e27 twilight . "},
        },
        106: {
            name: "Almost forgotten!",
            done() {return player.al.points.gte("1e80")},
            tooltip() {return "Reach 1e80 Algebric (algebra field) ."},

        },
        107: {
            name: "Beholder of Mastery",
            done() {return player.r.metaresearch.gte(10)},
            tooltip() {return "Have 10 Meta research ."},
          
        }, 
        108: {
            name: "Meta challenger 2",
            done() {return inChallenge('r',11) && player.r.mastery.gte("10000") && player.r.potshard.gte(8)},
            tooltip() {return "Complete a meta research challenge with 8 total modifier level. "},
        },
        109: {
            name: "The End",
            done() {return hasAchievement('ac',101) && hasAchievement('ac',102) && hasAchievement('ac',103) && hasAchievement('ac',104) && hasAchievement('ac',105) && hasAchievement('ac',106) && hasAchievement('ac',107) && hasAchievement('ac',108)},
            tooltip() {return "Complete every achievement in this part . Unlock something new!"},
        },
     
    },
    microtabs: {
        stuff: {
            "Normal Achievement": {
                buttonStyle() { return { 'color': 'yellow' } },
                unlocked() { return true },
                content: 
    
                    [
             ["raw-html", function () { return "<h3>Normal achievement may give additional reward" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],

            ["microtabs", "normal", { 'border-width': '0px' }],
        ]
    
            },
            "Challenge Achievement": {
                buttonStyle() {return {'color':'red'}},
                content :     [
                    ["raw-html", function () { return "<h3>Challenge achievement require specfic condition to complete and always give additional reward </br> Challenge achivement doesn't always require you to be in any condition" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                    ["microtabs", "challenge", { 'border-width': '0px' }],
    
            ]},
            "Altered Achievement": {
                buttonStyle() { return { 'color': 'lime' , "border-color" : "green" } },
                unlocked() { return hasUpgrade('al',24) },
                content:
                
                    [
             ["raw-html", function () { return "<h3>Altered achievement require you to be inside of Altered realm and may give additional reward" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],

            ["microtabs", "altered", { 'border-width': '0px' }],
    ]}, 
    "Meta research achievement": {
            buttonStyle() { return { 'color': 'purple' , "border-color" : "gray" } },
            unlocked() { return player.r.bestmastery.gte(10000) },
            content:
            [
         ["raw-html", function () { return "<h3>Meta research achievement is similar to normal achievement , they may give reward." }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],

        ["microtabs", "metaresearch", { 'border-width': '0px' }]
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
                ["raw-html", function () { return "<h3>These achievemeent require at least 6 tetration to obtain" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
                ["blank", "50px"],
                ["row", [["achievement", 81], ["achievement", 82], ["achievement", 83], ["achievement", 84], ["achievement", 85], ["achievement", 86], ["achievement", 87], ["achievement", 88], ["achievement", 89]]],

            ]
            
        },
},
metaresearch: {
    "Level 1": {
        buttonStyle() { return { 'color': 'purple' , "border-color" : "pink" } },
        unlocked() { return true },
        content: [
            ["blank", "50px"],
            ["row", [["achievement", 91], ["achievement", 92], ["achievement", 93], ["achievement", 94], ["achievement", 95], ["achievement", 96], ["achievement", 97], ["achievement", 98], ["achievement", 99]]],

        ]

            
    },
    "Level 2" : {
        buttonStyle() { return { 'color': 'pink' , "border-color" : "gray" } },
        unlocked() { return true },
        content: [
            ["blank", "50px"],
            ["row", [["achievement", 101], ["achievement", 102], ["achievement", 103], ["achievement", 104], ["achievement", 105], ["achievement", 106], ["achievement", 107], ["achievement", 108], ["achievement", 109]]],

        ]
        
    },
}

},

    tabFormat: [
        ["raw-html", function () { return "<h3>Achievement can be earned by reaching specfic goal or requirement " }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Some achievement reward are much better than other" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Some achievement also unlock something new" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return "<h3>Achievement can also spoil next content" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],

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
            title: "Tickspeed & Ticks",
            body() {          
                return "Tickspeed : Tickspeed boost point generation and Row 1 , Row 2 resource generation (apply after exponents , etc) </br> Ticks : You have "+format(player.t.total)+" total , You are gaining +"+format(tmp.t.passiveGeneration)+" ticks/s (Based on best Mastery)"},
        },

        
         lore2: {
            title: "Tickspeed Control",
            body() {                
                return "Current tickspeed is ^"+format(player.t.tickspeedcontrol)+" above 1,000."},
        },
        lore3: {
            title: "Gamespeed",
            body() {              
                return "Gamespeed increase how fast the game run . This affect everything but ticks gained"},
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
        if (hasAchievement('ac',88)) speed = speed.times(achievementEffect('ac',88))
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
        if (hasUpgrade('t', 31)) base = base.times(upgradeEffect('t', 31))
        if (hasUpgrade('t', 32)) base = base.times(upgradeEffect('t', 32))
        if (hasAchievement('ac', 29)) base = base.times(1.15)
        if (hasAchievement('ac', 39)) base = base.times(2)
        if(hasAchievement('ac',45)) base = base.times(2)
        if(hasAchievement('ac',49)) base = base.times(5)
        if (hasAchievement('ac',89) && !inChallenge('al',11)) base = base.times(achievementEffect('ac',88))



        let exp = new Decimal(1)
        if(hasUpgrade('t',15)) exp = exp.times(1.1)
        if(hasUpgrade('t',16)) exp = exp.times(upgradeEffect('t',16))
        if(hasAchievement('ac',93)) exp = exp.times(2)

        let total = base.pow(exp)
        let total1 = softcap(total,new Decimal(1000),player.t.tickspeedcontrol)
        if(inChallenge('d',13)) total1 = total1.times(0).add(1000)
        if(inChallenge('al',11)) total1 = softcap(total1,new Decimal(1000),player.al.tickspeedreduction1)
        if(inChallenge('al',11)) total1 = total1.div(player.al.tickspeedreduction2)
        return total1
    },
    automate() {

    },
    update(delta) {

    },


    layerShown() { return player.r.bestmastery.gte(100) },          // Returns a bool for if this layer's node should be visible in the tree.
    upgrades: {
        11: {
            title: "Faster Time I",
            description: "x2 Tickspeed",
            cost: new Decimal(1800000),
            effect() {
                return new Decimal(2)
            },
            effectDisplay() {return format(upgradeEffect(this.layer,this.id))+"x"}},
        
        12: {
            title: "Faster Time II",
            description: "Tickspeed is increased based on Ticks",
            cost: new Decimal(1800000),
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
            cost: new Decimal(1800000),
            tooltip:"Multi : slog(point+10)^1.75",
            effect() {
                let multiplier1 = player.points.add(10).slog().pow(1.75)
                 return multiplier1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        14: {
            title: "Faster Time IV",
            description: "Tickspeed is increased based on total ticks",
            cost: new Decimal(1800000),
            tooltip:"Multi : 0.6log10(totaltick/1000+1)+1",
            effect() {
                let multiplier1 = player[this.layer].total.div(1000).add(1).pow(2).log(10).times(0.3).add(1)
                 return multiplier1
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, 
        },
        15: {
            title: "Faster Time V",
            description: "Tickspeed is ^1.1",
            cost: new Decimal(3600000),
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
            cost: new Decimal(3600000),
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
            cost: new Decimal(2400000),
            unlocked() {return player.r.points.gte(0)},
            effect() {
                return new Decimal(3)
            } ,
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+""}
         },
        22: {
            title: "Prestige Time II",
            description: "Prestige time/s (Research) is increased more based on Points",
            cost: new Decimal(2400000),
            tooltip:"Bonus : 1.4slog(points+10)",
            unlocked() {return player.r.points.gte(0)},
            effect() {
                let a = player.points.add(10).slog()
                return a.times(1.4)
            }, 
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+""}
        },
         23: {
            title: "Prestige Time III",
            description: "Prestige time/s (Research) is increased more based on Research",
            cost: new Decimal(2400000),
            tooltip:"Bonus : research*0.8",
            unlocked() {return player.r.points.gte(0)},
            effect() {
                let mast = player.r.points
                return mast.times(0.8)
            } ,
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+""}
         },
        24: {
            title: "Prestige Time IV",
            description: "Prestige time/s (Research) is increased more based on Multiplicative",
            cost: new Decimal(2400000),
            tooltip:"Bonus : 1.45slog(multiplicative+10)",
            unlocked() {return player.r.points.gte(0)},
            effect() {
                return player.m.points.add(10).slog().times(1.45)
            }, 
            effectDisplay() {return "+"+format(upgradeEffect(this.layer,this.id))+""}
        },
        31: {
            title: "Faster Time VII",
            description: "Multiply Tickspeed based on normal exponent",
            cost: new Decimal(10800000),
            tooltip:"Bonus : (exponent+1)^0.5",
            unlocked() {return hasAchievement('ac',58)},
            effect() {
                return player.e.points.add(1).pow(0.5)
            }, 
            effectDisplay() {return ""+format(upgradeEffect(this.layer,this.id))+"x"}
        },
        32: {
            title: "Faster Time VIII",
            description: "Multiply Tickspeed based on effective exponent",
            cost: new Decimal(10800000),
            tooltip:"Bonus : (exponent+1)^0.3",
            unlocked() {return hasAchievement('ac',58)},
            effect() {
                return player.e.effective.add(1).pow(0.3)
            }, 
            effectDisplay() {return ""+format(upgradeEffect(this.layer,this.id))+"x"}
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
            cost() { return new Decimal(0) },
            display() { return "Tickspeed is ^0.95 above 1000" },
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
            cost() { return new Decimal(0) },
            display() { return "Tickspeed is ^0.75 above 1000" },
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
            cost() { return new Decimal(0) },
            display() { return "Tickspeed is reduced to 1000/s if higher" },
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
            cost() { return new Decimal(0) },
            display() { return "Tickspeed is returned to normal" },
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
        
    },

    tabFormat:{
        "Main":{
          content: [["main-display","resource-display"],["infobox","lore"],"prestige-button","milestones","upgrades"]
        },
        "Point gained":{
          content: [["display-text", function(){return "Base Point gained : +1.00"}],
          ["display-text",function(){return hasAchievement('ac',19)?"What's Mastery (Achievement) : x2.00":""}],
          ["display-text",function(){return hasUpgrade('n', 11)&&player.r.tetration.lt(9)&&!player.r.buyables[121].gte(1)?"Counting Faster (Number) : x"+format(upgradeEffect('n',11))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 12)&&player.r.tetration.lt(9)&&!player.r.buyables[121].gte(1)?"Headstart (Number) : x"+format(upgradeEffect('n',12))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 14)&&player.r.tetration.lt(9)&&!player.r.buyables[121].gte(1)?"1st Grade (Number) : x1.20":""}],
          ["display-text",function(){return hasUpgrade('a', 21)&&!player.r.buyables[121].gte(1)?"Addition (Additive) : x"+format(upgradeEffect('a',21))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 13)&&player.r.tetration.lt(9)&&!player.r.buyables[121].gte(1)?"Effective Counting (Number) : x"+format(upgradeEffect('n',13))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 24)&&!player.r.buyables[121].gte(1)?"3rd Grade (Number) : x1.20":""}],
          ["display-text",function(){return buyableEffect('m', 11)>1?"Point Boost (Multiplicative) : x"+format(buyableEffect('m',11))+"":""}],
          ["display-text",function(){return hasChallenge('m', 11)?"Square root challenge (Multiplicative) : x"+format(challengeEffect('m',11))+"":""}],
          ["display-text",function(){return player.d.points.gt(0)?"Divisive Effect (Divisive) : x"+format(tmp.d.effect)+"":""}],
          ["display-text",function(){return player.e.points.gt(0)?"Exponent Effect (Exponent) : x"+format(tmp.e.effect)+"":""}],
          ["display-text",function(){return buyableEffect('al',33).gt(1)?"Algebric Point boost (Algebra - Field) : x"+format(buyableEffect('al',33))+"":""}],
          ["display-text",function(){return player.r.lightadd.gt(1)?"Light Additive (Twilight research) : x"+format(player.r.la1)+"":""}],
          ["display-text",function(){return player.r.buyables[121].gte(1)&&hasUpgrade('n',31)?"Condensed Point upgrade : x"+format(getPointCondensereffect_MUL())+" and ^"+format(getPointCondensereffect_POW())+"":""}],
          
          ["display-text", function(){return hasUpgrade('m',43)?"Glazed Point (Multiplicative) : ^1.05":""}],
          ["display-text", function(){return player.e.points.gt(0)?"Exponent effect (Exponent) : ^"+format(tmp.e.expeffect)+"":""}],
          ["display-text", function(){return player.r.tetration.gt(0)?"1 Tetration reward (Research) : ^1.10":""}],
          ["display-text",function(){return hasUpgrade('n', 11)&&player.r.tetration.gte(9)&&!player.r.buyables[121].gte(1)?"Counting Faster (Number) : ^"+format(upgradeEffect('n',11))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 12)&&player.r.tetration.gte(9)&&!player.r.buyables[121].gte(1)?"Headstart (Number) : ^"+format(upgradeEffect('n',12))+"":""}],
          ["display-text",function(){return hasUpgrade('n', 14)&&player.r.tetration.gte(9)&&!player.r.buyables[121].gte(1)?"1st Grade (Number) : ^1.01":""}],
          ["display-text",function(){return hasUpgrade('n', 13)&&player.r.tetration.gte(9)&&!player.r.buyables[121].gte(1)?"Effective Counting (Number) : ^"+format(upgradeEffect('n',13))+"":""}],

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
    softcap() {return new Decimal("1e6400").div(tmp.n.passiveGeneration.max(1))},
    softcapPower() {return new Decimal(0)},
    automate() {
        if(player.n.points.gt("1e6400")) {
            player.n.points = new Decimal("1e6400")
        }
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        multi = new Decimal(1).times(buyableEffect('r',103)).times(player.r.la2)
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
        if(inChallenge('d',13)) multi = multi.div(player.points)
        if (hasUpgrade('n',32)) multi = multi.times(getNumberCondensereffect_MUL())
        if (hasAchievement('ac',81) && !inChallenge('al',11)) multi = multi.times(achievementEffect('ac',81))
        if (hasAchievement('ac',87) && !inChallenge('al',11)) multi = multi.times(achievementEffect('ac',87))
        if (player.d.unlocked) multi = multi.times(tmp.d.effect)
        

        return multi
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (inChallenge('al',11)) exp = exp.times(player.al.alteredpow)
        if (inChallenge('r',11)) exp = exp.times(player.r.chb)
        if (inChallenge('m',12)) exp = exp.times(0.5)
        if(inChallenge('d',13)) exp = exp.times(0.1)
        if (hasAchievement('ac',92)) exp = exp.times(achievementEffect('ac',92))
        if (inChallenge('d',11)) exp = exp.times(0)
        if (player.n.points.gte("1e6400")) exp = exp.times(0)
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
        if (hasMilestone('e',2) && !inChallenge('e',11) && !inChallenge('e',12)) numpas = numpas.add(1) 
        if (hasMilestone('r',2)) numpas = numpas.add(1)
        if (hasUpgrade('s', 33) && player.r.buyables[121].lt(1)) numpas = numpas.add(upgradeEffect('s', 33)).times(0.01)
        if (hasUpgrade('s', 41)) numpas = numpas.times(upgradeEffect('s', 41))
        let multi = numpas.times(tmp.t.effect.times(0.001))
        if (hasUpgrade('al',32)) multi = multi.add(1)
        if (hasUpgrade('r',12)) multi = multi.add(1)
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
                let a = "Points gained is x2 "
                let b = hasUpgrade('al',43)?" . Empowered by Mastery":""
                let c =  a+b
                return player.r.tetration.gte(9)?"Points gained is raised based on Mastery":c
            },
            cost: new Decimal(1),
            effect() {
                let base = new Decimal(2)
                if(hasUpgrade('al',43)) base = base.pow(player.r.mastery.add(2))
                let base1 = softcap(base,new Decimal("1e6"),0.04)
                let base2 = softcap(base1,new Decimal("1e100"),0.2)
                if(player.r.tetration.gte(9)) base2 = base2.slog().div(20).add(1)
                if(player.r.buyables[121].gte(1)) base2 = base2.pow(0)
                return base2
            }, 
            effectDisplay() { return player.r.tetration.lt(9)?format(upgradeEffect(this.layer, this.id))+"x":"^"+format(upgradeEffect(this.layer,this.id),4)+"" }, 
            unlocked() {return !player.r.buyables[121].gte(1)}
        },
        12: {
            title: "Headstart",
            description: "Points gained is based on number",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("n", 11) && !player.r.buyables[121].gte(1)},
            effect() {
                let pow1 = new Decimal("10")
                let startcap1 = new Decimal("1e100")
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
            description: "Points gained boost itself",
            cost: new Decimal(2),
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
            description() {return player.r.tetration.lt(9)?"Unlock new layer and x1.2 point gained":"Unlock new layer and ^1.01 to Points gained"},
            cost: new Decimal(6),
            unlocked() { return hasUpgrade("n", 13) && !player.r.buyables[121].gte(1) },
        },
        21: {
            title: "Counting much faster",
            description: "1.5x Number gained",
            cost() {
                let base = new Decimal(1e6)
                if(hasUpgrade('al',44) || hasUpgrade('r',11)) base = base.pow(0.25)
                if(player.r.buyables[121].gte(1)) base = base.pow(0)

                return base
            },
            unlocked() { return (hasUpgrade("a", 24) || hasUpgrade('al',44) || hasUpgrade('r',11) || hasMilestone('e',1)) && !player.r.buyables[121].gte(1)},
        },
        22:{
            title: "Reverse increase",
            description: "Points boost number gained",
            cost() {
                let base = new Decimal(8e6)
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
            description: "Performing a row 2 reset doesn't reset your number upgrade",
            cost() {
                let base = new Decimal(3e7)
                if(hasUpgrade('al',44) || hasUpgrade('r',11) ) base = base.pow(0.25)
                return base
            },
            unlocked() { return hasUpgrade("n", 22) ||  player.r.buyables[121].gte(1) },
        },
        24:{
            title: "3rd Grade",
            description: "Unlock new layer and x1.2 point gained",
            cost() {
                let base = new Decimal(7e7)
                if((hasUpgrade('al',44) || hasUpgrade('r',11)) ) base = base.pow(0.25)
                return base
            },
            unlocked() { return hasUpgrade("n", 23) && !player.r.buyables[121].gte(1) },
        }, 
        31: {
            title: "Condensed Point upgrade",
            description() {return "Multiply Points gained based on various resource."},
            tooltip() {return "Points gained is boosted by itself , number , additive , subtractive , mastery </br> Total effect : x"+format(getPointCondensereffect_MUL())+" and ^"+format(getPointCondensereffect_POW(),4)+" to Points gained "},
            cost: new Decimal(32),
            unlocked() { return player.r.buyables[121].gte(1) },
            effect() {
                return new Decimal(1)
            },
        },
        32: {
            title: "Condensed Number upgrade",
            description() {return "Multiply Number gained based on various resource."},
            tooltip() {return "Number gained is boosted by points , additive , subtractive , perk power  </br> Total effect : x"+format(getNumberCondensereffect_MUL())+" to Number gained "},
            cost: new Decimal(32),
            unlocked() { return player.r.buyables[121].gte(1) },
            effect() {
                return new Decimal(1)
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
                    "prestige-button",
                    ["blank","25px"],
                    ["row", [["upgrade", 11],["upgrade", 12],["upgrade", 13],["upgrade",14]]],
                    ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade",24]]],
                    ["row", [["upgrade", 31],["upgrade",32]]],



    ],},
},},
    tabFormat: [
        ["raw-html", function () { return "<h3>You have  " + format(player.n.points)+" Number => +"+format(player.r.basemastery)+" Mastery"}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return tmp.n.passiveGeneration.times(getResetGain(this.layer)).gt(0)?"<h3>You are currently gaining " + format(tmp.n.passiveGeneration.times(getResetGain(this.layer)))+" Number/s":"" }, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],    
        ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
    layerShown() { return true }
})

addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        startsoftcap: new Decimal(100),
        startsoftcap2: new Decimal(2048),
        first: new Decimal(0), //there's some error with the removal of these 'first' variable that flood localStorage
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
        if (hasAchievement('ac',72)) multi = multi.div(10)
        if (hasAchievement('ac',82) && !inChallenge('al',11)) multi = multi.div(achievementEffect('ac',82))
        if(inChallenge('al',11)) multi = multi.pow(player.al.alteredpow)
        if (inChallenge('r',11)) multi = multi.pow(player.r.chb)
        if(inChallenge('al',11) && hasUpgrade('m',43)) multi = multi.div(24.8)

        return multi                      
    },
    gainExp() {
        let exp = new Decimal(1).times(new Decimal(1).add(-player.a.points.div(player.a.startsoftcap.max(1)).floor())).max(0)
        return exp
    },
    resetDescription:"Increase for ",

    layerShown() { return (hasUpgrade('n', 14))||hasAchievement('ac',14) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "a", description: "A: Reset for Additives", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    automate() {
        if(hasUpgrade('m',43) || hasMilestone('r',1) ) {
            let start = player.a.startsoftcap
            let maxadditive = (player.points.times(tmp.a.gainMult.pow(-1)).times(1/125).max(2).log(10).add(-new Decimal(2).log(10))).pow(20/27).times(new Decimal(2).log(10).pow(-20/27))
            let power = new Decimal(0.6)
            if (inChallenge('r',11)) power = power.div(player.r.chf)

            let final = softcap(maxadditive,start,power)
            player.a.points = final
        }
            let d13r = new Decimal(1.5)
            let e12r = new Decimal(1.1)
            if(inChallenge('r',11)) d13r = d13r.pow(player.r.chj)
            if(inChallenge('r',11)) e12r = e12r.pow(player.r.chj)
            let base = new Decimal(100)
            if (hasUpgrade('e', 53)) base = base.add(upgradeEffect('e', 53))
            if (hasUpgrade('a', 42)) base = base.add(upgradeEffect('a', 42))
            if(hasChallenge('d',13)) base = base.times(d13r)
            if (player.r.tetration.gte(3)) base = base.times(1.25)


            if (hasChallenge('e', 12)) base = base.times(e12r)
            if (inChallenge('r',11)) base = base.div(player.r.che)
            player.a.startsoftcap = base


            player.a.first = new Decimal(0)
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
        let base = new Decimal(1.5)
        if (hasUpgrade('a', 23) && !player.r.buyables[121].gte(1)) base = base.add(a1)
        if (hasUpgrade('a', 31) && !player.r.buyables[121].gte(1)) base = base.add(a2)
        if(player.r.buyables[121].gte(1)) base =  base.add(a1).add(a2).add(0.15)
        if (hasUpgrade('a', 32) && !player.r.buyables[121].gte(1)) base = base.add(0.05)
        if (hasUpgrade('m',73)&& !player.r.buyables[121].gte(1)) base = base.add(0.1)
        if (player.r.tetration.gte(3)) base = base.add(0.2)
        if (hasAchievement('ac',63)) base = base.add(achievementEffect('ac',63))
        return base
    },
effectDescription() {
    return "Addition upgrade base : "+format(tmp.a.effect)+""
},
infoboxes: {
    lore: {
        title: "Additive cost",
        body() {
            let start = player.a.startsoftcap
            return "You can only buy at most "+format(start)+" additives , you cannot purchase more than that </br> An autobuyer allow fractional purchase and bypass the limit , but additive cost scale much faster above "+format(start)+" </br> Cost reduction : /"+format(tmp.a.gainMult.pow(-1))+" </br> Current additive : "+format(player.a.points)+""  },
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

                let base1 = base.pow(eff)
                let base2 = softcap(base1,new Decimal("1e600"),0.1)
                return base2
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return !player.r.buyables[121].gte(1)} },
        22: {
            title: "Numberic increase",
            description: "Increase Numbers gained based on additives",
            cost: new Decimal(3),
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
            description: "Addtive upgrade 'Addition' is more effective based on subtraction",
            cost: new Decimal(4),
            unlocked() { return hasUpgrade("a", 22) && !player.r.buyables[121].gte(1) },
            effect() {
                let eff = player.s.points.add(1).log(10).times(0.1)
                if(player.r.buyables[121].gte(1)) eff = eff.times(0)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+" added to base" }, },
        24: {
            title: "New upgrade",
            description: "Unlock 4 more number upgrade",
            cost: new Decimal(7),
            unlocked() { return hasUpgrade("a", 23) && !player.r.buyables[121].gte(1) },
            }, 
        31: {
            title: "Crazed addition",
            description: "'Addition' additive upgrade is more effective based on additives",
            cost: new Decimal(30),
            unlocked() { return hasUpgrade("m" , 51) && !player.r.buyables[121].gte(1)},
            effect() {
                let eff = player[this.layer].points.add(1).log(10).times(0.07)
                if(player.r.buyables[121].gte(1)) eff = eff.times(0)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+" added to base" }, },
        32: {
            title: "Stronger additive",
            description: "+0.05 to the base of 'Addition' additive upgrade",
            cost: new Decimal(33),
            unlocked() { return hasUpgrade("a", 31) && !player.r.buyables[121].gte(1) }, },
        33: {
            title: "Multiplier automation",
            description: "Gain a percentage of your multiplicatives passively per seconds (based on additives)",
            cost: new Decimal(35),
            unlocked() { return hasUpgrade("a", 32) && !player.r.buyables[121].gte(1)},
            effect() {
                let eff = player[this.layer].points.add(1).times(0.2)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"%" }, },
        34: {
            title: "5th Grade",
            description: "Unlock a new layer and x1.5 Number gained",
            cost: new Decimal(36),
            unlocked() { return hasUpgrade("a", 33) && !player.r.buyables[121].gte(1)},
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
            unlocked() { return buyableEffect("e",33).gte(1) },},
        42: {
            title: "Delay additive ",
            description: "Additive cost scaling started later based on Perk Power",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('a',41)) base = base.add(4)
                if(hasUpgrade('a',43)) base = base.add(8)
                if(hasUpgrade('a',44)) base = base.add(6)

                return base
            },
            unlocked() { return buyableEffect("e", 33).gte(1) && !player.r.buyables[121].gte(1) },
            effect() {
                let eff = player.e.perkpower.add(2).pow(1.2).times(1/2).max(1)
                if(player.r.buyables[121].gte(1)) eff = eff.times(0)
                return eff
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+"" }, },
        43: {
            title: "Additive Perk",
            description: "Multiply Perk Point gained based on Additive (capped at 1750 additives)",
            cost() {
                let base = new Decimal(160)
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
            description: "Multiply Number gained based on Perk Power",
            cost() {
                let base = new Decimal(160)
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
                    "prestige-button",
                    ["blank","25px"],
                    ["row", [["upgrade", 21],["upgrade", 22],["upgrade", 23],["upgrade",24]]],
                    ["row", [["upgrade", 31],["upgrade", 32],["upgrade", 33],["upgrade",34]]],
                    ["row", [["upgrade", 41],["upgrade", 42],["upgrade", 43],["upgrade",44]]],



    ],},
},},
    tabFormat: [
        ["raw-html", function () { return "<h3>You have  " + format(player.a.points)+" Additive => x"+format(player.r.additivemastery)+" Mastery"}, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.buyables[121].lt(1)?"<h3>Current 'addition' base is " + format(tmp.a.effect)+" , which boost Points gained by x"+format(upgradeEffect('a',21))+" (after unlocking 'Addition' upgrade)":""}, { "color": "lime", "font-size": "18px", "font-family": "helvetica" }],
        ["raw-html", function () { return player.r.buyables[121].gte(1)?"<h3>Current 'addition' base is " + format(tmp.a.effect)+" , which boost 'Condensed Points Upgrade' effect by x"+format(upgradeEffect('a',21))+"":""}, { "color": "lime", "font-size": "18px", "font-family": "helvetica" }],

        ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
    layerShown() { return true }
})

addLayer("s", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        startsoftcap:new Decimal(100),
        startsoftcap2:new Decimal(2048),
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
        if (hasAchievement('ac',72)) multi = multi.div(10)
        if (hasAchievement('ac',83) && !inChallenge('al',11)) multi = multi.div(achievementEffect('ac',83))
        if (hasAchievement('ac',94) && hasUpgrade('s',43)) multi = multi.div(upgradeEffect('s',43))
        if(inChallenge('al',11)) multi = multi.pow(player.al.alteredpow)
        if (inChallenge('r',11)) multi = multi.pow(player.r.chb)
        if(inChallenge('al',11) && hasUpgrade('m',43)) multi = multi.div(24.8)


        return multi     
    },
    gainExp() {                  
        let exp = new Decimal(1).times(new Decimal(1).add(-player.s.points.div(player.s.startsoftcap.max(1)).floor())).max(0)
        return exp
    },
    resetDescription:"Reduce for ",


    layerShown() { return (hasUpgrade('n', 14)||hasAchievement('ac',15)) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "s", description: "S: Reset for Subtractive", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        let keep = [];
        if ( hasMilestone("e",3) && resettingLayer=="e") keep.push("upgrades")
        if ( hasMilestone("e",3) && resettingLayer=="e" && (inChallenge('e',12) || inChallenge('e',11))) keep.push("points")
        if (layers[resettingLayer].row > this.row && !hasUpgrade('r',13)) layerDataReset("s", keep)
    },
    infoboxes: {
        lore:{
        title: "Subtractive cost",
        body() {
            let start = player.s.startsoftcap
            return "You can only buy at most "+format(start)+" subtractives , you cannot purchase more than that </br> An autobuyer allow fractional purchase and bypass the limit , but subtractives cost scale much faster above "+format(start)+" </br> Cost reduction : /"+format(tmp.s.gainMult.pow(-1))+" </br> Current subtractive : "+format(player.s.points)+""  },
        }
    },
    automate() {
        if(hasUpgrade('m',43) || hasMilestone('r',1)) {
            let start = player.s.startsoftcap
            let maxsubtractive = (player.points.times(tmp.s.gainMult.pow(-1)).times(1/125).max(2).log(10).add(-new Decimal(2).log(10))).pow(20/27).times(new Decimal(2).log(10).pow(-20/27))
            let power  = new Decimal(0.6)
            if(inChallenge('r',11)) power = power.div(player.r.chf)
            let final = softcap(maxsubtractive,start,power)
            player.s.points = final
        }
        let d13r = new Decimal(1.5)
        let e12r = new Decimal(1.1)
        if(inChallenge('r',11)) d13r = d13r.pow(player.r.chj)
        if(inChallenge('r',11)) e12r = e12r.pow(player.r.chj)
            let base = new Decimal(100)
            if (hasUpgrade('e', 54)) base = base.add(upgradeEffect('e', 54))


            if (hasChallenge('e', 12)) base = base.times(e12r)
            if (hasUpgrade('s', 53)) base = base.times(1.1)
            if(hasChallenge('d',13)) base = base.times(d13r)
            if (player.r.tetration.gte(3)) base = base.times(1.25)
            if (inChallenge('r',11)) base = base.div(player.r.che)

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
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return !player.r.buyables[121].gte(1)} },
        32: {
            title: "Negative to Postive",
            description: "Number upgrade 'Headstart' and 'Effective counting' is boosted based on subtractive (Boost Points gained)",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("s", 31) && !player.r.buyables[121].gte(1) },
            effect() {
                let eff = new Decimal(2).add(player[this.layer].points.times(0.1))
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        33: {
            title: "Automatic counting",
            description: "Gain a percentage of your number gained on Number reset per second (based on subtractive)",
            cost: new Decimal(6),
            unlocked() { return hasUpgrade("s", 32) && !player.r.buyables[121].gte(1) },
            effect() {
                 let eff = new Decimal(5).times(player[this.layer].points.add(1))
                 if(player.r.buyables[121].gte(1)) eff = eff.times(0)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"%" }, },
        41: {
            title: "Faster automation",
            description: "Multiply Number gained from passive generation based on subtractive",
            cost: new Decimal(12),
            unlocked() { return hasUpgrade("m", 44) },
            effect() {
                 let eff = player[this.layer].points.add(2).pow(0.75)
                 if(hasUpgrade('s',51)) eff = eff.pow(upgradeEffect('s',51))
                 if(hasUpgrade('s',42)) eff = eff.pow(upgradeEffect('s',42))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, },
        42: {
            title: "Stronger Subtractive",
            description: "All Upgrade in this row stronger based on subtractives",
            tooltip() {return !hasUpgrade('m',72)?"Raise the effect of all upgrade in this row by +0.5% per subtractive , capped at +20%":"Raise the effect of all upgrade in this row by +0.5% per subtractive , softcapped at +20%"},
            cost: new Decimal(16),
            unlocked() { return hasUpgrade("s", 41) },
            effect() {
                let point = player[this.layer].points.max(0).times(0.5)
                if(!hasUpgrade('m',72)) point = point.min(20)
                if (hasUpgrade('m',72)) point = softcap(point,new Decimal(20),0.5)
                let multi = new Decimal(1).add(point.times(0.01))
                return multi
            } ,
            effectDisplay() {return "^"+format(upgradeEffect(this.layer,this.id))+""}},
        43: {
            title: "Additive cheapener",
            description: "Divide the cost of additives based on subtractives",
            cost: new Decimal(18),
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
            description: "The upgrade above ('Faster Automation') is strengthen based on subtractive . Capped at ^32 ",
            cost() {
                let base = new Decimal(160)
                if(hasUpgrade('s',52)) base = base.times(1.15)
                if(hasUpgrade('s',53)) base = base.times(1.15)

                return base.floor()
            },
            unlocked() { return buyableEffect("e", 34).gte(1) },
            effect() {
                let eff = player.s.points.times(0.02).add(1).min(32)
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
            unlocked() { return buyableEffect("e", 34).gte(1) && !player.r.buyables[121].gte(1) }, },
        53: {
            title: "Slow Subtractive",
            description: "Subtractive cost scaling start x1.1 later",
            cost() {
                let base = new Decimal(160)
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
    automate() {
        player.m.first = player.points.times(0)
    },

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
        if (hasAchievement('ac',84) && !inChallenge('al',11)) multi = multi.times(achievementEffect('ac',84))

        return multi 
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        let exp = new Decimal(1)
        if(inChallenge('al',11)) exp = exp.times(player.al.alteredpow)
        if (inChallenge('r',11)) exp = exp.times(player.r.chb)

        return exp
    },
    resetDescription:"Multiply for ",

    layerShown() { return (hasUpgrade('n', 24)||hasAchievement('ac',25)) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "m", description: "M: Reset for Multiplicative", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    passiveGeneration() { 
        let numpas = new Decimal(0)
        if (hasMilestone('r',2)) numpas = numpas.add(1)
        if (hasUpgrade('a', 33)) numpas = numpas.add(upgradeEffect('a', 33)).times(0.01)
        if (hasMilestone('e',2) && !inChallenge('e',11) && !inChallenge('e',12)) numpas = numpas.add(1)
        return numpas.times(tmp.t.effect.times(0.001)).times(player.r.truegamespeed) },
    infoboxes: {
    lore: {
        title: "Multiplicative gained",
        body() {
            return "Base : "+format(player.n.points.times("e-8").pow(0.5))+" . Multiplier : x"+format(tmp.m.gainMult)+" . Exponent : ^"+format(tmp.m.gainExp)+""  },
    },
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("e",5) && resettingLayer=="e") keep.push("challenges")
        if (hasMilestone("e",6) && resettingLayer=="e")  keep.push("upgrades")
        if (layers[resettingLayer].row > this.row && !hasUpgrade('r',15)) layerDataReset("m", keep)
    },
    buyables: {
        11: {
            title() {
            let a = player.m.buyables[11].gt(600)?"Expensive":""
             return +getBuyableAmount(this.layer, this.id) + "<br/> "+a+" Point Boost"
            } ,
            cost(x) { 
                let increase = x.max(600).sub(600)
                
                let cost =  (new Decimal(2).add(increase.times(0.0025))).pow(x)
                if(hasAchievement("ac",55)) cost = cost.pow(achievementEffect('ac',55))
                if (hasAchievement('ac',77)) cost = cost.pow(0.5) 

                return cost},
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
                let d12r = new Decimal(1.15)
                if(hasAchievement('ac',95)) d12r = d12r.add(0.1)
                if(inChallenge('r',11)) d12r = d12r.pow(player.r.chj)
                let base = x.add(1).pow(0.7)
                let exp = x.add(10).log(10)
                if(hasUpgrade('m',52)) exp = exp.times(1.3)
                if(hasUpgrade('m',52) && player.r.buyables[121].gte(1)) exp = exp.times(7)
                if(hasUpgrade('m',54) && !player.r.buyables[121].gte(1)) exp = exp.times(1.4)
                if(hasChallenge('d',12)) exp = exp.times(d12r)
                if(hasAchievement('ac',47)) exp = exp.times(1.5)
                if(hasUpgrade('m',63) && !player.r.buyables[121].gte(1)) exp = exp.times(5)
                let effect = base.pow(exp)
                if(player.r.tetration.gte(2)) effect = effect.times(new Decimal(2).pow(x.div(25))) 
                return effect
            },
            purchaseLimit() {
                let base = new Decimal(100)
                if (hasAchievement('ac',35)) base = base.times(2)

                if(hasUpgrade('a',41)) base = base.times(3)
                if(hasUpgrade('m',64)) base = base.times("1e100")
                return base
            },
            style() {
                if (player.m.buyables[11].gte(this.purchaseLimit())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'100px'
				} 
				else if (player.m.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}
        }
    },
     
    },
    challenges: {
        11: {
            name: "Fatigued",
            challengeDescription: "Square root point gained" ,
            goalDescription() {
                let base = new Decimal("1e9")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                return "Reach "+format(base)+" point"},
            rewardDescription: "Point gained are boosted based on multiplicative",
            rewardEffect() {
                let m = player[this.layer].points.add(4).log(2).pow(1.25)
                if(hasAchievement('ac',41)) m = m.pow(achievementEffect('ac',41)) 
                if(inChallenge('r',11)) m = m.pow(player.r.chj)
                return m
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            canComplete: function() {
                let base = new Decimal("1e9")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                return player.points.gte("1e9")
            },
        },
        12: {
            name: "Halted Counter",
            challengeDescription: "Square root number gained" ,
            goalDescription() {
                let base = new Decimal("1e9")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)

                return "Reach "+format(base)+" number"},
            rewardDescription: "Number gained are boosted based on multiplicative",
            rewardEffect() {
                let m = player[this.layer].points.add(3.5).log(2).pow(2)
                if(hasAchievement('ac',42)) m = m.pow(achievementEffect('ac',42)) 
                if(inChallenge('r',11)) m = m.pow(player.r.chj)
                return m
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            canComplete: function() {
                let base = new Decimal("1e9")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                return player.n.points.gte("1e9")
            },
        },
        },


    
    upgrades: {
        41: {
            title: "Number increase",
            description: "x1.5 Number gained",
            cost: new Decimal(1),
            unlocked() {return !player.r.buyables[121].gte(1)}
        },
        42: {
            title: "Increased multiplicative",
            description: "x2 Multiplicatives gained",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade("m", 41) }, },

        43: {
            title: "Glazed Point",
            description: "^1.05 Points gained and Automate additive and subtractive ",
            tooltip:"Additive and subtractive is based on your Points with autobuyer . They may decrease ...",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("m", 42) || player.r.buyables[121].gte(1)},
            },            
        44: {
            title: "Minus Upgrade",
            description: "Unlock 3 more subtractive upgrade",
            cost: new Decimal(700),
            unlocked() { return hasUpgrade("m", 43) },
            },    
        51: {
            title: "Additive upgrade",
            description: "Unlock 3 more additive upgrade",
            cost: new Decimal(2500),
            unlocked() { return hasUpgrade("m", 44) },},
        52: {
            title: "Greater Boost",
            description() { 
                let a = new Decimal("1.3")
                if(player.r.buyables[121].gte(1)) a = a.add(7.8)
                return "'Point Boost' multiplicative buyable effect is ^"+format(a)+" "},
            cost: new Decimal(4000),
            unlocked() { return hasUpgrade("m", 51) },},
        53: {
            title: "Automatic Division",
            description: "Gain a percentage of your divisive gained on reset per second (based on multiplicative)",
            cost: new Decimal("1e18"),
            unlocked() { return hasChallenge("d", 11) },
            effect() {
                 let eff = (player[this.layer].points.add(11).log(10).times(2))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"%" }, },
        54: {
            title: "Greatest Boost",
            description: "'Point Boost' multiplicative buyable effect is ^1.40",
            cost: new Decimal("4e18"),
            unlocked() { return hasUpgrade("m", 53) && !player.r.buyables[121].gte(1)},},
        61: {
            title: "Strange 5",
            description: "Multiply your point gained by 5x",
            cost: new Decimal("1.6e19"),
            unlocked() { return hasUpgrade("m", 54) && !player.r.buyables[121].gte(1)}, },
        62: {
            title: "Better effect ",
            description: "Divisive effect is ^1.05",
            cost: new Decimal("6.4e19"),
            unlocked() { return hasUpgrade("m", 61) }, },
        63: {
            title: "Significantly Stronger",
            description: "'Point Boost' multiplicative buyable effect is ^5",
            cost: new Decimal("1e1000"),
            unlocked() { return hasAchievement("ac", 56) && !player.r.buyables[121].gte(1) }, },
        64: {
            title: "Unlimited Boost",
            description: "'Point Boost' multiplicative buyable max level is uncapped , but cost start to increase much faster above lvl 600",
            cost() {
                let base = new Decimal("1e1050")
                if(hasAchievement('ac',91)) base = base.pow(0.02)
                return base},
            unlocked() { return hasAchievement("ac", 56) }, },
        71: {
            title: "More Exponent",
            description: "x1.02 Effective Exponent",
            cost: new Decimal("1e1250"),       
            unlocked() { return hasAchievement('ac',61) }, },
        72: {
            title: "Strongest Subtraction",
            description: "The 20% hardcap of 'Stronger Subtractive' is now a softcap ",
            cost: new Decimal("1e1350"),
            unlocked() { return hasAchievement("ac", 61) }, },
        73: {
            title: "Additional Boost",
            description: "'Addition' additive upgrade base is increased by 0.1",
            cost: new Decimal("1e1500"),
            unlocked() { return hasAchievement("ac", 61) && !player.r.buyables[121].gte(1)}, },
        74: {
            title: "Slowest Exponent",
            description: "Exponent cost increase 5% slower",
            cost: new Decimal("1e1600"),
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
                    "prestige-button",
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
        ["raw-html", function () { return "<h3>You have  " + format(player.m.points)+" Multiplicative => x"+format(player.r.multiplicativemastery)+" Mastery"}, { "color": "teal", "font-size": "22px", "font-family": "helvetica" }],
        ["raw-html", function () { return tmp.m.passiveGeneration.times(getResetGain(this.layer)).gt(0)?"<h3>You are currently gaining " + format(tmp.m.passiveGeneration.times(getResetGain(this.layer)))+" Multiplicative/s":"" }, { "color": "teal", "font-size": "22px", "font-family": "helvetica" }], 
                ["microtabs", "stuff", { 'border-width': '0px' }],
    ],
})

addLayer("d", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        best: new Decimal(0),   
        first:new Decimal(0),
        timereq: new Decimal(1)
    }},

    color: "#822B2B",                       // The color for this layer, which affects many elements.
    resource: "divisive",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "numbers",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.n.points },  // A function to return the current amount of baseResource.

    requires() {
    let base = new Decimal("1e18")
    if(inChallenge('al',11)) base = base.pow(0.4)
    return base },              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,
    branches:['n'],                           // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let multi = new Decimal(1).times(buyableEffect('r',102)).times(player.r.da2)
        if (hasAchievement('ac',37)) multi = multi.times(2)
        if (hasAchievement('ac',85) && !inChallenge('al',11)) multi = multi.times(achievementEffect('ac',85))

        return multi 
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        let exp = new Decimal(1)
        if (player.r.tetration.gte(5)) exp = exp.times(1.1)
        if(inChallenge('al',11)) exp = exp.times(player.al.alteredpow)
        return exp
    },
    resetDescription:"Divide for ",
    layerShown() { return (hasUpgrade('a', 34)||hasAchievement('ac',29))},          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "d", description: "D: Reset for Divisive", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    power() {
        let power = new Decimal(0.5)
        if (hasUpgrade('m', 62)) power = power.times(1.05)
        if (inChallenge('r',11)) power = power.times(player.r.chb)
        return power
    },
    automate() {
        player.d.first = player.points.times(0)
        player.d.timereq = new Decimal("1e30").times(new Decimal(1.5).pow(player.r.cdcomp))
    },

    effect() {   
        let power = new Decimal(0.5)
        if (hasUpgrade('m', 62)) power = power.times(1.05)
        if (hasUpgrade('al',54) && inChallenge('al',11)) power = power.times(2) 

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
        if (hasMilestone('e',2) && !inChallenge('e',11) && !inChallenge('e',12)) numpas = numpas.add(1)
        if (hasMilestone('r',2)) numpas = numpas.add(1)
        return numpas.times(tmp.t.effect.times(0.001)).times(player.r.truegamespeed) },
    infoboxes: {
    lore: {
        title: "Divisive gained",
        body() {
            return "Base : "+format(player.n.points.times("e-18").pow(0.5))+" . Multiplier : x"+format(tmp.d.gainMult)+" . Exponent : ^"+format(tmp.d.gainExp)+""  },
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
            challengeDescription: "Number cannot be gained" ,
            goalDescription() {
                let base = new Decimal("4.85e30")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                return "Reach "+format(base)+" points"
            },
            rewardDescription: "Unlock 4 more multiplicative upgrade",
            canComplete: function() {
            let base = new Decimal("4.85e30")
            if(inChallenge('r',11)) base = base.pow(player.r.chi)
            return player.points.gte(base)
        },
            onEnter() {
                player.n.points = new Decimal(0)
            },
            unlocked() {return true},
        },
        12: {
            name: "Worsen condition",
            challengeDescription: "All Point multiplier become log(multi)^5" ,
            goalDescription() {
                let base = new Decimal("3.16e10")
                if(inChallenge('al',11)) base = base.pow(0.000001).times(10)                   
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                let a = "Reach "+format(base)+" points"
                return a
            },
            onEnter() {
            player.n.points = new Decimal(0)
                        },
            rewardDescription() {
                let base = new Decimal(1.15)
                if(hasAchievement('ac',95)) base = base.add(0.1)
                if(inChallenge('r',11)) base = base.pow(player.r.chj)
                return "Unlock a new layer and raise Point Boost multiplicative buyable effect by "+format(base)+""},
            canComplete: function() {
                let base = new Decimal("3.16e10")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                return player.points.gte(base)},
            unlocked() {return true},
        },
        13: {
            name: "Chaotic division",
            challengeDescription: "Point gained is ^0.2 and cannot exceed sqrt(number) . Points divide Number gained and vice versa . Number gained ^0.1 and capped passive generation at 100% . Disabled Tickspeed " ,
            goalDescription() { 
                let base = new Decimal("1e30")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                return "Reach "+format(base)+" Points"
            },
            onEnter() {
                layerDataReset('n',true)
                layerDataReset('a',true)
                layerDataReset('s',true)
                        },
            onExit() {
                let base = new Decimal("1e30").times(new Decimal(1.5).pow(player.r.cdcomp))
                if(player.points.gte(base)) {
                player.r.prestigetime = player.r.prestigetime.add(player.r.deltatime.times(600))
                player.r.cdcomp = player.r.cdcomp.add(new Decimal(1).times(player.r.truegamespeed.max(1)))
                } 
            },
            rewardDescription() { 
                let reward = new Decimal(1.5)
                if(inChallenge('r',11)) reward = reward.pow(player.r.chj)
                let base = new Decimal("1e30").times(new Decimal(1.5).pow(player.r.cdcomp)) 
                return "Delay additive and subtractive cost scaling by "+format(reward)+"x . Reach "+format(base)+" points for "+formatTime(player.r.deltatime.times(600))+" Prestige Time"},
            canComplete: function() {
                let base = new Decimal("1e30")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                 return player.points.gte(base)},
            unlocked() {return hasAchievement('ac',57)},
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
            ["raw-html", function () { return tmp.d.passiveGeneration.times(getResetGain(this.layer)).gt(0)?"<h3>You are currently gaining " + format(tmp.d.passiveGeneration.times(getResetGain(this.layer)))+" Divisive/s":"" }, { "color": "crimson", "font-size": "22px", "font-family": "helvetica" }],    
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
    tooltip() {
        let cost = new Decimal(2).pow(player.e.points.pow(1.5)).pow(tmp.e.gainExp.pow(-1)).times("e50").times(tmp.e.gainMult).max("1e50")
        return ""+format(player.e.points,0)+" Exponent </br> Next at "+format(cost)+""},

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
        if(player.r.tetration.gte(7)) multi = multi.pow(1.5)
        if(inChallenge('al',11)) multi = multi.pow(player.al.alteredpow)
        if (inChallenge('r',11)) multi = multi.pow(player.r.chb)


        return multi 
    },
    gainExp() {   
        let e11r = new Decimal(2)
        if(inChallenge('r',11)) e11r = e11r.pow(player.r.chj)
        let e11rr = (new Decimal(100).sub(e11r)).div(100)

        let cont = new Decimal(0.5)
        if (hasUpgrade('e',52)) cont = cont.times(0.75)
        if (hasUpgrade('e',52) && player.r.buyables[121].gte(1)) cont = cont.times(0.9)
        if (hasUpgrade('s',52) && !player.r.buyables[121].gte(1)) cont = cont.times(0.99)
        if (hasChallenge('e',11)) cont = cont.times(e11rr)
        if (hasMilestone('r',1)) cont = cont.times(0.925)
        if (hasUpgrade('m',74) && !player.r.buyables[121].gte(1)) cont = cont.times(0.95)
        if (player.r.tetration.gte(6)) cont = cont.times(0.96)
        let base = new Decimal(1).add(-cont)
        let exp = new Decimal(1)      
        let point = player.e.points.min(10)
        let mul = base.pow(point)                    
        return exp.times(mul)
    },

    layerShown() { return (hasChallenge('d', 12)||hasAchievement('ac',34))},          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "e", description: "E: Reset for Exponent", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    power() {
        let power = new Decimal(0.05)
        if (inChallenge('r',11)) power = power.times(player.r.chd)
        return power
    },

    expeffect() {   
        let power = tmp.e.power
        if(hasAchievement('ac',66)) power = power.times(1.05)
        if(player.r.tetration.gte(7)) power = power.times(1.1)
        return Decimal.pow(player[this.layer].effective.add(1),power)
    },
    effect() {
        let base = new Decimal(5)
        if(inChallenge('r',11)) base = base.pow(player.r.chd)
        let effect = base.pow(player[this.layer].effective) 
        return effect
    },
    resetDescription:"Empower for ",
    infoboxes: {
        lore: {
            title: "Exponent cost",
            body() {
                return "Base cost : "+format(new Decimal(2).pow(player.e.points.pow(1.5)).times("e50"))+" </br> Exponent cost scaling : ^"+format(tmp.e.gainExp.pow(-1))+" (Based on current Exponent , up to 10) </br> Total cost : "+format(new Decimal(2).pow(player.e.points.pow(1.5)).pow(tmp.e.gainExp.pow(-1)).times("e50"))+"  </br> Cost reduction : /"+format(tmp.e.gainMult.pow(-1))+""  },
        },
    },
    automate() {
        hasMilestone('e',6)?player.e.perkpower=buyableEffect('e',12):""
        if(player.e.points.gt(0)) {
            let multi = new Decimal(1)
            if(hasMilestone('e',5)) multi = multi.times((player.e.perkpower.add(10)).log(10))
            if(hasAchievement('ac',74)) multi = multi.pow(1.05)
            player.e.bonus = multi
            let multi2 = player.e.bonus.times(buyableEffect('r',403))
            if(hasAchievement('ac',43)) multi2 = multi2.times(1.2) 
            if(hasAchievement('ac',44)) multi2 = multi2.times(1.2)
            if(hasAchievement('ac',49)) multi2 = multi2.times(1.1)
            if(hasUpgrade('m',71)) multi2 = multi2.times(1.02)
            player.e.effective = player.e.points.times(multi2)
        } else {
            player.e.effective = new Decimal(0)
        }
        if(hasUpgrade('a',41)) {
            setBuyableAmount('e','11',getBuyableAmount('e',11).max(player.e.points)) 
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
        let cost = new Decimal(2).pow(player.e.points.pow(1.5)).pow(tmp.e.gainExp.pow(-1)).times("e50").times(tmp.e.gainMult).max("1e50")
        if(hasAchievement('ac',97) && player.points.gte(cost)) {
            player.e.points = player.e.points.add(1)
        }

        player.e.first = new Decimal(0)
    },
    autoPrestige() {
        return (hasMilestone('e',6) || hasUpgrade('r',21)) && !hasAchievement('ac',97)
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasUpgrade('r',21) && resettingLayer=="r") keep.push("challenges")
        if (hasUpgrade('r',21) && resettingLayer=="r")  keep.push("upgrades")
        if (hasUpgrade('r',22) && resettingLayer=="r")  keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset("e", keep)
    },


    milestones: {
        1: {
            requirementDescription: "2 Exponent",
            effectDescription: "Keep number upgrade on Exponent reset",
            done() { return player.e.points.gte(2) }
        },
        2: {
            requirementDescription: "4 Exponent",
            effectDescription: "Gain +100% of number , multiplicative , divisive gained per second . Disabled while in any Exponent challenge",
            done() { return player.e.points.gte(4) }
        },
        3: {
            requirementDescription: "5 Exponent",
            effectDescription: "Keep Additive and Subtractive upgrade on Exponent reset",
            done() { return player.e.points.gte(5) }
        },
        4: {
            requirementDescription: "6 Exponent",
            effectDescription: "Additive and Subtractive no longer reset your Number ",
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
            effectDescription: "Unlock another layer .",
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
            description() {
                let a = player.r.buyables[121].gte(1)?"(real effect : 32.5%)":""
                return "Exponent Cost scaling increase 25% "+a+" slower (per exponent)"},
            cost: new Decimal(5),},
         53: {
            title: "Delay additive scaling",
            description() {
                let a =  player.r.buyables[121].gte(1)?"and Perk Power":""
                return "Additive cost scaling is delayed based on exponent "+a+" (Base : 100)"
            },
            cost: new Decimal(7),
            effect() {
                let a = player.e.perkpower.add(2).pow(1.2).times(1/2).max(1)
                if(player.r.buyables[121].lt(1)) a = a.times(0)
                let eff = player.e.effective.times(0.5).add(1).pow(1.5).min(500)
                return eff.add(a)
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+" delay" },
        },
        54: {
            title: "Delay subtractitive scaling",
            description: "Subtractive cost scaling is delayed based on exponent (Base : 100)",
            cost: new Decimal(7),
            effect() {
                let eff = player.e.effective.times(0.5).add(1).pow(1.4).min(500)
                return eff
            },
            effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+" delay" },
        },
        61: {
            title : "Strong Perk",
            description: "Gain 1.08x more Perk Point",
            cost : new Decimal(8),
            unlocked() {return hasMilestone('e',6) && !player.r.buyables[121].gte(1)},
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
            unlocked() {return hasMilestone('e',7) && !player.r.buyables[121].gte(1)},
        }
    },

    buyables: {
        11: {
            title() {
                return getBuyableAmount(this.layer, this.id) + "<br/> Perk Point"
               } ,
            cost(x) { 
                let level = x.add(1)
                if(hasUpgrade('r',22)) level = level.times(0.5)
                return level
            },
            display() { return "Gain +" + format(this.effect()) +" Perk Power </br> Require : " + format(this.cost()) + " Exponent " },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buyMax() {return true},
            buy() {
                player[this.layer].points = player[this.layer].points
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {
                return hasMilestone('e',5)
            },
            effect(x) {
                let base = (x.times(100)).pow(0.3)   
               if(hasUpgrade('e',62)) base = base.pow(1.08)             
                return base
            },
            style() {
				if (player.e.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
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
                let a2 = buyableEffect('e',15)
                let sum = a1.add(a2)
                if (hasAchievement('ac',86) && !inChallenge('al',11)) sum = sum.add(hasAchievement('ac',86))
                let multi = new Decimal(1)
                let e11r = new Decimal(1.14)
                if(inChallenge('r',11)) e11r = e11r.pow(player.r.chj)
                if(hasUpgrade('e',61) && !player.r.buyables[121].gte(1)) multi = multi.times(1.08)
                if(hasUpgrade('a',42)) multi = multi.times(upgradeEffect('a',43))
                if(hasUpgrade('e',64) && !player.r.buyables[121].gte(1)) multi = multi.times(1.07)  
                if(hasChallenge('e',11)) multi = multi.times(e11r)
                if(hasAchievement('ac',45)) multi = multi.times(1.08)
                if(hasAchievement('ac',49)) multi = multi.times(1.25)

                let exponent = new Decimal(1)
                if (player.r.tetration.gte(4)) exponent = exponent.times(1.04)
                if (hasUpgrade('al',54)) exponent = exponent.times(1.1)
                if (inChallenge('r',11)) exponent = exponent.times(player.r.chd)

                let total = (sum.times(multi)).pow(exponent)
                return total
            },
            style() {
				 return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'aqua',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        13: {
            title: "Perform a research" ,
            cost(x) { return new Decimal(1.1).pow(player.r.points.pow(1.2)).times(10) },
            display() { return "Gain 1 research . Next research at "+format(this.cost())+" Exponent (not Effective Exponent)" },
            unlocked() {return inChallenge('r',11)},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = new Decimal(0)
                doReset('e',true)
                player.r.points = player.r.points.add(1)
            },
            style() {
                if (player.e.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        14: {
            title: "Perform a Tetration" ,
            cost(x) { return player.r.tetrationcost },
            display() { return "Gain 1 tetration . Next tetration at "+format(this.cost(),0)+" effective exponent" },
            unlocked() {return inChallenge('r',11)},
            canAfford() { return player[this.layer].effective.gte(this.cost()) },
            buy() {
                player[this.layer].points = new Decimal(0)
                doReset('e',true)
                player.r.tetration = player.r.tetration.add(1)
            },
            style() {
                if (player.e.effective.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        15: {
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + "<br/> Perk Point 2"
               } ,
            cost(x) { 
                let level = x.add(1)
                return level.times(1)
            },
            display() { return "Gain +" + format(this.effect()) +" Perk Power </br> Require : " + format(this.cost()) + " Research " },
            canAfford() { return player.r.points.gte(this.cost()) },
            buyMax() {return true},
            buy() {
                player.r.points = player.r.points
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.times(0.5)                
                return base
            },
            unlocked() {
                return player.r.tetration.gte(4)
            },
            style() {
				if (player.r.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        21: {
            title() {
                return +getBuyableAmount(this.layer, this.id) + "<br/> Cheaper Subtractive"
               } ,
            cost(x) { return (x.times(0.04).add(1)).pow(1.3) },
            display() { return "Subtractive cost is /" + format(this.effect()) +" </br> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {!player.r.buyables[121].gte(1)},
            buy() {
                if(player.r.tetration.lt(2)) {
                player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.times(1.2).pow(0.8)                
                let eff = new Decimal(10).pow(base)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)
                return eff
            },
            style() {
				if (player.e.perkpower.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        22: {
            title() {
                return +getBuyableAmount(this.layer, this.id) + "<br/> Cheaper Additive"
               } ,
            cost(x) { return (x.times(0.04).add(1)).pow(1.3) },
            display() { return "Additive cost is /" + format(this.effect()) +" </br> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {!player.r.buyables[121].gte(1)},
            buy() {
                if(player.r.tetration.lt(2)) {
                    player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                    }
                 setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.times(1.2).pow(0.8)                
                let eff = new Decimal(10).pow(base)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)

                return eff
            },
            style() {
				if (player.e.perkpower.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        23: {
            title() {
                return +getBuyableAmount(this.layer, this.id) + "<br/> Cheaper Exponent"
               } ,
            cost(x) { return (x.times(0.1).add(1)).pow(1.5) },
            display() { return "Exponent cost is /" + format(this.effect()) +" <br/> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {!player.r.buyables[121].gte(1)},
            buy() {
                if(player.r.tetration.lt(2)) {
                    player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                    }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.times(3).pow(0.85)                
                let eff =  new Decimal(10).pow(base)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(0)
                return eff
            },
            style() {
				if (player.e.perkpower.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        24: {
            title() {
                return +getBuyableAmount(this.layer, this.id) + "<br/> Discounted"
               } ,
            cost(x) { return (x.times(0.2).add(1)).pow(1.5) },
            display() { return "Subtractive , Additive and Exponent cost are /" + format(this.effect()) +" <br/> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            buy() {
                if(player.r.tetration.lt(2)) {
                    player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                    }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.times(6).pow(0.9)                
                let eff =  new Decimal(10).pow(base)
                if(player.r.buyables[121].gte(1)) eff = eff.pow(2)
                return eff
            },
            style() {
				if (player.e.perkpower.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        25: {
            title() {
                return +getBuyableAmount(this.layer, this.id) + "<br/> Number Booster"
               } ,
            cost(x) { return (x.times(0.8).add(1)).pow(1.1) },
            display() { return "Multiply Number by x" + format(this.effect()) +" <br/> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {return player.r.buyables[121].gte(1)},
            buy() {
                if(player.r.tetration.lt(2)) {
                    player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                    }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x       
                let eff =  new Decimal("1e6").pow(base)
                return eff
            },
            style() {
				if (player.e.perkpower.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        31: {
            title() {
                return +getBuyableAmount(this.layer, this.id) + "<br/> Subtractive Booster"
               } ,
            cost(x) { return (x.times(0.14).add(1)).pow(1.4) },
            display() { return "The effect of Subtract? upgrade is raised ^" + format(this.effect()) +" </br> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {return !player.r.buyables[121].gte(1)},
            buy() {
                if(player.r.tetration.lt(2)) {
                    player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                    }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = (x.times(0.9).add(1)).pow(0.7) 
                if(player.r.buyables[121].gte(1)) base = base.pow(0)               
                return base
            },
            style() {
				if (player.e.perkpower.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        32: {
            title() {
                return +getBuyableAmount(this.layer, this.id) + "<br/> Additive Booster"
               } ,
            cost(x) { return (x.times(0.1).add(1)).pow(1.2) },
            display() { return "The effect of Numberic Increase upgrade is raised ^" + format(this.effect()) +" </br> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            unlocked() {return !player.r.buyables[121].gte(1)},
            buy() {
                if(player.r.tetration.lt(2)) {
                    player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                    }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = (x.times(0.9).add(1)).pow(0.8)
                if(player.r.buyables[121].gte(1)) base = base.pow(0)               
                
                return base
            },
            style() {
				if (player.e.perkpower.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
        33: {
            title: "Additive upgrader" ,
            cost(x) { return new Decimal(6)},
            display() { return "Unlock a new row of additive upgrade </br> Cost : " + format(this.cost()) + " Perk Power" },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Buying any upgrade in that row increase the cost of the other",
            buy() {
                if(player.r.tetration.lt(2)) {
                    player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                    }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x                
                return base
            },
            purchaseLimit:1,
            unlocked() {return hasMilestone('e',6)},
            style() {
				if (player.e.buyables[33].eq(1)) return {
                    'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'100px'
                }
                else if (player.e.perkpower.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				} 
                else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}},
        },
        34: {
            title: "Subtractive upgrader" ,
            cost(x) { return new Decimal(6)},
            display() { return "Unlock a new row of subtractive upgrade </br> Cost : " + format(this.cost()) + " Perk Power " },
            canAfford() { return player[this.layer].perkpower.gte(this.cost()) },
            buyMax() {return true},
            tooltip: "Buying any upgrade in that row increase the cost of the other",
            buy() {
                if(player.r.tetration.lt(2)) {
                    player[this.layer].perkpower = player[this.layer].perkpower.sub(this.cost())
                    }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x                
                return base
            },
            purchaseLimit:1,
            unlocked() {return hasMilestone('e',6)},
            style() {
				if (player.e.buyables[34].eq(1)) return {
                    'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'100px'
                }
                 else if (player.e.perkpower.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
        },
    },
    challenges: {
        11: {
            name: "Equality",
            challengeDescription: "Your Points gained per second cannot exceed square root of number" ,
            goalDescription() {
                let base = new Decimal("1e80")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                return "Reach "+format(base)+" points"},
            rewardDescription() {
                let effect1 = new Decimal("1.14")
                let effect2 = new Decimal(2)
                if(inChallenge('r',11)) effect1 = effect1.pow(player.r.chj) 
                if(inChallenge('r',11)) effect2 = effect2.pow(player.r.chj)
                return "x"+format(effect1)+" Perk Point gained , Exponent cost scaling increase "+format(effect2)+"% slower per Exponent "},
            canComplete: function() {
                let base = new Decimal("1e80")
                if(inChallenge('r',11)) base = base.pow(player.r.chi)
                return player.points.gte("base")},
            unlocked() {return hasMilestone('e',7)},
        },
        12: {
            name: "No number",
            challengeDescription: "Point gained are 10^(log(gain)^0.25) which is worsen based on Point . Tickspeed increase the challenge goal" ,
            goalDescription: function() { 
                let base = new Decimal(10000000)
                let ts = tmp.t.effect.div(1000).add(1).pow(0.5)

                let goal = base.times(ts)
                if(inChallenge('r',11)) goal = goal.pow(player.r.chi)
                return "Reach "+format(goal)+" points"},
            rewardDescription() {
                let base = new Decimal(1.1)
                if(inChallenge('r',11)) base = base.pow(player.r.chj)
                return "Additive and Subtractive cost scaling start x"+format(base)+" later"},
            canComplete: function() {
                let goal = new Decimal(10000000).times(tmp.t.effect.div(1000).add(1).pow(0.5))
                if(inChallenge('r',11)) goal = goal.pow(player.r.chi)
                return player.points.gte(goal)},
            unlocked() {return hasMilestone('e',7)},
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
                        ["row", [["buyable", 11],["buyable", 12],["buyable",13],["buyable",14],["buyable",15]]],
                        ["row", [["buyable", 21],["buyable", 22],["buyable", 23],["buyable",24],["buyable",25]]],
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
            ["raw-html", function () { return "<h3>Exponent provide these bonuses :  ^"+format(tmp.e.expeffect,4)+" and x"+format(tmp.e.effect)+" to Points gained"}, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
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
        spenttick: new Decimal(0),
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
        tetrationmastery:new Decimal(0),
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
        energy: new Decimal(0),
        energypersec: new Decimal(0),

        la1:new Decimal(1),
        la2:new Decimal(1),
        la3:new Decimal(1),
        da1:new Decimal(1),
        da2:new Decimal(1),
        da3:new Decimal(1),
        ta1:new Decimal(1),
        ee1: new Decimal(1),
        //
        a62:new Decimal(1),
        cdcomp: new Decimal(0),
        //best resource (altered)
        nbest: new Decimal(0),
        abest: new Decimal(0),
        sbest: new Decimal(0),
        mbest: new Decimal(0),
        dbest: new Decimal(0),
        ebest: new Decimal(0),
        mabest: new Decimal(0),
        pointbest: new Decimal(0),
        tbest: new Decimal(0),
        //gamespeed
        gamespeed: new Decimal(1),
        gsreq: new Decimal(1),
        gssoftcap: new Decimal(5),
        gsbase: new Decimal(1),
        gsupkeep: new Decimal(1),
        truegamespeed: new Decimal(1),
        //tet
        tetration: new Decimal(0),
        tetrationpower: new Decimal(1),
        tetrationcost: new Decimal(100),
        //challenge
        challengeshard: new Decimal(0),
        potshard: new Decimal(0),
        savedtetration : new Decimal(0),
        savedresearch: new Decimal(0),

        c1: new Decimal(0),  //modifier 1 (Points shredder)
        c2: new Decimal(0),  //modifier 2 (Resource reducer)
        c3: new Decimal(0),  //modiifer 3 (Frozen time)
        c4: new Decimal(0),  //modifier 4 (Weaken exponent)
        c5: new Decimal(0),  //modifier 5 (Cost superscaler)
        c6: new Decimal(0),  //modifier 6 (Algebric failure)
        c7: new Decimal(0),  //modifier 7 (Harden challenge)
        c8: new Decimal(0), //modifier 8 (Ultimatium)

        cha: new Decimal(1), //reduce points gained (1)
        chb: new Decimal(1), //reduce pre-research resource & divisor (2)
        chc: new Decimal(1), //reduce gamespeed (3)
        chd: new Decimal(1), //reduce exponent effect and perk power gained (4)
        che: new Decimal(1), //cost scaling for additive & subtractive start earlier (5)
        chf: new Decimal(1), //the cost scaling for additive and subtractive is stronger (5)
        chg: new Decimal(1), //Decrease A,B,C,X variable gaiend (6)
        chh: new Decimal(1), //Decrease Extension and operation gained (6)
        chi: new Decimal(1), //Increase pre-research challenge goal (7)
        chj: new Decimal(1), //Decrease pre-research challenge reward (7)
        chk: new Decimal(1), //Decrease Mastery per incompleted challenge (7)
    }},
    tooltip() {
    return "Research"
    },

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
        if(inChallenge('r',11)) exp = exp.times(0)               
        return exp
    },

    layerShown() { return (hasMilestone('e', 8)||hasAchievement('ac',39))},          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {key: "r", description: "R: Reset for Research", onPress(){if (canReset(this.layer) && !player.r.infield) doReset(this.layer)}},
    ],
  
    effect() {
        let exponent = new Decimal(4)
        return player.r.best.add(1).pow(exponent)
    },

    effectDescription() {
        return " which is multipling Tickspeed by x"+format(tmp.r.effect)+" (based on research)"
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
      if(hasAchievement('ac',52)) basem = basem.pow(1.15)
      let addm = player.a.points.add(10).log(10)
      let subm = player.s.points.add(10).log(10)
      let mulm = player.m.points.add(10).slog().max(1).pow(1.2)
      if(hasAchievement('ac',53)) mulm = mulm.pow(1.15)
      let divm = player.d.points.add(10).slog().max(1).pow(1.2)
      let expm = player.e.effective.add(10).pow(2).log(10).sub(1)
      let resm = player.r.points.add(1).pow(0.45)
      let resm1 = softcap(resm,new Decimal(1.35),0.3)
      let tetm = player.r.tetration.add(1).pow(0.5)
      let tetm1 = softcap(tetm,new Decimal(1.15),0.25)

        let functionm = player.al.value.add(10).slog().pow(1.2)
        let extensionm = player.al.extension.add(10).log(10).add(9).log(10).pow(2)
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
        player.r.researchmilestone3mastery = player.r.infield?new Decimal(1.2):new Decimal(1)
//harden challenge modifier stuff
        let completedpreresearchchallenge = new Decimal(0)
        if(hasChallenge('m',11)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('m',12)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('d',11)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('d',12)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('d',13)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('e',11)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        if(hasChallenge('e',12)) completedpreresearchchallenge = completedpreresearchchallenge.add(1)
        let masterydivide = player.r.chk.pow(completedpreresearchchallenge.sub(7))

        player.r.mastery = basem.times(addm).times(subm).times(mulm).times(divm).times(expm).times(resm1).times(functionm).times(extensionm).times(operationm).times(player.r.researchmilestone3mastery).times(tetm1).times(masterydivide)


    let dtime = new Decimal(1)
    if(hasUpgrade('t',21)) dtime = dtime.add(upgradeEffect('t',21))
    if(hasUpgrade('t',22)) dtime = dtime.add(upgradeEffect('t',22))
    if(hasUpgrade('t',23)) dtime = dtime.add(upgradeEffect('t',23))
    if(hasUpgrade('t',24)) dtime = dtime.add(upgradeEffect('t',24))
    if(hasAchievement('ac',51)) dtime = dtime.times(5)
    if(player.r.tetration.gte(10)) dtime = dtime.times(player.r.challengeshard.add(1))

        player.r.deltatime = dtime.times(player.r.truegamespeed)



        player.r.bestmastery = player.r.mastery.max(player.r.bestmastery)
        let a =  player.r.points.add(1).pow(4)
        if(hasUpgrade('r',24)) a = a.times(0).add(player.r.best.add(1).pow(4))
        player.r.tickspeedbonus = a 

        player.r.nextmetaresearch = player.r.mastery.div(10000).pow(0.75)


        

        player.r.improvementfactor = getBuyableAmount(this.layer, '101').add(getBuyableAmount(this.layer, '102')).add(getBuyableAmount(this.layer, '103')).add(getBuyableAmount(this.layer, '104')).add(getBuyableAmount(this.layer,'105'))



        player.r.first = new Decimal(0)

        if((hasMilestone('r',3) && !inChallenge('al',11) && (!inChallenge('d',13) || hasChallenge('d',13))) || player.r.tetration.gte(5)) {
           autobuyUpgrades('n')
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


        let dark =  buyableEffect('r',301).times(buyableEffect('r',302)).pow(buyableEffect('r',303))
        if(hasUpgrade('r',41)) dark = dark.times(10)
        if(hasAchievement('ac',102)) dark = dark.times(achievementEffect('ac',102))
        if(player.r.tetration.gte(10)) dark = dark.times(player.r.challengeshard.add(1))


        let twi = player.r.lightadd.times(player.r.darksub)
        if(player.r.tetration.gte(10)) twi = twi.times(player.r.challengeshard.add(1))


        player.r.lightaddpersec = light.times(buyableEffect('r',401)).times(player.r.truegamespeed)
        player.r.darksubpersec = dark.times(buyableEffect('r',401)).times(player.r.truegamespeed)
        player.r.twilightpersec = twi.pow(0.5).div(100).times(player.r.truegamespeed).times(player.r.ee1)

        let leff1 = player.r.lightadd.pow(player.r.lightadd.add(10).log(10).times(4)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let leff11 = softcap(leff1,new Decimal("1e100"),0.05)
        let leff2 = player.r.lightadd.pow(player.r.lightadd.add(10).log(10).times(6)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let leff21 = softcap(leff2,new Decimal("1e200"),0.25)
        leff21 = softcap(leff21,new Decimal("1e1000"),0.2)
        let leff3 = player.r.lightadd.pow(player.r.lightadd.add(10).log(10).times(4).pow(1.5)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let leff31 = softcap(leff3,new Decimal("1e500"),0.05)
        leff31 = softcap(leff31,new Decimal("1e2000"),0.1)
        let deff1 = player.r.darksub.pow(player.r.darksub.add(10).log(10).times(3).pow(1.5)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let deff11 = softcap(deff1,new Decimal("1e800"),0.2)
        deff11 = softcap(deff11,new Decimal("1e4000"),0.1)
        let deff2 = player.r.darksub.pow(player.r.darksub.add(10).log(10).times(5)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let deff21 = softcap(deff2,new Decimal("1e500"),0.15)
        deff21 = softcap(deff21,new Decimal("1e1000"),0.1)
        let deff3 = player.r.darksub.pow(player.r.darksub.add(10).log(10).times(4).pow(1.625)).pow(new Decimal(1).add(buyableEffect('r',402).div(100)))
        let deff31 = softcap(deff3,new Decimal("1e500"),0.05)
        deff31 = softcap(deff31,new Decimal("1e2500"),0.1)
        let teff = player.r.twilight.pow(0.25).add(1)
        let ee1 = player.r.energy.add(2).log(2).pow(3)
        if(hasAchievement('ac',68)) teff = teff.pow(2)
        player.r.la1 = leff11.max(1)
        player.r.la2 = leff21.max(1)
        player.r.la3 = leff31.max(1)
        player.r.da1 = deff11.max(1)
        player.r.da2 = deff21.max(1)
        player.r.da3 = deff31.max(1)
        player.r.ta1 = teff.max(1)
        player.r.ee1 = ee1.max(1)

        let yeartos = new Decimal(31536000)
        if(hasAchievement('ac',62) && player.r.prestigetime.lt(yeartos)) {
            let differencetime = yeartos.sub(player.r.prestigetime)
            differencetime = differencetime.max(0)
            player.r.a62 = differencetime
        } else {
            player.r.a62 = new Decimal(0)
        }
    
        //
        player.r.gssoftcap = new Decimal(5)
        let basetime =  player.r.gsbase.pow(2).times(1000)
        if(player.r.gsbase.gt(player.r.gssoftcap)) basetime = basetime.times(new Decimal(2).pow(player.r.gsbase.sub(player.r.gssoftcap)))
        player.r.gsreq = basetime.sub(1000)
        player.r.gsupkeep = player.t.points.div(player.r.gsreq.max(1))

        let gspd = player.r.gamespeed
        let ospd = player.o.gamespeed

        let basegamespeed = gspd.times(ospd)
        if (inChallenge('r',11)) basegamespeed = basegamespeed.div(player.r.chc)
        if (hasAchievement('ac',99)) basegamespeed = basegamespeed.times(2)
        if (hasAchievement('ac',101)) basegamespeed = basegamespeed.times(achievementEffect('ac',101))
        player.r.truegamespeed = basegamespeed

        //
        basetetcost = new Decimal(100).times(new Decimal(1.09).pow(player.r.tetration)).floor()
        if(player.r.tetration.gte(6)) basetetcost = basetetcost.add(player.r.tetration.times(player.r.tetration))
        if(hasAchievement('ac',103)) basetetcost = basetetcost.sub(15)
        player.r.tetrationcost = basetetcost
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
            player.r.tbest = player.r.tbest.max(tmp.t.effect)

        }
        //challenge stuff 
            player.r.potshard = player.r.c1.add(player.r.c2).add(player.r.c3).add(player.r.c4).add(player.r.c5).add(player.r.c6).add(player.r.c7).add(player.r.c8)
            let ulti = player.r.c8.times(0.5)
            player.r.cha = new Decimal(0.85).pow(player.r.c1.add(ulti))
            player.r.chb = new Decimal(0.92).pow(player.r.c2.add(ulti))
            player.r.chc = player.r.c3.add(ulti).add(1).tetrate(2)
            player.r.chd = new Decimal(0.8).pow(player.r.c4.add(ulti))
            player.r.che = new Decimal(1.2).pow(player.r.c5.add(ulti))
            player.r.chf = new Decimal(1.1).pow(player.r.c5.add(ulti))
            player.r.chg = new Decimal(0.93).pow(player.r.c6.add(ulti))
            player.r.chh = new Decimal(0.95).pow(player.r.c6.add(ulti))
            player.r.chi = new Decimal(1.15).pow(player.r.c7.add(ulti))
            player.r.chj = new Decimal(1).sub(player.r.c7.add(ulti).div(2.5))
            player.r.chk = new Decimal(1.015).pow(player.r.c7.add(ulti))


            if(inChallenge('r',11)| inChallenge('al',11) ) {
                if(player.n.points.gt(getResetGain('n').times(tmp.n.passiveGeneration).times("1e10")) && player.e.points.eq(0)) {
                    player.n.points = getResetGain('n').times("1e10").times(tmp.n.passiveGeneration)
                }
            }
            //Energy
            let energygain = (new Decimal(1).times(buyableEffect('r',501)).times((player.r.energy.add(1)).pow(-0.25)))
            if(player.r.tetration.gte(10)) energygain = energygain.times(player.r.challengeshard.add(1))
            player.r.energypersec = energygain
        },
    update(delta) {
        player.r.prestigetime = player.r.prestigetime.add(player.r.deltatime.times(delta))

        player.r.lightadd = player.r.lightadd.add(player.r.lightaddpersec.times(delta))
        player.r.darksub = player.r.darksub.add(player.r.darksubpersec.times(delta))

        player.r.twilight = player.r.twilight.add(player.r.twilightpersec.times(delta))

        let yeartos = new Decimal(31536000)
        if(hasAchievement('ac',62) && player.r.prestigetime.lt(yeartos) && !inChallenge('al',11)) {
            let differencetime = yeartos.sub(player.r.prestigetime)
            differencetime = differencetime.max(0)
            player.r.prestigetime = player.r.prestigetime.add(differencetime.div(300).times(delta).times(player.r.truegamespeed))
        } 
        if(player.r.gamespeed.gt(1)) {
            player.t.points = player.t.points.sub(player.r.gsreq.times(delta))
            player.r.spenttick = player.r.spenttick.add(player.r.gsreq.times(delta))
        }
            player.r.energy = player.r.energy.add(player.r.energypersec.times(delta).times(player.r.truegamespeed))
    },

    milestones: {
        1: {
            requirementDescription: "1 Research (1)",
            effectDescription: "Always buy (most) Perk Power buyable and autobuy Additive & Subtractive . Exponent cost scaling increase 7.5% slower per Exponent ",
            done() { return player.r.points.gte(1) }
        },
        2: {
            requirementDescription: "2 Research (2)",
            effectDescription: "Gain +100% Number , Multiplicative , Divisive passively . Also keep Number and Row 2 upgrade on Research reset ",
            done() { return player.r.points.gte(2) }
        }, 
        3: {
            requirementDescription: "3 Research (3)",
            effectDescription: "Gain x1.2 Mastery when inside any field and autobuy Row 1 - Row 3 Upgrade",
            done() { return player.r.points.gte(3) }
        },                  
    },
    upgrades: {
        11: {
            title: "Simple Number",
            description: "Row 2 Number upgrade is always unlocked and cost ^0.25",
            cost: new Decimal("0.25"),
            tooltip:"Unlock Row 2 Number upgrade , their upgrade cost is ^0.25 . This doesn't stack with 'Number QOL' algebric upgrade",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         12: {
            title: "Passive Number",
            description: "Gain +100% of Number gained per second , and a 1e9x additional multiplier",
            cost: new Decimal("0.2"),
            tooltip:"Gain 100% of number gained on reset per second (unaffected by tickspeed)",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch", 
            unlocked() { return true }},
         13: {
            title: "Keep Row2 I",
            description: "Keep Additive and Subtractive resource on any reset",
            cost: new Decimal("0.4"),
            tooltip:"Prevent anything from being reset , do not work when entering altered",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         14: {
            title: "Passive Row2 I",
            description: "Autobuy Additive , Subtractive at no cost",
            cost: new Decimal("0.5"),
            tooltip:"Automaticly gain Additive and Subtractive at no cost",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         15: {
            title: "Keep row2 II",
            description: "Keep multiplicative , divisive resource on reset",
            cost: new Decimal("0.5"),
            tooltip:"Prevent anything from being reset , do not work when entering altered",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         21: {
            title: "Keep Exponent",
            description: "Keep Exponent upgrade , challenge completion on reset and autobuy Exponent",
            cost: new Decimal("0.6"),
            currencyLocation() { return player.r },
            tooltip:"Always keep Exponent Upgrade , challenge and even autobuy without reaching their respective milestone (even while altered)",
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         22: {
            title: "Easier Perk",
            description: "Perk Point (Exponent) buyable requirement are /2 . Keep Exponent Milestone on reset",
            cost: new Decimal("0.75"),
            currencyLocation() { return player.r },
            tooltip:"Reduce Perk Point buyable cost by /2 and keep Exponent Milestone on reset",
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         23: {
            title: "Mistakeless Research",
            description: "Improvement reset do not decrease Prestige Time",
            cost: new Decimal("0.2"),
            currencyLocation() { return player.r },
            tooltip:"Resetting Research Improvement do not decrease Prestige Time ",
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         24: {
            title: "Effortless Research",
            description: "Best research boost Tickspeed instead of current research",
            cost: new Decimal("0.4"),
            tooltip:"Tickspeed bonus from Research is calculated using best Research ever instead",
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         31: {
            title: "Passive Extension",
            description: "You gain 10% of Extension gained next reset per second and autobuy all operation upgrade and buyable",
            cost: new Decimal("0.5"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         32: {
            title: "Easier Extension",
            description: "Automaticly buy all variable & main upgrade and keep algebric upgrade on Operation reset",
            cost: new Decimal("0.5"), 
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         33: {
            title: "Simple Operation",
            description: "Automaticly buy Operation upgrade and buyable",
            cost: new Decimal("1"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         41: {
            title: "Lightness",
            description: "x10 Light additive gained",
            cost: new Decimal("2"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         42: {
            title: "Darkness",
            description: "x10 Dark subtractive gained",
            cost: new Decimal("2"),
            currencyLocation() { return player.r },
            currencyDisplayName: "Meta research",
            currencyInternalName: "metaresearch",
            unlocked() { return true }},
         51: {
            title: "Operationless",
            description: "Gain operation outside of altered realm (based on Points)",
            tooltip:"You can also buy 'More Operation' improvement outside of Altered realm if you enter (^) No Number and (/) Worsen Condition challenge (after buying this upgrade)",
            cost: new Decimal("2.5"),
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
                setBuyableAmount(this.layer, '105' ,new Decimal(0))

                player.n.points = new Decimal(0)
                player.m.points = new Decimal(0)
                player.d.points = new Decimal(0)
                doReset('e',true)
                if(hasUpgrade('r',23)) {
                    player.r.prestigetime = player.r.prestigetime.times(4).div(3)
                }
            },
            style() {
               return {
					'border-radius': '0%',
					'color':'aqua',
					'background-color':'green',
					'border':'2px solid',
					'height':'100px'
				}}

        },
        101: {
            title() {
                let a = player.r.buyables[101].gte(10)?"Super":"More"
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> "+a+" Fatigued  "
               } ,
            cost(x) { 
                let level = x
                if(player.r.buyables[101].gte(10)) level = (level.div(10)).pow(3).times(10)
                let extralevel = player.r.improvementfactor
                let cost = level.add(extralevel)
                return new Decimal("1e6").pow(cost.pow(1.45)).times("1e100") },
            display() { 
            return "You must be inside of Fatigue (Multiplicative) challenge and reached "+format(this.cost())+" points <br/> Effect : Multiply Multiplicative gained by " + format(this.per()) + " (Slowly increasing) .</br> Current : x"+format(this.effect())+"  " },
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
            },
            style() {
                 if (!inChallenge('m',11)) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				} 
				else if (player.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        102: {
            title() {
                let a = player.r.buyables[102].gte(10)?"Super":"More"
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> "+a+" Hardness  "
               } ,
            cost(x) {
                let level = x
                if(player.r.buyables[102].gte(10)) level = (level.div(10)).pow(3).times(10)
                let extralevel = player.r.improvementfactor
                let cost = level.add(extralevel)
                return new Decimal(10).pow(cost.pow(1.225)).times("1e9") },
            display() { 
                return "You must be inside of Worsen Condition (Divisive) challenge and reached "+format(this.cost())+" points <br/> Effect : Multiply Divisive gained by " + format(this.per()) + "x  (Slowly increasing) . Current : x"+format(this.effect())+"" },
            canAfford() { return player.points.gte(this.cost()) && inChallenge('d',12)},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(30)
                let base = player.r.prestigetime.pow(time).pow(1.25)
                let sfcbase = base.pow(x)
                return sfcbase           
            },
            per() {
                let time = player.r.prestigetime.add(10).log(30)
                let base = player.r.prestigetime.pow(time).pow(1.25)
                return base
            },
            style() {
                if (!inChallenge('d',12)) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				} 
				else if (player.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        103: {
            title() {
                let a = player.r.buyables[103].gte(10)?"Super":"More"
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> "+a+" Equality  "
               } ,
            cost(x) { 
               let level = x
               if(player.r.buyables[103].gte(10)) level = (level.div(10)).pow(3).times(10)
               let extralevel = player.r.improvementfactor
                let cost = level.add(extralevel)
                return new Decimal("1e5").pow(cost.pow(1.7)).times("1e10")},
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
            },
            style() {
                if (!inChallenge('e',11)) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				} 
				else if (player.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        104: {
            title() {
                let a = player.r.buyables[104].gte(10)?"Super":"More"
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> "+a+" Letter  "
               } ,
            cost(x) { 
                let level = x
                if(player.r.buyables[104].gte(10)) level = (level.div(10)).pow(3).times(10)
                let extralevel = player.r.improvementfactor
                let cost = level.add(extralevel)
                return new Decimal(10).pow(cost.pow(1.05)).times("1e3")},
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
            },
            style() {
                if (!inChallenge('e',12)) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				} 
				else if (player.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        105: {
            title() {
                let a = player.r.buyables[105].gte(10)?"Super":"More"
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> "+a+" Operation  "
               } ,
            cost(x) { 
                 let level = x
                 if(player.r.buyables[105].gte(10)) level = (level.div(10)).pow(3).times(10)
                 let extralevel = player.r.improvementfactor
                let cost = level.add(extralevel)
                return new Decimal(10).pow(cost.pow(1.5)).times("1e3") },
            display() { 
                return "You must be inside of Altered realm and reached "+format(this.cost())+" points <br/> Effect : Gain " + format(this.per()) + "x Operation per upgrade (Slowly increasing) </br> Current : x"+format(this.effect())+"  " },
            canAfford() { return player.points.gte(this.cost()) && (inChallenge('al',11) || (hasUpgrade('r',51) && inChallenge('e',12) && inChallenge('d',12))) }, 
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(100)
                let base = player.r.prestigetime.pow(time)
                let sfcbase = softcap(base,new Decimal(1),0.05)                
                let sfcbase1 = sfcbase.pow(x)
                return sfcbase1           
            },
            per() {
                let time = player.r.prestigetime.add(10).log(100)
                let base = player.r.prestigetime.pow(time)
                let sfcbase = softcap(base,new Decimal(1),0.05) 
                return sfcbase
            },
            unlocked() {return hasAchievement('ac',59) && player.r.algebraf.gte(1)},
            style() {
                if (!inChallenge('al',11) && !(inChallenge('e',12) && inChallenge('d',12) && hasUpgrade('r',51))) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				} 
				else if (player.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        110: {
            title() {
                return "META RESET"
               } ,
            cost() { 
                new Decimal(0) },
            canAfford() { return player.r.mastery.gte(10000)},
            buy() {
                if (!confirm("Performing a Meta-Reset will reset EVERY PRIOR layer , including field study and non permeant research (Improvement , Research milestone). Are you sure?")) return

                //reset algebra (pre extension)
                player.al.buyables[11] = new Decimal(0)
                player.al.buyables[12] = new Decimal(0)
                player.al.buyables[13] = new Decimal(0)
                player.al.buyables[14] = new Decimal(0)

                player.al.x = new Decimal(0)
                player.al.deltax = new Decimal(0)

                player.al.extension = player.al.extension.add(player.al.extensiongain)
                player.al.points = player.al.points.times(0)
        
                    for (let i = 0; i < player.al.upgrades.length; i++) {
                    
                            player.al.upgrades.splice(i, 1);
                            i--;
                        
                    }
                    for (let i = 0; i < player.r.milestones.length; i++) {
                    
                        player.r.milestones.splice(i, 1);
                        i--;
                    
                }
             
                //reset algebra (extension phase)
                player.al.extension = new Decimal(0)
                player.al.operation = new Decimal(0)    

                player.al.buyables[21] = new Decimal(0)
                player.al.buyables[22] = new Decimal(0)
                player.al.buyables[23] = new Decimal(0)
                player.al.buyables[24] = new Decimal(0)
                player.al.buyables[31] = new Decimal(0)
                player.al.buyables[32] = new Decimal(0)
                player.al.buyables[33] = new Decimal(0)
                player.al.buyables[34] = new Decimal(0)

                player.al.resetcooldown = new Decimal(30)

                //reset Research
                player.r.points = new Decimal(0)
                buyBuyable('r',11)
                player.r.cdcomp = new Decimal(0)
                
                player.r.prestigetime = new Decimal(0)
                player.r.metaresearch = player.r.metaresearch.add(player.r.nextmetaresearch)

                player.r.algebraf = player.r.algebraf.times(0)
                player.r.geometryf = player.r.geometryf.times(0)
                player.r.infield = false
                doReset('r',true)
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
        120: {
            title() {
                return "Tetration reset"
               } ,
            cost() { 
                new Decimal(0) },
            canAfford() { return player.e.effective.gte(player.r.tetrationcost)},
            unlocked() {
                return !inChallenge('r',11) && player.r.tetration.lt(10)
            },
            buy() {
                if (!confirm("Increase your Tetration will allow you to gain powerful buff to progression but force a Meta-Research reset . Are you sure?")) return

                doReset('r',true)
                //reset algebra (pre extension)
                player.al.buyables[11] = new Decimal(0)
                player.al.buyables[12] = new Decimal(0)
                player.al.buyables[13] = new Decimal(0)
                player.al.buyables[14] = new Decimal(0)

                player.al.x = new Decimal(0)
                player.al.deltax = new Decimal(0)

                player.al.extension = player.al.extension.add(player.al.extensiongain)
                player.al.points = player.al.points.times(0)
        
                    for (let i = 0; i < player.al.upgrades.length; i++) {
                    
                            player.al.upgrades.splice(i, 1);
                            i--;
                        
                    }
                    for (let i = 0; i < player.r.milestones.length; i++) {
                    
                        player.r.milestones.splice(i, 1);
                        i--;
                    
                }
             
                //reset algebra (extension phase)
                player.al.extension = new Decimal(0)
                player.al.operation = new Decimal(0)    

                player.al.buyables[21] = new Decimal(0)
                player.al.buyables[22] = new Decimal(0)
                player.al.buyables[23] = new Decimal(0)
                player.al.buyables[24] = new Decimal(0)
                player.al.buyables[31] = new Decimal(0)
                player.al.buyables[32] = new Decimal(0)
                player.al.buyables[33] = new Decimal(0)
                player.al.buyables[34] = new Decimal(0)

                player.al.resetcooldown = new Decimal(30)

                //reset Research

                player.r.points = new Decimal(0)
                buyBuyable('r',11)
                player.r.cdcomp = new Decimal(0)
                
                player.r.prestigetime = new Decimal(0)
                player.r.tetration = player.r.tetration.add(1)

                player.r.algebraf = player.r.algebraf.times(0)
                player.r.geometryf = player.r.geometryf.times(0)
                player.r.infield = false
                doReset('r',true)
            },  
            style() {
				if (player.e.effective.lt(player.r.tetrationcost)) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'red',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        121: {
            title() {
                return "Upgrade Condenser"
               } ,
            cost(x) { 
                return new Decimal(1) },
            display() { 
            return "All Pre Research upgrade with similar buff is condensed to 1 upgrade . Any other upgrade with important purpose will not be condensed . Require : 1 Challenge shard" },
            canAfford() { return player.r.challengeshard.gte(this.cost())},
            buy() {
                if (!confirm("Condensing upgrade will significantly alter the game and force all existing upgrade to be removed . Do you want to proceed?")) return
                layerDataReset('n')
                layerDataReset('a')
                layerDataReset('s')
                layerDataReset('m')
                layerDataReset('e')
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                
            },
            effect(x) {
                let time = player.r.prestigetime.add(10).log(4)
                let base = player.r.prestigetime.pow(time)
                let sfcbase = base.pow(x)
                return sfcbase                
            },
            purchaseLimit() {return new Decimal(1)},
            style() {
                 if (player.r.challengeshard.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        201: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Light Additive Generator  "
               } ,
            cost(x) { 
                return x.pow(2).times(100) },
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
            style() {
                if (player.a.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
            
        },
        202: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Light Additive Multiplier  "
               } ,
            cost(x) { 
                return new Decimal(1.25).pow(x.pow(1.5)).times(5) },
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
            style() {
                if (player.r.lightadd.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        203: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Light Additive Powerer  "
               } ,
            cost(x) { 
                return new Decimal(2).pow(x.pow(1.4)).times(10) },
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
            style() {
                if (player.r.lightadd.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        301: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Dark Subtractive Generator  "
               } ,
            cost(x) { 
                return x.pow(2).times(100) },
            display() { 
                return "Generate +"+format(this.effect())+" Dark Subtractive . Req : "+format(this.cost())+" Subtractive " },
            canAfford() { return player.s.points.gte(this.cost())},
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let base = x.pow(3).div(1000)
                return base      
            },
            style() {
                if (player.s.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        302: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Dark Subtractive Multiplier  "
               } ,
            cost(x) { 
                return new Decimal(1.25).pow(x.pow(1.6)).times(5) },
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
            style() {
                if (player.r.darksub.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        303: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Dark Subtractive Powerer  "
               } ,
            cost(x) { 
                return new Decimal(2).pow(x.pow(1.3)).times(10) },
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
            style() {
                if (player.r.darksub.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
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
                let base = new Decimal(1.25).pow(x)
                return base      
            },
            style() {
                if (player.r.twilight.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        402: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Twilight Strength  "
               } ,
            cost(x) { 
                return new Decimal(2).pow(x.pow(1.1)).times(4) },
            display() { 
                return "Increase the effect of Light Additive and Dark Subtractive primary bonus by +"+format(this.base())+"% . Cost : "+format(this.cost())+" Twilight " },
            canAfford() { return player.r.twilight.gte(this.cost())},
            buy() {
                player.r.twilight = player.r.twilight.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.times(2)
                let base1 = softcap(base,new Decimal(20),0.5)
                if(hasUpgrade('r',51)) base1 = (base1.add(100)).times(1.2).sub(100)
                if (inChallenge('al',11)) base1 = base1.times(0).sub(100)
                if (inChallenge('r',11)) base1 = base1.times(0).sub(100)
                return base1
            },
            base() {
                let base = player.r.buyables[402].times(2)
                let base1 = softcap(base,new Decimal(20),0.5)
                return base1
            }, 
            style() {
                if (player.r.twilight.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        403: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "/25 <br/> Twilight Improver"
               } ,
            cost(x) { 
                return new Decimal(3).pow(x).times(x) },
            display() { 
                return "Gain x"+format(this.effect())+" Effective Exponent . Cost : "+format(this.cost())+" Twilight " },
            canAfford() { return player.r.twilight.gte(this.cost())},
            buy() {
                player.r.twilight = player.r.twilight.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = x.div(100).add(1)
                return base      
            },
            style() {
                if (player.r.twilight.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}},
            purchaseLimit:25
        },
        501: {
            title() {
                return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Energy Booster  "
               } ,
            cost(x) {
                let lvl = x
                let level = x
                if(lvl.gte(25)) level = (level.div(25)).pow(1.25).times(25)
                if(lvl.gte(100)) level = level.times(lvl.div(100))

                let base = (new Decimal(2).pow(level.pow(1.1))).sub(1) 
                return base

            },
            unlocked() {return hasAchievement('ac',96)},

            display() { 
                return "x"+format(this.effect())+" Energy gained . Cost : "+format(this.cost())+" Energy " },
            canAfford() { return player.r.energy.gte(this.cost())},
            buy() {
                player.r.energy = player.r.energy.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            effect(x) {
                let base = new Decimal(2).pow(x.pow(1.25)).sub(1)
                return base      
            },
            style() {
                if (player.r.energy.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'crimson',
					'border':'2px solid',
					'height':'125px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        1001: {
            title() {
                return "+1 Gamespeed factor"
               } ,
            cost(x) { 
                return new Decimal(0)},
            canAfford() { return player.r.gamespeed.eq(1)},
            buy() {
               player.r.gsbase = player.r.gsbase.add(1)

            },
            style() {
                if (player.r.gamespeed.gt(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
				 else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        1002: {
            title() {
                return "-1 Gamespeed factor"
               } ,
            cost(x) { 
                return new Decimal(0) },
            canAfford() { return player.r.gamespeed.eq(1) && player.r.gsbase.gt(1)},
            buy() {
                player.r.gsbase = player.r.gsbase.sub(1)
            },
            style() {
                if (player.r.gamespeed.gt(1) || player.r.gsbase.eq(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'red',
                   'border':'2px solid',
                   'height':'125px'
               }}
        },
        1003: {
            title() {
                return "Activate Gamespeed (Current : "+format(player.r.gamespeed,0)+"x)"
               } ,
            cost(x) { 
                return new Decimal(0)},
            canAfford() { return player.r.gsbase.gte(1) && player.r.gamespeed.eq(1) && !player.r.gsbase.eq(1) && player.r.gsupkeep.gte(10)},
            buy() {
               player.r.gamespeed = player.r.gsbase

            },
            style() {
                if (!player.r.gamespeed.eq(1) || player.r.gsbase.eq(1) || player.r.gsupkeep.lt(10)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'green',
                   'border':'2px solid',
                   'height':'125px'
               }}
        },
        1004: {
            title() {
                return "Deactivate Gamespeed"
               } ,
            cost(x) { 
                return new Decimal(0) },
            canAfford() { return player.r.gsbase.gte(1) && !player.r.gamespeed.eq(1)},
            buy() {
                player.r.gamespeed = new Decimal(1)
            },
            style() {
                if (player.r.gamespeed.eq(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'red',
                   'border':'2px solid',
                   'height':'125px'
               }}
        
        },
        1010: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0)},
            canAfford() { return player.r.c1.gte(1)},
            buy() {
               player.r.c1 = player.r.c1.sub(1)

            },
            style() {
                if (player.r.c1.lt(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
				 else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'red',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        1011: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0) },
            canAfford() { return player.r.c1.gte(0) && player.r.c1.lt(8)},
            buy() {
                player.r.c1 = player.r.c1.add(1)
            },
            style() {
                if (player.r.c1.eq(8)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'green',
                   'border':'2px solid',
                   'height':'125px'
               }}
        },
        1020: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0)},
            canAfford() { return player.r.c2.gte(1)},
            buy() {
               player.r.c2 = player.r.c2.sub(1)

            },
            style() {
                if (player.r.c2.lt(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
				 else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'red',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        1021: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0) },
            canAfford() { return player.r.c2.gte(0) && player.r.c2.lt(8)},
            buy() {
                player.r.c2 = player.r.c2.add(1)
            },
            style() {
                if (player.r.c2.eq(8)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'green',
                   'border':'2px solid',
                   'height':'125px'
               }}
        },
        1030: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0)},
            canAfford() { return player.r.c3.gte(1)},
            buy() {
               player.r.c3 = player.r.c3.sub(1)

            },
            style() {
                if (player.r.c3.lt(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
				 else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'red',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        1031: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0) },
            canAfford() { return player.r.c3.gte(0) && player.r.c3.lt(8)},
            buy() {
                player.r.c3 = player.r.c3.add(1)
            },
            style() {
                if (player.r.c3.eq(8)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'green',
                   'border':'2px solid',
                   'height':'125px'
               }}
        },
       1040: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0)},
            canAfford() { return player.r.c4.gte(1)},
            buy() {
               player.r.c4 = player.r.c4.sub(1)

            },
            style() {
                if (player.r.c4.lt(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
				 else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'red',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        1041: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0) },
            canAfford() { return player.r.c4.gte(0) && player.r.c4.lt(8)},
            buy() {
                player.r.c4 = player.r.c4.add(1)
            },
            style() {
                if (player.r.c4.eq(8)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'green',
                   'border':'2px solid',
                   'height':'125px'
               }}
        },
        1050: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0)},
            canAfford() { return player.r.c5.gte(1)},
            buy() {
               player.r.c5 = player.r.c5.sub(1)

            },
            style() {
                if (player.r.c5.lt(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
				 else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'red',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        1051: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0) },
            canAfford() { return player.r.c5.gte(0) && player.r.c5.lt(8)},
            buy() {
                player.r.c5 = player.r.c5.add(1)
            },
            style() {
                if (player.r.c5.eq(8)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'green',
                   'border':'2px solid',
                   'height':'125px'
               }}
        },
        1060: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0)},
            canAfford() { return player.r.c6.gte(1)},
            buy() {
               player.r.c6 = player.r.c6.sub(1)

            },
            style() {
                if (player.r.c6.lt(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
				 else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'red',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        1061: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0) },
            canAfford() { return player.r.c6.gte(0) && player.r.c6.lt(8)},
            buy() {
                player.r.c6 = player.r.c6.add(1)
            },
            style() {
                if (player.r.c6.eq(8)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'green',
                   'border':'2px solid',
                   'height':'125px'
               }}
        },
        1070: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0)},
            canAfford() { return player.r.c7.gte(1)},
            buy() {
               player.r.c7 = player.r.c7.sub(1)

            },
            style() {
                if (player.r.c7.lt(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
				 else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'red',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        1071: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0) },
            canAfford() { return player.r.c7.gte(0) && player.r.c7.lt(8)},
            buy() {
                player.r.c7 = player.r.c7.add(1)
            },
            style() {
                if (player.r.c7.eq(8)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'green',
                   'border':'2px solid',
                   'height':'125px'
               }}
        },
        1080: {
            title() {
                return "-1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0)},
            canAfford() { return player.r.c8.gte(1)},
            buy() {
               player.r.c8 = player.r.c8.sub(1)

            },
            style() {
                if (player.r.c8.lt(1)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
				 else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'red',
					'border':'2px solid',
					'height':'125px'
				}}
        },
        1081: {
            title() {
                return "+1 difficulty"
               } ,
            cost(x) { 
                return new Decimal(0) },
            canAfford() { return player.r.c8.gte(0) && player.r.c8.lt(8)},
            buy() {
                player.r.c8 = player.r.c8.add(1)
            },
            style() {
                if (player.r.c8.eq(8)) {
                    return {
                        'border-radius': '0%',
                        'color':'white',
                        'background-color':'black',
                        'border':'2px solid',
                        'height':'125px'
                    } 
                }
                else return {
                   'border-radius': '0%',
                   'color':'white',
                   'background-color':'green',
                   'border':'2px solid',
                   'height':'125px'
               }}
        },
        

      
       
    },
    challenges: {
        11: {
            name: "Meta Research challenge",
            canComplete: function() {
                return player.r.mastery.gte(10000)},

            challengeDescription: "Various resource are reduced based on Modifier selection" ,
            goalDescription: "Reach 10,000 Mastery",
            rewardDescription: "Gain 1 challenge shard for each modifier level (max:64). Replace your current challenge shard if higher",
            unlock() {return true},
            onEnter() {
                player.r.savedtetration = player.r.tetration
                player.r.savedresearch = player.r.points
                layerDataReset('e')
                layerDataReset('d')
                layerDataReset('m')
                layerDataReset('s')
                layerDataReset('a')
                layerDataReset('n')
                layerDataReset('al')
                player.r.points = new Decimal(0)
                doReset('r',true)
                player.r.tetration = new Decimal(0)
                player.al.bankedprestigetime = player.r.prestigetime
                player.r.prestigetime = new Decimal(0)
                player.points = new Decimal(10)
                player.al.bank1 = player.r.buyables[101]
                player.al.bank2 = player.r.buyables[102]
                player.al.bank3 = player.r.buyables[103]
                player.al.bank4 = player.r.buyables[104]
                player.r.buyables[101] = new Decimal(0)
                player.r.buyables[102] = new Decimal(0)
                player.r.buyables[103] = new Decimal(0)
                player.r.buyables[104] = new Decimal(0)
                    for (let i = 0; i < player.r.milestones.length; i++) {
                    
                        player.r.milestones.splice(i, 1);
                        i--;
                    
                }
                player.r.algebraf = player.r.algebraf.times(0)
                player.r.geometryf = player.r.geometryf.times(0)
                player.r.infield = false
                doReset('e',true)
                player.points = new Decimal(10)
            },
            onExit() {
                if(player.r.mastery.gte(10000)) {
                    player.r.challengeshard = player.r.challengeshard.max(player.r.potshard)
                }
                player.r.tetration = player.r.tetration.max(player.r.savedtetration)
                player.r.points = player.r.points.max(player.r.savedresearch)
                player.r.savedresearch = new Decimal(0)
                player.r.savedtetration = new Decimal(0)
                player.r.prestigetime = player.r.prestigetime.max(player.al.bankedprestigetime)
                player.al.bankedprestigetime = new Decimal(0)
                if(hasAchievement('ac',79)) {
                    player.r.buyables[101] = player.al.bank1
                    player.r.buyables[102] = player.al.bank2
                    player.r.buyables[103] = player.al.bank3
                    player.r.buyables[104] = player.al.bank4 
                }
                    player.al.bank1 = new Decimal(0)
                    player.al.bank2 = new Decimal(0)
                    player.al.bank3 = new Decimal(0)
                    player.al.bank4 = new Decimal(0)
                
            },
            style() {
                return {
                     'border-radius': '0%',
                     'color':'red',
                     'background-color':'black',
                     'border':'4px solid',
                     'height':'250px'
                 }}

        },
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
                ["raw-html", function () { return player.r.tetration.gte(1)?"<h3>Current tetration: " + format(player.r.tetration) + "  -> " + format(player.r.tetrationmastery) + "x mastery":""}, { "color": "grey", "font-size": "18px", "font-family": "helvetica" }],
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
        "Challenge" : {
            buttonStyle() { return { 'color': 'red' , "border-color" : "red" } },
            unlocked() { return player.r.tetration.gte(8) || inChallenge('r',11) },
            content: [
                


        ["microtabs", "challenge", { 'border-width': '0px' }],
     
            ]
        },
        "Permeant research": {
            buttonStyle() { return { 'color': '#ffffff' , "border-color" : "gray" } },
            unlocked() { return true },
            content:

                [
        ["microtabs", "other", { 'border-width': '0px' }],
    ]

        },
    },
    modifier : {
        "Point shredder" : {
            content : [
                ["raw-html", function () { return "<h2> Point shredder : Point gained are ^"+format(player.r.cha)+"" }, { "color": "red", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c1,0)+"/8" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["row", [["buyable", 1010], ["buyable", 1011]]],


            ]
        }, 
        "Resource reduction" : {
            content : [
                ["raw-html", function () { return "<h2> Resource reduction : Pre-Research resource gained and cost reduction (except Points gained) are ^"+format(player.r.chb)+"" }, { "color": "orange", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c2,0)+"/8" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["row", [["buyable", 1020], ["buyable", 1021]]],


            ]

        },
        "Frozen time" : {
            content : [
                ["raw-html", function () { return "<h2> Frozen time : Gamespeed is divided by /"+format(player.r.chc)+"" }, { "color": "yellow", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c3,0)+"/8" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["row", [["buyable", 1030], ["buyable", 1031]]],


            ]
        },
        "Weaken exponent" : {
            content : [
                ["raw-html", function () { return "<h2> Weaken exponent : Exponent effect and Perk Power is raised ^"+format(player.r.chd)+"" }, { "color": "lime", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c4,0)+"/8" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["row", [["buyable", 1040], ["buyable", 1041]]],

 
            ]
        },
        "Cost superscaler" : {
            content : [
                ["raw-html", function () { return "<h2> Cost superscaler : Additive , Subtractive cost scaling start "+format(player.r.che)+"x earlier and their strength are increased by "+format(player.r.chf)+"x" }, { "color": "cyan", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c5,0)+"/8" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["row", [["buyable", 1050], ["buyable", 1051]]],

            ]
        },
        "Algebric failure" : {
            content : [
                ["raw-html", function () { return "<h2> Algebric failure : A,B,C,X gained are ^"+format(player.r.chg)+" and Extension , Operation gained are ^"+format(player.r.chh)+" " }, { "color": "purple", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c6,0)+"/8" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                ["blank" , "25px"],
                ["row", [["buyable", 1060], ["buyable", 1061]]],

            ]
        },
        "Harden Challenge" : {
            content : [
                ["raw-html", function () { return "<h2> Harden challenge : Pre-Research challenge goal are ^"+format(player.r.chi)+" and raise their reward by ^"+format(player.r.chj)+" . Each incomplete Pre-Research challenge additionally reduce your Mastery by /"+format(player.r.chk)+"." }, { "color": "pink", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c7,0)+"/8" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                ["blank" , "25px"],

                ["row", [["buyable", 1070], ["buyable", 1071]]],
            ]
        },
        "Ultimatum" : {
            content : [
                ["raw-html", function () { return "<h2> Ultimatium : +"+format(player.r.c8.times(0.5),1)+" to all modifier difficulty" }, { "color": "rgb(192,192,192)", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2> Difficulty : "+format(player.r.c8,0)+"/8" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                ["blank" , "25px"],

                ["row", [["buyable", 1080], ["buyable", 1081]]],
            ]
        },
    },
    challenge: {
        "Main" : {
            content : [
            ["blank", "25px"],
            ["raw-html", function () { return "<h2> You have "+format(player.r.challengeshard,0)+" challenge shard , which boost various resource gain" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h2> Reach 10,000 Mastery to complete the Meta Research challenge." }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h2> Total modifier level : "+format(player.r.potshard,0)+"" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
            ["raw-html", function () { return player.r.c8.gt(0)?"<h2> Ultimatium : +"+format(player.r.c8.times(0.5),1)+" to all modifier difficulty":"" }, { "color": "rgb(192,192,192)", "font-size": "14px", "font-family": "helvetica" }],
            ["blank", "25px"],
            ["raw-html", function () { return "<h2> Point shredder : Point gained are ^"+format(player.r.cha)+"" }, { "color": "red", "font-size": "14px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h2> Resource reduction : Pre-Research resource gained and cost reduction (except Points gained) are ^"+format(player.r.chb)+"" }, { "color": "orange", "font-size": "14px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h2> Frozen time : Gamespeed is divided by /"+format(player.r.chc)+"" }, { "color": "yellow", "font-size": "14px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h2> Weaken exponent : Exponent effect and Perk Power is raised ^"+format(player.r.chd)+"" }, { "color": "lime", "font-size": "14px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h2> Cost superscaler : Additive , Subtractive cost scaling start "+format(player.r.che)+"x earlier and their strength are increased by "+format(player.r.chf)+"x" }, { "color": "cyan", "font-size": "14px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h2> Algebric failure : base of A,B,C,X are ^"+format(player.r.chg)+" and base Extension , Operation gained are ^"+format(player.r.chh)+"" }, { "color": "purple", "font-size": "14px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h2> Harden challenge : Pre-Research challenge goal are ^"+format(player.r.chi)+" and raise their reward by ^"+format(player.r.chj)+" . Each incomplete Pre-Research challenge additionally reduce your Mastery by /"+format(player.r.chk)+"." }, { "color": "pink", "font-size": "14px", "font-family": "helvetica" }],
            ["blank", "25px"],
            ["raw-html", function () { return "<h2> Entering this challenge will also reset row 1-3 and reset your research , tetration . Also disable Altered realm" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h2> Research and Tetration can be gained in this challenge" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
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
        ["raw-html", function () { return "<h2>Improvement requirement increase significantly faster above level 10" }, { "color": "red", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank", "25px"],
                    ["row", [["buyable", 11]]],
                    ["row", [["buyable", 101], ["buyable", 102], ["buyable", 103], ["buyable", 104],["buyable",105]]],
                    ["blank", "250px"],
                    ["raw-html", function () { return hasAchievement('ac',62)&&player.r.a62.gt(0)&&!inChallenge('al',11)?"<h2>Elder Age achievement : +"+formatTime(player.r.a62.div(300))+" per real life second":"" }, { "color": "yellow", "font-size": "18px", "font-family": "helvetica" }],
                    
    ]

        },
    },
    metaresearch: {
        "Main": {
            buttonStyle() { return { 'color': '#ff0000' , "border-color" : "orange" } },
            unlocked() { return player.r.bestmastery.gte(10000) && !inChallenge('r',11) },
            content: [
                ["blank", "25px"],
                ["raw-html", function () { return "<h2>You currently have : " + format(player.r.metaresearch)+ " Meta research" }, { "color": "lime", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2>Reset now to gain "+format(player.r.nextmetaresearch) +" Meta research (based on Mastery)" }, { "color": "lime", "font-size": "14px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h2>Meta-research reset will force an Research reset and reset your Research , Improvement , Current Field . Meta resetting require at least 10K current Mastery" }, { "color": "red", "font-size": "18px", "font-family": "helvetica" }],
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
                ["raw-html", function () { return "<h2> Research progress is RESETED everytime you perform a Research reset" }, { "color": "red", "font-size": "14px", "font-family": "helvetica" }],
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
                ["raw-html", function () { return "<h2> Purchasing some of the upgrade may make some challenge achievement impossible to obtain"}, { "color": "grey", "font-size": "10px", "font-family": "helvetica" }],
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
            buttonStyle() { return { 'color': '#ffffff' , "border-color" : "gray" } },
            unlocked() { return hasAchievement('ac',54) },
            content: [
                ["blank","25px"],
                ["raw-html", function () { return "<h2>You have "+format(player.r.lightadd)+" Light Additive (+"+format(player.r.lightaddpersec)+"/s) , translated to </br> "+format(player.r.la1)+"x to Points gained </br> "+format(player.r.la2)+"x to Number gained </br> /"+format(player.r.la3)+" to additive cost" }, { "color": "lime", "font-size": "14px", "font-family": "helvetica" }],
                ["blank","25px"],
                ["raw-html", function () { return "<h2>You have "+format(player.r.darksub)+" Dark Subtractive (+"+format(player.r.darksubpersec)+"/s) , translated to </br> "+format(player.r.da1)+"x to Multiplicative gained </br> "+format(player.r.da2)+"x to Divisive gained </br> /"+format(player.r.da3)+" to subtractive cost" }, { "color": "red", "font-size": "14px", "font-family": "helvetica" }],
                ["blank","25px"],
                ["raw-html", function () { return "<h2>You have "+format(player.r.twilight)+" Twilight (+"+format(player.r.twilightpersec)+"/s) , which multiply tickspeed by "+format(player.r.ta1)+" </br> Twilight is generated based on current Light Additive and Dark Subtractive" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                ["blank","25px"],
                ["raw-html", function () {return hasAchievement('ac',96)?"<h2>You have "+format(player.r.energy)+" Energy (+"+format(player.r.energypersec)+"/s) which improve twilight gained by "+format(player.r.ee1)+"x </br> Energy gained is decreased based on current Energy":"" }, { "color": "cyan", "font-size": "14px", "font-family": "helvetica" }],
                ["blank","25px"],
                ["row", [["buyable", 201], ["buyable", 202], ["buyable", 203]]],
                ["row", [["buyable", 301], ["buyable", 302], ["buyable", 303]]],
                ["row", [["buyable", 401], ["buyable", 402], ["buyable", 403]]],
                ["row", [["buyable", 501]]],
            
            ]
        },
            "Tetration" : {
                buttonStyle() { return { 'color': 'green' , "border-color" : "lime" } },
                unlocked() { return hasAchievement('ac',69) },
                content: [
                    ["blank", "25px"],
                    ["raw-html", function () { return "<h2> You have "+format(player.r.tetration,0)+" Tetration => x"+format(player.r.tetrationmastery)+" Mastery" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.lt(10)?"<h2> Tetration reset force an Meta research but do not give Meta research":""}, { "color": "red", "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.lt(10)?"<h2> Next tetration require "+format(player.r.tetrationcost,0)+" effective exponent":""}, { "color": "white", "font-size": "10px", "font-family": "helvetica" }],
                    ["blank","25px"],
                    ["raw-html", function () { return "<h2> At Tetration 1 : Points gained is ^1.1 . Extend Research milestone 3 autobuyer"}, { "color": function(){return player.r.tetration.gte(1)?"green":"red"}, "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.gte(1)?"<h2> At Tetration 2 : Improved 'Point Boost' buyable effect . Exponent perk no longer decrease Perk Power":""}, { "color": function(){return player.r.tetration.gte(2)?"green":"red"}, "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.gte(2)?"<h2> At Tetration 3 : Additive and Subtractive cost scaling start 1.25x later ; +0.2 'Addition' base":""}, { "color": function(){return player.r.tetration.gte(3)?"green":"red"}, "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.gte(3)?"<h2> At Tetration 4 : Unlock a second source of Perk Power and ^1.04 Perk Power gained ":""}, { "color": function(){return player.r.tetration.gte(4)?"green":"red"}, "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.gte(4)?"<h2> At Tetration 5 : ^1.1 Divisive gained . Always have Research milestone 3 autobuyer":""}, { "color": function(){return player.r.tetration.gte(5)?"green":"red"}, "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.gte(5)?"<h2> At Tetration 6 : Exponent cost scale 4% slower AND unlock best resource achievement in altered realm":""}, { "color": function(){return player.r.tetration.gte(6)?"green":"red"}, "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.gte(6)?"<h2> At Tetration 7 : Exponent cost divisor is ^1.5 AND boost Exponent effect by 10%":""}, { "color": function(){return player.r.tetration.gte(7)?"green":"red"}, "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.gte(7)?"<h2> At Tetration 8 : Unlock Meta research Challenge":""}, { "color": function(){return player.r.tetration.gte(8)?"green":"red"}, "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.gte(8)?"<h2> At Tetration 9 : The first row of number upgrade effect will no longer multiply Points gained , they raised points gained (severely weaken) instead":""}, { "color": function(){return player.r.tetration.gte(9)?"green":"red"}, "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.r.tetration.gte(9)?"<h2> At Tetration 10 : Light Additive , Dark Subtractive , Twilight , Energy and Prestige Time gained is multiplied by your Challenge Shard amount":""}, { "color": function(){return player.r.tetration.gte(10)?"green":"red"}, "font-size": "14px", "font-family": "helvetica" }],


                    ["blank","25px"],
                    ["row",[["buyable",120]]],
                ]
            },
            "Gamespeed" : {
                buttonStyle() { return { 'color': 'white' , "border-color" : "white" } },
                unlocked() { return hasAchievement('ac',67) },
                content: [
                    ["blank", "25px"],
                    ["raw-html", function () { return "<h2> Gamespeed boost all resource production" }, { "color": "white", "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h2> Consuming "+format(player.r.gsreq,0)+" Ticks/s to boost Gamespeed by "+format(player.r.gsbase,0)+"x"}, { "color": "green", "font-size": "14px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h2> Gamespeed cost scale much faster above 5x"}, { "color": "red", "font-size": "10px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h2> You can upkeep this Gamespeed for "+formatTime(player.r.gsupkeep)+" "}, { "color": "white", "font-size": "10px", "font-family": "helvetica" }],
                    ["blank","25px"],
                    ["raw-html", function()  {return "<h2> You have spent "+format(player.r.spenttick)+" ticks"}, {"color": "grey","font-size":"15px","font-family":"helvetica"}],
                    ["blank","25px"],
                    ["row", [["buyable", 1001], ["buyable", 1002]]],
                    ["blank","25px"],
                    ["row", [["buyable", 1003], ["buyable", 1004]]],
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
        //
        bank1: new Decimal(0),
        bank2: new Decimal(0),
        bank3: new Decimal(0),
        bank4: new Decimal(0),
        resetTime: new Decimal(0)

        
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
        player.al.resetTime = player.points.times(0)
        //function
        let totalc = new Decimal(0).add(buyableEffect('al',11))
        if(inChallenge('r',11)) totalc = totalc.pow(player.r.chg)
        player.al.c = totalc

        let totalb = new Decimal(0).add(buyableEffect('al',12))
        if(inChallenge('r',11)) totalb = totalb.pow(player.r.chg)
        player.al.b = totalb

        let totala = new Decimal(0).add(buyableEffect('al',13))
        if(hasUpgrade('al',12)) totala = totala.times(upgradeEffect('al',12))
        if(inChallenge('r',11)) totala = totala.pow(player.r.chg)
        player.al.a = totala

        let delx = buyableEffect('al',14).times(player.al.extensionboost)
        if(hasUpgrade('al',11)) delx = delx.times(upgradeEffect('al',11))
        if(inChallenge('r',11)) delx = delx.pow(player.r.chg)
        player.al.deltax = delx.times(player.r.truegamespeed)


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
        player.al.pointsgainal = gainal.times(player.r.truegamespeed)

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
        if(inChallenge('r',11)) deltaextension = deltaextension.pow(player.r.chh)
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
        if (hasUpgrade('r',51)) operationgainedal = operationgainedal.add(new Decimal(2).pow((player.points.add(10).log(10).pow(2.5)).add(4).div(4)).sub(2))
        if(hasUpgrade('al',34)) operationgainedal = operationgainedal.times(upgradeEffect('al',34)) 
        if(inChallenge('r',11)) operationgainedal = operationgainedal.pow(player.r.chh)
    
        let operationgainedal1 = operationgainedal
        let operationgainedal2 = softcap(operationgainedal1,new Decimal("1e6"),0.00).times(operationgainedal1.add(1e6).div(1e6).floor().max(2).log(2))
        if(inChallenge('r',11)) operationgainedal2 = operationgainedal2.pow(player.r.chh)

        player.al.operationgained = operationgainedal2.times(buyableEffect('al',31)).times(buyableEffect('r',105)).times(player.r.truegamespeed)

        //tick
        let tickspeedreduction1eff = new Decimal(0.2)
        if(hasUpgrade('al',33)) tickspeedreduction1eff = tickspeedreduction1eff.add(0.3)
        if(hasAchievement('ac',76)) tickspeedreduction1eff = tickspeedreduction1eff.add(0.1)
        if(hasAchievement('ac',78)) tickspeedreduction1eff = tickspeedreduction1eff.add(0.1)

        player.al.tickspeedreduction1 = tickspeedreduction1eff

        let tickspeedreduction2eff = new Decimal("1e20").div(buyableEffect('al',32))
        if(hasAchievement('ac',74)) tickspeedreduction2eff = tickspeedreduction2eff.div(4)
        player.al.tickspeedreduction2 = tickspeedreduction2eff

        let alteredpower = new Decimal(0.25)
        if(hasAchievement('ac',75)) alteredpower = alteredpower.add(0.05)
        if(hasAchievement('ac',79)) alteredpower = alteredpower.add(0.1)
        if(hasUpgrade('al',53)) alteredpower = alteredpower.add(0.1)
        player.al.alteredpow = alteredpower 
    },
      
    update(delta) {
    player.al.resetcooldown = player.al.resetcooldown.sub(delta).max(0)
    player.al.x = player.al.x.add(player.al.deltax.times(delta))
    player.al.points = player.al.points.add((player.al.pointsgainal).times(delta)).sub(player.al.resetcooldown.div(6).abs().ceil().times(player.al.points))

    player.al.operation = player.al.operation.add(player.al.operationgained.times(delta))
        if(hasUpgrade('r',31)) {
            player.al.extension = player.al.extension.add(player.al.extensiongain.div(10).times(player.r.truegamespeed).times(delta))
        }
    
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
            style() {
				if (player.al.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
    
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
            style() {
				if (player.al.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
    
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
            style() {
				if (player.al.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
    
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
            style() {
				if (player.al.points.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}
    
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
            return new Decimal(1.1).pow(x.times(10)).times(10) },
        display() { 
        return "Cost : "+format(this.cost())+" extension points <br/> Effect : Decrease the cost scaling of X by " + format(this.effect()) + "x  " },
        canAfford() { return player.al.extension.gte(this.cost())},
        buy() {
            player.al.extension = player.al.extension.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
          
        },
        effect(x) {
            let effect1 = x.add(1).pow(0.2)
  
            return effect1      
        },
        purchaseLimit:32

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
        style() {
				if (player.al.operation.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}}

    },
    32: {
        title() {
            return format(getBuyableAmount(this.layer, this.id),0) + "<br/> Lower Tickspeed Penality  "
           } ,
        cost(x) { 
            let base = new Decimal(4).pow(x).times(10)
            if(hasUpgrade('al',52)) base = base.pow(0.4)
            return base
        },
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
          style() {
                if (player.al.buyables[32].gte(this.purchaseLimit())) return {
                'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'100px'
                }
				else if (player.al.operation.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}},
        purchaseLimit() {return new Decimal(100)}

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
          style() {
            if (player.al.buyables[33].gte(this.purchaseLimit())) return {
                'border-radius': '0%',
					'color':'white',
					'background-color':'green',
					'border':'2px solid',
					'height':'100px'
                }
				else if (player.al.operation.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}},
        purchaseLimit() {return new Decimal(5)} 

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
          style() {
				if (player.al.operation.lt(this.cost())) return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'black',
					'border':'2px solid',
					'height':'100px'
				}
				else return {
					'border-radius': '0%',
					'color':'white',
					'background-color':'rgb(128, 128, 32)',
					'border':'2px solid',
					'height':'100px'
				}},
        
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
            unlocked() { return !player.r.buyables[121].gte(1) }, 
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
            unlocked() { return !player.r.buyables[121].gte(1) }, 
        },
        42: {
            title: "More Effective",
            description: "Increase the strength of Number upgrade 'Effective counting' (^5 effect)",
            cost: new Decimal("32000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return !player.r.buyables[121].gte(1) }, }, 

        43: {
            title: "More Quickly",
            description: "Empowered Number upgrade 'Counting faster' based on Mastery",
            cost: new Decimal("128000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return !player.r.buyables[121].gte(1) }, 
        },
        44: {
            title: "Number QOL",
            description: "The second row of number upgrade cost are ^0.25 and is unlocked instantly",
            cost: new Decimal("512000"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return !player.r.buyables[121].gte(1) },
        },
        51: {
            title: "Better Conversion",
            description: "Improve Operation to Mastery conversion",
            cost: new Decimal("1e10"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return hasAchievement('ac',75) }, 
        },
        52: {
            title: "Altered Time",
            description: "'Better Tickspeed penality' buyable cost ^0.4",
            cost: new Decimal("1e13"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return hasAchievement('ac',75) }, }, 

        53: {
            title: "Lower penality",
            description: "+^0.1 Altered Pre-research resource multiplier and cost reduction",
            cost: new Decimal("1e16"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return hasAchievement('ac',75) }, 
        },
        54: {
            title: "Super Divisive",
            description: "Significantly improve Divisive effect while altered (^2) and ^1.1 Perk Power gain",
            cost: new Decimal("1e20"),
            currencyLocation() { return player.al },
            currencyDisplayName: "Operation",
            currencyInternalName: "operation",
            unlocked() { return hasAchievement('ac',75) },

      
    }},
    challenges: {
        11: {
            name: "Altered realm",
            challengeDescription: "Reset Row 1 - Row 3 resource </br> Prestige Time is resetted but can be gained back by exiting this realm" ,
            canComplete: function() {
                let goal = (player.points.add(1)).times(player.points)
                return player.points.gte(goal)},
            unlocked() {return !inChallenge('r',11)},
            onEnter() {
                player.al.bank1 = player.r.buyables[101]
                player.al.bank2 = player.r.buyables[102]
                player.al.bank3 = player.r.buyables[103]
                player.al.bank4 = player.r.buyables[104]
                player.r.buyables[101] = new Decimal(0)
                player.r.buyables[102] = new Decimal(0)
                player.r.buyables[103] = new Decimal(0)
                player.r.buyables[104] = new Decimal(0)




                layerDataReset('e')
                layerDataReset('d')
                layerDataReset('m')
                layerDataReset('s')
                layerDataReset('a')
                layerDataReset('n')
                player.al.bankedprestigetime = player.r.prestigetime
                player.r.prestigetime = new Decimal(0)
                doReset('e',true)
                player.points = new Decimal(10)
                options.theme = themes[2]
                changeTheme()
	            resizeCanvas()
            },
            onExit() {
                player.r.prestigetime = player.r.prestigetime.add(player.al.bankedprestigetime)
                player.al.bankedprestigetime = new Decimal(0)
                player.r.buyables[105] = new Decimal(0)
                if(hasAchievement('ac',79)) {
                    player.r.buyables[101] = player.al.bank1
                    player.r.buyables[102] = player.al.bank2
                    player.r.buyables[103] = player.al.bank3
                    player.r.buyables[104] = player.al.bank4
                    player.al.bank1 = new Decimal(0)
                    player.al.bank2 = new Decimal(0)
                    player.al.bank3 = new Decimal(0)
                    player.al.bank4 = new Decimal(0)
                    

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
                ["blank","25px"],
                ["row", [["upgrade", 51],["upgrade", 52],["upgrade", 53],["upgrade",54]]],

                        ]
        },
}},
tabFormat: [
    ["raw-html", function () { return "<h3>You have  " + format(player.al.points)+" Algebric (+"+format(player.al.pointsgainal)+"/s)" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
    ["raw-html", function () { return "<h3>Function f(x) = " + format(player.al.value)+"" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
    ["raw-html", function () { return "<h3> x = " + format(player.al.x)+ "" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],

    ["microtabs", "stuff", { 'border-width': '0px' }],
],
layerShown() { return player.r.algebraf.gte(1) }


}) 
addLayer("g", {
    startData() { return {
        //basic data                  
        unlocked: true,
        req: [new Decimal(0),new Decimal(0)],
    }},
    color: "white",                       // The color for this layer, which affects many elements.
    row: 10,                                 // The row this layer is on (0 is the first row).
    tooltip: "Graduation",
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
        if(player.points.gte("1e5000") && player.m.points.gte("1e9000") && player.e.effective.gte(285) && player.r.points.gte(13) && tmp.t.effect.gte("1e100") && player.r.lightadd.gte("1e21") && player.r.darksub.gte("1e20") && player.r.energy.gte("1e90") && player.r.prestigetime.gte("1788923149") && player.g.req[0].eq(0) && hasAchievement('ac',109)) {
            player.g.req[0] = new Decimal(1)
        } 
        if (inChallenge('al',11) && player.al.operation.gte("1e40") && hasChallenge('d',13) && player.m.buyables[11].gte("2500") && player.n.points.gte("1e1024") && player.e.perkpower.gte("60") && player.g.req[1].eq(0) && hasAchievement('ac',109)) {
            player.g.req[1] = new Decimal(1)
        }
        player.points = player.points.min("1e5000")

    },
    update(delta) {

    },

    milestones: {
        
    },
    buyables: {
       
    },



    upgrades: {
       
    },
    challenges: {
       
    },

microtabs: {
    stuff: {
        "Unlock": {
            buttonStyle() { return { 'color': 'gray' } },
            unlocked() { return !player.g.req[0].add(player.g.req[1]).eq(2) },
            content: 

                [
        ["microtabs", "unlock", { 'border-width': '0px' }],
    ]

        },
        "Main": {
            buttonStyle() { return { 'color': 'cyan' , "border-color" : "white" } },
            unlocked() { return player.g.req[0].add(player.g.req[1]).eq(2) },
            content:

                [
        ["microtabs", "main", { 'border-width': '0px' }],
    ]

        },
    },
    main: {
        "Graduate": {
            buttonStyle() { return { 'color': 'lime' } },
            unlocked() { return true }, 
            content:[
            ["raw-html", function () { return "<h3>You have reached the end for now"}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ]
        },
    },
    unlock: {
        "Requirement": {
            buttonStyle() { return { 'color': 'white' , "border-color" : "gray" } },
            unlocked() { return true },
            content: [
                ["raw-html", function () { return "<h3>Normal realm task" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.g.req[0].gte(1)?"<h3> Status : Completed":"<h3> Status : Incompleted" }, { "color": function(){return player.g.req[0].gte(1)?"cyan":"purple"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 1 : Obtain 1e5000 Points ("+format(player.points)+")" }, { "color": function(){return player.points.gte("1e5000")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 2 : Obtain 1e9000 Multiplicative ("+format(player.m.points)+")" }, { "color": function(){return player.m.points.gte("1e9000")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 3 : Have at least 285 effective exponent ("+format(player.e.effective)+")" }, { "color": function(){return player.e.effective.gte("285")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 4 : Have at least 13 research ("+format(player.r.points)+")" }, { "color": function(){return player.r.points.gte("13")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 5 : Reach 1e100 tickspeed ("+format(tmp.t.effect)+")" }, { "color": function(){return tmp.t.effect.gte("1e100")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 6 : Gather 1e21 Light additive ("+format(player.r.lightadd)+")" }, { "color": function(){return player.r.lightadd.gte("1e21")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 7 : Gather 1e20 Dark subtractive ("+format(player.r.darksub)+")" }, { "color": function(){return player.r.darksub.gte("1e20")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 8 : Gather 1e90 Energy ("+format(player.r.energy)+")" }, { "color": function(){return player.r.energy.gte("1e90")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 9 : Reach around 25 years worth of Prestige Time ("+formatTime(player.r.prestigetime)+")" }, { "color": function(){return player.r.prestigetime.gte("1788923149")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
            ]
        },
        "Altered requirement" : {
            buttonStyle() { return { 'color': 'green' , "border-color" : "orange" } },
            unlocked() { return true },
            content: [
                ["raw-html", function () { return "<h3>Altered realm task" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.g.req[1].gte(1)?"<h3> Status : Completed":"<h3> Status : Incompleted" }, { "color": function(){return player.g.req[1].gte(1)?"cyan":"purple"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 1 : Have 1e40 Operation" }, { "color": function(){return player.al.operation.gte("1e40")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 2 : Complete 'Chaotic Division' divisive challenge inside altered realm" }, { "color": function(){return (hasChallenge('d',13) && inChallenge('al',11))?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 3 : Reach 17500 Mastery inside altered realm" }, { "color": function(){return (player.r.mastery.gte("17500") && inChallenge('al',11))?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 4 : Buy 'Point Boost' buyable at least 2500 times inside altered realm" }, { "color": function(){return (player.m.buyables[11].gte(2500) && inChallenge('al',11))?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 5 : Have 1e1024 number inside altered realm" }, { "color": function(){return (player.n.points.gte("1e1024") && inChallenge('al',11))?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 6 : Have 60 perk power inside altered realm" }, { "color": function(){return (player.e.perkpower.gte(60) && inChallenge('al',11))?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
            ]
            
        },
}},
tabFormat: [
    ["raw-html", function () { return "<h3>You are currently inside Graduation I" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
    ["raw-html", function () { return "<h3>Reach ??? Mastery to Graduate up" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
    ["microtabs", "stuff", { 'border-width': '0px' }],
],
layerShown() { return hasAchievement('ac',109) }


}) 
