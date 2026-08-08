"use client";

import { useState } from "react";
import { ThirdForm, SecondForm, FirstForm, FourthForm } from "./_components";

export default function FormSwitcher() {
  const [phase, setPhase] = useState(1);
  return (
    <>
      {phase === 1 && <FirstForm setPhase={setPhase} />}
      {phase === 2 && <SecondForm setPhase={setPhase} />}
      {phase === 3 && <ThirdForm setPhase={setPhase} />}
      {phase === 4 && <FourthForm setPhase={setPhase} />}
    </>
  );
}
