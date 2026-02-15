function complexMult(z1, z2) {
    return [
        z1[0] * z2[0] - z1[1] * z2[1],
        z1[0] * z2[1] + z1[1] * z2[0]
    ]
}

function complexify(x) {
    if (typeof(x) == 'number') return [x, 0];
    return x
}

function sqrt(x) {
    const z1 = x < 0 ? [1, 1] : [1, 0];
    const z2 = [Math.sqrt(Math.abs(x)), 0];
    return complexMult(z1, z2);
}

function nRoot(x, n) {
    if (x < 0 && n % 2 === 1) {
        return [ -Math.pow(Math.abs(x), 1/n), 0 ];
    }
    else {
        const z = Math.pow(Math.abs(x), 1/n);
        if (x < 0) {
            return [ z, z ];
        }
        else {
            return [ z, 0 ];
        }
    }
}

function decimalToFraction(x, maxDenominator = 1000) {
    let bestNumerator = 1;
    let bestDenominator = 1;
    let minError = Math.abs(x - bestNumerator / bestDenominator);

    for (let d = 1; d <= maxDenominator; d++) {
        let n = Math.round(x * d);
        let error = Math.abs(x - n / d);
        if (error < minError) {
            bestNumerator = n;
            bestDenominator = d;
            minError = error;
        }
        if (error === 0) break;
    }
    return [bestNumerator, bestDenominator];
}

function pow(x, p) {
    if (x >= 0) {
        return [Math.pow(x, p), 0];
    } else {
        const r = Math.pow(-x, p);          // Magnitude
        const theta = Math.PI * p;          // Angle
        const real = r * Math.cos(theta);
        const imag = r * Math.sin(theta);
        return [real, imag];
    }
}

export { complexMult, complexify, sqrt, nRoot, decimalToFraction, pow };
