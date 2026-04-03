type InfoPageLayoutProps = {
  title: string;
  content?: string;
  isLoading?: boolean;
  showContentCard?: boolean;
  emptyMessage: string;
};

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const InfoPageLayout = ({
  title,
  content,
  isLoading = false,
  showContentCard = false,
  emptyMessage,
}: InfoPageLayoutProps) => {
  const shouldRenderHtml = !!content && HTML_TAG_PATTERN.test(content);

  return (
    <section className="mx-auto w-[92%] max-w-[1300px] py-10 sm:py-14 lg:py-20">
      <div className="rounded-[12px] bg-[#ffffff] px-4 py-6 sm:px-8 sm:py-9 lg:px-14 lg:py-12">
        <h1 className="text-[1.65rem] font-semibold leading-tight text-[#0b0b0b] sm:text-[2.1rem] lg:text-[2.75rem]">{title}</h1>
        {showContentCard
          ? isLoading
            ? <p className="mt-6 text-[0.98rem] leading-7 text-[#0b0b0b] sm:mt-8 sm:text-[1.02rem] sm:leading-8">Loading details...</p>
            : content
              ? shouldRenderHtml
                ? (
                    <div
                      className="mt-6 space-y-4 text-[0.98rem] leading-7 text-[#5f6774] sm:mt-8 sm:text-[1.02rem] sm:leading-8 [&_a]:text-[#0b0b0b] [&_a]:underline [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-[#0b0b0b] sm:[&_h1]:text-3xl [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#0b0b0b] sm:[&_h2]:text-2xl [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#0b0b0b] sm:[&_h3]:text-xl [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:space-y-2"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )
                : <div className="mt-6 whitespace-pre-line text-[0.98rem] leading-7 text-[#5f6774] sm:mt-8 sm:text-[1.02rem] sm:leading-8">{content}</div>
              : <p className="mt-6 text-[0.98rem] leading-7 text-[#5f6774] sm:mt-8 sm:text-[1.02rem] sm:leading-8">{emptyMessage}</p>
          : null}
      </div>
    </section>
  );
};

export default InfoPageLayout;
