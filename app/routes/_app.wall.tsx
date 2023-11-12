import { Outlet } from "@remix-run/react";

export default function WallPage() {
  return (
    <div className="mx-4">
      <Outlet />
    </div>
  );
}
