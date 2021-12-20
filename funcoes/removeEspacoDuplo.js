function removeEspacoDuplo(str) {
    str.replace(/\s{2,}/g, ' ');
    return str.trim();
}
module.exports = removeEspacoDuplo;
