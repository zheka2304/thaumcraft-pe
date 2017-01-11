/* quick-access */
var ASPECT = AspectRegistry.aspects;
AspectRegistry.registerAspect(new Aspect("flux").setup({type: 0, power: -1, stability: 0.8, element: "magic"}, {color: {r: 149, g: 35, b: 145}})); 
AspectRegistry.registerAspect(new Aspect("aer").setup({type: 1, power: -0.5, stability: 0.7, element: "air"}, {color: {r: 255, g: 255, b: 200}})); 
AspectRegistry.registerAspect(new Aspect("aqua").setup({type: 2, power: 0.3, stability: 0.5, element: "water"}, {color: {r: 150, g: 200, b: 255}})); 
AspectRegistry.registerAspect(new Aspect("terra").setup({type: 5, power: -0.1, stability: 0.8, element: "life"}, {color: {r: 50, g: 255, b: 0}})); 
AspectRegistry.registerAspect(new Aspect("ignis").setup({type: 9, power: -0.5, stability: 0.4, element: "flame"}, {color: {r: 255, g: 0, b: 0}})); 
AspectRegistry.registerAspect(new Aspect("nitor").setup({type: 20, power: 0.8, stability: 0.8, element: "flame"}, {color: {r: 255, g: 180, b: 0}})); 
AspectRegistry.registerAspect(new Aspect("ordo").setup({type: 9, power: 1, stability: 1, element: "magic", spellID: 1}, {color: {r: 255, g: 255, b: 255}})); 
AspectRegistry.registerAspect(new Aspect("perditio").setup({type: 3, power: 0, stability: 0.63, element: "air", spellID: 1}, {color: {r: 90, g: 87, b: 88}})); 


AspectRegistry.registerAspect(new Aspect("lux").setup({type: 10, power: 0.9, stability: 0.75, element: "flame", spellID: 1}, {color: {r: 255, g: 210, b: 116}}));
AspectRegistry.registerAspect(new Aspect("gelum").setup({type: 11, power: 0.7, stability: 0.98, element: "water", spellID: 1}, {color: {r: 225, g: 254, b: 252}}));
AspectRegistry.registerAspect(new Aspect("motus").setup({type: 10, power: 0.8, stability: 0.68, element: "magic", spellID: 1}, {color: {r: 161, g: 162, b: 192}}));
AspectRegistry.registerAspect(new Aspect("potentia").setup({type: 18, power: 0.9, stability: 0.94, element: "flame", spellID: 1}, {color: {r: 126, g: 196, b: 204}}));
AspectRegistry.registerAspect(new Aspect("saxum").setup({type: 10, power: 0.6, stability: 0.68, element: "magic", spellID: 1}, {color: {r: 108, g: 105, b: 106}}));
AspectRegistry.registerAspect(new Aspect("tempestas").setup({type: 3, power: -0.2, stability: 0.87, element: "air", spellID: 1}, {color: {r: 255, g: 255, b: 255}}));
AspectRegistry.registerAspect(new Aspect("vacous").setup({type: 4, power: 0.5, stability: 0.99, element: "air", spellID: 1}, {color: {r: 94, g: 97, b: 95}}));
AspectRegistry.registerAspect(new Aspect("victus").setup({type: 7, power: 1, stability: 0.75, element: "life", spellID: 1}, {color: {r: 183, g: 10, b: 12}}));
AspectRegistry.registerAspect(new Aspect("bestia").setup({type: 17, power: 0.8, stability: 0.87, element: "life", spellID: 1}, {color: {r: 157, g: 101, b: 4}}));
AspectRegistry.registerAspect(new Aspect("fames").setup({type: 11, power: -0.5, stability: 0.68, element: "life", spellID: 1}, {color: {r: 144, g: 4, b: 5}}));
AspectRegistry.registerAspect(new Aspect("iter").setup({type: 15, power: 0.8, stability: 0.87, element: "magic", spellID: 1}, {color: {r: 226, g: 85, b: 91}}));
AspectRegistry.registerAspect(new Aspect("limus").setup({type: 9, power: -0.6, stability: 0.75, element: "magic", spellID: 1}, {color: {r: 11, g: 243, b: 10}}));
AspectRegistry.registerAspect(new Aspect("metallum").setup({type: 19, power: 0.7, stability: 0.95, element: "magic", spellID: 1}, {color: {r: 176, g: 182, b: 200}}));
AspectRegistry.registerAspect(new Aspect("mortuus").setup({type: 10, power: -0.8, stability: 0.62, element: "life", spellID: 1}, {color: {r: 132, g: 118, b: 133}}));
AspectRegistry.registerAspect(new Aspect("permutatio").setup({type: 12, power: 1, stability: 0.87, element: "air", spellID: 1}, {color: {r: 87, g: 134, b: 88}}));
AspectRegistry.registerAspect(new Aspect("praecantatio").setup({type: 22, power: 1, stability: 0.84, element: "magic", spellID: 1}, {color: {r: 151, g: 2, b: 192}}));
AspectRegistry.registerAspect(new Aspect("sano").setup({type: 14, power: 0.9, stability: 0.68, element: "life", spellID: 1}, {color: {r: 251, g: 46, b: 53}}));
AspectRegistry.registerAspect(new Aspect("tenebrae").setup({type: 14, power: 0.1, stability: 0.78, element: "magic", spellID: 1}, {color: {r: 0, g: 0, b: 0}}));
AspectRegistry.registerAspect(new Aspect("vinculum").setup({type: 13, power: -0.6, stability: 0.75, element: "air", spellID: 1}, {color: {r: 155, g: 112, b: 116}}));
AspectRegistry.registerAspect(new Aspect("vitreus").setup({type: 12, power: 0.65, stability: 0.87, element: "water", spellID: 1}, {color: {r: 57, g: 234, b: 255}}));
AspectRegistry.registerAspect(new Aspect("volatus").setup({type: 11, power: 0.8, stability: 0.69, element: "air", spellID: 1}, {color: {r: 203, g: 185, b: 147}}));
AspectRegistry.registerAspect(new Aspect("alienis").setup({type: 18, power: -0.38, stability: 0.75, element: "magic", spellID: 1}, {color: {r: 131, g: 77, b: 127}}));
AspectRegistry.registerAspect(new Aspect("auram").setup({type: 23, power: 0.675, stability: 0.89, element: "magic", spellID: 1}, {color: {r: 192, g: 141, b: 184}}));
AspectRegistry.registerAspect(new Aspect("corpus").setup({type: 27, power: 0.4, stability: 0.68, element: "life", spellID: 1}, {color: {r: 234, g: 75, b: 142}}));
AspectRegistry.registerAspect(new Aspect("exanimis").setup({type: 20, power: -0.75, stability: 0.78, element: "magic", spellID: 1}, {color: {r: 58, g: 64, b: 2}}));
AspectRegistry.registerAspect(new Aspect("herba").setup({type: 17, power: 0.89, stability: 0.98, element: "life", spellID: 1}, {color: {r: 0, g: 159, b: 41}}));
AspectRegistry.registerAspect(new Aspect("spiritus").setup({type: 17, power: -0.6, stability: 1, element: "life", spellID: 1}, {color: {r: 244, g: 237, b: 227}}));
AspectRegistry.registerAspect(new Aspect("venenum").setup({type: 12, power: -1, stability: 0.74, element: "magic", spellID: 1}, {color: {r: 138, g: 249, b: 0}}));
AspectRegistry.registerAspect(new Aspect("arbor").setup({type: 22, power: 0.85, stability: 0.75, element: "life", spellID: 1}, {color: {r: 88, g: 51, b: 17}}));
AspectRegistry.registerAspect(new Aspect("cognitio").setup({type: 22, power: 1, stability: 0.94, element: "life", spellID: 1}, {color: {r: 253, g: 199, b: 189}}));
AspectRegistry.registerAspect(new Aspect("sensus").setup({type: 18, power: 1, stability: 0.96, element: "air", spellID: 1}, {color: {r: 34, g: 209, b: 230}}));
AspectRegistry.registerAspect(new Aspect("humanus").setup({type: 39, power: 0.85, stability: 0.75, element: "life", spellID: 1}, {color: {r: 254, g: 213, b: 191}}));
AspectRegistry.registerAspect(new Aspect("instrumentum").setup({type: 58, power: 1, stability: 0.85, element: "life", spellID: 1}, {color: {r: 92, g: 0, b: 255}}));
AspectRegistry.registerAspect(new Aspect("lucrum").setup({type: 50, power: 0.12, stability: 0.73, element: "magic", spellID: 1}, {color: {r: 154, g: 137, b: 75}}));
AspectRegistry.registerAspect(new Aspect("messis").setup({type: 51, power: 0.85, stability: 0.75, element: "life", spellID: 1}, {color: {r: 255, g: 198, b: 98}}));
AspectRegistry.registerAspect(new Aspect("perfodio").setup({type: 49, power: 0.75, stability: 0.87, element: "life", spellID: 1}, {color: {r: 220, g: 209, b: 238}}));
AspectRegistry.registerAspect(new Aspect("pannus").setup({type: 75, power: 0.48, stability: 0.72, element: "life", spellID: 1}, {color: {r: 203, g: 185, b: 147}}));
AspectRegistry.registerAspect(new Aspect("telum").setup({type: 61, power: 0.92, stability: 0.68, element: "air", spellID: 1}, {color: {r: 179, g: 88, b: 85}}));
AspectRegistry.registerAspect(new Aspect("tutamen").setup({type: 63, power: 1, stability: 0.9, element: "life", spellID: 1}, {color: {r: 0, g: 193, b: 192}}));
AspectRegistry.registerAspect(new Aspect("meto").setup({type: 90, power: 1, stability: 0.9, element: "life", spellID: 1}, {color: {r: 235, g: 173, b: 134}}));
AspectRegistry.registerAspect(new Aspect("fabrico").setup({type: 97, power: 1, stability: 0.75, element: "life", spellID: 1}, {color: {r: 130, g: 156, b: 127}}));
AspectRegistry.registerAspect(new Aspect("machina").setup({type: 68, power: 1, stability: 0.86, element: "magic", spellID: 1}, {color: {r: 132, g: 121, b: 152}}));

AspectRegistry.addReaction("aqua", "ordo", "gelum")
AspectRegistry.addReaction("aer", "ignis", "lux")
AspectRegistry.addReaction("lux", "ignis", "nitor")
AspectRegistry.addReaction("aer", "ordo", "motus")
AspectRegistry.addReaction("ordo", "ignis", "potentia")
AspectRegistry.addReaction("terra", "terra", "saxum")
AspectRegistry.addReaction("aer", "aqua", "tempestas")
AspectRegistry.addReaction("aer", "perditio", "vacous")
AspectRegistry.addReaction("aqua", "terra", "victus")
AspectRegistry.addReaction("motus", "victus", "bestia")
AspectRegistry.addReaction("victus", "vacous", "fames")
AspectRegistry.addReaction("victus", "terra", "herba")
AspectRegistry.addReaction("motus", "terra", "iter")
AspectRegistry.addReaction("victus", "aqua", "limus")
AspectRegistry.addReaction("saxum", "ordo", "metallum")
AspectRegistry.addReaction("victus", "perditio", "mortuus")
AspectRegistry.addReaction("motus", "aqua", "permutatio")
AspectRegistry.addReaction("vacous", "potentia", "praecantatio")
AspectRegistry.addReaction("victus", "victus", "sano")
AspectRegistry.addReaction("vacous", "lux", "tenebrae")
AspectRegistry.addReaction("motus", "perditio", "vinculum")
AspectRegistry.addReaction("saxum", "aqua", "vitreus")
AspectRegistry.addReaction("aer", "motus", "volatus")
AspectRegistry.addReaction("vacous", "tenebrae", "alienis")
AspectRegistry.addReaction("praecantatio", "aer", "auram")
AspectRegistry.addReaction("mortuus", "bestia", "corpus")
AspectRegistry.addReaction("motus", "mortuus", "exanimis")
AspectRegistry.addReaction("victus", "mortuus", "spiritus")
AspectRegistry.addReaction("aqua", "mortuus", "venenum")
AspectRegistry.addReaction("terra", "herba", "arbor")
AspectRegistry.addReaction("terra", "spiritus", "cognitio")
AspectRegistry.addReaction("aer", "spiritus", "sensus")
AspectRegistry.addReaction("bestia", "cognitio", "humanus")
AspectRegistry.addReaction("humanus", "metallum", "instrumentum")
AspectRegistry.addReaction("humanus", "fames", "lucrum")
AspectRegistry.addReaction("herba", "humanus", "messis")
AspectRegistry.addReaction("humanus", "saxum", "perfodio")
AspectRegistry.addReaction("instrumentum", "bestia", "pannus")
AspectRegistry.addReaction("instrumentum", "perfodio", "telum")
AspectRegistry.addReaction("instrumentum", "terra", "tutamen")
AspectRegistry.addReaction("messis", "humanus", "meto")
AspectRegistry.addReaction("humanus", "instrumentum", "fabrico")
AspectRegistry.addReaction("motus", "instrumentum", "machina")