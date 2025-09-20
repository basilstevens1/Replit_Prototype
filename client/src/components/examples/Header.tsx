import { useState } from 'react';
import Header from '../Header';

export default function HeaderExample() {
  const [currentView, setCurrentView] = useState<'qualitative' | 'quantitative'>('qualitative');

  return (
    <Header 
      currentView={currentView} 
      onViewChange={setCurrentView} 
    />
  );
}