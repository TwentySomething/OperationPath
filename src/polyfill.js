if (!Array.prototype.diff) {
    Array.prototype.diff = function(arr) {
        return this.filter(i => arr.indexOf(i) < 0);
    };
};
if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    };
};
