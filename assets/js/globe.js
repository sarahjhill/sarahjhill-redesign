/*----------------------------------------------

[Contact globe]

A dot globe for the "Ready to start at step one?" call to action. Messages
arc in from around the world and land on Cardiff, which is the point of the
section: whatever you send reaches an actual person, in an actual place.

No libraries. The continents are a 2-degree land mask (180x90 cells) packed
one bit per cell and base64'd — about 2KB for the whole world, which is
cheaper than any map image and scales to any size.

Everything stops when the section scrolls out of view or the tab is hidden,
and prefers-reduced-motion gets a single still frame instead of animation.

----------------------------------------------*/

(function () {
	'use strict';

	var LAND = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAfAP8DAAAAAAAAAAAAAAAAAAAAAADo//z//wcAAAAAAAACAAAAAAAAAAAAhvvw//8PAPABAAAAwAMAAAAAAAAAwADkw////wEABAAAAABgAAAAAAAAAADAUT8A/v8PAAAAAAwA/j8AuAEAAAAAcBHtDcD/fwAAAAAwAPz/fwMAABCAAQD5w/wD8P8FAAAMAIL7//////9/AP//////////////B/D/SAAAAAAAQID//////////////x8AKAAEAAAAAAAA8///////////////YCgAAAAAAAAAAADw/////wEs4AEAAHz+////////////gL////8HeAAcAADg5///////////9ADgAf7/f4AnAAAAAH78////////H0QAAAiA//8f8AcAAIBB4////////38ADwAQAOD//5//AQAAHAT/////////A3AAAAAA/v//+T8AAGDz//////////8DAQAAAMD/////AwAAsP//////////LwAAAAAA6P///2IAAAD+//////////8CAAAAAAD///8/CAAA4P//////////JwAAAAAA8P///wYAAAD+/unz/////z8AAAAAAAD///8HAAAA/pgPPP//////MQAAAAAA8P//PwAAAMBD9v7n/////wcBAAAAAAD///8AAAAAPkD7f/7///8hEAAAAAAA4P//DwAAAIDhAv/n////f8YAAAAAAAD8//8AAAAA+AdE//////8jDwAAAAAAgP//AwAAAMD/APD/////PxgAAAAAAADw/x8AAAAA/n/v//////8HAAAAAAAAAPwDAgAAAOD////7////fwAAAAAAAACgHyAAAACA//9/f/7///8DAAAAAAAAAPQBAAAAAPj//+cv+P//PwAAAAAAAAAAHjAAAADA/////g/+//8EAAAAAAAAAOBhCAAAAP7//99/4D//AAAAAAAAAAAAPAMEAADA////+Qf84BcAAAAAAAAAAAA/AAAAAPz//58fgAf+QAAAAAAAAAAAAA8AAADg////ewA4gA8EAAAAAAAAAADAAAAAAPz//38BgAP4QQAAAAAAAAAAAAgPAADA////zwAwgAwQAAAAAAAAAAAA9Q8AAPj///8HAAVIAAAAAAAAAAAAAID/AQAA////fwBAAAAQAAAAAAAAAAAA+P8AAGDh//8DAAA0GAAAAAAAAAAAAID/HwAAAPj/HwAAgMIBAAAAAAAAAAAA/P8BAACA//8AAAAYXgAAAAAAAAAAAMD/fwAAAPz/BwAAAOOBAQAAAAAAAAAA/P8/AACA/z8AAABgbtQBAAAAAAAAAOD//w8AAPD/AwAAAAQIeAAAAAAAAAAA/P//AQAA/z8AAACAA4APAQAAAAAAAID//w8AAPD/AwAAAAARsEAAAAAAAAAA+P9/AAAA/j8AAAAAAAAAAAAAAAAAAAD//wcAAPD/QwAAAACAIwAAAAAAAAAA8P9/AAAA/z8EAAAAAD8GIAAAAAAAAAD8/wMAAPD/cQAAAAD4ZwAAAAAAAAAAgP8/AAAA/w8HAAAAgP8HAAAAAAAAAAD4/wMAAOD/MAAAAAD//wEBAAAAAAAAgP8PAAAA/g8DAAAA+P8fAAAAAAAAAAD4PwAAAOB/EAAAAID//wMAAAAAAAAAgP8DAAAA/AMAAAAA+P9/AAAAAAAAAAD8HwAAAMA/AAAAAID//wcAAAAAAAAAwP8BAAAA+AEAAAAA8P9/AAAAAAAAAAD8DwAAAIAPAAAAAAAP/gMAAAAAAAAAwB8AAAAAAAAAAAAAEIAfAAEAAAAAAAD+AwAAAAAAAAAAAAAA8AEgAAAAAAAA4AcAAAAAAAAAAAAAAAAAAAYAAAAAAABeAAAAAAAAAAAAAAAAwAAwAAAAAAAAwAMAAAAAAAAAAAAAAAAIgAEAAAAAAAAeAAAAAAAAAAAAAAAAAAAMAAAAAAAA4AEAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAABAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAB4AEDwn/8HAAAAAAAAAAAwAAAAAACA/P/h/////w8AAAAAAAAAwAcAAAD4////z///////PwAAAAAAHALwAACA//////////////8HAADw/y///wMAAP7/////////////HwAA+P///38AAID///////////////8AAPL/////BwAO////////////////DwAA8P////8HEPD//////////////z8AAOD/////////////////////////HwDgPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
	var COLS = 180, ROWS = 90;

	var CARDIFF = { lat: 51.48, lon: -3.18 };

	/* Where the messages come from. Real places, loosely spread, so the
	   arcs never all sweep in from the same side. */
	var ORIGINS = [
		{ lat: 40.71, lon: -74.01 }, { lat: -33.87, lon: 151.21 },
		{ lat: 35.68, lon: 139.69 }, { lat: -1.29, lon: 36.82 },
		{ lat: 19.08, lon: 72.88 }, { lat: -23.55, lon: -46.63 },
		{ lat: 55.75, lon: 37.62 }, { lat: 37.77, lon: -122.42 },
		{ lat: 25.20, lon: 55.27 }, { lat: 52.37, lon: 4.90 },
		{ lat: 1.35, lon: 103.82 }, { lat: -34.60, lon: -58.38 },
		{ lat: 6.52, lon: 3.38 }, { lat: 43.65, lon: -79.38 },
		{ lat: -26.20, lon: 28.05 }, { lat: 41.90, lon: 12.50 },
		{ lat: 31.23, lon: 121.47 }, { lat: 59.33, lon: 18.07 }
	];

	var canvas = document.querySelector('.sjh-globe-canvas');
	if (!canvas || !canvas.getContext) { return; }

	var ctx = canvas.getContext('2d');
	var reduced = window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ---- unpack the land mask into evenly spread points ---------------- */
	var dots = [];
	(function unpack() {
		var bin = atob(LAND);
		var bit = function (i) {
			return (bin.charCodeAt(i >> 3) >> (i & 7)) & 1;
		};
		for (var r = 0; r < ROWS; r++) {
			var lat = 89 - r * 2;
			/* Thin the columns towards the poles, or the dots bunch up into a
			   solid cap at the top and bottom. */
			var stride = Math.max(1, Math.round(1 / Math.max(0.08, Math.cos(lat * Math.PI / 180))));
			for (var c = 0; c < COLS; c += stride) {
				if (!bit(r * COLS + c)) { continue; }
				var lon = -179 + c * 2;
				var la = lat * Math.PI / 180, lo = lon * Math.PI / 180;
				var cl = Math.cos(la);
				dots.push(cl * Math.sin(lo), Math.sin(la), cl * Math.cos(lo));
			}
		}
	})();

	function toVec(p) {
		var la = p.lat * Math.PI / 180, lo = p.lon * Math.PI / 180;
		var cl = Math.cos(la);
		return [cl * Math.sin(lo), Math.sin(la), cl * Math.cos(lo)];
	}

	/* Great-circle interpolation, lifted off the surface so the arc bows
	   outwards instead of scraping along the ground. */
	function slerp(a, b, t, lift) {
		var d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
		d = Math.max(-1, Math.min(1, d));
		var o = Math.acos(d), so = Math.sin(o);
		var s1, s2;
		if (so < 1e-6) { s1 = 1 - t; s2 = t; }
		else { s1 = Math.sin((1 - t) * o) / so; s2 = Math.sin(t * o) / so; }
		var k = 1 + lift * Math.sin(Math.PI * t);
		return [(a[0] * s1 + b[0] * s2) * k,
				(a[1] * s1 + b[1] * s2) * k,
				(a[2] * s1 + b[2] * s2) * k];
	}

	var target = toVec(CARDIFF);
	var arcs = ORIGINS.map(function (o, i) {
		return { from: toVec(o), t: 1.2 - (i / ORIGINS.length) * 2.3, speed: 0.11 + (i % 5) * 0.014 };
	});

	/* ---- sizing -------------------------------------------------------- */
	var W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1;

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
		R = Math.min(W, H) * 0.42;
		cx = W / 2;
		cy = H / 2;
	}

	/* ---- drawing ------------------------------------------------------- */
	/* The globe sways rather than spins. A full rotation looks lovely but
	   puts Cardiff — and every arc landing on it — out of sight half the
	   time, which loses the whole point of the picture. */
	var YAW_MID = -0.18, YAW_SWING = 0.42, elapsed = 0;
	var yaw = YAW_MID, TILT = 0.42;

	function rotate(v) {
		var cy_ = Math.cos(yaw), sy = Math.sin(yaw);
		var x = v[0] * cy_ + v[2] * sy;
		var z = -v[0] * sy + v[2] * cy_;
		var ct = Math.cos(TILT), st = Math.sin(TILT);
		return [x, v[1] * ct - z * st, v[1] * st + z * ct];
	}

	function draw() {
		ctx.clearRect(0, 0, W, H);
		if (!R) { return; }

		/* soft halo */
		var glow = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.35);
		glow.addColorStop(0, 'rgba(255,59,31,0.18)');
		glow.addColorStop(1, 'rgba(255,59,31,0)');
		ctx.fillStyle = glow;
		ctx.fillRect(0, 0, W, H);

		/* the sphere itself */
		ctx.beginPath();
		ctx.arc(cx, cy, R, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(246,243,237,0.045)';
		ctx.fill();
		ctx.strokeStyle = 'rgba(246,243,237,0.14)';
		ctx.lineWidth = 1;
		ctx.stroke();

		/* Land dots, bucketed by depth so we do four fills instead of
		   two thousand — the difference is very visible on a phone. */
		var size = Math.max(1.2, R * 0.0125);
		var buckets = [[], [], [], []];
		for (var i = 0; i < dots.length; i += 3) {
			var p = rotate([dots[i], dots[i + 1], dots[i + 2]]);
			if (p[2] <= 0.02) { continue; }
			var b = p[2] > 0.75 ? 3 : p[2] > 0.5 ? 2 : p[2] > 0.25 ? 1 : 0;
			buckets[b].push(cx + p[0] * R, cy - p[1] * R);
		}
		var alphas = [0.26, 0.45, 0.66, 0.9];
		for (var b2 = 0; b2 < 4; b2++) {
			var arr = buckets[b2];
			if (!arr.length) { continue; }
			ctx.fillStyle = 'rgba(255,176,32,' + alphas[b2] + ')';
			ctx.beginPath();
			for (var j = 0; j < arr.length; j += 2) {
				ctx.rect(arr[j] - size / 2, arr[j + 1] - size / 2, size, size);
			}
			ctx.fill();
		}

		/* Arcs. Each one draws the slice of great circle behind its head, so
		   it reads as a message travelling rather than a static line. */
		for (var a = 0; a < arcs.length; a++) {
			var arc = arcs[a];
			var head = arc.t;
			if (head < 0 || head > 1.35) { continue; }
			var tail = Math.max(0, head - 0.42);
			var shown = Math.min(head, 1);
			if (shown <= tail) { continue; }

			var steps = 26;
			ctx.lineWidth = Math.max(1.1, R * 0.008);
			ctx.lineCap = 'round';
			for (var s = 0; s < steps; s++) {
				var t0 = tail + (shown - tail) * (s / steps);
				var t1 = tail + (shown - tail) * ((s + 1) / steps);
				var p0 = rotate(slerp(arc.from, target, t0, 0.32));
				var p1 = rotate(slerp(arc.from, target, t1, 0.32));
				if (p0[2] <= 0 && p1[2] <= 0) { continue; }
				var fade = (s / steps);
				var depth = Math.max(0, Math.min(1, (p1[2] + 0.35) / 1.35));
				ctx.strokeStyle = 'rgba(255,59,31,' + (0.85 * fade * depth) + ')';
				ctx.beginPath();
				ctx.moveTo(cx + p0[0] * R, cy - p0[1] * R);
				ctx.lineTo(cx + p1[0] * R, cy - p1[1] * R);
				ctx.stroke();
			}

			if (head <= 1) {
				var hp = rotate(slerp(arc.from, target, head, 0.32));
				if (hp[2] > 0) {
					ctx.beginPath();
					ctx.arc(cx + hp[0] * R, cy - hp[1] * R, Math.max(1.6, R * 0.013), 0, Math.PI * 2);
					ctx.fillStyle = 'rgba(246,243,237,0.95)';
					ctx.fill();
				}
			}
		}

		/* Cardiff, with a ring that pulses as each message lands. */
		var tp = rotate(target);
		if (tp[2] > 0) {
			var tx = cx + tp[0] * R, ty = cy - tp[1] * R;
			var landed = 0;
			for (var k = 0; k < arcs.length; k++) {
				if (arcs[k].t > 0.94 && arcs[k].t < 1.3) {
					landed = Math.max(landed, 1 - (arcs[k].t - 0.94) / 0.36);
				}
			}
			if (landed > 0) {
				ctx.beginPath();
				ctx.arc(tx, ty, Math.max(3, R * 0.02) + landed * R * 0.09, 0, Math.PI * 2);
				ctx.strokeStyle = 'rgba(255,59,31,' + (0.5 * landed) + ')';
				ctx.lineWidth = 2;
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.arc(tx, ty, Math.max(3, R * 0.022), 0, Math.PI * 2);
			ctx.fillStyle = '#ff3b1f';
			ctx.fill();
			ctx.strokeStyle = 'rgba(246,243,237,0.9)';
			ctx.lineWidth = 1.5;
			ctx.stroke();
		}
	}

	/* ---- loop ---------------------------------------------------------- */
	var running = false, last = 0, raf = 0;

	function frame(now) {
		if (!running) { return; }
		var dt = Math.min(0.05, (now - last) / 1000 || 0);
		last = now;
		elapsed += dt;
		yaw = YAW_MID + YAW_SWING * Math.sin(elapsed * 0.11);
		for (var i = 0; i < arcs.length; i++) {
			arcs[i].t += dt * arcs[i].speed;
			if (arcs[i].t > 1.5) { arcs[i].t = -0.05 - Math.random() * 0.45; }
		}
		draw();
		raf = window.requestAnimationFrame(frame);
	}

	function start() {
		if (running || reduced) { return; }
		running = true;
		last = window.performance ? performance.now() : Date.now();
		raf = window.requestAnimationFrame(frame);
	}

	function stop() {
		running = false;
		if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
	}

	resize();
	draw();

	var resizeTimer;
	window.addEventListener('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () { resize(); draw(); }, 150);
	});

	document.addEventListener('visibilitychange', function () {
		if (document.hidden) { stop(); } else if (onScreen) { start(); }
	});

	/* Only spend frames while it is actually on screen. */
	var onScreen = false;
	if ('IntersectionObserver' in window) {
		new IntersectionObserver(function (entries) {
			onScreen = entries[0].isIntersecting;
			if (onScreen && !document.hidden) { start(); } else { stop(); }
		}, { rootMargin: '120px' }).observe(canvas);
	} else {
		onScreen = true;
		start();
	}
})();
