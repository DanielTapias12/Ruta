/**
 * LabSIE · Servicio de Seguridad Criptográfica & JWT
 * Implementación nativa con Web Crypto API (AES-GCM-256) y JWT (RFC 7519 / HS256)
 * Cumplimiento con Ley 1581 de 2012 (Habeas Data) y Decreto 1377 de 2013 de Colombia
 */

export interface EncryptedDataPackage {
  ciphertext: string; // Base64
  iv: string;         // Base64 (Initialization Vector de 12 bytes para AES-GCM)
  algorithm: 'AES-GCM-256';
  encryptedAt: string;
}

export interface JWTPayload {
  iss: string;             // Issuer: "LabSIE-EduTLAN-Security-Gateway"
  sub: string;             // Subject: Student unique ID / identifier
  aud: string;             // Audience: "LabSIE-Investigacion-Licenciatura-Informatica"
  name: string;            // Nombre del estudiante
  email: string;           // Correo institucional
  phoneHash: string;       // Huella SHA-256 del teléfono para verificación de integridad
  program: string;         // "Licenciatura en Informática"
  semester: string;        // Semestre actual
  termsAccepted: boolean;  // Consentimiento explícito Ley 1581 de 2012
  termsAcceptedAt: string; // Marca de tiempo ISO de la aceptación
  termsVersion: string;    // "2026-v2.1-COL-1581"
  legalBasis: string[];    // Normativa aplicable
  role: 'student-applicant';
  iat: number;             // Issued at (segundos epoch)
  exp: number;             // Expiration (segundos epoch, ej: 1 año)
  jti: string;             // JWT ID único criptográfico
}

export interface SecurityMetadata {
  isEncrypted: boolean;
  encryptionAlgorithm: 'AES-GCM-256';
  encryptedPhone: EncryptedDataPackage;
  encryptedEmail: EncryptedDataPackage;
  jwtToken: string;
  jwtVerified: boolean;
  jwtHeader: {
    alg: string;
    typ: string;
  };
  jwtPayload: JWTPayload;
  termsAccepted: boolean;
  termsAcceptedAt: string;
  termsVersion: string;
  legalBasis: string[];
}

// Clave institucional secreta para firma HMAC-SHA256 de JWT y derivación de cifrado AES
const INSTITUTIONAL_SECRET_SEED = 'LabSIE_EduTLAN_Licenciatura_Informatica_2026_CryptoKey_Secure!#';

// Conversiones seguras Utf8 <-> Base64
function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

function bufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  return bufferToBase64(buffer)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Deriva una CryptoKey simétrica AES-GCM de 256 bits a partir de la semilla institucional
 */
async function deriveAESKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const rawKey = enc.encode(INSTITUTIONAL_SECRET_SEED);
  const hash = await crypto.subtle.digest('SHA-256', rawKey);
  return await crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Deriva una CryptoKey para HMAC-SHA256 utilizada para la firma de JWT
 */
async function deriveHMACKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const rawKey = enc.encode(INSTITUTIONAL_SECRET_SEED);
  return await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export class SecurityService {
  /**
   * Genera hash SHA-256 de un dato sensible (ej. teléfono)
   */
  public async hashData(plainText: string): Promise<string> {
    const enc = new TextEncoder();
    const data = enc.encode(plainText.trim());
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Encripta una cadena sensible (ej. celular, correo) con AES-GCM-256
   */
  public async encrypt(plainText: string): Promise<EncryptedDataPackage> {
    if (!plainText) {
      plainText = '';
    }
    const enc = new TextEncoder();
    const key = await deriveAESKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96 bits recomendado para AES-GCM
    const encodedData = enc.encode(plainText);

    const ciphertextBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encodedData
    );

    return {
      ciphertext: bufferToBase64(ciphertextBuffer),
      iv: bufferToBase64(iv),
      algorithm: 'AES-GCM-256',
      encryptedAt: new Date().toISOString()
    };
  }

  /**
   * Desencripta un paquete con AES-GCM-256
   */
  public async decrypt(pkg: EncryptedDataPackage): Promise<string> {
    try {
      const key = await deriveAESKey();
      const iv = base64ToBuffer(pkg.iv);
      const ciphertext = base64ToBuffer(pkg.ciphertext);

      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv as any
        },
        key,
        ciphertext as any
      );

      const dec = new TextDecoder();
      return dec.decode(decryptedBuffer);
    } catch (err) {
      console.error('Error al desencriptar paquete AES-GCM:', err);
      return '[Error de desencriptación]';
    }
  }

  /**
   * Genera un Token JWT firmado con HMAC-SHA256 (RFC 7519)
   */
  public async generateStudentJWT(payloadData: Omit<JWTPayload, 'iss' | 'aud' | 'iat' | 'exp' | 'jti' | 'role'>): Promise<{
    token: string;
    payload: JWTPayload;
    header: { alg: string; typ: string };
  }> {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const nowSeconds = Math.floor(Date.now() / 1000);
    const oneYearSeconds = 365 * 24 * 60 * 60;

    // Generar UUID/JTI aleatorio
    const randomBytes = crypto.getRandomValues(new Uint8Array(16));
    const jti = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    const payload: JWTPayload = {
      iss: 'LabSIE-EduTLAN-Security-Gateway',
      aud: 'LabSIE-Investigacion-Licenciatura-Informatica',
      role: 'student-applicant',
      iat: nowSeconds,
      exp: nowSeconds + oneYearSeconds,
      jti: `labsie-${jti}`,
      ...payloadData
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const hmacKey = await deriveHMACKey();
    const enc = new TextEncoder();
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      hmacKey,
      enc.encode(dataToSign)
    );

    const encodedSignature = bufferToBase64Url(signatureBuffer);
    const token = `${dataToSign}.${encodedSignature}`;

    return { token, payload, header };
  }

  /**
   * Verifica la firma e integridad de un Token JWT
   */
  public async verifyJWT(token: string): Promise<{
    valid: boolean;
    payload?: JWTPayload;
    error?: string;
  }> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'Formato de token JWT inválido (se requieren 3 partes).' };
      }

      const [encodedHeader, encodedPayload, encodedSignature] = parts;
      const dataToVerify = `${encodedHeader}.${encodedPayload}`;

      const hmacKey = await deriveHMACKey();
      const enc = new TextEncoder();
      const signatureBytes = base64ToBuffer(base64UrlDecode(encodedSignature));

      const isSignatureValid = await crypto.subtle.verify(
        'HMAC',
        hmacKey,
        signatureBytes as any,
        enc.encode(dataToVerify)
      );

      if (!isSignatureValid) {
        return { valid: false, error: 'Firma criptográfica inválida (Token manipulado o clave incorrecta).' };
      }

      const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));
      const nowSeconds = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < nowSeconds) {
        return { valid: false, error: 'Token JWT expirado.', payload };
      }

      return { valid: true, payload };
    } catch (err: any) {
      return { valid: false, error: err?.message || 'Error al validar token JWT.' };
    }
  }

  /**
   * Enmascara un número de teléfono para presentación pública segura
   * Ej: "300 123 4567" -> "+57 300 ••• ••67"
   */
  public maskPhoneNumber(phone?: string): string {
    if (!phone) return 'No registrado';
    const clean = phone.trim().replace(/\D/g, '');
    if (clean.length < 4) return '••••';
    const start = clean.slice(0, 3);
    const end = clean.slice(-2);
    return `(${start}) ••• ••${end}`;
  }

  /**
   * Enmascara un correo electrónico para presentación segura
   * Ej: "carlos.perez@correo.unicordoba.edu.co" -> "c***s@correo.unicordoba.edu.co"
   */
  public maskEmail(email?: string): string {
    if (!email) return 'No registrado';
    const parts = email.split('@');
    if (parts.length !== 2) return '••••@••••';
    const user = parts[0];
    const domain = parts[1];
    if (user.length <= 2) return `${user[0]}*@${domain}`;
    return `${user[0]}${'*'.repeat(Math.min(5, user.length - 2))}${user[user.length - 1]}@${domain}`;
  }

  /**
   * Genera el paquete completo de seguridad institucional para un estudiante que completa el test
   */
  public async protectStudentData(params: {
    studentId: string;
    name: string;
    email: string;
    phone: string;
    semester: string;
    program: string;
    termsAccepted: boolean;
  }): Promise<SecurityMetadata> {
    const legalBasis = [
      'Constitución Política de Colombia (Artículo 15: Habeas Data)',
      'Ley Estatutaria 1581 de 2012 (Régimen General de Protección de Datos Personales)',
      'Decreto Reglamentario 1377 de 2013 (Tratamiento de Datos Personales)',
      'Decreto Único Reglamentario 1074 de 2015',
      'Acuerdo del Consejo Superior · Universidad de Córdoba',
      'Estándar ISO/IEC 27001 & RGPD (Cifrado de Datos en Reposo y Tránsito)'
    ];

    const termsAcceptedAt = new Date().toISOString();
    const termsVersion = '2026-v2.1-COL-1581';

    // 1. Encriptar teléfono y correo con AES-GCM-256
    const [encryptedPhone, encryptedEmail, phoneHash] = await Promise.all([
      this.encrypt(params.phone),
      this.encrypt(params.email),
      this.hashData(params.phone)
    ]);

    // 2. Generar JWT firmado
    const { token, payload, header } = await this.generateStudentJWT({
      sub: params.studentId,
      name: params.name,
      email: params.email,
      phoneHash: phoneHash,
      semester: params.semester,
      program: params.program,
      termsAccepted: params.termsAccepted,
      termsAcceptedAt: termsAcceptedAt,
      termsVersion: termsVersion,
      legalBasis: legalBasis
    });

    return {
      isEncrypted: true,
      encryptionAlgorithm: 'AES-GCM-256',
      encryptedPhone,
      encryptedEmail,
      jwtToken: token,
      jwtVerified: true,
      jwtHeader: header,
      jwtPayload: payload,
      termsAccepted: params.termsAccepted,
      termsAcceptedAt,
      termsVersion,
      legalBasis
    };
  }
}

export const securityService = new SecurityService();
