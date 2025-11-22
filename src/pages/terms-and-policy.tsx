
import { CONFIG } from 'src/config-global';

import { TermsAndPolicyView } from 'src/sections/terms-and-policy/terms-and-policy-view';

// ----------------------------------------------------------------------

export default function Page() {
  {
    return (
      <>
      <style>{`
          .css-1xq1kdw {
            max-width: 100% !important;
            background: transparent;
            padding: 0;
          }
        `}</style>
        <title>{`Terms & Policy - ${CONFIG.appName}`}</title>

        <TermsAndPolicyView />
      </>
    );
  }
}