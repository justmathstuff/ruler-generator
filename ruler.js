const Centimeters = {
    cm: 1,
    mm: 0.1,
    in: 2.54
};
const Units = {
    // [d, [unit of d, ]]
    MM: [0.1, ["cm", "${i/10}", "(cm)", 1], [undefined, 1, 5, 10]],
    CM: [1, ["cm", "${i}", "(cm)", 1], [undefined, undefined, undefined, 1]],
    IN: [1/16, ["in", "${v}", "(in)", 1], [1, 2, 4, 16]],
    PI_MM: [Math.PI, ["mm", "${i/10}", "(π cm)", 1], [undefined, 1, 5, 10]],
    PI_CM: [Math.PI, ["cm", "${i}", "(π cm)", 1], [undefined, undefined, undefined, 1]]
};
let RulerSize = 29.7;//cm

function pointsGen(unit) {
    return Array.from(Array(Math.floor(RulerSize / (Centimeters[unit[1][0]] * unit[0])) + 1).keys()).map(i => {
        let level, label, v = unit[0] * i;
        if (unit[2][3] && i % unit[2][3] === 0) {
            level = 1;
        } else if (unit[2][2] && i % unit[2][2] === 0) {
            level = 2;
        } else if (unit[2][1] && i % unit[2][1] === 0) {
            level = 3;
        } else if (unit[2][0] && i % unit[2][0] === 0) {
            level = 4;
        }
        if (level <= unit[1][3]) {
            label = unit[1][1];
            let regex = /\${(.*)}/g;
            let replacer = (match, exp, offset, string) => {
                console.log(math.evaluate(exp, { i: i, v: v }));
                return math.evaluate(exp, { i: i, v: v });
            };
            label = label.replace(regex, replacer);
        }
        return [i, v, level, label];
    });
}

function clear(ruler1, ruler2) {
    while (ruler1.firstChild) {
        ruler1.removeChild(ruler1.firstChild)
    }
    while (ruler2.firstChild) {
        ruler2.removeChild(ruler2.firstChild)
    }
}

function buildRuler(unit1, unit2) {
    const ruler1 = document.getElementById("ruler-left");
    const ruler2 = document.getElementById("ruler-right");
    clear(ruler1, ruler2);
    document.getElementById("label1").innerText = unit1[1][2];
    document.getElementById("label2").innerText = unit2[1][2];
    const unit1Points = pointsGen(unit1), unit2Points = pointsGen(unit2);
    for (let point of unit1Points) {
        const [i, v, level, label] = point;
        const l = `sep${level}`;
        const d = document.createElement("div");
        d.classList.add("sep", l);
        d.style.bottom = `${v}${unit1[1][0]}`;
        if (label) {
            const le = document.createElement("div");
            le.classList.add("l1");
            le.innerText = label;
            le.style.bottom = `${v}${unit1[1][0]}`;
            ruler1.appendChild(le);
        }
        ruler1.appendChild(d);
    }
    for (let point of unit2Points) {
        const [i, v, level, label] = point;
        const l = `sep${level}`;
        const d = document.createElement("div");
        d.classList.add("sep", l);
        d.style.top = `${v}${unit2[1][0]}`;
        if (label) {
            const le = document.createElement("div");
            le.classList.add("l2");
            le.innerText = label;
            le.style.top = `${v}${unit2[1][0]}`;
            ruler2.appendChild(le);
        }
        ruler2.appendChild(d);
    }
}

buildRuler(Units.MM, Units.IN);
