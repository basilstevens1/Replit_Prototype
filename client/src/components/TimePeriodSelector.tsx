import { Button } from "@/components/ui/button";

interface TimePeriodSelectorProps {
  selectedPeriod: 'monthly' | 'annual' | 'lifetime';
  onPeriodChange: (period: 'monthly' | 'annual' | 'lifetime') => void;
}

export default function TimePeriodSelector({ selectedPeriod, onPeriodChange }: TimePeriodSelectorProps) {
  const periods = [
    { value: 'monthly' as const, label: 'Monthly' },
    { value: 'annual' as const, label: 'Annual' },
    { value: 'lifetime' as const, label: 'Lifetime' }
  ];

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-muted-foreground">Time Period</h3>
      <div className="flex flex-col gap-1">
        {periods.map(({ value, label }) => (
          <Button
            key={value}
            variant={selectedPeriod === value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPeriodChange(value)}
            className="justify-start"
            data-testid={`button-period-${value}`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}