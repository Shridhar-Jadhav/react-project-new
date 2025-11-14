import { CONFIG } from 'src/config-global';

import { ScenarioOptionsView } from 'src/sections/scenario/scenario-options-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
     <style>{`
        .css-1xq1kdw {
          max-width: 100% !important;
          background: transparent;
          padding: 0;
        }
      `}</style>
      <title>{`Scenario Options - ${CONFIG.appName}`}</title>

      <ScenarioOptionsView />
    </>
  );
}