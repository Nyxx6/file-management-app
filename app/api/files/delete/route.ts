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
    const { fileId, userId } = await request.json()

    const connection = await pool.getConnection()

    // Vérifier que l'utilisateur est propriétaire du fichier
    const [files] = await connection.execute("SELECT * FROM files WHERE id = ? AND user_id = ?", [fileId, userId])

    if (!files || files.length === 0) {
      connection.release()
      return NextResponse.json({ error: "Fichier non trouvé ou accès refusé" }, { status: 403 })
    }

    // Supprimer le fichier
    await connection.execute("DELETE FROM files WHERE id = ?", [fileId])

    // Enregistrer l'activité
    await connection.execute("INSERT INTO activity_logs (user_id, action, file_id, details) VALUES (?, ?, ?, ?)", [
      userId,
      "delete_file",
      fileId,
      "Fichier supprimé",
    ])

    connection.release()

    return NextResponse.json({ success: true, message: "Fichier supprimé" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
