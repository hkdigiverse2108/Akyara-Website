import InfoPage from "../InfoPage";
import { POLICY_TYPE } from "../../Constants";

const PrivacyPolicyPage = () => (
  <InfoPage policyType={POLICY_TYPE.PRIVACY} emptyMessage="Privacy policy details will appear here once the content is published."/>
);

export default PrivacyPolicyPage;
