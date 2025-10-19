import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sonatrach_files",
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const category = formData.get("category") as string

    if (!file || !userId) {
      return NextResponse.json({ error: "Fichier ou utilisateur manquant" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    // Sauvegarder le fichier
    const fileName = `${Date.now()}-${file.name}`
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // Enregistrer dans la base de données
    const connection = await pool.getConnection()
    await connection.execute(
      "INSERT INTO files (user_id, file_name, file_path, file_size, file_type, category) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, file.name, `/uploads/${fileName}`, file.size, file.type, category],
    )
    connection.release()

    return NextResponse.json({
      success: true,
      message: "Fichier uploadé avec succès",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
