import json
import sqlite3
import os
import sys

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(base_dir, 'scripts_extended.json')
    db_path = os.path.join(base_dir, 'passages.db')
    server_db_path = os.path.join(base_dir, 'server', 'passages.db')

    print(f"Reading scripts from: {json_path}")
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found!")
        sys.exit(1)

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data)} scripts to insert.")

    # Function to populate a sqlite db
    def populate_db(target_path):
        conn = sqlite3.connect(target_path)
        cursor = conn.cursor()

        # Create passages table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS passages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                script_key TEXT UNIQUE,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                word_count INTEGER,
                char_count INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # Create index on category and title for fast lookup
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_category ON passages(category);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_title ON passages(title);")

        inserted = 0
        updated = 0

        for key, item in data.items():
            category = item.get('category', '').strip()
            title = item.get('title', '').strip()
            content = item.get('content', '').strip()
            word_count = len(content.split())
            char_count = len(content)

            cursor.execute("""
                INSERT INTO passages (script_key, category, title, content, word_count, char_count)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(script_key) DO UPDATE SET
                    category = excluded.category,
                    title = excluded.title,
                    content = excluded.content,
                    word_count = excluded.word_count,
                    char_count = excluded.char_count;
            """, (key, category, title, content, word_count, char_count))
            inserted += 1

        conn.commit()

        # Verification
        cursor.execute("SELECT COUNT(*) FROM passages;")
        count = cursor.fetchone()[0]

        cursor.execute("SELECT category, COUNT(*) FROM passages GROUP BY category ORDER BY COUNT(*) DESC;")
        category_counts = cursor.fetchall()

        conn.close()
        return count, category_counts

    # Populate main passages.db
    count, category_counts = populate_db(db_path)
    print(f"\n[OK] Successfully populated '{db_path}' with {count} passages.")

    # Also populate server/passages.db so it is available to the server directory if needed
    os.makedirs(os.path.join(base_dir, 'server'), exist_ok=True)
    server_count, _ = populate_db(server_db_path)
    print(f"[OK] Successfully synced '{server_db_path}' with {server_count} passages.")

    print("\nBreakdown by Category:")
    for cat, c in category_counts:
        print(f"  - {cat}: {c} passages")

if __name__ == '__main__':
    main()
