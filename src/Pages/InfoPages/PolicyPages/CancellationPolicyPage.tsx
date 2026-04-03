import InfoPage from "../../InfoPage";
import { POLICY_TYPE } from "../../../Constants";

const CancellationPolicyPage = () => (
  <InfoPage policyType={POLICY_TYPE.CANCELLATION} emptyMessage="Cancellation policy details will appear here once the content is published."/>
);

export default CancellationPolicyPage;

