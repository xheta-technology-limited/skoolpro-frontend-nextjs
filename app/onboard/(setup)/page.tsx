"use client";

import { useState } from "react";
import FirstForm from "./_components/first-form";
import SecondForm from "./_components/second-form";

export default function FormSwitcher() {
  const [phase, setPhase] = useState(1);
  return (
    <>
      {phase === 1 && <FirstForm setPhase={setPhase} />}
      {phase === 2 && <SecondForm />}
    </>
  );
}
