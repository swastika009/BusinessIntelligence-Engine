import { useState, useEffect } from "react";
import "./ExecutiveDashboard.css";

import DecisionOverview from "../components/DecisionOverview";
import ProjectedImpact from "../components/ProjectedImpact";

import { fetchDashboardSummary, fetchKPI, fetchHealth } from "../api/api";

export default function ExecutiveDashboard() {

  const [summary, setSummary] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [budget, setBudget] = useState({
    marketing: 30,
    logistics: 25,
    incentives: 15,
    fraud: 15,
    tech: 15,
  });

  const total = Object.values(budget).reduce((a, b) => a + b, 0);
  const showLowBudgetMessage = total > 100;

  const updateBudget = (key, value) => {
    setBudget({ ...budget, [key]: value });
  };

  useEffect(() => {
    async function loadData() {
      try {
        const summaryRes = await fetchDashboardSummary();
        const kpiRes = await fetchKPI();
        const healthRes = await fetchHealth();

        setSummary(summaryRes);
        setKpiData(kpiRes);
        setHealthData(healthRes);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  const kpis = [
    { title: "Total Records", value: kpiData?.totalRecords || 0, trend: "up", status: "good" },
    { title: "Health Records", value: healthData?.totalRecords || 0, trend: "up", status: "good" },
    { title: "Profit Status", value: summary?.profitability || "N/A", trend: "up", status: "good" },
    { title: "Risk Level", value: summary?.riskStatus || "N/A", trend: "down", status: "warn" },
  ];

  return (
    <div className="dashboard-page">

      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <KPI key={i} {...k} />
        ))}
      </div>

      <div className="mid-grid">

        <div className="card">
          <h3 className="section-title">Revenue Trend</h3>

          <RevenueTrendChart
            data={summary?.revenueTrend || [42, 48, 46, 52, 60, 58, 66]}
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
          />
        </div>

        <div className="card">
          <h3 className="section-title">Risk Indicators</h3>

          <RiskItem label="Overall Risk" value={summary?.riskStatus || "N/A"} state="warning" />
          <RiskItem label="Action Area" value={summary?.actionArea || "N/A"} state="safe" />
          <RiskItem
            label="Investment Impact"
            value={summary?.investmentImpact || "N/A"}
            state="critical"
          />
        </div>

      </div>

      <div className="bottom-grid">
        <div>
          <DecisionOverview summary={summary} />
          <ProjectedImpact summary={summary} />
        </div>

        <div>
          <h3 className="section-title">Strategic Recommendations</h3>

          <Reco type="warning" title="Improve logistics" text={summary?.logisticsAdvice || "Review delivery performance"} />
          <Reco type="danger" title="Audit sellers" text={summary?.sellerAdvice || "Audit risky sellers"} />
          <Reco type="success" title="Boost marketing" text={summary?.marketingAdvice || "Increase campaigns"} />
        </div>

        <div className="card">
          <h3 className="section-title">₹10 Lakh Budget Simulation</h3>

          <p className="muted">
            Total Allocation :
            <span
              style={{
                color: showLowBudgetMessage ? "#ff1744" : "#00c853",
                fontWeight: 600,
              }}
            >
              {" "}
              {total}%
            </span>
          </p>

          {showLowBudgetMessage && (
            <p style={{ color: "#ff1744", fontWeight: 600 }}>
              ⚠ Low Budget: Allocation exceeded 100%.
            </p>
          )}

          <Slider label="Marketing" value={budget.marketing} onChange={(v) => updateBudget("marketing", v)} />
          <Slider label="Logistics" value={budget.logistics} onChange={(v) => updateBudget("logistics", v)} />
          <Slider label="Incentives" value={budget.incentives} onChange={(v) => updateBudget("incentives", v)} />
          <Slider label="Fraud Control" value={budget.fraud} onChange={(v) => updateBudget("fraud", v)} />
          <Slider label="Technology" value={budget.tech} onChange={(v) => updateBudget("tech", v)} />
        </div>
      </div>

      <div className="card executive-box">
        <h3 className="section-title">Executive Summary</h3>

        <ul>
          <li><b>Are we profitable?</b> → {summary?.profitability || "N/A"}</li>
          <li><b>Are we at risk?</b> → {summary?.riskStatus || "N/A"}</li>
          <li><b>Where should we act?</b> → {summary?.actionArea || "N/A"}</li>
          <li><b>If we invest ₹10L?</b> → {summary?.investmentImpact || "N/A"}</li>
        </ul>
      </div>


      <ExecutiveEntryForm />

    </div>
  );
}


function KPI({ title, value, trend, status }) {
  return (
    <div className={`card kpi ${status}`}>
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{trend === "up" ? "↑" : "↓"}</div>
    </div>
  );
}


function RevenueTrendChart({ data, labels }) {

  const width = 900;
  const height = 360;
  const padding = 55;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const scaleX = (i) =>
    padding + (i * (width - padding * 2)) / (data.length - 1);

  const scaleY = (v) =>
    padding + ((max - v) / (max - min || 1)) * (height - padding * 2);

  const points = data.map((v, i) => ({
    x: scaleX(i),
    y: scaleY(v),
    v
  }));

  const linePath =
    "M " + points.map(p => `${p.x} ${p.y}`).join(" L ");

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${height - padding}` +
    ` L ${points[0].x} ${height - padding} Z`;

  const gridLines = 5;

  return (
    <div style={{ width: "100%", overflowX: "auto", paddingBottom: 6 }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
      >
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[...Array(gridLines + 1)].map((_, i) => {
          const y =
            padding + (i * (height - padding * 2)) / gridLines;

          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="5 5"
            />
          );
        })}

        <path d={areaPath} fill="url(#revGrad)" />

        <path
          d={linePath}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="4"
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6" fill="#4f46e5" />
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              fontSize="12"
              fill="#1f2933"
              fontWeight="600"
            >
              {p.v}
            </text>
          </g>
        ))}

        {labels?.map((lb, i) => (
          <text
            key={i}
            x={scaleX(i)}
            y={height - 15}
            textAnchor="middle"
            fontSize="13"
            fill="#6b7280"
          >
            {lb}
          </text>
        ))}
      </svg>
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



function ExecutiveEntryForm() {

  const productData = {
    Accessories: { logistics: 13898, manufacturing: 159875, price: 65776 },
    Mobile: { logistics: 22323, manufacturing: 211600, price: 23910 },
    Tablet: { logistics: 5671, manufacturing: 397266, price: 25069 }
  };

  const discountMap = {
    "1-10": 10,
    "11-20": 20,
    "21-30": 30,
    "31-40": 40,
    "41-50": 50
  };

  const [form, setForm] = useState({
    date: "",
    product: "Accessories",
    region: "North",
    channel: "Online",
    logisticsCost: 13898,
    manufacturingCost: 159875,
    pricePerUnit: 65776,
    unitSold: "1-10",
    discount: 10
  });

  const [error, setError] = useState("");

  const handleProductChange = (e) => {
    const selected = e.target.value;

    setForm({
      ...form,
      product: selected,
      logisticsCost: productData[selected].logistics,
      manufacturingCost: productData[selected].manufacturing,
      pricePerUnit: productData[selected].price
    });
  };

  const handleUnitChange = (e) => {
    const selected = e.target.value;

    setForm({
      ...form,
      unitSold: selected,
      discount: Math.min(discountMap[selected], 50)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.date) {
      setError("Please select date");
      return;
    }

    setError("");
    console.log("Final Form Data :", form);
    alert("Form submitted successfully");

    setForm({
      date: "",
      product: "Accessories",
      region: "North",
      channel: "Online",
      logisticsCost: 13898,
      manufacturingCost: 159875,
      pricePerUnit: 65776,
      unitSold: "1-10",
      discount: 10
    });
  };

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h3 className="section-title">Sales / Order Entry</h3>

      <form onSubmit={handleSubmit} className="exec-form">

        <div className="form-row">
          <label>Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="form-row">
          <label>Product</label>
          <select value={form.product} onChange={handleProductChange}>
            <option>Accessories</option>
            <option>Mobile</option>
            <option>Tablet</option>
          </select>
        </div>

        <div className="form-row">
          <label>Region</label>
          <select
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          >
            <option>North</option>
            <option>South</option>
            <option>East</option>
            <option>West</option>
          </select>
        </div>

        <div className="form-row">
          <label>Channel</label>
          <select
            value={form.channel}
            onChange={(e) => setForm({ ...form, channel: e.target.value })}
          >
            <option>Online</option>
            <option>Offline</option>
          </select>
        </div>

        <div className="form-row">
          <label>Logistics Cost</label>
          <input type="number" value={form.logisticsCost} readOnly />
        </div>

        <div className="form-row">
          <label>Manufacturing Cost</label>
          <input type="number" value={form.manufacturingCost} readOnly />
        </div>

        <div className="form-row">
          <label>Price Per Unit</label>
          <input type="number" value={form.pricePerUnit} readOnly />
        </div>

        <div className="form-row">
          <label>Unit Sold</label>
          <select value={form.unitSold} onChange={handleUnitChange}>
            <option>1-10</option>
            <option>11-20</option>
            <option>21-30</option>
            <option>31-40</option>
            <option>41-50</option>
          </select>
        </div>

        <div className="form-row">
          <label>Discount (%)</label>
          <input type="number" value={form.discount} readOnly />
        </div>

        {error && (
          <p style={{ color: "#ff1744", fontWeight: 600 }}>
            {error}
          </p>
        )}

                <button type="submit" className="submit-btn">
          Submit
        </button>

      </form>
    </div>
  );
}