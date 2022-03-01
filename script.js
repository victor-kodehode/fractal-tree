const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.style.backgroundColor = '#000';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const drawLine = (x0,y0,x1,y1,c,w) => {
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.stroke();
    ctx.closePath();
};

const nextLevel = (xy,delta,ratio) => {
    let xy_new = [];
    for (let j = 0; j < xy.length; j++) {
        xy_new.push({
            x0:xy[j].x1,
            y0:xy[j].y1,
            x1:xy[j].x1 + xy[j].l/ratio * Math.cos(xy[j].a - delta),
            y1:xy[j].y1 + xy[j].l/ratio * Math.sin(xy[j].a - delta),
            a:xy[j].a - delta,
            l:xy[j].l/ratio
        });
        xy_new.push({
            x0:xy[j].x1,
            y0:xy[j].y1,
            x1:xy[j].x1 + xy[j].l/ratio * Math.cos(xy[j].a),
            y1:xy[j].y1 + xy[j].l/ratio * Math.sin(xy[j].a),
            a:xy[j].a,
            l:xy[j].l/ratio
        });
        xy_new.push({
            x0:xy[j].x1,
            y0:xy[j].y1,
            x1:xy[j].x1 + xy[j].l/ratio * Math.cos(xy[j].a + delta),
            y1:xy[j].y1 + xy[j].l/ratio * Math.sin(xy[j].a + delta),
            a:xy[j].a + delta,
            l:xy[j].l/ratio
        });
    }
    return xy_new;
}

const drawTree = (angle,delta,depth,ratio,hue) => {
    let l_ = canvas.height*(ratio-1)/ratio;
    let xy = [
        {
            x0:canvas.width/2,
            y0:canvas.height,
            x1:canvas.width/2 + l_*Math.cos(angle),
            y1:canvas.height + l_*Math.sin(angle),
            a:angle,
            l:l_
        }
    ];
    for (let i = 0; i < depth; i++) {
        for (let j = 0; j < xy.length; j++) {
            let color = `hsl(${hue + 90*i/depth},100%,50%)`;
            drawLine(xy[j].x0, xy[j].y0, xy[j].x1, xy[j].y1, color, 2);
        }
        xy = nextLevel(xy,delta,ratio);
    }
};

const run = async () => {
    let angle = -Math.PI/2;
    let delta = 0;
    let depth = 9;
    let ratio = 2;
    let hue = 0;
    while(true) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTree(angle, delta, depth, ratio, hue);
        delta += Math.PI/1000;
        hue += 2;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
};

run();