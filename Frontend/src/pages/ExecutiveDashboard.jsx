import { useState, useEffect } from "react";
import "./ExecutiveDashboard.css";

import DecisionOverview from "../components/DecisionOverview";
import ProjectedImpact from "../components/ProjectedImpact";

import { fetchDashboardSummary, saveSheetData } from "../api/api";

/*  MAIN DASHBOARD */

export default function ExecutiveDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Budget Simulation  */

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

  /* ================= LOAD DASHBOARD ================= */

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await fetchDashboardSummary();

      setSummary(res);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ================= LOADER ================= */

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  /* ================= KPI DATA ================= */

  const kpis = [
    {
      title: "Total Revenue",
      value: summary?.totalRevenue || 0,
      trend: "up",
      status: "good",
    },
    {
      title: "Total Profit",
      value: summary?.totalProfit || 0,
      trend: "up",
      status: "good",
    },
    {
      title: "Profit Status",
      value: summary?.profitability || "N/A",
      trend: "up",
      status: "good",
    },
    {
      title: "Risk Level",
      value: summary?.riskStatus || "N/A",
      trend: "down",
      status: "warn",
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="dashboard-page">
      {/* ===== KPI ===== */}

      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <KPI key={i} {...k} />
        ))}
      </div>

      {/* ===== MIDDLE ===== */}

      <div className="mid-grid">
        {/* Revenue Chart */}

        <div className="card">
          <h3 className="section-title">Revenue Trend</h3>

          <RevenueTrendChart
            data={summary?.revenueTrend}
            labels={summary?.revenueLabels}
          />
        </div>

        {/* Risk Box */}

        <div className="card">
          <h3 className="section-title">Risk Indicators</h3>

          <RiskItem
            label="Overall Risk"
            value={summary?.riskStatus}
            state="warning"
          />

          <RiskItem
            label="Action Area"
            value={summary?.actionArea}
            state="safe"
          />

          <RiskItem
            label="Investment Impact"
            value={summary?.investmentImpact}
            state="critical"
          />
        </div>
      </div>

      {/* ===== BOTTOM ===== */}

      <div className="bottom-grid">
        {/* Left */}

        <div>
          <DecisionOverview summary={summary} />

          <ProjectedImpact summary={summary} />
        </div>

        {/* Recommendations */}

        <div>
          <h3 className="section-title">Strategic Recommendations</h3>

          <Reco
            type="warning"
            title="Improve logistics"
            text={summary?.logisticsAdvice}
          />

          <Reco
            type="danger"
            title="Audit sellers"
            text={summary?.sellerAdvice}
          />

          <Reco
            type="success"
            title="Boost marketing"
            text={summary?.marketingAdvice}
          />
        </div>

        {/* Budget */}

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
            <p
              style={{
                color: "#ff1744",
                fontWeight: 600,
              }}
            >
              ⚠ Allocation exceeded 100%
            </p>
          )}

          <Slider
            label="Marketing"
            value={budget.marketing}
            onChange={(v) => updateBudget("marketing", v)}
          />

          <Slider
            label="Logistics"
            value={budget.logistics}
            onChange={(v) => updateBudget("logistics", v)}
          />

          <Slider
            label="Incentives"
            value={budget.incentives}
            onChange={(v) => updateBudget("incentives", v)}
          />

          <Slider
            label="Fraud"
            value={budget.fraud}
            onChange={(v) => updateBudget("fraud", v)}
          />

          <Slider
            label="Technology"
            value={budget.tech}
            onChange={(v) => updateBudget("tech", v)}
          />
        </div>
      </div>


      <div className="card executive-box">
        <h3 className="section-title">Executive Summary</h3>
        <ul>
          <li>
            <b>Are we profitable?</b>→ {summary?.profitability}
          </li>

          <li>
            <b>Are we at risk?</b>→ {summary?.riskStatus}
          </li>

          <li>
            <b>Where should we act?</b>→ {summary?.actionArea}
          </li>

          <li>
            <b>If we invest ₹10L?</b>→ {summary?.investmentImpact}
          </li>
        </ul>
      </div>


      <ExecutiveEntryForm reload={loadDashboard} />
    </div>
  );
}

/* KPI CARD */

function KPI({ title, value, trend, status }) {
  return (
    <div className={`card kpi ${status}`}>
      <div className="kpi-title">{title}</div>

      <div className="kpi-value">{value}</div>

      <div className="kpi-sub">{trend === "up" ? "↑" : "↓"}</div>
    </div>
  );
}

/*  CHART */

function RevenueTrendChart({ data, labels }) {
  if (!data || data.length === 0) {
    return <p>No revenue data available</p>;
  }

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
    v,
  }));

  const linePath = "M " + points.map((p) => `${p.x} ${p.y}`).join(" L ");

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${height - padding}` +
    ` L ${points[0].x} ${height - padding} Z`;

  return (
    <div style={{ width: "100%" }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
        <path d={areaPath} fill="rgba(99,102,241,0.2)" />

        <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="3" />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" fill="#4f46e5" />
        ))}

        {labels?.map((lb, i) => (
          <text
            key={i}
            x={scaleX(i)}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#6b7280"
          >
            {lb}
          </text>
        ))}
      </svg>
    </div>
  );
}

/*  RISK */

function RiskItem({ label, value, state }) {
  return (
    <div className={`risk-row ${state}`}>
      <span>{label}</span>

      <b>{value}</b>
    </div>
  );
}

/*  RECO  */

function Reco({ type, title, text }) {
  return (
    <div className={`reco-card reco-${type}`}>
      <span className={`reco-badge badge-${type}`}>{type.toUpperCase()}</span>

      <div className="reco-title">{title}</div>

      <div className="reco-text">{text}</div>
    </div>
  );
}

/* SLIDER */

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

/* ================= FORM ================= */

function ExecutiveEntryForm({ reload }) {
  const productData = {
    Accessories: {
      logistics: 13898,
      manufacturing: 159875,
      price: 65776,
    },
    Mobile: {
      logistics: 22323,
      manufacturing: 211600,
      price: 23910,
    },
    Tablet: {
      logistics: 5671,
      manufacturing: 397266,
      price: 25069,
    },
  };

  const discountMap = {
    "1-10": 10,
    "11-20": 20,
    "21-30": 30,
    "31-40": 40,
    "41-50": 50,
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
    discount: 10,
  });

  const [error, setError] = useState("");

  /* ===== Product Change ===== */

  const handleProductChange = (e) => {
    const selected = e.target.value;

    setForm({
      ...form,
      product: selected,
      logisticsCost: productData[selected].logistics,
      manufacturingCost: productData[selected].manufacturing,
      pricePerUnit: productData[selected].price,
    });
  };

  /* ===== Units Change ===== */

  const handleUnitChange = (e) => {
    const selected = e.target.value;

    setForm({
      ...form,
      unitSold: selected,
      discount: Math.min(discountMap[selected], 50),
    });
  };

  /* ===== Submit ===== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date) {
      setError("Select date");
      return;
    }

    const units = Number(form.unitSold.split("-")[1]);

    const payload = {
      date: form.date,
      product: form.product,
      region: form.region,
      channel: form.channel,
      logisticsCost: form.logisticsCost,
      manufacturingCost: form.manufacturingCost,
      pricePerUnit: form.pricePerUnit,
      unitsSold: units,
      discount: form.discount,
    };

    try {
      await saveSheetData(payload);

      alert("Saved Successfully");

      reload();

      setError("");
    } catch (err) {
      console.error(err);

      setError("Save failed");
    }
  };

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h3 className="section-title">Sales / Order Entry</h3>

      <form onSubmit={handleSubmit} className="exec-form">
        {/* Date */}

        <Input
          label="Date *"
          type="date"
          value={form.date}
          onChange={(v) => setForm({ ...form, date: v })}
        />

        {/* Product */}

        <Select
          label="Product"
          value={form.product}
          options={["Accessories", "Mobile", "Tablet"]}
          onChange={handleProductChange}
        />

        {/* Region */}

        <Select
          label="Region"
          value={form.region}
          options={["North", "South", "East", "West"]}
          onChange={(e) =>
            setForm({
              ...form,
              region: e.target.value,
            })
          }
        />

        {/* Channel */}
        <Select
          label="Channel"
          value={form.channel}
          options={["Online", "Offline"]}
          onChange={(e) =>
            setForm({
              ...form,
              channel: e.target.value,
            })
          }
        />

        <ReadOnly label="Logistics Cost" value={form.logisticsCost} />
        <ReadOnly label="Manufacturing Cost" value={form.manufacturingCost} />
        <ReadOnly label="Price Per Unit" value={form.pricePerUnit} />

        {/* Units */}
        <Select
          label="Unit Sold"
          value={form.unitSold}
          options={["1-10", "11-20", "21-30", "31-40", "41-50"]}
          onChange={handleUnitChange}
        />

        <ReadOnly label="Discount (%)" value={form.discount} />

        {error && <p style={{ color: "#ff1744" }}>{error}</p>}

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}

/* SMALL COMPONENTS  */

function Input({ label, type, value, onChange }) {
  return (
    <div className="form-row">
      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div className="form-row">
      <label>{label}</label>

      <select value={value} onChange={onChange}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div className="form-row">
      <label>{label}</label>

      <input type="number" value={value} readOnly />
    </div>
  );
}
