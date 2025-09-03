import SingleRoom from "@/app/ui/singleRoom/room";

export default async function RoomPage({ params }: { params: { id: string } }) {
  // params.id is directly accessible here, no need to await if just destructured like this,
  // but Next.js requires the function to be async to handle some internal async operations.

  return <SingleRoom />;
}
