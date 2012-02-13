//function Vector(x, y) {
//    this.x = x;
//    this.y = y;
//}
//Vector.prototype = {
//    rotate: function (theta) {
//        var x = this.x;
//        var y = this.y;
//        this.x = Math.cos(theta) * x - Math.sin(theta) * y;
//        this.y = Math.sin(theta) * x + Math.cos(theta) * y;
//        return this;
//    },
//    mult: function (f) {
//        this.x *= f;
//        this.y *= f;
//        return this;
//    },
//    clone: function () {
//        return new Vector(this.x, this.y);
//    },
//    length: function () {
//        return Math.sqrt(this.x * this.x + this.y * this.y);
//    },
//    subtract: function (v) {
//        this.x -= v.x;
//        this.y -= v.y;
//        return this;
//    },
//    set: function (x, y) {
//        this.x = x;
//        this.y = y;
//        return this;
//    }
//};
//
//function Petal(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
//    this.stretchA = stretchA;
//    this.stretchB = stretchB;
//    this.startAngle = startAngle;
//    this.angle = angle;
//    this.bloom = bloom;
//    this.growFactor = growFactor;
//    this.r = 1;
//    this.isfinished = false;
//    //this.tanAngleA = Garden.random(-Garden.degrad(Garden.options.tanAngle), Garden.degrad(Garden.options.tanAngle));
//    //this.tanAngleB = Garden.random(-Garden.degrad(Garden.options.tanAngle), Garden.degrad(Garden.options.tanAngle));
//}
//Petal.prototype = {
//    draw: function () {
//        var ctx = this.bloom.garden.ctx;
//        var v1, v2, v3, v4;
//        v1 = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
//        v2 = v1.clone().rotate(Garden.degrad(this.angle));
//        v3 = v1.clone().mult(this.stretchA); //.rotate(this.tanAngleA);
//        v4 = v2.clone().mult(this.stretchB); //.rotate(this.tanAngleB);
//        ctx.strokeStyle = this.bloom.c;
//        ctx.beginPath();
//        ctx.moveTo(v1.x, v1.y);
//        ctx.bezierCurveTo(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
//        ctx.stroke();
//    },
//    render: function () {
//        if (this.r <= this.bloom.r) {
//            this.r += this.growFactor; // / 10;
//            this.draw();
//        } else {
//            this.isfinished = true;
//        }
//    }
//}
//
//function Bloom(p, r, c, pc, garden) {
//    this.p = p;
//    this.r = r;
//    this.c = c;
//    this.pc = pc;
//    this.petals = [];
//    this.garden = garden;
//    this.init();
//    this.garden.addBloom(this);
//}
//Bloom.prototype = {
//    draw: function () {
//        var p, isfinished = true;
//        this.garden.ctx.save();
//        this.garden.ctx.translate(this.p.x, this.p.y);
//        for (var i = 0; i < this.petals.length; i++) {
//            p = this.petals[i];
//            p.render();
//            isfinished *= p.isfinished;
//        }
//        this.garden.ctx.restore();
//        if (isfinished) {
//            this.garden.removeBloom(this);
//        }
//    },
//    init: function () {
//        var angle = 360 / this.pc;
//        var startAngle = Garden.randomInt(0, 90);
//        for (var i = 0; i < this.pc; i++) {
//            this.petals.push(new Petal(Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), startAngle + i * angle, angle, Garden.random(Garden.options.growFactor.min, Garden.options.growFactor.max), this));
//        }
//    }
//}
//
//function Garden(ctx, element) {
//    this.blooms = [];
//    this.element = element;
//    this.ctx = ctx;
//}
//Garden.prototype = {
//    render: function () {
//        for (var i = 0; i < this.blooms.length; i++) {
//            this.blooms[i].draw();
//        }
//    },
//    addBloom: function (b) {
//        this.blooms.push(b);
//    },
//    removeBloom: function (b) {
//        var bloom;
//        for (var i = 0; i < this.blooms.length; i++) {
//            bloom = this.blooms[i];
//            if (bloom === b) {
//                this.blooms.splice(i, 1);
//                return this;
//            }
//        }
//    },
//    createRandomBloom: function (x, y) {
//        this.createBloom(x, y, Garden.randomInt(Garden.options.bloomRadius.min, Garden.options.bloomRadius.max), Garden.randomrgba(Garden.options.color.min, Garden.options.color.max, Garden.options.color.opacity), Garden.randomInt(Garden.options.petalCount.min, Garden.options.petalCount.max));
//    },
//    createBloom: function (x, y, r, c, pc) {
//        new Bloom(new Vector(x, y), r, c, pc, this);
//    },
//    clear: function () {
//        this.blooms = [];
//        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
//    }
//}
//
//Garden.options = {
//    petalCount: {
//        min: 8,
//        max: 15
//    },
//    petalStretch: {
//        min: 0.1,
//        max: 3
//    },
//    growFactor: {
//        min: 0.1,
//        max: 1
//    },
//    bloomRadius: {
//        min: 8,
//        max: 10
//    },
//    density: 10,
//    growSpeed: 1000 / 60,
//    color: {
//        rmin:128,
//        rmax:255,
//        gmin:0,
//        gmax:128,
//        bmin:0,
//        bmax:128,
//        opacity:0.1
//    },
//    tanAngle: 60
//};
//
//Garden.random = function (min, max) {
//    return Math.random() * (max - min) + min;
//};
//Garden.randomInt = function (min, max) {
//    return Math.floor(Math.random() * (max - min + 1)) + min;
//};
//Garden.circle = 2 * Math.PI;
//Garden.degrad = function (angle) {
//    return Garden.circle / 360 * angle;
//};
//Garden.raddeg = function (angle) {
//    return angle / Garden.circle * 360;
//};
//Garden.rgba = function (r, g, b, a) {
//    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
//};
//Garden.randomrgba = function (min, max, a) {
//    return Garden.rgba(Math.round(Garden.random(min, max)), Math.round(Garden.random(min, max)), Math.round(Garden.random(min, max)), a);
//};
//
//Garden.randomrgba = function(i, n, h, m, l, d, k) {
//    var c = Math.round(Garden.random(i, n));
//    var f = Math.round(Garden.random(h, m));
//    var j = Math.round(Garden.random(l, d));
//var e = 5;
//if (Math.abs(c - f) <= e && Math.abs(f - j) <= e && Math.abs(j - c) <= e) {
//    return Garden.rgba(i, n, h, m, l, d, k)
//} else {
//    return Garden.rgba(c, f, j, k)
//}
//};
////Garden.previewColor = "rgba(127,127,127,0.4)";

function Vector(a, b) {
    this.x = a;
    this.y = b
}
Vector.prototype = {rotate:function (b) {
    var a = this.x;
    var c = this.y;
    this.x = Math.cos(b) * a - Math.sin(b) * c;
    this.y = Math.sin(b) * a + Math.cos(b) * c;
    return this
}, mult:function (a) {
    this.x *= a;
    this.y *= a;
    return this
}, clone:function () {
    return new Vector(this.x, this.y)
}, length:function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
}, subtract:function (a) {
    this.x -= a.x;
    this.y -= a.y;
    return this
}, set:function (a, b) {
    this.x = a;
    this.y = b;
    return this
}};
function Petal(a, f, b, e, c, d) {
    this.stretchA = a;
    this.stretchB = f;
    this.startAngle = b;
    this.angle = e;
    this.bloom = d;
    this.growFactor = c;
    this.r = 1;
    this.isfinished = false
}
Petal.prototype = {draw:function () {
    var a = this.bloom.garden.ctx;
    var e, d, c, b;
    e = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
    d = e.clone().rotate(Garden.degrad(this.angle));
    c = e.clone().mult(this.stretchA);
    b = d.clone().mult(this.stretchB);
    a.strokeStyle = this.bloom.c;
    a.beginPath();
    a.moveTo(e.x, e.y);
    a.bezierCurveTo(c.x, c.y, b.x, b.y, d.x, d.y);
    a.stroke()
}, render:function () {
    if (this.r <= this.bloom.r) {
        this.r += this.growFactor;
        this.draw()
    } else {
        this.isfinished = true
    }
}};
function Bloom(e, d, f, a, b) {
    this.p = e;
    this.r = d;
    this.c = f;
    this.pc = a;
    this.petals = [];
    this.garden = b;
    this.init();
    this.garden.addBloom(this)
}
Bloom.prototype = {draw:function () {
    var c, b = true;
    this.garden.ctx.save();
    this.garden.ctx.translate(this.p.x, this.p.y);
    for (var a = 0; a < this.petals.length; a++) {
        c = this.petals[a];
        c.render();
        b *= c.isfinished
    }
    this.garden.ctx.restore();
    if (b == true) {
        this.garden.removeBloom(this)
    }
}, init:function () {
    var c = 360 / this.pc;
    var b = Garden.randomInt(0, 90);
    for (var a = 0; a < this.pc; a++) {
        this.petals.push(new Petal(Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), b + a * c, c, Garden.random(Garden.options.growFactor.min, Garden.options.growFactor.max), this))
    }
}};
function Garden(a, b) {
    this.blooms = [];
    this.element = b;
    this.ctx = a
}
Garden.prototype = {render:function () {
    for (var a = 0; a < this.blooms.length; a++) {
        this.blooms[a].draw()
    }
}, addBloom:function (a) {
    this.blooms.push(a)
}, removeBloom:function (a) {
    var d;
    for (var c = 0; c < this.blooms.length; c++) {
        d = this.blooms[c];
        if (d === a) {
            this.blooms.splice(c, 1);
            return this
        }
    }
}, createRandomBloom:function (a, b) {
    this.createBloom(a, b, Garden.randomInt(Garden.options.bloomRadius.min, Garden.options.bloomRadius.max), Garden.randomrgba(Garden.options.color.rmin, Garden.options.color.rmax, Garden.options.color.gmin, Garden.options.color.gmax, Garden.options.color.bmin, Garden.options.color.bmax, Garden.options.color.opacity), Garden.randomInt(Garden.options.petalCount.min, Garden.options.petalCount.max))
}, createBloom:function (a, f, d, e, b) {
    new Bloom(new Vector(a, f), d, e, b, this)
}, clear:function () {
    this.blooms = [];
    this.ctx.clearRect(0, 0, this.element.width, this.element.height)
}};
Garden.options = {petalCount:{min:8, max:15}, petalStretch:{min:0.1, max:3}, growFactor:{min:0.1, max:1}, bloomRadius:{min:8, max:10}, density:10, growSpeed:1000 / 60, color:{rmin:128, rmax:255, gmin:0, gmax:128, bmin:0, bmax:128, opacity:0.1}, tanAngle:60};
Garden.random = function (b, a) {
    return Math.random() * (a - b) + b
};
Garden.randomInt = function (b, a) {
    return Math.floor(Math.random() * (a - b + 1)) + b
};
Garden.circle = 2 * Math.PI;
Garden.degrad = function (a) {
    return Garden.circle / 360 * a
};
Garden.raddeg = function (a) {
    return a / Garden.circle * 360
};
Garden.rgba = function (f, e, c, d) {
    return "rgba(" + f + "," + e + "," + c + "," + d + ")"
};
Garden.randomrgba = function (i, n, h, m, l, d, k) {
    var c = Math.round(Garden.random(i, n));
    var f = Math.round(Garden.random(h, m));
    var j = Math.round(Garden.random(l, d));
    var e = 5;
    if (Math.abs(c - f) <= e && Math.abs(f - j) <= e && Math.abs(j - c) <= e) {
        return Garden.rgba(i, n, h, m, l, d, k)
    } else {
        return Garden.rgba(c, f, j, k)
    }
};


$(function() {

    var loveCanvas = $("#loveCanvas")[0];
    loveCanvas.width = $("#loveHeart").width();
    loveCanvas.height = $("#loveHeart").height();
    var loveCtx = loveCanvas.getContext("2d");
    loveCtx.globalCompositeOperation = "lighter";

    var garden = new Garden(loveCtx, loveCanvas);

    setInterval(function () {
        garden.render()
    }, Garden.options.growSpeed);


    var offsetX = $("#loveHeart").width() / 2;
    var offsetY = $("#loveHeart").height() / 2- 50;
    function getHeartPoint(c) {
        var b = c / Math.PI;
        var a = 14.5 * (16 * Math.pow(Math.sin(b), 3));
        var d = -15 * (13 * Math.cos(b) - 5 * Math.cos(2 * b) - 2 * Math.cos(3 * b) - Math.cos(4 * b));
        return [offsetX + a, offsetY + d];
    }

    function startHeartAnimation() {
        var c = 50;
        var d = 10;
        var b = new Array();
        var a = setInterval(function () {
            var h = getHeartPoint(d);
            var e = true;
            for (var f = 0; f < b.length; f++) {
                var g = b[f];
                var j = Math.sqrt(Math.pow(g[0] - h[0], 2) + Math.pow(g[1] - h[1], 2));
                if (j < Garden.options.bloomRadius.max * 1.3) {
                    e = false;
                    break
                }
            }
            if (e) {
                b.push(h);
                garden.createRandomBloom(h[0], h[1])
            }
            if (d >= 30) {
                clearInterval(a);
                showMessages();
            } else {
                d += 0.2
            }
        }, c)

    }



    var together = new Date();
    together.setFullYear(2011, 7, 20);
    together.setHours(20);
    together.setMinutes(0);
    together.setSeconds(0);
    together.setMilliseconds(0);

    if (!document.createElement('canvas').getContext) {
        var msg = document.createElement("div");
        msg.id = "errorMsg";
        msg.innerHTML = "Your browser doesn't support HTML5!<br/>Recommend use Chrome 14+/IE 9+/Firefox 7+/Safari 4+";
        document.body.appendChild(msg);
        document.execCommand("stop");

    } else {
        setTimeout(function () {
            startHeartAnimation();
        }, 1);

        timeElapse(together);

        setInterval(function () {
            timeElapse(together);

        }, 500);
    }

});

function adjustWordsPosition() {
    $("#messages").css("position", "absolute");
    $("#messages").css("top", $("#loveCanvas").position().top + 150);
    $("#messages").css("left", $("#loveCanvas").position().left + 60)
}

function showMessages() {
    adjustWordsPosition();
    $("#messages").fadeIn(5000, function() {
        showLoveU()
    })
}

function timeElapse(c) {
    var e = new Date();
    var f = (Date.parse(e) - Date.parse(c)) / 1000;
    var g = Math.floor(f / (3600 * 24));
    f = f % (3600 * 24);
    var b = Math.floor(f / 3600);
    if (b < 10) {
        b = "0" + b
    }
    f = f % 3600;
    var d = Math.floor(f / 60);
    if (d < 10) {
        d = "0" + d
    }
    f = f % 60;
    if (f < 10) {
        f = "0" + f
    }
    var a = '<span class="digit">' + g + '</span> days <span class="digit">' + b + '</span> hours <span class="digit">' + d + '</span> minutes <span class="digit">' + f + "</span> seconds";
    $("#elapseClock").html(a)
}



function showLoveU() {
    $("#loveu").fadeIn(3000);
}


