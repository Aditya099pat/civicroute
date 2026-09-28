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

    @staticmethod
    def _prereqs(node):
        # Support both the current "prerequisites" key and the legacy "prereqs".
        return node.get("prerequisites", node.get("prereqs", []))

    def _build_graph(self):
        for node_id, node in self.nodes.items():
            if node_id not in self.in_degree:
                self.in_degree[node_id] = 0
            for prereq in self._prereqs(node):
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
            prereqs = set(self._prereqs(node))
            if prereqs.issubset(completed_ids):
                ready.append(node_id)
        return ready

if __name__ == "__main__":
    sample_nodes = [
        {"id": "1", "title": "Aadhaar / PAN Identity", "prerequisites": []},
        {"id": "2", "title": "Gumasta Shop License", "prerequisites": ["1"]},
        {"id": "3", "title": "Fire NOC", "prerequisites": ["2"]},
        {"id": "4", "title": "FSSAI Food License", "prerequisites": ["2"]},
        {"id": "5", "title": "Health Trade License", "prerequisites": ["3", "4"]}
    ]
    solver = CivicDependencyEngine(sample_nodes)
    print("Topological Clearance Order:", solver.topological_sort())
    print("Ready next when [1] is completed:", solver.compute_unlocked_nodes({"1"}))
