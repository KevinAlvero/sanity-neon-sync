import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const res = await fetch(
    "https://3l9bn3l1.api.sanity.io/v2023-10-01/data/query/production?query=*"
  );

  const { result } = await res.json();

  for (const doc of result) {
    await sql`
      INSERT INTO sanity_documents (id, type, created_at, updated_at, rev, data)
      VALUES (
        ${doc._id},
        ${doc._type},
        ${doc._createdAt},
        ${doc._updatedAt},
        ${doc._rev},
        ${JSON.stringify(doc)}
      )
      ON CONFLICT (id)
      DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = EXCLUDED.updated_at,
        rev = EXCLUDED.rev;
    `;
  }

  return Response.json({ ok: true });
}
