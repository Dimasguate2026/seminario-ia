export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { email, token } = req.body;

    // --- CONFIGURACIÓN PRIVADA ---
    const TOKEN_VALIDO = "SEMIA-NEXUS-DIA1-7G9B"; // El que generó tu app
    const LISTA_BLANCA = [
         // Añade aquí tus 50 correos
    ];

    // 1. Validar el Token
    if (token !== TOKEN_VALIDO) {
        return res.status(401).json({ success: false, message: "El token es inválido o ya expiró." });
    }

    // 2. Validar el Correo (Lista Blanca)
    if (!LISTA_BLANCA.includes(email.toLowerCase())) {
        return res.status(403).json({ success: false, message: "Este correo no se encuentra registrado para el seminario." });
    }

    try {
        // 3. Obtener Token de Zoom (Usa tus variables de entorno de Vercel)
        const auth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
        const zoomTokenRes = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`, {
            method: 'POST',
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const zoomTokenData = await zoomTokenRes.json();

        // 4. Registrar en la reunión de Zoom
        const meetingId = "83356385277"; // Cambia esto por tu ID de reunión
        const registrationRes = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}/registrants`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${zoomTokenData.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, first_name: "Pastor", last_name: "Inscrito" })
        });

        const regData = await registrationRes.json();
        
        return res.status(200).json({ success: true, join_url: regData.join_url });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error interno al conectar con Zoom." });
    }

}

