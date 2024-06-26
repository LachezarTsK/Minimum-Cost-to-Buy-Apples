
#include <span>
#include <queue>
#include <vector>
using namespace std;

class Solution {

    struct Road {
        int toCityID = 0;
        int cost = 0;

        Road(int toCityID, int cost) : toCityID{ toCityID }, cost{ cost } {}

        Road() = default;
        ~Road() = default;
    };

    struct City {
        int ID = 0;
        long long costFromStart = 0;

        City(int ID, long long costFromStart) : ID{ ID }, costFromStart{ costFromStart } {}

        City() = default;
        ~City() = default;
    };

    struct CompareCities {
        bool operator()(const City& x, const City& y)const {
            return x.costFromStart > y.costFromStart;
        }
    };

    int numberOfCities = 0;
    int multiplierForReturnJourney = 0;

    using MinHeapCities = priority_queue<City, vector<City>, CompareCities>;
    using UndirectedGraph = vector<vector<Road>>;

public:
    vector<long long> minCost(int numberOfCities, const vector<vector<int>>& roads, const vector<int>& appleCost, int multiplierForReturnJourney) {
        this->numberOfCities = numberOfCities;
        this->multiplierForReturnJourney = multiplierForReturnJourney;
        UndirectedGraph undirectedGraph = createUndirectedGraph(roads);
        return findMinCostForAllApplesByMultisourceDijkstraSearch(undirectedGraph, appleCost);
    }

private:
    vector<long long> findMinCostForAllApplesByMultisourceDijkstraSearch(const UndirectedGraph& undirectedGraph, span<const int> appleCost) const {
        MinHeapCities minHeapCities = createMinHeapCities(appleCost);
        vector<long long> minAppleCost = createVectorMinAppleCost(appleCost);

        while (!minHeapCities.empty()) {

            City city = minHeapCities.top();
            minHeapCities.pop();

            if (city.costFromStart > minAppleCost[city.ID]) {
                continue;
            }

            for (Road road : undirectedGraph[city.ID]) {
                long long totalAppleCost = calculateTotalAppleCost(city, road);

                if (minAppleCost[road.toCityID] > totalAppleCost) {
                    minAppleCost[road.toCityID] = totalAppleCost;
                    minHeapCities.emplace(road.toCityID, minAppleCost[road.toCityID]);
                }
            }
        }
        return minAppleCost;
    }

    UndirectedGraph createUndirectedGraph(span<const vector<int>> roads) const {
        UndirectedGraph undirectedGraph(numberOfCities, vector<Road>());

        for (const auto& road : roads) {
            // road[0] - 1 and road[1] - 1
            // transition from one-based to zero-based city IDs
            int from = road[0] - 1;
            int to = road[1] - 1;
            int cost = road[2];
            undirectedGraph[from].emplace_back(to, cost);
            undirectedGraph[to].emplace_back(from, cost);
        }
        return undirectedGraph;
    }

    MinHeapCities createMinHeapCities(span<const int> appleCost) const {
        MinHeapCities minHeapCities;
        for (int i = 0; i < numberOfCities; ++i) {
            minHeapCities.emplace(i, appleCost[i]);
        }
        return minHeapCities;
    }

    vector<long long> createVectorMinAppleCost(span<const int> appleCost) const {
        vector<long long> minCostPaths(numberOfCities);
        for (int i = 0; i < numberOfCities; ++i) {
            minCostPaths[i] = appleCost[i];
        }
        return minCostPaths;
    }

    long long calculateTotalAppleCost(const City& city, const Road& road) const {
        return city.costFromStart + road.cost * (1 + multiplierForReturnJourney);
    }
};
