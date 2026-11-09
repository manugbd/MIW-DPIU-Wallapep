import { useState } from "react";
import Link from "next/link";
import { Avatar, Button, Popover, Skeleton } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { usePublicUser } from "@/hooks/usePublicUser";
import styles from "@/styles/UserIdentity.module.css";

const getInitials = (text) =>
  text
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function UserIdentity({
  name,
  email,
  id,
  link = true,
  size = 32,
}) {
  const [open, setOpen] = useState(false);
  const profile = usePublicUser(id, {
    enabled: link,
  });

  const displayName =
    [profile.user?.name, profile.user?.surname].filter(Boolean).join(" ") ||
    name?.trim() ||
    profile.user?.email ||
    email ||
    (id != null ? `User #${id}` : "Unknown user");

  const displayEmail = profile.user?.email || email;

  const initials =
    name || profile.user?.name || displayEmail
      ? getInitials(displayName)
      : String(id ?? "?").slice(-2);

  const changeOpen = (nextOpen) => {
    setOpen(nextOpen);
  };

  const identity = (
    <>
      <Avatar size={size} className={styles.avatar} aria-hidden="true">
        {initials}
      </Avatar>
      <span className={styles.text}>
        <span>{displayName}</span>
      </span>
    </>
  );

  if (!link || id == null)
    return <span className={styles.identity}>{identity}</span>;

  const preview = (
    <div className={styles.preview}>
      {profile.loading ? (
        <Skeleton
          active
          avatar
          paragraph={{
            rows: 2,
          }}
        />
      ) : profile.error ? (
        <>
          <p>{profile.error}</p>
          <Button size="small" onClick={profile.reload}>
            Try again
          </Button>
        </>
      ) : (
        <>
          <strong>{displayName}</strong>

          {profile.user?.country && <p>{profile.user.country}</p>}
        </>
      )}
      <Link className={styles.profileLink} href={`/user/${id}`}>
        View full profile <ArrowRightOutlined />
      </Link>
    </div>
  );
  
  return (
    <Popover
      content={preview}
      open={open}
      onOpenChange={changeOpen}
      trigger={["hover", "focus"]}
      mouseEnterDelay={0.25}
      mouseLeaveDelay={0.15}
    >
      <Link href={`/user/${id}`} className={styles.identity}>
        {identity}
      </Link>
    </Popover>
  );
}
