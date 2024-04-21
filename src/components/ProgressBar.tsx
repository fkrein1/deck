interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = `${String(Math.round((current / total) * 100))}%`;

  return (
    <>
      <div className="h-3 w-full rounded-lg bg-[#EEEEEE]" />
      <div
        className={`relative bottom-3 h-3 rounded-lg bg-sky-200`}
        style={{ width: percentage }}
      />
    </>
  );
};
