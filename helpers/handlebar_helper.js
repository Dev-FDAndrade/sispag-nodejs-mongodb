module.exports = {
    select: function (selected, options) {
        return options.fn(this).replace(new RegExp('value=\"' + selected + '\"'),'$& selected="selected"');
    },
    ifCond: function (v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
          }
          return options.inverse(this);
    }

    
};