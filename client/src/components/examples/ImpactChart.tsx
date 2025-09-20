import ImpactChart from '../ImpactChart';

export default function ImpactChartExample() {
  // todo: remove mock functionality
  const donationData = [
    { name: 'Jan', value: 500 },
    { name: 'Feb', value: 800 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 1200 },
    { name: 'May', value: 900 },
    { name: 'Jun', value: 1500 },
  ];

  const impactData = [
    { name: 'Jan', value: 1.2 },
    { name: 'Feb', value: 2.1 },
    { name: 'Mar', value: 1.8 },
    { name: 'Apr', value: 3.2 },
    { name: 'May', value: 2.7 },
    { name: 'Jun', value: 4.1 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <ImpactChart
        title="Monthly Donations"
        data={donationData}
        type="bar"
        color="hsl(var(--chart-3))"
      />
      <ImpactChart
        title="Lives Saved Over Time"
        data={impactData}
        type="line"
        color="hsl(var(--chart-1))"
      />
    </div>
  );
}