
package main

import (
    "container/heap"
    "fmt"
)

var numberOfCities = 0
var multiplierForReturnJourney = 0

func minCost(numberOfCities_ int, roads [][]int, appleCost []int, multiplierForReturnJourney_ int) []int64 {
    numberOfCities = numberOfCities_
    multiplierForReturnJourney = multiplierForReturnJourney_
    undirectedGraph := createUndirectedGraph(&roads)
    return findMinCostForAllApplesByMultisourceDijkstraSearch(&undirectedGraph, &appleCost)
}

type Road struct {
    toCityID int
    cost     int
}

type City struct {
    ID            int
    costFromStart int64
}

func findMinCostForAllApplesByMultisourceDijkstraSearch(undirectedGraph *[][]Road, appleCost *[]int) []int64 {
    minHeapCities := createMinHeapCities(appleCost)
    minAppleCost := createArrayMinAppleCost(appleCost)

    for minHeapCities.Len() > 0 {

        city := heap.Pop(&minHeapCities).(*City)
        if city.costFromStart > minAppleCost[city.ID] {
            continue
        }

        for _, road := range (*undirectedGraph)[city.ID] {
            totalAppleCost := calculateTotalAppleCost(city, &road)

            if minAppleCost[road.toCityID] > totalAppleCost {
                minAppleCost[road.toCityID] = totalAppleCost
                heap.Push(&minHeapCities, &City{road.toCityID, minAppleCost[road.toCityID]})
            }
        }
    }
    return minAppleCost
}

func createUndirectedGraph(roads *[][]int) [][]Road {
    undirectedGraph := make([][]Road, numberOfCities)
    for i := 0; i < numberOfCities; i++ {
        undirectedGraph[i] = make([]Road, 0)
    }

    for _, road := range *roads {
        // road[0] - 1 and road[1] - 1
        // transition from one-based to zero-based city IDs
        from := road[0] - 1
        to := road[1] - 1
        cost := road[2]
        undirectedGraph[from] = append(undirectedGraph[from], Road{to, cost})
        undirectedGraph[to] = append(undirectedGraph[to], Road{from, cost})
    }
    return undirectedGraph
}

func createMinHeapCities(appleCost *[]int) PriorityQueue {
    minHeapCities := make(PriorityQueue, 0)
    for i := 0; i < numberOfCities; i++ {
        minHeapCities = append(minHeapCities, &City{i, int64((*appleCost)[i])})
    }
    return minHeapCities
}

func createArrayMinAppleCost(appleCost *[]int) []int64 {
    minCostPaths := make([]int64, numberOfCities)
    for i := 0; i < numberOfCities; i++ {
        minCostPaths[i] = int64((*appleCost)[i])
    }
    return minCostPaths
}

func calculateTotalAppleCost(city *City, road *Road) int64 {
    return city.costFromStart + int64(road.cost*(1+multiplierForReturnJourney))
}

type PriorityQueue []*City

func (pq PriorityQueue) Len() int {
    return len(pq)
}

func (pq PriorityQueue) Less(first int, second int) bool {
    return pq[first].costFromStart < pq[second].costFromStart
}

func (pq PriorityQueue) Swap(first int, second int) {
    pq[first], pq[second] = pq[second], pq[first]
}

func (pq *PriorityQueue) Push(object any) {
    point := object.(*City)
    *pq = append(*pq, point)
}

func (pq *PriorityQueue) Pop() any {
    length := len(*pq)
    city := (*pq)[length-1]
    (*pq)[length-1] = nil
    *pq = (*pq)[0 : length-1]
    return city
}
