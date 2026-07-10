---
title: "Dijkstra with a binary heap"
date: "2026-07-02"
topics: ["graphs", "shortest-paths"]
description: "Notes on the heap-based Dijkstra implementation I actually use in contest."
---

Dijkstra's algorithm finds shortest paths from a single source in a graph
with non-negative edge weights. The version I keep reaching for in contest
uses a binary heap and runs in $O((V+E)\log V)$, which is fast enough for
basically anything up to $10^5$ or so vertices and edges.

## The idea

Maintain a `dist` array initialized to infinity except the source, which is
0. Repeatedly pull the unvisited vertex with the smallest tentative
distance, mark it visited, and relax its outgoing edges — if going through
this vertex gives a shorter path to a neighbor, update the neighbor's
distance and push it onto the heap.

The subtlety is that a priority queue doesn't support efficient
decrease-key in most standard libraries, so instead of updating an entry in
place, you just push a new (distance, vertex) pair every time you find a
shorter path. That means the heap can contain stale entries for a vertex
you've already finalized — you handle that with a lazy deletion check when
you pop.

## C++ implementation

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<long long> dijkstra(int n, int src,
                            vector<vector<pair<int,long long>>> &adj) {
    vector<long long> dist(n, LLONG_MAX);
    vector<bool> visited(n, false);
    dist[src] = 0;

    priority_queue<pair<long long,int>,
                    vector<pair<long long,int>>,
                    greater<>> pq;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (visited[u]) continue;  // stale entry, skip
        visited[u] = true;

        for (auto &[v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

`greater<>` flips the priority queue into a min-heap on the first element
of the pair (distance), which is why the pair is `(distance, vertex)` and
not `(vertex, distance)`.

## Python implementation

```python
import heapq

def dijkstra(n, src, adj):
    dist = [float("inf")] * n
    dist[src] = 0
    visited = [False] * n
    pq = [(0, src)]

    while pq:
        d, u = heapq.heappop(pq)
        if visited[u]:
            continue
        visited[u] = True
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))

    return dist
```

`heapq` is a min-heap by default, which matches the C++ version once you
flip the comparator with `greater<>`.

## Pitfalls I've actually hit

- **Negative edges.** Dijkstra assumes non-negative weights — once a vertex
  is finalized, the algorithm assumes nothing can make its distance
  smaller. A negative edge breaks that assumption silently, and it won't
  crash, it'll just give a wrong answer. Use Bellman-Ford if the graph has
  negative edges.
- **Forgetting the visited check.** Without `if (visited[u]) continue;`,
  stale heap entries get relaxed again, which doesn't necessarily break
  correctness but blows up the runtime back toward $O(E \log E)$
  needlessly reprocessing old entries — and in some formulations it can
  cause wrong answers if you're not careful about how you track "finalized."
- **Overflow.** Distances accumulate; `int` overflows fast on weighted
  graphs with large weights. I default to `long long` for `dist` now
  after losing time to this once.
- **Disconnected vertices.** Anything unreachable stays at infinity — remember
  to check for that before using the value downstream.

If you want to see the frontier expand step by step instead of just reading
pseudocode, I found it useful to play with the
[interactive Dijkstra visualizer](/visualizer/) on this site.
