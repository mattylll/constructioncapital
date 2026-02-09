"use client";

import dynamic from "next/dynamic";

const DealRoomForm = dynamic(
  () =>
    import("./deal-room-form").then((mod) => ({
      default: mod.DealRoomForm,
    })),
  { ssr: false }
);

export function DealRoomFormLoader() {
  return <DealRoomForm />;
}
