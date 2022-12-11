var formatter = function (formatFn, value) {
    if (! (formatFn in window.formatting)) return value || '';
    return window.formatting[formatFn](value);
}


var formatting = {
    // Strings
    minutes: function(value) {
        if (value == undefined || value == '') return '';
        return `${value}mins`;
    },

    calories: function(value) {
        if (value == undefined || value == '') return '';
        return `${value}kcal`;
    },


    lbs: function(value) {
        if (value == undefined || value == '') return '';
        return `${value}lbs`;
    },

    reps: function(value) {
        if (value == undefined || value == '') return '';
        return `${value}reps`;
    },

    money: function(value) {
        if (value == undefined || value == '') return '';

        if (value >= 0) {
            return `<span class="font-semibold text-emerald-500">+${value}$</span>`;
        }

        return `<span class="font-semibold text-red-600">${value}$</span>`;
    },

    // Dates
    cuteDateTime: function(value) {
        let date = moment(value);
        if (! date.isValid()) return value || '';
        return date.format('MMM. Do LT');
    },

    smallMonth: function(value) {
        let date = moment(value);
        if (! date.isValid()) return value || '';
        return date.format('MMM');
    },

    cuteDate: function(value) {
        let date = moment(value);
        if (! date.isValid()) return value || '';
        return date.format('MMM. Do');
    },

    yearOnly: function(value) {
        let date = moment(value);
        if (! date.isValid()) return value || '';
        return date.format('YYYY');
    },

    weekDayOnly: function(value) {
        let date = moment(value);
        if (! date.isValid()) return value || '';
        return date.format('dddd');
    },

    // Elements
    csv: function(csvValue) {
        if (csvValue == undefined || csvValue == '') return '';

        let values = csvValue.split(',');

        let strBuilder = '';
        for (let value of values)
            strBuilder += `<span class="pill-primary">${value}</span>`;

        return strBuilder;
    },

    pill: function(value) {
        if (value == undefined || value == '') return '';
        return `<span class="pill-primary">${value}</span>`;
    }
};
