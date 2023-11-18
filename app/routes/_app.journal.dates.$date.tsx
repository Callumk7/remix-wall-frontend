import { useParams } from "@remix-run/react"

export default function JournalDatePage() {
  const params = useParams();
  return (
    <div>
      You made it here well done
      <span>{params.date}</span>
    </div>
  )
}
