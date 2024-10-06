import Link from "next/link";

const dbs = [
  "demo_exam",
  "doner_exam",
  "internal_exam",
  "nielit_doner",
  "nielit_exam",
  "nielit_itp",
  "nielit_oes",
  "nielitmis_demo",
];

export default function Home() {
  return (
    <main className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {dbs.map((db, index) => (
        <section
          key={index}
          className="p-10 border rounded-lg transition-all hover:bg-accent"
        >
          <Link href={`/${db}`} key={index}>
            <p className="text-lg hover:underline">{db.replace(/_/g, " ")}</p>
          </Link>
        </section>
      ))}
    </main>
  );
}
