"use client";

import { useState } from "react";
import NotGenerated from "./components/not-generated";
import Generated from "./components/generated";

export default function LoginAccess() {
  const [isGenerated, setGenerated] = useState<boolean>(false);
  const [password, setPassword] = useState("");

  return (
    <>
      {!isGenerated ? (
        <NotGenerated setGenerated={setGenerated} setPassword={setPassword} />
      ) : (
        <Generated password={password} />
      )}
    </>
  );
}
