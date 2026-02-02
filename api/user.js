// api/user.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "No ID provided" });

  try {
    const discordRes = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
    });

    if (!discordRes.ok) throw new Error("User not found");

    const data = await discordRes.json();
    res.status(200).json({
      id: data.id,
      username: data.username,
      global_name: data.global_name,
      avatar: data.avatar
        ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
        : null,
      banner: data.banner
        ? `https://cdn.discordapp.com/banners/${data.id}/${data.banner}.png`
        : null,
      accent_color: data.accent_color ? `#${data.accent_color.toString(16)}` : null,
      created_at: new Date(
        parseInt((BigInt(data.id) >> 22n) + 1420070400000)
      ).toISOString(),
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
