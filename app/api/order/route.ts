import { delivery, menu, priceOf, sizes, type Size } from "@/lib/data";

// Замовлення з сайту надсилаються в Telegram.
// На Vercel додати змінні оточення TELEGRAM_BOT_TOKEN і TELEGRAM_CHAT_ID.

type Line = { id: unknown; size?: unknown; qty: unknown };

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Некоректний запит" }, { status: 400 });
  }

  const name = str(body.name, 60);
  const phone = str(body.phone, 20);
  const address = str(body.address, 160);
  const comment = str(body.comment, 300);
  const mode = body.mode === "pickup" ? "pickup" : "delivery";

  if (!name) return Response.json({ ok: false, error: "Вкажіть ім'я" }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 10) return Response.json({ ok: false, error: "Перевірте номер телефону" }, { status: 400 });
  if (mode === "delivery" && !address) return Response.json({ ok: false, error: "Вкажіть адресу доставки" }, { status: 400 });

  // ціни рахуємо на сервері за меню — не довіряємо тому, що прийшло з браузера
  const lines = (Array.isArray(body.items) ? (body.items as Line[]) : []).slice(0, 50).flatMap((l) => {
    const item = menu.find((m) => m.id === l.id);
    const size = sizes.some((s) => s.id === l.size) ? (l.size as Size) : undefined;
    const qty = Number(l.qty);
    const price = item && priceOf(item, size);
    if (!item || !price || !Number.isInteger(qty) || qty < 1 || qty > 50) return [];
    return [{ name: item.name, size, qty, sum: price * qty }];
  });
  if (lines.length === 0) return Response.json({ ok: false, error: "Кошик порожній" }, { status: 400 });

  const total = lines.reduce((s, l) => s + l.sum, 0);
  const fee = mode === "delivery" && total < delivery.freeFrom ? delivery.price : 0;

  const text = [
    "🍕 Нове замовлення з сайту",
    "",
    ...lines.map((l) => `• ${l.name}${l.size ? ` ${l.size} см` : ""} × ${l.qty} — ${l.sum} ₴`),
    "",
    `Сума: ${total} ₴${fee ? ` + доставка ${fee} ₴` : ""}`,
    `До сплати: ${total + fee} ₴`,
    "",
    `👤 ${name}`,
    `📞 ${phone}`,
    mode === "delivery" ? `🛵 Доставка: ${address}` : "🏠 Самовивіз",
    comment ? `💬 ${comment}` : "",
  ]
    .filter((s, i, a) => s !== "" || a[i - 1] !== "")
    .join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // демо-режим: бот ще не підключений, замовлення лише пишемо в лог
    console.log(text);
    return Response.json({ ok: true, demo: true });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) throw new Error(`Telegram ${res.status}`);
  } catch (err) {
    console.error("Order send failed:", err);
    return Response.json({ ok: false, error: "Не вдалося надіслати. Зателефонуйте нам, будь ласка." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
