
import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

public class Solution {

    private record Road(int toCityID, int cost) {}
    private record City(int ID, long costFromStart) {}

    private int numberOfCities;
    private int multiplierForReturnJourney;

    public long[] minCost(int numberOfCities, int[][] roads, int[] appleCost, int multiplierForReturnJourney) {
        this.numberOfCities = numberOfCities;
        this.multiplierForReturnJourney = multiplierForReturnJourney;
        List<Road>[] undirectedGraph = createUndirectedGraph(roads);
        return findMinCostForAllApplesByMultisourceDijkstraSearch(undirectedGraph, appleCost);
    }

    private long[] findMinCostForAllApplesByMultisourceDijkstraSearch(List<Road>[] undirectedGraph, int[] appleCost) {
        PriorityQueue<City> minHeapCities = createMinHeapCities(appleCost);
        long[] minAppleCost = createArrayMinAppleCost(appleCost);

        while (!minHeapCities.isEmpty()) {

            City city = minHeapCities.poll();
            if (city.costFromStart > minAppleCost[city.ID]) {
                continue;
            }

            for (Road road : undirectedGraph[city.ID]) {
                long totalAppleCost = calculateTotalAppleCost(city, road);

                if (minAppleCost[road.toCityID] > totalAppleCost) {
                    minAppleCost[road.toCityID] = totalAppleCost;
                    minHeapCities.add(new City(road.toCityID, minAppleCost[road.toCityID]));
                }
            }
        }
        return minAppleCost;
    }

    private List<Road>[] createUndirectedGraph(int[][] roads) {
        List<Road>[] undirectedGraph = new ArrayList[numberOfCities];
        for (int i = 0; i < numberOfCities; ++i) {
            undirectedGraph[i] = new ArrayList<>();
        }

        for (int[] road : roads) {
            // road[0] - 1 and road[1] - 1
            // transition from one-based to zero-based city IDs
            int from = road[0] - 1;
            int to = road[1] - 1;
            int cost = road[2];
            undirectedGraph[from].add(new Road(to, cost));
            undirectedGraph[to].add(new Road(from, cost));
        }
        return undirectedGraph;
    }

    private PriorityQueue<City> createMinHeapCities(int[] appleCost) {
        PriorityQueue<City> minHeapCities = new PriorityQueue<>((x, y) -> Long.compare(x.costFromStart, y.costFromStart));
        for (int i = 0; i < numberOfCities; ++i) {
            minHeapCities.add(new City(i, appleCost[i]));
        }
        return minHeapCities;
    }

    private long[] createArrayMinAppleCost(int[] appleCost) {
        long[] minCostPaths = new long[numberOfCities];
        for (int i = 0; i < numberOfCities; ++i) {
            minCostPaths[i] = appleCost[i];
        }
        return minCostPaths;
    }

    private long calculateTotalAppleCost(City city, Road road) {
        return city.costFromStart + road.cost * (1 + multiplierForReturnJourney);
    }
}
