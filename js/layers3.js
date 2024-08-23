//Post graduation


addLayer("g", {
    startData() { return {
        //basic data                  
        unlocked: true,
        fastest:d(0),
        points: d(0),
        costMultiplier: d(1),
        costMultiplier1: d(1),
        req: [d(0),d(0)],
        cutscene: d(0),
        rank: d(1),
        ud: d(0), // Unlocked
        g1: true, // Active after ranking up to rank 2 . Force the Orb artifact to give 4 fixed effect at 50% fixed quality and locked all other artifacts
        doRefresh: d(4), //?
        corruption: [d("1e10000"), d("2048"),d("2048"),d("1e10000"),d("1e10000"),d(100)], //in order : Number , additive , subtractive , multiplicative , divisive , exponent  
        corruptpoints: [d("1e10000"),d("1e10000")], //currently not implemented and prob not
        timer:d(1000), //reduce Points gained in the first 1200s of Grad reset
        timer2: d(1000),
        //artifact id (4id per 8)
        artifact1:[0,0,0,0],
        artifact2:[0,0,0,0],
        artifact3:[0,0,0,0],
        artifact4:[0,0,0,0],
        //artifact quality
        artifact1q:[0,0,0,0],
        artifact2q:[0,0,0,0],
        artifact3q:[0,0,0,0],
        artifact4q:[0,0,0,0],
        //artifact buff 
        artifact1eff:[1,1,1,1],
        artifact2eff:[1,1,1,1],
        artifact3eff:[1,1,1,1],
        artifact4eff:[1,1,1,1],
        //effect display
        artifact1d: ["","","",""],
        artifact2d: ["","","",""],
        artifact3d: ["","","",""],
        artifact4d: ["","","",""],
        //total artifact buff (32n)
        artifactset1:[1,1,1,1,1,1,1,1],
        artifactset2:[1,1,1,1,1,1,1,1], 
        artifactset3:[1,1,1,1,1,1,1,1], 
        artifactset4:[1,1,1,1,1,1,1,1], 
        //Artifact storage
        artifactstorage1:[], //Effect id
        artifactstorage2:[], //Quality
        artifactstorage3:[], //Effect
        artifactstorage4:[], //Name
        artifactstorage5:[], //Total buff
        generated:d(0),
        action:d(0),
        artifactlevel: 1,
        artifactquality: 0,
        //sacrifice
        SacrificeUnlock:[d(0),d(0),d(0),d(0),d(0),d(0),d(0),d(0),d(0)],
        sacrificehover:d(0),
        sacrificeactive:[d(0),d(0),d(0),d(0),d(0),d(0),d(0),d(0),d(0)],
        sacrificenext:[d(0),d(0),d(0),d(0),d(0),d(0),d(0),d(0),d(0)],
        s1best: d(0),
        s2best: d(0),
        s3best: d(0),
        nri: true, //No reset improvement
        s4best: d(1),
        s5best: d(4),
        s6best: d(0), //highest Exponent
        chargeToken: d(0), //Current charge token

        s7completion: [d(0),d(0),d(0),d(0),d(0),d(0),d(0)],
        s8best: d(0),

        //graduation resource
        bits: d(0),
        bitspersec: d(0),
        metabits: d(0),
        totalmetabits : d(0),
        spentmetabits: d(0),
        boughtmetabis: [d(0),d(0),d(0)],
        enmetalizedbits: d(0),
        storagedbitscap : d(1),
        enmetalizedconvert: d(1),
        effectWeight: [d(0),d(0),d(0)], //Number / Multiplicative / Divisive /
        EW:d(45), //Remaining effect weight
        tEW:d(45), //Total effect weight 
        EWid:d(10) //rawID 

    }},
    color: "white",                       // The color for this layer, which affects many elements.
    row: 5,                                 // The row this layer is on (0 is the first row).
    tooltip() {return "Graduation"},
    type: "none",                         // Determines the formula used for calculating prestige currency.
    branches:['r'],
    layerName: "Graduation",  

    ttStyle() {
        return {
            "color":"white",
            "width":"200px",
            "border":"2px solid",
            "border-color":"white",
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
        rank2: {
            title: "Graduation Rank II reward",
            body() { 
                return ""+Qcolor2('d','Rank II requirement')+" : Graduate for the first time <br> - "+Qcolor2('la','NEW :')+" Unlock a new tab in "+Qcolor2('n','Number')+" <br> - "+Qcolor2('la','NEW :')+" Unlock a new "+Qcolor2('n','Number')+" main currency : "+Qcolor2('n','Bits')+" <br> - "+Qcolor2('ds','???')+" : You will occasionally recieve hints throughout the structural of this Graduation <br> "+Qcolor2('la',"MORE FEATURE")+" : new upgrade , new buyables that cost "+Qcolor2('n',"Bits")+" <br> "+Qcolor2('a','Rank 2 Reward')+" : Exponent now have +1 additional effect <br> "+Qcolor2('a','Rank 2 Reward')+" : Unlock 1 more Energy buyable and unlock additional tetration reward <br> "+Qcolor2('a','Achievement :')+" 1 more page <br> "+Qcolor2('s','Early game nerf:')+" Points gained and Tickspeed is ^0 , this is increased linearly over 20 minutes <br>"  },
            unlocked() {return true}
        }
    },


    automate() {
        if(player.points.gte("1e5250") && player.m.points.gte("1e10000") && player.e.effective.gte(308.25) && player.r.points.gte(13) && tmp.t.effect.gte("1e160") && player.r.lightadd.gte("1e21") && player.r.darksub.gte("1e20") && player.r.energy.gte("1e90") && player.r.prestigetime.gte("252284000") && player.g.req[0].eq(0) && hasAchievement('ac',109)) {
            player.g.req[0] = d(1)
        } 
        if (inChallenge('al',11) && player.al.operation.gte("1e60") && player.r.mastery.gte(22500) && hasChallenge('d',13) && player.m.buyables[11].gte("3000") && player.n.points.gte("1e1175") && player.e.perkpower.gte("64") && player.g.req[1].eq(0) && hasAchievement('ac',109)) {
            player.g.req[1] = d(1)
        }
        if (player.g.rank.eq(1)) {
            player.g.fastest = d("1e10")
        }
        player.g.rankreq = d(40000)

        let bitpersec = d(0)
        if(hasUpgrade('n',41)) bitpersec = bitpersec.add(upgradeEffect('n',41))
        bitpersec = bitpersec.times(buyableEffect('n',61))
        if(hasUpgrade('n',51)) bitpersec = bitpersec.times(upgradeEffect('n',51))
        if(hasUpgrade('n',61)) bitpersec = bitpersec.times(upgradeEffect('n',61))
        if(hasAchievement('ac',116)) bitpersec = bitpersec.times(achievementEffect('ac',116))
        if(inChallenge('e',13)) bitpersec = bitpersec.times(50)
        if(player.g.ud.gte(2)) bitpersec = bitpersec.times(16777216)
        if(hasUpgrade('t',61)) bitpersec = bitpersec.times(upgradeEffect('t',61))
        if(hasAchievement('ac',139)) bitpersec = bitpersec.times(player.ac.achievements.filter(x => x>=141 && x<=169).length * 0.03 + 1)
        if(true) bitpersec = bitpersec.times(player.r.truegamespeed)
        player.g.bitspersec = bitpersec

        player.g.metabits = player.g.totalmetabits.sub(player.g.spentmetabits)

        player.g.costMultiplier = player.g.costMultiplier1
        let qa = d(0)
        if(hasAchievement('ac',161)) qa = qa.add(achievementEffect('ac',161))
        if(player.g.costMultiplier1.gt(1)) qa = qa.add(player.g.costMultiplier1.max(1).log(2).times(25))
        if(hasAchievement('ac',144)) qa = qa.add(50)
        player.g.artifactquality = qa


        let bitscap = d(1)
        let bitsconvert = d(1)

        if(hasAchievement('ac',119)) bitscap = bitscap.add(1)
        if(hasAchievement('ac',162)) bitscap = bitscap.add(2)
        if(hasAchievement('ac',119)) bitsconvert = bitsconvert.add(1)
        if(hasAchievement('ac',162)) bitsconvert = bitsconvert.add(2)

        player.g.storagedbitscap = bitscap
        player.g.enmetalizedconvert = bitsconvert

        if(player.g.metabits.lt(0) && !options.instantcalculation) {
                for (let i = 0 ; i < 100 ; i++) {
                    let j = i % 4 + 1
                    let k = Math.floor(i / 4) * 10 + 10
                    let l = j + k 
                    player.n.buyables[l] = d(0)
                }
                player.g.spentmetabits = d(0)
                MRreset()
                alert("Your metabit amount is somehow negative . A Meta-reset is forced")
        }
        if(player.g.sacrificeactive[0].gte(1)) {
            player.g.s1best = player.g.s1best.max(player.n.points)
        }
        if(!inChallenge('r',11) && hasMilestone('g',3)) {
            player.m.challenges[11] = 1
            player.m.challenges[12] = 1
            player.d.challenges[11] = 1
            player.d.challenges[12] = 1
            player.d.challenges[13] = 1
            player.e.challenges[11] = 1
            player.e.challenges[12] = 1
        }
        if(player.g.sacrificeactive[4].gte(1)) {
            player.g.s5best = player.g.s5best.max(player.r.tetration)
        }
        if(player.g.sacrificeactive[5].gte(1)) {
            player.g.s6best = player.g.s6best.max(player.e.points)
        }
        //Handling the generation of nested array 
        if(player.g.generated.eq(0)) {
            let a = []
            let b = []
            for (let i = 0 ; i < 36 ; i++) {
                a.push([0,0,0,0])
                b.push([0,0,0,0,0,0,0,0])
            }
            player.g.generated = d(1)
            player.g.artifactstorage1 = a
            player.g.artifactstorage2 = a
            player.g.artifactstorage3 = a
            player.g.artifactstorage4 = a
            player.g.artifactstorage5 = b

        }
        player.g.chargeToken = player.g.s6best.sub(d(player.ac.super.length))  

        let base1 = d("1e10000")
        let base2 = d("2048")
        let base3 = d("2048")
        let base4 = d("1e10000")
        let base5 = d("1e10000")
        let base6 = d("100")
        if(player.g.s4best.gte(2) && inChallenge('al',11)) {
            base1 = base1.root(2)
            base2 = base2.div(2)
            base3 = base3.div(2)
            base4 = base4.root(2)
            base5 = base5.root(2)
            base6 = base6.div(2)
        }
        player.g.corruption[0] = base1
        player.g.corruption[1] = base2
        player.g.corruption[2] = base3
        player.g.corruption[3] = base4
        player.g.corruption[4] = base5
        player.g.corruption[5] = base6

        if(hasMilestone('g',8) && player.g.enmetalizedbits.gt(0)) {
            player.g.totalmetabits = player.g.totalmetabits.add(player.g.enmetalizedbits)
            player.g.enmetalizedbits = d(0)
        }
    },
    update(delta) {
        player.g.bits = player.g.bits.add(player.g.bitspersec.times(delta))
        let a = d(0.5)
        if(hasSuperAchievement('ac',95)) a = a.times(4)
        player.g.timer = player.g.timer.add(a.times(delta).times(player.o.gamespeed))
        player.g.timer2 = player.g.timer2.add(player.o.gamespeed.times(delta))
    },  
    milestones: {
        1: {
            requirementDescription() {return options.hidemastery?"Milestone 1":""+format(80000)+" Mastery (1)"},
            effectDescription() {return ""+Qcolor2('r','Improvements')+" no longer reset on "+Qcolor2('r','Meta-reset')+""},
            unlocked() {return player.g.sacrificeactive[2].gte(1)},
            done() {return player.r.mastery.gte("80000") && player.g.sacrificeactive[2].gte(1)},
            style() {
                if(hasMilestone(this.layer,this.id)) return Qcolor('green',75)
                else return Qcolor('black',75)
            },
        },
        2: {
            requirementDescription() {return options.hidemastery?"Milestone 2":""+format(115000)+" Mastery (2)"},
            effectDescription() {return ""+Qcolor2('r','Prestige time')+" no longer reset on "+Qcolor2('r','Meta-reset')+""},
            unlocked() {return player.g.sacrificeactive[2].gte(1)},
            done() {return player.r.mastery.gte("115000") && player.g.sacrificeactive[2].gte(1)},
            style() {
                if(hasMilestone(this.layer,this.id)) return Qcolor('green',75)
                else return Qcolor('black',75)
            },
        },
        3: {
            requirementDescription() {return options.hidemastery?"Milestone 3":""+format(140000)+" Mastery (3)"},
            effectDescription() {return ""+Qcolor2('la','Automaticly')+" complete all "+Qcolor2('r','pre-MR challenges')+" (if unlocked) , "+Qcolor2('s','Disabled')+" while inside "+Qcolor2('r','MR challenge')+""},
            unlocked() {return player.g.sacrificeactive[2].gte(1)},
            done() {return player.r.mastery.gte("140000") && player.g.sacrificeactive[2].gte(1)},
            style() {
                if(hasMilestone(this.layer,this.id)) return Qcolor('green',75)
                else return Qcolor('black',75)
            },
        },
        4: {
            requirementDescription() {return options.hidemastery?"Milestone 4":""+format(165000)+" Mastery (4)"},
            effectDescription() {return ""+Qcolor2('blue1',"'Point boost'")+" buyable "+Qcolor2('a','autobuyer')+" is "+Qcolor2('n','instantaneous')+""},
            unlocked() {return player.g.sacrificeactive[2].gte(1)},
            done() {return player.r.mastery.gte("165000") && player.g.sacrificeactive[2].gte(1)},
            style() {
                if(hasMilestone(this.layer,this.id)) return Qcolor('green',75)
                else return Qcolor('black',75)
            },
        },
        5: {
            requirementDescription() {return options.hidemastery?"Milestone 5":""+format(200000)+" Mastery (5)"},
            effectDescription() {return ""+Qcolor2('e',"Exponent")+" milestones and upgrades no longer "+Qcolor2('a','reset')+""},
            unlocked() {return player.g.sacrificeactive[2].gte(1)},
            done() {return player.r.mastery.gte("200000") && player.g.sacrificeactive[2].gte(1)},
            style() {
                if(hasMilestone(this.layer,this.id)) return Qcolor('green',75)
                else return Qcolor('black',75)
            },
        },
        6: {
            requirementDescription() {return options.hidemastery?"Milestone 6":""+format(230000)+" Mastery (6)"},
            effectDescription() {return " "+Qcolor2('y','Graduation')+" doesn't reset "+Qcolor2('r',"Meta-research")+" QOL upgrade "+Qcolor2('a','anymore')+""},
            unlocked() {return player.g.sacrificeactive[2].gte(1)},
            done() {return player.r.mastery.gte("230000") && player.g.sacrificeactive[2].gte(1)},
            style() {
                if(hasMilestone(this.layer,this.id)) return Qcolor('green',75)
                else return Qcolor('black',75)
            },
        },
        7: {
            requirementDescription() {return options.hidemastery?"Milestone 7":""+format(260000)+" Mastery (7)"},
            effectDescription() {return ""+Qcolor2('a','Passively')+" recieve "+Qcolor2('a','20%')+" of your "+Qcolor2('r','MR')+" on reset every second ("+Qcolor2('s','Unaffected')+" by "+Qcolor2('y','Gamespeed')+")"},
            unlocked() {return player.g.sacrificeactive[2].gte(1)},
            done() {return player.r.mastery.gte("260000") && player.g.sacrificeactive[2].gte(1)},
            style() {
                if(hasMilestone(this.layer,this.id)) return Qcolor('green',75)
                else return Qcolor('black',75)
            },
        },
        8: {
            requirementDescription() {return options.hidemastery?"Milestone 8":""+format(300000)+" Mastery (8)"},
            effectDescription() {return ""+Qcolor2('a','Enmetalized')+" Bits is "+Qcolor2('green3','instantly')+" converted to "+Qcolor2('green5','Metabit')+""},
            unlocked() {return player.g.sacrificeactive[2].gte(1)},
            done() {return player.r.mastery.gte("300000") && player.g.sacrificeactive[2].gte(1)},
            style() {
                if(hasMilestone(this.layer,this.id)) return Qcolor('green',75)
                else return Qcolor('black',75)
            },
        }
    },
    bars: {
        prestigetime: {
            unlocked() { return player.g.sacrificeactive[1].gte(1) },
            direction: RIGHT,
            width: 400,
            height: 100,
            progress() {
                return player.g.s2best.max(1).log(10).div(50)
            },
            fillStyle: {
                "background-color": "green",
            },
            display() {
                return "You have "+formatTime(player.r.prestigetime)+" Prestige time <br> Filled : " + formatTime(player.g.s2best) + " / " + formatTime(d("1e50")) +" <br> Permeant boost : x"+format(buyableEffect('g',202),3)+" to Gamespeed";
            },
        },
    },
    clickables: {
        11: {
            title() { return "Hold to fill" },
            canClick() { return player.r.prestigetime.gt(10)},
            unlocked() { return player.g.sacrificeactive[1].gte(1) },
            onHold() {
                let expected = player.r.prestigetime.times(0.025)
                let next = player.g.s2best.times(0.5).add(1)
                let fill = expected.min(next)

                player.g.s2best = player.g.s2best.add(fill)
                player.r.prestigetime = player.r.prestigetime.sub(fill)
            },
            style() {   
            return Qcolor('purple',40)
        },
        },
        12: {
            title() { return "Further explore" },
            canClick() { return player.points.gt("1e10000") && player.g.s4best.neq(2)},
            unlocked() { return player.g.sacrificeactive[3].gte(1) },
            tooltip() {
                let text = ""
                let level = player.g.s4best
                if(level.eq(1)) text = "Exploring depth 2 <br> In this depth , Additive , Subtractive and Exponent corruption start 2x sooner while Number , Multiplicative and Divisive corruption start is square rooted <br> In depth 2 : You will be given a total of 30 Exponent weight , assign them to Number/Multiplicative/Divisive to boost them "
                if(level.eq(2)) text = "You cannot go to depth 3 yet"
                return "Require : "+f(d("e10000"))+" Points <br>"+text 
            },
            ttStyle() {
            return {
                "width":"300px",
                "border":"2px solid",
                "border-color":"red",
                "color":"red",
             }
            },
            onClick() {
            if(player.g.s4best.gte(2)) return
            if (!confirm("Do you wish to further explore Altered realm . This action will restart your current Graduation")) return
            player.g.s4best = player.g.s4best.add(1)
            buyBuyable('g',100)
            player.g.timer = d(1200)
            },
            style() {
            if(this.canClick()) return Qcolor('red',40)   
            return Qcolor('black',40)
        },
        },
        13: {
            title() { return "Go back" },
            canClick() { return player.g.s4best.gte(2)},
            unlocked() { return player.g.sacrificeactive[3].gte(1) },
            tooltip() {return "Require : If you really want to <br> Unlocked powers will be removed"},
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
                    "color":"white",
                 }
                },
            onClick() {
            if (!confirm("Do you want to retreat from Altered realm . This action will restart your current Graduation and will remove bonuses reached")) return
            player.g.s4best = player.g.s4best.sub(1)
            player.g.EW = player.g.tEW
            player.g.effectWeight[0] = d(0)
            player.g.effectWeight[1] = d(0)
            player.g.effectWeight[2] = d(0)
            player.subtabs.e.stuff = "Main"
            buyBuyable('g',100)
            player.g.timer = d(1200)
            },
            style() {   
            if(this.canClick()) return Qcolor('green',40)
            return Qcolor('black',40)
        },
        },
    },
    buyables: {
        10: {
            title() {
             return "Graduation reset <br><i> Gain +"+formatWhole(this.effect())+" Graduate"
            } ,
            display() { return options.hidemastery?"Perform a graduation reset to gain Graduate":"Perform a graduation reset to gain Graduate , requiring "+format(40000)+" Mastery" },
            canAfford() { return player.r.mastery.gte(40000) },
            unlocked() {return true},
            buy() {
            if (!confirm("Performing a graduation reset will reset most prior feature in exchange for Graduate . Are you sure?")) return
                player.g.points = player.g.points.add(this.effect())
                if(player.r.mastery.gte(40000) && player.g.rank.eq(1)) {
                    player.g.rank = player.g.rank.add(1)
                    player.g.cutscene = player.g.cutscene.add(1)
                    player.g.fastest = player.g.timer
                }
                let timer = player.g.timer2
                player.g.fastest = player.g.fastest.min(timer)
                buyBuyable('g',100)
                for (let i = 0; i < player.g.sacrificenext.length; i++) {
                    player.g.sacrificeactive[i] = d(player.g.sacrificenext[i])
                   
               }
               player.n.points = d(0)
            },
            effect() {
                let base = d(1)
                if(hasAchievement('ac',141)) base = base.add(player.r.mastery.div(50000).floor())
                if(player.r.tetration.gte(23)) base = base.add(2).times(1.5)
                if(hasAchievement('ac',111)) base = base.times(player.ac.achievements.filter(x => x>=111 && x<=139).length * 0.04 + 1)
                if(hasAchievement('ac',139)) base = base.times(player.ac.achievements.filter(x => x>=141 && x<=169).length * 0.03 + 1)
                if(hasUpgrade('n',74)) base = base.times(buyableEffect('n',91)).times(buyableEffect('n',92)).times(buyableEffect('n',93))
                return base.floor()
            },
            style() {
                if(player.r.mastery.gte(40000)) return Qcolor('green')
                else return Qcolor()
        }
        },
        11: {
            title() {
             return "Get a new Orb"
            } ,
            tooltip() { 
                return player.g.g1?"Get a new orb <br> Always have an quality of 50% <br> Always contains : x1.073 Effective Exponent and ^1.118 Number gain"
                :"Replace your current orb <br> <i> Potential Effect : Raise Number , Multiplicative , Divisive gain . Multiply direct Additive , Subtractive , Research gain . Boosts Max Perk power and Effective Exponent" 
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
					"color":"white",
                }
            },
            canAfford() { return player.g.points.gte(player.g.costMultiplier) },
            unlocked() {return true},
            buy() {
            if(player.g.g1) {
                player.g.points = d(0)
                player.g.artifact1 = RandomArtifactID(0,[1,6])
                player.g.artifact1q = [50,50,50,50]
                player.g.artifact1eff = getArtifactEffect(player.g.artifact1,player.g.artifact1q)
                player.g.artifactset1 = AllArtifactEffect(player.g.artifact1,player.g.artifact1eff,0)
                updateArtifactEffect()
                save()
                player.g.g1 = !player.g.g1
                return
            }
            if (!confirm("Buying or Replacing artifacts will force a graduation reset . Are you sure?")) return
                buyBuyable('g',100)
                player.g.points = player.g.points.sub(player.g.costMultiplier)
                player.g.artifact1 = RandomArtifactID(0)
                player.g.artifact1q = RandomArtifactQuality(player.g.artifactquality)
                player.g.artifact1eff = getArtifactEffect(player.g.artifact1,player.g.artifact1q)
                player.g.artifactset1 = AllArtifactEffect(player.g.artifact1,player.g.artifact1eff,0)
                updateArtifactEffect()
                save()
            },
            style() {
                if (player.g.points.lt(player.g.costMultiplier)) {
                    return Qcolor()
                 }    else return Qcolor('green')
        }
        },
        12: {
            title() {
             return "Get a new Relic"
            } ,
            tooltip() { return player.g.g1?"Locked - First Artifact must be an Orb"
                :"Replace your current relic <br><i> Potential Effect : Lowered Research cost , Point Boost cost , Energy booster cost , LA/DS generator requirement , Additive/Subtractive cost scaling effect" 
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
					"color":"white",
                }
            },
            canAfford() { return player.g.points.gte(player.g.costMultiplier) },
            unlocked() {return true},
            buy() {
                if(player.g.g1) return
                if (!confirm("Buying or Replacing artifacts will force a graduation reset . Are you sure?")) return
                buyBuyable('g',100)
                player.g.points = player.g.points.sub(player.g.costMultiplier)
                player.g.artifact2 = RandomArtifactID(1)
                player.g.artifact2q = RandomArtifactQuality(player.g.artifactquality)
                player.g.artifact2eff = getArtifactEffect(player.g.artifact2,player.g.artifact2q)
                player.g.artifactset2 = AllArtifactEffect(player.g.artifact2,player.g.artifact2eff,1)
                updateArtifactEffect()
                save()
            },
            style() {
                if (player.g.points.lt(player.g.costMultiplier)) {
                    return Qcolor()
                 }    else return Qcolor('green')
        }
        }, 
        13: {
            title() {
             return "Get a new Ring"
            } ,
            tooltip() { return player.g.g1?"Locked - First Artifact must be an Orb"
                :"Replace your current ring <br><i>Potential Effect : Raise Perk power gain , all improvement effect , Perk power effect (A/S/E cost reduction) , Point boost effect . Increase Twilight perk strength , LA and DS generator strength and the 10th boost from Perk power"},
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
					"color":"white",
                }
            },
            canAfford() { return player.g.points.gte(player.g.costMultiplier) },
            unlocked() {return true},
            buy() {
                if(player.g.g1) return
                if (!confirm("Buying or Replacing artifacts will force a graduation reset . Are you sure?")) return
                buyBuyable('g',100)
                player.g.points = player.g.points.sub(player.g.costMultiplier)
                player.g.artifact3 = RandomArtifactID(2)
                player.g.artifact3q = RandomArtifactQuality(player.g.artifactquality)
                player.g.artifact3eff = getArtifactEffect(player.g.artifact3,player.g.artifact3q)
                player.g.artifactset3 = AllArtifactEffect(player.g.artifact3,player.g.artifact3eff,2)
                updateArtifactEffect()
                save()
            },
            style() {
                if (player.g.points.lt(player.g.costMultiplier)) {
                    return Qcolor()
                 }    else return Qcolor('green')
        }
        }, 
        14: {
            title() {
             return "Get a new Charm"
            } ,
            tooltip() { return player.g.g1?"Locked - First Artifact must be an Orb"
                :"Replace your current charm <br> <i> Potential Effect : Multiply Gamespeed / Prestige time gain . Raise Tickspeed / all Pre-Research challenge goal . Increase Exponent boost / Max perk power . Reduce MR challenge modifier effect , exponent cost scaling base " 
            },
            ttStyle() {
                return {
                    "width":"300px",
                    "border":"2px solid",
                    "border-color":"white",
					"color":"white",
                }
            },
            canAfford() { return player.g.points.gte(player.g.costMultiplier.times(2)) },
            unlocked() {return true },
            buy() {
                if(player.g.g1) return
                if (!confirm("Buying or Replacing artifacts will force a graduation reset . Are you sure?")) return
                buyBuyable('g',100)
                player.g.points = player.g.points.sub(player.g.costMultiplier.times(2))
                player.g.artifact4 = RandomArtifactID(3)
                player.g.artifact4q = RandomArtifactQuality(player.g.artifactquality)
                player.g.artifact4eff = getArtifactEffect(player.g.artifact4,player.g.artifact4q)
                player.g.artifactset4 = AllArtifactEffect(player.g.artifact4,player.g.artifact4eff,3)
                updateArtifactEffect()
                save()
            },
            style() {
                if (player.g.points.lt(player.g.costMultiplier.times(2))) {
                    return Qcolor()
                 }    else return Qcolor('green')
        }
        },
        15: {
            title() {
             return "Sacrifice your Artifact"
            } ,
            display() { return "Sacrifice all of your artifact . Will force a Graduation reset" },
            canAfford() { return true },
            buy() {
                player.g.artifact1 = [0,0,0,0]
                player.g.artifact2 = [0,0,0,0]
                player.g.artifact3 = [0,0,0,0]
                player.g.artifact4 = [0,0,0,0]
                player.g.artifact1q = [0,0,0,0]
                player.g.artifact2q = [0,0,0,0]
                player.g.artifact3q = [0,0,0,0]
                player.g.artifact4q = [0,0,0,0]
                player.g.artifact1eff = [1,1,1,1]
                player.g.artifact2eff = [1,1,1,1]
                player.g.artifact3eff = [1,1,1,1]
                player.g.artifact4eff = [1,1,1,1]
                buyBuyable('g',100)
                updateAllAritfactEffect()
                updateArtifactEffect()
                save()
                window.location.reload();
            },
            style() {
              return Qcolor('red')
        }
        },
        16: {
            title() {
             return "Restart Graduation"
            } ,
            canAfford() { return true },
            buy() {
                if(!confirm("Do you want to restart your current Graduation? You may reselect sacrifices if you want")) return
                buyBuyable('g',100)
                for (let i = 0; i < player.g.sacrificenext.length; i++) {
                     player.g.sacrificeactive[i] = d(player.g.sacrificenext[i])
                    
                }
                completeChallenge('r', 11)
                Vue.set(player.r, "activeChallenge", null)
            },
            style() {
              return Qcolor('red')
        }
        },    
        17: {
            title() {
                return "Respec all Exponent weight spent"
               } ,
            cost(x) { 
                return d(0)},
            canAfford() { return true},
            tooltip() {return "Respec spent Exponent weight"},
            unlocked() {return player.g.s4best.gte(2)},
            buy() {
               player.g.buyables[this.id] = player.g.buyables[this.id].sub(1).times(-1)

            },
            style() {
                if (player.g.buyables[this.id].eq(0)) {
                    return Qcolor('green',40)
                }
				 else return Qcolor('red',40)}
        },
        21: {
            title() {
             return "More Expensive"
            } ,
            display() { return "Double the cost of all artifacts , but grant +25 Artifact Quality , up to +150" },
            canAfford() { return player.g.costMultiplier1.lte(32)},
            unlocked() {return true},
            buy() {
                player.g.costMultiplier1 = player.g.costMultiplier1.times(2).ceil()
            },
            style() {
             if(!this.canAfford()) return Qcolor() 
             return Qcolor('green')
            }
        }, 
        22: {
            title() {
             return "Less Expensive"
            } ,
            display() { return "Halved the cost of all artifacts , but lose -25 Artifact Quality" },
            canAfford() { return player.g.costMultiplier1.gt(1) },
            unlocked() {return true},
            buy() {
                player.g.costMultiplier1 = player.g.costMultiplier1.div(2).ceil()
            },
            style() {  
             if(this.canAfford()) return Qcolor('rgb(200,0,0)')
             else return Qcolor()
            }
        },       
        100: {
            title() {
             return "force Graduation reset"
            } ,
            canAfford() { return true },
            buy() {                    
            if(player.g.buyables[17].eq(0)) {
                player.g.EW = player.g.tEW
                player.g.effectWeight[0] = d(0)
                player.g.effectWeight[1] = d(0)
                player.g.effectWeight[2] = d(0)
                player.g.buyables[17] = d(1)
            }
            player.g.timer = d(0)
            player.points = d(10)
            if(!hasUpgrade('n',92)) player.al.upgrades.filter(x => x>60)
            player.r.points = d(0)
            for (let i = 0; i < player.r.milestones.length; i++) {
            
                player.r.milestones.splice(i, 1);
                i--;
            
           }
            if(!hasMilestone('g',6)) player.r.upgrades = player.r.upgrades.filter(num => num>100)
            MRreset()
            
            player.r.buyables[101] = d(0)
            player.r.buyables[102] = d(0)
            player.r.buyables[103] = d(0)
            player.r.buyables[104] = d(0)
            player.r.buyables[105] = d(0)
            player.r.buyables[201] = d(0)
            player.r.buyables[202] = d(0)
            player.r.buyables[203] = d(0)
            player.r.buyables[301] = d(0)
            player.r.buyables[302] = d(0)
            player.r.buyables[303] = d(0)
            player.r.buyables[401] = d(0)
            player.r.buyables[402] = d(0)
            player.r.buyables[403] = d(0)
            player.r.buyables[501] = d(0)

            player.al.points = d(0)
            player.al.extension = d(0)
            player.al.operation = d(0)    
            for (let i = 0 ; i < 12 ; i++) {
                let j = i % 4 + 1
                let k = Math.floor(i / 4) * 10 + 10
                let l = j + k 
                player.al.buyables[l] = new Decimal(0)
            }

            player.r.nbest = d(0)
            player.r.abest = d(0)
            player.r.sbest = d(0)
            player.r.mbest = d(0)
            player.r.dbest = d(0)
            player.r.ebest = d(0)
            player.r.mabest = d(0)
            player.r.pointbest = d(0)
            player.r.tbest = d(0)
            player.r.tetration = player.r.tetration.min(player.g.s5best.max(4))
            player.r.prestigetime = d(0)
            player.r.metaresearch = d(0)
            player.points = d(10)
            player.n.points = d(0)
            player.a.points = d(0)
            player.s.points = d(0)
            player.m.points = d(0)
            player.d.points = d(0)
            player.e.points = d(0)
            player.r.points = d(0)
            player.r.lightadd = d(0)
            player.r.darksub = d(0)
            player.r.twilight = d(0)
            player.r.metaresearch = d(0)
            player.r.energy = d(0)
            player.e.perkpower = d(0)
            player.al.operation = d(0)
            doReset('r',true)
            options.theme = themes[0]
            changeTheme()
            resizeCanvas()
            player.g.timer = d(0)
            player.g.timer2 = d(0)
            player.r.timer = d(0)
            player.r.timer2 = d(0)
            if(options.dev) player.g.timer = d(1200)
            doReset('r',true)

            },
            style() {
                return Qcolor('red')
          },
        
        },
        201: {
            title() {
             return player.g.SacrificeUnlock[this.id-201].gte(1)?"Number sacrifice":"Locked-S1"
            } ,
            effect() {
             return player.g.s1best.max(1).pow(player.points.add(10).log(achievementEffect('ac',143).max(1)).div(10000))
            },
            display() {
                let text = shiftDown?"x"+format(tmp.g.buyables[201].effect)+" Number":"Multiplier to Number gain based on highest Number in this sacrifice ("+format(player.g.s1best,0)+") and scale with current Points"
                let text2 = "^0.05 Number gain but ^2.5 Multiplicative & Divisive gain <br> Permeant reward : "+text+""
                return player.g.SacrificeUnlock[this.id-201].gte(1)?text2:"Unlock this sacrifice <br> Click this button"
            },
            canAfford() { return true },
            buy() {

               if(player.g.sacrificehover.neq(d(this.id).sub(200))) {
                 player.g.sacrificehover = d(d(this.id).sub(200))
               } else {
                if(player.g.SacrificeUnlock[this.id-201].eq(0) && player.g.sacrificehover.eq(d(d(this.id).sub(200)))) {
                    player.g.SacrificeUnlock[this.id-201] = d(1)
                    return
               }
               if(player.g.SacrificeUnlock[this.id-201].gte(1)) player.g.sacrificenext[this.id - 201] = player.g.sacrificenext[this.id - 201].sub(1).times(-1)
               }

            
            },
            style() {
              if(player.g.SacrificeUnlock[this.id - 201].eq(0)) return Qcolor('rgb(128,0,0)')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('lime')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('orange')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('rgb(128,128,32)')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('black')

        },
            
        },
        202: {
            title() {
             return player.g.SacrificeUnlock[this.id-201].gte(1)?"Tickspeed sacrifice":"Locked-S2"
            },
            effect() {
                return player.g.s2best.max(1).log(10).div(50).pow(6.4).times(99).add(1)
            },
            display() {
                let text = options.hidemastery?"Sacrifice Tickspeed for an increasing Gamespeed multiplier <br> In this sacrifice , there is a bar requiring <i>Prestige time</i> to be filled and grant Gamespeed bonuses":"Sacrifice Tickspeed for a Gamespeed multiplier equal to current Mastery <br> In this sacrifice , there is a bar requiring <i>Prestige time</i> to be filled and grant Gamespeed bonuses"
                return player.g.SacrificeUnlock[this.id-201].gte(1)?text:"Unlock this sacrifice <br> Requiring "+format(d("1e1200"))+" Tickspeed <br><i> Current Tickspeed is "+format(tmp.t.effect)+""

            },
            canAfford() { return true },
            buy() {

               if(player.g.sacrificehover.neq(d(this.id).sub(200))) {
                 player.g.sacrificehover = d(d(this.id).sub(200))
               } else {
                if(player.g.SacrificeUnlock[this.id-201].eq(0) && tmp.t.effect.gte("1e1200") && player.g.sacrificehover.eq(d(d(this.id).sub(200)))) {
                    player.g.SacrificeUnlock[this.id-201] = d(1)
                    return
               }
               if(player.g.SacrificeUnlock[this.id-201].gte(1)) player.g.sacrificenext[this.id - 201] = player.g.sacrificenext[this.id - 201].sub(1).times(-1)
               }

            
            },
            style() {
              if(player.g.SacrificeUnlock[this.id - 201].eq(0)) return Qcolor('rgb(128,0,0)')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('lime')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('orange')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('rgb(128,128,32)')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('black')

        },
        },
        203: {
            title() {
                return player.g.SacrificeUnlock[this.id-201].gte(1)?"Time sacrifice":"Locked-S3"
               },
            effect() {
                return player.g.s3best.max(10).log(10).pow(0.5).div(5)
            },
            display() {
                let text = options.hidemastery?"Sacrifice Prestige Time <br> Unlock various milestone , which grant more QOL":"Sacrifice Prestige Time for 1.67x Mastery <br> Unlock various milestone , which require Mastery <i>in this sacrifice</i> , granting more QOL"
                return player.g.SacrificeUnlock[this.id-201].gte(1)?text:"Unlock this sacrifice <br> Reach 135 total Improvements level<br><i> Total Improvements level is "+format(getBuyableAmount('r', '101').add(getBuyableAmount('r', '102')).add(getBuyableAmount('r', '103')).add(getBuyableAmount('r', '104')).add(getBuyableAmount('r','105')),0)+""

            },
            canAfford() { return true },
            canAfford() { return true },
            buy() {

               if(player.g.sacrificehover.neq(d(this.id).sub(200))) {
                 player.g.sacrificehover = d(d(this.id).sub(200))
               } else {
                if(player.g.SacrificeUnlock[this.id-201].eq(0) && d(1).times(getBuyableAmount('r', '101').add(getBuyableAmount('r', '102')).add(getBuyableAmount('r', '103')).add(getBuyableAmount('r', '104')).add(getBuyableAmount('r','105'))).gte(135) &&player.g.sacrificehover.eq(d(d(this.id).sub(200)))) {
                    player.g.bits = player.g.bits.sub("1e21")
                    player.g.SacrificeUnlock[this.id-201] = d(1)
                    return
               }
               if(player.g.SacrificeUnlock[this.id-201].gte(1)) player.g.sacrificenext[this.id - 201] = player.g.sacrificenext[this.id - 201].sub(1).times(-1)
               }

            
            },
            style() {
              if(player.g.SacrificeUnlock[this.id - 201].eq(0)) return Qcolor('rgb(128,0,0)')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('lime')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('orange')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('rgb(128,128,32)')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('black')

        },
        },
        204: {
            title() {
                return player.g.SacrificeUnlock[this.id-201].gte(1)?"Realm sacrifice":"Locked-S4"
               },
            effect() {
                return player.g.s3best.max(1).pow(0.3).tetrate(1.5)
            },
            display() {
                let text2 = "Permeant Altered realm but x3 MR gain <br> After reaching "+format(d("1e10000"))+" points <i>in this sacrifice</i> , you may further explore Altered realm , encountering harsher penalities but yielding more power"
                return player.g.SacrificeUnlock[this.id-201].gte(1)?text2:"Unlock this sacrifice <br> Needing "+format(d("1e850"))+" Operation <br><i> You have "+format(player.al.operation)+" Operation"
            },
            canAfford() { return true },
            buy() {

               if(player.g.sacrificehover.neq(d(this.id).sub(200))) {
                 player.g.sacrificehover = d(d(this.id).sub(200))
               } else {
                if(player.g.SacrificeUnlock[this.id-201].eq(0) && player.al.operation.gte("1e850") && player.g.sacrificehover.eq(d(d(this.id).sub(200)))) {
                    player.g.SacrificeUnlock[this.id-201] = d(1)
                    return
               }
               if(player.g.SacrificeUnlock[this.id-201].gte(1)) player.g.sacrificenext[this.id - 201] = player.g.sacrificenext[this.id - 201].sub(1).times(-1)
               }

            
            },
            style() {
              if(player.g.SacrificeUnlock[this.id - 201].eq(0)) return Qcolor('rgb(128,0,0)')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('lime')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('orange')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('rgb(128,128,32)')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('black')

        },
        },                    
        205: {
            title() {
                return player.g.SacrificeUnlock[this.id-201].gte(1)?"Herbivore sacrifice":"Locked-S5"
               },
            display() {
                 let text2 = "All row2 layers are disabled and cannot generate resources . +250% twilight reward strength <br> Inside of this sacrifice lies a portal to the third realm"
                 return player.g.SacrificeUnlock[this.id-201].gte(1)?text2:"Unlock this sacrifice <br> Achieve "+format(d("24"),0)+" Tetration <br><i> You have "+format(player.r.tetration,0)+" Tetration"
            },
            canAfford() { return true },
            buy() {

               if(player.g.sacrificehover.neq(d(this.id).sub(200))) {
                 player.g.sacrificehover = d(d(this.id).sub(200))
               } else {
                if(player.g.SacrificeUnlock[this.id-201].eq(0) && player.r.tetration.gte(24)&& player.g.sacrificehover.eq(d(d(this.id).sub(200)))) {
                    player.g.SacrificeUnlock[this.id-201] = d(1)
                    return
               }
               if(player.g.SacrificeUnlock[this.id-201].gte(1)) player.g.sacrificenext[this.id - 201] = player.g.sacrificenext[this.id - 201].sub(1).times(-1)
               }

            
            },
            style() {
              if(player.g.SacrificeUnlock[this.id - 201].eq(0)) return Qcolor('rgb(128,0,0)')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('lime')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('orange')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('rgb(128,128,32)')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('black')

        },
        },         
        206: {
            title() {
                return player.g.SacrificeUnlock[this.id-201].gte(1)?"Exponent sacrifice":"Locked-S6"
               },
            display() {
                let text2 = "Exponent cost scaling base is much higher but Tickspeed is ^4 & Tickspeed cap is "+f(d("1e1500"))+"x higher  <br> Permeant reward : You can charge up 1 Graduation I Achievements per Exponent inside this challenge , giving it much stronger bonuses"
                return player.g.SacrificeUnlock[this.id-201].gte(1)?text2:"Unlock this sacrifice <br> Have "+format(d("167"),0)+" Exponent <br><i> You have "+format(player.e.points,0)+" Exponent"

            },
            canAfford() { return true },
            buy() {

               if(player.g.sacrificehover.neq(d(this.id).sub(200))) {
                 player.g.sacrificehover = d(d(this.id).sub(200))
               } else {
                if(player.g.SacrificeUnlock[this.id-201].eq(0) && player.e.points.gte("167") && player.g.sacrificehover.eq(d(d(this.id).sub(200)))) {
                    player.g.SacrificeUnlock[this.id-201] = d(1)
                    return
               }
               if(player.g.SacrificeUnlock[this.id-201].gte(1)) player.g.sacrificenext[this.id - 201] = player.g.sacrificenext[this.id - 201].sub(1).times(-1)
               }

            
            },
            style() {
              if(player.g.SacrificeUnlock[this.id - 201].eq(0)) return Qcolor('rgb(128,0,0)')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('lime')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('orange')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('rgb(128,128,32)')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('black')

        },
        },         
        207: {
            title() {
                return player.g.SacrificeUnlock[this.id-201].gte(1)?"Challenge sacrifice":"Locked-S7"
               },
            display() {
                let text2 = "You're trapped in MR challenge with <i>every single modifier maxed apart from Frozen Time</i> ; Improvements cost way less and is unlocked instantly <br> Permeant reward : Any challenge you completed in this sacrifice recieve 1 new effect"
                return player.g.SacrificeUnlock[this.id-201].gte(1)?text2:player.g.sacrificeactive[2].gte(1)?"Unlock this sacrifice <br> You cannot unlock inside of Time sacrifice , nice try":"Unlock this sacrifice <br> Obtain "+format(d("250000"),0)+" Mastery (Currently impossible) <br><i> You have "+format(player.r.mastery)+" Mastery"

            },
            canAfford() { return true },
            buy() {

               if(player.g.sacrificehover.neq(d(this.id).sub(200))) {
                 player.g.sacrificehover = d(d(this.id).sub(200))
               } else {
                if(player.g.SacrificeUnlock[this.id-201].eq(0) && player.r.mastery.gte("250000") && !player.g.sacrificeactive[2].gte(1) && player.g.sacrificehover.eq(d(d(this.id).sub(200)))) {
                    player.g.SacrificeUnlock[this.id-201] = d(1)
                    return
               }
               if(player.g.SacrificeUnlock[this.id-201].gte(1)) player.g.sacrificenext[this.id - 201] = player.g.sacrificenext[this.id - 201].sub(1).times(-1)
               }

            
            },
            style() {
              if(player.g.SacrificeUnlock[this.id - 201].eq(0)) return Qcolor('rgb(128,0,0)')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('lime')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('orange')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('rgb(128,128,32)')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('black')

        },
        },         
        208: {
            title() {
                return player.g.SacrificeUnlock[this.id-201].gte(1)?"Points sacrifice":"Locked-S8"
               },
            display() {
                let text2 = "All Points gain multiplier and exponent is reduced to 1 <br> Tickspeed is equal to 10^(log(Tickspeed)^0.75) <br> Permeant reward : The 6th improvement is unlocked and will not reset normally , but can only be bought inside of this sacrifice"
                return player.g.SacrificeUnlock[this.id-201].gte(1)?text2:"Unlock this sacrifice <br> Gather "+format(d("1e25000"),0)+" Points (Currently impossible) <br><i> You have "+format(player.points)+" Points"

            },
            canAfford() { return true },
            buy() {
               if(player.g.sacrificehover.neq(d(this.id).sub(200))) {
                 player.g.sacrificehover = d(d(this.id).sub(200))
               } else {
                if(player.g.SacrificeUnlock[this.id-201].eq(0) && player.points.gte("1e25000") && player.g.sacrificehover.eq(d(d(this.id).sub(200)))) {
                    player.g.SacrificeUnlock[this.id-201] = d(1)
                    return
               }
               if(player.g.SacrificeUnlock[this.id-201].gte(1)) player.g.sacrificenext[this.id - 201] = player.g.sacrificenext[this.id - 201].sub(1).times(-1)
               }

            
            },
            style() {
              if(player.g.SacrificeUnlock[this.id - 201].eq(0)) return Qcolor('rgb(128,0,0)')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('lime')
              if(player.g.sacrificeactive[this.id - 201].eq(1) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('orange')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(1)) return Qcolor('rgb(128,128,32)')
              if(player.g.sacrificeactive[this.id - 201].eq(0) && player.g.sacrificenext[this.id - 201].eq(0)) return Qcolor('black')

        },
        },
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
            ["raw-html", function () { return "<h3>Graduation reset mostly everything prior to it (including best Altered resource record) for Graduate"}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3><i> You will keep ticks , challenge shard , all achievements and up to "+format(player.g.s5best.max(4),0)+" tetration on this reset"}, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["row" , [["buyable" , 17]]],
            ["row" , [["buyable" , 10]]],


            ]
        },
        "Artifact": {
            buttonStyle() { return { 'color': 'lime' } },
            unlocked() { return true }, 
            content:[
            ["raw-html", function () { return "<h3>Artifacts provide permeant buff"}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>Artifacts have 4 out of 8 different effect , each having a random quality determining their strength"}, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3><i>Current Artifact quality is "+format(player.g.artifactquality,0)+" , averaging : "+format((d(0.5).pow(d(100).div(d(100).add(player.g.artifactquality)))).times(100))+"% quality"}, { "color": "lime", "font-size": "18px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3><i>Current Artifact level is "+format(player.g.artifactlevel,0)+""}, { "color": "lime", "font-size": "18px", "font-family": "helvetica" }],

            ["blank" , "25px"],
            ["microtabs", "artifact", { 'border-width': '0px' }],
        ]
        },
        "Rank": {
            buttonStyle() {return {'color' : 'red'}}, 
            unlocked() {return true},
            content: [
                ["raw-html", function () { return "<h3>Graduation rank reward"}, { "color": "cyan", "font-size": "22px", "font-family": "helvetica" }],
                ["row", [["infobox" , "rank2"]]],
            ]
        },
        "Sacrifice": {
            buttonStyle() {return {'color' : 'red'}}, 
            unlocked() {return hasUpgrade('n',71)},
            content: [
                ["raw-html", function () { return "<h3><i> You can enter multiple sacrifices at once <br>"}, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3><i> Sacrifice will be applied on the next Graduation reset"}, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3><i> Click to see their effect and click again to activate , deactivate , unlock"}, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return buyableEffect('g',202).gt(1)?"<h3><i> [Tickspeed sacrifice] @ "+formatTime(player.g.s2best)+" filled => "+format(buyableEffect('g',202),3)+"x Gamespeed":""}, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.g.s4best.gt(1)?"<h3><i> [Realm sacrifice] @ Altered realm exploration depth : "+format(player.g.s4best)+"":""}, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],

                ["blank","25px"],
                ["raw-html", function () { return player.g.sacrificehover.eq(0)?"":"<h3> ["+tmp.g.buyables[d(200).add(player.g.sacrificehover.max(1))].title+"] "+tmp.g.buyables[d(200).add(player.g.sacrificehover.max(1))].display()+""}, { "color": function() {return player.g.sacrificenext[player.g.sacrificehover.max(1).sub(1)].gte(1)?"lime":"red"}, "font-size": "22px", "font-family": "helvetica" }],
                ["blank", "25px"],
                ["row" , [["buyable" , 201], ["buyable" , 202] , ["buyable" , 203] , ["buyable" , 204]]],
                ["row" , [["buyable" , 205], ["buyable" , 206] , ["buyable" , 207] , ["buyable" , 208]]],
                ["blank", "25px"],
                ["row" , [["bar" , "prestigetime"],["clickable" , 11],["clickable" , 12],["clickable" , 13]]],
                ["row" , [["milestone" , 1]]],
                ["row" , [["milestone" , 2]]],
                ["row" , [["milestone" , 3]]],
                ["row" , [["milestone" , 4]]],
                ["row" , [["milestone" , 5]]],
                ["row" , [["milestone" , 6]]],
                ["row" , [["milestone" , 7]]],
                ["row" , [["milestone" , 8]]],
                ["blank" , "25px"],
                ["row" , [["buyable" , 17]]],
                ["row" , [["buyable" , 16]]],
                
            ]
        },
    },
    artifact: {
        "Orb": {
            buttonStyle() { return { 'color': 'lime' } },
            unlocked() { return true }, 
            content:[
            ["raw-html", function () { return "<h3>Orb"}, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3><i>Cost "+formatWhole(player.g.costMultiplier)+" Graduate"}, { "color": "grey", "font-size": "18px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact1d[0]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact1q[0] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact1d[1]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact1q[1] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact1d[2]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact1q[2] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact1d[3]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact1q[3] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["row" , [["buyable",22],["buyable" , 11],["buyable",21]]],
        ]
        },
        "Relic": {
            buttonStyle() { return { 'color': 'red' } },
            unlocked() { return true },  
            content: [
            ["raw-html", function () { return "<h3>Relic"}, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3><i>Cost "+formatWhole(player.g.costMultiplier)+" Graduate"}, { "color": "grey", "font-size": "18px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact2d[0]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact2q[0] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact2d[1]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact2q[1] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact2d[2]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact2q[2] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact2d[3]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact2q[3] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["row" , [["buyable",22],["buyable" , 12],["buyable",21]]],
        ]
        }, 
        "Ring": {
            buttonStyle() { return { 'color': 'orange' } },
            unlocked() { return true }, 
            content:[
            ["raw-html", function () { return "<h3>Ring"}, { "color": "orange", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3><i>Cost "+formatWhole(player.g.costMultiplier)+" Graduate"}, { "color": "grey", "font-size": "18px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact3d[0]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact3q[0] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact3d[1]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact3q[1] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact3d[2]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact3q[2] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact3d[3]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact3q[3] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["row" , [["buyable",22],["buyable" , 13],["buyable",21]]],
        ]
        }, 
        "Charm": {
            buttonStyle() { return { 'color': 'pink' } },
            unlocked() { return true }, 
            content:[
            ["raw-html", function () { return "<h3>Charm provide various buff"}, { "color": "pink", "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3><i>Cost "+formatWhole(player.g.costMultiplier.times(2))+" Graduate"}, { "color": "grey", "font-size": "18px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact4d[0]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact4q[0] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact4d[1]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact4q[1] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact4d[2]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact4q[2] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["raw-html", function () { return "<h3>"+player.g.artifact4d[3]+""}, { "color": function() {return `hsl(${180 * (player.g.artifact4q[3] - 1)/99}, 100%, 50%)`}, "font-size": "22px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["row" , [["buyable",22],["buyable" , 14],["buyable",21]]],
        ]
        },
    },
    unlock: {
        "Requirement": {
            buttonStyle() { return { 'color': 'white' , "border-color" : "gray" } },
            unlocked() { return true },
            content: [
                ["blank" , "25px"],
                ["raw-html", function () { return hasAchievement('ac',109)?"<h3>Normal realm task":"<h3> Complete 80 achievements and reach "+format(35000)+" Mastery first ("+formatWhole(player.ac.achievements.filter(x => x<1000).length)+"/80)" }, { "color": "yellow", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.g.req[0].gte(1)?"<h3> Status : Completed":hasAchievement('ac',109)?"<h3> Status : Incompleted":"" }, { "color": function(){return player.g.req[0].gte(1)?"cyan":"purple"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasAchievement('ac',109)?"<h3>Task 1 : Obtain 1e5250 Points (Currently : "+format(player.points)+")":"" }, { "color": function(){return player.points.gte("1e5250")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasAchievement('ac',109)?"<h3>Task 2 : Obtain 1e10000 Multiplicative (Currently : "+format(player.m.points)+")":"" }, { "color": function(){return player.m.points.gte("1e10000")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasAchievement('ac',109)?"<h3>Task 3 : Have at least 308.25 effective exponent (Currently : "+format(player.e.effective)+")":"" }, { "color": function(){return player.e.effective.gte("308.25")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasAchievement('ac',109)?"<h3>Task 4 : Have at least 13 research (Currently : "+format(player.r.points,0)+")":"" }, { "color": function(){return player.r.points.gte("13")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasAchievement('ac',109)?"<h3>Task 5 : Reach 1e160 tickspeed (Currently : "+format(tmp.t.effect)+")":"" }, { "color": function(){return tmp.t.effect.gte("1e160")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasAchievement('ac',109)?"<h3>Task 6 : Gather "+format(1e21)+" Light additive (Currently : "+format(player.r.lightadd)+")":"" }, { "color": function(){return player.r.lightadd.gte("1e21")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasAchievement('ac',109)?"<h3>Task 7 : Gather "+format(1e20)+" Dark subtractive (Currently : "+format(player.r.darksub)+")":"" }, { "color": function(){return player.r.darksub.gte("1e20")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasAchievement('ac',109)?"<h3>Task 8 : Gather "+format(1e90)+" Energy (Currently : "+format(player.r.energy)+")":"" }, { "color": function(){return player.r.energy.gte("1e90")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return hasAchievement('ac',109)?"<h3>Task 9 : Reach 8 years worth of Prestige Time (Currently : "+formatTime(player.r.prestigetime)+")":"" }, { "color": function(){return player.r.prestigetime.gte("252284000")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
            ]
        },
        "Altered requirement" : {
            buttonStyle() { return { 'color': 'green' , "border-color" : "orange" } },
            unlocked() { return hasAchievement('ac',109) },
            content: [
                ["blank" , "25px"],
                ["raw-html", function () { return "<h3>Altered realm task . All task must be done inside altered realm" }, { "color": "green", "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return player.g.req[1].gte(1)?"<h3> Status : Completed":"<h3> Status : Incompleted" }, { "color": function(){return player.g.req[1].gte(1)?"cyan":"purple"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 1 : Have "+format(1e60)+" Operation (Currently : "+format(player.al.operation)+")" }, { "color": function(){return player.al.operation.gte("1e60")?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 2 : Complete 'Chaotic Division' divisive challenge" }, { "color": function(){return (hasChallenge('d',13) && inChallenge('al',11))?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return options.hidemastery?"<h3>Task 3 : Require/reach something (Currently : "+format(player.r.mabest.div(225))+"% to done)":"<h3>Task 3 : Reach "+format(22500)+" Mastery (Highest : "+format(player.r.mabest)+")" }, { "color": function(){return (player.r.mastery.gte("22500") && inChallenge('al',11))?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 4 : Buy 'Point Boost' buyable at least "+format(3000)+" times (Currently : "+format(player.m.buyables[11])+")" }, { "color": function(){return (player.m.buyables[11].gte(3000) && inChallenge('al',11))?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 5 : Have 1e1175 number (Currently : "+format(player.r.nbest)+")" }, { "color": function(){return (player.n.points.gte("1e1175") && inChallenge('al',11))?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
                ["raw-html", function () { return "<h3>Task 6 : Have 64 perk power (Currently : "+format(player.e.perkpower)+")" }, { "color": function(){return (player.e.perkpower.gte(64) && inChallenge('al',11))?"green":"white"}, "font-size": "22px", "font-family": "helvetica" }],
            ]
            
        },
}},
tabFormat: [
    ["raw-html", function () { return hasAchievement('ac',111)?"<h3>You have "+formatWhole(player.g.points)+" Graduate (+"+formatWhole(buyableEffect('g',10))+" next reset)":"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
    ["raw-html", function () { return "<h3>Your Graduation rank is currently "+convertToRoman(player.g.rank)+"" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
    ["microtabs", "stuff", { 'border-width': '0px' }],
],
layerShown() { return true}


})
