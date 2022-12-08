var validator = function (validateFn, value) {
    if (! formatFn in window.formatting) return true;
    return window.formatting[formatFn](value);
}

var validation = {

};
