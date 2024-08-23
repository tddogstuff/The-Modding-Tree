

function exponentialFormat(num, precision, mantissa = true , mantissaPrecision = 2) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(1000) ? format(e, precision , 0) : e.toStringWithDecimalPlaces(precision)))
    if (mantissa && options.unit !== "Logarithm")
        return m.toStringWithDecimalPlaces(mantissaPrecision) + "e" + e
    else return "e" + e
}

function logFormat(num , precision = 2) {
    if(num.lt(1000)) return format(num , precision , true , 0)
    let e = num.log10()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(1000) ? format(e, precision , 100) : e.toStringWithDecimalPlaces(precision)))
    return "e" + e

}
function infinityFormat(num , precision = 4) {
    if(num.lt(1000) && num.gte("0.001")) return format(num , precision , true ,0)
    if(num.eq(0)) return "0"
    let sign = 1 
    if(num.lt("0.001")) sign = -1
    if(num.lt("0.001")) num = invertOOM(num)
    let power = 0
    let symbol = "∞"
    let a = ""
    while (num.gte(d(2).pow(1024))) {
        num = num.log(2).div("1024")
        power++
    }
    if(sign === -1) a = "1/"
    power = power * sign
    if(power !== 1) symbol = "∞^"+power
    if(power === 0) symbol = ""
    if(num.lt(1024)) num = regularFormat(num ,precision)
    else if(num.lt("1e9")) num = commaFormat(num)
    else num = exponentialFormat(num)
    if (sign === 1) return num+""+symbol
    else if (sign === -1 && power === 0) return "(1/"+num+")"
    else if (sign === -1 && power !== 0) return num+""+symbol
}

function commaFormat(num, precision = 2) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision = 2) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}

/**
 *Format the number (order is to prevent infinite loops)
*/
function format(decimal, precision = 2, small , order = 100) {
    small = true
    decimal = new Decimal(decimal)
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (decimal.gte("eeee1000")) {
        var slog = decimal.slog()
        if (slog.gte(1e6)) return "F" + format(slog.floor())
        else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    }
    else if (options.unit === "Blind") return ""
    //else if (options.unit === "Infinity" && order === 100) return infinityFormat(decimal , precision)
    else if (options.unit === "Logarithm" && order === 100) return logFormat(decimal , 2)
    else if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0 , false)
    else if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e9) && order === 0) return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e3) && order === 0) return commaFormat(decimal, 0)
    else if (decimal.gte(1e123) && options.unit === "Mixed scientific") return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e9) && options.unit === "Scientific") return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e3) && options.unit === "Mixed scientific") return MixedSciformat(decimal)
    else if (decimal.gte(1e3) && options.unit === "Scientific") return commaFormat(decimal, 0)
    else if ((decimal.lte(1e3) && decimal.gte("0.001")) || !small) return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    else if (decimal.lt("0.001")) return "(1/"+format(invertOOM(decimal), precision , true , 100) + ")"

}
/** 
*format , but without fractional content
**/
function formatWhole(decimal , order = 100) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2 , true , 10)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2 , true , 10)
    return format(decimal, 0 , true , 0)
}

/** 
*Time formatting , convert a number to time (in second) and convert them
**/
function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(Math.floor(s % 60),0) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60,0) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60,0) + "s"
    else if (s < 3153600000) return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d"
    else return format(s.div(31536000)) + "y"
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}
/** 
*Convert a number into roman
**/
function convertToRoman(num) {
    const romanNumerals = [
      { value: 1000, symbol: 'M' },
      { value: 900, symbol: 'CM' },
      { value: 500, symbol: 'D' },
      { value: 400, symbol: 'CD' },
      { value: 100, symbol: 'C' },
      { value: 90, symbol: 'XC' },
      { value: 50, symbol: 'L' },
      { value: 40, symbol: 'XL' },
      { value: 10, symbol: 'X' },
      { value: 9, symbol: 'IX' },
      { value: 5, symbol: 'V' },
      { value: 4, symbol: 'IV' },
      { value: 1, symbol: 'I' }
    ];
  
    let romanNumeral = '';
  
    for (const numeral of romanNumerals) {
      while (num >= numeral.value) {
        romanNumeral += numeral.symbol;
        num -= numeral.value;
      }
    }
  
    return romanNumeral
  }
/** 
*Mixed scientific notation , ranging from 1k to 1Nt
**/
  function MixedSciformat(num) {
    num = new Decimal(num)
    if(num.gte("1e123")) return 
    const units = {
      "Nt": new Decimal("1e120"),
      "Ot": new Decimal("1e117"),
      "Spt": new Decimal("1e114"),
      "Sxt": new Decimal("1e111"),
      "Qit": new Decimal("1e108"),
      "Qat": new Decimal("1e105"),
      "Tt": new Decimal("1e102"),
      "Dt": new Decimal("1e99"),
      "Ut": new Decimal("1e96"),
      "Tg": new Decimal("1e93"),
      "Nv": new Decimal("1e90"),
      "Ov": new Decimal("1e87"),
      "Spv": new Decimal("1e84"),
      "Sxv": new Decimal("1e81"),
      "Qiv": new Decimal("1e78"),
      "Qav": new Decimal("1e75"),
      "Tv": new Decimal("1e72"),
      "Dv": new Decimal("1e69"),
      "Uv": new Decimal("1e66"),
      "V": new Decimal("1e63"),
      "Nd": new Decimal("1e60"),
      "Od": new Decimal("1e57"),
      "Spd": new Decimal("1e54"),
      "Sxd": new Decimal("1e51"),
      "Qid": new Decimal("1e48"),
      "Qad": new Decimal("1e45"),
      "Td": new Decimal("1e42"),
      "Dd": new Decimal("1e39"),
      "Ud": new Decimal("1e36"),
      "Dc": new Decimal("1e33"),
      "No": new Decimal("1e30"),
      "Oc": new Decimal("1e27"),
      "Sp": new Decimal("1e24"),
      "Sx": new Decimal("1e21"),
      "Qi": new Decimal("1e18"),
      "Qa": new Decimal("1e15"),
      "T": new Decimal("1e12"),
      "B": new Decimal("1e9"),
      "M": new Decimal("1e6"),
      "k": new Decimal("1e3"),
    };
  
    for (const unit in units) {
      const threshold = units[unit];
      if (num.gte(threshold)) {
        const value = num.div(threshold);
        const formattedValue = value.toFixed(2); 
        return formattedValue + unit;
      }
    }
      return num.toStringWithDecimalPlaces();
  }  



function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(d(10).div(m)).div(10)

    return x
}