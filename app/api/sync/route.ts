import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  // 1. ambil last backup
  const [{ last_synced_at }] = await sql`
    SELECT last_synced_at
    FROM backup_state
    WHERE id = 'sanity'
  `;

  // 2. fetch sanity cuma yang baru
  const query = encodeURIComponent(`
    *[_updatedAt > "${last_synced_at}"]
  `);

  const res = await fetch(
    `https://3l9bn3l1.api.sanity.io/v2023-10-01/data/query/production?query=${query}`
  );

  const { result } = await res.json();

  let newest = last_synced_at;

  // 3. insert / update
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

    if (doc._updatedAt > newest) {
      newest = doc._updatedAt;
    }
  }

  // 4. update checkpoint
  if (result.length > 0) {
    await sql`
      UPDATE backup_state
      SET last_synced_at = ${newest}
      WHERE id = 'sanity'
    `;
  }

  return Response.json({
    ok: true,
    synced: result.length,
  });
}
