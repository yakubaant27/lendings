const ALLOWED_ORIGIN = 'https://sladena.yakuba-ant27.workers.dev';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
    }

    const name = String(data.name || '').trim().slice(0, 200);
    const phone = String(data.phone || '').trim().slice(0, 50);
    const comment = String(data.comment || '').trim().slice(0, 1000);

    if (!name || !phone) {
      return jsonResponse({ ok: false, error: 'Укажите имя и телефон' }, 400);
    }

    const lines = ['🎂 Новый заказ с сайта Сластёна', `Имя: ${name}`, `Телефон: ${phone}`];
    if (comment) lines.push(`Комментарий: ${comment}`);

    const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines.join('\n') }),
    });

    if (!telegramResponse.ok) {
      return jsonResponse({ ok: false, error: 'Не удалось отправить в Telegram' }, 502);
    }

    return jsonResponse({ ok: true });
  },
};
