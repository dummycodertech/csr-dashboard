import ChartCard from './ChartCard'
import KPIStrip from './kpi/KPIStrip'
import FilterBadges from './filters/FilterBadges'

// Original charts
import HeadcountByBusiness  from './charts/HeadcountByBusiness'
import GenderRatio          from './charts/GenderRatio'
import AgeGroupDistribution from './charts/AgeGroupDistribution'
import TypeWise             from './charts/TypeWise'
import CostByBusiness       from './charts/CostByBusiness'
import RetiringIn3Years     from './charts/RetiringIn3Years'
import ProjectWiseTable     from './charts/ProjectWiseTable'
import RegionTable          from './charts/RegionTable'
import Top10Locations       from './charts/Top10Locations'
import StateWise            from './charts/StateWise'

// New deep-insight charts
import CTCDistribution      from './charts/CTCDistribution'
import TenureTrend          from './charts/TenureTrend'
import SalaryHeatmap        from './charts/SalaryHeatmap'
import ProjectRadar         from './charts/ProjectRadar'
import HiringVintage        from './charts/HiringVintage'
import GenderBusinessMatrix from './charts/GenderBusinessMatrix'

function SectionLabel({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
      {icon && (
        <span style={{ fontSize: 16 }}>{icon}</span>
      )}
      <span
        style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.10em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}

export default function Dashboard() {
  return (
    <div style={{ paddingBottom: 48 }}>

      {/* KPI Row */}
      <KPIStrip />

      {/* Active filter chips */}
      <div style={{ marginTop: 20 }}>
        <FilterBadges />
      </div>

      {/* ── Section 1: Workforce Distribution ── */}
      <div style={{ marginTop: 28 }}>
        <SectionLabel icon="👥">Workforce Distribution</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20, marginTop: 16 }}>

          {/* Headcount bars */}
          <div style={{ gridColumn: 'span 7', height: 390 }}>
            <ChartCard
              title="Headcount by Business Unit"
              subtitle="Total employees per business across all CSR projects"
              accentIndex={0} className="h-full"
            >
              <HeadcountByBusiness />
            </ChartCard>
          </div>

          {/* Gender donut */}
          <div style={{ gridColumn: 'span 5', height: 390 }}>
            <ChartCard title="Gender Distribution" subtitle="Male vs Female ratio across workforce" accentIndex={1} className="h-full">
              <GenderRatio />
            </ChartCard>
          </div>

          {/* Age distribution */}
          <div style={{ gridColumn: 'span 8', height: 370 }}>
            <ChartCard title="Age Group Distribution" subtitle="Employee headcount spread across age bands" accentIndex={2} className="h-full">
              <AgeGroupDistribution />
            </ChartCard>
          </div>

          {/* Employment type */}
          <div style={{ gridColumn: 'span 4', height: 370 }}>
            <ChartCard title="Onroll vs Offroll" subtitle="Employment type breakdown" accentIndex={3} className="h-full">
              <TypeWise />
            </ChartCard>
          </div>

        </div>
      </div>

      {/* ── Section 2: Cost & Retirement Risk ── */}
      <div style={{ marginTop: 36 }}>
        <SectionLabel icon="💰">Cost & Retirement Risk</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20, marginTop: 16 }}>

          <div style={{ gridColumn: 'span 7', height: 390 }}>
            <ChartCard title="Cost of Operation by Business" subtitle="Total annual CTC in INR Crores" accentIndex={4} className="h-full">
              <CostByBusiness />
            </ChartCard>
          </div>

          <div style={{ gridColumn: 'span 5', height: 390 }}>
            <ChartCard title="Retiring Within 3 Years" subtitle="Active vs employees retiring soon by business unit" accentIndex={5} className="h-full">
              <RetiringIn3Years />
            </ChartCard>
          </div>

        </div>
      </div>

      {/* ── Section 3: Regional & Project Breakdown ── */}
      <div style={{ marginTop: 36 }}>
        <SectionLabel icon="🗺️">Regional & Project Breakdown</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20, marginTop: 16 }}>

          <div style={{ gridColumn: 'span 7', height: 430 }}>
            <ChartCard title="Project-wise Headcount & Cost" subtitle="CSR project contribution — employees and annual spend" accentIndex={6} className="h-full">
              <ProjectWiseTable />
            </ChartCard>
          </div>

          <div style={{ gridColumn: 'span 5', height: 430 }}>
            <ChartCard title="Region-wise Summary" subtitle="HC · CTC · Projects · Avg Age · Avg Years of Service" accentIndex={7} className="h-full">
              <RegionTable />
            </ChartCard>
          </div>

          <div style={{ gridColumn: 'span 7', height: 470 }}>
            <ChartCard title="Top 10 Locations by Headcount" subtitle="Hover over any bar to see CTC min / avg / max" accentIndex={8} className="h-full">
              <Top10Locations />
            </ChartCard>
          </div>

          <div style={{ gridColumn: 'span 5', height: 470 }}>
            <ChartCard title="State-wise Manpower & Cost" subtitle="All states sorted by headcount" accentIndex={9} className="h-full">
              <StateWise />
            </ChartCard>
          </div>

        </div>
      </div>

      {/* ── Section 4: Deep Insights ── */}
      <div style={{ marginTop: 36 }}>
        <SectionLabel icon="🔍">Deep Insights</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20, marginTop: 16 }}>

          {/* CTC Distribution area chart */}
          <div style={{ gridColumn: 'span 7', height: 400 }}>
            <ChartCard
              title="CTC Salary Band Distribution"
              subtitle="How many employees fall into each salary range · split by business unit"
              accentIndex={0} className="h-full"
            >
              <CTCDistribution />
            </ChartCard>
          </div>

          {/* Tenure trend line+area */}
          <div style={{ gridColumn: 'span 5', height: 400 }}>
            <ChartCard
              title="Tenure vs Retirement Risk"
              subtitle="Headcount by years-of-service band · dashed line shows retiring employees"
              accentIndex={5} className="h-full"
            >
              <TenureTrend />
            </ChartCard>
          </div>

          {/* Salary heatmap */}
          <div style={{ gridColumn: 'span 6', height: 380 }}>
            <ChartCard
              title="Salary Heatmap · Role × Business"
              subtitle="Average CTC (₹L) at each Managerial vs Non-Managerial × Business Unit intersection"
              accentIndex={2} className="h-full"
            >
              <SalaryHeatmap />
            </ChartCard>
          </div>

          {/* Hiring vintage area chart */}
          <div style={{ gridColumn: 'span 6', height: 380 }}>
            <ChartCard
              title="Hiring Vintage — Joining Year"
              subtitle="Number of employees hired each year · workforce age profile"
              accentIndex={3} className="h-full"
            >
              <HiringVintage />
            </ChartCard>
          </div>

          {/* Project radar */}
          <div style={{ gridColumn: 'span 6', height: 440 }}>
            <ChartCard
              title="Project Health Radar"
              subtitle="Normalized scores across 6 dimensions per CSR project — all values scaled 0–100"
              accentIndex={4} className="h-full"
            >
              <ProjectRadar />
            </ChartCard>
          </div>

          {/* Gender × Business matrix */}
          <div style={{ gridColumn: 'span 6', height: 440 }}>
            <ChartCard
              title="Gender & Employment Type by Business"
              subtitle="Male vs Female · Onroll vs Offroll split for each business unit"
              accentIndex={1} className="h-full"
            >
              <GenderBusinessMatrix />
            </ChartCard>
          </div>

        </div>
      </div>

    </div>
  )
}
