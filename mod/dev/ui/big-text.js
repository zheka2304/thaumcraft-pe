var BIG_TEXT_THREAD_ID = 0;

function CreateBigText(text, rgb, startSize, textTime){
	var ctx = UI.getMcContext();
	
	var window = new android.widget.PopupWindow(ctx);
	var view = new android.widget.TextView(ctx);
	var screensize = ModAPI.requireGlobal("GuiUtils.GetDisplaySize()");
	UI.run(function(){
		var parent = ctx.getWindow().getDecorView();
		view.setGravity(0x11);
		view.setTextColor(android.graphics.Color.argb(0, rgb.r, rgb.g, rgb.b));
		view.setTypeface(ModAPI.requireGlobal("GuiLoader.minecraftTypeface"));
		window.setContentView(view);
		window.setWidth(screensize[0]);
		window.setHeight(screensize[1]);
		window.setTouchable(false);
		window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
		window.showAtLocation(parent, android.view.Gravity.TOP | android.view.Gravity.LEFT, 0, 0);
	});
	
	var size = startSize;
	var sizescale = screensize[0] / 1024;
	var tick = 0;
	var thread = Threading.initThread("bigText" + BIG_TEXT_THREAD_ID++, function(){
		while(size > 0){
			UI.run(function(){
				tick++;
				if (tick % 4 > 1){
					view.setTextColor(android.graphics.Color.argb(Math.min(255, tick * 8), rgb.r, rgb.g, rgb.b));
				}
				else{
					view.setTextColor(android.graphics.Color.argb(Math.min(255, tick * 8), 0, 0, 0));
				}
				view.setText(text);
				view.setTextSize(parseInt(size + 50) * sizescale);
				size -= (startSize - size) / startSize * 10 + 0.1;
			});
			java.lang.Thread.sleep(20);
		}
		UI.run(function(){
			view.setTextColor(android.graphics.Color.argb(Math.min(255, tick * 8), rgb.r, rgb.g, rgb.b));
		});
		java.lang.Thread.sleep(textTime || 1800);
		UI.run(function(){
			window.dismiss();
		});
	}, -5, true);
}
