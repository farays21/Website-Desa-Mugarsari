import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BantuanSosialList from "./BantuanSosialList";

export default async function AdminBantuanSosialPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Double-check role at page level
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") redirect("/home");

  const { data: applications, error } = await supabase
    .from("social_assistance")
    .select(
      `
      *
    `,
    )
    .order("created_at", { ascending: false });
  console.log("APPLICATIONS:", applications);
  console.log("ERROR:", error);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role="admin" />
      <div className="bg-gray-400 px-4 py-2">
        <h1 className="font-bold text-base">Manajemen Bantuan Sosial</h1>
      </div>
      <main className="flex-1 px-4 py-4 bg-gray-200">
        <BantuanSosialList applications={applications ?? []} />
      </main>
      <Footer />
    </div>
  );
}
