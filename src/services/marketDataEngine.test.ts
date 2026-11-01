/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getInitialMarketSnapshot,
  applyMarketScenario,
  calculateLiveLandedCostForQuote,
} from './marketDataEngine';

describe('Market Data Engine Tests', () => {
  it('initializes valid market data snapshot with all 5 pillars', () => {
    const snapshot = getInitialMarketSnapshot();
    assert.ok(snapshot.commodities.length >= 5, 'Should have at least 5 commodities');
    assert.ok(snapshot.exchangeRates.length >= 4, 'Should have at least 4 exchange rates');
    assert.ok(snapshot.freightCorridors.length >= 4, 'Should have at least 4 freight corridors');
    assert.ok(snapshot.leadTimes.length >= 4, 'Should have at least 4 lead time corridors');
    assert.ok(snapshot.riskIndices.length >= 4, 'Should have at least 4 risk indices');
    assert.equal(snapshot.connectionStatus, 'connected');
  });

  it('correctly calculates live landed cost using real-time freight and FX rates', () => {
    const snapshot = getInitialMarketSnapshot();
    const result = calculateLiveLandedCostForQuote({
      unitPriceFOB: 685,
      quantityMT: 100, // 4 containers of 25MT
      originCountry: 'ویتنام',
      marketSnapshot: snapshot,
    });

    // 100 MT / 25 = 4 containers
    // Vietnam freight rate is $2,200 * 4 = $8,800
    assert.equal(result.fobTotalUSD, 68500);
    assert.equal(result.freightTotalUSD, 8800);
    assert.equal(result.freightPerTonUSD, 88);
    assert.ok(result.cifTotalUSD > result.fobTotalUSD);
    assert.ok(result.totalLandedCostUSD > result.cifTotalUSD);
    assert.ok(result.totalLandedCostToman > 0);
    assert.equal(result.appliedFreightCorridor.originCountry, 'ویتنام');
  });

  it('reflects freight spike shock when Shanghai freight surges', () => {
    const snapshot = getInitialMarketSnapshot();
    const shocked = applyMarketScenario(snapshot, 'freight_spike_china');

    const chinaCorridor = shocked.freightCorridors.find((c) => c.originCountry === 'چین');
    assert.ok(chinaCorridor);
    assert.equal(chinaCorridor.currentRateUSD, 3350);
    assert.ok(shocked.globalIndices.scfiContainerIndex > 2300);

    const freightRisk = shocked.riskIndices.find((r) => r.id === 'risk-freight');
    assert.equal(freightRisk?.level, 'بحرانی');
  });

  it('applies dirham and FX jump correctly', () => {
    const snapshot = getInitialMarketSnapshot();
    const shocked = applyMarketScenario(snapshot, 'fx_dirham_jump');

    const aed = shocked.exchangeRates.find((r) => r.currencyCode === 'AED');
    assert.ok(aed);
    assert.equal(aed.rateToman, 20650);

    const fxRisk = shocked.riskIndices.find((r) => r.id === 'risk-fx-alloc');
    assert.equal(fxRisk?.level, 'بحرانی');
  });
});
