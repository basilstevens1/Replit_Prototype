import ImpactMetricCard from '../ImpactMetricCard';

export default function ImpactMetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <ImpactMetricCard
        title="Lives Saved"
        value="12.3"
        change="+2.1"
        changeType="increase"
        description="Based on GiveWell estimates"
        color="green"
      />
      <ImpactMetricCard
        title="QUALYs Gained"
        value="156.7"
        change="+8.2"
        changeType="increase"
        description="Quality-adjusted life years"
        color="blue"
      />
      <ImpactMetricCard
        title="Total Donated"
        value="$24,580"
        change="+$2,400"
        changeType="increase"
        description="This year"
        color="orange"
      />
    </div>
  );
}