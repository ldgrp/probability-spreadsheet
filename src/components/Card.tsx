type CardProps = {
  children?: React.ReactNode;
  className?: string;
};
export const Card = ({ children, className }: CardProps) => (
  <div className={`flex flex-col border bg-white border-gray-200 rounded-lg shadow overflow-hidden max-w-xl ${className}`}>
    {children}
  </div>
);
