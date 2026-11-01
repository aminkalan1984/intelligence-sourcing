/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MarketDataSnapshot } from '../types/market';
import {
  getInitialMarketSnapshot,
  applyMarketScenario,
  MarketShockType,
  calculateLiveLandedCostForQuote,
} from '../services/marketDataEngine';

interface MarketDataContextType {
  snapshot: MarketDataSnapshot;
  isSyncing: boolean;
  refreshMarketData: () => Promise<void>;
  applyScenario: (scenario: MarketShockType) => void;
  resetToDefaults: () => void;
  activeScenario: MarketShockType | 'baseline';
  calculateLandedCost: typeof calculateLiveLandedCostForQuote;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const MarketDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snapshot, setSnapshot] = useState<MarketDataSnapshot>(getInitialMarketSnapshot);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<MarketShockType | 'baseline'>('baseline');

  const refreshMarketData = useCallback(async () => {
    setIsSyncing(true);
    // Simulate real-time API roundtrip to global pricing feeds
    await new Promise((resolve) => setTimeout(resolve, 650));
    setSnapshot((prev) => {
      const updated = applyMarketScenario(prev, 'jitter');
      updated.lastSyncFormattedFa = 'هم‌اکنون (به‌روزرسانی خودکار)';
      return updated;
    });
    setIsSyncing(false);
  }, []);

  const applyScenario = useCallback((scenario: MarketShockType) => {
    setIsSyncing(true);
    setTimeout(() => {
      setSnapshot((prev) => applyMarketScenario(prev, scenario));
      setActiveScenario(scenario);
      setIsSyncing(false);
    }, 400);
  }, []);

  const resetToDefaults = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => {
      setSnapshot(getInitialMarketSnapshot());
      setActiveScenario('baseline');
      setIsSyncing(false);
    }, 300);
  }, []);

  // Soft background jitter every 60 seconds to simulate dynamic market movements
  useEffect(() => {
    const timer = setInterval(() => {
      setSnapshot((prev) => applyMarketScenario(prev, 'jitter'));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MarketDataContext.Provider
      value={{
        snapshot,
        isSyncing,
        refreshMarketData,
        applyScenario,
        resetToDefaults,
        activeScenario,
        calculateLandedCost: calculateLiveLandedCostForQuote,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};

export function useMarketData(): MarketDataContextType {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
}
