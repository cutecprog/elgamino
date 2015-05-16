// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

function init() {
	var width      = 500;
	var height     = 500;
	var observer_x = 109;
	var observer_y = 109;
	var changed    = true;
	var polygons   = [];
	var segments   = [];
        var view       = 0;
        var speed      = 0;
        var view_width = .5;
        
	setup();
	requestAnimFrame(update);

	function setup() {
		polygons.push([[-1,-1],[width+1,-1],[width+1,height+1],[-1,height+1]]);
		polygons.push([[240,240],[260,240],[260,260],[240,260]]);
		polygons.push([[240,260],[260,260],[260,280],[240,280]]);
		polygons.push([[260,240],[280,240],[280,260],[260,260]]);
		polygons.push([[440,240],[460,240],[460,260],[440,260]]);
		polygons.push([[250,100],[260,140],[240,140]]);
		polygons.push([[280,100],[290,60],[270,60]]);
		polygons.push([[310,100],[320,140],[300,140]]);
		polygons.push([[50,450],[60,370],[70,450]]);
		polygons.push([[450,450],[460,370],[470,450]]);
		polygons.push([[50,50],[60,30],[70,50]]);
		polygons.push([[450,50],[460,30],[470,50]]);
		polygons.push([[140,340],[160,240],[180,340],[360,340],[360,360],[250,390],[140,360]]);
		polygons.push([[140,140],[150,130],[150,145],[165,150],[160,160],[140,160]]);
		for (var i = 0; i < 20; ++i) {
			polygons.push([[240,410+i*4],[245,410+i*4],[245,411+i*4],[240,411+i*4]]);
		}
		segments = VisibilityPolygon.convertToSegments(polygons);
		segments.push([[100, 150],[100, 100]]);
		segments.push([[50, 125],[100, 125]]); // intersects
		segments.push([[450, 100],[400, 150]]);
		segments.push([[450, 150],[400, 100]]); // intersects
		segments.push([[50, 250],[100, 250]]);
		segments.push([[50, 250],[100, 250]]); // duplicate
		segments.push([[140,40],[140,60]]);
		segments.push([[140,60],[160,60]]);
		segments.push([[160,60],[160,40]]);
		segments.push([[160,40],[140,40]]);
		segments = VisibilityPolygon.breakIntersections(segments);
	};

	function update() {
		if (changed) {
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, width, height);
			ctx.beginPath();
			ctx.rect(0, 0, width, height);
			ctx.fillStyle = '#00';
			ctx.fill();

			draw(ctx);
			changed = false;
		}
		requestAnimFrame(update);
	};

	function draw(ctx) {
  
		var poly = VisibilityPolygon.compute([observer_x, observer_y], segments);

                for (var i = 1; i < polygons.length; ++i) {
			ctx.beginPath();
			ctx.moveTo(polygons[i][0][0], polygons[i][0][1]);
			for (var j = 1; j < polygons[i].length; ++j) {
				ctx.lineTo(polygons[i][j][0], polygons[i][j][1]);
			}
			ctx.fillStyle = "#111";
			ctx.fill();
		}

		ctx.beginPath();
		ctx.moveTo(poly[0][0], poly[0][1]);
		for (var i = 1; i < poly.length; ++i) {
                        ctx.lineTo(poly[i][0], poly[i][1]);
		}
                var radgrad = ctx.createRadialGradient(
                                observer_x,
                                observer_y,
                                0,
                                observer_x+195*Math.cos(view),
                                observer_y+195*Math.sin(view),200);
                radgrad.addColorStop(0, '#665');
                radgrad.addColorStop(0.4, '#111');
                radgrad.addColorStop(1, '#000');
                ctx.fillStyle = radgrad;
                /*ctx.fillStyle = "#aa8";*/
                ctx.fill();
                ctx.strokeStyle = "#000";
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(observer_x, observer_y, 800, view-view_width, view+view_width, true);
                ctx.lineTo(observer_x, observer_y);
                ctx.fillStyle = "#000";
                ctx.fill();

                /* Draw observer  
		ctx.beginPath();
		ctx.arc(observer_x, observer_y, 400, 0, Math.PI*2, true);
                var radgrad = ctx.createRadialGradient(
                                observer_x-0*Math.cos(view),
                                observer_y-0*Math.sin(view),
                                0,
                                observer_x+100*Math.cos(view),
                                observer_y+100*Math.sin(view),200);
                radgrad.addColorStop(0, '#aa8');
                radgrad.addColorStop(1, '#000');
                ctx.fillStyle = radgrad;
		/*ctx.fillStyle = "#665";
		ctx.fill();*/
	};

        var keycode = {
                'LEFT_ARROW': 37,
                'RIGHT_ARROW': 39,
                'UP_ARROW': 38,
                'DOWN_ARROW': 40,
                'SHIFT': 16
        };

        document.addEventListener('keydown', function(event) {
                if(event.keyCode == keycode.RIGHT_ARROW) {
                        view += 0.05 + speed/8;
                        changed = true;
                } else if(event.keyCode == keycode.LEFT_ARROW) {
                        view -= 0.05 + speed/8;
                        changed = true;
                } else if(event.keyCode == keycode.DOWN_ARROW) {
                        speed -= .25;
                } else if(event.keyCode == keycode.UP_ARROW) {
                        speed += .25;
                } else if(event.keyCode == keycode.SHIFT) {
                        view += Math.PI;
                        changed = true;
                }
        });

        setInterval(function() {
                observer_y += speed * Math.sin(view);
                observer_x += speed * Math.cos(view);
                if(speed != 0.0)
                        changed = true;
        }, 50);

        var left_step = 0;
        setInterval(function() {
                if(speed != 0.0)
                        if(left_step == 1) {
                                view += speed/10;
                                left_step = (left_step+1)%2;
                        } else {
                                view -= speed/10;
                                left_step = (left_step+1)%2;
                        }
        }, 200);

};
