import { Empty, Button } from "antd";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon?: React.ReactNode;
}

const EmptyState = ({ 
  title = "No data found", 
  description = "Your list is currently empty.", 
  buttonText, 
  onButtonClick,
  icon
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-700">
      <Empty
        image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="mt-4">
            <h3 className="text-xl font-black text-[#111827] mb-1">{title}</h3>
            <p className="text-sm font-medium text-gray-400 max-w-[260px] mx-auto leading-relaxed italic">
              {description}
            </p>
          </div>
        }
      >
        {buttonText && (
          <Button
            type="primary"
            onClick={onButtonClick}
            className="mt-8 h-12 px-10 rounded-2xl bg-black text-xs font-bold uppercase tracking-widest border-none hover:!bg-gray-900 shadow-xl shadow-black/10"
          >
            {buttonText}
          </Button>
        )}
      </Empty>
      
      <style>{`
        .ant-empty-img-simple {
          height: 100px !important;
          opacity: 0.4;
        }
        .ant-empty-description {
            color: inherit !important;
        }
      `}</style>
    </div>
  );
};

export default EmptyState;
