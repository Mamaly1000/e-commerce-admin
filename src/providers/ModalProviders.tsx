"use client";
import CreateStoreModal from "@/components/modals/CreateStoreModal";
import React, { useEffect, useState } from "react";

const ModalProviders = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  return (
    <>
      <CreateStoreModal />
    </>
  );
};

export default ModalProviders;
