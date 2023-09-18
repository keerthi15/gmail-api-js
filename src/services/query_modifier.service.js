/* eslint-disable max-len */
const { Op } = require('sequelize');
const { fields, predicates } = require('../../config/rules');

/**
 * Constructs the query params based on the input payload conditions
 *
 * @param {Object} inputPayload
 * @return {Object}
 */
const prepareQuery = (inputPayload) => {
    const { condition, predicate } = inputPayload;

    const objEntries = Object.entries(condition);

    // Predicate can be either "ALL" or "ANY"
    // Refer to config/rules.js for more details
    if (!predicates.includes(predicate)) {
        throw new Error(`Invalid predicate - ${predicate}`);
    }

    const queryParams = [];
    objEntries.forEach(([ key, value ]) => {
        // Validate the filter fields
        if (!fields[key]) {
            throw new Error(`Invalid search key - ${key}`);
        }

        const searchKey = fields[key].attr;
        const searchOperation = value.operation;
        const searchValue = value.data;

        // Validate the filter operation
        if (!(fields[key].operations).includes(searchOperation)) {
            throw new Error(`Invalid operation for field - ${searchKey} - ${searchOperation}`);
        }
        else {
            // Get parts of the queryParam based on each field in the condition
            queryParams.push(getQueryParts(searchKey, searchOperation, searchValue));
        }
    });

    const queryObj = { };

    // Get operator based on predicate value
    switch (predicate) {
    case 'ALL':
        queryObj[Op.and] = queryParams;
        break;
    case 'ANY':
        queryObj[Op.or] = queryParams;
        break;
    }
    return queryObj;
};

/**
 * Construct part of query params based on search field, operation and value
 * Returns a part of the query params that is used to fetch the messages
 *
 * @param {String} searchKey
 * @param {String} searchOperation
 * @param {String} searchValue
 * @return {Object}
 */
const getQueryParts = (searchKey, searchOperation, searchValue) => {
    if ([ 'CONTAINS', 'NOT_CONTAINS' ].includes(searchOperation)) {
        searchValue = '%'+searchValue+'%';
    }
    const res = { [searchKey]: {} };

    switch (searchOperation) {
    case 'CONTAINS':
        res[searchKey][Op.like] = searchValue;
        break;
    case 'NOT_CONTAINS':
        res[searchKey][Op.notLike] = searchValue;
        break;
    case 'EQUALS':
        res[searchKey][Op.eq] = searchValue;
        break;
    case 'NOT_EQUALS':
        res[searchKey][Op.ne] = searchValue;
        break;
    case 'LESSER':
        res[searchKey][Op.lte] = searchValue;
        break;
    case 'GREATER':
        res[searchKey][Op.gte] = searchValue;
        break;
    default:
        throw new Error(`Invalid operation for field - ${searchKey} - ${searchOperation}`);
    }
    return res;
};

module.exports = {
    prepareQuery,
};
