/**
 * string functions
 **/

function loadString(path) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send(null);
    if ((xhr.status == 200) || (xhr.status == 0)) return xhr.responseText;
    return "";
}


String.prototype.ltrim = function (clist) {
    if (clist) return this.replace(new RegExp('^[' + clist + ']+'), '')
    return this.replace(/^\s+/, '')
}
String.prototype.rtrim = function (clist) {
    if (clist) return this.replace(new RegExp('[' + clist + ']+$'), '')
    return this.replace(/\s+$/, '')
}
String.prototype.trim = function (clist) {
    if (clist) return this.ltrim(clist).rtrim(clist);
    return this.ltrim().rtrim();
}
String.prototype.startsWith = function (str) {
    return !this.indexOf(str);
}