export default function ProjectedImpact({ summary }) {
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 className="section-title">Projected Impact</h3>

      <p className="impact-positive">
        {summary?.expectedGrowth || "+0%"} Expected Revenue Growth
      </p>

      <p className="impact-risk">
        {summary?.riskReduction || "0%"} Risk Reduction
      </p>
    </div>
  );
}
