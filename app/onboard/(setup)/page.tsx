"use client";

import { useState } from "react";
import FirstForm from "./_components/first-form";

export default function FormSwitcher() {
  const [phase, setPhase] = useState(1);
  return <>{phase === 1 && <FirstForm />}</>;
}
