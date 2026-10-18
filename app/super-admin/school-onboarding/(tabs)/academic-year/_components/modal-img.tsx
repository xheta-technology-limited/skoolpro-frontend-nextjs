export function StepIcon({ stage }: { stage: number }) {
  const imgSrc =
    stage === 1
      ? "/icons/progress-icons/progress1.png"
      : stage === 2
      ? "/icons/progress-icons/progress2.png"
      : stage === 3
      ? "/icons/progress-icons/progress3.png"
      : stage === 4
      ? "/icons/progress-icons/progress4.png"
      : "";
  return <img className="w-15 h-15 hidden md:block" src={imgSrc}></img>;
}
