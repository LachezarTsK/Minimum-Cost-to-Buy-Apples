
// const {MinPriorityQueue} = require('@datastructures-js/priority-queue');
// when running the code on leetcode.com, the line above should be commented out
// because it is automatically included in the Solution file on leetcode.com

function minCost(numberOfCities: number, roads: number[][], appleCost: number[], multiplierForReturnJourney: number): number[] {
    this.numberOfCities = numberOfCities;
    this.multiplierForReturnJourney = multiplierForReturnJourney;
    const undirectedGraph = createUndirectedGraph(roads);
    return findMinCostForAllApplesByMultisourceDijkstraSearch(undirectedGraph, appleCost);
};

class Road {
    toCityID: number;
    cost: number;

    constructor(toCityID: number, cost: number) {
        this.toCityID = toCityID;
        this.cost = cost;
    }
}

class City {
    ID: number;
    costFromStart: number;

    constructor(ID: number, costFromStart: number) {
        this.ID = ID;
        this.costFromStart = costFromStart;
    }
}

function findMinCostForAllApplesByMultisourceDijkstraSearch(undirectedGraph: Road[][], appleCost: number[]): number[] {
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

function createUndirectedGraph(roads: number[][]): Road[][] {
    const undirectedGraph = Array.from(new Array(this.numberOfCities), () => new Array());

    for (let [from, to, cost] of roads) {
        // from - 1 and to - 1
        // transition from one-based to zero-based city IDs
        undirectedGraph[from - 1].push(new Road(to - 1, cost));
        undirectedGraph[to - 1].push(new Road(from - 1, cost));
    }
    return undirectedGraph;
}

function createMinHeapCities(appleCost: number[]): typeof MinPriorityQueue {
    const minHeapCities = new MinPriorityQueue({ compare: (x: City, y: City) => x.costFromStart - y.costFromStart });
    for (let i = 0; i < this.numberOfCities; ++i) {
        minHeapCities.enqueue(new City(i, appleCost[i]));
    }
    return minHeapCities;
}

function createArrayMinAppleCost(appleCost: number[]): number[] {
    const minCostPaths = new Array(this.numberOfCities);
    for (let i = 0; i < this.numberOfCities; ++i) {
        minCostPaths[i] = appleCost[i];
    }
    return minCostPaths;
}

function calculateTotalAppleCost(city: City, road: Road): number {
    return city.costFromStart + road.cost * (1 + this.multiplierForReturnJourney);
}
