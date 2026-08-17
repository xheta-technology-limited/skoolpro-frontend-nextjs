interface FormSectionCardProps {
  title: string;
  children: React.ReactNode;
}

const FormSectionCard = ({ title, children }: FormSectionCardProps) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-4">
      <h3 className="text-sm font-semibold text-neutrals-900">{title}</h3>
      {children}
    </div>
  );
};

export default FormSectionCard;