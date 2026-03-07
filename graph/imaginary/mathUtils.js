function complexify(x) {
    if (typeof(x) == 'number') return [x, 0];
    return x
}

function cadd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
function csub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
function cmul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
function cdiv(a, b) {
    const d = b[0] * b[0] + b[1] * b[1];
    return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
}

function csqrt(z) {
    const x = z[0], y = z[1];
    const r = Math.hypot(x,y);
    const real = Math.sqrt((r + x) / 2);
    const imag = Math.sign(y) * Math.sqrt((r - x) / 2);
    return [real, imag];
}

function csin(z) {
    const x = z[0], y = z[1];
    return [Math.sin(x) * Math.cosh(y), Math.cos(x) * Math.sinh(y)];
}
function ccos(z) {
    const x=z[0], y=z[1];
    return [Math.cos(x) * Math.cosh(y), -Math.sin(x) * Math.sinh(y)];
}
function ctan(z) { return cdiv(csin(z), ccos(z)); }

function csinh(z) {
    const x=z[0], y=z[1];
    return [Math.sinh(x) * Math.cos(y), Math.cosh(x) * Math.sin(y)];
}
function ccosh(z) {
    const x = z[0], y = z[1];
    return [Math.cosh(x) * Math.cos(y), Math.sinh(x) * Math.sin(y)];
}
function ctanh(z) { return cdiv(csinh(z), ccosh(z)); }

function cexp(z) {
    const x = z[0], y = z[1];
    const ex = Math.exp(x);
    return [ex*Math.cos(y), ex*Math.sin(y)];
}
function clog(z) {
    const x = z[0], y = z[1];
    return [Math.log(Math.hypot(x,y)), Math.atan2(y,x)];
}

function c10log(z) {
    const natural = clog(z);
    const log10 = Math.LOG10E;
    return [natural[0]*log10, natural[1]*log10];
}

function cabs(z) { return [Math.hypot(z[0], z[1]), 0]; }

function cpow(a, b) { return cexp(cmul(b, clog(a))); }
function cnroot(z, n) { return cpow(z, [1/n, 0]); }

export {
    complexify, cadd, csub, cmul, cdiv, csqrt,
    csin, ccos, ctan, csinh, ccosh, ctanh,
    cexp, clog, c10log, cabs, cpow, cnroot
};
