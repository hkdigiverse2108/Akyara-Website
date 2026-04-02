import InfoPage from "../InfoPage";
import { POLICY_TYPE } from "../../Constants";

const ReturnRefundPolicyPage = () => (
  <InfoPage policyType={POLICY_TYPE.RETURN_REFUND} emptyMessage="Return and refund policy details will appear here once the content is published."/>
);

export default ReturnRefundPolicyPage;
