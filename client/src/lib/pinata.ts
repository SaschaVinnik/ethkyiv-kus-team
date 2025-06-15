export async function pinDisputeWithAttachments(
  data: any,
  attachments: File[]
): Promise<{ metadataUrl: string; fileUrls: string[] }> {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  if (!jwt) throw new Error("Pinata JWT is missing");

  // 1. Загрузка каждого файла
  const fileUrls: string[] = [];
  for (const file of attachments) {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(`Pin file failed: ${JSON.stringify(json)}`);

    const fileUrl = `https://gateway.pinata.cloud/ipfs/${json.IpfsHash}`;
    console.log("📁 File pinned:", fileUrl);
    fileUrls.push(fileUrl);
  }

  // 2. Обогащаем JSON вложениями по правильному пути
  const enriched = {
    ...data,
    factualSummary: {
      ...data.factualSummary,
      attachments: fileUrls, // <-- вот здесь подменяем File[] на string[]
    },
  };

  // 3. Пину JSON
  const jsonForm = {
    pinataContent: enriched,
    pinataMetadata: { name: "dispute_with_attachments.json" },
    pinataOptions: { cidVersion: 1 },
  };

  const res2 = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(jsonForm),
  });

  const json2 = await res2.json();
  if (!res2.ok) throw new Error(`Pin JSON failed: ${JSON.stringify(json2)}`);

  const metadataUrl = `https://gateway.pinata.cloud/ipfs/${json2.IpfsHash}`;
  console.log("🖇️ Metadata pinned:", metadataUrl);

  return { metadataUrl, fileUrls };
}
