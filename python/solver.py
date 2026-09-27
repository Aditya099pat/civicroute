"""
CivicRoute DAG Pipeline Topological Solver
Evaluates dependency prerequisites and computes optimal clearance roadmaps.
"""
from collections import defaultdict, deque
from typing import Dict, List, Set, Any

class CivicDependencyEngine:
    def __init__(self, nodes: List[Dict[str, Any]]):
        self.nodes = {n["id"]: n for n in nodes}
        self.graph = defaultdict(list)
        self.in_degree = defaultdict(int)
        self._build_graph()

    def _build_graph(self):
        for node_id, node in self.nodes.items():
            if node_id not in self.in_degree:
                self.in_degree[node_id] = 0
            for prereq in node.get("prereqs", []):
                self.graph[prereq].append(node_id)
                self.in_degree[node_id] += 1

    def topological_sort(self) -> List[str]:
        queue = deque([node_id for node_id, deg in self.in_degree.items() if deg == 0])
        ordered = []

        while queue:
            curr = queue.popleft()
            ordered.append(curr)
            for downstream in self.graph[curr]:
                self.in_degree[downstream] -= 1
                if self.in_degree[downstream] == 0:
                    queue.append(downstream)

        if len(ordered) != len(self.nodes):
            raise ValueError("Cyclic dependency detected in municipal pipeline!")
        return ordered

    def compute_unlocked_nodes(self, completed_ids: Set[str]) -> List[str]:
        ready = []
        for node_id, node in self.nodes.items():
            if node_id in completed_ids:
                continue
            prereqs = set(node.get("prereqs", []))
            if prereqs.issubset(completed_ids):
                ready.append(node_id)
        return ready

if __name__ == "__main__":
    sample_nodes = [
        {"id": "1", "title": "Aadhaar / PAN Identity", "prereqs": []},
        {"id": "2", "title": "Gumasta Shop License", "prereqs": ["1"]},
        {"id": "3", "title": "Fire NOC", "prereqs": ["2"]},
        {"id": "4", "title": "FSSAI Food License", "prereqs": ["2"]},
        {"id": "5", "title": "Health Trade License", "prereqs": ["3", "4"]}
    ]
    solver = CivicDependencyEngine(sample_nodes)
    print("Topological Clearance Order:", solver.topological_sort())
    print("Ready next when [1] is completed:", solver.compute_unlocked_nodes({"1"}))
