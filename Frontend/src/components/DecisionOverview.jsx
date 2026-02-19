export default function DecisionOverview() {
  return (
    <div className="card">

      <h3 className="section-title">Decision Overview</h3>

      <div className="reco-card reco-danger">
        <span className="reco-badge badge-danger">DANGER</span>
        <div className="reco-title">High Seller Risk Detected</div>
        <div className="reco-text">
          Audit top risky sellers immediately.
        </div>
      </div>

      <div style={{ marginTop: 12 }} className="reco-card reco-success">
        <span className="reco-badge badge-success">SUCCESS</span>
        <div className="reco-title">Revenue Growing Steadily</div>
        <div className="reco-text">
          Consider increasing marketing investment.
        </div>
      </div>

    </div>
  );
}

