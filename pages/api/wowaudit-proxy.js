export default async function handler(req, res) {
  const raid = req.query.raid;
  const apiKey =
    "43b8bea3357ac3a65a9a75ccd363ec85b722006e6efeaf92f6c1f9e38d8cab30";

  const url = `https://wowaudit.com/v1/raids/${raid}?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data from WoW Audit`);

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
