import InfoPage from "../InfoPage";
import { POLICY_TYPE } from "../../Constants";

const TermsConditionPage = () => (
  <InfoPage policyType={POLICY_TYPE.TERMS_CONDITION} emptyMessage="Terms and conditions will appear here once the content is published."/>
);

export default TermsConditionPage;
