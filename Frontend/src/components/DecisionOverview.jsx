export default function DecisionOverview({ summary }) {
  return (
    <div className="card">
      <h3 className="section-title">Decision Overview</h3>

      {/* Risk */}

      <div className="reco-card reco-danger">
        <span className="reco-badge badge-danger">DANGER</span>

        <div className="reco-title">
          {summary?.riskTitle || "High Risk Detected"}
        </div>

        <div className="reco-text">
          {summary?.riskMessage || "Immediate audit required"}
        </div>
      </div>

      {/* Growth */}

      <div style={{ marginTop: 12 }} className="reco-card reco-success">
        <span className="reco-badge badge-success">SUCCESS</span>

        <div className="reco-title">
          {summary?.growthTitle || "Revenue Stable"}
        </div>

        <div className="reco-text">
          {summary?.growthMessage || "Marketing can be increased"}
        </div>
      </div>
    </div>
  );
}
