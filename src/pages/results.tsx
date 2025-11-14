import { CONFIG } from 'src/config-global';

import { ResultsView } from 'src/sections/results/results-view';

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
      <title>{`Results - ${CONFIG.appName}`}</title>

      <ResultsView />
    </>
  );
}