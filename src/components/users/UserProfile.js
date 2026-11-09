import { formatDate } from "@/utils/UtilsFormat";
import Head from "next/head";
import Link from "next/link";
import { Alert, Button, Card, Descriptions, Skeleton, Space, Tag } from "antd";
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import UserIdentity from "@/components/users/UserIdentity";
import ProfileTransactions from "@/components/users/ProfileTransactions";
import ProfileProducts from "@/components/users/ProfileProducts";
import { useUserProfile } from "@/hooks/useUserProfile";
import { summarizeTransactions } from "@/utils/UtilsTransactions";
import styles from "@/styles/UserProfile.module.css";

export default function UserProfile({ id }) {
  const profile = useUserProfile(id);

  const summary = summarizeTransactions(profile.transactions, id);

  return (
    <section className={styles.page} aria-labelledby="profile-title">
      <Head>
        <title>{profile.user?.name || "User profile"} | Wallapep</title>
      </Head>

      <Link href="/products" className={styles.backLink}>
        <ArrowLeftOutlined /> Back to products
      </Link>

      <header className={styles.heading}>
        <h1 id="profile-title">
          <UserOutlined /> User profile
        </h1>

        <Button
          icon={<ReloadOutlined />}
          onClick={profile.reload}
          loading={profile.loading || profile.activityLoading}
        >
          Refresh
        </Button>

      </header>
      
      {profile.loading ? (
        <Skeleton
          active
          avatar
          paragraph={{
            rows: 4,
          }}
        />
      ) : profile.error ? (
        <Alert
          type="error"
          showIcon
          message="Profile could not be loaded"
          description={profile.error}
          action={<Button onClick={profile.reload}>Try again</Button>}
        />
      ) : (
        profile.user && (
          <>
            <Card>
              <h2>About this user</h2>
              <UserIdentity
                id={profile.user.id}
                name={[profile.user.name, profile.user.surname]
                  .filter(Boolean)
                  .join(" ")}
                size={56}
                link={false}
              />
              <Descriptions
                column={{
                  xs: 1,
                  sm: 2,
                }}
                className={styles.publicDetails}
              >
                <Descriptions.Item label="Country">
                  {profile.user.country || "Not provided"}
                </Descriptions.Item>
              </Descriptions>
              {!profile.activityLoading && (
                <Space wrap>
                  {!profile.historyError && (
                    <>
                      <Tag>{summary.purchases} purchases</Tag>
                      <Tag>{summary.sales} sales</Tag>
                      <Tag>
                        Last activity:{" "}
                        {formatDate(
                          Math.max(
                            ...profile.transactions.map(
                              (t) => Number(t.startDate) || 0,
                            ),
                            0,
                          ),
                        )}
                      </Tag>
                    </>
                  )}
                  {!profile.productsError && (
                    <Tag>{profile.products.length} products for sale</Tag>
                  )}
                </Space>
              )}
            </Card>
            <section className={styles.section} aria-labelledby="sale-title">
              <h2 id="sale-title">Products for sale</h2>
              {profile.activityLoading ? (
                <Skeleton active />
              ) : profile.productsError ? (
                <Alert
                  type="error"
                  showIcon
                  message={profile.productsError}
                  action={<Button onClick={profile.reload}>Try again</Button>}
                />
              ) : (
                <ProfileProducts products={profile.products} userId={id} />
              )}
            </section>
            <section
              className={styles.section}
              aria-labelledby="activity-title"
            >
              <h2 id="activity-title">Public activity</h2>
              <p className={styles.note}>
                Purchases and sales shared on this profile. Delivery and payment
                details remain private.
              </p>
              {profile.activityLoading ? (
                <Skeleton active />
              ) : profile.historyError ? (
                <Alert
                  type="error"
                  showIcon
                  message={profile.historyError}
                  action={<Button onClick={profile.reload}>Try again</Button>}
                />
              ) : (
                <ProfileTransactions
                  transactions={profile.transactions}
                  userId={id}
                />
              )}
            </section>
          </>
        )
      )}
    </section>
  );
}
