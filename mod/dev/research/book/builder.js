var ResearchBookUIBuilder = {
	/* ------------------------ UI FUNCS --------------------------- */
	formatText: function(str, strlen){
		var splitted = str.split(" ");
		var newstr = "";
		var curlen = 0;
		for(var i in splitted){
			var s = splitted[i];

			var lines = s.split("\n");
			if(lines.length == 2){	
			if(curlen + lines[0].length > strlen){newstr += "\n";}
				newstr += " " + lines[0] + "\n" + lines[1];
				curlen = lines[1].length;
				continue;
			}

			var len = s.length;
			curlen += len;
			if(curlen > strlen){
				curlen = len;
				newstr += " \n";
			}
			else {newstr += " ";}
			newstr += s;
		}
		return newstr;
	},
	
	createStandartUI: function(research){
		var title = research.title || research.name;
		var descr = research.description || "no description for research: " + title;
		
		var titlefont = {
			color: android.graphics.Color.WHITE,
			shadow: .6,
			size: 36
		};
		
		var textfont = {
			color: android.graphics.Color.WHITE,
			shadow: .5,
			size: 18
		};
		
		var writingfont = {
			color: android.graphics.Color.rgb(50, 0, 128),
			shadow: .4,
			size: 18
		};
		
		var content = {
			elements: {
				
			},
			
			drawing: [
				{type: "text", x: 128, y: 87, font: titlefont, text: title}
			],
			
			minHeight: 1000
		}
		
		var elementIndex = 0;
		var tagSplit = descr.split("{");
		descr = "";
		for (var i in tagSplit){
			var str = tagSplit[i];
			try{
				var lastIndex = str.indexOf("}");
				if (lastIndex != -1){
					var tagstr = "{" + str.substr(0, lastIndex) + "}";
					var tag = JSON.parse(tagstr);
					descr += str.substr(lastIndex + 1, str.length);
				}
				else{
					descr += str;
					continue;
				}
			}
			catch(e){
				descr += str;
				alert("error in decoding json tag: " + e);
			}
			
			switch(tag.type){
				case "bitmap":
				content.drawing.push({type: "bitmap", x: tag.x, y: tag.y, bitmap: tag.bitmap, scale:tag.scale});
				break;
				
				case "craft":
				case "magic_craft":
				var recipe = Recipes.getRecipesByResult(eval("" + tag.id), -1, tag.data)[0];
				if (tag.type == "craft"){
					content.drawing.push({type: "bitmap", x: tag.x, y: tag.y, bitmap: "overlay_usual_workbench", scale: 3});
				}
				else{
					content.drawing.push({type: "bitmap", x: tag.x, y: tag.y, bitmap: "overlay_magic_workbench", scale: 3});
				}
				if (recipe){
					content.drawing.push({type: "bitmap", x: tag.x, y: tag.y, bitmap: tag.bitmap, scale:tag.scale});
					for (var i in recipe.recipeSource){
						var source = recipe.recipeSource[i];
						if (source){
							var slot = {type: "slot", source: {id: source.id, count: 1, data: Math.max(0, source.data)}, x: tag.x + (i % 3) * 93 + 18, y: tag.y + parseInt(i / 3) * 93 + 18, visual: true, bitmap: "invisible_slot", size: 78};
							content.elements["_e" + elementIndex++] = slot;
						}
					}
				}
				break;
				
				case "crucible":
				content.drawing.push({type: "bitmap", x: tag.x, y: tag.y, bitmap: "overlay_crucible", scale: 2.8301});
				var radius = 50;
				var iconSize = Math.min(radius * Math.PI * 2 / tag.aspects.length * 1.1, 64);
				content.elements["_e" + elementIndex++] = {type: "slot", source: {id: eval("" + tag.id) || 0, count: 1, data: tag.data || 0}, x: tag.x + 22, y: tag.y - 18, visual: true, bitmap: "invisible_slot", size: 80};
				for (var i = 0; i < tag.aspects.length; i += 2){
					var angle = Math.PI * 2 * i / tag.aspects.length;
					content.drawing.push({type: "bitmap", x: tag.x + 120 + Math.sin(angle) * radius, y: tag.y + 203 + Math.cos(angle) * radius, bitmap: AspectRegistry.getAspectIcon(tag.aspects[i], true), scale: iconSize / 32});
					content.drawing.push({type: "text", x: tag.x + 120 + Math.sin(angle) * radius + iconSize * .5, y: tag.y + 203 + Math.cos(angle) * radius + iconSize, text: tag.aspects[i + 1], font: textfont});
				}
				break;
				
				default: 
				alert("unknown json tag type: " + tag.type);
			}
		}
	
	
		var formattedDescr = this.formatText(descr, 56);
		var lines = formattedDescr.split("\n");
		for (var i in lines){
			content.drawing.push({type: "text", x: 25, y: 140 + i * 23, font: writingfont, text: lines[i]})
		}
		for (var i in research.aspectNames){
			content.drawing.push({type: "bitmap", x: 860, y: 30 + i * 72, bitmap: AspectRegistry.getAspectIcon(research.aspectNames[i], true), scale: 2})
			content.drawing.push({type: "text", x: 900, y: 80 + i * 72, text: "" + parseInt(research.aspectAmounts[research.aspectNames[i]] / RESEARCH_PROGRESS_MULTIPLIER), font: textfont})
		}
		return content;
	},
	
	openResearchWindow: function(name){
		var research = ResearchRegistry.getResearch(name);
		if (research){
			var screen = researchBookPageGui;
			for (var name in screen.content.elements){
				screen.content.elements[name] = null;
			}
			screen.content.drawing = [];
			if (research.gui){
				for (var name in research.gui.elements){
					screen.content.elements[name] = research.gui.elements[name];
				}
				screen.content.drawing = research.gui.drawing || [];
			}
			else{
				var content = this.createStandartUI(research);
				for (var name in content.elements){
					screen.content.elements[name] = content.elements[name];
				}
				screen.content.drawing = content.drawing;
			}
			var buttonTexture = "research_page_button";
			if (ResearchRegistry.isResearched(name)){
				buttonTexture = "research_page_button_complete";
			}
			screen.content.elements.deployButton = {type: "button", x: 30, y: 23, bitmap: buttonTexture, scale: 1.3, clicker: {
					onClick: function(){
						ResearchRegistry.giveResearchPageToPlayer(research);
						screen.close();
					}
				}
			};
			
			screen.content.standart.minHeight = research.minWinHeight || content.minHeight;
			
			UI.testUI(screen);
		}
	},
	
	
	createResearchIcon: function(research){
		return {
			type: "image",
			x: research.coords.x - 48,
			y: research.coords.y - 48,
			bitmap: research.square ? "research_icon_background_1" : "research_icon_background_0",
			overlay: research.icon,
			scale: 1.5,
			overlayScale: (research.iconScale || 1) * 1.5,
			clicker: {
				onClick: function(){
					ResearchBookUIBuilder.openResearchWindow(research.name);
				}
			}
		};
	},
	
	openMainScreen: function(allVisible){
		var visible = allVisible ? ResearchRegistry.getAll() : ResearchRegistry.getAllVisible();
		var drawing = [];
		var elements = {};
		
		for (var i in visible){
			var research = visible[i];
			if (research.parent){
				drawing.push({type: "line", x1: research.coords.x, y1: research.coords.y, x2: ResearchRegistry.getResearchParent(research).coords.x, y2: ResearchRegistry.getResearchParent(research).coords.y, width: 5})
			}
		}
		for (var i in visible){
			elements["research" + i] = this.createResearchIcon(visible[i]);
		}
		
		researchBookGui.content.elements = elements;
		researchBookGui.content.drawing = drawing;
		UI.testUI(researchBookGui);
	}
}


//ResearchBookUIBuilder.openMainScreen(true);
