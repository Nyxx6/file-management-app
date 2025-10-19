import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sonatrach_files",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const connection = await pool.getConnection()
    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ? AND is_active = TRUE", [email])
    connection.release()

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const user = rows[0]

    if (user.password !== password) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    if (user.two_fa_enabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const connection2 = await pool.getConnection()
      await connection2.execute(
        "INSERT INTO two_fa_sessions (user_id, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
        [user.id, code],
      )
      connection2.release()

      return NextResponse.json({
        success: true,
        requires_2fa: true,
        user_id: user.id,
        message: "Code 2FA envoyé",
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
