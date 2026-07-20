window.INDIA_DC_WATCH = {
  "meta": {
    "title": "India AI Datacenter Power Demand & Policy Watch",
    "asOf": "2026-07-09",
    "audience": "Monthly intelligence brief for regulatory and energy-policy review",
    "scopeNote": "This starter dataset tracks major hyperscaler, AI, and large third-party datacenter signals. It is not yet a verified census of every colocation facility in India.",
    "methodNote": "Headline counts use the curated project registry below. National baseline metrics are shown separately when a credible market-level source exists.",
    "nextRefresh": "2026-08-01"
  },
  "exchangeRates": {
    "usdInrAssumption": 85,
    "note": "INR project values are normalized at an editable planning rate of INR 85 per USD. Refresh the assumption during each monthly update."
  },
  "nationalBaseline": [
    {
      "id": "baseline-third-party-capacity",
      "metric": "Third-party datacenter capacity",
      "value": "1,250 MW",
      "date": "2025-03-31",
      "quality": "market estimate",
      "detail": "ICRA-reported third-party capacity as of March 2025, projected to reach 2,500 MW by March 2028 with roughly INR 90,000 crore investment.",
      "sourceIds": [
        "market-icra-et-2025"
      ]
    },
    {
      "id": "baseline-count-stale",
      "metric": "Reported datacenter count",
      "value": "138",
      "date": "2022-03-31",
      "quality": "stale census",
      "detail": "Useful as a rough historical baseline only; this should not be treated as the current 2026 count until refreshed from a current market report.",
      "sourceIds": [
        "national-wiki-industry"
      ]
    },
    {
      "id": "baseline-2026-capacity",
      "metric": "Reported industry capacity",
      "value": "950 MW in 2024; 1,800 MW expected by 2026",
      "date": "2024-05-15",
      "quality": "secondary market estimate",
      "detail": "Secondary industry summary; retained as context until replaced with an original JLL/CBRE/CareEdge/ICRA report.",
      "sourceIds": [
        "national-wiki-industry"
      ]
    },
    {
      "id": "baseline-cbre-2025",
      "metric": "Operational DC capacity (CBRE)",
      "value": "~1,700 MW (2025); +500 MW / +30% expected in 2026",
      "date": "2026-04-01",
      "quality": "market estimate",
      "detail": "CBRE: India operational datacenter capacity crossed ~1,700 MW in 2025 (440 MW added); ~+500 MW expected in 2026; cumulative commitments ~USD 126B.",
      "sourceIds": [
        "src-cbre-dc-2026"
      ]
    },
    {
      "id": "baseline-jll-2025",
      "metric": "Operational IT-load stock (JLL)",
      "value": "1,123 MW IT load (H1 2025); 2,073 MW target by 2027",
      "date": "2025-12-05",
      "quality": "market estimate",
      "detail": "JLL: India operational IT-load stock 1,123 MW in H1 2025 (net take-up +48% YoY); 2,073 MW projected by 2027; capex to 2027 ~USD 6.3B.",
      "sourceIds": [
        "src-jll-dc-2025"
      ]
    }
  ],
  "projects": [
    {
      "id": "anant-raj-haryana-operational",
      "name": "Anant Raj Cloud Haryana campuses",
      "status": "operational",
      "operator": "Anant Raj Cloud",
      "constructionLead": "Anant Raj / internal development",
      "hyperscaler": "Not disclosed",
      "customerType": "Third-party / enterprise cloud and datacenter capacity",
      "location": {
        "city": "Manesar and Panchkula",
        "state": "Haryana",
        "cluster": "North India"
      },
      "value": {
        "display": "Operational value not disclosed",
        "usdBillion": null,
        "basis": "Operational capacity announcement"
      },
      "capacity": {
        "itLoadMw": 28,
        "powerDrawMw": 28,
        "powerDrawNote": "Reported IT load; total facility draw likely higher and not disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not publicly disclosed"
      },
      "power": {
        "source": "Grid supply; site-specific renewable procurement not disclosed",
        "detail": "Power source should be refreshed from company filings or PPA disclosures.",
        "confidence": "low",
        "firmnessTier": "grid"
      },
      "timeline": "28 MW operational after Panchkula launch and Manesar scale-up in 2025",
      "stageConfidence": "high",
      "includeInHeadline": true,
      "tags": [
        "north-india-load",
        "enterprise-cloud",
        "firm-power"
      ],
      "sourceIds": [
        "anant-panchkula-toi-2025"
      ],
      "notes": "Combined operational IT load across Manesar and Panchkula.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "aws-hyderabad-region",
      "name": "AWS Asia Pacific (Hyderabad) Region",
      "status": "operational",
      "operator": "Amazon Web Services",
      "constructionLead": "Not publicly disclosed",
      "hyperscaler": "AWS",
      "customerType": "Hyperscaler-owned cloud region",
      "location": {
        "city": "Hyderabad",
        "state": "Telangana",
        "cluster": "Hyderabad"
      },
      "value": {
        "display": "Earlier Telangana commitment reported at USD 4.4B by 2030; newer USD 7B expansion tracked separately",
        "usdBillion": 4.4,
        "basis": "State-level cloud datacenter infrastructure commitment"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Region capacity and facility draw not publicly disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not publicly disclosed"
      },
      "power": {
        "source": "Grid-backed cloud region; renewable matching at corporate level",
        "detail": "Site-specific electricity procurement not disclosed in the sources reviewed.",
        "confidence": "medium",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Operational since 2022",
      "stageConfidence": "high",
      "includeInHeadline": true,
      "tags": [
        "cloud-region",
        "hyperscaler",
        "telangana-load-growth"
      ],
      "sourceIds": [
        "aws-regions",
        "aws-telangana-toi-2025"
      ],
      "notes": "Hyderabad is the second AWS cloud region in India.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "aws-mumbai-region",
      "name": "AWS Asia Pacific (Mumbai) Region",
      "status": "operational",
      "operator": "Amazon Web Services",
      "constructionLead": "Not publicly disclosed",
      "hyperscaler": "AWS",
      "customerType": "Hyperscaler-owned cloud region",
      "location": {
        "city": "Mumbai",
        "state": "Maharashtra",
        "cluster": "Mumbai / Navi Mumbai"
      },
      "value": {
        "display": "Part of AWS India cloud investment; facility-level value not disclosed",
        "usdBillion": null,
        "basis": "AWS India cloud infrastructure programme"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Region capacity and facility draw not publicly disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not publicly disclosed"
      },
      "power": {
        "source": "Grid-backed cloud region; renewable matching at corporate level",
        "detail": "Site-specific electricity procurement not disclosed in the sources reviewed.",
        "confidence": "medium",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Operational since 2016",
      "stageConfidence": "high",
      "includeInHeadline": true,
      "tags": [
        "cloud-region",
        "hyperscaler",
        "renewable-claims-need-localization"
      ],
      "sourceIds": [
        "aws-regions",
        "aws-invest-toi-2025"
      ],
      "notes": "Treat as a cloud-region row rather than a single named facility.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "google-delhi-region",
      "name": "Google Cloud Delhi NCR Region",
      "status": "operational",
      "operator": "Google Cloud",
      "constructionLead": "Not publicly disclosed",
      "hyperscaler": "Google",
      "customerType": "Hyperscaler-owned cloud region",
      "location": {
        "city": "Delhi NCR",
        "state": "Delhi NCR",
        "cluster": "Delhi NCR / Noida / Gurgaon"
      },
      "value": {
        "display": "Facility-level value not disclosed",
        "usdBillion": null,
        "basis": "Cloud region"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Region capacity and facility draw not publicly disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not publicly disclosed"
      },
      "power": {
        "source": "Grid-backed cloud region; Google 24/7 CFE pressure at corporate level",
        "detail": "Local hourly carbon-free energy position not disclosed in the sources reviewed.",
        "confidence": "medium",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Operational since 2021",
      "stageConfidence": "high",
      "includeInHeadline": true,
      "tags": [
        "cloud-region",
        "hyperscaler",
        "ncr-backup-power-watch"
      ],
      "sourceIds": [
        "google-cloud-locations",
        "google-cloud-wiki-locations"
      ],
      "notes": "Treat as a cloud-region row rather than a single named facility.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "google-mumbai-region",
      "name": "Google Cloud Mumbai Region",
      "status": "operational",
      "operator": "Google Cloud",
      "constructionLead": "Not publicly disclosed",
      "hyperscaler": "Google",
      "customerType": "Hyperscaler-owned cloud region",
      "location": {
        "city": "Mumbai",
        "state": "Maharashtra",
        "cluster": "Mumbai / Navi Mumbai"
      },
      "value": {
        "display": "Facility-level value not disclosed",
        "usdBillion": null,
        "basis": "Cloud region"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Region capacity and facility draw not publicly disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not publicly disclosed"
      },
      "power": {
        "source": "Grid-backed cloud region; Google 24/7 CFE pressure at corporate level",
        "detail": "Local hourly carbon-free energy position not disclosed in the sources reviewed.",
        "confidence": "medium",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Operational since 2017",
      "stageConfidence": "high",
      "includeInHeadline": true,
      "tags": [
        "cloud-region",
        "hyperscaler",
        "cfe-24x7"
      ],
      "sourceIds": [
        "google-cloud-locations",
        "google-cloud-wiki-locations"
      ],
      "notes": "Treat as a cloud-region row rather than a single named facility.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "azure-central-india",
      "name": "Microsoft Azure Central India Region",
      "status": "operational",
      "operator": "Microsoft Azure",
      "constructionLead": "Not publicly disclosed",
      "hyperscaler": "Microsoft",
      "customerType": "Hyperscaler-owned cloud region",
      "location": {
        "city": "Pune",
        "state": "Maharashtra",
        "cluster": "Pune"
      },
      "value": {
        "display": "Facility-level value not disclosed",
        "usdBillion": null,
        "basis": "Cloud region"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Region capacity and facility draw not publicly disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not publicly disclosed"
      },
      "power": {
        "source": "Grid-backed cloud region; Microsoft 100/100/0 pressure at corporate level",
        "detail": "Local hourly zero-carbon supply position not disclosed in the sources reviewed.",
        "confidence": "medium",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Operational",
      "stageConfidence": "high",
      "includeInHeadline": true,
      "tags": [
        "cloud-region",
        "hyperscaler",
        "maharashtra-load"
      ],
      "sourceIds": [
        "azure-locations",
        "microsoft-wsj-2025"
      ],
      "notes": "One of Microsoft's three operational India cloud clusters referenced in 2025 reporting.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "azure-south-india",
      "name": "Microsoft Azure South India Region",
      "status": "operational",
      "operator": "Microsoft Azure",
      "constructionLead": "Not publicly disclosed",
      "hyperscaler": "Microsoft",
      "customerType": "Hyperscaler-owned cloud region",
      "location": {
        "city": "Chennai",
        "state": "Tamil Nadu",
        "cluster": "Chennai"
      },
      "value": {
        "display": "Facility-level value not disclosed",
        "usdBillion": null,
        "basis": "Cloud region"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Region capacity and facility draw not publicly disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not publicly disclosed"
      },
      "power": {
        "source": "Grid-backed cloud region; Microsoft 100/100/0 pressure at corporate level",
        "detail": "Local hourly zero-carbon supply position not disclosed in the sources reviewed.",
        "confidence": "medium",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Operational",
      "stageConfidence": "high",
      "includeInHeadline": true,
      "tags": [
        "cloud-region",
        "hyperscaler",
        "coastal-cooling",
        "renewable-open-access"
      ],
      "sourceIds": [
        "azure-locations",
        "microsoft-wsj-2025"
      ],
      "notes": "One of Microsoft's three operational India cloud clusters referenced in 2025 reporting.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "azure-west-india",
      "name": "Microsoft Azure West India Region",
      "status": "operational",
      "operator": "Microsoft Azure",
      "constructionLead": "Not publicly disclosed",
      "hyperscaler": "Microsoft",
      "customerType": "Hyperscaler-owned cloud region",
      "location": {
        "city": "Mumbai",
        "state": "Maharashtra",
        "cluster": "Mumbai / Navi Mumbai"
      },
      "value": {
        "display": "Facility-level value not disclosed",
        "usdBillion": null,
        "basis": "Cloud region"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Region capacity and facility draw not publicly disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not publicly disclosed"
      },
      "power": {
        "source": "Grid-backed cloud region; Microsoft 100/100/0 pressure at corporate level",
        "detail": "Local hourly zero-carbon supply position not disclosed in the sources reviewed.",
        "confidence": "medium",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Operational",
      "stageConfidence": "high",
      "includeInHeadline": true,
      "tags": [
        "cloud-region",
        "hyperscaler",
        "maharashtra-load"
      ],
      "sourceIds": [
        "azure-locations",
        "microsoft-wsj-2025"
      ],
      "notes": "One of Microsoft's three operational India cloud clusters referenced in 2025 reporting.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "google-vizag-ai-hub",
      "name": "Google Cloud India AI Hub, Visakhapatnam",
      "status": "under_construction",
      "operator": "Google Cloud with AdaniConneX and Airtel Nxtra",
      "constructionLead": "AdaniConneX and Airtel Nxtra for campus and associated infrastructure",
      "hyperscaler": "Google",
      "customerType": "Hyperscaler AI hub",
      "location": {
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "cluster": "Turluvada / Rambilli / Adavivaram"
      },
      "value": {
        "display": "USD 15B over five years",
        "usdBillion": 15,
        "basis": "Investment announcement and foundation-laying reporting"
      },
      "capacity": {
        "itLoadMw": 1000,
        "powerDrawMw": 1000,
        "powerDrawNote": "Reported as 1 GW hyperscale AI datacenter capacity; total site draw and PUE not disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not disclosed; project described as AI hub"
      },
      "power": {
        "source": "Energy infrastructure planned; site-specific supply mix not yet disclosed",
        "detail": "Google's demand-side standards imply pressure for carbon-free procurement, but public reporting has not confirmed the local power stack.",
        "confidence": "medium",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Foundation laid April 28, 2026; reported target operations by September 2028",
      "stageConfidence": "high",
      "includeInHeadline": true,
      "tags": [
        "gigawatt-load",
        "ai-hub",
        "coastal-cooling",
        "subsea-cables",
        "grid-connection",
        "water-watch"
      ],
      "sourceIds": [
        "google-vizag-toi-2026",
        "google-vizag-ap-2025",
        "google-vizag-et-2025"
      ],
      "notes": "This is the most material near-term AI load signal in the starter registry.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "lodha-palava-dc",
      "name": "Lodha Green Integrated Data Centre Park, Palava",
      "status": "under_construction",
      "operator": "Macrotech Developers (Lodha)",
      "constructionLead": "Lodha (Ambernath substation built by Lodha, transferred to MSETCL)",
      "hyperscaler": "AWS (anchor tenant); ST Telemedia",
      "customerType": "Built-to-suit / colocation data-centre park",
      "location": {
        "city": "Ambernath / Palava",
        "state": "Maharashtra",
        "cluster": "Mumbai Metropolitan Region"
      },
      "value": {
        "display": "~INR 1.3 lakh crore park (~USD 15B)",
        "usdBillion": 15.0,
        "basis": "Trade-press park valuation"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": 1450,
        "powerDrawNote": "~1,450 MW grid connectivity granted by Maharashtra STU (MSETCL); ~1,500 MW more under consideration; ~2,950 MW park target by 2028. This is grid power, not a disclosed single-building IT load.",
        "computeGw": null,
        "computeNote": "Not disclosed"
      },
      "power": {
        "source": "Intra-state grid via a dedicated 400/220 kV Ambernath GIS substation (MSETCL Dedicated Distribution Facility, Lodha-funded)",
        "detail": "MERC approved the Ambernath substation as a DDF (Case 88 of 2026, 1 Jun 2026); Lodha funds 100% of capex and reimburses O&M.",
        "confidence": "high",
        "firmnessTier": "grid"
      },
      "timeline": "MERC DDF approval 1 Jun 2026; ~2,950 MW targeted by 2028; AWS land acquired Jun 2026",
      "stageConfidence": "high",
      "includeInHeadline": true,
      "tags": [
        "gigawatt-load",
        "maharashtra",
        "mmr",
        "intra-state-connectivity",
        "aws-anchor",
        "grid-connection"
      ],
      "sourceIds": [
        "src-merc-lodha-2026",
        "src-lodha-saur-2026"
      ],
      "notes": "Largest single tracked load cluster. Connects INTRA-STATE (MSETCL), not ISTS/CTUIL — which is why CTUIL alone would miss it. Grid-access records are in the connectivity register.",
      "lastVerified": "2026-06-30"
    },
    {
      "id": "reliance-ap-ai-dc",
      "name": "Reliance 1 GW AI datacenter, Andhra Pradesh",
      "status": "announced",
      "operator": "Reliance Industries",
      "constructionLead": "Reliance Industries",
      "hyperscaler": "Reliance / customer not disclosed",
      "customerType": "AI-focused datacenter",
      "location": {
        "city": "Not disclosed",
        "state": "Andhra Pradesh",
        "cluster": "Andhra Pradesh"
      },
      "value": {
        "display": "Project value not disclosed",
        "usdBillion": null,
        "basis": "Announcement reporting"
      },
      "capacity": {
        "itLoadMw": 1000,
        "powerDrawMw": 1000,
        "powerDrawNote": "Reported as 1 GW AI-focused datacenter; total facility draw and schedule not disclosed",
        "computeGw": null,
        "computeNote": "Reported to use GPUs/TPUs and AI processors; compute capacity not quantified"
      },
      "power": {
        "source": "Not disclosed",
        "detail": "Large open question: whether AP gigawatt-scale AI campuses can secure firm clean power without stressing local grid reliability.",
        "confidence": "low",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Announced November 2025",
      "stageConfidence": "medium",
      "includeInHeadline": true,
      "tags": [
        "gigawatt-load",
        "ai-load",
        "andhra-pradesh",
        "firm-power",
        "water-watch"
      ],
      "sourceIds": [
        "reliance-ap-toi-2025",
        "reliance-ap-et-2025"
      ],
      "notes": "Separate from Jamnagar / Meta; construction status needs confirmation.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "reliance-meta-jamnagar",
      "name": "Reliance / Meta AI-enabled datacenter, Jamnagar",
      "status": "announced",
      "operator": "Reliance Industries",
      "constructionLead": "Reliance Industries",
      "hyperscaler": "Meta",
      "customerType": "Built-to-suit hyperscale AI capacity leased by Meta",
      "location": {
        "city": "Jamnagar",
        "state": "Gujarat",
        "cluster": "Jamnagar"
      },
      "value": {
        "display": "Project value not disclosed",
        "usdBillion": null,
        "basis": "Strategic partnership announcement"
      },
      "capacity": {
        "itLoadMw": 168,
        "powerDrawMw": 168,
        "powerDrawNote": "Reported capacity; total facility draw likely higher and not disclosed",
        "computeGw": null,
        "computeNote": "AI-enabled facility; GPU/server capacity not disclosed"
      },
      "power": {
        "source": "Contracted renewable: ~925 MW of RE PPAs (CleanMax 837 MW solar+wind across Rajasthan/Karnataka + Fourth Partner 88 MW), Meta taking 100% environmental attributes",
        "detail": "Renewable procurement is now contracted rather than merely signalled; site-level hourly matching and firming still to confirm.",
        "confidence": "high",
        "firmnessTier": "bundled_ppa"
      },
      "timeline": "Announced June 2026; reported completion within two years",
      "stageConfidence": "medium",
      "includeInHeadline": true,
      "tags": [
        "ai-load",
        "built-to-suit",
        "renewable-procurement",
        "gujarat",
        "firming"
      ],
      "sourceIds": [
        "reliance-meta-toi-2026",
        "meta-cleanmax-et-2026",
        "src-meta-ppa-mercom-2026"
      ],
      "notes": "Strong commercial signal, but construction start should be verified in the next monthly refresh.",
      "lastVerified": "2026-06-24"
    },
    {
      "id": "sify-ifc-navi-mumbai-chennai",
      "name": "Sify next-generation datacenters, Navi Mumbai and Chennai",
      "status": "announced",
      "operator": "Sify Technologies",
      "constructionLead": "Sify Technologies",
      "hyperscaler": "Not disclosed",
      "customerType": "Third-party colocation / cloud-neutral capacity",
      "location": {
        "city": "Navi Mumbai and Chennai",
        "state": "Maharashtra / Tamil Nadu",
        "cluster": "Mumbai and Chennai"
      },
      "value": {
        "display": "USD 371M IFC commitment",
        "usdBillion": 0.371,
        "basis": "Financing commitment"
      },
      "capacity": {
        "itLoadMw": 103,
        "powerDrawMw": 103,
        "powerDrawNote": "Reported combined capacity; total facility draw likely higher and not disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not disclosed"
      },
      "power": {
        "source": "Not disclosed in reviewed reporting",
        "detail": "Refresh should check IFC environmental disclosure and Sify sustainability reporting.",
        "confidence": "low",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Financing announced June 2026",
      "stageConfidence": "medium",
      "includeInHeadline": true,
      "tags": [
        "third-party-capacity",
        "mumbai",
        "chennai",
        "ifc-financing",
        "renewable-procurement-watch"
      ],
      "sourceIds": [
        "sify-ifc-et-2026"
      ],
      "notes": "Classified as announced until construction stage is confirmed from Sify/IFC documents.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "aws-telangana-expansion",
      "name": "AWS Telangana cloud datacenter expansion",
      "status": "announced",
      "operator": "Amazon Web Services",
      "constructionLead": "AWS / not publicly disclosed",
      "hyperscaler": "AWS",
      "customerType": "Hyperscaler-owned cloud expansion",
      "location": {
        "city": "Hyderabad",
        "state": "Telangana",
        "cluster": "Hyderabad"
      },
      "value": {
        "display": "USD 7B over 14 years",
        "usdBillion": 7,
        "basis": "Strategic framework agreement with Telangana government"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Capacity not disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not disclosed"
      },
      "power": {
        "source": "Not disclosed; likely grid-backed with corporate renewable matching",
        "detail": "Material policy question: how much new open-access renewable supply and firming this expansion requires in Telangana.",
        "confidence": "low",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Agreement reported December 2025; 14-year expansion horizon",
      "stageConfidence": "medium",
      "includeInHeadline": true,
      "tags": [
        "telangana-load-growth",
        "hyperscaler",
        "ai-demand",
        "open-access"
      ],
      "sourceIds": [
        "aws-telangana-toi-2025"
      ],
      "notes": "Separate from the already-operational Hyderabad region because it is a new expansion commitment.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "hypervault-telangana",
      "name": "HyperVault AI Data Center, Telangana",
      "status": "announced",
      "operator": "HyperVault (TCS 51% / TPG 49%)",
      "constructionLead": "TCS",
      "hyperscaler": "Not disclosed",
      "customerType": "AI data-centre build-out",
      "location": {
        "city": "Maheshwaram",
        "state": "Telangana",
        "cluster": "Hyderabad"
      },
      "value": {
        "display": "~INR 18,000 cr TCS+TPG JV; ~1 GW build-out",
        "usdBillion": 2.1,
        "basis": "TCS-TPG JV (Mar 2026)"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": 450,
        "powerDrawNote": "450 MW ISTS GNA connectivity applied at CTUIL (Maheshwaram); part of a reported ~1 GW build-out.",
        "computeGw": null,
        "computeNote": "Not disclosed"
      },
      "power": {
        "source": "ISTS grid — CTUIL GNA application under process",
        "detail": "450 MW bulk-consumer ISTS GNA application (CERC GNA Reg 17.1(iii)), app 2200003810, filed 24 Jun 2026.",
        "confidence": "medium",
        "firmnessTier": "undisclosed"
      },
      "timeline": "TCS-TPG JV Mar 2026; CTUIL GNA application Jun 2026; ~1 GW build-out",
      "stageConfidence": "medium",
      "includeInHeadline": true,
      "tags": [
        "telangana",
        "hyderabad",
        "ists-connectivity",
        "tcs",
        "ai-load"
      ],
      "sourceIds": [
        "src-ctuil-gna-portal"
      ],
      "notes": "Surfaced via the CTUIL GNA register — not previously in the press-tracked registry. Demonstrates the connectivity source catching projects press missed.",
      "lastVerified": "2026-06-30"
    },
    {
      "id": "lt-kanchipuram-tn",
      "name": "L&T Kanchipuram datacenter expansion, Tamil Nadu",
      "status": "announced",
      "operator": "L&T (L&T Realty / L&T Data Centres)",
      "constructionLead": "Larsen & Toubro",
      "hyperscaler": "Not disclosed",
      "customerType": "Third-party colocation / cloud-neutral capacity",
      "location": {
        "city": "Kanchipuram",
        "state": "Tamil Nadu",
        "cluster": "Chennai"
      },
      "value": {
        "display": "INR 15,000 crore, approx USD 1.76B",
        "usdBillion": 1.76,
        "basis": "Tamil Nadu MoU (4 Jun 2026), DC portion of INR 18,600 cr total"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Expansion of an existing ~90 MW Kanchipuram campus; incremental MW not disclosed in MoU coverage",
        "computeGw": null,
        "computeNote": "Not disclosed"
      },
      "power": {
        "source": "Not disclosed",
        "detail": "Refresh from L&T / Guidance Tamil Nadu filings.",
        "confidence": "low",
        "firmnessTier": "undisclosed"
      },
      "timeline": "MoU signed 4 Jun 2026; ~500 jobs",
      "stageConfidence": "medium",
      "includeInHeadline": true,
      "tags": [
        "third-party-capacity",
        "tamil-nadu",
        "chennai",
        "state-mou",
        "capacity-unreported"
      ],
      "sourceIds": [
        "src-lt-kanchipuram-2026"
      ],
      "notes": "Scale-up of L&T's existing ~90 MW Kanchipuram campus; incremental capacity to be confirmed.",
      "lastVerified": "2026-06-24"
    },
    {
      "id": "microsoft-india-expansion",
      "name": "Microsoft India AI and cloud infrastructure expansion",
      "status": "announced",
      "operator": "Microsoft",
      "constructionLead": "Microsoft / not publicly disclosed",
      "hyperscaler": "Microsoft",
      "customerType": "Hyperscaler cloud and AI expansion",
      "location": {
        "city": "Multiple / fourth cluster not disclosed",
        "state": "Multiple",
        "cluster": "India"
      },
      "value": {
        "display": "USD 17.5B (2026-2029) for cloud + AI, on top of an earlier USD 3B (2025)",
        "usdBillion": 17.5,
        "basis": "Microsoft Dec 2025 announcement (supersedes the Jan 2025 USD 3B figure)"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Capacity and site-level draw not disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not disclosed"
      },
      "power": {
        "source": "Not disclosed; Microsoft 100/100/0 creates demand-side pressure",
        "detail": "Watch for hourly zero-carbon procurement, grid interconnection, and backup-power decarbonization signals.",
        "confidence": "low",
        "firmnessTier": "undisclosed"
      },
      "timeline": "Announced January 2025; fourth India cluster reported as in the works",
      "stageConfidence": "medium",
      "includeInHeadline": true,
      "tags": [
        "hyperscaler",
        "ai-demand",
        "cfe-24x7",
        "location-unknown"
      ],
      "sourceIds": [
        "microsoft-wsj-2025",
        "src-msft-175b-2025"
      ],
      "notes": "New India South Central (Hyderabad) region announced — Microsoft's largest India hyperscale region (3 availability zones). Split into site rows once locations are filed.",
      "lastVerified": "2026-06-24"
    },
    {
      "id": "tillman-ap-tdgap1",
      "name": "Tillman Global Holdings TDGAP1, Visakhapatnam",
      "status": "mou_speculative",
      "operator": "Tillman Global Holdings",
      "constructionLead": "Tillman Global Holdings",
      "hyperscaler": "Not disclosed",
      "customerType": "Hyperscale campus",
      "location": {
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "cluster": "Visakhapatnam"
      },
      "value": {
        "display": "INR 15,000 crore, approx USD 1.76B",
        "usdBillion": 1.76,
        "basis": "MoU value normalized at INR 85/USD"
      },
      "capacity": {
        "itLoadMw": 300,
        "powerDrawMw": 300,
        "powerDrawNote": "Reported as 300 MW hyperscale campus; total facility draw not disclosed",
        "computeGw": null,
        "computeNote": "Compute capacity not disclosed"
      },
      "power": {
        "source": "Not disclosed",
        "detail": "Track land, grid-connection and renewable-procurement filings before counting as firm pipeline.",
        "confidence": "low",
        "firmnessTier": "undisclosed"
      },
      "timeline": "MoU reported November 2025",
      "stageConfidence": "low",
      "includeInHeadline": false,
      "tags": [
        "mou",
        "andhra-pradesh",
        "hyperscale",
        "grid-connection-watch"
      ],
      "sourceIds": [
        "tillman-ap-toi-2025"
      ],
      "notes": "Excluded from headline counts until land, financing, or construction evidence improves.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "anant-raj-ap-mou",
      "name": "Anant Raj Cloud AP datacenter and IT park",
      "status": "mou_speculative",
      "operator": "Anant Raj Cloud",
      "constructionLead": "Anant Raj Cloud",
      "hyperscaler": "Not disclosed",
      "customerType": "Datacenter and cloud services campus",
      "location": {
        "city": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "cluster": "Visakhapatnam"
      },
      "value": {
        "display": "INR 4,500 crore, approx USD 0.53B",
        "usdBillion": 0.53,
        "basis": "MoU value normalized at INR 85/USD"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Project capacity not disclosed in MoU reporting",
        "computeGw": null,
        "computeNote": "Compute capacity not disclosed"
      },
      "power": {
        "source": "Not disclosed",
        "detail": "Track whether this becomes part of Anant Raj's reported 307 MW capacity plan.",
        "confidence": "low",
        "firmnessTier": "undisclosed"
      },
      "timeline": "MoU reported November 2025",
      "stageConfidence": "low",
      "includeInHeadline": false,
      "tags": [
        "mou",
        "andhra-pradesh",
        "enterprise-cloud",
        "capacity-unreported"
      ],
      "sourceIds": [
        "anant-ap-toi-2025"
      ],
      "notes": "Excluded from headline counts until capacity and construction stage are verified.",
      "lastVerified": "2026-06-23"
    },
    {
      "id": "anant-raj-haryana-mou",
      "name": "Anant Raj large-scale datacenter infrastructure, Haryana",
      "status": "mou_speculative",
      "operator": "Anant Raj",
      "constructionLead": "Anant Raj",
      "hyperscaler": "Not disclosed",
      "customerType": "Large-scale datacenter infrastructure",
      "location": {
        "city": "Multiple",
        "state": "Haryana",
        "cluster": "Haryana"
      },
      "value": {
        "display": "INR 20,000 crore, approx USD 2.35B",
        "usdBillion": 2.35,
        "basis": "MoU value normalized at INR 85/USD"
      },
      "capacity": {
        "itLoadMw": null,
        "powerDrawMw": null,
        "powerDrawNote": "Capacity not disclosed in MoU reporting",
        "computeGw": null,
        "computeNote": "Compute capacity not disclosed"
      },
      "power": {
        "source": "Not disclosed",
        "detail": "Track whether Haryana policy incentives translate into grid-connected capacity and renewable procurement.",
        "confidence": "low",
        "firmnessTier": "undisclosed"
      },
      "timeline": "MoU reported June 2026",
      "stageConfidence": "low",
      "includeInHeadline": false,
      "tags": [
        "mou",
        "haryana",
        "north-india-load",
        "capacity-unreported"
      ],
      "sourceIds": [
        "anant-haryana-et-2026"
      ],
      "notes": "Excluded from headline counts until site and capacity details are available.",
      "lastVerified": "2026-06-23"
    }
  ],
  "monthlySignals": [
    {
      "id": "signal-sify-ifc",
      "date": "2026-06-18",
      "type": "financing",
      "headline": "IFC committed USD 371M to Sify for 103 MW across Navi Mumbai and Chennai.",
      "whyItMatters": "Third-party capacity expansion is becoming financeable at scale, but source-of-power disclosures remain thin.",
      "sourceIds": [
        "sify-ifc-et-2026"
      ]
    },
    {
      "id": "signal-meta-jamnagar",
      "date": "2026-06-10",
      "type": "hyperscaler demand",
      "headline": "Reliance and Meta announced a 168 MW AI-enabled built-to-suit datacenter in Jamnagar.",
      "whyItMatters": "The first Meta built-to-suit capacity signal in India creates a new policy watchpoint around renewable matching, firming, and backup power.",
      "sourceIds": [
        "reliance-meta-toi-2026",
        "meta-cleanmax-et-2026"
      ]
    },
    {
      "id": "signal-anant-haryana",
      "date": "2026-06-01",
      "type": "state MoU",
      "headline": "Anant Raj signed an INR 20,000 crore Haryana datacenter MoU.",
      "whyItMatters": "North India load growth is moving beyond existing NCR capacity, but the MoU still needs site and MW confirmation.",
      "sourceIds": [
        "anant-haryana-et-2026"
      ]
    },
    {
      "id": "signal-google-foundation",
      "date": "2026-04-28",
      "type": "construction",
      "headline": "Foundation laid for Google's USD 15B, 1 GW Visakhapatnam AI hub.",
      "whyItMatters": "Gigawatt AI campuses shift the policy issue from generic datacenter incentives to grid connection, water, clean firm power, and local infrastructure sequencing.",
      "sourceIds": [
        "google-vizag-toi-2026"
      ]
    },
    {
      "id": "signal-maharashtra-ai-policy",
      "date": "2026-05-07",
      "type": "policy",
      "headline": "Maharashtra AI policy targets investment, GPU deployment, capital subsidies, and power-duty relief.",
      "whyItMatters": "State AI policy can become indirect datacenter policy when GPU deployment and power incentives are linked to local infrastructure.",
      "sourceIds": [
        "maharashtra-ai-policy-toi-2026"
      ]
    },
    {
      "id": "signal-natl-peak-270",
      "date": "2026-05-21",
      "type": "grid",
      "headline": "India set an all-time peak power demand record of 270.8 GW on 21 May 2026 — the 4th straight record day.",
      "whyItMatters": "The grid that AI datacenter load is layering onto is itself growing fast under heat stress; new firm load lands on an already record-setting peak.",
      "sourceIds": [
        "src-natl-peak-270-2026"
      ]
    },
    {
      "id": "signal-msft-175b",
      "date": "2025-12-09",
      "type": "hyperscaler demand",
      "headline": "Microsoft committed USD 17.5B to India cloud + AI (2026-2029), including a new Hyderabad hyperscale region.",
      "whyItMatters": "Nearly 6x the previously tracked USD 3B; a step-change in hyperscaler load that needs site-level power and grid-connection tracking.",
      "sourceIds": [
        "src-msft-175b-2025"
      ]
    },
    {
      "id": "signal-meta-ppa",
      "date": "2026-06-10",
      "type": "hyperscaler demand",
      "headline": "Meta contracted ~925 MW of renewable PPAs (CleanMax 837 MW + Fourth Partner 88 MW) for its India / Jamnagar AI buildout.",
      "whyItMatters": "Moves the Jamnagar project from a renewable 'signal' to contracted RE — a rare concrete clean-power data point amid mostly undisclosed plans.",
      "sourceIds": [
        "src-meta-ppa-mercom-2026"
      ]
    },
    {
      "id": "signal-lt-kanchipuram",
      "date": "2026-06-04",
      "type": "state MoU",
      "headline": "L&T signed a INR 15,000 cr Tamil Nadu MoU to expand its Kanchipuram datacenter.",
      "whyItMatters": "Adds a major third-party operator to the Chennai cluster, though the incremental MW is undisclosed.",
      "sourceIds": [
        "src-lt-kanchipuram-2026"
      ]
    },
    {
      "id": "signal-adani-jabil",
      "date": "2026-06-15",
      "type": "supply chain",
      "headline": "Adani + Jabil announced intent to build multi-GW AI-rack and datacenter-hardware manufacturing in India.",
      "whyItMatters": "Supply-chain localization (racks, PDUs, CDUs, transformers, thermal) — distinct from datacenter load, but shapes how fast India can build its own capacity.",
      "sourceIds": [
        "src-adani-jabil-2026"
      ]
    },
    {
      "id": "signal-pendurthi-tbcb-agency-open",
      "date": "2026-05-31",
      "type": "grid",
      "headline": "CTUIL bidding calendar shows the Vizag/Pendurthi delivery package in TBCB bidding, with SPV transfer targeted for 20 Jul 2026; the row-level BPC cell is blank.",
      "whyItMatters": "The Andhra Pradesh question is no longer just whether CTUIL grants the GNA applications; the gating path is whether the Pendurthi/Khammam-II transmission package advances through the TBCB process on time. The RECPDCL point is section-context only until confirmed against the RFP/SPV notice.",
      "sourceIds": [
        "src-ctuil-bidding-calendar-may26"
      ]
    },
    {
      "id": "sig-digital-edge-palava-2026-07",
      "date": "2026-07-02",
      "type": "project / customer",
      "headline": "Digital Edge reportedly buys 30 acres in Lodha Palava for a proposed 270 MW hyperscale data-centre campus.",
      "whyItMatters": "Palava's state-grid approval is turning into named customer demand. For vendors, the useful account map is now park developer + tenant operator + MSETCL, not Lodha alone.",
      "sourceIds": [
        "src-et-digital-edge-palava-2026-07",
        "src-merc-lodha-2026"
      ]
    }
  ],
  "policyWatch": [
    {
      "id": "policy-geoa-rules",
      "track": "Central power",
      "jurisdiction": "India",
      "authority": "Ministry of Power",
      "title": "Green Energy Open Access Rules, 2022 (as amended)",
      "instrument": "Electricity (Promoting Renewable Energy through Green Energy Open Access) Rules, 2022",
      "reference": "G.S.R. 418(E), 06.06.2022 (as amended G.S.R. 59(E), 27.01.2023)",
      "notifiedDate": "2022-06-06",
      "effectiveDate": "2022-06-06",
      "status": "active",
      "dcRelevance": "This is THE framework under which a datacenter can buy renewable power across the grid: lowers the open-access transaction floor to 100 kW, sets a 15-day deemed-approval clock, mandates banking of at least 30% of monthly consumption, and structures cross-subsidy/additional surcharge and standby charges. Every hyperscaler 'renewable matching' claim in India ultimately rests on…",
      "systemImplication": "Defines whether a DC's RE claim is real firm procurement or annual paper-matching; the banking and surcharge terms determine the true cost of 'green' OA power and how much it actually firms a 24x7 load.",
      "monthlyCadence": "Check powermin.gov.in 'Acts & Rules' and egazette.gov.in for further amendments; check whether the host state (MERC/KERC/TSERC/APERC/TNERC) has adopted/diluted banking and surcharge terms in its own GEOA regulations.",
      "tags": [
        "open-access",
        "banking",
        "wheeling",
        "cross-subsidy-surcharge",
        "renewable-procurement"
      ],
      "sourceIds": [
        "pol-geoa-rules",
        "pol-geoa-rules-sec"
      ]
    },
    {
      "id": "policy-elec-amend-2026",
      "track": "Central power",
      "jurisdiction": "India",
      "authority": "Ministry of Power",
      "title": "Electricity (Amendment) Rules, 2026 — captive & storage",
      "instrument": "Electricity (Amendment) Rules, 2026 (amending the Electricity Rules, 2005)",
      "reference": "G.S.R. 186(E) dated 13.03.2026, Gazette of India (Extraordinary) Part II Sec 3(i)",
      "notifiedDate": "2026-03-13",
      "effectiveDate": "2026-03-13",
      "status": "active",
      "dcRelevance": "Directly reshapes the cheapest route for a DC to secure firm clean power: captive and group-captive. Re-affirms the 26%-ownership / 51%-consumption tests for captive status and eases group-captive compliance, with key sub-rules effective 01.04.2026. A DC structuring a group-captive solar+wind+storage SPV to avoid open-access charges and cross-subsidy surcharge lives or dies…",
      "systemImplication": "Clarified group-captive norms lower the barrier to behind-the-meter-equivalent clean firm power for DCs, shifting load off discom tariffs and changing who bears cross-subsidy — a structural pull toward captive structures.",
      "monthlyCadence": "Watch powermin.gov.in for clarifications/FAQs and any SERC verification-of-captive-status orders applying the new tests; litigation on the 01.04.2026 sub-rules.",
      "tags": [
        "captive",
        "group-captive",
        "ownership-test",
        "cross-subsidy",
        "firm-power"
      ],
      "sourceIds": [
        "pol-elec-amend-2026",
        "pol-elec-amend-2026-sec"
      ]
    },
    {
      "id": "policy-ists-waiver",
      "track": "Central power",
      "jurisdiction": "India",
      "authority": "Ministry of Power (RCM Division)",
      "title": "ISTS charge waiver for renewables & storage",
      "instrument": "MoP Order — Waiver of Inter-State Transmission System (ISTS) charges on transmission of electricity from wind and solar (and BESS/PSP, green hydrogen, offshore wind)",
      "reference": "MoP RCM Division order dated 29.05.2023 (consolidating/extending the ISTS waiver; solar+wind COD by 30.06.2025; green hydrogen units to 31.12.2030; offshore wind 25-yr waiver for projects commissioned by 31.12.2032). Specific F.No. not surfaced — flagged.",
      "notifiedDate": "2023-05-29",
      "effectiveDate": "2023-05-29",
      "status": "active",
      "dcRelevance": "The single biggest economic lever for a DC procuring RE from another state: an ISTS-charge waiver makes inter-state solar/wind PPAs (e.g. a Maharashtra/Telangana DC buying Rajasthan/Gujarat RE) materially cheaper. The COD cut-off (30.06.2025) and its graded rollback directly affect the levelized cost of new DC-linked RE PPAs.",
      "systemImplication": "As the waiver tapers (CERC-confirmed graded ISTC rollback), the cost of inter-state RE for DCs rises — pushing procurement toward in-state RE, captive, or storage-firmed structures.",
      "monthlyCadence": "Track MoP RCM orders and CERC sharing-of-ISTS-charges regulations for the rollback trajectory and any extension of the COD cut-off; watch for storage-specific waiver terms.",
      "tags": [
        "ISTS-waiver",
        "transmission-charges",
        "renewable-procurement",
        "BESS",
        "offshore-wind"
      ],
      "sourceIds": [
        "pol-ists-waiver",
        "pol-ists-waiver-sec"
      ]
    },
    {
      "id": "policy-cerc-gna",
      "track": "Central power",
      "jurisdiction": "India",
      "authority": "Central Electricity Regulatory Commission (CERC)",
      "title": "CERC Connectivity & General Network Access Regulations, 2022",
      "instrument": "Central Electricity Regulatory Commission (Connectivity and General Network Access to the inter-State Transmission System) Regulations, 2022 (amended; 3rd Amendment 2024, draft 4th Amendment 2026)",
      "reference": "Notification No. L-1/261/2021/CERC dated 07.06.2022",
      "notifiedDate": "2022-06-07",
      "effectiveDate": "2022-06-07",
      "status": "active",
      "dcRelevance": "This is THE primary gateway instrument for any large new load (a datacenter campus drawing hundreds of MW from the inter-state grid) to obtain connectivity and General Network Access to the ISTS. GNA replaced the old long/medium/short-term open-access regime; a datacenter procuring renewable power from another state (e.g. solar/wind in Rajasthan/Gujarat feeding a Hyderabad or…",
      "systemImplication": "GNA application volumes and connectivity grants are a leading indicator of real (vs announced) DC load arriving on the grid; the draft 4th Amendment (2026) signals CERC is reworking access rules as new large loads stress the queue.",
      "monthlyCadence": "Recheck cercind.gov.in 'Current Regulations' and 'Draft Regulations' pages monthly for the 4th Amendment status and any GNA-related orders; CTUIL (ctuil.in) for the Detailed Procedure revisions.",
      "tags": [
        "open-access",
        "GNA",
        "ISTS",
        "connectivity",
        "transmission"
      ],
      "sourceIds": [
        "pol-cerc-gna",
        "pol-cerc-gna-sec"
      ]
    },
    {
      "id": "policy-cea-connectivity",
      "track": "Central power",
      "jurisdiction": "India",
      "authority": "Central Electricity Authority (CEA), Ministry of Power",
      "title": "CEA Technical Standards for Connectivity to the Grid",
      "instrument": "Central Electricity Authority (Technical Standards for Connectivity to the Grid) Regulations, 2007 — Amendment dated 15.10.2013 and Amendment dated 06.02.2019; 2023 applicability extended to RE developers",
      "reference": "Principal regs 2007 (21.02.2007); Amendment No. 12/X/STD(CONN)/GM/CEA/2018 dated 06.02.2019",
      "notifiedDate": "2007-02-21",
      "effectiveDate": "2019-02-06",
      "status": "active",
      "dcRelevance": "Sets the technical conditions (voltage levels, protection, metering, fault-ride-through, power-quality) any new connectee — including a hyperscale datacenter taking grid connectivity at EHV — must meet to be energised. A DC's substation and switchyard design must comply with these standards before the licensee/CTU will connect it. The pairing of CEA technical standards (the…",
      "systemImplication": "Power-quality and harmonic-injection limits matter unusually much for DC loads (large rectifier/UPS fleets); compliance cost and lead time here is an under-appreciated friction on the pipeline.",
      "monthlyCadence": "Recheck cea.nic.in 'Connectivity to the Grid' regulations category for any further amendment; watch for CEA planning/large-load guidance specific to datacenters.",
      "tags": [
        "CEA",
        "technical-standards",
        "connectivity",
        "power-quality",
        "EHV"
      ],
      "sourceIds": [
        "pol-cea-connectivity",
        "pol-cea-connectivity-sec"
      ]
    },
    {
      "id": "policy-rpo-eso",
      "track": "Central power",
      "jurisdiction": "India",
      "authority": "Ministry of Power (under Energy Conservation Act, 2001)",
      "title": "RPO / RCO & Energy Storage Obligation trajectory",
      "instrument": "Renewable Purchase Obligation and Energy Storage Obligation Trajectory notification (under Energy Conservation Act, 2001 as amended 2022)",
      "reference": "S.O. 4617(E) dated 20.10.2023 (effective 01.04.2024)",
      "notifiedDate": "2023-10-20",
      "effectiveDate": "2024-04-01",
      "status": "active",
      "dcRelevance": "Sets the binding renewable-consumption obligation (29.91% in FY25 rising to 43.33% by FY30) that applies to obligated entities including large open-access/captive consumers — i.e. a datacenter is itself an obligated entity for the green share of its consumption. RPO compliance (via green power, RECs, or banked RE) is a hard floor on how clean a DC's power mix must be,…",
      "systemImplication": "Rising RPO percentages tighten the screw on DC power mixes year over year; the dropped ESO removes a would-be mandated-storage demand driver — relevant to any storage-buildout narrative in the dashboard.",
      "monthlyCadence": "Watch powermin.gov.in / BEE for any further RPO revision or reinstated storage obligation; SERC RPO-compliance orders for open-access consumers.",
      "tags": [
        "RPO",
        "ESO",
        "obligated-entity",
        "RECs",
        "renewables"
      ],
      "sourceIds": [
        "pol-rpo-eso",
        "pol-rpo-eso-sec"
      ]
    },
    {
      "id": "policy-derc-geoa",
      "track": "State power regulator",
      "jurisdiction": "Delhi NCR",
      "authority": "DERC (Delhi Electricity Regulatory Commission)",
      "title": "DERC Green Energy Open Access Regulations (2024, amended 2026)",
      "instrument": "DERC (Terms and Conditions for Green Energy Open Access) Regulations, 2024 (notified 12 Nov 2024); First Amendment draft 2026 removes the 11 kV voltage-level eligibility floor",
      "reference": "DERC GEOA Regulations notified 12-11-2024; 2026 First Amendment in draft",
      "notifiedDate": "2024-11-12",
      "effectiveDate": "2024-11-12",
      "status": "active",
      "dcRelevance": "Operationalizes GEOA for NCR datacenters: 2024 regs already remove load limitation for captive green projects; the 2026 draft amendment drops the 11 kV-or-above connection requirement, widening eligibility so more NCR DC loads can procure renewable via open access rather than grid-default.",
      "systemImplication": "DERC is the SERC that determines whether GEOA's central promise is actually deliverable in NCR — the voltage-norm removal materially expands the addressable green-OA pool for Delhi-NCR DCs, partly offsetting the NCR diesel-backup penalty with cleaner grid-procured supply.",
      "monthlyCadence": "Track derc.gov.in 'Regulations' and orders for finalization of the 2026 First Amendment (11 kV removal), banking/surcharge terms, and captive-project provisions.",
      "tags": [
        "open-access",
        "derc",
        "delhi-ncr",
        "voltage-norm",
        "renewable-procurement"
      ],
      "sourceIds": [
        "pol-derc-geoa",
        "pol-derc-geoa-sec"
      ]
    },
    {
      "id": "policy-merc-oa",
      "track": "State power regulator",
      "jurisdiction": "Maharashtra",
      "authority": "Maharashtra Electricity Regulatory Commission (MERC)",
      "title": "MERC Distribution / Green Open Access framework",
      "instrument": "MERC (Distribution Open Access) (Second Amendment) Regulations, 2023 — carries the Green Energy Open Access provisions; sits on MERC (Distribution Open Access) Regulations, 2016",
      "reference": "Distribution Open Access (Second Amendment) Regulations notified 10.11.2023 (MSEDCL implementation circular 09.09.2024); base DOA Regulations gazetted 30.03.2016",
      "notifiedDate": "2023-11-10",
      "effectiveDate": "2023-11-10",
      "status": "active",
      "dcRelevance": "Maharashtra is a top-tier tracked DC load (Mumbai/Pune/Navi Mumbai clusters). MERC does NOT have a standalone 'GEOA 2024' — the green-open-access rules are embedded in the DOA (Second Amendment) Regulations, 2023: 100 kW threshold (waived for captive), MSLDC as STOA nodal agency, banking charges set at 8% of energy banked. These are the binding wheeling/banking economics for…",
      "systemImplication": "8%-of-banked-energy banking charge and the captive-threshold waiver are the levers that decide whether Maharashtra DC RE procurement pencils out vs. neighbouring states.",
      "monthlyCadence": "Track merc.gov.in current-regulations-open-access page and MERC orders for further DOA amendments, banking-charge revisions, and additional-surcharge determinations in MYT orders.",
      "tags": [
        "open-access",
        "merc",
        "maharashtra",
        "banking",
        "captive"
      ],
      "sourceIds": [
        "pol-merc-oa",
        "pol-merc-oa-sec"
      ]
    },
    {
      "id": "policy-aperc-geoa",
      "track": "State power regulator",
      "jurisdiction": "Andhra Pradesh",
      "authority": "Andhra Pradesh Electricity Regulatory Commission (APERC)",
      "title": "APERC Green Energy Open Access, Charges & Banking Regulations, 2024",
      "instrument": "APERC (Green Energy Open Access, Charges, and Banking) Regulation, 2024",
      "reference": "Order/SOR dated 01.05.2024 (notified ~02.05.2024)",
      "notifiedDate": "2024-05-02",
      "effectiveDate": "2024-05-01",
      "status": "active",
      "dcRelevance": "AP is the single largest tracked DC build (Vizag ~2.1 GW grid ask ≈ 15% of AP peak per the dashboard's gridContext), so APERC's GEOA terms are arguably the most load-bearing SERC instrument in the whole watch. Key DC-relevant terms: banking charge 8% of energy stored, banking capped at 30% of monthly consumption, unused energy reimbursed at 75% of latest SECI tender rate,…",
      "systemImplication": "The 30% banking cap + 75%-SECI clawback materially weakens the firmness of RE-banked supply for AP's giant DC asks — a direct input to the firmness-tier ladder for the Vizag cluster.",
      "monthlyCadence": "Track aperc.gov.in orders for amendments to banking %/cap and additional-surcharge revisions; cross-check the AP Integrated Clean Energy Policy 2024 (G.O.Ms.No.37 dated 30.10.2024) which interacts with these terms.",
      "tags": [
        "open-access",
        "aperc",
        "andhra-pradesh",
        "banking",
        "additional-surcharge"
      ],
      "sourceIds": [
        "pol-aperc-geoa",
        "pol-aperc-geoa-sec"
      ]
    },
    {
      "id": "policy-tnerc-geoa",
      "track": "State power regulator",
      "jurisdiction": "Tamil Nadu",
      "authority": "Tamil Nadu Electricity Regulatory Commission (TNERC)",
      "title": "TNERC Green Energy Open Access Regulations, 2025",
      "instrument": "TNERC (Terms and Conditions for Green Energy Open Access) Regulations, 2025",
      "reference": "Notified 18.09.2025 (effective 01.10.2025); supersedes 2024 draft dated 13.06.2024",
      "notifiedDate": "2025-09-18",
      "effectiveDate": "2025-10-01",
      "status": "active",
      "dcRelevance": "Tamil Nadu (Chennai/Ambattur/Siruseri DC corridor) is a tracked DC load. The operative instrument is now the GEOA Regulations 2025 (in force 01.10.2025), which replaced the long-pending 2024 draft. Eligibility from 63 KVA-class connected load, concessional transmission/wheeling for intra-state RE only — directly shapes the wheeling cost stack for Chennai-region datacenters.",
      "systemImplication": "Intra-state-only concession nudges DC RE sourcing toward in-state generation; the 2024-to-2025 transition means any pre-2025 modelling of TN wheeling economics is now stale.",
      "monthlyCadence": "Track tnerc.gov.in / tnerc.tn.gov.in Regulation and Order pages for amendments to the 2025 GEOA Regulations and TANGEDCO implementation procedures.",
      "tags": [
        "open-access",
        "tnerc",
        "tamil-nadu",
        "wheeling",
        "intra-state"
      ],
      "sourceIds": [
        "pol-tnerc-geoa",
        "pol-tnerc-geoa-sec"
      ]
    },
    {
      "id": "policy-tserc-oa",
      "track": "State power regulator",
      "jurisdiction": "Telangana",
      "authority": "Telangana State Electricity Regulatory Commission (TSERC)",
      "title": "TSERC Open Access Regulation, 2024",
      "instrument": "TSERC (Terms and Conditions of Open Access) Regulation, 2024 — Regulation 1 of 2024",
      "reference": "Open Access Regulation 1 of 2024 (notified 2024; gazette PDF on tgerc portal)",
      "notifiedDate": "2024-01-01",
      "effectiveDate": "2024-01-01",
      "status": "active",
      "dcRelevance": "Hyderabad is a major tracked DC cluster. TSERC folds green open access into a single Open Access Regulation 1 of 2024 (no separate GEOA reg): 100 kW threshold (aggregation allowed within a discom division), banking limited to 30% monthly, additional surcharge in the ~Rs 1.09–1.40/kWh band for FY24-25. Covers captive and GEOA users on intra-state networks — the cost terms for…",
      "systemImplication": "A Rs ~1.1–1.4/kWh additional surcharge plus 30% banking cap is a meaningful drag on Hyderabad DC clean-power economics; surcharge level is the variable to watch in each tariff cycle.",
      "monthlyCadence": "Track tgerc.telangana.gov.in / tserc.gov.in regulation and tariff pages for additional-surcharge revisions and any standalone GEOA regulation superseding the 2024 OA reg.",
      "tags": [
        "open-access",
        "tserc",
        "telangana",
        "additional-surcharge",
        "hyderabad"
      ],
      "sourceIds": [
        "pol-tserc-oa",
        "pol-tserc-oa-sec"
      ]
    },
    {
      "id": "policy-gerc-geoa",
      "track": "State power regulator",
      "jurisdiction": "Gujarat",
      "authority": "Gujarat Electricity Regulatory Commission (GERC)",
      "title": "GERC Green Energy Open Access Regulations, 2024",
      "instrument": "GERC (Terms and Conditions for Green Energy Open Access) Regulations, 2024 (subsequent amendment regulations extend banking charge)",
      "reference": "Notification No. 8 of 2024, published in Gujarat Government Gazette 21.02.2024; banking-charge extensions via later Amendment Regulations (e.g. Fifth Amendment, 2026)",
      "notifiedDate": "2024-02-21",
      "effectiveDate": "2024-02-21",
      "status": "active",
      "dcRelevance": "Gujarat (GIFT City / Jamnagar / Gandhinagar DC interest) is a tracked DC state. GERC GEOA Regulations 2024 (Notification 8 of 2024) set the banking and open-access charge framework; the binding live variable is the banking charge, currently Rs 1.50/kWh, repeatedly extended (proposed through ~Aug 2026 via the draft Fifth Amendment). That Rs 1.50/unit banking charge is a direct…",
      "systemImplication": "Gujarat's persistently-extended Rs 1.50/unit banking charge is one of the higher RE-firming costs among tracked states — a recurring negative on the Gujarat DC clean-power case.",
      "monthlyCadence": "Track gercin.org for GEOA amendment regulations (banking-charge extensions/revisions) — this state amends frequently, so recheck monthly.",
      "tags": [
        "open-access",
        "gerc",
        "gujarat",
        "banking-charge",
        "amendments"
      ],
      "sourceIds": [
        "pol-gerc-geoa",
        "pol-gerc-geoa-sec"
      ]
    },
    {
      "id": "policy-kerc-oa",
      "track": "State power regulator",
      "jurisdiction": "Karnataka",
      "authority": "Karnataka Electricity Regulatory Commission (KERC)",
      "title": "KERC Open Access Regulations",
      "instrument": "KERC (Terms and Conditions for Open Access) Regulations, 2025 — replaces KERC GEOA Regulations 2022 quashed by Karnataka High Court",
      "reference": "Karnataka HC judgment dated 20.12.2024 declaring the central GEOA Rules 2022 and KERC GEOA Regulations 2022 ultra vires; KERC Open Access Regulations 2025 issued in response",
      "notifiedDate": "2025-01-01",
      "effectiveDate": "2025-01-01",
      "status": "watch",
      "dcRelevance": "Bengaluru is a major tracked DC cluster — and this is the highest-value correction in this pass. On 20 Dec 2024 the Karnataka HC struck down BOTH the central GEOA Rules 2022 and KERC's GEOA Regulations 2022 as ultra vires, forcing KERC to issue new Open Access Regulations 2025. Any dashboard claim resting on KERC's 2022 GEOA regime is now stale. KERC had also halved the…",
      "systemImplication": "A struck-down GEOA regime injects regulatory uncertainty into Bengaluru DC RE procurement until the 2025 OA regulations fully settle; the central-vs-state vires fight is a systemic risk flag, not a Karnataka-only one.",
      "monthlyCadence": "Track kerc.karnataka.gov.in for the final 2025 Open Access Regulations, any appeal/stay of the Dec-2024 HC order, and additional-surcharge determinations; this is the most fluid of the tracked states.",
      "tags": [
        "open-access",
        "kerc",
        "karnataka",
        "court-ruling",
        "additional-surcharge"
      ],
      "sourceIds": [
        "pol-kerc-oa",
        "pol-kerc-oa-sec"
      ]
    },
    {
      "id": "policy-herc-geoa",
      "track": "State power regulator",
      "jurisdiction": "Haryana",
      "authority": "Haryana Electricity Regulatory Commission (HERC)",
      "title": "HERC Green Energy Open Access Regulations, 2023",
      "instrument": "HERC (Green Energy Open Access) Regulations, 2023; HERC (Green Energy Open Access) First Amendment Regulations, 2025",
      "reference": "Principal Regulations notified 2023; First Amendment Regulations, 2025",
      "notifiedDate": "2023-04-01",
      "effectiveDate": "2023-04-01",
      "status": "active",
      "dcRelevance": "Haryana (Gurugram/Manesar NCR DC corridor) is a tracked DC load and sits inside the CAQM/GRAP diesel-restriction zone, so its open-access and backup regimes stack. HERC GEOA Regulations 2023 + 1st Amendment 2025: 100 kW threshold with aggregation, NO supply limit for captive green-OA consumers, offshore-wind additional-surcharge exemption extended to Dec 2032, and…",
      "systemImplication": "Captive-no-cap + simultaneous-application reforms ease NCR DC clean-power scaling, partially offsetting the CAQM diesel-backup squeeze on the same Gurugram cluster.",
      "monthlyCadence": "Track herc.gov.in regulations and orders for further GEOA amendments and additional-surcharge/exemption changes.",
      "tags": [
        "open-access",
        "herc",
        "haryana",
        "captive",
        "ncr"
      ],
      "sourceIds": [
        "pol-herc-geoa",
        "pol-herc-geoa-sec"
      ]
    },
    {
      "id": "policy-caqm-dg",
      "track": "Environment & water",
      "jurisdiction": "Delhi NCR",
      "authority": "Commission for Air Quality Management in NCR and Adjoining Areas (CAQM)",
      "title": "CAQM diesel-generator restrictions & GRAP (NCR)",
      "instrument": "CAQM Statutory Direction No. 73 (revised schedule for regulated operation of DG sets in NCR, incl. GRAP periods)",
      "reference": "Direction No. 73 dated 02.06.2023 (effective 01.10.2023)",
      "notifiedDate": "2023-06-02",
      "effectiveDate": "2023-10-01",
      "status": "active",
      "dcRelevance": "The single most binding backup-power constraint for NCR datacenters. From 01.10.2023, unconverted diesel gensets are effectively prohibited in NCR; DG sets are permitted only with dual-fuel kits / emission-control devices, with IT and data services named among the limited emergency-exempt categories. A Tier-III/IV DC's entire N+1 diesel resilience model in NCR must be…",
      "systemImplication": "CAQM's diesel squeeze is a real-economy push toward grid-firmness, gas, and battery backup for NCR DCs — and a soft locational disadvantage for NCR vs less-restricted DC hubs; GRAP escalations are an episodic operational risk.",
      "monthlyCadence": "Watch caqm.nic.in for new Directions, GRAP stage invocations each winter, and any amendment to the DG-set schedule / exemption list for data services.",
      "tags": [
        "CAQM",
        "GRAP",
        "diesel-genset",
        "backup-power",
        "NCR"
      ],
      "sourceIds": [
        "pol-caqm-dg",
        "pol-caqm-dg-sec"
      ]
    },
    {
      "id": "policy-cpcb-genset",
      "track": "Environment & water",
      "jurisdiction": "India",
      "authority": "Central Pollution Control Board (CPCB) / MoEF&CC",
      "title": "CPCB diesel-genset emission norms & RECD",
      "instrument": "Revised emission standards for diesel engines (gensets up to 800 kW) — 'CPCB IV+' regime, with System & Procedure for RECD type-approval; references GSR 771(E)/2013 lineage",
      "reference": "G.S.R. 804(E) dated 03.11.2022 (genset emission standards, gensets up to 800 kW); RECD type-approval procedure PCLS/12/2021-22",
      "notifiedDate": "2022-11-03",
      "effectiveDate": "",
      "status": "active",
      "dcRelevance": "Sets the national emission ceiling for new diesel gensets (the 'CPCB IV+' standard) AND the type-approval regime for Retrofit Emission Control Devices (RECD) that in-use DC backup gensets must fit to keep operating — especially in NCR under the CAQM direction. This is the supply-side instrument that makes compliant DG backup more expensive and constrains genset choice…",
      "systemImplication": "Combined with the CAQM/GRAP NCR restrictions, the CPCB IV+ + RECD regime nationalizes the cost pressure on diesel backup. Over a 24-36 month horizon it pushes hyperscale DC backup toward larger BESS, gas/HVO, and fuel cells; RECD type-approval supply becomes a procurement bottleneck.",
      "monthlyCadence": "Check cpcb.nic.in/genset-notifications and the RECD certified-manufacturer list for new GSR amendments, compliance deadlines, and the rolling list of type-approved RECD vendors.",
      "tags": [
        "backup-power",
        "diesel",
        "emission-standards",
        "RECD",
        "CPCB-IV"
      ],
      "sourceIds": [
        "pol-cpcb-genset",
        "pol-cpcb-genset-sec"
      ]
    },
    {
      "id": "policy-cgwa-water",
      "track": "Environment & water",
      "jurisdiction": "India",
      "authority": "Central Ground Water Authority (CGWA), Ministry of Jal Shakti",
      "title": "CGWA groundwater extraction NOC regime",
      "instrument": "CGWA Guidelines to regulate and control ground water extraction in India (NOC regime), notified 24.09.2020",
      "reference": "CGWA Guidelines dated 24.09.2020 (issued under Environment (Protection) Act, 1986 directions); exact S.O. number not confirmed",
      "notifiedDate": "2020-09-24",
      "effectiveDate": "2020-09-24",
      "status": "active",
      "dcRelevance": "Liquid/evaporative-cooled datacenters are large water users. CGWA: NO groundwater NOC in over-exploited blocks for industrial use; >100 m3/day users must do annual water audits, cut use 20% over 3 years, install piezometers, and pay abstraction charges. This constrains DC siting in water-stressed zones (relevant to several proposed DC clusters) and pushes toward recycled/air…",
      "systemImplication": "Water availability is becoming a co-equal siting constraint with power; water-stressed but power-rich locations may still be blocked, reshaping where MW actually land.",
      "monthlyCadence": "Watch CGWA/CGWB for revised extraction guidelines and any datacenter- or cooling-specific water norms; track state ground-water authority equivalents.",
      "tags": [
        "water",
        "cooling",
        "CGWA",
        "groundwater",
        "siting"
      ],
      "sourceIds": [
        "pol-cgwa-water",
        "pol-cgwa-water-sec"
      ]
    },
    {
      "id": "policy-mh-ai-dc",
      "track": "State DC/AI policy",
      "jurisdiction": "Maharashtra",
      "authority": "Industries, Energy & Labour Dept (IT/ITeS); Dept of IT (AI Policy), Govt of Maharashtra",
      "title": "Maharashtra AI Policy 2026 & datacenter power-duty relief",
      "instrument": "Maharashtra IT & ITeS Policy, 2023 (GR No. ITP-2021/CR-170/Ind-2, 27.06.2023) — the instrument that PERMANENTLY exempts datacenter electricity duty; Maharashtra AI Policy 2026 (Cabinet-approved Apr 2026; GR ~06.05.2026) adds GPU/compute incentives",
      "reference": "GR No. ITP-2021/CR-170/Ind-2 dated 27.06.2023 (IT/ITeS Policy 2023); AI Policy 2026 GR number not yet confirmed (Cabinet decision 29.04.2026)",
      "notifiedDate": "2023-06-27",
      "effectiveDate": "2023-06-27",
      "status": "active",
      "dcRelevance": "Datacenter power economics in Maharashtra (India's #1 DC state, Mumbai/Pune) rest on the IT/ITeS Policy 2023: PERMANENT electricity-duty exemption for registered DCs + Rs 1/unit power subsidy (non-Zone-I) + 100% stamp duty + 24x7 industry status. The 2026 AI Policy layers GPU/compute and CoE incentives on top. We currently cite only a ToI piece on the AI policy and miss the…",
      "systemImplication": "Permanent (not time-bound) duty exemption is unusually generous and a key reason Mumbai concentrates DC load; the AI policy signals the state pivoting from passive DC host to active compute-cluster subsidiser.",
      "monthlyCadence": "Track gr.maharashtra.gov.in for the AI Policy 2026 GR (confirm number/date) and any successor IT/ITeS policy; watch MERC for OA/captive orders.",
      "tags": [
        "maharashtra",
        "power-duty",
        "IT-ITeS-2023",
        "AI-policy-2026",
        "GR"
      ],
      "sourceIds": [
        "pol-mh-ai-dc",
        "pol-mh-ai-dc-sec"
      ]
    },
    {
      "id": "policy-ka-it-dc",
      "track": "State DC/AI policy",
      "jurisdiction": "Karnataka",
      "authority": "Government of Karnataka, Department of Electronics, IT, BT (and S&T)",
      "title": "Karnataka IT Policy 2025-2030 & Data Centre Policy",
      "instrument": "Karnataka Information Technology (IT) Policy 2025-2030",
      "reference": "Notified by GoK Dept of Electronics, IT, BT & S&T (official PDF hosted on eitbt.karnataka.gov.in). Exact GO/notification number to confirm — flagged.",
      "notifiedDate": "2025-11-01",
      "effectiveDate": "2025-11-01",
      "status": "active",
      "dcRelevance": "Offers reimbursement of electricity duty (plus rent, telecom, property tax) for IT/ITeS/GCC units and infrastructure developers, with a ₹50,000-per-employee grant to move workforce to Mysuru/Mangaluru/Hubballi-Dharwad/Kalaburagi/Tumakuru. Could steer datacenter and GCC compute load to tier-2 Karnataka clusters if power and fiber follow — relevant to where new DC load lands on…",
      "systemImplication": "Electricity-duty reimbursement is a direct power-cost subsidy; the tier-2 dispersal incentive could redistribute future DC load away from the saturated Bengaluru node toward less-loaded ESCOM areas.",
      "monthlyCadence": "Track eitbt.karnataka.gov.in for implementation guidelines and the datacenter-specific incentive schedule; watch KERC GEOA/banking regs and ESCOM tariff orders.",
      "tags": [
        "state-policy",
        "karnataka",
        "electricity-duty",
        "tier-2",
        "IT-policy"
      ],
      "sourceIds": [
        "pol-ka-it-dc",
        "pol-ka-it-dc-sec"
      ]
    },
    {
      "id": "policy-tn-dc",
      "track": "State DC/AI policy",
      "jurisdiction": "Tamil Nadu",
      "authority": "Information Technology Dept, Govt of Tamil Nadu (ELCOT nodal)",
      "title": "Tamil Nadu Data Centre Policy 2021",
      "instrument": "Tamil Nadu Data Centre Policy 2021",
      "reference": "TN Data Centre Policy 2021 (applies to DCs set up 01.04.2021 to 31.03.2026); G.O. number not confirmed from official text",
      "notifiedDate": "2021-04-01",
      "effectiveDate": "2021-04-01",
      "status": "watch",
      "dcRelevance": "Chennai is a major landing point for subsea cables and a fast-growing DC market (L&T, others investing). Policy gives 100% subsidy on electricity tax (grid OR captive) for 5 years from commercial operation, industrial-tariff power, and MSME service reimbursements. Note: the policy window expires 31.03.2026 — a successor/renewal is the key thing to watch.",
      "systemImplication": "TN couples DC growth to cable-landing geography; the 2026 expiry creates a policy cliff — whether TN renews/upgrades signals how aggressively southern states compete for AI DC load.",
      "monthlyCadence": "Watch it.tn.gov.in for a successor Data Centre Policy (post-31.03.2026) and any AI/GCC policy with DC power provisions.",
      "tags": [
        "tamil-nadu",
        "data-centre-policy-2021",
        "electricity-tax",
        "expiry-2026"
      ],
      "sourceIds": [
        "pol-tn-dc",
        "pol-tn-dc-sec"
      ]
    },
    {
      "id": "policy-ts-dc",
      "track": "State DC/AI policy",
      "jurisdiction": "Telangana",
      "authority": "ITE&C Dept, Govt of Telangana (Invest Telangana)",
      "title": "Telangana Data Centre Policy 2016 — 'essential service' status",
      "instrument": "Telangana Data Centres Policy, 2016",
      "reference": "Telangana Data Centres Policy 2016; G.O. number not confirmed from official text",
      "notifiedDate": "2016-01-01",
      "effectiveDate": "2016-01-01",
      "status": "active",
      "dcRelevance": "Hyderabad is a top DC + cloud-region market (AWS, Microsoft, Google capacity). Telangana was first to classify datacenters as an 'Essential Service' (24x7 operation, exempt from statutory power cuts), provide dual-grid supply, and allow open-access RE up to one-third of power need. The 'essential service' + no-power-cut status is the template several other states copied.",
      "systemImplication": "Essential-service status = guaranteed firm grid access for DC load even during shortages, effectively a reliability subsidy; the one-third OA-RE cap is a notable ceiling on clean-power self-supply.",
      "monthlyCadence": "Watch invest.telangana.gov.in for a refreshed DC/AI policy (the 2016 policy is dated) and TSERC open-access orders affecting DC RE.",
      "tags": [
        "telangana",
        "essential-service",
        "data-centre-policy-2016",
        "open-access-cap"
      ],
      "sourceIds": [
        "pol-ts-dc",
        "pol-ts-dc-sec"
      ]
    },
    {
      "id": "policy-ap-dc",
      "track": "State DC/AI policy",
      "jurisdiction": "Andhra Pradesh",
      "authority": "ITE&C Dept / Energy Dept, Govt of AP (APEDB); APERC",
      "title": "AP IT & GCC Policy 4.0 + deemed-distribution-licensee status",
      "instrument": "Andhra Pradesh IT & Global Capability Centers (GCC) Policy 4.0, 2024-2029 (incl. AP Data Center Policy 4.0); separate AP framework granting Deemed Distribution Licence (DDL) to datacenters with >=300 MW connected load",
      "reference": "G.O. MS No. 9, dated 12.12.2024 (AP IT & GCC Policy 4.0, 2024-29); DDL-for-DC framework (300 MW threshold) approved 2026 — G.O. number not yet confirmed",
      "notifiedDate": "2024-12-12",
      "effectiveDate": "2024-12-12",
      "status": "active",
      "dcRelevance": "AP is the hottest new DC frontier (Google-Adani-Airtel Vizag hub, Reliance 1 GW, Tillman). Two instruments matter: (1) IT&GCC Policy 4.0 via G.O. MS No.9 sets DC incentives; (2) AP became the FIRST state to grant a Deemed Distribution Licence to a private datacenter operator (>=300 MW connected load) — Google's Vizag DC got one — letting the DC self-distribute power within…",
      "systemImplication": "The DDL model lets gigawatt-scale DCs effectively become their own discom — bypassing the incumbent utility for the largest, most profitable loads. If copied, it reshapes the utility business model around AI load and is the most important state-level power-structure innovation we track.",
      "monthlyCadence": "Track APERC orders for each DDL grant and APEDB/G.O. issuances; watch whether other states (TG, MH, UP) adopt the deemed-licence model.",
      "tags": [
        "andhra-pradesh",
        "deemed-distribution-licence",
        "300MW",
        "IT-GCC-policy-4.0",
        "G.O.-MS-9"
      ],
      "sourceIds": [
        "pol-ap-dc",
        "pol-ap-dc-sec"
      ]
    },
    {
      "id": "policy-dpdp-2025",
      "track": "Data governance",
      "jurisdiction": "India",
      "authority": "Ministry of Electronics & IT (MeitY)",
      "title": "Digital Personal Data Protection Rules, 2025",
      "instrument": "Digital Personal Data Protection Rules, 2025 (under the Digital Personal Data Protection Act, 2023)",
      "reference": "G.S.R. 846(E) dated 13.11.2025 (phased: Rules 1,2,17-21 from 13.11.2025; Rule 4 from 13.11.2026; Rules 3,5-16,22-23 from 13.05.2027)",
      "notifiedDate": "2025-11-13",
      "effectiveDate": "2025-11-13",
      "status": "active",
      "dcRelevance": "DPDP is the demand-side driver of India DC growth: it operationalises data-fiduciary obligations and (via the parent Act + Rules) the power for government to restrict cross-border transfer of certain personal data, creating a data-LOCALIZATION pull that forces data to be stored/processed onshore. Every localization-triggering provision converts directly into demand for…",
      "systemImplication": "Localization obligations are a structural, policy-manufactured floor under India DC demand independent of AI hype; the May-2027 compliance cliff is a forward demand catalyst the pipeline should price in.",
      "monthlyCadence": "Watch meity.gov.in for cross-border-transfer restriction notifications under the Rules, Significant Data Fiduciary designations, and any sectoral localization directions (RBI/insurance/health) that intensify…",
      "tags": [
        "DPDP",
        "data-localization",
        "MeitY",
        "cross-border",
        "demand-driver"
      ],
      "sourceIds": [
        "pol-dpdp-2025",
        "pol-dpdp-2025-sec"
      ]
    },
    {
      "id": "policy-rbi-localization",
      "track": "Data governance",
      "jurisdiction": "India",
      "authority": "RBI (Reserve Bank of India), DPSS",
      "title": "RBI payment-system data localization",
      "instrument": "RBI circular 'Storage of Payment System Data'",
      "reference": "RBI/2017-18/153, DPSS.CO.OD No.2785/06.08.005/2017-2018",
      "notifiedDate": "2018-04-06",
      "effectiveDate": "2018-10-15",
      "status": "active",
      "dcRelevance": "The hardest existing data-localization mandate in India: all payment-system data must be stored only on systems in India (data processed abroad must be purged and brought back within 24h). This is a confirmed, enforced driver of compliance-grade in-country datacenter demand for the BFSI/fintech segment.",
      "systemImplication": "Unlike DPDP's soft transfer model, this is hard localization already in force — it is the proven template for how a sectoral regulator can mandate on-shore compute, and the precedent any future health/telecom localization would follow.",
      "monthlyCadence": "Check rbi.org.in notifications for extensions of localization to account-aggregator, fintech, or cloud-outsourcing data; watch for any 'storage-and-processing' tightening beyond payments.",
      "tags": [
        "data-governance",
        "rbi",
        "hard-localization",
        "payments",
        "bfsi"
      ],
      "sourceIds": [
        "pol-rbi-localization",
        "pol-rbi-localization-sec"
      ]
    },
    {
      "id": "policy-indiaai",
      "track": "Data governance",
      "jurisdiction": "India",
      "authority": "MeitY / IndiaAI (IBD)",
      "title": "IndiaAI Mission — subsidised AI compute / GPU capacity",
      "instrument": "IndiaAI Mission (Cabinet-approved Mar 2024, Rs 10,371.92 cr); AI-compute empanelment via RFE on CPP portal (16 Aug 2024)",
      "reference": "Cabinet approval Mar 2024; RFE published 16 Aug 2024 (CPP portal)",
      "notifiedDate": "2024-03-07",
      "effectiveDate": "",
      "status": "active",
      "dcRelevance": "The central government's own compute-demand instrument: empanels Cloud/Data-Center Service Providers to supply subsidized GPUs (target 10,000, now 18,000-38,000+ units announced) — directly creating sovereign, India-located AI-compute demand that must be hosted in domestic datacenters.",
      "systemImplication": "Government-subsidized compute is itself a datacenter-load creator and a demand floor for in-country GPU hosting — it both pulls capacity and sets a reference price for AI compute, shaping the commercial DC market this dashboard tracks.",
      "monthlyCadence": "Track indiaai.gov.in and MeitY/PIB for new GPU-empanelment rounds, the indigenous-AI-model compute allocations, and any IndiaAI datacenter/CoE siting announcements.",
      "tags": [
        "indiaai",
        "gpu",
        "subsidized-compute",
        "meity",
        "sovereign-ai"
      ],
      "sourceIds": [
        "pol-indiaai",
        "pol-indiaai-sec"
      ]
    }
  ],
  "hyperscalerStandards": [
    {
      "id": "google-cfe",
      "company": "Google",
      "standard": "24/7 carbon-free energy ambition",
      "headline": "Google has pushed toward operating on carbon-free energy around the clock by 2030.",
      "indiaRelevance": "For Visakhapatnam, the policy question is whether gigawatt-scale AI load can be matched with local hourly clean power, not just annual renewable certificates.",
      "watchItems": [
        "PPA structure",
        "hourly matching",
        "grid firming",
        "water use",
        "backup generation"
      ],
      "sourceIds": [
        "google-cfe-official",
        "google-vizag-ap-2025"
      ]
    },
    {
      "id": "microsoft-100-100-0",
      "company": "Microsoft",
      "standard": "100/100/0 zero-carbon energy by 2030",
      "headline": "Microsoft targets zero-carbon energy matching for datacenters and offices every hour by 2030.",
      "indiaRelevance": "Azure expansion sites should be watched for hourly clean-energy procurement, state open-access exposure, and backup decarbonization.",
      "watchItems": [
        "hourly matching",
        "renewable PPAs",
        "storage",
        "backup power",
        "water positive"
      ],
      "sourceIds": [
        "microsoft-zero-carbon-axios",
        "microsoft-sustainability-official"
      ]
    },
    {
      "id": "aws-water-renewable",
      "company": "AWS",
      "standard": "Renewable matching and water-positive operations",
      "headline": "AWS reports corporate renewable-energy progress and a water-positive target for AWS operations by 2030.",
      "indiaRelevance": "The Telangana expansion should be watched for local renewable procurement, water disclosure, and whether AI demand shifts backup-power needs.",
      "watchItems": [
        "site electricity mix",
        "water reporting",
        "open access",
        "firm power",
        "thermal management"
      ],
      "sourceIds": [
        "aws-sustainability-official",
        "aws-water-official"
      ]
    },
    {
      "id": "meta-renewable-water",
      "company": "Meta",
      "standard": "Renewable energy, net-zero, and water-positive goals",
      "headline": "Meta links datacenter growth to renewable-energy procurement and water-restoration commitments.",
      "indiaRelevance": "The Jamnagar built-to-suit project should be tracked against the CleanMax renewable collaboration and actual local power-delivery structure.",
      "watchItems": [
        "CleanMax supply",
        "local grid interconnection",
        "firming",
        "water",
        "tenant reporting"
      ],
      "sourceIds": [
        "meta-datacenter-sustainability-official",
        "meta-cleanmax-et-2026"
      ]
    }
  ],
  "implications": [
    {
      "id": "implication-gigawatt-load",
      "title": "Gigawatt AI campuses turn datacenters into power-system planning events",
      "severity": "high",
      "detail": "Visakhapatnam now has multiple gigawatt-scale announcements. Even one grounded project can reshape transmission, water, renewable procurement, and firming priorities.",
      "relatedTags": [
        "gigawatt-load",
        "grid-connection-watch",
        "firm-power"
      ]
    },
    {
      "id": "implication-source-gap",
      "title": "Most source-of-power claims are still too high-level",
      "severity": "high",
      "detail": "Corporate renewable commitments do not reveal whether Indian facilities have local hourly clean power, bundled PPAs, unbundled certificates, grid draw, batteries, or diesel backup.",
      "relatedTags": [
        "renewable-procurement",
        "cfe-24x7",
        "open-access"
      ]
    },
    {
      "id": "implication-water-cooling",
      "title": "Coastal and hot-weather clusters make cooling and water more policy-relevant",
      "severity": "medium",
      "detail": "Chennai, Mumbai, Jamnagar, and Visakhapatnam raise different cooling and water questions than generic datacenter policy summaries usually capture.",
      "relatedTags": [
        "coastal-cooling",
        "water-watch"
      ]
    },
    {
      "id": "implication-mou-discipline",
      "title": "MoUs should stay out of headline capacity until grounded",
      "severity": "medium",
      "detail": "State investment MoUs are useful directional signals, but they should not be counted as firm capacity until land, grid connection, financing, or construction evidence appears.",
      "relatedTags": [
        "mou",
        "capacity-unreported"
      ]
    },
    {
      "id": "implication-backup",
      "title": "Backup-power policy may become the hidden constraint",
      "severity": "medium",
      "detail": "AI workloads want high reliability, but air-quality and decarbonization rules make conventional diesel backup harder to defend in dense clusters.",
      "relatedTags": [
        "backup-power",
        "diesel",
        "batteries"
      ]
    }
  ],
  "refreshQueries": [
    "India datacenter capacity MW monthly ICRA CBRE JLL CareEdge",
    "site:economictimes.indiatimes.com India data centre MW hyperscale latest",
    "site:timesofindia.indiatimes.com data centre MW India AI hub latest",
    "Google Visakhapatnam AI hub power renewable PPA water",
    "Reliance Meta Jamnagar data centre 168 MW construction power",
    "Sify IFC 371 million 103 MW Navi Mumbai Chennai environmental disclosure",
    "Andhra Pradesh data centre policy Google Tillman Reliance power connection",
    "state open access banking wheeling charges data center renewable India",
    "Microsoft AWS Google Meta India data center renewable energy PPA",
    "CPCB CAQM diesel generator data center backup power rules India"
  ],
  "sources": [
    {
      "id": "market-icra-et-2025",
      "label": "Economic Times: ICRA says India third-party datacenter capacity to double by FY28",
      "url": "https://m.economictimes.com/tech/technology/third-party-data-centre-capacity-projected-to-reach-2500-mw-by-fy28-icra/articleshow/124109412.cms",
      "publisher": "Economic Times",
      "date": "2025-09-25",
      "type": "market baseline",
      "tier": "secondary"
    },
    {
      "id": "national-wiki-industry",
      "label": "Data centre industry in India: secondary baseline statistics",
      "url": "https://en.wikipedia.org/wiki/Data_centre_industry_in_India",
      "publisher": "Wikipedia / cited industry sources",
      "date": "2026-04-01",
      "type": "secondary baseline",
      "tier": "secondary"
    },
    {
      "id": "google-vizag-toi-2026",
      "label": "Times of India: foundation laid for Google Cloud India AI Hub near Visakhapatnam",
      "url": "https://timesofindia.indiatimes.com/city/hyderabad/googles-15-bn-ai-hub-in-vizag-will-be-growth-engine-for-indian-economy-naidu/articleshow/130589566.cms",
      "publisher": "Times of India",
      "date": "2026-04-29",
      "type": "project",
      "tier": "secondary"
    },
    {
      "id": "google-vizag-ap-2025",
      "label": "AP News: Google announces USD 15B India AI hub",
      "url": "https://apnews.com/article/ba8fd50e11e41bbdb72097dd10262283",
      "publisher": "Associated Press",
      "date": "2025-10-14",
      "type": "project",
      "tier": "secondary"
    },
    {
      "id": "google-vizag-et-2025",
      "label": "Economic Times: Google, Adani and Airtel AI data hub in Visakhapatnam",
      "url": "https://m.economictimes.com/industry/telecom/telecom-news/google-adani-airtel-join-hands-to-build-indias-largest-15-billion-ai-data-hub-in-visakhapatnam/articleshow/124547550.cms",
      "publisher": "Economic Times",
      "date": "2025-10-14",
      "type": "project",
      "tier": "secondary"
    },
    {
      "id": "reliance-meta-toi-2026",
      "label": "Times of India: Reliance and Meta to develop AI-enabled Jamnagar datacenter",
      "url": "https://timesofindia.indiatimes.com/business/reliance-and-meta-to-develop-ai-enabled-data-centre-in-jamnagar/articleshow/131624466.cms",
      "publisher": "Times of India",
      "date": "2026-06-10",
      "type": "project",
      "tier": "secondary"
    },
    {
      "id": "meta-cleanmax-et-2026",
      "label": "Economic Times: Meta, Reliance and CleanMax renewable energy capacity",
      "url": "https://m.economictimes.com/industry/renewables/reliance-meta-announce-jamnagar-data-centre-cleanmax-to-supply-over-900-mw-renewable-energy-capacity/articleshow/131624756.cms",
      "publisher": "Economic Times",
      "date": "2026-06-10",
      "type": "project / energy",
      "tier": "secondary"
    },
    {
      "id": "sify-ifc-et-2026",
      "label": "Economic Times: IFC commits USD 371M for Sify Navi Mumbai and Chennai datacenters",
      "url": "https://m.economictimes.com/tech/technology/international-finance-corporation-announces-371-million-investment-in-data-centre-operator-sify/articleshow/131833207.cms",
      "publisher": "Economic Times",
      "date": "2026-06-18",
      "type": "project / financing",
      "tier": "secondary"
    },
    {
      "id": "anant-panchkula-toi-2025",
      "label": "Times of India: Anant Raj launches 7 MW Panchkula datacenter",
      "url": "https://timesofindia.indiatimes.com/technology/tech-news/anant-raj-launches-7-mw-panchkula-data-center-expands-digital-infrastructure-in-north-india/articleshow/122904599.cms",
      "publisher": "Times of India",
      "date": "2025-07-25",
      "type": "project",
      "tier": "secondary"
    },
    {
      "id": "anant-ap-toi-2025",
      "label": "Times of India: Anant Raj Cloud AP datacenter and IT park MoU",
      "url": "https://timesofindia.indiatimes.com/city/vijayawada/arcpl-to-set-up-rs-4500-crore-data-centre-in-ap/articleshow/125352451.cms",
      "publisher": "Times of India",
      "date": "2025-11-15",
      "type": "project / MoU",
      "tier": "secondary"
    },
    {
      "id": "anant-haryana-et-2026",
      "label": "Economic Times: Anant Raj signs INR 20,000 crore Haryana datacenter MoU",
      "url": "https://m.economictimes.com/industry/services/property-/-cstruction/anant-raj-signs-mou-with-haryana-to-invest-rs-20000-crore-in-data-centres/articleshow/131442909.cms",
      "publisher": "Economic Times",
      "date": "2026-06-01",
      "type": "project / MoU",
      "tier": "secondary"
    },
    {
      "id": "tillman-ap-toi-2025",
      "label": "Times of India: Tillman Global Holdings AP 300 MW MoU",
      "url": "https://timesofindia.indiatimes.com/business/india-business/after-mega-google-ai-hub-ap-bags-rs-15000-crore-data-centre-project-from-tillman-global-holdings/articleshow/125278905.cms",
      "publisher": "Times of India",
      "date": "2025-11-12",
      "type": "project / MoU",
      "tier": "secondary"
    },
    {
      "id": "reliance-ap-toi-2025",
      "label": "Times of India: Reliance announces 1 GW AI-focused datacenter in Andhra Pradesh",
      "url": "https://timesofindia.indiatimes.com/business/india-business/another-ai-boost-for-andhra-ambanis-reliance-announces-1-gw-data-centre-soon-after-googles-investment/articleshow/125324208.cms",
      "publisher": "Times of India",
      "date": "2025-11-14",
      "type": "project",
      "tier": "secondary"
    },
    {
      "id": "reliance-ap-et-2025",
      "label": "Economic Times: Reliance to establish 1 GW AI datacenter in Andhra Pradesh",
      "url": "https://m.economictimes.com/news/india/after-google-ambanis-reliance-to-set-up-1-gw-data-centre-in-andhra-pradesh/articleshow/125319254.cms",
      "publisher": "Economic Times",
      "date": "2025-11-14",
      "type": "project",
      "tier": "secondary"
    },
    {
      "id": "aws-invest-toi-2025",
      "label": "Times of India: AWS India cloud and AI infrastructure investment",
      "url": "https://timesofindia.indiatimes.com/technology/tech-news/amazon-bets-big-on-indias-developer-ecosystem-aws-to-invest-12-7-billion-in-cloud-and-ai-infrastructure/articleshow/123135566.cms",
      "publisher": "Times of India",
      "date": "2025-08-06",
      "type": "hyperscaler",
      "tier": "secondary"
    },
    {
      "id": "aws-telangana-toi-2025",
      "label": "Times of India: AWS USD 7B Telangana cloud datacenter expansion",
      "url": "https://timesofindia.indiatimes.com/city/hyderabad/amazon-to-invest-7bn-to-expand-cloud-data-centre-in-t/articleshow/125920673.cms",
      "publisher": "Times of India",
      "date": "2025-12-12",
      "type": "hyperscaler / project",
      "tier": "secondary"
    },
    {
      "id": "aws-regions",
      "label": "AWS global infrastructure locations",
      "url": "https://aws.amazon.com/about-aws/global-infrastructure/regions_az/",
      "publisher": "Amazon Web Services",
      "date": "2026-06-23",
      "type": "official location reference",
      "tier": "official"
    },
    {
      "id": "microsoft-wsj-2025",
      "label": "Wall Street Journal: Microsoft USD 3B AI and cloud infrastructure plan in India",
      "url": "https://www.wsj.com/tech/microsoft-plans-to-invest-3-billion-on-ai-cloud-infrastructure-in-india-03a724ba",
      "publisher": "Wall Street Journal",
      "date": "2025-01-07",
      "type": "hyperscaler",
      "tier": "secondary"
    },
    {
      "id": "azure-locations",
      "label": "Microsoft Azure global infrastructure geographies",
      "url": "https://azure.microsoft.com/en-us/explore/global-infrastructure/geographies/",
      "publisher": "Microsoft Azure",
      "date": "2026-06-23",
      "type": "official location reference",
      "tier": "official"
    },
    {
      "id": "google-cloud-locations",
      "label": "Google Cloud locations",
      "url": "https://cloud.google.com/about/locations",
      "publisher": "Google Cloud",
      "date": "2026-06-23",
      "type": "official location reference",
      "tier": "official"
    },
    {
      "id": "google-cloud-wiki-locations",
      "label": "Google datacenter and cloud-region location summary",
      "url": "https://en.wikipedia.org/wiki/Google_data_centers",
      "publisher": "Wikipedia / cited Google Cloud sources",
      "date": "2026-03-01",
      "type": "secondary location reference",
      "tier": "secondary"
    },
    {
      "id": "maharashtra-ai-policy-toi-2026",
      "label": "Times of India: Maharashtra AI policy incentives and GPU deployment targets",
      "url": "https://timesofindia.indiatimes.com/city/mumbai/maharashtra-govts-new-ai-policy-aims-to-attract-rs-10000-crore-investment-create-1-5-lakh-jobs/articleshow/130905630.cms",
      "publisher": "Times of India",
      "date": "2026-05-07",
      "type": "policy",
      "tier": "secondary"
    },
    {
      "id": "karnataka-itbt-toi-2025",
      "label": "Times of India: Karnataka IT-BT Policy 2025-2030",
      "url": "https://timesofindia.indiatimes.com/city/bengaluru/new-rs-967-crore-it-bt-policy-to-drive-growth-beyond-bengaluru/articleshow/125305248.cms",
      "publisher": "Times of India",
      "date": "2025-11-14",
      "type": "policy",
      "tier": "secondary"
    },
    {
      "id": "dpdp-rules-wiki-2025",
      "label": "Digital Personal Data Protection Rules, 2025",
      "url": "https://en.wikipedia.org/wiki/Digital_Personal_Data_Protection_Rules,_2025",
      "publisher": "Wikipedia / cited government sources",
      "date": "2025-11-14",
      "type": "policy",
      "tier": "secondary"
    },
    {
      "id": "mop-green-open-access",
      "label": "Ministry of Power: Green Energy Open Access Rules reference",
      "url": "https://powermin.gov.in/",
      "publisher": "Ministry of Power, Government of India",
      "date": "2026-06-23",
      "type": "policy watch source",
      "tier": "primary"
    },
    {
      "id": "caqm-grap-reference",
      "label": "CAQM / GRAP reference for NCR generator restrictions",
      "url": "https://caqm.nic.in/",
      "publisher": "Commission for Air Quality Management",
      "date": "2026-06-23",
      "type": "policy watch source",
      "tier": "primary"
    },
    {
      "id": "google-cfe-official",
      "label": "Google sustainability: carbon-free energy",
      "url": "https://sustainability.google/operating-sustainably/",
      "publisher": "Google",
      "date": "2026-06-23",
      "type": "hyperscaler standard",
      "tier": "official"
    },
    {
      "id": "microsoft-zero-carbon-axios",
      "label": "Axios: Microsoft zero-carbon datacenter energy target",
      "url": "https://www.axios.com/2021/07/16/microsoft-data-centers-zero-carbon-energy-2030",
      "publisher": "Axios",
      "date": "2021-07-16",
      "type": "hyperscaler standard",
      "tier": "secondary"
    },
    {
      "id": "microsoft-sustainability-official",
      "label": "Microsoft sustainability commitments",
      "url": "https://www.microsoft.com/en-us/corporate-responsibility/sustainability",
      "publisher": "Microsoft",
      "date": "2026-06-23",
      "type": "hyperscaler standard",
      "tier": "official"
    },
    {
      "id": "aws-sustainability-official",
      "label": "AWS sustainability",
      "url": "https://sustainability.aboutamazon.com/climate-solutions/aws",
      "publisher": "Amazon",
      "date": "2026-06-23",
      "type": "hyperscaler standard",
      "tier": "official"
    },
    {
      "id": "aws-water-official",
      "label": "AWS water positive commitment",
      "url": "https://sustainability.aboutamazon.com/water",
      "publisher": "Amazon",
      "date": "2026-06-23",
      "type": "hyperscaler standard",
      "tier": "official"
    },
    {
      "id": "meta-datacenter-sustainability-official",
      "label": "Meta datacenter sustainability",
      "url": "https://sustainability.atmeta.com/en/data-centers/",
      "publisher": "Meta",
      "date": "2026-06-23",
      "type": "hyperscaler standard",
      "tier": "official"
    },
    {
      "id": "grid-national-peak",
      "label": "India hits 256 GW peak power demand (CEA / Grid-India)",
      "url": "https://www.saurenergy.com/solar-energy-news/india-hits-256-gw-peak-power-demand",
      "publisher": "Saur Energy / CREA",
      "date": "2026-04-27",
      "type": "grid baseline",
      "tier": "secondary"
    },
    {
      "id": "cea-peak-projection",
      "label": "CEA projects India peak demand to reach 459 GW by FY36",
      "url": "https://www.mercomindia.com/cea-projects-indias-peak-power-demand-to-reach-459-gw",
      "publisher": "Mercom India / CEA",
      "date": "2025-12-01",
      "type": "grid projection",
      "tier": "secondary"
    },
    {
      "id": "ap-state-peak",
      "label": "Andhra Pradesh record summer power demand (APERC)",
      "url": "https://www.thehansindia.com/andhra-pradesh/ap-powers-through-record-summer-demand",
      "publisher": "The Hans India / APERC",
      "date": "2026-05-22",
      "type": "state grid",
      "tier": "secondary"
    },
    {
      "id": "state-peaks-crea",
      "label": "State peak demand records, Q4 FY26 (CEA via CREA)",
      "url": "https://www.saurenergy.com/solar-energy-news/india-hits-256-gw-peak-power-demand",
      "publisher": "Saur Energy / CREA",
      "date": "2026-04-27",
      "type": "state grid",
      "tier": "secondary"
    },
    {
      "id": "tn-state-peak",
      "label": "Tamil Nadu power demand record 20,974 MW (TANGEDCO)",
      "url": "https://www.newkerala.com/news/a/heatwave-pushes-tn-power-demand-record-20974-mw",
      "publisher": "New Kerala / TANGEDCO",
      "date": "2026-04-18",
      "type": "state grid",
      "tier": "secondary"
    },
    {
      "id": "ts-state-peak",
      "label": "Telangana meets record power demand (TS Transco)",
      "url": "https://www.deccanchronicle.com/southern-states/telangana/telangana-successfully-meets-record-demand",
      "publisher": "Deccan Chronicle / TS Transco",
      "date": "2025-03-15",
      "type": "state grid",
      "tier": "secondary"
    },
    {
      "id": "ka-state-peak",
      "label": "Karnataka power demand record (KPTCL)",
      "url": "https://www.theweek.in/wire-updates/national/2025/03/24/mes19-ka-power-demand.html",
      "publisher": "The Week / KPTCL",
      "date": "2025-03-24",
      "type": "state grid",
      "tier": "secondary"
    },
    {
      "id": "hr-state-peak",
      "label": "Haryana peak electricity demand (CEA)",
      "url": "https://www.ceicdata.com/en/india/electricity-demand-and-supply",
      "publisher": "CEIC / CEA",
      "date": "2024-07-01",
      "type": "state grid",
      "tier": "secondary"
    },
    {
      "id": "vizag-grid-ask",
      "label": "Google subsidiary proposes 1 GW data center, applies for 2.1 GW grid power",
      "url": "https://www.datacenterdynamics.com/en/news/google-subsidiary-proposes-1gw-data-center-andhra-pradesh",
      "publisher": "DataCenterDynamics",
      "date": "2025-10-15",
      "type": "project / grid",
      "tier": "secondary"
    },
    {
      "id": "ceew-systemiq-dc",
      "label": "Scaling India's Data Centre Ecosystem (CEEW x SYSTEMIQ)",
      "url": "https://www.systemiq.earth/wp-content/uploads/2026/02/Scaling-Indias-Data-Centre-Ecosystem.pdf",
      "publisher": "CEEW / SYSTEMIQ",
      "date": "2026-02-01",
      "type": "market baseline",
      "tier": "official"
    },
    {
      "id": "dc-forecast-sp",
      "label": "India data centre capacity & power forecasts (CBRE/ICRA/JLL/Nomura/S&P)",
      "url": "https://www.spglobal.com/en/research-insights/special-reports/india-forward",
      "publisher": "S&P Global / industry analysts",
      "date": "2026-01-15",
      "type": "market forecast",
      "tier": "official"
    },
    {
      "id": "ieefa-open-access",
      "label": "Impact of Green Energy Open Access Rules 2022 (IEEFA x JMK)",
      "url": "https://ieefa.org/sites/default/files/2024-12/Impact%20of%20Green%20Energy%20Open%20Access%20Rules.pdf",
      "publisher": "IEEFA / JMK Research",
      "date": "2024-12-01",
      "type": "policy / energy",
      "tier": "secondary"
    },
    {
      "id": "src-msft-175b-2025",
      "label": "Microsoft invests USD 17.5B in India to drive AI diffusion at population scale",
      "url": "https://news.microsoft.com/source/asia/2025/12/09/microsoft-invests-us17-5-billion-in-india-to-drive-ai-diffusion-at-population-scale/",
      "publisher": "Microsoft (Source Asia)",
      "date": "2025-12-09",
      "type": "hyperscaler",
      "tier": "official"
    },
    {
      "id": "src-meta-ppa-mercom-2026",
      "label": "CleanMax partners with Meta for 837 MW solar-wind; Fourth Partner adds 88 MW",
      "url": "https://www.mercomindia.com/cleanmax-partners-with-meta-platforms-for-837-mw-solar-wind-projects",
      "publisher": "Mercom India",
      "date": "2026-06-10",
      "type": "project / energy",
      "tier": "secondary"
    },
    {
      "id": "src-lt-kanchipuram-2026",
      "label": "L&T pledges INR 18,600 cr in Tamil Nadu incl. INR 15,000 cr Kanchipuram datacentre expansion",
      "url": "https://www.deccanherald.com/business/lt-pledges-to-invest-rs-18600-crore-in-tamil-nadu-4027465",
      "publisher": "Deccan Herald",
      "date": "2026-06-04",
      "type": "project / MoU",
      "tier": "secondary"
    },
    {
      "id": "src-adani-jabil-2026",
      "label": "Adani Enterprises and Jabil target a strategic alliance to build AI/datacenter hardware in India",
      "url": "https://www.adani.com/newsroom/media-releases/adani-enterprises-and-jabil-target-a-strategic-alliance-to-build-ai-data-center",
      "publisher": "Adani Group",
      "date": "2026-06-15",
      "type": "supply chain",
      "tier": "official"
    },
    {
      "id": "src-natl-peak-270-2026",
      "label": "India sets all-time peak power demand record of 270.8 GW (21 May 2026)",
      "url": "https://www.tribuneindia.com/news/business/indias-power-demand-hits-record-270-82-gw",
      "publisher": "The Tribune / Grid-India",
      "date": "2026-05-21",
      "type": "grid baseline",
      "tier": "secondary"
    },
    {
      "id": "src-gujarat-peak-2025",
      "label": "Gujarat peak power demand all-time high 26,457 MW (Jun 2025)",
      "url": "https://www.ceicdata.com/en/india/electricity-demand-and-supply/power-peak-demand-western-gujarat",
      "publisher": "CEIC / CEA",
      "date": "2025-06-30",
      "type": "state grid",
      "tier": "secondary"
    },
    {
      "id": "src-elec-amend-2026",
      "label": "Government notifies Electricity (Amendment) Rules 2026 — captive power framework eased",
      "url": "https://www.mercomindia.com/government-notifies-amendments-to-captive-power-project-framework",
      "publisher": "Mercom India",
      "date": "2026-03-19",
      "type": "policy",
      "tier": "secondary"
    },
    {
      "id": "src-derc-oa-2026",
      "label": "DERC eases Delhi green open access — drops 11 kV norm, 100 kW threshold",
      "url": "https://www.saurenergy.com/solar-energy-news/delhi-moves-to-drop-voltage-norms-for-green-open-access-eases-rules-for-captive-projects-11730718",
      "publisher": "Saur Energy / DERC",
      "date": "2026-04-16",
      "type": "policy",
      "tier": "secondary"
    },
    {
      "id": "src-cbre-dc-2026",
      "label": "India datacentre capacity to jump 30% in 2026; crossed 1,700 MW in 2025 (CBRE)",
      "url": "https://www.businesstoday.in/technology/story/india-data-centre-capacity-to-jump-30-in-2026-500-mw-supply-boost-expected-cbre-report-523529-2026-04-01",
      "publisher": "Business Today / CBRE",
      "date": "2026-04-01",
      "type": "market baseline",
      "tier": "secondary"
    },
    {
      "id": "src-jll-dc-2025",
      "label": "India datacentre operational stock 1,123 MW IT load; 2,073 MW by 2027 (JLL)",
      "url": "https://www.jll.com/en-in/insights/market-dynamics/india-data-centers",
      "publisher": "JLL",
      "date": "2025-12-05",
      "type": "market baseline",
      "tier": "official"
    },
    {
      "id": "pol-geoa-rules",
      "label": "Green Energy Open Access Rules, 2022 (as amended) — Notified 06.06.2022 (Gazette of India, Extraordinary, Part II Sec 3(i)); RCM Division.…",
      "url": "https://cdnbbsr.s3waas.gov.in/s3716e1b8c6cd17b771da77391355749f3/uploads/2023/10/20231005595469737.pdf",
      "publisher": "Ministry of Power",
      "date": "2022-06-06",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-geoa-rules-sec",
      "label": "Green Energy Open Access Rules, 2022 (as amended) — media pointer",
      "url": "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1842737",
      "publisher": "PIB / Drishti IAS",
      "date": "2022-06-06",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-elec-amend-2026",
      "label": "Electricity (Amendment) Rules, 2026 — captive & storage — G.S.R. 186(E) dated 13.03.2026, Gazette of India (Extraordinary) Part II Sec 3(i)",
      "url": "https://powermin.gov.in/sites/default/files/webform/notices/Electricity_Amendment_Rules_2026_alongwith_Explanatory_Note.pdf",
      "publisher": "Ministry of Power",
      "date": "2026-03-13",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-elec-amend-2026-sec",
      "label": "Electricity (Amendment) Rules, 2026 — captive & storage — media pointer",
      "url": "https://www.mercomindia.com/government-notifies-amendments-to-captive-power-project-framework",
      "publisher": "Mercom India",
      "date": "2026-03-13",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-ists-waiver",
      "label": "ISTS charge waiver for renewables & storage — MoP RCM Division order dated 29.05.2023 (consolidating/extending the ISTS waiver; solar+wind…",
      "url": "https://cdnbbsr.s3waas.gov.in/s3716e1b8c6cd17b771da77391355749f3/uploads/2024/01/20240104534263500.pdf",
      "publisher": "Ministry of Power (RCM Division)",
      "date": "2023-05-29",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-ists-waiver-sec",
      "label": "ISTS charge waiver for renewables & storage — media pointer",
      "url": "https://www.mercomindia.com/waiver-ists-charges-solar-wind",
      "publisher": "Renewable Watch / Mercom India",
      "date": "2023-05-29",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-cerc-gna",
      "label": "CERC Connectivity & General Network Access Regulations, 2022 — Notification No. L-1/261/2021/CERC dated 07.06.2022",
      "url": "https://www.cercind.gov.in/regulations/175-Notification.pdf",
      "publisher": "Central Electricity Regulatory Commission (CERC)",
      "date": "2022-06-07",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-cerc-gna-sec",
      "label": "CERC Connectivity & General Network Access Regulations, 2022 — media pointer",
      "url": "https://trilegal.com/knowledge_repository/cerc-connectivity-and-general-network-access-to-the-inter-state-transmission-system-regulations-2022/",
      "publisher": "Trilegal",
      "date": "2022-06-07",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-cea-connectivity",
      "label": "CEA Technical Standards for Connectivity to the Grid — Principal regs 2007 (21.02.2007); Amendment No. 12/X/STD(CONN)/GM/CEA/2018 dated…",
      "url": "https://cea.nic.in/regulations-category/connectivity-to-the-grid/?lang=en",
      "publisher": "Central Electricity Authority (CEA), Ministry of Power",
      "date": "2007-02-21",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-cea-connectivity-sec",
      "label": "CEA Technical Standards for Connectivity to the Grid — media pointer",
      "url": "https://www.cbip.org/CEARegulations/CEA%20DATA/Connectivity/Grid%20Connectivity/CEA%20Grid%20Connectivity%20Regulation%20cons.pdf",
      "publisher": "Central Board of Irrigation and Power (consolidated copy)",
      "date": "2007-02-21",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-rpo-eso",
      "label": "RPO / RCO & Energy Storage Obligation trajectory — S.O. 4617(E) dated 20.10.2023 (effective 01.04.2024)",
      "url": "https://powermin.gov.in/sites/default/files/Renewable_Purchase_Obligation_and_Energy_Storage_Obligation_Trajectory_till_2029_30.pdf",
      "publisher": "Ministry of Power (under Energy Conservation Act, 2001)",
      "date": "2023-10-20",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-rpo-eso-sec",
      "label": "RPO / RCO & Energy Storage Obligation trajectory — media pointer",
      "url": "https://www.mercomindia.com/power-ministry-revises-rpo-targets",
      "publisher": "Mercom India",
      "date": "2023-10-20",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-derc-geoa",
      "label": "DERC Green Energy Open Access Regulations (2024, amended 2026) — DERC GEOA Regulations notified 12-11-2024; 2026 First Amendment in draft",
      "url": "https://www.derc.gov.in/sites/default/files/Green%20Energy%20Open%20Access%20Regulations%202024.pdf",
      "publisher": "DERC (Delhi Electricity Regulatory Commission)",
      "date": "2024-11-12",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-derc-geoa-sec",
      "label": "DERC Green Energy Open Access Regulations (2024, amended 2026) — media pointer",
      "url": "https://www.derc.gov.in/regulations/derc-Regulations",
      "publisher": "Saur Energy / DERC regulations page",
      "date": "2024-11-12",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-merc-oa",
      "label": "MERC Distribution / Green Open Access framework — Distribution Open Access (Second Amendment) Regulations notified 10.11.2023 (MSEDCL…",
      "url": "https://merc.gov.in/regulation_type/current-regulations-open-access/",
      "publisher": "Maharashtra Electricity Regulatory Commission (MERC)",
      "date": "2023-11-10",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-merc-oa-sec",
      "label": "MERC Distribution / Green Open Access framework — media pointer",
      "url": "https://www.mercomindia.com/msedcl-issues-new-guidelines-for-green-energy-open-access-in-maharashtra",
      "publisher": "Mercom India / Energetica",
      "date": "2023-11-10",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-aperc-geoa",
      "label": "APERC Green Energy Open Access, Charges & Banking Regulations, 2024 — Order/SOR dated 01.05.2024 (notified ~02.05.2024)",
      "url": "https://aperc.gov.in/admin/upload/Orderdated01052024GEOAREGULATION.pdf",
      "publisher": "Andhra Pradesh Electricity Regulatory Commission (APERC)",
      "date": "2024-05-02",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-aperc-geoa-sec",
      "label": "APERC Green Energy Open Access, Charges & Banking Regulations, 2024 — media pointer",
      "url": "https://www.mercomindia.com/andhra-pradesh-energy-access-rules-2024",
      "publisher": "Mercom India / CSIS Engaging Indian States",
      "date": "2024-05-02",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-tnerc-geoa",
      "label": "TNERC Green Energy Open Access Regulations, 2025 — Notified 18.09.2025 (effective 01.10.2025); supersedes 2024 draft dated 13.06.2024",
      "url": "https://tnerc.tn.gov.in/website/Regulation.aspx",
      "publisher": "Tamil Nadu Electricity Regulatory Commission (TNERC)",
      "date": "2025-09-18",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-tnerc-geoa-sec",
      "label": "TNERC Green Energy Open Access Regulations, 2025 — media pointer",
      "url": "https://www.mercomindia.com/tamil-nadu-notifies-green-energy-open-access-regulations-2025",
      "publisher": "Mercom India / Neufin",
      "date": "2025-09-18",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-tserc-oa",
      "label": "TSERC Open Access Regulation, 2024 — Open Access Regulation 1 of 2024 (notified 2024; gazette PDF on tgerc portal)",
      "url": "https://tgerc.telangana.gov.in/file_upload/uploads/Regulations/Final/tserc/2024/Open%20Access%20Regulation%201%20of%202024.pdf",
      "publisher": "Telangana State Electricity Regulatory Commission (TSERC)",
      "date": "2024-01-01",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-tserc-oa-sec",
      "label": "TSERC Open Access Regulation, 2024 — media pointer",
      "url": "https://indianstates.csis.org/articles/2024-08-14-telangana-state-electricity-regulatory-commission-tserc-releases-the-terms-and-conditions-of-open-access-regulation-2024/",
      "publisher": "CSIS Engaging Indian States / Energetica",
      "date": "2024-01-01",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-gerc-geoa",
      "label": "GERC Green Energy Open Access Regulations, 2024 — Notification No. 8 of 2024, published in Gujarat Government Gazette 21.02.2024;…",
      "url": "https://gercin.org/wp-content/uploads/2024/02/GERC-Terms-and-Conditions-for-Green-Energy-Open-Access-Regulations2024.pdf",
      "publisher": "Gujarat Electricity Regulatory Commission (GERC)",
      "date": "2024-02-21",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-gerc-geoa-sec",
      "label": "GERC Green Energy Open Access Regulations, 2024 — media pointer",
      "url": "https://www.mercomindia.com/gujarat-rules-green-open-access",
      "publisher": "Mercom India",
      "date": "2024-02-21",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-kerc-oa",
      "label": "KERC Open Access Regulations — Karnataka HC judgment dated 20.12.2024 declaring the central GEOA Rules 2022 and KERC GEOA Regulations 2022…",
      "url": "https://kerc.karnataka.gov.in/uploads/media_to_upload1743049297.pdf",
      "publisher": "Karnataka Electricity Regulatory Commission (KERC)",
      "date": "2025-01-01",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-kerc-oa-sec",
      "label": "KERC Open Access Regulations — media pointer",
      "url": "https://www.mercomindia.com/karnataka-additional-surcharge-green-open-access",
      "publisher": "Mercom India / Energetica / NeetiNiyaman",
      "date": "2025-01-01",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-herc-geoa",
      "label": "HERC Green Energy Open Access Regulations, 2023 — Principal Regulations notified 2023; First Amendment Regulations, 2025",
      "url": "https://herc.gov.in/",
      "publisher": "Haryana Electricity Regulatory Commission (HERC)",
      "date": "2023-04-01",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-herc-geoa-sec",
      "label": "HERC Green Energy Open Access Regulations, 2023 — media pointer",
      "url": "https://www.mercomindia.com/haryana-amends-green-energy-open-access-regulations",
      "publisher": "Mercom India / Construction World",
      "date": "2023-04-01",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-caqm-dg",
      "label": "CAQM diesel-generator restrictions & GRAP (NCR) — Direction No. 73 dated 02.06.2023 (effective 01.10.2023)",
      "url": "https://caqm.nic.in/WriteReadData/LINKS/73efc2ebf5-b9a7-4330-8e82-6eb3710f0343.pdf",
      "publisher": "Commission for Air Quality Management in NCR and Adjoining Areas (CAQM)",
      "date": "2023-06-02",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-caqm-dg-sec",
      "label": "CAQM diesel-generator restrictions & GRAP (NCR) — media pointer",
      "url": "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1930641",
      "publisher": "PIB",
      "date": "2023-06-02",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-cpcb-genset",
      "label": "CPCB diesel-genset emission norms & RECD — G.S.R. 804(E) dated 03.11.2022 (genset emission standards, gensets up to 800 kW); RECD…",
      "url": "https://cpcb.nic.in/genset-notifications/",
      "publisher": "Central Pollution Control Board (CPCB) / MoEF&CC",
      "date": "2022-11-03",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-cpcb-genset-sec",
      "label": "CPCB diesel-genset emission norms & RECD — media pointer",
      "url": "https://cpcb.nic.in/uploads/RECD_Procedure_Revised.pdf",
      "publisher": "CPCB (RECD procedure)",
      "date": "2022-11-03",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-cgwa-water",
      "label": "CGWA groundwater extraction NOC regime — CGWA Guidelines dated 24.09.2020 (issued under Environment (Protection) Act, 1986 directions);…",
      "url": "https://cgwa-noc.gov.in/landingpage/Guidlines/BulkwatersupplyGuidelines_approved.pdf",
      "publisher": "Central Ground Water Authority (CGWA), Ministry of Jal Shakti",
      "date": "2020-09-24",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-cgwa-water-sec",
      "label": "CGWA groundwater extraction NOC regime — media pointer",
      "url": "https://cgwb.gov.in/en/ground-water-regulation",
      "publisher": "CGWB (Ground Water Regulation page)",
      "date": "2020-09-24",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-mh-ai-dc",
      "label": "Maharashtra AI Policy 2026 & datacenter power-duty relief — GR No. ITP-2021/CR-170/Ind-2 dated 27.06.2023 (IT/ITeS Policy 2023); AI Policy…",
      "url": "https://industry.maharashtra.gov.in/sites/default/files/2025-09/it-policy-booklet_1_11zon.pdf",
      "publisher": "Industries, Energy & Labour Dept (IT/ITeS); Dept of IT (AI Policy), Govt of Maharashtra",
      "date": "2023-06-27",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-mh-ai-dc-sec",
      "label": "Maharashtra AI Policy 2026 & datacenter power-duty relief — media pointer",
      "url": "https://www.newsonair.gov.in/maharashtra-government-announces-artificial-intelligence-policy-2026-to-boost-investment-and-jobs/",
      "publisher": "Cyril Amarchand blog (IT/ITeS 2023 highlights); DD News (AI Policy 2026)",
      "date": "2023-06-27",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-ka-it-dc",
      "label": "Karnataka IT Policy 2025-2030 & Data Centre Policy — Notified by GoK Dept of Electronics, IT, BT & S&T (official PDF hosted on…",
      "url": "https://eitbt.karnataka.gov.in/uploads/media_to_upload1764150308.pdf",
      "publisher": "Government of Karnataka, Department of Electronics, IT, BT (and S&T)",
      "date": "2025-11-01",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-ka-it-dc-sec",
      "label": "Karnataka IT Policy 2025-2030 & Data Centre Policy — media pointer",
      "url": "https://www.pwc.in/research-insights/news_alert/tax-insights/government-of-karnataka-notifies-the-it-policy-2025-2030.html",
      "publisher": "PwC India",
      "date": "2025-11-01",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-tn-dc",
      "label": "Tamil Nadu Data Centre Policy 2021 — TN Data Centre Policy 2021 (applies to DCs set up 01.04.2021 to 31.03.2026); G.O. number not…",
      "url": "https://it.tn.gov.in/en/Tamil_Nadu_Data_Centre_Policy_2021",
      "publisher": "Information Technology Dept, Govt of Tamil Nadu (ELCOT nodal)",
      "date": "2021-04-01",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-tn-dc-sec",
      "label": "Tamil Nadu Data Centre Policy 2021 — media pointer",
      "url": "https://elcot.tn.gov.in/sites/default/file/Data_Centre_Policy_compressed.pdf",
      "publisher": "ELCOT (policy PDF); DataCenterDynamics",
      "date": "2021-04-01",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-ts-dc",
      "label": "Telangana Data Centre Policy 2016 — 'essential service' status — Telangana Data Centres Policy 2016; G.O. number not confirmed from…",
      "url": "https://invest.telangana.gov.in/data-centres/",
      "publisher": "ITE&C Dept, Govt of Telangana (Invest Telangana)",
      "date": "2016-01-01",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-ts-dc-sec",
      "label": "Telangana Data Centre Policy 2016 — 'essential service' status — media pointer",
      "url": "https://www.snrlaw.in/data-centres-in-india-opportunity-and-incentives/",
      "publisher": "S&R Law; Cushman & Wakefield state comparison",
      "date": "2016-01-01",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-ap-dc",
      "label": "AP IT & GCC Policy 4.0 + deemed-distribution-licensee status — G.O. MS No. 9, dated 12.12.2024 (AP IT & GCC Policy 4.0, 2024-29);…",
      "url": "https://apedb.ap.gov.in/assets/pdf/AP%20IT%20&%20GCC%20Policy%20(4%200)%202024-2029_%20G%20O%20MS%20No.9,%20dt%2012%2012%202024%20(1).pdf",
      "publisher": "ITE&C Dept / Energy Dept, Govt of AP (APEDB); APERC",
      "date": "2024-12-12",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-ap-dc-sec",
      "label": "AP IT & GCC Policy 4.0 + deemed-distribution-licensee status — media pointer",
      "url": "https://theprint.in/india/governance/andhra-to-be-1st-state-to-give-discom-license-to-pvt-firms-outside-power-sector-amid-data-centre-boom/2911910/",
      "publisher": "ThePrint; Business Today (DDL explainer)",
      "date": "2024-12-12",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-dpdp-2025",
      "label": "Digital Personal Data Protection Rules, 2025 — G.S.R. 846(E) dated 13.11.2025 (phased: Rules 1,2,17-21 from 13.11.2025; Rule 4 from…",
      "url": "https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa",
      "publisher": "Ministry of Electronics & IT (MeitY)",
      "date": "2025-11-13",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-dpdp-2025-sec",
      "label": "Digital Personal Data Protection Rules, 2025 — media pointer",
      "url": "https://www.barandbench.com/view-point/meity-notifies-final-digital-personal-data-protection-rules-2025",
      "publisher": "Bar & Bench",
      "date": "2025-11-13",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-rbi-localization",
      "label": "RBI payment-system data localization — RBI/2017-18/153, DPSS.CO.OD No.2785/06.08.005/2017-2018",
      "url": "https://rbi.org.in/scripts/NotificationUser.aspx?Id=11244",
      "publisher": "RBI (Reserve Bank of India), DPSS",
      "date": "2018-04-06",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-rbi-localization-sec",
      "label": "RBI payment-system data localization — media pointer",
      "url": "https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=2995",
      "publisher": "RBI FAQ on Storage of Payment System Data",
      "date": "2018-04-06",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "pol-indiaai",
      "label": "IndiaAI Mission — subsidised AI compute / GPU capacity — Cabinet approval Mar 2024; RFE published 16 Aug 2024 (CPP portal)",
      "url": "https://indiaai.gov.in/hub/indiaai-compute-capacity",
      "publisher": "MeitY / IndiaAI (IBD)",
      "date": "2024-03-07",
      "type": "policy (primary)",
      "tier": "primary"
    },
    {
      "id": "pol-indiaai-sec",
      "label": "IndiaAI Mission — subsidised AI compute / GPU capacity — media pointer",
      "url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2209737&reg=3&lang=1",
      "publisher": "PIB / IndiaAI",
      "date": "2024-03-07",
      "type": "policy (secondary)",
      "tier": "secondary"
    },
    {
      "id": "src-merc-lodha-2026",
      "label": "MERC Case 88 of 2026 — Ambernath 400/220 kV substation (DDF) for Lodha data-centre park",
      "url": "https://merc.gov.in/Order-detais/88-of-2026-and-ia-no-78-of-2026-in-88-of-2026/",
      "publisher": "Maharashtra Electricity Regulatory Commission",
      "date": "2026-06-01",
      "type": "policy / connectivity",
      "tier": "primary"
    },
    {
      "id": "src-ctuil-gna-portal",
      "label": "CTUIL — Status of Application under GNA Regulations (Reg 17.1(iii) bulk-consumer ISTS connectivity)",
      "url": "https://www.ctuil.in/gna2022updates",
      "publisher": "Central Transmission Utility of India (CTUIL)",
      "date": "2026-06-30",
      "type": "grid connectivity register",
      "tier": "primary"
    },
    {
      "id": "src-lodha-saur-2026",
      "label": "Maharashtra approves transmission infrastructure for ₹1.3 lakh crore Lodha data centre park",
      "url": "https://www.saurenergy.com/solar-energy-news/maharashtra-approves-transmission-infrastructure-for-13-lakh-crore-data-centre-park-11902218",
      "publisher": "Saur Energy",
      "date": "2026-06-03",
      "type": "project / energy",
      "tier": "secondary"
    },
    {
      "id": "src-ctuil-bidding-calendar-may26",
      "label": "CTUIL Bidding Calendar as on 31-05-2026",
      "url": "https://www.ctuil.in/uploads/assets/178117480909Annexure-A_Bidding%20Calendar%20as%20on%2031-05-2026.pdf",
      "publisher": "Central Transmission Utility of India (CTUIL)",
      "date": "2026-05-31",
      "type": "ISTS TBCB bidding calendar",
      "tier": "primary"
    },
    {
      "id": "src-ctuil-bulk-consumer-margin-2025-08",
      "label": "CTUIL — Location and margin for ISTS substations for bulk consumers (approved)",
      "url": "https://www.ctuil.in/uploads/assets/1764157726022025_08_Location%20and%20margin%20for%20bulk%20consumers_approved.pdf",
      "publisher": "Central Transmission Utility of India (CTUIL)",
      "date": "2025-08-31",
      "type": "ISTS bulk-consumer substation margin",
      "tier": "primary"
    },
    {
      "id": "src-cmets-sr-38-pendurthi",
      "label": "CTUIL 38th CMETS-SR minutes — Kakinada/Pendurthi green-hydrogen and datacenter transmission system",
      "url": "https://www.ctuil.in/uploads/ists_consultation_meeting/minutes/175221054032MoM-%2038th%20CMETS-SR%20dt%2002062025.pdf",
      "publisher": "Central Transmission Utility of India (CTUIL)",
      "date": "2025-06-02",
      "type": "ISTS consultation minutes",
      "tier": "primary"
    },
    {
      "id": "src-indiaai-rfe-cloud-2025",
      "label": "IndiaAI RFE for continuous empanelment of agencies for providing AI services on cloud",
      "url": "https://indiaai.s3.ap-south-1.amazonaws.com/docs/rfe-for-continous-empanelment.pdf",
      "publisher": "IndiaAI / Digital India Corporation / MeitY",
      "date": "2025-02-01",
      "type": "government cloud-procurement SLA",
      "tier": "primary"
    },
    {
      "id": "src-uptime-institute-tiers",
      "label": "Uptime Institute — Tier Classification System",
      "url": "https://uptimeinstitute.com/tiers",
      "publisher": "Uptime Institute",
      "date": "2026-07-06",
      "type": "facility resilience standard",
      "tier": "official"
    },
    {
      "id": "src-ctuil-live-2026-07-09",
      "label": "CTUIL live GNA application portal — Reg 20.1/20.3/20.4 tab, DATA search pull of 2026-07-09",
      "url": "https://www.ctuil.in/nswsapi/gna",
      "publisher": "Central Transmission Utility of India (CTUIL)",
      "date": "2026-07-09",
      "type": "live grid connectivity register",
      "tier": "primary"
    },
    {
      "id": "src-ctuil-reg17-may26",
      "label": "CTUIL — Details of GNA granted to entities other than STU (Reg. 17.1), May 2026 approved register",
      "url": "https://www.ctuil.in/uploads/assets/178299961858GNA_%20Reg%2017_May2026_approved.pdf",
      "publisher": "Central Transmission Utility of India (CTUIL)",
      "date": "2026-05-31",
      "type": "approved GNA register",
      "tier": "primary"
    },
    {
      "id": "src-et-digital-edge-palava-2026-07",
      "label": "Digital Edge reportedly buys Palava land for proposed 270 MW data-centre campus",
      "url": "https://m.economictimes.com/industry/services/property-/-cstruction/digital-edge-india-buys-30-acres-in-palava-for-rs-1000-cr-plans-270mw-data-centre/articleshow/132143264.cms",
      "publisher": "The Economic Times",
      "date": "2026-07-02",
      "type": "project / energy",
      "tier": "secondary"
    }
  ],
  "firmnessLadder": [
    {
      "key": "undisclosed",
      "label": "Local power undisclosed",
      "rank": 0,
      "note": "No site-specific electricity plan disclosed; corporate renewable claims do not localize."
    },
    {
      "key": "grid",
      "label": "Grid supply, no RE plan",
      "rank": 1,
      "note": "Explicit grid supply with no disclosed renewable procurement."
    },
    {
      "key": "annual_recs",
      "label": "Annual renewable matching",
      "rank": 2,
      "note": "Annual certificates / matching — does not guarantee hourly clean supply."
    },
    {
      "key": "bundled_ppa",
      "label": "Bundled PPA / open access",
      "rank": 3,
      "note": "Bundled PPA or green open access signalled or contracted for the site."
    },
    {
      "key": "group_captive",
      "label": "Group captive",
      "rank": 4,
      "note": "Group-captive renewable generation tied to the load."
    },
    {
      "key": "hourly_cfe",
      "label": "24/7 clean-firm",
      "rank": 5,
      "note": "Hourly-matched carbon-free / clean-firm supply — the credibility ceiling."
    }
  ],
  "gridContext": {
    "nationalPeakMW": 270820,
    "nationalPeakDate": "2026-05-21",
    "nationalPeakNote": "All-India peak demand met on 21 May 2026 (4th straight record day; prior April 2026 record ~256 GW). RE share ~34% at peak.",
    "nationalPeakSourceIds": [
      "src-natl-peak-270-2026"
    ],
    "nationalPeakProjection": {
      "fy27GW": 289,
      "fy36GW": 459,
      "lgbrFy26MW": 269277,
      "sourceIds": [
        "cea-peak-projection"
      ]
    },
    "statePeakMW": {
      "Andhra Pradesh": {
        "peakMW": 13712,
        "fy": "FY2024-25",
        "projectedMW": 15223,
        "note": "Day-peak record 15,016 MW, 21 May 2026.",
        "sourceIds": [
          "ap-state-peak"
        ]
      },
      "Maharashtra": {
        "peakMW": 32000,
        "fy": "Q4 FY26 record",
        "sourceIds": [
          "state-peaks-crea"
        ]
      },
      "Telangana": {
        "peakMW": 18139,
        "fy": "record met",
        "sourceIds": [
          "ts-state-peak"
        ]
      },
      "Tamil Nadu": {
        "peakMW": 20974,
        "fy": "18 Apr 2026",
        "sourceIds": [
          "tn-state-peak"
        ]
      },
      "Gujarat": {
        "peakMW": 26457,
        "fy": "Jun 2025 all-time high",
        "sourceIds": [
          "src-gujarat-peak-2025"
        ]
      },
      "Haryana": {
        "peakMW": 14662,
        "fy": "Jul 2024 record",
        "sourceIds": [
          "hr-state-peak"
        ]
      },
      "Karnataka": {
        "peakMW": 18655,
        "fy": "FY26 record",
        "sourceIds": [
          "ka-state-peak"
        ]
      },
      "Delhi NCR": {
        "peakMW": 14662,
        "fy": "Haryana proxy",
        "note": "NCR has no single grid; Haryana used as the host-state proxy.",
        "sourceIds": [
          "hr-state-peak"
        ]
      }
    },
    "vizagExample": {
      "itLoadGW": 1.0,
      "gridAskGW": 2.1,
      "pctOfApPeakItLoad": 7.3,
      "pctOfApPeakGridAsk": 15.3,
      "note": "Google/Adani Vizag: ~1 GW IT load; Raiden Infotech (a Google subsidiary) applied for ~2.1 GW grid power. The grid ask, not the IT load, is the figure that meets state peak.",
      "sourceIds": [
        "vizag-grid-ask"
      ]
    },
    "dcCapacityBaseline": {
      "operationalGW": 1.5,
      "year": "mid-2025",
      "from2020MW": 520,
      "operationalCount": 271,
      "cityMW": {
        "Mumbai": 640,
        "Chennai": 289,
        "Delhi NCR": 115,
        "Bengaluru": 101,
        "Hyderabad": 58,
        "Kolkata": 16
      },
      "sourceIds": [
        "ceew-systemiq-dc"
      ]
    },
    "dcForecastBand": [
      {
        "analyst": "JLL",
        "gw": 1.8,
        "year": "2027",
        "sourceIds": [
          "dc-forecast-sp"
        ]
      },
      {
        "analyst": "ICRA",
        "gw": 2.05,
        "year": "FY27",
        "sourceIds": [
          "dc-forecast-sp"
        ]
      },
      {
        "analyst": "Cushman & Wakefield",
        "gw": 3.29,
        "year": "2028",
        "sourceIds": [
          "dc-forecast-sp"
        ]
      },
      {
        "analyst": "CEEW / SYSTEMIQ",
        "gw": 5.5,
        "low": 4.5,
        "high": 6.5,
        "year": "2030",
        "sourceIds": [
          "ceew-systemiq-dc"
        ]
      },
      {
        "analyst": "Nomura",
        "gw": 9.2,
        "year": "2030",
        "sourceIds": [
          "dc-forecast-sp"
        ]
      }
    ],
    "dcShareOfElectricity": {
      "y2024Pct": 0.8,
      "y2030Pct": 2.8,
      "twh2030": 57,
      "sourceIds": [
        "dc-forecast-sp"
      ]
    },
    "openAccess": {
      "cumulativeGW": 18.7,
      "asOf": "FY2024",
      "cagrPct": 46,
      "note": "C&I green open access; project eligibility lowered 1 MW → 100 kW. ~80% RE feasible via solar+wind+BESS; true 24/7 needs clean-firm or over-procurement.",
      "sourceIds": [
        "ieefa-open-access"
      ]
    }
  },
  "connectivity": [
    {
      "id": "conn-lodha-palava-granted",
      "applicant": "Maharashtra STU (MSETCL), for Lodha Developers",
      "operator": "Macrotech Developers (Lodha)",
      "useType": "datacenter",
      "quantumMW": 1450,
      "powerFlowStart": "2028",
      "tier": "intra-state",
      "utility": "MSETCL / Maharashtra STU",
      "substation": "Ambernath 400/220 kV GIS",
      "state": "Maharashtra",
      "status": "granted",
      "applicationRef": "MERC Case No. 88 of 2026 (DDF approval, 1 Jun 2026)",
      "linkedProjectId": "lodha-palava-dc",
      "sourceIds": [
        "src-merc-lodha-2026"
      ],
      "confidence": "high",
      "notes": "~1,450 MW connectivity granted by Maharashtra STU for the Palava DC park.",
      "lastVerified": "2026-07-09",
      "parentCompany": "Macrotech Developers / Lodha Group",
      "drawalState": "Maharashtra",
      "transmissionStatus": "MERC approved the MSETCL/Lodha Dedicated Distribution Facility for about 1,450 MW at Ambernath 400/220 kV GIS; exact power-flow window is not published.",
      "requestedPowerFlowStart": "not published",
      "requestedPowerFlowEnd": "not published",
      "approvedPowerFlowStart": "not published",
      "approvedPowerFlowEnd": "not published"
    },
    {
      "id": "conn-lodha-palava-pipeline",
      "applicant": "Maharashtra STU (MSETCL), for Lodha Developers",
      "operator": "Macrotech Developers (Lodha)",
      "useType": "datacenter",
      "quantumMW": 1500,
      "powerFlowStart": "2028",
      "tier": "intra-state",
      "utility": "MSETCL / Maharashtra STU",
      "substation": "Ambernath 400/220 kV GIS",
      "state": "Maharashtra",
      "status": "applied",
      "applicationRef": "Further capacity under consideration (trade press, Jun 2026)",
      "linkedProjectId": "lodha-palava-dc",
      "sourceIds": [
        "src-merc-lodha-2026"
      ],
      "confidence": "medium",
      "notes": "~1,500 MW further capacity under consideration, toward ~2,950 MW by 2028.",
      "lastVerified": "2026-07-09",
      "parentCompany": "Macrotech Developers / Lodha Group",
      "drawalState": "Maharashtra",
      "transmissionStatus": "Additional about 1,500 MW remains under consideration; no new MERC/MSETCL approval located in this pass.",
      "requestedPowerFlowStart": "not published",
      "requestedPowerFlowEnd": "not published",
      "approvedPowerFlowStart": "not approved",
      "approvedPowerFlowEnd": "not approved"
    },
    {
      "id": "conn-vizag-mega",
      "applicant": "Vizag Mega Data Center Park Ltd",
      "operator": "AdaniConneX / Adani Infra SPV (Google-Adani Vizag AI hub)",
      "useType": "datacenter",
      "quantumMW": 929,
      "powerFlowStart": "2028",
      "tier": "ISTS",
      "utility": "CTUIL",
      "substation": "Gajuwaka; Pendurthi (Vizag) GIS (TBCB package; BPC not explicit in CTUIL row)",
      "state": "Andhra Pradesh",
      "status": "applied",
      "applicationRef": "CTUIL GNA, 11 apps 2200003641-3652, May 2026 (Under Process)",
      "linkedProjectId": "google-vizag-ai-hub",
      "sourceIds": [
        "src-ctuil-gna-portal",
        "src-ctuil-live-2026-07-09",
        "src-ctuil-bidding-calendar-may26",
        "src-ctuil-bulk-consumer-margin-2025-08",
        "src-cmets-sr-38-pendurthi"
      ],
      "confidence": "high",
      "notes": "ISTS bulk-consumer GNA (Reg 17.1(iii)). Power-flow year estimated from the hub's ~2028 target; exact GNA-effective date TBD.",
      "lastVerified": "2026-07-09",
      "gridDelivery": {
        "packageId": "asset-pendurthi-vizag-gh-tbcb",
        "stationReadiness": "Pendurthi/Vizag delivery package in TBCB bidding",
        "implementationMode": "TBCB",
        "biddingAgency": "BPC not explicit in row (RECPDCL section)",
        "biddingAgencyNotes": "Vizag/Pendurthi row has a blank Bidding Agency cell in CTUIL's 31.05.2026 calendar; RECPDCL is only a section-level inference until confirmed by RFP/SPV notice.",
        "biddingStatus": "RFP issued 03.02.2026; RFP bid submission scheduled 15.06.2026",
        "plannedSpvTransfer": "2026-07-20",
        "serviceNodes": [
          "Gajuwaka / Gazuwaka existing interconnection",
          "Pendurthi (Vizag) 765/400 kV GIS proposed"
        ],
        "keyDependencies": [
          "Pendurthi (Vizag) - Srikakulam 765 kV D/c line",
          "Khammam-II - Pendurthi (Vizag) 765 kV D/c line",
          "LILO of Kalpakka - Maradam 400 kV D/c line at Pendurthi"
        ],
        "sourceIds": [
          "src-ctuil-bidding-calendar-may26"
        ]
      },
      "parentCompany": "AdaniConneX / Adani Infrastructure SPV; linked to Google-Adani Vizag AI hub",
      "drawalState": "Andhra Pradesh",
      "transmissionStatus": "Pendurthi/Vizag GH-GA Phase-I transmission package remains the delivery dependency: TBCB; RFP issued 03.02.2026; bid submission scheduled 15.06.2026; SPV transfer target 20.07.2026 in the latest CTUIL bidding calendar located.",
      "requestedPowerFlowStart": "not published",
      "requestedPowerFlowEnd": "not published",
      "approvedPowerFlowStart": "not approved",
      "approvedPowerFlowEnd": "not approved"
    },
    {
      "id": "conn-vizag-hyperscale",
      "applicant": "Vizag Hyperscale Data Center Park Ltd",
      "operator": "AdaniConneX / Adani Infra SPV (Google-Adani Vizag AI hub)",
      "useType": "datacenter",
      "quantumMW": 697,
      "powerFlowStart": "2028",
      "tier": "ISTS",
      "utility": "CTUIL",
      "substation": "Gajuwaka; Pendurthi (Vizag) GIS (TBCB package; BPC not explicit in CTUIL row)",
      "state": "Andhra Pradesh",
      "status": "applied",
      "applicationRef": "CTUIL GNA, 8 apps 2200003654-3664, May 2026 (Under Process)",
      "linkedProjectId": "google-vizag-ai-hub",
      "sourceIds": [
        "src-ctuil-gna-portal",
        "src-ctuil-live-2026-07-09",
        "src-ctuil-bidding-calendar-may26",
        "src-ctuil-bulk-consumer-margin-2025-08",
        "src-cmets-sr-38-pendurthi"
      ],
      "confidence": "high",
      "notes": "ISTS bulk-consumer GNA. Power-flow year estimated; exact GNA-effective date TBD.",
      "lastVerified": "2026-07-09",
      "gridDelivery": {
        "packageId": "asset-pendurthi-vizag-gh-tbcb",
        "stationReadiness": "Pendurthi/Vizag delivery package in TBCB bidding",
        "implementationMode": "TBCB",
        "biddingAgency": "BPC not explicit in row (RECPDCL section)",
        "biddingAgencyNotes": "Vizag/Pendurthi row has a blank Bidding Agency cell in CTUIL's 31.05.2026 calendar; RECPDCL is only a section-level inference until confirmed by RFP/SPV notice.",
        "biddingStatus": "RFP issued 03.02.2026; RFP bid submission scheduled 15.06.2026",
        "plannedSpvTransfer": "2026-07-20",
        "serviceNodes": [
          "Gajuwaka / Gazuwaka existing interconnection",
          "Pendurthi (Vizag) 765/400 kV GIS proposed"
        ],
        "keyDependencies": [
          "Pendurthi (Vizag) - Srikakulam 765 kV D/c line",
          "Khammam-II - Pendurthi (Vizag) 765 kV D/c line",
          "LILO of Kalpakka - Maradam 400 kV D/c line at Pendurthi"
        ],
        "sourceIds": [
          "src-ctuil-bidding-calendar-may26"
        ]
      },
      "parentCompany": "AdaniConneX / Adani Infrastructure SPV; linked to Google-Adani Vizag AI hub",
      "drawalState": "Andhra Pradesh",
      "transmissionStatus": "Pendurthi/Vizag GH-GA Phase-I transmission package remains the delivery dependency: TBCB; RFP issued 03.02.2026; bid submission scheduled 15.06.2026; SPV transfer target 20.07.2026 in the latest CTUIL bidding calendar located.",
      "requestedPowerFlowStart": "not published",
      "requestedPowerFlowEnd": "not published",
      "approvedPowerFlowStart": "not approved",
      "approvedPowerFlowEnd": "not approved"
    },
    {
      "id": "conn-vizag-rambilli",
      "applicant": "Vizag Rambilli Data Center Park Ltd",
      "operator": "AdaniConneX / Adani Infra SPV (Google-Adani Vizag AI hub)",
      "useType": "datacenter",
      "quantumMW": 697,
      "powerFlowStart": "2028",
      "tier": "ISTS",
      "utility": "CTUIL",
      "substation": "Gajuwaka; Pendurthi (Vizag) GIS (TBCB package; BPC not explicit in CTUIL row)",
      "state": "Andhra Pradesh",
      "status": "applied",
      "applicationRef": "CTUIL GNA, 8 apps 2200003657-3669, May 2026 (Under Process); APSEIAA EC AKP 04 2026 2516",
      "linkedProjectId": "google-vizag-ai-hub",
      "sourceIds": [
        "src-ctuil-gna-portal",
        "src-ctuil-live-2026-07-09",
        "src-ctuil-bidding-calendar-may26",
        "src-ctuil-bulk-consumer-margin-2025-08",
        "src-cmets-sr-38-pendurthi"
      ],
      "confidence": "high",
      "notes": "ISTS bulk-consumer GNA. Corroborated by AP environmental clearance for Rambilli. Power-flow year estimated.",
      "lastVerified": "2026-07-09",
      "gridDelivery": {
        "packageId": "asset-pendurthi-vizag-gh-tbcb",
        "stationReadiness": "Pendurthi/Vizag delivery package in TBCB bidding",
        "implementationMode": "TBCB",
        "biddingAgency": "BPC not explicit in row (RECPDCL section)",
        "biddingAgencyNotes": "Vizag/Pendurthi row has a blank Bidding Agency cell in CTUIL's 31.05.2026 calendar; RECPDCL is only a section-level inference until confirmed by RFP/SPV notice.",
        "biddingStatus": "RFP issued 03.02.2026; RFP bid submission scheduled 15.06.2026",
        "plannedSpvTransfer": "2026-07-20",
        "serviceNodes": [
          "Gajuwaka / Gazuwaka existing interconnection",
          "Pendurthi (Vizag) 765/400 kV GIS proposed"
        ],
        "keyDependencies": [
          "Pendurthi (Vizag) - Srikakulam 765 kV D/c line",
          "Khammam-II - Pendurthi (Vizag) 765 kV D/c line",
          "LILO of Kalpakka - Maradam 400 kV D/c line at Pendurthi"
        ],
        "sourceIds": [
          "src-ctuil-bidding-calendar-may26"
        ]
      },
      "parentCompany": "AdaniConneX / Adani Infrastructure SPV; linked to Google-Adani Vizag AI hub",
      "drawalState": "Andhra Pradesh",
      "transmissionStatus": "Pendurthi/Vizag GH-GA Phase-I transmission package remains the delivery dependency: TBCB; RFP issued 03.02.2026; bid submission scheduled 15.06.2026; SPV transfer target 20.07.2026 in the latest CTUIL bidding calendar located.",
      "requestedPowerFlowStart": "not published",
      "requestedPowerFlowEnd": "not published",
      "approvedPowerFlowStart": "not approved",
      "approvedPowerFlowEnd": "not approved"
    },
    {
      "id": "conn-hypervault",
      "applicant": "HyperVault AI Data Center Ltd",
      "operator": "HyperVault (TCS / TPG)",
      "useType": "datacenter",
      "quantumMW": 450,
      "powerFlowStart": "2028",
      "tier": "ISTS",
      "utility": "CTUIL",
      "substation": "Maheshwaram",
      "state": "Telangana",
      "status": "applied",
      "applicationRef": "CTUIL GNA app 2200003810, 24 Jun 2026 (Under Process)",
      "linkedProjectId": "hypervault-telangana",
      "sourceIds": [
        "src-ctuil-gna-portal",
        "src-ctuil-live-2026-07-09"
      ],
      "confidence": "high",
      "notes": "ISTS bulk-consumer GNA. Power-flow year estimated; exact GNA-effective date TBD.",
      "lastVerified": "2026-07-09",
      "gridDelivery": {
        "packageId": "asset-maheshwaram-service-watch",
        "stationReadiness": "Maheshwaram service route under watch",
        "implementationMode": "TBD",
        "biddingAgency": "Not located in CTUIL bidding calendar",
        "biddingStatus": "ISTS application under process; delivery package / STU-vs-ISTS service route still needs TGTRANSCO / CTUIL follow-up",
        "serviceNodes": [
          "Maheshwaram / Maheswaram substation"
        ],
        "sourceIds": [
          "src-ctuil-gna-portal"
        ]
      },
      "parentCompany": "TCS 51% / TPG 49%",
      "drawalState": "Telangana",
      "transmissionStatus": "Maheshwaram service route remains under watch; no public CTUIL TBCB package located for this exact load in the latest calendar checked.",
      "requestedPowerFlowStart": "not published",
      "requestedPowerFlowEnd": "not published",
      "approvedPowerFlowStart": "not approved",
      "approvedPowerFlowEnd": "not approved"
    },
    {
      "id": "conn-ctrls",
      "applicant": "CtrlS Datacenters Ltd",
      "operator": "CtrlS Datacenters (Chandanvelly campus)",
      "useType": "datacenter",
      "quantumMW": 50,
      "powerFlowStart": "2027",
      "tier": "ISTS",
      "utility": "CTUIL",
      "substation": "Maheswaram",
      "state": "Telangana",
      "status": "applied",
      "applicationRef": "CTUIL GNA app 2200002559, 3 Dec 2025 (Under Process)",
      "linkedProjectId": "",
      "sourceIds": [
        "src-ctuil-gna-portal",
        "src-ctuil-live-2026-07-09"
      ],
      "confidence": "high",
      "notes": "ISTS bulk-consumer GNA. First 50 MW of a 250 MW (→900 MW) Chandanvelly campus. Power-flow year estimated.",
      "lastVerified": "2026-07-09",
      "gridDelivery": {
        "packageId": "asset-maheshwaram-service-watch",
        "stationReadiness": "Maheshwaram service route under watch",
        "implementationMode": "TBD",
        "biddingAgency": "Not located in CTUIL bidding calendar",
        "biddingStatus": "ISTS application under process; delivery package / STU-vs-ISTS service route still needs TGTRANSCO / CTUIL follow-up",
        "serviceNodes": [
          "Maheshwaram / Maheswaram substation"
        ],
        "sourceIds": [
          "src-ctuil-gna-portal"
        ]
      },
      "parentCompany": "CtrlS Datacenters",
      "drawalState": "Telangana",
      "transmissionStatus": "Maheswaram service route remains under watch; no public CTUIL TBCB package located for this exact 50 MW load in the latest calendar checked.",
      "requestedPowerFlowStart": "not published",
      "requestedPowerFlowEnd": "not published",
      "approvedPowerFlowStart": "not approved",
      "approvedPowerFlowEnd": "not approved"
    },
    {
      "id": "conn-stt",
      "applicant": "STT Global Data Centres India Pvt Ltd",
      "operator": "ST Telemedia Global Data Centres",
      "useType": "datacenter",
      "quantumMW": 7,
      "powerFlowStart": "2026-07-10",
      "tier": "intra-state",
      "utility": "CTUIL GNA-RE (drawee entity connected to intra-state network, NR)",
      "substation": "NA / not specified in approved register",
      "state": "Delhi",
      "status": "granted",
      "applicationRef": "CTUIL GNA app 2200003433 — GRANTED in May 2026 Reg-17 approved register: GNA-RE, 7 MW, expected effective 10-07-2026",
      "linkedProjectId": "",
      "sourceIds": [
        "src-ctuil-gna-portal",
        "src-ctuil-live-2026-07-09",
        "src-ctuil-reg17-may26"
      ],
      "confidence": "high",
      "notes": "First DC grant in CTUIL's Reg-17 register. GNA-RE = renewable network access; register-level evidence of green drawal. Live portal still shows Under Process, so the approved register is the source of record.",
      "lastVerified": "2026-07-09",
      "dateConfidence": "declared",
      "drawalState": "Delhi",
      "parentCompany": "ST Telemedia Global Data Centres / ST Telemedia",
      "transmissionStatus": "Granted as GNA-RE for a drawee entity connected to the intra-state network; no dedicated transmission asset tracked.",
      "requestedPowerFlowStart": "not published",
      "requestedPowerFlowEnd": "not published",
      "approvedPowerFlowStart": "2026-07-10",
      "approvedPowerFlowEnd": "not published"
    }
  ],
  "watchlist": [
    {
      "id": "watch-pendurthi-spv-transfer",
      "severity": "high",
      "title": "BPC / SPV transfer for the Vizag/Pendurthi package",
      "trigger": "CTUIL or the eventual BPC updates the Vizag Phase-I TBCB package after the 20-Jul-2026 SPV-transfer target",
      "whyItMatters": "This is the delivery bottleneck behind the 2,323 MW Vizag connectivity queue: if the package slips, the GNA status alone will overstate serviceability.",
      "checkWhere": "CTUIL Bidding Calendar; CTUIL Status of ISTS RTM and TBCB Projects; RECPDCL/PFCCL tender or SPV notices",
      "checkUrl": "https://www.ctuil.in/bidding-calendar",
      "nextCheck": "2026-07-21",
      "status": "armed",
      "sourceIds": [
        "src-ctuil-bidding-calendar-may26"
      ],
      "lastChecked": "2026-07-09"
    },
    {
      "id": "watch-indiaai-uptime-definition",
      "severity": "medium",
      "title": "MeitY / IndiaAI cloud-service uptime language",
      "trigger": "IndiaAI updates the RFE, empanelment SLA, STQC certification requirement, or cloud-service credit bands",
      "whyItMatters": "This is the live government definition of AI-cloud service availability. It should inform dashboard serviceability notes, but it is not the same as a universal statutory datacenter uptime mandate.",
      "checkWhere": "IndiaAI compute capacity hub; IndiaAI / MeitY RFE and empanelment documents",
      "checkUrl": "https://indiaai.gov.in/hub/indiaai-compute-capacity",
      "nextCheck": "2026-07-30",
      "status": "armed",
      "sourceIds": [
        "src-indiaai-rfe-cloud-2025"
      ]
    }
  ],
  "personaTakeaways": [],
  "gridDeliveryAssets": [
    {
      "id": "asset-pendurthi-vizag-gh-tbcb",
      "name": "Vizag/Pendurthi GH-GA transmission package, Phase-I",
      "state": "Andhra Pradesh / Telangana",
      "status": "TBCB bidding",
      "implementationMode": "TBCB",
      "biddingAgency": "BPC not explicit in row (RECPDCL section)",
      "biddingAgencyNotes": "The Vizag/Pendurthi row has a blank Bidding Agency cell in CTUIL's 31.05.2026 bidding calendar; it appears inside the RECPDCL section, so RECPDCL should be treated as a section-level clue, not row-level confirmation.",
      "biddingStatus": "RFP issued 03.02.2026; RFP bid submission scheduled 15.06.2026; SPV transfer target 20.07.2026",
      "plannedSpvTransfer": "2026-07-20",
      "linkedConnectivityIds": [
        "conn-vizag-mega",
        "conn-vizag-hyperscale",
        "conn-vizag-rambilli"
      ],
      "majorElements": [
        "4x1500 MVA, 765/400 kV Pendurthi (Vizag) GIS with 765 kV bus reactor and 220 kV switchyard space",
        "Pendurthi (Vizag) - Srikakulam 765 kV D/c line with switchable line reactors",
        "LILO of Kalpakka - Maradam 400 kV D/c line at Pendurthi",
        "3x1500 MVA, 765/400 kV Khammam-II substation",
        "Khammam-II - Warangal New 765 kV D/c; Khammam-II - Pendurthi 765 kV D/c; Khammam-II - Khammam 400 kV D/c"
      ],
      "dashboardImplication": "Treat Vizag's 2,323 MW filed connectivity as serviceable only if this TBCB package advances; the station/package status belongs next to the GNA status.",
      "sourceIds": [
        "src-ctuil-bidding-calendar-may26",
        "src-ctuil-bulk-consumer-margin-2025-08",
        "src-cmets-sr-38-pendurthi"
      ],
      "lastVerified": "2026-07-06"
    },
    {
      "id": "asset-maheshwaram-service-watch",
      "name": "Maheshwaram / Maheswaram service route for Telangana DC loads",
      "state": "Telangana",
      "status": "watch",
      "implementationMode": "TBD",
      "biddingAgency": "Not located in CTUIL bidding calendar",
      "biddingStatus": "CtrlS and HyperVault CTUIL applications name Maheswaram/Maheshwaram; public delivery package and STU-vs-ISTS service route need follow-up.",
      "linkedConnectivityIds": [
        "conn-hypervault",
        "conn-ctrls"
      ],
      "majorElements": [
        "CtrlS: 50 MW at Maheswaram, CTUIL application under process",
        "HyperVault: 450 MW at Maheshwaram substation, CTUIL application under process"
      ],
      "dashboardImplication": "Do not read Telangana applications as deliverable simply because a CTUIL application exists; the dashboard should keep station/service-route status visible.",
      "sourceIds": [
        "src-ctuil-gna-portal"
      ],
      "lastVerified": "2026-07-06"
    }
  ],
  "uptimeStandards": [
    {
      "id": "uptime-indiaai-cloud-sla",
      "title": "IndiaAI AI-cloud monthly availability SLA",
      "authority": "IndiaAI / MeitY",
      "definitionType": "cloud_service_sla",
      "metric": "Monthly uptime percentage for each AI cloud service / single instance",
      "thresholds": [
        ">=99.95%: no service credit band triggered",
        "<99.95% and >=99.0%: 10% service credit",
        "<99.0% and >=95.0%: 20% service credit",
        "<95.0%: 100% service credit"
      ],
      "scope": "Applies to IndiaAI empanelled AI services on cloud; not a universal all-datacenter statutory uptime mandate.",
      "dashboardImplication": "Use as the government-procurement uptime floor for AI-cloud serviceability; keep separate from project MW, GNA status, and clean-power firmness.",
      "sourceIds": [
        "src-indiaai-rfe-cloud-2025"
      ],
      "lastVerified": "2026-07-06"
    },
    {
      "id": "uptime-indiaai-facility-tier",
      "title": "IndiaAI facility certification floor",
      "authority": "IndiaAI / MeitY",
      "definitionType": "facility_certification",
      "metric": "Datacenter facility conformance and third-party certification",
      "thresholds": [
        "At least Tier III conformance",
        "TIA-942 or Uptime Institute certification accepted",
        "STQC certification called out as upcoming facility requirement"
      ],
      "scope": "Facility evidence required from IndiaAI cloud-service empanelment applicants.",
      "dashboardImplication": "Treat Tier III/TIA/Uptime/STQC as a certification floor when a project is selling into government AI-cloud procurement; it does not by itself prove power deliverability.",
      "sourceIds": [
        "src-indiaai-rfe-cloud-2025",
        "src-uptime-institute-tiers"
      ],
      "lastVerified": "2026-07-06"
    },
    {
      "id": "uptime-telangana-essential-service",
      "title": "Telangana essential-service and dual-grid promise",
      "authority": "Government of Telangana",
      "definitionType": "state_power_priority",
      "metric": "Policy support for uninterrupted quality electricity and exemption from statutory power cuts",
      "thresholds": [
        "Dual power grid networks promised for DCs",
        "Datacenters classified as essential services",
        "Exemption from statutory power cuts"
      ],
      "scope": "Telangana state datacenter policy support; not a measured facility SLA.",
      "dashboardImplication": "Use as state service-priority context for Hyderabad/Telangana loads, while separately tracking the actual Maheshwaram delivery route.",
      "sourceIds": [
        "pol-ts-dc"
      ],
      "lastVerified": "2026-07-06"
    }
  ],
  "derived": {
    "generatedAt": "2026-07-09T11:54:05+00:00",
    "statusOrder": {
      "operational": 0,
      "under_construction": 1,
      "announced": 2,
      "mou_speculative": 3
    },
    "counts": {
      "operational": 8,
      "under_construction": 2,
      "announced": 7,
      "mou_speculative": 3
    },
    "headlineCounts": {
      "operational": 8,
      "under_construction": 2,
      "announced": 7
    },
    "capacityByStatusMw": {
      "operational": 28.0,
      "under_construction": 1000.0,
      "announced": 1271.0,
      "mou_speculative": 300.0
    },
    "valueByStatusUsdB": {
      "operational": 4.4,
      "under_construction": 30.0,
      "announced": 28.731,
      "mou_speculative": 4.64
    },
    "headlineKnownCapacityMw": 2299.0,
    "headlineKnownValueUsdB": 63.131,
    "knownCapacityProjects": 6,
    "unknownCapacityProjects": 14,
    "stateDemand": [
      {
        "state": "Andhra Pradesh",
        "knownItLoadMw": 2300.0,
        "projectCount": 4,
        "byStatusMw": {
          "under_construction": 1000.0,
          "announced": 1000.0,
          "mou_speculative": 300.0
        }
      },
      {
        "state": "Gujarat",
        "knownItLoadMw": 168.0,
        "projectCount": 1,
        "byStatusMw": {
          "announced": 168.0
        }
      },
      {
        "state": "Maharashtra / Tamil Nadu",
        "knownItLoadMw": 103.0,
        "projectCount": 1,
        "byStatusMw": {
          "announced": 103.0
        }
      },
      {
        "state": "Haryana",
        "knownItLoadMw": 28.0,
        "projectCount": 2,
        "byStatusMw": {
          "operational": 28.0,
          "mou_speculative": 0.0
        }
      },
      {
        "state": "Telangana",
        "knownItLoadMw": 0.0,
        "projectCount": 3,
        "byStatusMw": {
          "operational": 0.0,
          "announced": 0.0
        }
      },
      {
        "state": "Maharashtra",
        "knownItLoadMw": 0.0,
        "projectCount": 5,
        "byStatusMw": {
          "operational": 0.0,
          "under_construction": 0.0
        }
      },
      {
        "state": "Delhi NCR",
        "knownItLoadMw": 0.0,
        "projectCount": 1,
        "byStatusMw": {
          "operational": 0.0
        }
      },
      {
        "state": "Tamil Nadu",
        "knownItLoadMw": 0.0,
        "projectCount": 2,
        "byStatusMw": {
          "operational": 0.0,
          "announced": 0.0
        }
      },
      {
        "state": "Multiple",
        "knownItLoadMw": 0.0,
        "projectCount": 1,
        "byStatusMw": {
          "announced": 0.0
        }
      }
    ],
    "capacityByFirmnessMw": {
      "grid": 28.0,
      "undisclosed": 2403.0,
      "bundled_ppa": 168.0
    },
    "countByFirmness": {
      "grid": 2,
      "undisclosed": 17,
      "bundled_ppa": 1
    },
    "topTags": [
      [
        "hyperscaler",
        9
      ],
      [
        "cloud-region",
        7
      ],
      [
        "gigawatt-load",
        3
      ],
      [
        "ai-load",
        3
      ],
      [
        "andhra-pradesh",
        3
      ],
      [
        "capacity-unreported",
        3
      ],
      [
        "mou",
        3
      ],
      [
        "north-india-load",
        2
      ],
      [
        "enterprise-cloud",
        2
      ],
      [
        "firm-power",
        2
      ],
      [
        "telangana-load-growth",
        2
      ],
      [
        "cfe-24x7",
        2
      ],
      [
        "maharashtra-load",
        2
      ],
      [
        "coastal-cooling",
        2
      ],
      [
        "grid-connection",
        2
      ],
      [
        "water-watch",
        2
      ]
    ],
    "sourceTierMix": {
      "primary": 35,
      "official": 14,
      "secondary": 66,
      "total": 115,
      "secondaryPct": 57
    },
    "timeline": [
      {
        "month": "2025-01",
        "cumulativeProjects": 4,
        "cumulativeKnownMw": 0.0,
        "headlineCumulativeMw": 0.0,
        "byCurrentStatusMw": {
          "operational": 0.0,
          "announced": 0.0
        }
      },
      {
        "month": "2025-02",
        "cumulativeProjects": 4,
        "cumulativeKnownMw": 0.0,
        "headlineCumulativeMw": 0.0,
        "byCurrentStatusMw": {
          "operational": 0.0,
          "announced": 0.0
        }
      },
      {
        "month": "2025-03",
        "cumulativeProjects": 4,
        "cumulativeKnownMw": 0.0,
        "headlineCumulativeMw": 0.0,
        "byCurrentStatusMw": {
          "operational": 0.0,
          "announced": 0.0
        }
      },
      {
        "month": "2025-04",
        "cumulativeProjects": 4,
        "cumulativeKnownMw": 0.0,
        "headlineCumulativeMw": 0.0,
        "byCurrentStatusMw": {
          "operational": 0.0,
          "announced": 0.0
        }
      },
      {
        "month": "2025-05",
        "cumulativeProjects": 4,
        "cumulativeKnownMw": 0.0,
        "headlineCumulativeMw": 0.0,
        "byCurrentStatusMw": {
          "operational": 0.0,
          "announced": 0.0
        }
      },
      {
        "month": "2025-06",
        "cumulativeProjects": 4,
        "cumulativeKnownMw": 0.0,
        "headlineCumulativeMw": 0.0,
        "byCurrentStatusMw": {
          "operational": 0.0,
          "announced": 0.0
        }
      },
      {
        "month": "2025-07",
        "cumulativeProjects": 5,
        "cumulativeKnownMw": 28.0,
        "headlineCumulativeMw": 28.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "announced": 0.0
        }
      },
      {
        "month": "2025-08",
        "cumulativeProjects": 6,
        "cumulativeKnownMw": 28.0,
        "headlineCumulativeMw": 28.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "announced": 0.0
        }
      },
      {
        "month": "2025-09",
        "cumulativeProjects": 6,
        "cumulativeKnownMw": 28.0,
        "headlineCumulativeMw": 28.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "announced": 0.0
        }
      },
      {
        "month": "2025-10",
        "cumulativeProjects": 7,
        "cumulativeKnownMw": 1028.0,
        "headlineCumulativeMw": 1028.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 0.0
        }
      },
      {
        "month": "2025-11",
        "cumulativeProjects": 10,
        "cumulativeKnownMw": 2328.0,
        "headlineCumulativeMw": 2028.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1000.0,
          "mou_speculative": 300.0
        }
      },
      {
        "month": "2025-12",
        "cumulativeProjects": 12,
        "cumulativeKnownMw": 2328.0,
        "headlineCumulativeMw": 2028.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1000.0,
          "mou_speculative": 300.0
        }
      },
      {
        "month": "2026-01",
        "cumulativeProjects": 12,
        "cumulativeKnownMw": 2328.0,
        "headlineCumulativeMw": 2028.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1000.0,
          "mou_speculative": 300.0
        }
      },
      {
        "month": "2026-02",
        "cumulativeProjects": 12,
        "cumulativeKnownMw": 2328.0,
        "headlineCumulativeMw": 2028.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1000.0,
          "mou_speculative": 300.0
        }
      },
      {
        "month": "2026-03",
        "cumulativeProjects": 14,
        "cumulativeKnownMw": 2328.0,
        "headlineCumulativeMw": 2028.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1000.0,
          "mou_speculative": 300.0
        }
      },
      {
        "month": "2026-04",
        "cumulativeProjects": 14,
        "cumulativeKnownMw": 2328.0,
        "headlineCumulativeMw": 2028.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1000.0,
          "mou_speculative": 300.0
        }
      },
      {
        "month": "2026-05",
        "cumulativeProjects": 14,
        "cumulativeKnownMw": 2328.0,
        "headlineCumulativeMw": 2028.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1000.0,
          "mou_speculative": 300.0
        }
      },
      {
        "month": "2026-06",
        "cumulativeProjects": 20,
        "cumulativeKnownMw": 2599.0,
        "headlineCumulativeMw": 2299.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1271.0,
          "mou_speculative": 300.0
        }
      },
      {
        "month": "2026-07",
        "cumulativeProjects": 20,
        "cumulativeKnownMw": 2599.0,
        "headlineCumulativeMw": 2299.0,
        "byCurrentStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1271.0,
          "mou_speculative": 300.0
        }
      }
    ],
    "connectivity": {
      "summary": {
        "totalMW": 5780.0,
        "grantedMW": 1457.0,
        "appliedMW": 4323.0,
        "byTier": {
          "intra-state": 2957.0,
          "ISTS": 2823.0
        },
        "byStatusMw": {
          "granted": 1457.0,
          "applied": 4323.0
        },
        "byStateMw": {
          "Maharashtra": 2950.0,
          "Andhra Pradesh": 2323.0,
          "Telangana": 500.0,
          "Delhi": 7.0
        },
        "count": 8,
        "declaredDateCount": 1,
        "estimatedDateCount": 7
      },
      "forward": [
        {
          "year": "2026",
          "cumulativeMW": 7.0,
          "cumulativeGrantedMW": 7.0,
          "cumulativeDeclaredMW": 7.0
        },
        {
          "year": "2027",
          "cumulativeMW": 57.0,
          "cumulativeGrantedMW": 7.0,
          "cumulativeDeclaredMW": 7.0
        },
        {
          "year": "2028",
          "cumulativeMW": 5780.0,
          "cumulativeGrantedMW": 1457.0,
          "cumulativeDeclaredMW": 7.0
        }
      ]
    },
    "reconciliation": {
      "totals": {
        "pressHeadlineMw": 2299.0,
        "filedMw": 5780.0,
        "grantedMw": 1457.0,
        "commissionedMw": 0
      },
      "projects": [
        {
          "projectId": "lodha-palava-dc",
          "name": "Lodha Green Integrated Data Centre Park, Palava",
          "state": "Maharashtra",
          "pressMw": null,
          "filedMw": 2950.0,
          "grantedMw": 1450.0,
          "filingCount": 2
        },
        {
          "projectId": "google-vizag-ai-hub",
          "name": "Google Cloud India AI Hub, Visakhapatnam",
          "state": "Andhra Pradesh",
          "pressMw": 1000,
          "filedMw": 2323.0,
          "grantedMw": 0,
          "filingCount": 3
        },
        {
          "projectId": "hypervault-telangana",
          "name": "HyperVault AI Data Center, Telangana",
          "state": "Telangana",
          "pressMw": null,
          "filedMw": 450.0,
          "grantedMw": 0,
          "filingCount": 1
        }
      ],
      "unlinked": [
        {
          "id": "conn-ctrls",
          "operator": "CtrlS Datacenters (Chandanvelly campus)",
          "quantumMW": 50,
          "status": "applied",
          "state": "Telangana"
        },
        {
          "id": "conn-stt",
          "operator": "ST Telemedia Global Data Centres",
          "quantumMW": 7,
          "status": "granted",
          "state": "Delhi"
        }
      ]
    },
    "stateShareOfPeak": [
      {
        "state": "Andhra Pradesh",
        "peakMW": 13712,
        "itLoadMw": 2000.0,
        "connectivityMW": 2323.0,
        "itPctOfPeak": 14.6,
        "connPctOfPeak": 16.9
      },
      {
        "state": "Maharashtra",
        "peakMW": 32000,
        "itLoadMw": 0.0,
        "connectivityMW": 2950.0,
        "itPctOfPeak": 0.0,
        "connPctOfPeak": 9.2
      },
      {
        "state": "Telangana",
        "peakMW": 18139,
        "itLoadMw": 0.0,
        "connectivityMW": 500.0,
        "itPctOfPeak": 0.0,
        "connPctOfPeak": 2.8
      },
      {
        "state": "Gujarat",
        "peakMW": 26457,
        "itLoadMw": 168.0,
        "connectivityMW": 0.0,
        "itPctOfPeak": 0.6,
        "connPctOfPeak": 0.0
      },
      {
        "state": "Haryana",
        "peakMW": 14662,
        "itLoadMw": 28.0,
        "connectivityMW": 0.0,
        "itPctOfPeak": 0.2,
        "connPctOfPeak": 0.0
      }
    ],
    "takeawayMetrics": {
      "trackedItMw": "2,299",
      "undisclosedMw": "2,403",
      "undisclosedPct": "92",
      "connTotalMw": "5,780",
      "connGrantedMw": "1,457",
      "connAppliedMw": "4,323",
      "connFilings": "8",
      "connIstsMw": "2,823",
      "connIntraMw": "2,957",
      "connEstimatedDates": "7 of 8",
      "nationalPeakGw": "271",
      "itPctOfNationalPeak": "0.8",
      "connPctOfNationalPeak": "2.1",
      "mouMw": "300",
      "mouCount": "3",
      "projectCount": "20",
      "secondarySourcePct": "57"
    },
    "snapshotHistory": [
      {
        "month": "2026-06",
        "asOf": "2026-06-30",
        "generatedAt": "2026-07-05T12:25:55+00:00",
        "headlineCounts": {
          "operational": 8,
          "under_construction": 2,
          "announced": 7
        },
        "counts": {
          "operational": 8,
          "under_construction": 2,
          "announced": 7,
          "mou_speculative": 3
        },
        "capacityByStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1271.0,
          "mou_speculative": 300.0
        },
        "headlineKnownCapacityMw": 2299.0,
        "stateDemand": [
          {
            "state": "Andhra Pradesh",
            "knownItLoadMw": 2300.0,
            "projectCount": 4,
            "byStatusMw": {
              "under_construction": 1000.0,
              "announced": 1000.0,
              "mou_speculative": 300.0
            }
          },
          {
            "state": "Gujarat",
            "knownItLoadMw": 168.0,
            "projectCount": 1,
            "byStatusMw": {
              "announced": 168.0
            }
          },
          {
            "state": "Maharashtra / Tamil Nadu",
            "knownItLoadMw": 103.0,
            "projectCount": 1,
            "byStatusMw": {
              "announced": 103.0
            }
          },
          {
            "state": "Haryana",
            "knownItLoadMw": 28.0,
            "projectCount": 2,
            "byStatusMw": {
              "operational": 28.0,
              "mou_speculative": 0.0
            }
          },
          {
            "state": "Telangana",
            "knownItLoadMw": 0.0,
            "projectCount": 3,
            "byStatusMw": {
              "operational": 0.0,
              "announced": 0.0
            }
          },
          {
            "state": "Maharashtra",
            "knownItLoadMw": 0.0,
            "projectCount": 5,
            "byStatusMw": {
              "operational": 0.0,
              "under_construction": 0.0
            }
          },
          {
            "state": "Delhi NCR",
            "knownItLoadMw": 0.0,
            "projectCount": 1,
            "byStatusMw": {
              "operational": 0.0
            }
          },
          {
            "state": "Tamil Nadu",
            "knownItLoadMw": 0.0,
            "projectCount": 2,
            "byStatusMw": {
              "operational": 0.0,
              "announced": 0.0
            }
          },
          {
            "state": "Multiple",
            "knownItLoadMw": 0.0,
            "projectCount": 1,
            "byStatusMw": {
              "announced": 0.0
            }
          }
        ],
        "connectivitySummary": {
          "totalMW": 5780.0,
          "grantedMW": 1450.0,
          "appliedMW": 4330.0,
          "byTier": {
            "intra-state": 2957.0,
            "ISTS": 2823.0
          },
          "byStatusMw": {
            "granted": 1450.0,
            "applied": 4330.0
          },
          "byStateMw": {
            "Maharashtra": 2950.0,
            "Andhra Pradesh": 2323.0,
            "Telangana": 500.0,
            "Unspecified": 7.0
          },
          "count": 8,
          "declaredDateCount": 0,
          "estimatedDateCount": 8
        }
      },
      {
        "month": "2026-07",
        "asOf": "2026-07-09",
        "generatedAt": "2026-07-09T11:54:05+00:00",
        "headlineCounts": {
          "operational": 8,
          "under_construction": 2,
          "announced": 7
        },
        "counts": {
          "operational": 8,
          "under_construction": 2,
          "announced": 7,
          "mou_speculative": 3
        },
        "capacityByStatusMw": {
          "operational": 28.0,
          "under_construction": 1000.0,
          "announced": 1271.0,
          "mou_speculative": 300.0
        },
        "headlineKnownCapacityMw": 2299.0,
        "stateDemand": [
          {
            "state": "Andhra Pradesh",
            "knownItLoadMw": 2300.0,
            "projectCount": 4,
            "byStatusMw": {
              "under_construction": 1000.0,
              "announced": 1000.0,
              "mou_speculative": 300.0
            }
          },
          {
            "state": "Gujarat",
            "knownItLoadMw": 168.0,
            "projectCount": 1,
            "byStatusMw": {
              "announced": 168.0
            }
          },
          {
            "state": "Maharashtra / Tamil Nadu",
            "knownItLoadMw": 103.0,
            "projectCount": 1,
            "byStatusMw": {
              "announced": 103.0
            }
          },
          {
            "state": "Haryana",
            "knownItLoadMw": 28.0,
            "projectCount": 2,
            "byStatusMw": {
              "operational": 28.0,
              "mou_speculative": 0.0
            }
          },
          {
            "state": "Telangana",
            "knownItLoadMw": 0.0,
            "projectCount": 3,
            "byStatusMw": {
              "operational": 0.0,
              "announced": 0.0
            }
          },
          {
            "state": "Maharashtra",
            "knownItLoadMw": 0.0,
            "projectCount": 5,
            "byStatusMw": {
              "operational": 0.0,
              "under_construction": 0.0
            }
          },
          {
            "state": "Delhi NCR",
            "knownItLoadMw": 0.0,
            "projectCount": 1,
            "byStatusMw": {
              "operational": 0.0
            }
          },
          {
            "state": "Tamil Nadu",
            "knownItLoadMw": 0.0,
            "projectCount": 2,
            "byStatusMw": {
              "operational": 0.0,
              "announced": 0.0
            }
          },
          {
            "state": "Multiple",
            "knownItLoadMw": 0.0,
            "projectCount": 1,
            "byStatusMw": {
              "announced": 0.0
            }
          }
        ],
        "connectivitySummary": {
          "totalMW": 5780.0,
          "grantedMW": 1457.0,
          "appliedMW": 4323.0,
          "byTier": {
            "intra-state": 2957.0,
            "ISTS": 2823.0
          },
          "byStatusMw": {
            "granted": 1457.0,
            "applied": 4323.0
          },
          "byStateMw": {
            "Maharashtra": 2950.0,
            "Andhra Pradesh": 2323.0,
            "Telangana": 500.0,
            "Delhi": 7.0
          },
          "count": 8,
          "declaredDateCount": 1,
          "estimatedDateCount": 7
        }
      }
    ],
    "changeLog": {
      "previousMonth": "2026-06",
      "added": [],
      "removed": [],
      "statusChanged": [],
      "mwChanged": [],
      "connectivity": {
        "added": [],
        "removed": [],
        "statusChanged": [
          {
            "id": "conn-stt",
            "operator": "ST Telemedia Global Data Centres",
            "from": "applied",
            "to": "granted"
          }
        ],
        "quantumChanged": []
      }
    }
  }
};
