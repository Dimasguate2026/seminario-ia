export default async function handler(req, res) {
  // 1. Validar que la petición sea POST
  if (req.method !== 'POST') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  // 2. Extraer datos del cuerpo de la solicitud
  // Nota: 'email' y 'token' deben coincidir con los nombres que envíes desde tu formulario
  const { email, token } = req.body;

  // --- CONFIGURACIÓN PRIVADA ---
  const TOKEN_VALIDO = "SEMIA-NEXUS-DIA1-7G9B";
  const LISTA_BLANCA = [
    "nexusintegral.2026@gmail.com",
    // Agrega aquí los correos adicionales entre comillas y separados por comas
  ];

  // 3. Validación del Token
  if (token !== TOKEN_VALIDO) {
    return res.status(401).json({ 
      exito: false, 
      mensaje: "El token no es válido o ya expiró." 
    });
  }

  // 4. Validación de la Lista Blanca (Email)
  if (!LISTA_BLANCA.includes(email)) {
    return res.status(403).json({ 
      exito: false, 
      mensaje: "Este correo electrónico no está autorizado." 
    });
  }

  // 5. Si todo es correcto, conceder acceso
  return res.status(200).json({ 
    exito: true, 
    mensaje: "Acceso concedido. Bienvenido al seminario." 
  });
}
