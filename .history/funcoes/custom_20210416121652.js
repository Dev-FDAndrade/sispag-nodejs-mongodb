function removEspacoDuplo(str) {
    str.replace(/\s{2,}/g, ' ');
    return str.trim();
}