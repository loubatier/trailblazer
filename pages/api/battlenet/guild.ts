import axios from "axios";
import { getCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Guild: Unauthorized" });
  }

  const accessToken = getCookie("accessToken", { req, res });

  if (!accessToken) {
    return res.status(401).json({ error: "Guild: Token not found" });
  }

  const { region, server, guild } = req.query;

  if (!region || !server || !guild) {
    return res
      .status(400)
      .json({ error: "Guild: Missing required parameters" });
  }

  try {
    const response = await axios.get(
      `https://${region}.api.blizzard.com/data/wow/guild/${server}/${guild}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          namespace: `profile-${region}`,
          locale: "en_US",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response.status === 404) {
      return res.status(404).json({ error: "Guild: Does not exist." });
    }
    return res.status(500).json({ error: "Guild: Failed to fetch data" });
  }
}
