ResearchRegistry.registerResearch("alchemy", {
	parent: "aspects theory",
	icon: "research_alchemy",
	coords: {
		x: 100,
		y: 300
	},
	aspectNames: ["perditio", "praecantatio", "metallum"],
	aspectAmounts: {praecantatio: 7, perditio: 5, metallum: 3},
	title: "Alchemy",
	description: 'Чтобы сделать тигель, нужно использовать волшебную палочку на котле. Тигель - важный инструмент тауматурга. Он позволяет расщеплять объекты на их аспекты и эссенцию, а так же использовать их в своих нуждах. Для работы под тиглем должен стоять источникок тепла, а в нем должна быть вода. Когда вода начнет кипеть - просто закиньте в тигель предметы, которые Вы хотите разложить и они будут сразу превращены в эссенцию. Если формула составлена верно и в нем находится нужная эссенция, то Вы можете бросить в него Активатор. Активатор забирает эссенцию и трансформируется в нужный предмет, который затем выпрыгивает из тигля. Вся оставшаяся в котле эссенция выбрасывается в ауру. Создание предмета забирает воду из тигеля и Вам придется его снова наполнять. Вместе с тратой ресурсов, вышедшая эссенция может устроить непредвиденные последствия.'
});

ResearchRegistry.registerResearch("nitor", {
	parent: "alchemy",
	icon: "research_nitor",
	coords: {
		x: 240,
		y: 380
	},
	aspectNames: ["nitor", "lux", "ordo"],
	aspectAmounts: {nitor: 7, lux: 5, ordo: 8},
	title: "Nitor",
	minWinHeight: 1200,
	description: 'Это пылающее пламя, кажется, подпитывается магией само по себе. Количество применений вечногорящего пламени кажется бесконечным, но, к сожалению, оно производит больше света, чем тепла. Но его пламя все же может оказаться постоянным источником энергии. \nНитор может быть расположен как источник света, но ему не нужна опора.{"type":"crucible","y":300,"x":10,"id":263,"aspects":["nitor",2,"lux",4,"ordo",2]}'
});

ResearchRegistry.registerResearch("alumentum", {
	parent: "nitor",
	icon: "research_alumentum",
	coords: {
		x: 260,
		y: 590
	},
	aspectNames: ["ignis", "potentia", "perditio"],
	aspectAmounts: {ignis: 7, potentia: 5, perditio: 8},
	title: "Alumentum",
	description: 'Эта субстанция просто пышет энергией и Вам кажется, что энергия внутри Алюментума так и жаждет вырваться наружу. Алюментум нестабилен, но может служить хорошим источником тепла. Не очень хорошей идеей будет кинуть его куда-нибудь, произойдет достаточно сильный взрыв и возгорание, однако его можно использовать, как оружие.{"type":"crucible","y":300,"x":10,"id":289,"aspects":["potentia",3,"ignis",1,"perditio",2]}'
});

ResearchRegistry.registerResearch("thaum metal", {
	parent: "alchemy",
	icon: "research_thaum_metal",
	coords: {
		x: 100,
		y: 470
	},
	aspectNames: ["praecantatio", "metallum"],
	aspectAmounts: {praecantatio: 10, metallum: 8},
	title: "Thaum metal",
	description: 'По тауматургическим принципам, металлы можно изменять с помощью магии. Результатом Вашего первого эксперимента стал Таум-металл. Таум-металл - результат наполнения металла магией. В итоге получается более прочный, чем железо металл с огромным потенциалом к магии. На его свойствах основано множество магических устройств. Из него также можно делать броню и некоторые полезные предметы.{"type":"crucible","y":300,"x":10,"id":265,"aspects":["praecantatio",3,"ordo",3]}'
});

ResearchRegistry.registerResearch("crystals of power", {
	parent: "thaum metal",
	icon: "research_power_crystals",
	coords: {
		x: 120,
		y: 670
	},
	aspectNames: ["ordo", "ignis", "nitor", "potentia"],
	aspectAmounts: {ordo: 4, ignis: 4, nitor: 4, potentia: 12},
	title: "Crystals of power",
	description: 'Дальнейшие изучения в магии привели вас к открытию кристаллов, созданных из эссенций аспектов, обладающих невероятной мощью и огромным воздействием на ауру. Продолжайте исследование, чтобы научиться создавать их.{"type":"crucible","y":300,"x":10,"id":263,"aspects":["nitor",2,"lux",4,"ordo",2]}'
});



ResearchRegistry.registerResearch("positive crystal", {
	parent: "crystals of power",
	icon: "research_positive_crystal",
	coords: {
		x: 90,
		y: 900
	},
	aspectNames: ["ignis", "potentia", "victus"],
	aspectAmounts:  {ignis: 4, potentia: 12, victus: 6},
	title: "Positive crystal of power",
	description: 'Кристалл силы, созданный из самой ауры, кажется, что он испускает положительную энергию. Если разбить этот кристалл, он перегрузит узлы ауры поблизости магической энергии, что вызовет кратковременное и быстрое очищение от излишков аспектов, которые появятся в мире в виде содержащих их предметов.{"type":"crucible","y":300,"x":10,"id":331,"aspects":["ordo", 10, "auram", 20]}'
});


ResearchRegistry.registerResearch("negative crystal", {
	parent: "crystals of power",
	icon: "research_negative_crystal",
	coords: {
		x: 240,
		y: 920
	},
	aspectNames: ["ignis", "potentia", "mortuus"],
	aspectAmounts: {ignis: 4, potentia: 12, mortuus: 6},
	title: "Negative crystal of power",
	description: 'Кристалл материальной порчи, обладает огромным запасом негативной энергии и способен уничтожить все вокруг себя. Разбейте его и выпустите всю мощь аспекта flux на своих врагов, полностью уничтожив их.\n Однако ничто не происходит просто так, энергия разбитого кристалла перейдет в ауру и заразит ее, что будет иметь последствия, если заражение не устранить в ближайшее время.{"type":"crucible","y":400,"x":10,"id":331,"aspects":["flux", 10, "ordo", 5]}'
});








ResearchRegistry.registerResearch("arcane workbench", {
	parent: "basic magic",
	icon: "research_arcane_workbench",
	coords: {
		x: 800,
		y: 300
	},
	aspectNames: ["ordo", "praecantatio"],
	aspectAmounts: {praecantatio: 7, ordo: 8},
	title: "Arcane workbench",
	description: 'Основой для создания магических предметов и механизмов служит магический верстак. Именно на нем вы сможете создать все предметы, которые вы изучите в этой ветви изучений. Создать верстак можно просто использовав волшебную палочку на столе.'
});

ResearchRegistry.registerResearch("googles", {
	parent: "arcane workbench",
	icon: "research_googles",
	coords: {
		x: 930,
		y: 490
	},
	aspectNames: ["praecantatio", "metallum", "sensus"],
	aspectAmounts: {praecantatio: 7, metallum: 4, sensus: 10},
	title: "Googles of true sight",
	description:'Основываясь на собственных наблюдениях, Вы понимаете, что магию не очень легко... увидеть. Эти очки сделают поиск узлов ауры еще легче, а так же откроют некоторые скрытые вещи. Они являются одним из главных инструментов Тауматурга.{"type":"magic_craft","x":10,"y":250,"id":"ItemID.itemGoogles","data":0}'
});

ResearchRegistry.registerResearch("thaum armor", {
	parent: "arcane workbench",
	icon: "research_armor",
	//square: true,
	coords: {
		x: 730,
		y: 540
	},
	aspectNames: ["fabrico", "metallum", "tutamen"],
	aspectAmounts: {fabrico: 7, metallum: 4, tutamen: 10},
	title: "Thaumic armor",
	minWinHeight: 1600,
	description: 'Таум-броня прочна и дает много защиты, кроме этого есть шанс, что при атаке на игрока возникнет разряд магической энергии, и атакующий получит столько же урона, сколько он нанес, при этом расстояние не имеет значения.{"type":"magic_craft","x":10,"y":250,"id":"ItemID.itemThaumHelmet","data":0}{"type":"magic_craft","x":10,"y":570,"id":"ItemID.itemThaumChestplate","data":0}{"type":"magic_craft","x":10,"y":890,"id":"ItemID.itemThaumLeggings","data":0}{"type":"magic_craft","x":10,"y":1210,"id":"ItemID.itemThaumBoots","data":0}'
});

ResearchRegistry.registerResearch("hell furnace", {
	parent: "arcane workbench",
	icon: "research_infernal_furnace",
	iconScale: 64 / 72,
	square: true,
	coords: {
		x: 830,
		y: 840
	},
	aspectNames: ["praecantatio", "metallum", "fabrico", "permutatio"],
	aspectAmounts: {praecantatio: 7, metallum: 4, fabrico: 10, permutatio: 10},
	title: "Hell furnace",
	minWinHeight: 1250,
	description: 'Создавая адскую печь, вы заключаете всю мощь аспекта ignis в одном могучем механизме, который обладает эффективностью, на два порядка больше обычной печи, к тому же адская печь питает саму себя и не требует топлива. Однако в процессе переплавки в ауру выделяется немного порчи, потому стоит следить за состоянием ауры, когда адская печь работает.\nДля постройки адской печи вам понадобится конструкция сдедущего вида, где * - обсидиан, # - адский кирпич, L - лава, B - решетка, C - ядро адской печи (снизу вверх):\n # * #\n * # * \n # * # \n\n * # *\n # L #\n * # *\n\n # * #\n * C * \n # * #\n\n\nРешетка может быть направлена в любую сторону, если печь построена правильно, она изменит текстуру, это выход адской печи. Чтобы переплавить предмет, его нужно сбросить в ядро печи в верхней его части.{"type":"magic_craft","x":10,"y":750,"id":"BlockID.blockHellFurnaceCore","data":0}'
});



















ResearchRegistry.registerResearch("aura recognition", {
	parent: "aura theory",
	icon: "research_aura_meter",
	coords: {
		x: 500,
		y: 350
	},
	aspectNames: ["potentia", "praecantatio", "metallum"],
	aspectAmounts: {praecantatio: 7, potentia: 5, metallum: 3},
	title: "Aura recognition",
	description: 'Вы научились распознавать известные аспекты в ауре и теперь сможете создать измеритель ауры, который позволит увидеть аспекты, которые содержатся в ближайших узлах ауры, но подождите останавливаться, продолжайте изучения в этом направлении и скоро сможете контролировать ауру.{"type":"magic_craft","x":10,"y":250,"id":"BlockID.blockAuraMeter","data":0}'
});

ResearchRegistry.registerResearch("aura extractor", {
	parent: "aura recognition",
	icon: "research_aura_extractor",
	coords: {
		x: 370,
		y: 480
	},
	aspectNames: ["motus", "praecantatio", "aqua"],
	aspectAmounts:  {motus: 7, praecantatio: 5, aqua: 8},
	title: "Essence extractor",
	description: 'Вы научились получать эссенции аспектов из ауры и использовать их в своих целях, на основе этих знаний Вы разработали механизм, который вытягивает положительрные эссенции из ауры и преобразует их в эссенцию аспекта auram, которая является единственным источником этого аспекта. {"type":"magic_craft","x":10,"y":250,"id":"BlockID.blockAuraExtractor","data":0}'
});


ResearchRegistry.registerResearch("aura cleaner", {
	parent: "aura recognition",
	icon: "research_aura_cleaner",
	coords: {
		x: 600,
		y: 510
	},
	aspectNames: ["limus", "praecantatio", "aqua"],
	aspectAmounts: {limus: 7, praecantatio: 5, aqua: 8},
	title: "Aura cleaner",
	description: 'Вы создали механизм, который позволяет очищать ауру и регенерировать ее, он необходим, если вы активно занимаетесь тауматургией, ибо при абсолютном большинстве различных магических операций в мир выделаются отрицательные аспекты, включая flux, которые стоит убрать из узла. {"type":"magic_craft","x":10,"y":250,"id":"BlockID.blockAuraCleaner","data":0}'
});

ResearchRegistry.registerResearch("dark extractor", {
	parent: "aura cleaner",
	icon: "research_dark_extractor",
	coords: {
		x: 630,
		y: 670
	},
	aspectNames: ["permutatio", "vitreus", "praecantatio", "tenebrae"],
	aspectAmounts: {permutatio: 7, vitreus: 5, praecantatio: 8, tenebrae: 8},
	title: "Dark essence extractor",
	description: 'Это улучшение к очистителю ауры, которое позволит ему собирать негативные аспекты в эссенцию аспекта flux, которая является единственным источником этого аспекта.'
});
