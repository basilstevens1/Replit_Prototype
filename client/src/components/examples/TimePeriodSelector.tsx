import { useState } from 'react';
import TimePeriodSelector from '../TimePeriodSelector';

export default function TimePeriodSelectorExample() {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annual' | 'lifetime'>('annual');

  return (
    <div className="p-4 w-48">
      <TimePeriodSelector 
        selectedPeriod={selectedPeriod} 
        onPeriodChange={setSelectedPeriod} 
      />
    </div>
  );
}