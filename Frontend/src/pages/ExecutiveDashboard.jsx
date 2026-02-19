import { useState, useEffect } from "react";
import "./ExecutiveDashboard.css";

import DecisionOverview from "../components/DecisionOverview";
import ProjectedImpact from "../components/ProjectedImpact";

import { fetchDashboardSummary, fetchKPI, fetchHealth } from "../api/api";

export default function ExecutiveDashboard() {
  /*  STATES  */

  const [summary, setSummary] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [healthData, setHealthData] = useState(null);

  const [loading, setLoading] = useState(true);

  /*  BUDGET SIMULATION  */

  const [budget, setBudget] = useState({
    marketing: 30,
    logistics: 25,
    incentives: 15,
    fraud: 15,
    tech: 15,
  });

  const total = Object.values(budget).reduce((a, b) => a + b, 0);

  /*  API CALL  */

  useEffect(() => {
    async function loadData() {
      try {
        const summaryRes = await fetchDashboardSummary();
        const kpiRes = await fetchKPI();
        const healthRes = await fetchHealth();

        setSummary(summaryRes);
        setKpiData(kpiRes);
        setHealthData(healthRes);

        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /*  LOADER  */

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  /*  KPI FROM BACKEND  */

  const kpis = [
    {
      title: "Total Records",
      value: kpiData?.totalRecords || 0,
      change: "",
      trend: "up",
      status: "good",
    },
    {
      title: "Health Records",
      value: healthData?.totalRecords || 0,
      change: "",
      trend: "up",
      status: "good",
    },
    {
      title: "Profit Status",
      value: summary?.profitability || "N/A",
      change: "",
      trend: "up",
      status: "good",
    },
    {
      title: "Risk Level",
      value: summary?.riskStatus || "N/A",
      change: "",
      trend: "down",
      status: "warn",
    },
  ];

  /*  UI  */

  return (
    <div className="dashboard-page">
      {/*  KPI  */}

      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <KPI key={i} {...k} />
        ))}
      </div>

      {/*  MID GRID  */}

      <div className="mid-grid">
        <div className="card">
          <h3 className="section-title">Revenue Trend</h3>
          <TrendChart />
        </div>

        <div className="card">
          <h3 className="section-title">Risk Indicators</h3>

          <RiskItem
            label="Overall Risk"
            value={summary?.riskStatus || "N/A"}
            state="warning"
          />

          <RiskItem
            label="Action Area"
            value={summary?.actionArea || "N/A"}
            state="safe"
          />

          <RiskItem
            label="Investment Impact"
            value={summary?.investmentImpact || "N/A"}
            state="critical"
          />
        </div>
      </div>

      {/*  BOTTOM GRID  */}

      <div className="bottom-grid">
        <div>
          <DecisionOverview summary={summary} />

          <ProjectedImpact summary={summary} />
        </div>

        {/*  RECOMMENDATIONS  */}

        <div>
          <h3 className="section-title">Strategic Recommendations</h3>

          <Reco
            type="warning"
            title="Improve logistics"
            text={summary?.logisticsAdvice || "Review delivery performance"}
          />

          <Reco
            type="danger"
            title="Audit sellers"
            text={summary?.sellerAdvice || "Audit risky sellers"}
          />

          <Reco
            type="success"
            title="Boost marketing"
            text={summary?.marketingAdvice || "Increase campaigns"}
          />
        </div>

        {/*  BUDGET */}

        <div className="card">
          <h3 className="section-title">₹10 Lakh Budget Simulation</h3>

          <p className="muted">Total Allocation : {total}%</p>

          <Slider
            label="Marketing"
            value={budget.marketing}
            onChange={(v) => setBudget({ ...budget, marketing: v })}
          />

          <Slider
            label="Logistics"
            value={budget.logistics}
            onChange={(v) => setBudget({ ...budget, logistics: v })}
          />

          <Slider
            label="Incentives"
            value={budget.incentives}
            onChange={(v) => setBudget({ ...budget, incentives: v })}
          />

          <Slider
            label="Fraud Control"
            value={budget.fraud}
            onChange={(v) => setBudget({ ...budget, fraud: v })}
          />

          <Slider
            label="Technology"
            value={budget.tech}
            onChange={(v) => setBudget({ ...budget, tech: v })}
          />
        </div>
      </div>

      {/*  SUMMARY */}

      <div className="card executive-box">
        <h3 className="section-title">Executive Summary</h3>

        <ul>
          <li>
            <b>Are we profitable?</b> → {summary?.profitability}
          </li>

          <li>
            <b>Are we at risk?</b> → {summary?.riskStatus}
          </li>

          <li>
            <b>Where should we act?</b> → {summary?.actionArea}
          </li>

          <li>
            <b>If we invest ₹10L?</b> → {summary?.investmentImpact}
          </li>
        </ul>
      </div>
    </div>
  );
}

/*  COMPONENTS */

function KPI({ title, value, change, trend, status }) {
  return (
    <div className={`card kpi ${status}`}>
      <div className="kpi-title">{title}</div>

      <div className="kpi-value">{value}</div>

      <div className="kpi-sub">
        {change} {trend === "up" ? "↑" : "↓"}
      </div>
    </div>
  );
}

function TrendChart() {
  const data = [40, 55, 50, 65, 60, 75];

  return (
    <div className="trend-box">
      {data.map((v, i) => (
        <div key={i} className="trend-bar" style={{ height: v }} />
      ))}
    </div>
  );
}

function RiskItem({ label, value, state }) {
  return (
    <div className={`risk-row ${state}`}>
      <span>{label}</span>

      <b>{value}</b>
    </div>
  );
}

function Reco({ type, title, text }) {
  return (
    <div className={`reco-card reco-${type}`}>
      <span className={`reco-badge badge-${type}`}>{type.toUpperCase()}</span>

      <div className="reco-title">{title}</div>

      <div className="reco-text">{text}</div>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <div className="slider-block">
      <div className="slider-head">
        <span>{label}</span>

        <span>{value}%</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
