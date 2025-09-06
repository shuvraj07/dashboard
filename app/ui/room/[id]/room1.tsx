import SingleRoom from "../../singleRoom/room";

interface RoomPageProps {
  params: { id: string };
}

export default function RoomPage({ params }: RoomPageProps) {
  // Pass the id to the cl
  return <SingleRoom />;
}
