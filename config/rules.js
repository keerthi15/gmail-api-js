/**
 * The fields on which the filters can be applied.
 * attr - The corresponding attribute on the messages table.
 * operations - The operations allowed on the corresponding field.
 */
const fields = {
    'FROM': {
        'attr': 'from_email',
        'operations': [ 'CONTAINS', 'NOT_CONTAINS', 'EQUALS', 'NOT_EQUALS' ],
    },
    'SUBJECT': {
        'attr': 'email_subject',
        'operations': [ 'CONTAINS', 'NOT_CONTAINS', 'EQUALS', 'NOT_EQUALS' ],
    },
    'MESSAGE': {
        'attr': 'email_body',
        'operations': [ 'CONTAINS', 'NOT_CONTAINS', 'EQUALS', 'NOT_EQUALS' ],
    },
    'DATETIME': {
        'attr': 'created_date',
        'operations': [ 'LESSER', 'GREATER' ],
    },
};

/**
 * The list of actions allowed on the messages.
 * Contains two keys : add / remove.
 * `add` array contains the labels to be added when the action is applied.
 * `remove` array contains the labels to be removed when the action is applied.
 * If the `remove` array has "ALL" as value,
 * all labels on the message are to be removed.
 */
const actions = {
    'READ': {
        'remove': [ 'UNREAD' ],
    },
    'UNREAD': {
        'add': [ 'UNREAD' ],
    },
    'ARCHIVE': {
        'remove': [ 'INBOX', 'ALL' ],
    },
};

/**
 * Possible predicates are ALL, ANY.
 * Determines if all conditions on fields are to satisfied or not.
 */
const predicates = [ 'ALL', 'ANY' ];

module.exports = {
    fields,
    actions,
    predicates,
};
