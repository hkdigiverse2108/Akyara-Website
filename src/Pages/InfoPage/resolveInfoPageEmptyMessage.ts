export const resolveInfoPageEmptyMessage = (emptyMessage?: string, aboutPage?: boolean) =>
  emptyMessage ||
  (aboutPage
    ? "About page content will appear here once the content is published."
    : "Policy details will appear here once the content is published.");
