
function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return m.toStringWithDecimalPlaces(precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
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

function format(decimal, precision = 2, small) {
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
    else if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false)
    else if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e100) && options.mixedsci) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e9) && !options.mixedsci) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e3) && options.mixedsci) return MixedSciformat(decimal)
    else if (decimal.gte(1e3) && !options.mixedsci) return commaFormat(decimal, 0)
    else if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    decimal = invertOOM(decimal)
    let val = ""
    if (decimal.lt("1e1000")){
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else   
        return format(decimal, precision) + "⁻¹"

}

function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(Math.floor(s % 60)) + "s"
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
  function MixedSciformat(num) {
    num = new Decimal(num)
    const units = {
      "DT": new Decimal("1e99"),
      "UT": new Decimal("1e96"),
      "Tg": new Decimal("1e93"),
      "NV": new Decimal("1e90"),
      "OV": new Decimal("1e87"),
      "SpV": new Decimal("1e84"),
      "SxV": new Decimal("1e81"),
      "QiV": new Decimal("1e78"),
      "QaV": new Decimal("1e75"),
      "TV": new Decimal("1e72"),
      "DV": new Decimal("1e69"),
      "UV": new Decimal("1e66"),
      "V": new Decimal("1e63"),
      "ND": new Decimal("1e60"),
      "OD": new Decimal("1e57"),
      "SpD": new Decimal("1e54"),
      "SxD": new Decimal("1e51"),
      "QiD": new Decimal("1e48"),
      "QaD": new Decimal("1e45"),
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
    x = new Decimal(10).pow(e).times(m)

    return x
}