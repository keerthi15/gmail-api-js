/**
 * Utility method to construct a key-value pair
 * from the values of an object.
 * Returns an Object where the values are in array format
 *
 * @param {Object} objArr
 * @param {String} key
 * @param {String} value
 * @return {Object}
 */
const getArrayMap = (objArr, key, value) => {
    const resp = {};
    objArr.forEach((obj) => {
        if (!resp[obj[key]]) {
            resp[obj[key]] = [];
        }
        resp[obj[key]].push(obj[value]);
    });

    return resp;
};

/**
 * Utility method to construct a key-value pair
 * from the values of an object.
 * Returns an Object with a one-to-one key value mapping
 *
 * @param {Object} objArr
 * @param {String} key
 * @param {String} value
 * @return {Object}
 */
const getKeyValMap = (objArr, key, value) => {
    const resp = {};
    objArr.forEach((obj) => {
        resp[obj[key]] = obj[value];
    });

    return resp;
};


module.exports = {
    getArrayMap,
    getKeyValMap,
};
