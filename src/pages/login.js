import LoginFormComponent from "@/components/users/LoginFormComponent";

export default function LoginPage({ setLogin, openNotification }) {
  return (
    <div>
      <LoginFormComponent
        setLogin={setLogin}
        openNotification={openNotification}
      />
    </div>
  );
}
