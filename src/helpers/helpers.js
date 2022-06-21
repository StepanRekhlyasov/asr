export function replaceNumberForInput(e) {
    let value = e.target.value
    let val = ''
    var x = value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})/)
    if (!x[2] && x[1] !== '') {
        val = x[1] === '1' ? '+1' : '+1' + x[1]
    } else {
        val = !x[3] ? '+' + x[1] + ' (' + x[2]  : '+' + x[1] + ' (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '')
    }
    e.target.value = val
    return val
}
export function onlyLetters(e){
    let val = e.target.value.replace(/[^A-Za-z]/ig, '')
    e.target.value = val
    return val
}
export function balance_toFixed(value,number = 2) {
    if(!value){
        return 0
    } else {
        return parseFloat(value).toFixed(number)
    }
}
export function dateButifier(myDate) {
    let dateParts = myDate.split(" ")
    dateParts = dateParts[0].split("-")
    let newDate = dateParts[1]+'/'+dateParts[2]+'/'+dateParts[0]
    return newDate
}
export function datetimeButifier(myDate) {
    if(myDate){
        let dateParts = myDate.split(" ")
        let timeParts = dateParts[1]
        dateParts = dateParts[0].split("-")
        let newDate = dateParts[1]+'/'+dateParts[2]+'/'+dateParts[0]+' '+timeParts
        return newDate
    } else {
        return false
    }
}
export function stateTitle_getByID(list, id) {
    for (var [key, value] of Object.entries(list)) {
        if(value.id==id){
            return value.title
        }
    }
}