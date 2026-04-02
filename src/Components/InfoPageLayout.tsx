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
    <section className="mx-auto w-[94%] max-w-[1300px] py-12 sm:py-16 lg:py-20">
      <div className="rounded-[8px] bg-[#e8e7f2] px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-14">
        <h1 className="text-[2.15rem] font-semibold leading-tight text-[#0b0b0b] sm:text-[2.75rem]">{title}</h1>
        {showContentCard
          ? isLoading
            ? <p className="mt-8 text-[1.02rem] leading-9 text-[#0b0b0b]">Loading details...</p>
            : content
              ? shouldRenderHtml
                ? (
                    <div
                      className="mt-8 space-y-4 text-[1.02rem] leading-9 text-[#5f6774] [&_a]:text-[#0b0b0b] [&_a]:underline [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-[#0b0b0b] [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#0b0b0b] [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0b0b0b] [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:space-y-2"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )
                : <div className="mt-8 whitespace-pre-line text-[1.02rem] leading-9 text-[#5f6774]">{content}</div>
              : <p className="mt-8 text-[1.02rem] leading-9 text-[#5f6774]">{emptyMessage}</p>
          : null}
      </div>
    </section>
  );
};

export default InfoPageLayout;
