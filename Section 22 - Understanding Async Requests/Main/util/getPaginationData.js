/**
 * The amount of items that should appear on per page.
 */
const ITEMS_PER_PAGE = 2;

/**
 * Calculates and returns an object of the data relevant to the page pagination logic.
 * @param {*} page The current page number selected.
 * @param {*} totalItems The total amount of items in the DB collection.
 */
const getPaginationData = (page, totalItems) => ({
	hasNextPage: ITEMS_PER_PAGE * page < totalItems,
	hasPreviousPage: page > 1,
	nextPage: page + 1,
	previousPage: page - 1,
	lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
});

module.exports = { getPaginationData, ITEMS_PER_PAGE };
