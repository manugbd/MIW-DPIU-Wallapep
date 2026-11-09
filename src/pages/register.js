import CreateUserComponent from "@/components/users/CreateUserComponent";

export default function RegisterPage({ openNotification }) {
  return (
    <div>
      <CreateUserComponent openNotification={openNotification} />
    </div>
  );
}
