CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE, -- 100文字、ユニークである、空は許さない
    password VARCHAR(255) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE, /* ログインし、オンラインかどうか */
    is_registered BOOLEAN DEFAULT FALSE /* 本登録済みかどうか */
);

-- インデックスの作成
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,  -- saltカラムを追加
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lastname VARCHAR(50) NOT NULL, /* 姓 */
    firstname VARCHAR(50) NOT NULL, /* 名前 */
    birthdate DATE NOT NULL, /* 生年月日 */
    is_gps BOOLEAN DEFAULT FALSE, /* 位置情報を利用するか */
    gender ENUM('male', 'female') NOT NULL DEFAULT 'male', /* 性別 */
    sexual_orientation ENUM('heterosexual', 'homosexual', 'bisexual') NOT NULL DEFAULT 'bisexual', /* 性的指向 */
    eria ENUM(
        'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
        'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
        'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano',
        'Gifu', 'Shizuoka', 'Aichi', 'Mie',
        'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama',
        'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
        'Tokushima', 'Kagawa', 'Ehime', 'Kochi',
        'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
    ) NOT NULL DEFAULT 'Tokyo', /* 都道府県 */
    self_intro VARCHAR(300) NOT NULL DEFAULT '', /* 自己紹介 */
    profile_image_path1 VARCHAR(255) DEFAULT NULL, /* プロフィール画像のパス */
    FOREIGN KEY (user_id) REFERENCES users(id)
);