import { Outlet } from "@remix-run/react";

export default function DayPage() {
  return (
    <div>
      <h1>This is the Day Page</h1>
      <Outlet />
    </div>
  )
}
