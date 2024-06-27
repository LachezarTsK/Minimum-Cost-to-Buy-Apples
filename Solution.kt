
import java.util.PriorityQueue

class Solution {

    private data class Road(val toCityID: Int, val cost: Int) {}
    private data class City(val ID: Int, val costFromStart: Long) {}

    private var numberOfCities = 0
    private var multiplierForReturnJourney = 0

    fun minCost(numberOfCities: Int, roads: Array<IntArray>, appleCost: IntArray, multiplierForReturnJourney: Int): LongArray {
        this.numberOfCities = numberOfCities
        this.multiplierForReturnJourney = multiplierForReturnJourney
        val undirectedGraph = createUndirectedGraph(roads)
        return findMinCostForAllApplesByMultisourceDijkstraSearch(undirectedGraph, appleCost)
    }

    private fun findMinCostForAllApplesByMultisourceDijkstraSearch(undirectedGraph: Array<ArrayList<Road>>, appleCost: IntArray): LongArray {
        val minHeapCities = createMinHeapCities(appleCost)
        val minAppleCost = createArrayMinAppleCost(appleCost)

        while (!minHeapCities.isEmpty()) {

            val city = minHeapCities.poll()
            if (city.costFromStart > minAppleCost[city.ID]) {
                continue
            }

            for (road in undirectedGraph[city.ID]) {
                val totalAppleCost = calculateTotalAppleCost(city, road)

                if (minAppleCost[road.toCityID] > totalAppleCost) {
                    minAppleCost[road.toCityID] = totalAppleCost
                    minHeapCities.add(City(road.toCityID, minAppleCost[road.toCityID]))
                }
            }
        }
        return minAppleCost
    }

    private fun createUndirectedGraph(roads: Array<IntArray>): Array<ArrayList<Road>> {
        val undirectedGraph = Array<ArrayList<Road>>(numberOfCities) { ArrayList<Road>() }

        for ((from, to, cost) in roads) {
            // from - 1 and to - 1
            // transition from one-based to zero-based city IDs
            undirectedGraph[from - 1].add(Road(to - 1, cost))
            undirectedGraph[to - 1].add(Road(from - 1, cost))
        }
        return undirectedGraph
    }

    private fun createMinHeapCities(appleCost: IntArray): PriorityQueue<City> {
        val minHeapCities = PriorityQueue<City> { x, y -> x.costFromStart.compareTo(y.costFromStart) }
        for (i in 0..<numberOfCities) {
            minHeapCities.add(City(i, appleCost[i].toLong()))
        }
        return minHeapCities
    }

    private fun createArrayMinAppleCost(appleCost: IntArray): LongArray {
        val minCostPaths = LongArray(numberOfCities)
        for (i in 0..<numberOfCities) {
            minCostPaths[i] = appleCost[i].toLong()
        }
        return minCostPaths
    }

    private fun calculateTotalAppleCost(city: City, road: Road): Long {
        return city.costFromStart + road.cost * (1 + multiplierForReturnJourney)
    }
}
