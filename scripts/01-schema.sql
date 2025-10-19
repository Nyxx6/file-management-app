-- Créer la base de données
CREATE DATABASE IF NOT EXISTS sonatrach_files;
USE sonatrach_files;

-- Table des utilisateurs
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'secretaire', 'user') DEFAULT 'user',
  department VARCHAR(255),
  phone VARCHAR(20),
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  two_fa_secret VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Table des dossiers
CREATE TABLE folders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  parent_id INT,
  created_by INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_parent_id (parent_id),
  INDEX idx_created_by (created_by)
);

-- Table des fichiers
CREATE TABLE files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  folder_id INT,
  user_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  file_type VARCHAR(100),
  category VARCHAR(100),
  description TEXT,
  version INT DEFAULT 1,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_folder_id (folder_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Table des versions de fichiers
CREATE TABLE file_versions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  file_id INT NOT NULL,
  version_number INT NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_version (file_id, version_number),
  INDEX idx_file_id (file_id)
);

-- Table des permissions
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  file_id INT NOT NULL,
  user_id INT,
  role VARCHAR(50),
  permission_type ENUM('view', 'download', 'edit', 'delete', 'share') DEFAULT 'view',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_permission (file_id, user_id, permission_type),
  INDEX idx_file_id (file_id),
  INDEX idx_user_id (user_id)
);

-- Table des logs d'activité
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(100),
  file_id INT,
  folder_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_action (action)
);

-- Table des signalements
CREATE TABLE reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  file_id INT NOT NULL,
  reported_by INT NOT NULL,
  reason VARCHAR(255),
  description TEXT,
  status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Table des sessions 2FA
CREATE TABLE two_fa_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- Insérer des utilisateurs de test
INSERT INTO users (email, password, full_name, role, department) 
VALUES 
  ('admin@sonatrach.com', 'admin123', 'Admin SONATRACH', 'admin', 'IT'),
  ('secretaire@sonatrach.com', 'sec123', 'Secrétaire SONATRACH', 'secretaire', 'RH'),
  ('user@sonatrach.com', 'user123', 'Utilisateur SONATRACH', 'user', 'Operations');
