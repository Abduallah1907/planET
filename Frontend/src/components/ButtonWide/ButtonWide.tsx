import "./ButtonWide.css";

interface ButtonLargeProps {
  label: string;
}

export default function ButtonWide({ label }: ButtonLargeProps) {
  return (
    <div>
      <button className="button">{label}</button>
    </div>
  );
}
