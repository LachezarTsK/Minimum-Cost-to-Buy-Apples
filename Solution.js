
// const {MinPriorityQueue} = require('@datastructures-js/priority-queue');
// when running the code on leetcode.com, the line above should be commented out
// because it is automatically included in the Solution file on leetcode.com

/**
 * @param {number} numberOfCities
 * @param {number[][]} roads
 * @param {number[]} appleCost
 * @param {number} multiplierForReturnJourney
 * @return {number[]}
 */
var minCost = function (numberOfCities, roads, appleCost, multiplierForReturnJourney) {
    this.numberOfCities = numberOfCities;
    this.multiplierForReturnJourney = multiplierForReturnJourney;
    const undirectedGraph = createUndirectedGraph(roads);
    return findMinCostForAllApplesByMultisourceDijkstraSearch(undirectedGraph, appleCost);
};

/**
 * @param {number} toCityID
 * @param {number} cost
 */
function Road(toCityID, cost) {
    this.toCityID = toCityID;
    this.cost = cost;
}

/**
 * @param {number} ID
 * @param {number} costFromStart
 */
function City(ID, costFromStart) {
    this.ID = ID;
    this.costFromStart = costFromStart;
}

/**
 * @param {Road[][]} undirectedGraph
 * @param {number[]} appleCost
 * @return {number[]}
 */
function findMinCostForAllApplesByMultisourceDijkstraSearch(undirectedGraph, appleCost) {
    const minHeapCities = createMinHeapCities(appleCost);
    const minAppleCost = createArrayMinAppleCost(appleCost);

    while (!minHeapCities.isEmpty()) {

        const city = minHeapCities.dequeue();
        if (city.costFromStart > minAppleCost[city.ID]) {
            continue;
        }

        for (let road of undirectedGraph[city.ID]) {
            const totalAppleCost = calculateTotalAppleCost(city, road);
            if (minAppleCost[road.toCityID] > totalAppleCost) {
                minAppleCost[road.toCityID] = totalAppleCost;
                minHeapCities.enqueue(new City(road.toCityID, minAppleCost[road.toCityID]));
            }
        }
    }
    return minAppleCost;
}

/**
 * @param {number[][]} roads
 * @return {Road[][]}
 */
function createUndirectedGraph(roads) {
    const undirectedGraph = Array.from(new Array(this.numberOfCities), () => new Array());

    for (let [from, to, cost] of roads) {
        // from - 1 and to - 1
        // transition from one-based to zero-based city IDs
        undirectedGraph[from - 1].push(new Road(to - 1, cost));
        undirectedGraph[to - 1].push(new Road(from - 1, cost));
    }
    return undirectedGraph;
}

/**
 * @param {number[]} appleCost
 * @return {MinPriorityQueue<City>}
 */
function createMinHeapCities(appleCost) {
    const minHeapCities = new MinPriorityQueue({compare: (x, y) => x.costFromStart - y.costFromStart});
    for (let i = 0; i < this.numberOfCities; ++i) {
        minHeapCities.enqueue(new City(i, appleCost[i]));
    }
    return minHeapCities;
}

/** 
 * @param {number[]} appleCost
 * @return {number[]}
 */
function createArrayMinAppleCost(appleCost) {
    const minCostPaths = new Array(this.numberOfCities);
    for (let i = 0; i < this.numberOfCities; ++i) {
        minCostPaths[i] = appleCost[i];
    }
    return minCostPaths;
}

/**
 * @param {City} city
 * @param {Road} road
 * @return {number}
 */
function calculateTotalAppleCost(city, road) {
    return city.costFromStart + road.cost * (1 + this.multiplierForReturnJourney);
}
