export async function GET() {
  try {
    const res = await fetch(
      "https://3l9bn3l1.api.sanity.io/v2023-10-01/data/query/production?query=*",
      {
        headers: {
          Authorization: `Bearer ${process.env.SANITY_TOKEN}`,
        },
      }
    );

    const json = await res.json();

    console.log("FULL RESPONSE:", json);
    console.log("RESULT TYPE:", typeof json.result);
    console.log("IS ARRAY:", Array.isArray(json.result));

    if (!Array.isArray(json.result)) {
      return Response.json(
        { error: "Sanity result is not an array", json },
        { status: 500 }
      );
    }

    for (const doc of json.result) {
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
  } catch (err: any) {
    console.error("SYNC ERROR:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
