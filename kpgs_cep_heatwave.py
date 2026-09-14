"""
KPGS Group-By Data Science & Complex Event Processing (CEP) Heatwave Engine
=============================================================================
Provides domain-agnostic, multi-dimensional event stream processing, split-apply-combine
GroupBy analytics, temporal causality validation, and the Heat Wave thermal matrix.

Core Philosophy:
    "It's not about what it's used on; it's about the technique."

Invariants:
    REALITY_STATE > INDEX_STATE
    RECEIPT OR HOLD
    I_AM_STATELESS_RENTER_NOT_LANDLORD
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import UTC, datetime
from enum import Enum
from typing import Any


class StageMaturity(str, Enum):
    EVIDENCED = "EVIDENCED"
    PROCEDURAL = "PROCEDURAL"
    TAMPERED = "TAMPERED"
    MISSING = "MISSING"


class TemporalEpoch(str, Enum):
    T0 = "T0"  # Intake (Witness, Observation)
    T1 = "T1"  # Governance (Validation, Attestation)
    T2 = "T2"  # Consensus (Canonicalization, Ledgering)
    T3 = "T3"  # Finality (Time, Reveal)


class AnomalySeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AnomalyType(str, Enum):
    CAUSAL_INVERSION = "CAUSAL_INVERSION"
    STAGE_SKIPPED = "STAGE_SKIPPED"
    EVIDENCE_VOID = "EVIDENCE_VOID"
    LATENCY_SPIKE = "LATENCY_SPIKE"
    TAMPER_DETECTED = "TAMPER_DETECTED"
    POLICY_BREACH = "POLICY_BREACH"


STAGE_NAMES: dict[int, str] = {
    1: "STAGE_1_WITNESS",
    2: "STAGE_2_OBSERVATION",
    3: "STAGE_3_VALIDATION",
    4: "STAGE_4_ATTESTATION",
    5: "STAGE_5_CANONICALIZATION",
    6: "STAGE_6_LEDGERING",
    7: "STAGE_7_TIME",
    8: "STAGE_8_REVEAL",
}

STAGE_EPOCHS: dict[int, TemporalEpoch] = {
    1: TemporalEpoch.T0,
    2: TemporalEpoch.T0,
    3: TemporalEpoch.T1,
    4: TemporalEpoch.T1,
    5: TemporalEpoch.T2,
    6: TemporalEpoch.T2,
    7: TemporalEpoch.T3,
    8: TemporalEpoch.T3,
}

EPOCH_ORDER: dict[TemporalEpoch, int] = {
    TemporalEpoch.T0: 0,
    TemporalEpoch.T1: 1,
    TemporalEpoch.T2: 2,
    TemporalEpoch.T3: 3,
}


@dataclass(frozen=True)
class KPGSProofEvent:
    """Multi-dimensional data point emitted by an 8-stage proof run."""

    event_id: str
    trace_id: str
    dns_zone: str  # e.g. kasilink.com, lefa-ai.internal, kopano-labs.com
    stage_id: int  # 1 to 8
    stage_name: str
    epoch: TemporalEpoch
    timestamp: float  # Unix epoch seconds
    latency_ms: float
    maturity: StageMaturity
    risk_ratio: float  # Normalized 0.0 to 1.0 (loss / limit)
    hash_digest: str  # SHA-256 evidence hash
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class CEPAnomaly:
    """Complex Event Processing anomaly detected in temporal or state causality."""

    anomaly_type: AnomalyType
    dns_zone: str
    trace_id: str
    stage_id: int
    severity: AnomalySeverity
    detail: str
    timestamp: float = field(default_factory=lambda: datetime.now(UTC).timestamp())


class CEPStreamProcessor:
    """Complex Event Processor validating temporal causality across 8-stage streams."""

    def __init__(
        self,
        latency_threshold_ms: float = 250.0,
        risk_ceiling: float = 1.0,
    ) -> None:
        self.latency_threshold_ms = latency_threshold_ms
        self.risk_ceiling = risk_ceiling
        self._traces: dict[str, list[KPGSProofEvent]] = {}
        self._anomalies: list[CEPAnomaly] = []

    def ingest(self, event: KPGSProofEvent) -> list[CEPAnomaly]:
        """Ingests a single proof event, validates invariants, and returns any new anomalies."""
        new_anomalies: list[CEPAnomaly] = []

        if event.trace_id not in self._traces:
            self._traces[event.trace_id] = []

        trace_events = self._traces[event.trace_id]

        # 1. Check for Causal Inversion (Epoch or Stage Regression)
        for prev in trace_events:
            if prev.stage_id > event.stage_id:
                anomaly = CEPAnomaly(
                    anomaly_type=AnomalyType.CAUSAL_INVERSION,
                    dns_zone=event.dns_zone,
                    trace_id=event.trace_id,
                    stage_id=event.stage_id,
                    severity=AnomalySeverity.CRITICAL,
                    detail=(
                        f"Stage {event.stage_id} ({event.stage_name}) arrived after "
                        f"Stage {prev.stage_id} ({prev.stage_name})"
                    ),
                )
                new_anomalies.append(anomaly)

            if EPOCH_ORDER[prev.epoch] > EPOCH_ORDER[event.epoch]:
                anomaly = CEPAnomaly(
                    anomaly_type=AnomalyType.CAUSAL_INVERSION,
                    dns_zone=event.dns_zone,
                    trace_id=event.trace_id,
                    stage_id=event.stage_id,
                    severity=AnomalySeverity.CRITICAL,
                    detail=(
                        f"Temporal regression: Epoch {event.epoch.value} after {prev.epoch.value}"
                    ),
                )
                new_anomalies.append(anomaly)

        # 2. Check for Evidence Void / Tamper
        if event.maturity == StageMaturity.TAMPERED:
            new_anomalies.append(
                CEPAnomaly(
                    anomaly_type=AnomalyType.TAMPER_DETECTED,
                    dns_zone=event.dns_zone,
                    trace_id=event.trace_id,
                    stage_id=event.stage_id,
                    severity=AnomalySeverity.CRITICAL,
                    detail=f"Cryptographic hash digest mismatch at stage {event.stage_id}",
                )
            )
        elif event.maturity in (StageMaturity.MISSING, StageMaturity.PROCEDURAL):
            new_anomalies.append(
                CEPAnomaly(
                    anomaly_type=AnomalyType.EVIDENCE_VOID,
                    dns_zone=event.dns_zone,
                    trace_id=event.trace_id,
                    stage_id=event.stage_id,
                    severity=AnomalySeverity.HIGH,
                    detail=f"Stage {event.stage_id} executed with {event.maturity.value} maturity",
                )
            )

        # 3. Check for Latency Spike
        if event.latency_ms > self.latency_threshold_ms:
            new_anomalies.append(
                CEPAnomaly(
                    anomaly_type=AnomalyType.LATENCY_SPIKE,
                    dns_zone=event.dns_zone,
                    trace_id=event.trace_id,
                    stage_id=event.stage_id,
                    severity=AnomalySeverity.MEDIUM,
                    detail=f"Stage latency {event.latency_ms:.1f}ms exceeds threshold {self.latency_threshold_ms}ms",
                )
            )

        # 4. Check for Risk Ceiling Breach
        if event.risk_ratio > self.risk_ceiling:
            new_anomalies.append(
                CEPAnomaly(
                    anomaly_type=AnomalyType.POLICY_BREACH,
                    dns_zone=event.dns_zone,
                    trace_id=event.trace_id,
                    stage_id=event.stage_id,
                    severity=AnomalySeverity.CRITICAL,
                    detail=f"Risk ratio {event.risk_ratio:.3f} breached hard ceiling {self.risk_ceiling}",
                )
            )

        trace_events.append(event)
        self._anomalies.extend(new_anomalies)
        return new_anomalies

    def verify_trace_completeness(self, trace_id: str) -> list[CEPAnomaly]:
        """Verifies if all 8 stages were completed without omission for a given trace."""
        trace_events = self._traces.get(trace_id, [])
        present_stages = {e.stage_id for e in trace_events}
        expected_stages = set(range(1, 9))
        missing = expected_stages - present_stages

        anomalies: list[CEPAnomaly] = []
        dns_zone = trace_events[0].dns_zone if trace_events else "unknown"

        for stage in sorted(missing):
            anomaly = CEPAnomaly(
                anomaly_type=AnomalyType.STAGE_SKIPPED,
                dns_zone=dns_zone,
                trace_id=trace_id,
                stage_id=stage,
                severity=AnomalySeverity.CRITICAL,
                detail=f"Stage {stage} ({STAGE_NAMES.get(stage, 'UNKNOWN')}) was skipped in proof chain",
            )
            anomalies.append(anomaly)
            self._anomalies.append(anomaly)

        return anomalies

    @property
    def anomalies(self) -> list[CEPAnomaly]:
        return list(self._anomalies)

    def clear(self) -> None:
        self._traces.clear()
        self._anomalies.clear()


@dataclass(frozen=True)
class GroupByMetrics:
    """Statistical aggregations computed for a cohort of events."""

    dns_zone: str
    stage_id: int
    count: int
    mean_latency_ms: float
    std_latency_ms: float
    p50_latency_ms: float
    p95_latency_ms: float
    p99_latency_ms: float
    evidence_ratio: float  # 0.0 to 1.0
    mean_risk_ratio: float
    max_risk_ratio: float
    anomaly_count: int
    temperature: float  # Heat Wave temperature in [0.0, 1.0]


class GroupByDataScienceEngine:
    """Split-apply-combine analytics engine over multi-dimensional event streams."""

    @staticmethod
    def _percentile(values: list[float], p: float) -> float:
        """Calculates exact empirical percentile."""
        if not values:
            return 0.0
        sorted_vals = sorted(values)
        k = (len(sorted_vals) - 1) * p
        f = math.floor(k)
        c = math.ceil(k)
        if f == c:
            return sorted_vals[int(k)]
        d0 = sorted_vals[int(f)] * (c - k)
        d1 = sorted_vals[int(c)] * (k - f)
        return d0 + d1

    @classmethod
    def aggregate(
        cls,
        events: list[KPGSProofEvent],
        anomalies: list[CEPAnomaly] | None = None,
        max_nominal_latency: float = 100.0,
    ) -> list[GroupByMetrics]:
        """Performs GroupBy over (dns_zone, stage_id) and computes comprehensive statistical metrics."""
        anomalies = anomalies or []

        # Count anomalies per (dns_zone, stage_id)
        anomaly_counts: dict[tuple[str, int], int] = {}
        for a in anomalies:
            key = (a.dns_zone, a.stage_id)
            anomaly_counts[key] = anomaly_counts.get(key, 0) + 1

        # Split: group events by (dns_zone, stage_id)
        groups: dict[tuple[str, int], list[KPGSProofEvent]] = {}
        for ev in events:
            key = (ev.dns_zone, ev.stage_id)
            if key not in groups:
                groups[key] = []
            groups[key].append(ev)

        results: list[GroupByMetrics] = []

        # Apply-Combine: compute metrics per group
        for (dns_zone, stage_id), group_events in sorted(groups.items()):
            n = len(group_events)
            latencies = [e.latency_ms for e in group_events]
            mean_lat = sum(latencies) / n
            variance = sum((x - mean_lat) ** 2 for x in latencies) / n if n > 1 else 0.0
            std_lat = math.sqrt(variance)

            p50_lat = cls._percentile(latencies, 0.50)
            p95_lat = cls._percentile(latencies, 0.95)
            p99_lat = cls._percentile(latencies, 0.99)

            evidenced_count = sum(1 for e in group_events if e.maturity == StageMaturity.EVIDENCED)
            evidence_ratio = evidenced_count / n

            risk_ratios = [e.risk_ratio for e in group_events]
            mean_risk = sum(risk_ratios) / n
            max_risk = max(risk_ratios) if risk_ratios else 0.0

            anom_cnt = anomaly_counts.get((dns_zone, stage_id), 0)

            # ── Heat Wave Thermal Formulation ──
            # Theta = w_L * normalized_latency + w_E * (1 - evidence_ratio) + w_R * max_risk + w_A * anomaly_factor
            w_l, w_e, w_r, w_a = 0.20, 0.40, 0.20, 0.20

            norm_lat = min(1.0, mean_lat / max_nominal_latency)
            evidence_penalty = 1.0 - evidence_ratio
            risk_term = min(1.0, max_risk)
            anomaly_term = min(1.0, anom_cnt / max(1, n))

            temperature = (
                w_l * norm_lat + w_e * evidence_penalty + w_r * risk_term + w_a * anomaly_term
            )
            temperature = max(0.0, min(1.0, round(temperature, 4)))

            results.append(
                GroupByMetrics(
                    dns_zone=dns_zone,
                    stage_id=stage_id,
                    count=n,
                    mean_latency_ms=round(mean_lat, 2),
                    std_latency_ms=round(std_lat, 2),
                    p50_latency_ms=round(p50_lat, 2),
                    p95_latency_ms=round(p95_lat, 2),
                    p99_latency_ms=round(p99_lat, 2),
                    evidence_ratio=round(evidence_ratio, 4),
                    mean_risk_ratio=round(mean_risk, 4),
                    max_risk_ratio=round(max_risk, 4),
                    anomaly_count=anom_cnt,
                    temperature=temperature,
                )
            )

        return results


class ThermalZone(str, Enum):
    FROST = "FROST"  # 0.00 <= Theta < 0.25 (Pristine, Sub-ms, 100% Evidenced)
    TEMPERATE = "TEMPERATE"  # 0.25 <= Theta < 0.50 (Nominal Operation)
    WARMING = "WARMING"  # 0.50 <= Theta < 0.75 (Caution: Latency/Risk Elevated)
    HEAT_WAVE = "HEAT_WAVE"  # 0.75 <= Theta <= 1.00 (Critical Accountability Breach)


@dataclass
class HeatWaveMatrix:
    """2D thermal matrix mapping DNS zones to stage accountability temperatures."""

    metrics: list[GroupByMetrics]
    generated_at: str = field(default_factory=lambda: datetime.now(UTC).isoformat())

    def get_temperature(self, dns_zone: str, stage_id: int) -> float:
        for m in self.metrics:
            if m.dns_zone == dns_zone and m.stage_id == stage_id:
                return m.temperature
        return 0.0

    @staticmethod
    def classify_zone(temp: float) -> ThermalZone:
        if temp < 0.25:
            return ThermalZone.FROST
        if temp < 0.50:
            return ThermalZone.TEMPERATE
        if temp < 0.75:
            return ThermalZone.WARMING
        return ThermalZone.HEAT_WAVE

    def check_accountability_lock(self, threshold: float = 0.75) -> list[dict[str, Any]]:
        """Identifies breaches that trip the fail-closed RECEIPT OR HOLD accountability circuit."""
        locks: list[dict[str, Any]] = []
        for m in self.metrics:
            if m.temperature >= threshold:
                locks.append(
                    {
                        "dns_zone": m.dns_zone,
                        "stage_id": m.stage_id,
                        "stage_name": STAGE_NAMES.get(m.stage_id, "UNKNOWN"),
                        "temperature": m.temperature,
                        "thermal_zone": self.classify_zone(m.temperature).value,
                        "evidence_ratio": m.evidence_ratio,
                        "mean_latency_ms": m.mean_latency_ms,
                        "anomaly_count": m.anomaly_count,
                        "action": "TRIGGER_FAIL_CLOSED_HOLD",
                    }
                )
        return locks

    def render_ascii(self) -> str:
        """Renders an institutional ASCII / Unicode Heat Wave dashboard."""
        dns_zones = sorted({m.dns_zone for m in self.metrics})
        if not dns_zones:
            return "No proof telemetry available to render Heat Wave matrix."

        lines: list[str] = [
            "=" * 86,
            "  🌡️ KPGS MULTI-DIMENSIONAL HEAT WAVE ACCOUNTABILITY MATRIX",
            f"  Generated: {self.generated_at}  |  Lock Threshold: Θ ≥ 0.75",
            "=" * 86,
            "  Stage Legend: S1:Wit | S2:Obs | S3:Val | S4:Att | S5:Can | S6:Led | S7:Tim | S8:Rev",
            "  Thermal Code: 🧊 FROST (<.25)  🟢 TEMPERATE (<.50)  🟡 WARMING (<.75)  🔥 HEAT WAVE (≥.75)",
            "-" * 86,
            f"{'DNS ZONE':<24} | {'S1':^6} {'S2':^6} {'S3':^6} {'S4':^6} {'S5':^6} {'S6':^6} {'S7':^6} {'S8':^6} | {'STATUS':^10}",
            "-" * 86,
        ]

        for dns in dns_zones:
            stage_cells = []
            max_temp = 0.0
            for s in range(1, 9):
                t = self.get_temperature(dns, s)
                max_temp = max(max_temp, t)
                badge = "🧊" if t < 0.25 else ("🟢" if t < 0.50 else ("🟡" if t < 0.75 else "🔥"))
                stage_cells.append(f"{badge}{t:.2f}")

            row_status = (
                "PASS ✅" if max_temp < 0.50 else ("CAUTION ⚠️" if max_temp < 0.75 else "LOCK 🔒")
            )
            line = f"{dns:<24} | {' '.join(stage_cells)} | {row_status:^10}"
            lines.append(line)

        lines.append("=" * 86)
        locks = self.check_accountability_lock()
        if locks:
            lines.append(f"  🚨 ACTIVE ACCOUNTABILITY LOCKOUTS ({len(locks)} Breaches Detected):")
            for lk in locks:
                lines.append(
                    f"     • [{lk['dns_zone']}] Stage {lk['stage_id']} ({lk['stage_name']}): "
                    f"Θ={lk['temperature']:.4f} ({lk['thermal_zone']}) -> HOLD MUTATIONS"
                )
            lines.append("=" * 86)
        else:
            lines.append("  🛡️ PROVENANCE POSTURE: 100% ACCOUNTABLE ACROSS ALL DNS ZONES")
            lines.append("=" * 86)

        return "\n".join(lines)

    def to_dict(self) -> dict[str, Any]:
        """Serializes matrix to JSON-ready dictionary."""
        return {
            "generated_at": self.generated_at,
            "metrics": [
                {
                    "dns_zone": m.dns_zone,
                    "stage_id": m.stage_id,
                    "stage_name": STAGE_NAMES.get(m.stage_id, "UNKNOWN"),
                    "count": m.count,
                    "mean_latency_ms": m.mean_latency_ms,
                    "std_latency_ms": m.std_latency_ms,
                    "p50_latency_ms": m.p50_latency_ms,
                    "p95_latency_ms": m.p95_latency_ms,
                    "p99_latency_ms": m.p99_latency_ms,
                    "evidence_ratio": m.evidence_ratio,
                    "mean_risk_ratio": m.mean_risk_ratio,
                    "max_risk_ratio": m.max_risk_ratio,
                    "anomaly_count": m.anomaly_count,
                    "temperature": m.temperature,
                    "thermal_zone": self.classify_zone(m.temperature).value,
                }
                for m in self.metrics
            ],
            "locks": self.check_accountability_lock(),
        }
