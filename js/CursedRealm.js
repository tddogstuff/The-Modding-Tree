// Cursed realm mechanic
/**
 * Retrieve the first element of an id array , or whatever that id is
 */ 
function getGridID(id) {
    if (Array.isArray(id)) {
      return id[0];
    } else {
      return id;
    }
  }
function getGridID2(id) {
    if (Array.isArray(id)) {
        return id[1];
    } else {
        return d(0);
    }
 }
function modifyDurability(amt) {
    if(!isEquippingTool()) return
    player.cf.grid[player.cf.equipped][1] = d(player.cf.grid[player.cf.equipped][1]).add(amt)
    if(d(player[this.layer].grid[player.cf.equipped][1]).lte(0)) player.cf.grid[player.cf.equipped][0]
}
function isEquippingTool() {
    if (Array.isArray(player.cf.grid[player.cf.equipped])) {
        return player.cf.grid[player.cf.equipped].length > 0
    } else {
        return false
    }
}
function getToolID() {
    if (Array.isArray(player.cf.grid[player.cf.equipped])) {
        if(player.cf.grid[player.cf.equipped].length > 0) {
            return parseInt(player.cf.grid[player.cf.equipped][0])
        } else {
            return 0
        } 
    } else {
        return 0
    }
}
function hasEmptyElement() {
    let object = player.cf.grid
    for (let key in object) {
      if (object[key].length === 0) {
        return true; 
      }
    }
    return false; 
}
function insertInventory(array) {
    let object = player.cf.grid
    if(!hasEmptyElement()) return
    for (let key in object) {
        if (object[key] == '') {
          console.log(key)
          object[key] = array;
          break;
        }
      }
}
function TreeDamage() {
    switch(parseInt(getToolID())) {
        case 11:
        return d(4)
        case 14:
        return d(6)
        case 17:
        return d(4) 
        default:
        return d(1)
    }
}
function StoneDamage() {
    switch (parseInt(getToolID())) {
        case 12:
        return d(3)
        case 15:
        return d(5)
        case 16:
        return d(2)
        default:
        return d(1)
    }
}
function energyCompartmentModify(gridID,typeID) {
    let object = player.cv.grid
    gridID = parseInt(gridID)
    if(isNaN(gridID)) return
    if(gridID > 707) return
    if(gridID < 101) return
    if(!Array.isArray(object[gridID])) {
        object[gridID] = []
    }
    object[gridID][0] = gridID
    object[gridID][1] = new Decimal(typeID)
    if(d(typeID).eq(1)) object[gridID][3] = d(2)
    if(d(typeID).eq(2)) object[gridID][3] = d(Math.floor(Math.random() * 11) + 2)

}
function getEnergyGridCompartment(gridID) {
    let object = player.cv.grid
    gridID = parseInt(gridID)
    if(gridID === 101 || gridID === 107 || gridID === 701 || gridID === 707) return d(10)
    return d(getGridID2(object[gridID]))
}
//Transfer energy from space to spaces ; It's terrible
function transferEnergy() {
    let object = player.cv.grid
    for (let key in object) {
        let type = getEnergyGridCompartment(key)
        
        if(object[key].length <= 1) continue
        if(object[key][3] === undefined) {
            if(type.eq(1)) {
                object[key][3] = d(2)
            } else if (type.eq(2)) {
                object[key][3] = d(Math.floor(Math.random() * 11) + 2)
            } else { 
                object[key][3] = d(Number.POSITIVE_INFINITY)
            }
        }

        let energy = new Decimal(object[key][2])
        object[key][3] = d(object[key][3]).sub(1)
        if(type.eq(0)) {
            object[key][2] = d(0)
            object[key][3] = d(Math.floor(Math.random() * 11) + 2)
        }
        if(d(object[key][3]).gt(0)) continue
        if(d(energy).eq(0)) continue
        let x = Math.floor(key / 100)
        let y = key % 100
        let adjCell = 0
        for (let dx = -1 ; dx <= 1 ; dx++) {
            for (let dy = -1 ; dy <= 1 ; dy++) {
                if((dx !== 0 || dy !== 0) && !(dx === 0 && dy === 0)) {
                    let adjX = dx + x
                    let adjY = dy + y
                    let NewKey = adjX * 100 + adjY
                    if(getEnergyGridCompartment(NewKey).gte(2)) {
                        adjCell++
                    }
                }
            }
        }

        if(adjCell > 0) {
            if(type.eq(0)) { 
                object[key][2] = d(0)
            } else if (type.eq(1)) { 
                for (let dx = -1 ; dx <= 1 ; dx++) {
                    for (let dy = -1 ; dy <= 1 ; dy++) {
                        if((dx !== 0 || dy !== 0) && !(dx === 0 && dy === 0)) {
                            let adjX = dx + x
                            let adjY = dy + y
                            let NewKey = adjX * 100 + adjY
                            if(getEnergyGridCompartment(NewKey).gte(2)) object[NewKey][2] = d(object[NewKey][2]).add(d(d(energy).div(d(adjCell).max(1))))
                        }
                    }
                }
                object[key][2] = d(0)
                object[key][3] = d(2)
            } else if (type.eq(2)) {
                for (let dx = -1 ; dx <= 1 ; dx++) {
                    for (let dy = -1 ; dy <= 1 ; dy++) {
                        if((dx !== 0 || dy !== 0) && !(dx === 0 && dy === 0)) {
                            let adjX = dx + x
                            let adjY = dy + y
                            let NewKey = adjX * 100 + adjY
                            if(getEnergyGridCompartment(NewKey).gte(2)) object[NewKey][2] = d(object[NewKey][2]).add(d(d(energy).max(0).div(d(adjCell).max(1))))
                        }
                    }
                }
                object[key][2] = d(0)
                object[key][3] = d(Math.floor(Math.random() * 11) + 2)
            } else if (type.eq(3)) {
                object[key][2] = d(0)
            }
        }
    }
}
addLayer("cf", {
    startData() { return {
        unlocked: true, 
        stamina: [d(0),d(100),d(1)],
        woodHP: d(10),
        stoneHP: d(8),
        wood: d(0),
        rock: d(0),
        stick: d(0),
        string: d(0),
        cobblestone: d(0),
        craftsHovering: d(0),
        backpackMode: d(0),
        backpackSelected: [],
        bridgeRepair: [d(0),d(0),d(0)], //Wood , String , Cobblestone
        equipped: 401,
    }},
    color: "#217e28",                      
    row: 6,
    displayRow: 1,
    branches:['c'],
    tooltip() {return "-- The Blighted forest -- <br> Stage 1"},
    ttStyle() {
        return {
            "color":"#9ade59",
            "width":"260px",
            "border":"2px solid",
            "border-color":"#c81e7a",
        }
    },
    type: "none",
    automate() {

    },
    update(delta) {
        delta = delta * toNumber(player.o.gamespeed)
        if(player[this.layer].stamina[0].lt(100)) {
            player[this.layer].stamina[0] = player[this.layer].stamina[0].add(player[this.layer].stamina[2].times(delta)).min(player[this.layer].stamina[1])
        }
        if(player[this.layer].woodHP.lte(0)) {
            if(getToolID() === 11) player.cf.stick = player.cf.stick.add(1)
            player.cf.wood = player.cf.wood.add(1)
            player.cf.woodHP = d(Math.random() * 5 + 10)
        }
        if(player[this.layer].stoneHP.lte(0)) {
            player.cf.cobblestone = player.cf.cobblestone.add(1)
            player.cf.stoneHP = d(Math.random() * 4 + 8)
            if(getToolID() === 15 && Math.random() <= 0.4) player.cf.rock = player.cf.rock.add(1) 
        }
        if(Array.isArray(player[this.layer].grid[player.cf.equipped])) {
            if(d(player[this.layer].grid[player.cf.equipped][1]).lte(0)) {
                player[this.layer].grid[player.cf.equipped] = []
            }
        }
    },  
    hotkeys: [
        {key: "c", description: "C : Switch to crafting menu (The Blighted Forest)", onPress(){
            showTab('cf')
            player.subtabs.cf.main = "Crafting"
        } , unlocked() {return inChallenge('c',11)}},
        {key: "i", description: "I : Open inventory", onPress(){
             showTab('cf')
             player.subtabs.cf.main = "Storage"
             player.subtabs.cf.store = "Inventory"
        } , unlocked() {return inChallenge('c',11)}},
        {key: "r", description: "R : Check resource", onPress(){
            showTab('cf')
            player.subtabs.cf.main = "Storage"
            player.subtabs.cf.store = "Resource"
       } , unlocked() {return inChallenge('c',11)}},
       {key: "g", description: "G : Switch to gather menu (The Blighted Forest)", onPress(){
            showTab('cf')
            player.subtabs.cf.main = "Gathering"
    } , unlocked() {return inChallenge('c',11)}},
        {key: "1", description: "1 : Select inventory slot 1", onPress(){
            if (player.subtabs.cf.main === "Storage" && player.subtabs.cf.store === "Inventory" && player.cf.backpackSelected.length > 0) {
                player.cf.backpackSelected = player.cf.backpackSelected.concat(401)
                return
            } else {
                player.cf.equipped = 401
            }

            },
        unlocked() {return inChallenge('c',11)}},
        {key: "2", description: "2 : Select inventory slot 2", onPress(){
            if (player.subtabs.cf.main === "Storage" && player.subtabs.cf.store === "Inventory" && player.cf.backpackSelected.length > 0) {
                player.cf.backpackSelected = player.cf.backpackSelected.concat(402)
                return
            } else {
                player.cf.equipped = 402
            }
    
            },
            unlocked() {return inChallenge('c',11)}},
        {key: "3", description: "3 : Select inventory slot 3", onPress(){
            if (player.subtabs.cf.main === "Storage" && player.subtabs.cf.store === "Inventory" && player.cf.backpackSelected.length > 0) {
                player.cf.backpackSelected = player.cf.backpackSelected.concat(403)
                return
            } else {
                player.cf.equipped = 403
            }

        },
        unlocked() {return inChallenge('c',11)}},
        {key: "4", description: "4 : Select inventory slot 4", onPress(){
            if (player.subtabs.cf.main === "Storage" && player.subtabs.cf.store === "Inventory" && player.cf.backpackSelected.length > 0) {
                player.cf.backpackSelected = player.cf.backpackSelected.concat(404)
                return
            } else {
                player.cf.equipped = 404
            }

        },
        unlocked() {return inChallenge('c',11)}},
        {key: "5", description: "5 : Select inventory slot 5", onPress(){
            if (player.subtabs.cf.main === "Storage" && player.subtabs.cf.store === "Inventory" && player.cf.backpackSelected.length > 0) {
                player.cf.backpackSelected = player.cf.backpackSelected.concat(405)
                return
            } else {
                player.cf.equipped = 405
            }

        },
        unlocked() {return inChallenge('c',11)}},
        {key: "n", description: "N : Modify Energy network (The Haunted Village)", onPress(){
            showTab('cv')
            player.subtabs.cv.main = "Robots"
        } , unlocked() {return inChallenge('c',11) && player.c.stage.gte(2)}},
        {key: "t", description: "T : Trades (The Haunted Village)", onPress(){
            showTab('cv')
            player.subtabs.cv.main = "Trades"
        } , unlocked() {return inChallenge('c',11) && player.c.stage.gte(2)}},
        ],
    milestones: {
        
    },
    buyables: {
        11: {
            title() {
                return "Wooden Axe"
               },
            desc() {
                let base = this.des()
                let cost = "Cost : 2 Wood chunk and 2 Stick <br> 10 Tool durability"
                return base + "<br>" + cost
            },
            des() {
                let base = "A very stuffed wooden axe but it can make chopping tree faster"
                let equipped = "When equipped : +3 [Tree] damage"
                let ability = "Passive : Chopping [Tree] also drop a stick"
                return base + "<br>" + equipped + "<br>" + ability 
            },
            canAfford() { return true },
            canCraft() {return player.cf.wood.gte(2) && player.cf.stick.gte(2)},
            buy() {
               if(player.cf.craftsHovering.neq(d(this.id))) {
                 player.cf.craftsHovering = d(this.id)
               } else {
               if(!this.canCraft()) return
               if(this.canCraft()) {
                    player.cf.wood = player.cf.wood.sub(2)
                    player.cf.stick = player.cf.stick.sub(2)
                    insertInventory([11,d(10)])
               }
               }

            
            },
            style() {
              if(this.canCraft() && player.cf.craftsHovering.eq(this.id)) return Qcolor('lime')
              if(this.canCraft()) return Qcolor('rgb(128,128,0)')
              if(player.cf.craftsHovering.eq(this.id)) return Qcolor('red')
              else return Qcolor('black')

        },
        },
        12: {
            title() {
                return "Wooden Pickaxe"
               },
            desc() {
                let base = this.des()
                let cost = "Cost : 3 Wood chunk , 3 Stick and 1 String <br> 11 Tool durability"
                return base + "<br>" + cost
            },
            des() {
                let base = "A very weak wooden pickaxe , can only break stone"
                let equipped = "When equipped : +3 [Stone] damage"
                return base + "<br>" + equipped 
            },
            canAfford() { return true },
            canCraft() {return player.cf.wood.gte(3) && player.cf.stick.gte(3) && player.cf.string.gte(1)},
            buy() {
               if(player.cf.craftsHovering.neq(d(this.id))) {
                 player.cf.craftsHovering = d(this.id)
               } else {
               if(!this.canCraft()) return
               if(this.canCraft()) {
                    player.cf.wood = player.cf.wood.sub(3)
                    player.cf.stick = player.cf.stick.sub(3)
                    player.cf.string = player.cf.string.sub(1)
                    insertInventory([this.id,d(11)])
               }
               }

            
            },
            style() {
              if(this.canCraft() && player.cf.craftsHovering.eq(this.id)) return Qcolor('lime')
              if(this.canCraft()) return Qcolor('rgb(128,128,0)')
              if(player.cf.craftsHovering.eq(this.id)) return Qcolor('red')
              else return Qcolor('black')

        },
        }, 
        13: {
            title() {
                return "Cobblestone"
               },
            desc() {
                let base = this.des()
                let cost = "Need : 1 Rock , 1 Wood chunk , lose 1 Tool durability <br> Require any equipped tool"
                return base + "<br>" + cost
            },
            des() {
                let base = "Mix a weird mixture of rock and wood , smash it and magically become cobblestone"
                let equipped = ""
                let ability = ""
                return base + "<br>" + equipped + "<br>" + ability 
            },
            canAfford() { return true },
            canCraft() {return player.cf.rock.gte(1) && player.cf.wood.gte(1) && isEquippingTool()},
            buy() {
               if(player.cf.craftsHovering.neq(d(this.id))) {
                 player.cf.craftsHovering = d(this.id)
               } else {
               if(!this.canCraft()) return
               if(this.canCraft()) {
                    player.cf.wood = player.cf.wood.sub(1)
                    player.cf.rock = player.cf.rock.sub(1)
                    player.cf.cobblestone = player.cf.cobblestone.add(1)
                    modifyDurability(-1)
               }
               }

            
            },
            style() {
              if(this.canCraft() && player.cf.craftsHovering.eq(this.id)) return Qcolor('lime')
              if(this.canCraft()) return Qcolor('rgb(128,128,0)')
              if(player.cf.craftsHovering.eq(this.id)) return Qcolor('red')
              else return Qcolor('black')

        },
        },
        14: {
            title() {
                return "Stone Axe"
               },
            desc() {
                let base = this.des()
                let cost = "Cost : 2 Cobblestone , 3 Stick and 1 String <br> 23 Tool durability"
                return base + "<br>" + cost
            },
            des() {
                let base = "A stuffed Stone axe but can be used to extract String from additional location"
                let equipped = "When equipped : +5 [Tree] damage"
                let ability = "Passive : [Ground seeking] use 1 tool durability and 3 extra stamina to find [String] twice as often"
                return base + "<br>" + equipped + "<br>" + ability 
            },
            canAfford() { return true },
            canCraft() {return player.cf.stick.gte(3) && player.cf.string.gte(1) && player.cf.cobblestone.gte(2)},
            buy() {
               if(player.cf.craftsHovering.neq(d(this.id))) {
                 player.cf.craftsHovering = d(this.id)
               } else {
               if(!this.canCraft()) return
               if(this.canCraft()) {
                    player.cf.stick = player.cf.stick.sub(3)
                    player.cf.string = player.cf.string.sub(1)
                    player.cf.cobblestone = player.cf.cobblestone.sub(2)
                    insertInventory([this.id,d(23)])
               }
               }

            
            },
            style() {
              if(this.canCraft() && player.cf.craftsHovering.eq(this.id)) return Qcolor('lime')
              if(this.canCraft()) return Qcolor('rgb(128,128,0)')
              if(player.cf.craftsHovering.eq(this.id)) return Qcolor('red')
              else return Qcolor('black')

        },
        },
        15: {
            title() {
                return "Stone Pickaxe"
               },
            desc() {
                let base = this.des()
                let cost = "Cost : 4 Cobblestone , 3 Stick and 1 String <br> 29 Tool durability"
                return base + "<br>" + cost
            },
            des() {
                let base = "A stuffed Stone pickaxe which is stronger , yet break stone much better"
                let equipped = "When equipped : +5 [Stone] damage"
                let ability = "Passive : Mining [Stone] have a 40% chance to reveal an additional rock"
                return base + "<br>" + equipped + "<br>" + ability 
            },
            canAfford() { return true },
            canCraft() {return player.cf.stick.gte(3) && player.cf.string.gte(1) && player.cf.cobblestone.gte(4)},
            buy() {
               if(player.cf.craftsHovering.neq(d(this.id))) {
                 player.cf.craftsHovering = d(this.id)
               } else {
               if(!this.canCraft()) return
               if(this.canCraft()) {
                    player.cf.stick = player.cf.stick.sub(3)
                    player.cf.string = player.cf.string.sub(1)
                    player.cf.cobblestone = player.cf.cobblestone.sub(4)
                    insertInventory([this.id,d(29)])
               }
               }

            
            },
            style() {
              if(this.canCraft() && player.cf.craftsHovering.eq(this.id)) return Qcolor('lime')
              if(this.canCraft()) return Qcolor('rgb(128,128,0)')
              if(player.cf.craftsHovering.eq(this.id)) return Qcolor('red')
              else return Qcolor('black')

        },
        },
        16: {
            title() {
                return "Stone Knife"
               },
            desc() {
                let base = this.des()
                let cost = "Cost : 3 Wood chunk and 3 Cobblestone <br> 16 Tool durability"
                return base + "<br>" + cost
            },
            des() {
                let base = "A sturdy knife for cutting through tree leafs and uncovering spare String"
                let equipped = "When equipped : +1 [Tree] damage"
                let ability = "Passive : Cutting [Tree] have a 25% chance to contain string"
                return base + "<br>" + equipped + "<br>" + ability 
            },
            canAfford() { return true },
            canCraft() {return player.cf.rock.gte(2) && player.cf.cobblestone.gte(3)},
            buy() {
               if(player.cf.craftsHovering.neq(d(this.id))) {
                 player.cf.craftsHovering = d(this.id)
               } else {
               if(!this.canCraft()) return
               if(this.canCraft()) {
                    player.cf.wood = player.cf.wood.sub(3)
                    player.cf.cobblestone = player.cf.cobblestone.sub(3)
                    insertInventory([this.id,d(16)])
               }
               }

            
            },
            style() {
              if(this.canCraft() && player.cf.craftsHovering.eq(this.id)) return Qcolor('lime')
              if(this.canCraft()) return Qcolor('rgb(128,128,0)')
              if(player.cf.craftsHovering.eq(this.id)) return Qcolor('red')
              else return Qcolor('black')

        },
        },
        17: {
            title() {
                return "Stone Hammer"
               },
            desc() {
                let base = this.des()
                let cost = "Cost : 7 Stick and 4 Cobblestone <br> 36 Tool durability"
                return base + "<br>" + cost
            },
            des() {
                let base = "A basic hammer , infused with stone to help repair stuff much more simpler"
                let equipped = "When equipped : +3 [Tree] damage"
                let ability = "Passive : Repairing require 30% less Stamina and Tool durability (rounded)"
                return base + "<br>" + equipped + "<br>" + ability 
            },
            canAfford() { return true },
            canCraft() {return player.cf.stick.gte(7) && player.cf.cobblestone.gte(4)},
            buy() {
               if(player.cf.craftsHovering.neq(d(this.id))) {
                 player.cf.craftsHovering = d(this.id)
               } else {
               if(!this.canCraft()) return
               if(this.canCraft()) {
                    player.cf.stick = player.cf.stick.sub(7)
                    player.cf.cobblestone = player.cf.cobblestone.sub(4)
                    insertInventory([this.id,d(36)])
               }
               }

            
            },
            style() {
              if(this.canCraft() && player.cf.craftsHovering.eq(this.id)) return Qcolor('lime')
              if(this.canCraft()) return Qcolor('rgb(128,128,0)')
              if(player.cf.craftsHovering.eq(this.id)) return Qcolor('red')
              else return Qcolor('black')

        },
        },                                       
    },
    grid: {
        rows: 4,
        cols: 5,
        getStartData(id) {
            return ""
        },
        getTooltip(id) {
            id2 = getGridID(id)
            if(!tmp.cf.buyables.hasOwnProperty(id2)) return ""
            if(id2 === "") return ""
            return tmp.cf.buyables[id2].des + "<br>" + format(getGridID2(id),0) + " Durability left"
        },
        getTitle(id) {
            id2 = getGridID(id)
            if(!tmp.cf.buyables.hasOwnProperty(id2)) return
            if(id2 === "") return
            return tmp.cf.buyables[id2].title + "<br>" + format(getGridID2(id),0)
        },
        getUnlocked(id) {
            return true
        },
        getStyle(data , id) {
            id2 = getGridID(id)
            if(player.cf.equipped === parseInt(id2) && player.cf.backpackSelected.includes(id2)) return {
                'border-radius': '0%',
                'color':'white',
                'background-color': '#ff5733',
                'border':'4px solid',
                'border-color':'orange',
                'height': '100px',
                'width': '100px',
            } 
            if(player.cf.equipped === parseInt(id2)) return {
                'border-radius': '0%',
                'color':'white',
                'background-color': 'black',
                'border':'4px solid',
                'border-color':'orange',
                'height': '100px',
                'width': '100px',
            } 
            if(player.cf.backpackSelected.includes(id2)) return {
                'border-radius': '0%',
                'color':'white',
                'background-color': 'green',
                'border':'4px solid',
                'border-color':'lime',
                'height': '100px',
                'width': '100px',
            } 
            if(!player.cf.backpackSelected.includes(id2)) return {
                'border-radius': '0%',
                'color':'white',
                'background-color': 'black',
                'border':'4px solid',
                'border-color':'lime',
                'height': '100px',
                'width': '100px',
            }

        },
        getCanClick(data, id) {
            let a = !(player.cf.backpackSelected.length > 1 && player.cf.backpackMode.eq(2))
            return a
        },
        onClick(data, id) { 
            id = getGridID(id)
            if(!player.cf.backpackSelected.includes(id)) {
                player.cf.backpackSelected = player.cf.backpackSelected.concat(id)
            } else {
                player.cf.backpackSelected = player.cf.backpackSelected.filter(x => x !== id)
            }
        },
        getDisplay(data, id) {
            return data 
        },
    
    },
    upgrades: {
       
    },
    clickables: {
        1: {
            title() { return "Destroy" },
            tooltip() {return "Select item , then destroy it permeantly"},
            canClick() {return true},
            unlocked() { return true},
            ttStyle() {
                return {
                    "color":"red",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"red",
                }
            },
            onClick() {
               if(player.cf.backpackMode.neq(1)) {
                player.cf.backpackMode = d(1)
                return
               }
               if(player.cf.backpackMode.eq(1)) {
                for (let i = 0 ; i < player.cf.backpackSelected.length ; i++ ) {
                    const element = player.cf.backpackSelected[i]
                    if(player.cf.grid.hasOwnProperty(element)) {
                        player.cf.grid[element] = "" 
                    }
                }
                player.cf.backpackSelected = []
                player.cf.backpackMode = d(0)
                return
               }
            },
            style() {   
                if(player.cf.backpackMode.eq(1)) return {
                    'border-radius': '0%',
                    'color':'white',
                    'background-color': 'red',
                    'border':'2px solid',
                    'border-color':'red',
                    'height': '50px'
                } 
                if(player.cf.backpackMode.neq(1)) return {
                    'border-radius': '0%',
                    'color':'white',
                    'background-color': 'black',
                    'border':'2px solid',
                    'border-color':'red',
                    'height': '50px'
                }
        },
     },
        2: {
            title() { return "Swap" },
            tooltip() {return "Select item , then swap it <br> Need 2 selected slot"},
            canClick() {return true},
            unlocked() { return true},
            ttStyle() {
                return {
                    "color":"aqua",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"aqua",
                }
            },
            onClick() {
            if(player.cf.backpackMode.neq(2)) {
                player.cf.backpackMode = d(2)
                if(player.cf.backpackSelected.length > 2) player.cf.backpackSelected = []
                return
            }
            if(player.cf.backpackMode.eq(2) && player.cf.backpackSelected.length === 2) {
                const tempo = player.cf.grid[player.cf.backpackSelected[0]]
                player.cf.grid[player.cf.backpackSelected[0]] = player.cf.grid[player.cf.backpackSelected[1]]
                player.cf.grid[player.cf.backpackSelected[1]] = tempo
                player.cf.backpackSelected = []
                return
            } else {
                player.cf.backpackSelected = []
            }
            },
            style() {   
                if(player.cf.backpackMode.eq(2)) return {
                    'border-radius': '0%',
                    'color':'white',
                    'background-color': 'aqua',
                    'border':'2px solid',
                    'border-color':'aqua',
                    'height': '50px'
                } 
                if(player.cf.backpackMode.neq(2)) return {
                    'border-radius': '0%',
                    'color':'white',
                    'background-color': 'black',
                    'border':'2px solid',
                    'border-color':'aqua',
                    'height': '50px'
                }
        },
    },
        3: {
        title() { return "Cancel action" },
        tooltip() {return "If you selected an action , it will be toggled off <br> Otherwise deselect all clicked inventory slot"},
        canClick() {return true},
        unlocked() { return true},
        ttStyle() {
        return {
            "color":"orange",
            "width":"250px",
            "border":"4px solid",
            "border-color":"orange",
        }
        },
        onClick() {
        if(player.cf.backpackMode.neq(0)) {
            player.cf.backpackMode = d(0)
            return
        } 
        if(player.cf.backpackSelected.length > 0) {
            player.cf.backpackSelected = []
            return
        }
        },
        style() {   
             return {
            'border-radius': '0%',
            'color':'white',
            'background-color': 'black',
            'border':'2px solid',
            'border-color':'orange',
            'height': '50px'
        } 
        },
        },
        11: {
            title() { return "BREAK TREE" },
            tooltip() {return "Break tree with your bare hand <br> Tree : "+format(player.cf.woodHP,2)+" HP <br> When break : -10 Stamina (-5 if using tools) , deal "+format(TreeDamage(),0)+" damage"},
            canClick() {return player.cf.stamina[0].gte(10)},
            unlocked() { return hasAchievement('ac',169)},
            ttStyle() {
                return {
                    "color":"brown",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"brown",
                }
            },
            onClick() {
               let damage = TreeDamage()
               if(player.cf.stamina[0].lt(50)) damage = damage.times(player.cf.stamina[0].div(player.cf.stamina[1]))
               modifyDurability(-1)
               player.cf.woodHP = player.cf.woodHP.sub(damage).max(0)
               player.cf.stamina[0] = player.cf.stamina[0].sub(10)
               if(isEquippingTool()) player.cf.stamina[0] = player.cf.stamina[0].add(5)
               if(getToolID() === 16 && player.cf.woodHP.lte(4) && Math.random() <= 0.35) player.cf.string = player.cf.string.add(1)
               player.g.timer2 = d(0)
            },
            onHold() {
               if(player.g.timer2.gt(0.25)) this.onClick()
            },
            style() {   
                if(this.canClick()) return {
                    'border-radius': '35%',
                    'color':'white',
                    'background-color': 'brown',
                    'border':'2px solid',
                    'border-color':'brown',
                    'height': '225px'
                } 
                if(!this.canClick()) return {
                    'border-radius': '35%',
                    'color':'white',
                    'background-color': 'gray',
                    'border':'2px solid',
                    'border-color':'gray',
                    'height': '225px'
                }
        },
     },
        12: {
            title() { return "GROUND SEEK" },
            tooltip() {
                let StringOdd = d(10)
                if(getToolID() === 14) StringOdd = d(20)
                let EnergyCost = d(5)
                if(getToolID() === 14) EnergyCost = d(8)
                return "Move forward and check the ground for something <br> -"+format(EnergyCost,0)+" Energy per action <br> - Possibilities -  <br> 10% chance - Find a rock <br> 10% chance - Find a stick <br> "+format(StringOdd,0)+"% chance - Find a string"
            },
            canClick() {
                return player.cf.stamina[0].gte(50)
            },
            unlocked() { return hasAchievement('ac',169)},
            ttStyle() {
                return {
                    "color":"lime",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"lime",
                }
            },
            onClick() {
                let a = Math.random() * 100
                let b = Math.random() * 100
                let c = Math.random() * 100
                let f = 10
                if(getToolID() === 14) f = f * 2
                if(getToolID() === 14) modifyDurability(-1)
                if(getToolID() === 14) player.cf.stamina[0] = player.cf.stamina[0].sub(3)
                player.cf.stamina[0] = player.cf.stamina[0].sub(5)
                if(a <= 10) player.cf.rock = player.cf.rock.add(1)
                if(b <= 10) player.cf.stick = player.cf.stick.add(1)
                if(c <= f) player.cf.string = player.cf.string.add(1)
                player.g.timer2 = d(0)
            },
            onHold() {
                if(player.g.timer2.gt(0.25)) this.onClick()            
            },
            style() {   
                return {
                    'border-radius': '0%',
                    'color':'white',
                    'background-color': 'purple',
                    'border':'2px solid',
                    'border-color':'purple',
                    'height': '100px'
                } 
        },
        },
        13: {
            title() { return "MINE STONE" },
            tooltip() {return "Break stone with your Pickaxe <br> Stone : "+format(player.cf.stoneHP,2)+" HP <br> When break : -4 Stamina and inflicts "+format(StoneDamage(),0)+" damage"},
            canClick() {return player.cf.stamina[0].gte(4) && isEquippingTool()},
            unlocked() { return hasAchievement('ac',169)},
            ttStyle() {
                return {
                    "color":"brown",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"brown",
                }
            },
            onClick() {
               let damage = StoneDamage()
               if(player.cf.stamina[0].lt(50)) damage = damage.times(player.cf.stamina[0].div(player.cf.stamina[1]))
               modifyDurability(-1)
               player.cf.stoneHP = player.cf.stoneHP.sub(damage).max(0)
               player.cf.stamina[0] = player.cf.stamina[0].sub(4)
               player.g.timer2 = d(0)
            },
            onHold() {
               if(player.g.timer2.gte(0.25)) this.onClick()
            },
            style() {   
                if(this.canClick()) return {
                    'border-radius': '0%',
                    'color':'yellow',
                    'background-color': 'gray',
                    'border':'2px solid',
                    'border-color':'brown',
                    'height': '150px'
                } 
                if(!this.canClick()) return {
                    'border-radius': '0%',
                    'color':'yellow',
                    'background-color': 'gray',
                    'border':'2px solid',
                    'border-color':'gray',
                    'height': '150px'
                }
        },
     },
        14: {
            title() { return "Wood repair" },
            tooltip() {
                let cost = d(4)
                if(getToolID() === 17) cost = cost.times(0.7)
                return "Repair the bridge using Wood <br> -4 Wood chunk , -"+format(cost,0)+" Tool durability and -"+format(cost.times(3),1)+" Stamina"
            },
            canClick() {
                return player.cf.stamina[0].gte(50) && isEquippingTool() && player.cf.wood.gte(4)
            },
            unlocked() {
                return player.cf.bridgeRepair[0].lt(48)
            },
            ttStyle() {
                return {
                    "color":"brown",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"brown",
                }
            },
            onClick() {
                player.cf.wood = player.cf.wood.sub(4)
                if(isEquippingTool()) modifyDurability(-4)
                player.cf.stamina[0] = player.cf.stamina[0].sub(12)
                player.cf.bridgeRepair[0] = player.cf.bridgeRepair[0].add(4)
                if(getToolID() === 17) modifyDurability(1)
                if(getToolID() === 17) player.cf.stamina[0] = player.cf.stamina[0].add(3.6)
                player.g.timer2 = d(0)
            },
            onHold() {
                if(player.g.timer2.gt(0.25)) this.onClick()            
            },
            style() {   
                return {
                    'border-radius': '0%',
                    'color':'white',
                    'background-color': 'black',
                    'border':'2px solid',
                    'border-color':'brown',
                    'height': '125px'
                } 
        },
        },
        15: {
            title() { return "String repair" },
            tooltip() {
                let cost = d(1)
                if(getToolID() === 17) cost = cost.times(0.7)
                return "Repair the bridge using String <br> -1 String , -"+format(cost,0)+" Tool durability and -"+format(cost.times(3),1)+" Stamina"
            },
            canClick() {
                return player.cf.stamina[0].gte(50) && isEquippingTool() && player.cf.string.gte(1)
            },
            unlocked() {
                return player.cf.bridgeRepair[1].lt(12)
            },
            ttStyle() {
                return {
                    "color":"white",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"white",
                }
            },
            onClick() {
                player.cf.string = player.cf.string.sub(1)
                player.cf.stamina[0] = player.cf.stamina[0].sub(3)
                modifyDurability(-1)                
                if(getToolID() === 17) player.cf.stamina[0] = player.cf.stamina[0].add(0.9)
                player.cf.bridgeRepair[1] = player.cf.bridgeRepair[1].add(1)
                player.g.timer2 = d(0)
            },
            onHold() {
                if(player.g.timer2.gt(0.25)) this.onClick()            
            },
            style() {   
                return {
                    'border-radius': '0%',
                    'color':'white',
                    'background-color': 'black',
                    'border':'2px solid',
                    'border-color':'white',
                    'height': '125px'
                } 
        },
        },
        16: {
            title() { return "Stone repair" },
            tooltip() {
                let cost = d(2)
                if(getToolID() === 17) cost = cost.times(0.7)
                return "Repair the bridge using Cobblestone <br> -2 Cobblestone , -"+format(cost,0)+" Tool durability and -"+format(cost.times(3),1)+" Stamina"
            },
            canClick() {
                return player.cf.stamina[0].gte(50) && isEquippingTool() && player.cf.cobblestone.gte(2)
            },
            unlocked() {
                return player.cf.bridgeRepair[2].lt(20)
            },
            ttStyle() {
                return {
                    "color":"gray",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"gray",
                }
            },
            onClick() {
                player.cf.cobblestone = player.cf.cobblestone.sub(1)
                modifyDurability(-2)
                player.cf.stamina[0] = player.cf.stamina[0].sub(6)
                player.cf.bridgeRepair[2] = player.cf.bridgeRepair[2].add(2)
                if(getToolID() === 17) modifyDurability(1)
                if(getToolID() === 17) player.cf.stamina[0] = player.cf.stamina[0].add(1.8)
                player.g.timer2 = d(0)
            },
            onHold() {
                if(player.g.timer2.gt(0.25)) this.onClick()            
            },
            style() {   
                return {
                    'border-radius': '0%',
                    'color':'white',
                    'background-color': 'black',
                    'border':'2px solid',
                    'border-color':'gray',
                    'height': '125px'
                } 
        },
        },
        17: {
            title() { return "Cross the bridge" },
            tooltip() {
                return ""
            },
            unlocked() {
                return player.cf.bridgeRepair[0].gte(48) && player.cf.bridgeRepair[1].gte(12) && player.cf.bridgeRepair[2].gte(20) && player.c.stage.eq(1)
            },
            canClick() {
                return true
            },
            ttStyle() {
                return {
                    "color":"gray",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"gray",
                }
            },
            onClick() {
                player.c.stage = d(2)
            },
            style() {   
                return {
                    "background-image": "linear-gradient(90deg, purple, brown, white)",
                    "width": '150px',
                    "color": 'yellow',
                    "height": '150px',
                    'min-height': '150px',
                    'min-width': '150px',
                } 
        },
        },
    },
    challenges: {
        
    },
    microtabs: {
        main: {
            "Storage": {
            buttonStyle() { return { 'color': 'purple' } },
            unlocked() { return true},
            content:  [
                ["microtabs", "store", { 'border-width': '0px' }],
            ]
            },
            "Crafting": {
            buttonStyle() { return { 'color': 'purple' } },
            unlocked() { return true},
            content:  [
                ["microtabs", "craft", { 'border-width': '0px' }],
            ]
            },
            "Gathering": {
            buttonStyle() { return { 'color': 'purple' } },
            unlocked() { return true},
            content:  [
                ["microtabs", "gather", { 'border-width': '0px' }],
            ]
            },
            "Repair": {
            buttonStyle() { return { 'color': 'purple' } },
            unlocked() { return true},
            content:  [
                ["microtabs", "repair", { 'border-width': '0px' }],
            ]
            },
        },
        craft : {
            "Tool": {
                buttonStyle() { return { 'color': 'brown'} },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return hasEmptyElement()?"":"<h3> WARNING : YOU DON'T HAVE ANY EMPTY INVENTORY SLOT , ANY CRAFTED ITEM WILL BE DESTROYED" }, { "color": "red", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3> Click an item/tool twice to craft it" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.cf.craftsHovering.eq(0)?"":"<h3> "+tmp.cf.buyables[toNumber(player.cf.craftsHovering)].desc }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank" , "50px"],
                    ["row",[["buyable",11],["buyable",12],["buyable",14],["buyable",15],["buyable",16],["buyable",17]]],
                ]      
            },
            "Material": {
                buttonStyle() { return { 'color': 'brown'} },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return "<h3> Click an item/tool twice to craft it" }, { "color": "lime", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.cf.craftsHovering.eq(0)?"":"<h3> "+tmp.cf.buyables[toNumber(player.cf.craftsHovering)].desc }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank" , "50px"],
                    ["row",[["buyable",13]]],
                ]      
            },

        },
        gather : {
            "Material": {
                buttonStyle() { return { 'color': 'brown'} },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return "<h3> Harvest resource scattered around the forest" }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank" , "200px"],
                    ["row",[["clickable",11],["clickable",13]]],
                ]      
            },
            "Ground seeking": {
                buttonStyle() { return { 'color': 'brown'} },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return "<h3> Try examining the ground , you may find something useful" }, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3> You have "+format(player.cf.stick,0)+" Stick ; "+format(player.cf.string,0)+" String ; "+format(player.cf.rock,0)+" Rock" }, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank" , "200px"],
                    ["row",[["clickable",12]]],
                ]      
            },
        },
        store : {
            "Resource": {
                buttonStyle() { return { 'color': 'brown'} },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return "<h3> You have" }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.cf.wood.eq(0)?"":"<h3> "+format(player.cf.wood,0)+" Wood chunk" }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.cf.rock.eq(0)?"":"<h3> "+format(player.cf.rock,0)+" Rock" }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.cf.stick.eq(0)?"":"<h3> "+format(player.cf.stick,0)+" Stick" }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.cf.string.eq(0)?"":"<h3> "+format(player.cf.string,0)+" String" }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.cf.cobblestone.eq(0)?"":"<h3> "+format(player.cf.cobblestone,0)+" Cobblestone" }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],

                ]      
            },
            "Inventory": {
                buttonStyle() { return { 'color': 'orange'} },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return "<h3> Inventory" }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank" , "25px"],
                    ["row" , [["clickable",1],["clickable",2],["clickable",3]]],
                    ["blank" , "25px"],
                    ["row", [["grid" , 101]]],
                ]      
            },
        },
        repair : {
            "The bridge": {
                buttonStyle() { return { 'color': 'purple'} },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return player.c.stage.gt(1)?"<h3> The bridge has been repaired":"<h3> You come across an old bridge that cannot be used anymore" }, { "color": "purple", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.c.stage.gt(1)?"<h3> You have reached stage 2 of the Cursed realm":"<h3> The path ahead seems to lead to a cursed village" }, { "color": "purple", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.c.stage.gt(1)?"":"<h3> You will need 48 Wood chunk , 12 String and 20 Cobblestone to fix that" }, { "color": "purple", "font-size": "18px", "font-family": "helvetica" }],
                    ["raw-html", function () { return player.c.stage.gt(1)?"":"<h3> You have contributed : "+format(player.cf.bridgeRepair[0],0)+" Wood chunk , "+format(player.cf.bridgeRepair[1],0)+" String and "+format(player.cf.bridgeRepair[2],0)+" Cobblestone to bridge reparations" }, { "color": "white", "font-size": "18px", "font-family": "helvetica" }],
                    ["blank","25px"],
                    ["row" ,[["clickable",14],["clickable",15],["clickable",16],["clickable",17]]],
                ]      
            },
        },
    },
        
       
        tabFormat: [
            ["raw-html", function () { return "<h3> Stamina : "+format(player[this.layer].stamina[0],1)+" / "+format(player[this.layer].stamina[1],0)+"" }, { "color": function() {return player.cf.stamina[0].lte(50)?"orange":"yellow"}, "font-size": "18px", "font-family": "helvetica" }],
            ["raw-html", function () { return isEquippingTool()?"<h3> Your "+tmp.cf.buyables[player.cf.grid[player.cf.equipped][0]].title+" have "+format(player.cf.grid[player.cf.equipped][1],0)+" durability left":"<h3>You are not equipping any tool" }, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
            ["blank" , "25px"],
            ["microtabs", "main", { 'border-width': '0px' }],
        ],
    layerShown() { return inChallenge('c',11)}


})
addLayer("cv", {
    startData() { return {
        unlocked: true, 
        isTrading: false,
        wire: d(0),
        hovering: d(0),
        timer: d(0),
        generator:d(2),
        gridSelected: [],
        energyCost:[d(100),d(100),d(100)],
        robotTimer:[d(0),d(0)],
        tradeOffering:[d(0),d(0),d(0),d(0),d(0)], //In order : Wood chunk , rock , stick , string , cobblestone

    }},
    color: "#686882",                      
    row: 5,
    displayRow: 1,
    branches: ['cf'],                              
    tooltip() {return "-- The cursed village -- <br> Stage 2"},
    ttStyle() {
        return {
            "color":"#ccbb60",
            "width":"250px",
            "border":"2px solid",
            "border-color":"#554475",
        }
    },
    type: "none",
    automate() {
        if(player.cv.timer.gte(1)) {
            transferEnergy()
            player.cv.timer = d(0)
        }
        if(player.cv.robotTimer[0].gte(5)) {
            player.cv.energyCost[0] = d(100)
            player.cv.robotTimer[0] = d(0)
        } 
        if(player.cv.robotTimer[1].gte(7)) {
            player.cv.energyCost[1] = d(100)
            player.cv.robotTimer[1] = d(0)
        }
        if(player.cv.robotTimer[0].gte(0.1)) {
            clickGrid('cv',101)
        }
        if(player.cv.robotTimer[1].gte(0.1)) {
            clickGrid('cv',107)
        }
    },
    update(delta) {
        player.cv.timer = player.cv.timer.add(d(delta).times(player.r.truegamespeed.min(10)))
        player.cv.robotTimer[0] = player.cv.robotTimer[0].add(delta)
        player.cv.robotTimer[1] = player.cv.robotTimer[1].add(delta)
    },  

    milestones: {
        
    },
    buyables: {
        11: {
            title() {
                let a = d(player.cv.gridSelected.length)
                let b = player.cv.hovering.eq(11)?"Will use "+format(a,0)+" <br>":""
                return ""+format(player.cv.wire,0)+" <br> "+b+" Superposition Wire"
               },
            tooltip() {
                let cost = "You should experiment with this weird wire <br> -5 Stamina per wire placed (Require 50 or more Stamina)"
                return cost
            },
            canAfford() { return true },
            canPlace() {return player.cv.wire.gte(1)},
            buy() {
               if(player.cv.hovering.neq(d(this.id))) {
                 player.cv.hovering = d(this.id)
               } else {
               if(!this.canPlace()) return
               if(this.canPlace() && d(player.cv.gridSelected.length).lte(player.cv.wire)) {
                    for (let i = 0; i < player.cv.gridSelected.length; i++) {
                        if(player.cf.stamina[0].lte(50)) continue
                        player.cv.wire = player.cv.wire.sub(1)
                        energyCompartmentModify(player.cv.gridSelected[i],d(2))
                        player.cf.stamina[0] = player.cf.stamina[0].sub(5)
                    }
                    player.cv.gridSelected = []
               }
               }

            
            },
            style() {
              if(this.canPlace() && player.cv.hovering.eq(this.id)) return Qcolor('lime')
              if(this.canPlace()) return Qcolor('rgb(128,128,0)')
              if(player.cv.hovering.eq(this.id)) return Qcolor('red')
              else return Qcolor('black')

        },
        },
        12: {
            title() {
                return "Destroy space"
               },
            tooltip() {
                return "Destroy object in the selected space <br> -5 Stamina and -1 durability per object destroyed (Require 50 or more Stamina) <br> Require any held tool"
            },
            canAfford() { return true },
            canPlace() {return true},
            buy() {
               if(player.cv.hovering.neq(d(this.id))) {
                 player.cv.hovering = d(this.id)
                 return
               } else {
                    for (let i = 0; i < player.cv.gridSelected.length; i++) {
                        if(!isEquippingTool()) continue
                        if(player.cf.stamina[0].lte(50)) continue
                        player.cf.stamina[0] = player.cf.stamina[0].sub(5)
                        modifyDurability(-1)
                        let type = getEnergyGridCompartment(player.cv.gridSelected[i])
                        if(type.eq(1)) player.cv.generator = player.cv.generator.add(1)
                        energyCompartmentModify(player.cv.gridSelected[i],d(0))
                    }
                    player.cv.gridSelected = []
                return
               }

            
            },
            style() {
              if(this.canPlace() && player.cv.hovering.eq(this.id)) return Qcolor('crimson')
              if(player.cv.hovering.eq(this.id)) return Qcolor('red')
              else return Qcolor('black')

        },
        },
        13: {
            title() {
                let a = d(player.cv.gridSelected.length)
                let b = player.cv.hovering.eq(13)?"Will use "+format(a,0)+" <br>":""
                return ""+format(player.cv.generator,0)+" left <br> "+b+" Energy generator"
               },
            tooltip() {
                let cost = "You founded them around the village <br> It should generate energy , transfer its content to nearby wires"
                return cost
            },
            canAfford() { return true },
            canPlace() {return player.cv.wire.gte(1)},
            buy() {
               if(player.cv.hovering.neq(d(this.id))) {
                 player.cv.hovering = d(this.id)
               } else {
               if(!this.canPlace()) return
               if(this.canPlace() && d(player.cv.gridSelected.length).lte(player.cv.generator) && d(player.cv.gridSelected.length).lte(2)) {
                    player.cv.generator = player.cv.generator.sub(player.cv.gridSelected.length)
                    for (let i = 0; i < player.cv.gridSelected.length; i++) {
                        energyCompartmentModify(player.cv.gridSelected[i],d(1))
                    }
                    player.cv.gridSelected = []
               }
               }

            
            },
            style() {
              if(this.canPlace() && player.cv.hovering.eq(this.id)) return Qcolor('lime')
              if(this.canPlace()) return Qcolor('rgb(128,128,0)')
              if(player.cv.hovering.eq(this.id)) return Qcolor('red')
              else return Qcolor('black')

        },
        },
    },
    upgrades: {
       
    },
    clickables: {
        11: {
            title() { return "Trade for wire <br> +0 when stopped" },
            tooltip() {
                return "Trade some of your material for a superposition wire <br> Exchange any material really! <br> Click here to begin trading <br> Click again while holding [Ctrl] and [Shift] to stop , "
            },
            canClick() {
                return true
            },
            unlocked() {
                return true
            },
            ttStyle() {
                return {
                    "color":"white",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"white",
                }
            },
            onClick() {
                player.cv.isTrading = !player.cv.isTrading
            },
            style() {   
                if(player.cv.isTrading) return {
                    'border-radius': '0%',
                    'color':'white',
                    'background-color': 'black',
                    'border':'4px solid',
                    'border-color':'yellow',
                    'height': '200px',
                    'width': '200px',
                }
                else return {
                    'border-radius': '0%',
                    'color':'white',
                    'background-color': 'black',
                    'border':'4px solid',
                    'border-color':'red',
                    'height': '200px',
                    'width': '200px',
                }
        },
        },
        12: {
            title() {
                let sign = shiftDown?"+":"-"
                let wood = player.cv.tradeOffering[0].times(0.1).add(1).floor() 
                return "Offer wood <br> "+sign+""+format(wood,0)+" Wood chunk <br> Offerings : "+format(player.cv.tradeOffering[0],0)+"" 
            },
            tooltip() {
                return "Hold [shift] to reduce offerings"
            },
            canClick() {
                if(shiftDown) return player.cv.tradeOffering[0].gte(1)
                return player.cf.wood.gte(player.cv.tradeOffering[0].times(0.1).add(1).floor()) 
            },
            unlocked() {
                return player.cv.isTrading
            },
            ttStyle() {
                return {
                    "color":"white",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"white",
                }
            },
            onClick() {
                if(shiftDown) {
                    player.cf.wood = player.cf.wood.add(player.cv.tradeOffering[0].times(0.1).add(1).floor())
                    player.cv.tradeOffering[0] = player.cv.tradeOffering[0].times(-0.1).sub(1).ceil().add(player.cv.tradeOffering[0])
                    return
                }

                player.cf.wood = player.cf.wood.sub(player.cv.tradeOffering[0].times(0.1).add(1).floor())
                player.cv.tradeOffering[0] = player.cv.tradeOffering[0].times(0.1).add(1).floor().add(player.cv.tradeOffering[0])
            },
            onHold() {
                this.onClick()
            },
            style() {   
                 return {
                    'border-radius': '0%',
                    'color':'brown',
                    'background-color': 'black',
                    'border':'4px solid',
                    'border-color':'brown',
                    'height': '150px',
                    'width': '150px',
                }
        },
        },
        13: {
            title() {
                let sign = shiftDown?"+":"-"
                let wood = player.cv.tradeOffering[1].times(0.1).add(1).floor() 
                return "Offer rock (weird?) <br> "+sign+""+format(wood,0)+" Rock <br> Offerings : "+format(player.cv.tradeOffering[1],0)+"" 
            },
            tooltip() {
                return "Hold [shift] to reduce offerings"
            },
            canClick() {
                if(shiftDown) return player.cv.tradeOffering[1].gte(1)
                return player.cf.rock.gte(player.cv.tradeOffering[1].times(0.1).add(1).floor()) 
            },
            unlocked() {
                return player.cv.isTrading
            },
            ttStyle() {
                return {
                    "color":"white",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"white",
                }
            },
            onClick() {
                if(shiftDown) {
                    player.cf.rock = player.cf.rock.add(player.cv.tradeOffering[1].times(0.1).add(1).floor())
                    player.cv.tradeOffering[1] = player.cv.tradeOffering[1].times(-0.1).sub(1).ceil().add(player.cv.tradeOffering[1])
                    return
                }

                player.cf.rock = player.cf.rock.sub(player.cv.tradeOffering[1].times(0.1).add(1).floor())
                player.cv.tradeOffering[1] = player.cv.tradeOffering[1].times(0.1).add(1).floor().add(player.cv.tradeOffering[1])
            },
            onHold() {
                this.onClick()
            },
            style() {   
                 return {
                    'border-radius': '0%',
                    'color':'gray',
                    'background-color': 'black',
                    'border':'4px solid',
                    'border-color':'gray',
                    'height': '150px',
                    'width': '150px',
                }
        },
        },
        14: {
            title() {
                let sign = shiftDown?"+":"-"
                let wood = player.cv.tradeOffering[0].times(0.1).add(1).floor() 
                return "Offer stick <br> "+sign+""+format(wood,0)+"  Wood chunk <br> Offerings : "+format(player.cv.tradeOffering[0],0)+"" 
            },
            tooltip() {
                return "Hold [shift] to reduce offerings"
            },
            canClick() {
                if(shiftDown) return player.cv.tradeOffering[0].gte(1)
                return player.cf.wood.gte(player.cv.tradeOffering[0].times(0.1).add(1).floor()) 
            },
            unlocked() {
                return player.cv.isTrading
            },
            ttStyle() {
                return {
                    "color":"white",
                    "width":"250px",
                    "border":"4px solid",
                    "border-color":"white",
                }
            },
            onClick() {
                if(shiftDown) {
                    player.cf.wood = player.cf.wood.add(player.cv.tradeOffering[0].times(0.1).add(1).floor())
                    player.cv.tradeOffering[0] = player.cv.tradeOffering[0].times(-0.1).sub(1).ceil().add(player.cv.tradeOffering[0])
                    return
                }

                player.cf.wood = player.cf.wood.sub(player.cv.tradeOffering[0].times(0.1).add(1).floor())
                player.cv.tradeOffering[0] = player.cv.tradeOffering[0].times(0.1).add(1).floor().add(player.cv.tradeOffering[0])
            },
            onHold() {
                this.onClick()
            },
            style() {   
                 return {
                    'border-radius': '0%',
                    'color':'brown',
                    'background-color': 'black',
                    'border':'4px solid',
                    'border-color':'brown',
                    'height': '150px',
                    'width': '150px',
                }
        },
        },
    },
    challenges: {
        
    },
    grid: {
        rows: 7,
        cols: 7,
        getStartData(id) {
            return ""
        },
        getTooltip(id) {
            id = getGridID(id)
            let role = getEnergyGridCompartment(id)
            if(role.eq(1)) return "Energy producer <br> Produce Energy and transfer to all nearby wire"
            if(role.eq(2)) return "Wire <br> Transfer energy to other wire"
            if(role.eq(3)) return "The void <br> ???"
            if(id === 101) return "Wood robot <br> Use "+format(player.cv.energyCost[0],0)+" energy to deal 1 [Tree] damage , then multiply the consumption by 1.08 afterward <br> Cost resets after 5s of inactivity"
            if(id === 107) return "Stone robot <br> Use "+format(player.cv.energyCost[1],0)+" energy to deal 1 [Stone] damage , then add +50 to consumption afterward <br> Cost resets after 7s of inactivity"
            if(id === 701) return "Ground robot <br> Use 100 energy to seek [Ground]"
            if(id === 707) return "Resonating stone <br> Energy stored in here loosen the stone"
        },
        getUnlocked(id) {
            return true
        },
        getStyle(data , id) {
            id2 = getGridID(id)
            if(id2 === 101 || id2 === 107 || id2 === 701 || id2 === 707) {
                return {
                    'border-radius': '0%',
                    'color':'orange',
                    'background-color': 'black',
                    'border':'4px solid',
                    'border-color':'orange',
                    'height': '100px',
                    'width': '100px',
                }
            }
            if(id2 === 404) return {
                'border-radius': '0%',
                'color':'purple',
                'background-color': 'black',
                'border':'4px solid',
                'border-color':'purple',
                'height': '100px',
                'width': '100px',
            }
            if(player.cv.gridSelected.includes(id2)) return {
                'border-radius': '0%',
                'color':'red',
                'background-color': 'black',
                'border':'4px solid',
                'border-color':'red',
                'height': '100px',
                'width': '100px',
            }  
            if(getEnergyGridCompartment(id2).eq(0)) return {
                'border-radius': '0%',
                'color':'white',
                'background-color': 'black',
                'border':'4px solid',
                'border-color':'white',
                'height': '100px',
                'width': '100px',
            }
            if(getEnergyGridCompartment(id2).eq(1)) return {
                'border-radius': '0%',
                'color':'aqua',
                'background-color': 'black',
                'border':'4px solid',
                'border-color':'aqua',
                'height': '100px',
                'width': '100px',
            }
            if(getEnergyGridCompartment(id2).eq(2)) return {
                'border-radius': '0%',
                'color':'lime',
                'background-color': 'black',
                'border':'4px solid',
                'border-color':'lime',
                'height': '100px',
                'width': '100px',
            }
        },
        getCanClick(data, id) {
            id = getGridID(id)
            if(id === 404) return false
            return true
        },
        onClick(data, id) { 
            id = getGridID(data)
            if(getEnergyGridCompartment(404).neq(3)) energyCompartmentModify(404,d(3))
            if(id === 101 || id === 107 || id === 701 || id === 707 ) {
                let energy = player.cv.grid[id][2]
                if(id === 101 && d(energy).gte(player.cv.energyCost[0])) {
                    player.cf.woodHP = player.cf.woodHP.sub(1)
                    player.cv.grid[101][2] = player.cv.grid[101][2].sub(player.cv.energyCost[0])
                    player.cv.robotTimer[0] = d(0)
                    player.cv.energyCost[0] = player.cv.energyCost[0].times(1.08)
                } else if (id === 107  && d(energy).gte(player.cv.energyCost[1])) {
                    player.cf.stoneHP = player.cf.stoneHP.sub(1)
                    player.cv.grid[107][2] = player.cv.grid[107][2].sub(player.cv.energyCost[1])
                    player.cv.robotTimer[1] = d(0)
                    player.cv.energyCost[1] = player.cv.energyCost[1].add(50)
                } else if (id === 701  && d(energy).gte(player.cv.energyCost[2])) {
                    let a = Math.random() * 100
                    let b = Math.random() * 100
                    let c = Math.random() * 100
                    if(a <= 10) player.cf.rock = player.cf.rock.add(1)
                    if(b <= 10) player.cf.stick = player.cf.stick.add(1)
                    if(c <= 10) player.cf.string = player.cf.string.add(1)
                    player.cv.grid[107][2] = player.cv.grid[107][2].sub(player.cv.energyCost[2])
                    player.cf.stamina[0] = player.cf.stamina[0].add(5)
                }
                return
            }
            if (id === 404) return
            if(!player.cv.gridSelected.includes(id)) {
                player.cv.gridSelected.push(id)
            } else {
                player.cv.gridSelected = player.cv.gridSelected.filter(x => x !== id)
            }
        },
        getTitle(data, id) {
            id = getGridID(id)
            let energy = d(0)
            if(player.cv.grid[id][2] === undefined) {
                player.cv.grid[id][2] = d(0)
            }
            energy = player.cv.grid[id][2]
            if(id === 101) return format(energy,1)+"<br> Wood robot"
            if(id === 107) return format(energy,1)+"<br> Stone robot"
            if(id === 701) return format(energy,1)+"<br> Ground robot"
            if(id === 707) return format(energy,1)+" / "+fde(6)+" <br> Resonating stone"
            if(id === 404) return "Void"
            if(getEnergyGridCompartment(id2).eq(1)) return format(energy,1)+" <br> Producer"
            if(getEnergyGridCompartment(id2).eq(2)) return format(energy,1)+" <br> Wire"
            if(!tmp.cv.buyables.hasOwnProperty(id2)) return

            if(id === "") return
            return data 
        },
    
    },
    microtabs: {
        main: {
            "Robots": {
            buttonStyle() { return { 'color': 'purple' } },
            unlocked() { return true},
            content:  [
            ["microtabs", "robot", { 'border-width': '0px' }],
            ]
        },
            "Trades": {
            buttonStyle() { return { 'color': 'purple' } },
            unlocked() { return true},
            content:  [
            ["microtabs", "trade", { 'border-width': '0px' }],
            ]
        },
        },
        robot : {
            "Energy network": {
                buttonStyle() { return { 'color': 'red' , "border-color" : "red" } },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return "<h3> A complex energy network ; maybe you can make use of this" }, { "color": "purple", "font-size": "22px", "font-family": "helvetica" }],
                    ["blank","25px"],
                    ["row",[["buyable",11],["buyable",12],["buyable",13]]],
                    ["blank","25px"],
                    ["row",[["grid",101]]],
                ]      
            },
        },
        trade : {
            "Sell item": {
                buttonStyle() { return { 'color': 'red' , "border-color" : "red" } },
                unlocked() { return true },
                content: [
                    ["raw-html", function () { return "<h3> You arrived at the haunted village and is shocked to see someone here" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3> The village was ruined and haunted , every part of the village seems fragile" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
                    ["raw-html", function () { return "<h3> For trading material , you will be given some wire to experiment with Energy network" }, { "color": "white", "font-size": "22px", "font-family": "helvetica" }],
                    ["row",[["clickable",11],["clickable",12],["clickable",13],["clickable",14],["clickable",15],["clickable",16]]],
                ]      
            },
        },
    },
       
        tabFormat: [
            ["raw-html", function () { return "<h3> Stamina : "+format(player.cf.stamina[0],1)+" / "+format(player.cf.stamina[1],0)+"" }, { "color": function() {return player.cf.stamina[0].lte(50)?"orange":"yellow"}, "font-size": "18px", "font-family": "helvetica" }],
            ["raw-html", function () { return isEquippingTool()?"<h3> Your "+tmp.cf.buyables[player.cf.grid[player.cf.equipped][0]].title+" have "+format(player.cf.grid[player.cf.equipped][1],0)+" durability left":"<h3>You are not equipping any tool" }, { "color": "gray", "font-size": "18px", "font-family": "helvetica" }],
            ["blank","25px"],
            ["microtabs", "main", { 'border-width': '0px' }],
        ],
    layerShown() { return player.c.stage.eq(2) && inChallenge('c',11)}


})