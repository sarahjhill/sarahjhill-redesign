/*----------------------------------------------

[Hero dragon]

A dot dragon for the hero, drawn in the same manner as the contact
globe: no libraries, no image files, and the whole shape packed into
a base64 string rather than a picture.

The silhouette is 1816 points sampled on a 7px grid and stored one
byte per axis — about 3KB for the entire dragon. It breathes, blinks,
and throws a stream of flame particles left across the empty half of
the hero, which is where the headline is not.

Everything stops when the hero scrolls out of view or the tab is
hidden, and prefers-reduced-motion gets a single still frame.

----------------------------------------------*/

(function () {
	'use strict';

	var DOTS = 'nCiYKpoqnCqVLJgsmiycLFkvky+VL5gvmi+cL8IvVjGRMZMxlTGYMZoxvTG/McIxVDNWM44zkTOTM5UzmDOaM7gzuzO9M78zUjZUNo42kTaTNpU2mDaaNrY2uDa7Nr02vzZEOEY4SDhLOE04TzhSOIw4jjiROJM4lTiYOJo4tDi2OLg4uzi9OL84LzoxOjM6Njo4Ojo6PTo/OkE6RDpGOkg6SzpNOk86UjqKOow6jjqROpM6lTqYOpo6sTq0OrY6uDq7Or06Iz0lPSg9Kj0sPS89MT0zPTY9OD06PT09Pz1BPUQ9Rj1IPUs9TT1PPYc9ij2MPY49kT2TPZU9mD2aPa89sT20PbY9uD27Pb09Gj8cPx4/IT8jPyU/KD8qPyw/Lz8xPzM/Nj84Pzo/PT8/P0E/RD9GP0g/Sz9NP08/hT+HP4o/jD+OP5E/kz+VP5g/mj+tP68/sT+0P7Y/uD+7P70/DkEQQRNBFUEXQRpBHEEeQSFBI0ElQShBKkEsQS9BMUEzQTZBOEE6QT1BP0FBQURBRkFIQUtBTUFPQYVBh0GKQYxBjkGRQZNBlUGYQZpBqkGtQa9BsUG0QbZBuEG7Qb1BE0QVRBdEGkQcRB5EIUQjRCVEKEQqRCxEL0QxRDNENkQ4RDpEPUQ/REFERERGREhES0RNRE9Eg0SFRIdEikSMRI5EkUSTRJVEmESaRKhEqkStRK9EsUS0RLZEuES7RBpGHEYeRiFGI0YlRihGKkYsRi9GMUYzRjZGOEY6Rj1GP0ZBRkRGRkZIRktGTUZPRoNGhUaHRopGjEaORpFGk0aVRphGmkamRqhGqkatRq9GsUa0RrZGuEa7Rh5IIUgjSCVIKEgqSCxIL0gxSDNINkg4SDpIPUg/SEFIREhGSEhIS0hNSE9IUkiASINIhUiHSIpIjEiOSJFIk0iVSJhImkicSKNIpkioSKpIrUivSLFItEi2SLhIu0glSyhLKkssSy9LMUszSzZLOEs6Sz1LP0tBS0RLRktIS0tLTUtPS1JLVEtWS1lLgEuDS4VLh0uKS4xLjkuRS5NLlUuYS5pLnEuhS6NLpkuoS6pLrUuvS7FLtEu2S7hLu0sxTTNNNk04TTpNPU0/TUFNRE1GTUhNS01NTU9NUk1UTVZNWU1bTX5NgE2DTYVNh02KTYxNjk2RTZNNlU2YTZpNnE2hTaNNpk2oTapNrU2vTbFNtE22TbhNu006Tz1PP09BT0RPRk9IT0tPTU9PT1JPVE9WT1lPW09dT2BPfk+AT4NPhU+HT4pPjE+OT5FPk0+VT5hPmk+cT59PoU+jT6ZPqE+qT61Pr0+xT7RPtk+4T7tPFVIXUhpSHFIeUiFST1JSUlRSVlJZUltSXVJgUmJSfFJ+UoBSg1KFUodSilKMUo5SkVKTUpVSmFKaUpxSn1KhUqNSplKoUqpSrVKvUrFStFK2UrhSu1IXVBpUHFQeVCFUI1QlVChUKlQsVC9UUlRUVFZUWVRbVF1UYFRiVGRUfFR+VIBUg1SFVIdUilSMVI5UkVSTVJVUmFSaVJxUn1ShVKNUplSoVKpUrVSvVLFUtFS2VLhUu1QaVhxWHlYhViNWJVYoVipWLFYvVjFWM1Y2VjhWOlY9Vj9WQVZEVkZWSFZUVlZWWVZbVl1WYFZiVmRWZ1Z5VnxWflaAVoNWhVaHVopWjFaOVpFWk1aVVphWmlacVp9WoVajVqZWqFaqVq1Wr1axVrRWtla4VrtWHFkeWSFZI1klWShZKlksWS9ZMVkzWTZZOFk6WT1ZP1lBWURZRllIWVZZWVlbWV1ZYFliWWRZZ1lpWXlZfFl+WYBZg1mFWYdZilmMWY5ZkVmTWZVZmFmaWZxZn1mhWaNZplmoWapZrVmvWbFZtFm2WbhZu1keWyFbI1slWyhbKlssWy9bMVszWzZbOFs6Wz1bP1tBW0RbRltWW1lbW1tdW2BbYltkW2dbaVtrW3BbeVt8W35bgFuDW4Vbh1uKW4xbjluRW5NblVuYW5pbnFufW6Fbo1umW6hbqlutW69bsVu0W7ZbuFslXShdKl0sXS9dMV0zXTZdOF06XT1dP11BXURdRl1ZXVtdXV1gXWJdZF1nXWlda11uXXBdd115XXxdfl2AXYNdhV2HXYpdjF2OXZFdk12VXZhdml2cXZ9doV2jXaZdqF2qXa1dr12xXS9gMWAzYDZgOGA6YD1gP2BBYFlgW2BdYGBgYmBkYGdgaWBrYG5gcGB3YHlgfGB+YIBgg2CFYIdgimCMYI5gkWCTYJVgmGCaYJxgn2ChYKNgpmCoYKpgW2JdYmBiYmJkYmdiaWJrYm5icGJyYnVid2J5YnxifmKAYoNihWKHYopijGKOYpFik2KVYphimmKcYp9ioWKjYltkXWRgZGJkZGRnZGlka2RuZHBkcmR1ZHdkeWR8ZH5kgGSDZIVkh2SKZIxkjmSRZJNklWSYZJpknGSfZF1nYGdiZ2RnZ2dpZ2tnbmdwZ3JndWd3Z3lnfGd+Z4Bng2eFZ4dnimeMZ45nkWeTZ5VnmGeaZ5xnn2ehZ6NnpmddaWBpYmlkaWdpaWlraW5pcGlyaXVpd2l5aXxpfmmAaYNphWmHaYppjGmOaZFpk2mVaZhpmmmcaZ9poWmjaaZpqGmqaclpXWtga2JrZGtna2lra2tua3Brcmt1a3dreWt8a35rgGuDa4Vrh2uKa4xrjmuRa5NrlWuYa5prnGufa6Fro2uma6hrqmuta8RrxmvJa11uYG5ibmRuZ25pbmtubm5wbnJudW53bnlufG5+boBug26Fboduim6Mbo5ukW6TbpVumG6abpxun26hbqNupm6obqpurW6vbrFuwm7EbsZuyW5gcGJwZHBncGlwa3BucHBwcnB1cHdweXB8cH5wgHCDcIVwh3CKcIxwjnCRcJNwlXCYcJpwnHCfcKFwo3CmcKhwqnCtcK9wsXC9cL9wwnDEcMZwyXBgcmJyZHJncmlya3JucnBycnJ1cndyeXJ8cn5ygHKDcoVyh3KKcoxyjnKRcpNylXKYcppynHKfcqFyo3KmcqhyqnKtcq9ysXK0csRyxnLJcmB1YnVkdWd1aXVrdW51cHVydXV1d3V5dXx1fnWAdYN1hXWHdYp1jHWOdZF1k3WVdZh1mnWcdZ91oXWjdaZ1qHWqda11r3WxdbR1tnXJdWB3Yndkd2d3aXdrd253cHdyd3V3d3d5d3x3fneAd4N3hXeHd4p3jHeOd5F3k3eVd5h3mnecd593oXejd6Z3qHeqd613r3exd7R3tne/d8J3xHddeWB5YnlkeWd5aXlreW55cHlyeXV5d3l5eXx5fnmAeYN5hXmHeYp5jHmOeZF5k3mVeZh5mnmceZ95oXmjeaZ5qHmqea15r3mxebR5tnm4ebt5vXm/ecJ5xHnGecl5y3nNedB5XXxgfGJ8ZHxnfGl8a3xufHB8cnx1fHd8eXx8fH58gHyDfIV8h3yKfIx8jnyRfJN8lXyYfJp8nHyffKF8o3ymfKh8qnytfK98sXy0fLZ8uHy7fL18v3zCfMR8xnzJfMt8zXzQfNJ81HxdfmB+Yn5kfmd+aX5rfm5+cH5yfnV+d355fnx+fn6AfoN+hX6Hfop+jH6OfpF+k36Vfph+mn6cfp9+oX6jfqZ+qH6qfq1+r36xfrR+tn64frt+vX6/fsJ+xH7Gfsl+y37NftB+0n7Uftd+2X5ggGKAZIBngGmAa4BugHCAcoB1gHeAeYB8gH6AgICDgIWAh4CKgIyAjoCRgJOAlYCYgJqAnICfgKGAo4CmgKiAqoCtgK+AsYC0gLaAuIC7gL2Av4DCgMSAxoDJgMuAzYDQgNKA1IDXgNmA24Big2SDZ4Npg2uDboNwg3KDdYN3g3mDfIN+g4CDg4OFg4eDioOMg46DkYOTg5WDmIOag5yDn4Ohg6ODpoOog6qDrYOvg7GDtIO2g7iDu4O9g7+DwoPEg8aDyYPLg82D0IPSg9SD14PZg9uD3oNkhWeFaYVrhW6FcIVyhXWFd4V5hXyFfoWAhYOFhYWHhYqFjIWOhZGFk4WVhZiFmoWchZ+FoYWjhaaFqIWqha2Fr4WxhbSFyYXLhc2F0IXShdSF14XZhduF3oXghWKHZIdnh2mHa4duh3CHcod1h3eHeYd8h36HgIeDh4WHh4eKh4yHjoeRh5OHlYeYh5qHnIefh6GHo4emh6iHqoeth6+HsYe0h9CH0ofUh9eH2Yfbh96H4Ifih2CKYopkimeKaYprim6KcIpyinWKd4p5inyKfoqAioOKhYqHioqKjIqOipGKk4qVipiKmoqcip+KoYqjiqaKqIqqiq2Kr4qxitSK14rZituK3orgiuKK5YpdjGCMYoxkjGeMaYxujHCMcox1jHeMeYx8jH6MgIyDjIWMh4yKjIyMjoyRjJOMlYyYjJqMnIyfjKGMo4ymjKiMqoytjNmM24zejOCM4ozljOeMXY5gjmKOZI5njmmOdY53jnmOfI5+joCOg46FjoeOio6Mjo6OkY6TjpWOmI6ajpyOn46hjqOOpo7bjt6O4I7ijuWO545bkV2RYJFikWSRZ5GAkYORhZGHkYqRjJGOkZGRk5GVkZiRmpGckZ+RoZHekeCR4pHlkeeR6ZFZk1uTXZNgk2KTZJOak5yTn5Ohk+CT4pPlk+eT6ZNWlVmVW5VdlWCVYpVklZqVnJWflaGV4pXlleeV6ZVWmFmYW5hdmGCYYpiamJyYn5ihmKOY4pjlmOeY6ZjsmPWYVJpWmlmaW5pdmmCampqcmp+aoZqjmuWa55rpmuya7prwmvOa9ZpUnFacWZxbnF2cmJyanJycn5yhnKOc5ZznnOmc7JzunPCc85w=';

	var canvas = document.querySelector('.sjh-dragon-canvas');
	if (!canvas || !canvas.getContext) { return; }
	var ctx = canvas.getContext('2d');
	if (!ctx) { return; }

	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ---- unpack ---------------------------------------------------- */
	var pts = [];
	(function () {
		var bin = atob(DOTS), i, x, y, minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
		for (i = 0; i < bin.length; i += 2) {
			x = bin.charCodeAt(i);
			y = bin.charCodeAt(i + 1);
			pts.push({ x: x, y: y });
			if (x < minX) { minX = x; } if (x > maxX) { maxX = x; }
			if (y < minY) { minY = y; } if (y > maxY) { maxY = y; }
		}
		var w = maxX - minX, h = maxY - minY;
		for (i = 0; i < pts.length; i++) {
			pts[i].nx = (pts[i].x - minX) / w;   /* 0 = snout, 1 = back  */
			pts[i].ny = (pts[i].y - minY) / h;   /* 0 = horns, 1 = chest */
		}
	}());

	/* the mouth sits at the left-most edge, a little below the middle */
	var MOUTH = { nx: 0.03, ny: 0.24 };

	/* ---- sizing ---------------------------------------------------- */
	var W = 0, H = 0, dpr = 1, S = 1, ox = 0, oy = 0;

	function resize() {
		var box = canvas.parentNode.getBoundingClientRect();
		if (!box.width) { return; }
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		W = Math.round(box.width);
		H = Math.round(box.height);
		canvas.width = W * dpr;
		canvas.height = H * dpr;
		canvas.style.width = W + 'px';
		canvas.style.height = H + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		/* fit the whole drawing (S wide, S*0.74 tall) inside the box,
		   anchored bottom-right, with a little breathing room */
		S = Math.min(W * 0.98, (H * 0.96) / 0.74);
		ox = W - S;
		oy = H - S * 0.74;
	}

	function px(p) { return ox + p.nx * S; }
	function py(p) { return oy + p.ny * S * 0.74; }

	/* ---- flame particles ------------------------------------------- */
	var flames = [];
	function spawn() {
		var mx = ox + MOUTH.nx * S, my = oy + MOUTH.ny * S * 0.74;
		flames.push({
			x: mx, y: my + (Math.random() - 0.5) * S * 0.06,
			vx: -(0.9 + Math.random() * 1.9),
			vy: (Math.random() - 0.62) * 0.42,
			r: S * (0.010 + Math.random() * 0.020),
			life: 0,
			max: 90 + Math.random() * 80
		});
	}

	/* ---- drawing --------------------------------------------------- */
	var t = 0;

	function draw() {
		ctx.clearRect(0, 0, W, H);

		/* the breath, behind the body */
		var i, f, k;
		for (i = flames.length - 1; i >= 0; i--) {
			f = flames[i];
			k = f.life / f.max;
			var a = k < 0.14 ? k / 0.14 : (1 - k) * 0.85;
			var g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * (1 + k * 2.4));
			g.addColorStop(0, 'rgba(255,225,150,' + (a * 0.85) + ')');
			g.addColorStop(0.45, 'rgba(255,140,32,' + (a * 0.55) + ')');
			g.addColorStop(1, 'rgba(255,59,31,0)');
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(f.x, f.y, f.r * (1 + k * 2.4), 0, 6.2832);
			ctx.fill();
		}

		/* the body: dots, hotter toward the snout */
		var bob = reduce ? 0 : Math.sin(t / 46) * (S * 0.012);
		var tilt = reduce ? 0 : Math.sin(t / 46) * 0.012;

		for (i = 0; i < pts.length; i++) {
			var p = pts[i];
			var x = px(p), y = py(p) + bob;
			/* rotate very slightly around the shoulder */
			var cxp = ox + S * 0.8, cyp = oy + S * 0.55;
			var dx = x - cxp, dy = y - cyp;
			var xr = cxp + dx * Math.cos(tilt) - dy * Math.sin(tilt);
			var yr = cyp + dx * Math.sin(tilt) + dy * Math.cos(tilt);

			var dxh = p.nx - 0.05, dyh = p.ny - 0.24;
			var heat = 1 - Math.min(Math.sqrt(dxh * dxh + dyh * dyh) * 1.15, 1);  /* head is hottest */
			var flick = reduce ? 0 : Math.sin(t / 15 + p.nx * 9 + p.ny * 5) * 0.10;
			var alpha = 0.30 + heat * 0.52 + flick;
			if (alpha < 0.06) { alpha = 0.06; }

			var r = Math.round(255);
			var gch = Math.round(40 + heat * 120);
			var bch = Math.round(24 + heat * 30);
			ctx.fillStyle = 'rgba(' + r + ',' + gch + ',' + bch + ',' + alpha.toFixed(3) + ')';
			ctx.beginPath();
			ctx.arc(xr, yr, S * (0.0042 + heat * 0.0030), 0, 6.2832);
			ctx.fill();
		}

		/* the eye */
		var ex = ox + 0.30 * S, ey = oy + 0.22 * S * 0.74 + bob;
		var blink = reduce ? 1 : (Math.sin(t / 70) > 0.985 ? 0.15 : 1);
		var eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, S * 0.055);
		eg.addColorStop(0, 'rgba(255,200,80,' + (0.95 * blink) + ')');
		eg.addColorStop(1, 'rgba(255,176,32,0)');
		ctx.fillStyle = eg;
		ctx.beginPath();
		ctx.arc(ex, ey, S * 0.055, 0, 6.2832);
		ctx.fill();
		ctx.fillStyle = 'rgba(255,214,120,' + blink + ')';
		ctx.beginPath();
		ctx.arc(ex, ey, S * 0.011, 0, 6.2832);
		ctx.fill();
	}

	/* ---- loop ------------------------------------------------------ */
	var running = false, raf = 0;

	function step() {
		t++;
		if (!reduce) {
			if (t % 2 === 0) { spawn(); }
			for (var i = flames.length - 1; i >= 0; i--) {
				var f = flames[i];
				f.x += f.vx; f.y += f.vy; f.vy -= 0.010; f.life++;
				if (f.life > f.max || f.x < -S * 0.4) { flames.splice(i, 1); }
			}
		}
		draw();
		raf = requestAnimationFrame(step);
	}

	function start() { if (!running) { running = true; raf = requestAnimationFrame(step); } }
	function stop()  { if (running)  { running = false; cancelAnimationFrame(raf); } }

	resize();
	if (reduce) {
		for (var n = 0; n < 40; n++) { spawn(); }
		for (var m = 0; m < 60; m++) {
			for (var j = 0; j < flames.length; j++) {
				flames[j].x += flames[j].vx; flames[j].y += flames[j].vy; flames[j].life++;
			}
		}
		draw();
	} else {
		start();
	}

	window.addEventListener('resize', function () { resize(); draw(); });

	document.addEventListener('visibilitychange', function () {
		if (document.hidden) { stop(); } else if (!reduce) { start(); }
	});

	if ('IntersectionObserver' in window) {
		new IntersectionObserver(function (es) {
			es.forEach(function (e) {
				if (e.isIntersecting) { if (!reduce) { start(); } }
				else { stop(); }
			});
		}, { threshold: 0.02 }).observe(canvas.parentNode);
	}
}());
