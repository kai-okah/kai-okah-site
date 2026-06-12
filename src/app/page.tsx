import OfficeApp from "@/office/OfficeApp";

// `/` is v2: the 3D office (BRIEF v2, requirements V1–V12). Everything
// 3D is client-only and loaded dynamically inside OfficeApp; this page
// itself stays a trivial server component so static export keeps working.
// The full v1 one-pager lives on at /plain (V11).
export default function Home() {
  return <OfficeApp />;
}
