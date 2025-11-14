import { CONFIG } from 'src/config-global';

import { EvaluationView } from 'src/sections/evaluation/evaluation-view';

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
      <title>{`Evaluation - ${CONFIG.appName}`}</title>

      <EvaluationView />
    </>
  );
}