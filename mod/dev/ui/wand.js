var CoreEngineGuiUtils = ModAPI.requireGlobal("GuiUtils");
/*
Callback.addCallback("PostLoaded", function(){
	var ctx = ModAPI.requireGlobal("getMcContext()");
	var parent = ctx.getWindow().getDecorView();
	parent.setOnTouchListener({
		onTouch: function(view, event){
			try{
				WandUseAnimator.registerScreenTouchEvent(view, event);
			}catch(e){
				alert("thaumcraft wand ui error: " + e);
			}
			return true;
		}
	});
	
});*/


var WandUseAnimator = {
	lastRegistredPosition: null,
	
	registerScreenTouchEvent: function(view, event){
		if (!this.ctx || !this.size){
			this.ctx = ModAPI.requireGlobal("getMcContext()");
			this.size = ModAPI.requireGlobal("GuiCore.getDisplaySize()");
		}
		
		if (World.isWorldLoaded()){
			var touchX = (event.getRawX() - this.size[0] / 2) / (this.size[0] / 2);
			var touchY = -(event.getRawY() - this.size[1] / 2) / (this.size[0] / 2);
			var player = Player.getPosition();
			
			var look = Entity.getLookVector(Player.get());
			var xzlen = Math.sqrt(look.x * look.x + look.z * look.z);
			var screenpos = {
				x: (touchX * -look.z / xzlen) + (touchY * -look.y * look.x / xzlen),
				y: touchY * xzlen,
				z: (touchX * look.x / xzlen) + (touchY * -look.y * look.z / xzlen)
			}
			
			var depth = 1.75;
			this.registerAnimationPosition(event, player.x + (look.x + screenpos.x) * depth, player.y + (look.y + screenpos.y) * depth, player.z + (look.z + screenpos.z) * depth);
		}
	},
	
	registerAnimationPosition: function(event, x, y, z){
		var action = event.getAction();
		var pos = {x: x, y: y, z: z};
		if (this.lastRegistredPosition){
			Particles.line(31, this.lastRegistredPosition, pos, 0.02);
		}
		this.lastRegistredPosition = pos;
		if(action == 1){
			this.lastRegistredPosition = null;
		}
	},
	
	animateAspect: function(aspectName){
		var aspect = AspectRegistry.getAspect(aspectName);
		if (aspect){
			ParticleAnimation.particleSplash(this.lastRegistredPosition, {id: 26, data: aspect.getFinalColor()}, {count: 20});
		}
	},
	
	fixatedLookAngle: null,
	fixatePlayerLook: function(){
		if (!this.fixatedLookAngle){
			this.fixatedLookAngle = Entity.getLookAngle(Player.get());
		}
		else{
			Entity.setLookAngle(Player.get(), this.fixatedLookAngle.yaw, this.fixatedLookAngle.pitch);
		}
	},
	
	removeFixation: function(){
		this.fixatedLookAngle = null;
	}
}

var WandUI = {
	aspectViews: [],
	
	close: function(index){
		var self = this;
		CoreEngineGuiUtils.Run(function(){
			if (self.aspectViews[index]){
				self.aspectViews[index].window.dismiss();
				delete(self.aspectViews[index]);
			}
		})
	},
	
	closeAll: function(){
		for (var index in this.aspectViews){
			this.close(index);
		}
	},
	
	getAspectSelected: function(x, y){
		for (var i in this.aspectViews){
			var rect = this.aspectViews[i].rect;
			if (rect && x > rect[0] && y > rect[1] && x < rect[2] && y < rect[3]){
				return this.aspectViews[i].name;
			}
		}
	},
	
	lastAspectTriggered: null,
	isNewAspectTriggered: function(name){
		if (this.lastAspectTriggered != name){
			this.lastAspectTriggered = name;
			return true;
		}
		return false;
	},
	
	noAspectTriggered: function(){
		return this.isNewAspectTriggered(null);
	},
	
	addAspect: function(position, aspectName, onClicked){
		var ctx = ModAPI.requireGlobal("getMcContext()");
		var size = ModAPI.requireGlobal("GuiCore.getDisplaySize()");
		var parent = ctx.getWindow().getDecorView();
		
		var width = size[1] * .125;
		var aspectView = {
			window: new android.widget.PopupWindow(ctx),
			view: new android.widget.ImageView(ctx),
			name: aspectName,
			rect: [position.x - width * .5, position.y - width * .5, position.x + width * .5, position.y + width * .5]
		}
		
		this.aspectViews.push(aspectView);
		
		var self = this;
		CoreEngineGuiUtils.Run(function(){
			aspectView.window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
			aspectView.window.setContentView(aspectView.view);
			aspectView.window.setWidth(width);
			aspectView.window.setHeight(width);
			aspectView.window.showAtLocation(parent, android.view.Gravity.TOP | android.view.Gravity.LEFT, position.x - width * .5, position.y - width * .5);
			
			var bitmapCache = ModAPI.requireGlobal("GuiCore.BitmapCache");
			var bitmap = bitmapCache.getScaled("aspectIcon_" + aspectName, 4);
			if (bitmap){
				aspectView.view.setImageBitmap(bitmap);
			}
			
			aspectView.view.setOnTouchListener({
				onTouch: function(view, event){
					try{
						WandUseAnimator.registerScreenTouchEvent(view, event);
						
						var aspectSelected = self.getAspectSelected(event.getRawX(), event.getRawY());
						if (self.isNewAspectTriggered(aspectSelected)){
							if (onClicked && aspectSelected){
								onClicked(aspectSelected);
								WandUseAnimator.animateAspect(aspectSelected);
							}
						}
						if (event.getAction() == 1){
							self.noAspectTriggered();
							WandSpellBuilder.completeSpell();
						}
					}catch(e){
						alert("thaumcraft wand ui error: " + e);
					}
					return true;
				}
			});
			
		});
	},
	
	openArrayOfAspects: function(aspectArray, onClicked){
		this.closeAll();
		var size = ModAPI.requireGlobal("GuiCore.getDisplaySize()");
		var radius = size[1] * .32;
		for (var i in aspectArray){
			var angle = Math.PI * 2 * i / aspectArray.length;
			this.addAspect({
				x: Math.sin(angle) * radius + size[0] * .5,
				y: Math.cos(angle) * radius + size[1] * .5,
			}, aspectArray[i], onClicked);
		}
	}
}
/*
WandUI.openArrayOfAspects(["aer", "terra", "ordo", "ignis", "nitor", "flux", "potentia"], function(name){
	WandSpellBuilder.addAspect(name);
});*/

