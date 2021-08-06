function setJson(data) {
    document.getElementById("json").innerHTML = JSON.stringify(data, null, 2);
}

function splitRound1(data) {
    var result = data.split(':');
    return { "date": result[0].trim(), "value": result[1] };
}
function splitRound2(data) {
    var result = data.split('|');
    var doublenumber = Number(result[0].replace(/[^0-9\.]+/g, ""));

    return { "cost": doublenumber, "value": result[1] };
}

function splitRound3(data) {
    if (typeof data === 'undefined') {
        return { "miles": 0, "value": 0 };
    }

    var result = data.split('(');
    var doublenumber = Number(result[0].replace(/[^0-9\.]+/g, ""));

    return { "miles": doublenumber, "value": result[1] };
}

function splitRound4(data) {
    if (typeof data === 'undefined') {
        return { "mpg": 0.0, "value": 0 };
    }

    if (typeof data.split === 'undefined') {
        return { "mpg": 0.0, "value": 0 };
    }
    var result = data.split(')');
    var doublenumber = Number(result[0].replace(/[^0-9\.]+/g, ""));

    return { "mpg": doublenumber, "value": result[1] };
}
function EtlFunction(data) {

    var result = data.split('\n').map(x => {
        var round1 = splitRound1(x);
        var round2 = splitRound2(round1.value);
        var round3 = splitRound3(round2.value);
        var round4 = splitRound4(round3.value);
        return { "date": round1.date, "cost": round2.cost, "miles": round3.miles, "mpg": round4.mpg };
    });

    return result;
}


(function () {
    var fetchResults = fetch('data/gas-civic.txt')
        .then(response => response.text())
        .then(EtlFunction)
        .then(r => { console.table(r); setJson(r); });
})();