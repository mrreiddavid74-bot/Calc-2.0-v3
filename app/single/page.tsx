// @ts-nocheck
'use client'
import { useEffect, useMemo, useState } from 'react'
import Card from '../../components/Card'
import { DEFAULT_MEDIA, DEFAULT_SETTINGS, DEFAULT_SUBSTRATES } from '../../lib/defaults'
import { priceSingle } from '../../lib/pricing'
import type { Mode, Finishing, Complexity, Orientation, SingleSignInput, Settings } from '../../lib/types'

const SETTINGS_KEY = 'pricing_settings_v1'

const MODES: { id: Mode; label: string }[] = [
  { id: 'SolidColourCutVinyl', label: 'Solid Colour Cut Vinyl Only' },
  { id: 'PrintAndCutVinyl', label: 'Print & Cut Vinyl' },
  { id: 'PrintedVinylOnly', label: 'Printed Vinyl Only' },
  { id: 'PrintedVinylOnSubstrate', label: 'Printed Vinyl mounted to a substrate' },
  { id: 'SubstrateOnly', label: 'Substrate Only' },
]

export default function SinglePage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  useEffect(() => { const raw = localStorage.getItem(SETTINGS_KEY); if (raw) setSettings(JSON.parse(raw)) }, [])

  const [input, setInput] = useState<SingleSignInput>({
    mode: 'PrintedVinylOnSubstrate',
    widthMm: 3000,
    heightMm: 1500,
    qty: 1,
    vinylId: DEFAULT_MEDIA[0].id,
    substrateId: DEFAULT_SUBSTRATES[1].id,
    finishing: 'None',
    complexity: 'Standard',
    applicationTape: false,
    panelSplits: 0,
    panelOrientation: 'Vertical'
  })

  const result = useMemo(() => {
    try {
      return priceSingle(input, DEFAULT_MEDIA, DEFAULT_SUBSTRATES, settings)
    } catch (e: any) {
      return { error: e.message }
    }
  }, [input, settings])

  return (
    <div className="space-y-6">
      <h1 className="h1">Single Sign</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <h2 className="h2 mb-2">Product</h2>
          <select className="select" value={input.mode} onChange={e => setInput({ ...input, mode: e.target.value as Mode })}>
            {MODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </Card>

        <Card>
          <h2 className="h2 mb-2">Dimensions</h2>
          <div className="grid grid-cols-1 gap-3">
            <label className="label">Width (mm)
              <input className="input" type="number" value={input.widthMm} onChange={e => setInput({ ...input, widthMm: +e.target.value || 0 })} />
            </label>
            <label className="label">Height (mm)
              <input className="input" type="number" value={input.heightMm} onChange={e => setInput({ ...input, heightMm: +e.target.value || 0 })} />
            </label>
            <label className="label">Quantity
              <input className="input" type="number" value={input.qty} onChange={e => setInput({ ...input, qty: +e.target.value || 0 })} />
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="h2 mb-2">Panels & Finishing</h2>
          <div className="grid grid-cols-1 gap-3">
            <label className="label">Panel splits
              <select className="select" value={input.panelSplits} onChange={e => setInput({ ...input, panelSplits: +e.target.value })}>
                {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n === 0 ? 'None' : n}</option>)}
              </select>
            </label>
            <label className="label">Orientation
              <select className="select" value={input.panelOrientation} onChange={e => setInput({ ...input, panelOrientation: e.target.value as Orientation })}>
                <option>Vertical</option>
                <option>Horizontal</option>
              </select>
            </label>
            \1 disabled={(input.mode === \'PrintedVinylOnSubstrate\' || input.mode === \'SubstrateOnly\')} className={"select " + ((input.mode === \'PrintedVinylOnSubstrate\' || input.mode === \'SubstrateOnly\') ? \'opacity-50\' : \'\') } value={input.finishing} onChange={e => setInput({ ...input, finishing: e.target.value as Finishing })}>
                <option>None</option>
                <option>KissCutOnRoll</option>
                <option>CutIntoSheets</option>
                <option>IndividuallyCut</option>
              </select>
            </label>
            <label className="label">Complexity
              <select className="select" value={input.complexity} onChange={e => setInput({ ...input, complexity: e.target.value as Complexity })}>
                <option>Basic</option>
                <option>Standard</option>
                <option>Complex</option>
              </select>
            </label>
            <label className="label flex items-center gap-2">Application tape
              <input type="checkbox" checked={!!input.applicationTape} onChange={e => setInput({ ...input, applicationTape: e.target.checked })} />
            </label>
            <label className="label flex items-center gap-2 hidden">Double-sided (substrate)
              <input type="checkbox" checked={!!input.doubleSided} onChange={e => setInput({ ...input, doubleSided: e.target.checked })} />
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="h2 mb-2">Materials</h2>
          <div className="grid grid-cols-1 gap-3">
            \1disabled={(input.mode === \'SubstrateOnly\')} className={"select " + (input.mode === \'SubstrateOnly\' ? \'opacity-50\' : \'\') } value={input.vinylId} onChange={e => setInput({ ...input, vinylId: e.target.value })}>
                <option value="">—</option>
                {DEFAULT_MEDIA.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </label>
            \1disabled={(input.mode === \'SolidColourCutVinyl\' || input.mode === \'PrintAndCutVinyl\' || input.mode === \'PrintedVinylOnly\')} className={"select " + ((input.mode === \'SolidColourCutVinyl\' || input.mode === \'PrintAndCutVinyl\' || input.mode === \'PrintedVinylOnly\') ? \'opacity-50\' : \'\') } value={input.substrateId} onChange={e => setInput({ ...input, substrateId: e.target.value })}>
                <option value="">—</option>
                {DEFAULT_SUBSTRATES.map(su => <option key={su.id} value={su.id}>{su.name}</option>)}
              
            <label className="label">Printed Sides
              <select className={"select " + ((input.mode === 'PrintedVinylOnSubstrate' || input.mode === 'SubstrateOnly') ? '' : 'opacity-50')} value={input.doubleSided ? 'Double Sided' : 'Single Sided'} onChange={e => setInput({ ...input, doubleSided: e.target.value === 'Double Sided' })} disabled={!(input.mode === 'PrintedVinylOnSubstrate' || input.mode === 'SubstrateOnly')}>
                <option>Single Sided</option>
                <option>Double Sided</option>
              </select>
            </label>
</select>
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="h2 mb-2">Costs</h2>
          {('error' in (result as any)) ? (
            <div className="text-red-600 text-sm">{(result as any).error}</div>
          ) : (
            <div className="text-sm space-y-1">
              <div>Setup: £{result.setup?.toFixed(2)}</div>
              <div><b>Materials Cost: £{result.materials?.toFixed(2)}</b></div>
              <div>Ink: £{result.ink?.toFixed(2)}</div>
              <div>Cutting: £{result.cutting?.toFixed(2)}</div>
              <div className="font-medium"><b>Sell Cost (pre-delivery): £{result.preDelivery?.toFixed(2)}</b></div>
              <div><b>Delivery: £{result.delivery?.toFixed(2)}</b> ({result.deliveryBand})</div>
              <div className="font-semibold"><span className="text-2xl font-extrabold">Total (Sell Price): £{result.total?.toFixed(2)}</span></div>
              <hr className=\"my-2\" />
              <div className=\"text-gray-600\">Vinyl breakdown</div>
              {Array.isArray(result.costs?.vinyl) && result.costs.vinyl.length ? result.costs.vinyl.map((v:any,i:number)=> (
                <div key={i}>{v.media}: {v.lm?.toFixed?.(2)} lm × £{v.pricePerLm?.toFixed?.(2)} = <b>£{v.cost?.toFixed?.(2)}</b></div>
              )) : <div className=\"text-gray-500\">No vinyl</div>}
              <div className=\"text-gray-600 mt-2\">Substrate breakdown</div>
              {Array.isArray(result.costs?.substrate) && result.costs.substrate.length ? result.costs.substrate.map((s:any,i:number)=> (
                <div key={i}>{s.material} — {s.sheet}: need {s.neededSheets} → <b>{s.chargedSheets} full sheets</b> × £{s.pricePerSheet?.toFixed?.(2)} = <b>£{s.cost?.toFixed?.(2)}</b></div>
              )) : <div className=\"text-gray-500\">No substrate</div>}
              <hr className=\"my-2\" />
              <div className=\"text-gray-600\">Stats</div>
              {result.vinylLm && <div>Vinyl: {result.vinylLm.toFixed(3)} lm (incl. +1 m waste)</div>}
              {result.tiles ? <div>Tiles: {result.tiles}</div> : null}
              {result.sheetFraction ? <div>Substrate charged: {result.sheetFraction * 100}% sheet</div> : null}
              {typeof result.usagePct === 'number' ? <div>Sheet usage: {result.usagePct}% (waste {result.wastePct}%)</div> : null}
              {result.notes?.length ? (
                <ul className="list-disc ml-5 text-gray-600">
                  {result.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              ) : null}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
