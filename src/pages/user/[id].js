import { useRouter } from "next/router";
import UserProfile from "@/components/users/UserProfile";

export default function UserProfilePage() {
  const router = useRouter();
  if (!router.isReady) return null;
  return <UserProfile key={router.query.id} id={router.query.id} />;
}
