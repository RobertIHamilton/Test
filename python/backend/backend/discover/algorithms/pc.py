import logging
from typing import Any, Literal

import networkx as nx
from castle.algorithms import PC

from backend.discover.algorithms.commons.base_runner import CausalDiscoveryRunner, CausalGraph, ProgressCallback
from backend.discover.model.causal_discovery import CausalDiscoveryPayload


class PCPayload(CausalDiscoveryPayload):
    variant: Literal["original", "stable"] = "original"
    alpha: float = 0.05
    ci_test: Literal["gauss", "g2", "chi2"] = "gauss"


class PCRunner(CausalDiscoveryRunner):
    name = "PC"

    def __init__(self, p: PCPayload, progress_callback: ProgressCallback = None):
        super().__init__(p, progress_callback)
        self._variant = p.variant
        self._alpha = p.alpha
        self._ci_test = p.ci_test

    def do_causal_discovery(self) -> CausalGraph:
        self._encode_categorical_as_integers()

        causal_graph = self._build_causal_graph(
            labeled_graph=self._build_labeled_graph(),
            has_weights=False,
            has_confidence_values=False,
        )

        self._report_progress(100.0)

        return causal_graph

    def _build_labeled_graph(self) -> Any:
        logging.info(f"Running PC with variant={self._variant}, alpha={self._alpha} and ci_test={self._ci_test}")

        pc = PC(variant=self._variant, alpha=self._alpha, ci_test=self._ci_test)

        pc.learn(self._prepared_data.to_numpy())

        pc_graph = nx.DiGraph(pc.causal_matrix)

        # remove weights automatically created by
        # networkx since PC returns the causal graph
        # without weights
        self._remove_weights(pc_graph)

        return nx.relabel_nodes(
            pc_graph,
            self._get_labels_map(),
        )

    def _remove_weights(self, graph: nx.DiGraph):
        for _n1, _n2, d in graph.edges(data=True):
            del d["weight"]
