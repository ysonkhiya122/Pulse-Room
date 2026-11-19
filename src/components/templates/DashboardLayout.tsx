import React from 'react';

export interface DashboardLayoutProps {
  topBar: React.ReactNode;
  ticker?: React.ReactNode;
  statsRow?: React.ReactNode;
  topicChips?: React.ReactNode;
  mainStage: React.ReactNode;
  sidePanel: React.ReactNode;
  bottomDeck?: React.ReactNode;
  footer?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  topBar,
  ticker,
  statsRow,
  topicChips,
  mainStage,
  sidePanel,
  bottomDeck,
  footer,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text antialiased">
      {topBar}
      {ticker}

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-4 flex flex-col gap-4">
        {statsRow}
        {topicChips}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Main 3D Globe & Primary Telemetry */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {mainStage}
            {bottomDeck}
          </div>

          {/* Right Side Monitoring Deck */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {sidePanel}
          </div>
        </div>
      </main>

      {footer}
    </div>
  );
};
