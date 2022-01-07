module.exports = {
    select2: function (selected, options) {
        return options.fn(this).replace(new RegExp('value = \"'+ selected + '\"'),'$&selected="selected"');
    },
    select: function (selected, options) {
        return options.fn(this).replace(
            new RegExp(' value=\"' + selected + '\"'),'$& selected="selected"');
    }

    
};