
using System;
using System.Collections.Generic;

public class Solution
{
    private sealed record Road(int toCityID, int cost) { }
    private sealed record City(int ID, long costFromStart) { }

    private int numberOfCities;
    private int multiplierForReturnJourney;

    public long[] MinCost(int numberOfCities, int[][] roads, int[] appleCost, int multiplierForReturnJourney)
    {
        this.numberOfCities = numberOfCities;
        this.multiplierForReturnJourney = multiplierForReturnJourney;
        IList<Road>[] undirectedGraph = CreateUndirectedGraph(roads);
        return FindMinCostForAllApplesByMultisourceDijkstraSearch(undirectedGraph, appleCost);
    }

    private long[] FindMinCostForAllApplesByMultisourceDijkstraSearch(IList<Road>[] undirectedGraph, int[] appleCost)
    {
        PriorityQueue<City, long> minHeapCities = CreateMinHeapCities(appleCost);
        long[] minAppleCost = CreateArrayMinAppleCost(appleCost);

        while (minHeapCities.Count > 0)
        {
            City city = minHeapCities.Dequeue();
            if (city.costFromStart > minAppleCost[city.ID])
            {
                continue;
            }

            foreach (Road road in undirectedGraph[city.ID])
            {
                long totalAppleCost = CalculateTotalAppleCost(city, road);

                if (minAppleCost[road.toCityID] > totalAppleCost)
                {
                    minAppleCost[road.toCityID] = totalAppleCost;
                    minHeapCities.Enqueue(new City(road.toCityID, minAppleCost[road.toCityID]), minAppleCost[road.toCityID]);
                }
            }
        }
        return minAppleCost;
    }

    private IList<Road>[] CreateUndirectedGraph(int[][] roads)
    {
        IList<Road>[] undirectedGraph = new List<Road>[numberOfCities];
        for (int i = 0; i < numberOfCities; ++i)
        {
            undirectedGraph[i] = new List<Road>();
        }

        foreach (int[] road in roads)
        {
            // road[0] - 1 and road[1] - 1
            // transition from one-based to zero-based city IDs
            int from = road[0] - 1;
            int to = road[1] - 1;
            int cost = road[2];
            undirectedGraph[from].Add(new Road(to, cost));
            undirectedGraph[to].Add(new Road(from, cost));
        }
        return undirectedGraph;
    }

    private PriorityQueue<City, long> CreateMinHeapCities(int[] appleCost)
    {
        Comparer<long> compareDistanceFromStart = Comparer<long>.Create((x, y) => x.CompareTo(y));
        PriorityQueue<City, long> minHeapCities = new PriorityQueue<City, long>(compareDistanceFromStart);
        for (int i = 0; i < numberOfCities; ++i)
        {
            minHeapCities.Enqueue(new City(i, appleCost[i]), appleCost[i]);
        }
        return minHeapCities;
    }

    private long[] CreateArrayMinAppleCost(int[] appleCost)
    {
        long[] minCostPaths = new long[numberOfCities];
        for (int i = 0; i < numberOfCities; ++i)
        {
            minCostPaths[i] = appleCost[i];
        }
        return minCostPaths;
    }

    private long CalculateTotalAppleCost(City city, Road road)
    {
        return city.costFromStart + road.cost * (1 + multiplierForReturnJourney);
    }
}
