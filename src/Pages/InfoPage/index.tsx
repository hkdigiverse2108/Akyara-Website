import { POLICY_TYPE } from "../../Constants";
import { Queries } from "../../Api/Queries";
import InfoPageLayout from "../../Components/InfoPageLayout";
import type { InfoPageProps, PolicyValue } from "../../Types";
import { normalizeInfoPageContent } from "./normalizeInfoPageContent";
import { resolveInfoPageEmptyMessage } from "./resolveInfoPageEmptyMessage";

const POLICY_TITLES: Record<string, string> = {
  [POLICY_TYPE.PRIVACY]: "Privacy & Policy",
  [POLICY_TYPE.RETURN_REFUND]: "Return & Refund Policy",
  [POLICY_TYPE.TERMS_CONDITION]: "Terms & Condition",
  [POLICY_TYPE.CANCELLATION]: "Cancellation Policy",
  [POLICY_TYPE.SHIPPING]: "Shipping Policy",
};

const resolveInfoPageTitle = (title?: string, policyType?: string) => {
  if (title?.trim()) {
    return title.trim();
  }

  if (policyType && POLICY_TITLES[policyType]) {
    return POLICY_TITLES[policyType];
  }

  return "Information";
};

const InfoPage = ({title,emptyMessage,policyType,contentType,strictTypeMatch,aboutPage,}: InfoPageProps) => {
  const policyQuery = Queries.useGetPolicyByType(policyType, !!policyType);
  const aboutQuery = Queries.useGetAboutSections(contentType, !!aboutPage);

  const contentResponse = aboutPage ? aboutQuery.data : policyQuery.data;
  const resolvedContentType = policyType || contentType;
  const contentItem = normalizeInfoPageContent(
    contentResponse?.data as PolicyValue,
    resolvedContentType,
    strictTypeMatch,
  );
  const resolvedTitle = contentItem?.title?.trim() || resolveInfoPageTitle(title, policyType);
  const contentDescription = contentItem?.description?.trim();
  const isLoading = aboutPage ? aboutQuery.isLoading : policyQuery.isLoading;
  const showContentCard = !!policyType || !!aboutPage;
  const resolvedEmptyMessage = resolveInfoPageEmptyMessage(emptyMessage, aboutPage);

  return (
    <InfoPageLayout title={resolvedTitle} content={contentDescription} isLoading={isLoading} showContentCard={showContentCard} emptyMessage={resolvedEmptyMessage}/>
  );
};

export default InfoPage;
