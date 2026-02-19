import { useState } from "react";
import "./ExecutiveDashboard.css";
import DecisionOverview from "../components/DecisionOverview";
import ProjectedImpact from "../components/ProjectedImpact";


export default function ExecutiveDashboard() {

    const kpis = [
        { title: "Orders / Day", value: "1250", change: "+13.6%", trend: "up", status: "good" },
        { title: "GMV", value: "₹24L", change: "+4.2%", trend: "up", status: "good" },
        { title: "Net Revenue", value: "₹18L", change: "+2.5%", trend: "up", status: "good" },
        { title: "Cancellation %", value: "3.1%", change: "+0.5%", trend: "down", status: "warn" },
        { title: "Return %", value: "2.0%", change: "-0.2%", trend: "up", status: "good" },
        { title: "Seller Risk Score", value: "78", change: "High", trend: "down", status: "bad" }
    ];

    const [budget, setBudget] = useState({
        marketing: 30,
        logistics: 25,
        incentives: 15,
        fraud: 15,
        tech: 15
    });

    const total = Object.values(budget).reduce((a, b) => a + b, 0);

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
                    <TrendChart />
                </div>

                
                <div className="card">
                    <h3 className="section-title">Risk Indicators</h3>

                    <RiskItem
                        label="Seller Risk Gauge"
                        value="78"
                        state="critical"
                    />

                    <RiskItem
                        label="Cancellation Spike"
                        value="Warning"
                        state="warning"
                    />

                    <RiskItem
                        label="Revenue Drop"
                        value="Safe"
                        state="safe"
                    />
                </div>

            </div>

            
            <div className="bottom-grid">

            
                <div>
                    <DecisionOverview />
                    <ProjectedImpact />
                </div>

            
                <div>
                    <h3 className="section-title">Strategic Recommendations</h3>

                    <Reco
                        type="warning"
                        title="Improve logistics performance"
                        text="High cancellation detected in North zone. Review delivery partners immediately."
                    />

                    <Reco
                        type="danger"
                        title="Audit risky sellers"
                        text="Top 12 sellers show abnormal refund and dispute behavior."
                    />

                    <Reco
                        type="success"
                        title="Scale marketing campaigns"
                        text="Conversion and revenue trend support higher marketing spend."
                    />
                </div>

                
                <div className="card">
                    <h3 className="section-title">₹10 Lakh Budget Simulation</h3>

                    <p className="muted">Total allocation : {total}%</p>

                    <Slider label="Marketing" value={budget.marketing}
                        onChange={(v) => setBudget({ ...budget, marketing: v })} />

                    <Slider label="Logistics Improvement" value={budget.logistics}
                        onChange={(v) => setBudget({ ...budget, logistics: v })} />

                    <Slider label="Seller Incentives" value={budget.incentives}
                        onChange={(v) => setBudget({ ...budget, incentives: v })} />

                    <Slider label="Fraud Prevention" value={budget.fraud}
                        onChange={(v) => setBudget({ ...budget, fraud: v })} />

                    <Slider label="Technology" value={budget.tech}
                        onChange={(v) => setBudget({ ...budget, tech: v })} />
                </div>

            </div>


        
            <div className="card executive-box">
                <h3 className="section-title">Executive Decision Summary</h3>

                <ul>
                    <li><b>Are we profitable?</b> → Yes, revenue growing steadily.</li>
                    <li><b>Are we at risk?</b> → Seller risk and cancellations need attention.</li>
                    <li><b>Where should we act?</b> → Logistics + Seller audits.</li>
                    <li><b>If we invest ₹10L?</b> → Highest impact from marketing and logistics.</li>
                </ul>
            </div>

        </div>
    );
}



function KPI({ title, value, change, trend, status }) {
    return (
        <div className={`card kpi ${status}`}>
            <div className="kpi-title">{title}</div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-sub">
                {change} • {trend === "up" ? "↑" : "↓"}
            </div>
        </div>
    );
}

function TrendChart() {
    const data = [40, 55, 50, 65, 60, 75];

    return (
        <div className="trend-box">
            {data.map((v, i) => (
                <div
                    key={i}
                    className="trend-bar"
                    style={{ height: v }}
                />
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