export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  const r = await fetch(`https://discord.com/api/v10/users/${id}`, {
    headers: {
      Authorization: `Bot ${process.env.BOT_TOKEN}`
    }
  });

  if (!r.ok) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = await r.json();

  const createdAt = new Date(
    Number(BigInt(user.id) >> 22n) + 1420070400000
  );

  res.status(200).json({
    id: user.id,
    username: user.username,
    global_name: user.global_name,
    avatar: user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
      : null,
    banner: user.banner
      ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=1024`
      : null,
    accent_color: user.accent_color
      ? `#${user.accent_color.toString(16).padStart(6, "0")}`
      : null,
    created_at: createdAt
  });
}
