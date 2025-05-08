import React, { useEffect, useRef } from "react";

export default function SolidJsToReactWrapper({ placeSolidJsComponent }) {
  const solidJsRef = useRef(null);

  useEffect(() => {
    if (solidJsRef.current) {
      placeSolidJsComponent(solidJsRef.current);
    }
  }, [placeSolidJsComponent]);

  return <div ref={solidJsRef}></div>;
};
