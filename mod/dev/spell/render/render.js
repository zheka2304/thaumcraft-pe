var SpellRenderHelper = {
	renderProjectile: function(projectile, position){
		if (projectile.trajectory){
			var coords1 = projectile.trajectory.realPath[position];
			var coords2 = projectile.trajectory.realPath[position + 1];
			if (coords1 && coords2){
				Particles.line(31, coords1, coords2, .04);
			}
		}
	}
}