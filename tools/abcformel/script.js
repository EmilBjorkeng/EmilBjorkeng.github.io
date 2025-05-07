const input = document.getElementById('text-box');
const a_input = document.getElementById('a-box');
const b_input = document.getElementById('b-box');
const c_input = document.getElementById('c-box');
const awnser_display = document.getElementById('awnser-display');

function isNumber(string) {
    if (typeof string != "string") return false;
    return !isNaN(string) && !isNaN(parseFloat(string));
}

Number.prototype.decimals_length = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}

input.addEventListener('input', (e) => {
    let input = e.target.value;
    if (input == "") {
        a_input.value = "";
        b_input.value = "";
        c_input.value = "";
        awnser_display.textContent = "";
        return;
    }
    
    // Error checking
    let x2 = (input.match(/x\^2/g) ? input.match(/x\^2/g) : []).length;
    x2 += (input.match(/x²/g) ? input.match(/x²/g) : []).length;
    let x = (input.match(/x/g) ? input.match(/x/g) : []).length - x2;
    let plusminus = (input.match(/[=\+\-]/g) ? input.match(/[=\+\-]/g) : []).length;

    if (x2 != 1 || x != 1 || plusminus < 2 || plusminus > 3) {
        awnser_display.textContent = `Error with input`;
        return;
    }

    // Parsing input
    let elements = input.replace(/\s/g, "");
    
    let error = false;

    // Check for numbers after x
    let list = elements.replace(/\^2/g, "").replace(/²/g, "").split(/[=\+\-]/g);
    list.forEach(element => {
        let split = element.split("x");
        if (split.length > 1) {
            if (split[1] != "") {
                awnser_display.textContent = `Number after x`;
                error = true;
            }
        }
    });
    if (error) return;

    // Remove x
    elements = elements.replace(/x/g, "").replace(/\^2/g, "").replace(/²/g, "");
    // Check for spliters next to each other
    if (elements.match(/[=\+\-][=\+\-]/g)) {
        awnser_display.textContent = `Error with input`;
        return;
    }
    elements = elements.split(/[=\+\-]/g);
    
    let index_start = elements.length - 3;
    a_input.value = elements[index_start+0] ? elements[index_start+0] : "1";
    b_input.value = elements[index_start+1] ? elements[index_start+1] : "1";
    c_input.value = elements[index_start+2] ? elements[index_start+2] : "1";

    let signs = input.match(/[=\+\-]/g);
    if (signs.length == 3)
    {
        // Error
        if (signs[0] == "=" || signs[1] == "=") {
            awnser_display.textContent = `Error with input`;
            return;
        }
        // Negative A
        if (signs[0] == "-") {
            a_input.value = `-${a_input.value}`;
        }
        // Negative B
        if (signs[1] == "-") {
            b_input.value = `-${b_input.value}`;
        }
        // Negative C
        if (signs[2] == "-" || signs[2] == "=") {
            c_input.value = `-${c_input.value}`;
        }
    }
    else {
        // Error
        if (signs[0] == "=") {
            awnser_display.textContent = `Error with input`;
            return;
        }
        // Negative B
        if (signs[0] == "-") {
            b_input.value = `-${b_input.value}`;
        }
        // Negative C
        if (signs[1] == "-" || signs[1] == "=") {
            c_input.value = `-${c_input.value}`;
        }
    }
    abc_calculate();
});

let abc_inputs = [a_input, b_input, c_input];
abc_inputs.forEach(element => {
    element.addEventListener('input', (e) => {
        let a = a_input.value ? a_input.value : 0;
        let b = b_input.value ? b_input.value : 0;
        let c = c_input.value ? c_input.value : 0;

        // Remove unecessary 1
        if (a == 1) a = "";
        else if (a == -1) a = "-";
        if (b == 1) b = "";
        else if (b == -1) b = "-";

        // Remove double negative sign
        if (b > 0) b = `+ ${b}`;
        else if (b < 0) b = `- ${b.slice(1)}`;
        else {
            if (b[0] == "-") {
                b = `- ${b.slice(1)}`;
            }
            else {
                b = `+ ${b}`;
            }
        }
        if (c > 0) c = `+ ${c}`;
        else if (c > 0) c = `- ${c.slice(1)}`;
        else {
            if (c[0] == "-") {
                c = `- ${c.slice(1)}`;
            }
            else {
                c = `+ ${c}`;
            }
        }

        input.value = `${a}x² ${b}x ${c}`;
        abc_calculate();
    }); 
});

function abc_calculate() {
    let abc = [
        a_input.value,
        b_input.value,
        c_input.value
    ];

    let error = false;

    // Division check
    abc.forEach(element => {
        let index = abc.indexOf(element);
        let list = element.split("/");
        if (list.length > 2) {
            awnser_display.textContent = `Error with division`;
            error = true;
        }
        if (list.length == 2) {
            if (isNumber(list[0]) && isNumber(list[1])) {
                abc[index] = `${parseFloat(list[0]) / parseFloat(list[1])}`;
                if (abc[index] == Infinity) {
                    awnser_display.textContent = `Division by 0`;
                    error = true;
                }
            }
            else {
                awnser_display.textContent = `Error with input`;
                error = true;
            }
        }
    });
    if (error) return;

    // Error not number
    abc.forEach(element => {
        if (isNumber(element)) {
            element = parseFloat(element);
        }
        else if (element != "") {
            awnser_display.textContent = `Error with input`;
            error = true;
        }
    });
    if (error) return;

    // Empty input
    if (a_input.value == "" || b_input.value == "" || c_input.value == "") {
        awnser_display.textContent = "";
        return;
    }

    // Error number is 0
    if (abc[0] == 0) {
        awnser_display.textContent = `Input can't be 0`;
        return;
    }

    let a = abc[0];
    let b = abc[1];
    let c = abc[2];

    let root_num = b * b - 4 * a * c;

    // Negative root
    if (root_num < 0) {
        awnser_display.textContent = `No Awnser (negative root)`;
        return;
    }
    // Zero root
    else if (root_num == 0) {
        let awnser = -b / (2 * a);
        awnser_display.innerHTML = `x = ${awnser}`;
        return;
    }
    // Positive roots
    else {
        let decimal_limit = 4;

        let awnser1 = (-b + Math.sqrt(root_num)) / (2 * a);
        let awnser2 = (-b - Math.sqrt(root_num)) / (2 * a);

        let x1 = awnser1;
        if (x1.decimals_length() > decimal_limit) {
            x1 = awnser1.toFixed(decimal_limit);
        }
        let x2 = awnser2;
        if (x2.decimals_length() > decimal_limit) {
            x2 = awnser2.toFixed(decimal_limit);
        }

        let style = "font-size:0.8rem;line-height:0.4rem;display:inline-block;width:fit-content;translate:0 35%;";
        let stylesqrt = "text-decoration-line: overline;width:fit-content;margin:0;";

        // X1
        if (awnser1.decimals_length() > decimal_limit) {
            x1 = `${-b} + <div style="${style}">√<span style="${stylesqrt}">${root_num}</span><hr style="color:white;">${2 * a}</div>`;
        }

        // X2
        if (awnser2.decimals_length() > decimal_limit) {
            x2 = `${-b} - <div style="${style}">√<span style="${stylesqrt}">${root_num}</span><hr style="color:white;">${2 * a}</div>`;
        }

        awnser_display.innerHTML = `x₁ = ${x1}<span></span>x₂ = ${x2}`;
    }
}
abc_calculate();