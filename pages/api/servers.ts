import axios from "axios";
import { getCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "application/json"); // Ensure JSON response
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const accessToken = getCookie("accessToken", { req, res });

  if (!accessToken) {
    return res.status(401).json({ error: "Token not found" });
  }

  const { region } = req.query;

  if (!region) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await axios.get(
      `https://${region}.api.blizzard.com/data/wow/realm/index`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          namespace: `dynamic-${region}`,
          locale: "en_US",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("API fetch error:", error);
    if (error.response && error.response.status === 404) {
      return res
        .status(404)
        .json({ error: 404, message: "Servers not found." });
    }
    return res.status(500).json({ error: "Failed to fetch servers data" });
  }
}
