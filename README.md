# ESG reporting system — Kaiheng Electric (凯恒电气)

Supplier ESG evidence pack for a **128-person NEV electrical-components company** that needs to trade with **EU buyers**. Those customers will not complete an RFQ without GHG, energy, water, waste, safety and labour evidence.

Demo product boundary only:

- EV charging modules (AC 7–22 kW, DC 20–40 kW)
- 400/800 V high-voltage connectors

## Who this pack is for

- **Company:** Kaiheng Electric Limited / 凯恒电气有限公司 (unlisted)
- **Scale:** 128 people — 12 in a Kowloon Bay sales office, 116 in **one leased Dongguan workshop** (connector cell + charging-module SMT/burn-in in the same plant). Not a multi-plant group.
- **Customers in the demo:** Nordic Drive Systems GmbH (Germany, CSDDD/LkSG RFQ), Helix Powertrain SAS (France, CSRD value-chain request)
- **Primary framework:** EU / OEM customer due diligence (CSDDD, LkSG, CSRD value chain, Supplier Code of Conduct)
- **Also switchable:** GRI, ISSB IFRS S1/S2, TCFD, HKEX ESG
- **Period:** FY2026 YTD (1 Jan–31 Aug 2026), as of 18 Sep 2026

## Example source data

Raw extracts that roll up to the dashboard live in `src/data/source-examples/`:

| File | Grain | Rolls up to |
|---|---|---|
| `electricity_meters.csv` | meter × month | Scope 2, energy mix |
| `diesel_tickets.csv` | ticket | Scope 1 diesel (includes unmapped ticket DG-08-17) |
| `natural_gas_meters.csv` | meter × month | Scope 1 dryer NG |
| `refrigerant_topups.csv` | event | R-134a omitted until GWP is assigned |
| `water_meters.csv` | meter × month | Plating / cooling / PCBA wash |
| `waste_weighbridge.csv` | stream × month | Hazardous sludge vs recyclable copper |
| `hours_worked.csv` | month | LTIFR denominator |
| `incidents.csv` / `incidents.json` | incident | The March HV-crimp LTI plus recordables |
| `workforce_extract.csv` / `workforce.json` | worker (full 128 + 1 duplicate) | Duplicate ID W-1013 |
| `training_completions.csv` | worker × course | Overdue 800 V authorisation |
| `organization.json` | company | Two-site boundary |
| `customers.json` | RFQ | Nordic Drive + Helix |
| `monthly_activity.json` | month | Environmental + social series |

`src/data/source-catalog.json` maps each file to the customer question it answers. The UI shows the same previews on the main dashboard and under Settings → API.

Aggregates used in charts are in `src/data/esg-dataset.json` (headcount splits add to 128; monthly series sum to YTD).

## Run

```bash
npm install
npm run dev
```

Routes: `/` · `/environmental` · `/social` · `/governance`

The Reporting Centre downloads the **customer ESG pack** (PDF or Excel). Generation stays blocked while required validations are open — that is the RFQ gate.
# SDG
