import LogoutButton from "@/app/components/LogoutButton";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          background: "#f4f4f4",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2>Finance Panel</h2>
        <LogoutButton />
      </header>

      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
}
