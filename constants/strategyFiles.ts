
export const STRATEGY_FILES = [
  {
    name: "Market_Maker_Model.txt",
    content: `MARKET MAKER MODEL
- Broader market structure including sell/buy programs.
- Sell side of curve: safely trade reversals.
- Buy side of curve: symmetrical targets and timing.
- Key parts: Original consolidation, Stair step pattern, HTF array levels, Symmetrical return.
- Symmetry is key; if broken, the model is failing.`
  },
  {
    name: "Model_930_Open.txt",
    content: `MODEL 9:30 - THE MARKET OPEN SWING
- Purpose: Identify the market open manipulation.
- Narrative:
  1. Pre-market consolidation act as the base.
  2. Use the open range to predict session behavior.
  3. The buddy swing is the directional guide for the first hour.`
  },
  {
    name: "Session_Macros_Engine.txt",
    content: `ALGORITHMIC SESSION MACROS
- Macros: Specific time periods where market delivery algorithms seek liquidity.
- Key Times (NY Time):
  Morning: 7:50-8:10, 8:50-9:10, 9:50-10:10.
  Afternoon: 1:20-1:40, 2:50-3:10, 3:50-4:10.
- High Probability Window: 9:20-9:40 AM.`
  },
  {
    name: "Professional_Risk_Rules.txt",
    content: `PROFESSIONAL RISK MANAGEMENT
- Core Principles: Trade with edge, Manage risk, Be consistent.
- Position Sizing: Based on Volatility. 1% risk per unit.
- Max Daily Limit: Strictly 2 trades per day for mental clarity and sustainability.`
  }
];
