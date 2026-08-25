import db from "../config/db.js";
import slugify from 'slugify'
import crypto from "crypto";
// 👉 GET ALL POSTS



export const getpostHome = async (req, res) => {
  try {
    const dbPromise = db.promise();
    const select = " SELECT p.name, p.slug, p.summary, p.thumbnail, p.created_at, c.slug AS category_slug, parent.slug AS parent_slug ";
    const [
      [featured],
      [latest],
      [mienBac],
      [mienTrung],
      [mienNam],
    ] = await Promise.all(
      [
        dbPromise.query(
          `${select} 
          FROM posts p 
          JOIN categories c  ON p.category_id = c.id  
          LEFT JOIN categories parent ON c.parent_id = parent.id
          ORDER BY p.views DESC LIMIT 4
          `
        ),
        dbPromise.query(
          `${select} 
          FROM posts p JOIN categories c ON p.category_id = c.id  
          LEFT JOIN categories parent ON c.parent_id = parent.id
          ORDER BY p.created_at DESC LIMIT 4
          `
        ),
        dbPromise.query(
          `${select} 
          FROM posts p 
          JOIN categories c  ON p.category_id = c.id  
          LEFT JOIN categories parent ON c.parent_id = parent.id
          WHERE parent.slug = 'mien-bac'
          ORDER BY p.created_at DESC LIMIT 4
          `
        ),
        dbPromise.query(
          `${select} 
          FROM posts p 
          JOIN categories c  ON p.category_id = c.id  
          LEFT JOIN categories parent ON c.parent_id = parent.id
          WHERE 
            c.slug = 'mien-trung' 
            OR parent.slug = 'mien-trung'
          ORDER BY p.created_at DESC LIMIT 4
          `
        ),
        dbPromise.query(
          `${select} 
          FROM posts p 
          JOIN categories c  ON p.category_id = c.id  
          LEFT JOIN categories parent ON c.parent_id = parent.id
          WHERE 
            c.slug = 'mien-nam' 
            OR parent.slug = 'mien-nam'
          ORDER BY p.created_at DESC LIMIT 4
          `
        ),

      ]);

    res.json({
      featured,
      latest,
      regions: [
        { group: 'Miền Bắc', posts: mienBac },
        { group: 'Miền Trung', posts: mienTrung },
        { group: 'Miền Nam', posts: mienNam },
      ],
    });
  } catch (error) {
    res.status(500).json(error);
  }
};



export const getpostAdmin = async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) AS total,
        COUNT(CASE WHEN region = 'mien-bac' THEN 1 END) AS bac,
        COUNT(CASE WHEN region = 'mien-trung' THEN 1 END) AS trung,
        COUNT(CASE WHEN region = 'mien-nam' THEN 1 END) AS nam
      FROM posts;
    `;

    db.query(query, (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data[0]); 
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//admin
export const getpostAdmindata = async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.name AS category_name, parent.name AS parent_name
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      left JOIN categories parent ON c.parent_id = parent.id
      ORDER BY p.created_at DESC
    `;
   
    db.query(query, (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    });

  } catch (error) {
    res.status(500).json(error);
  }
};
//home
export const getposts = async (req, res) => {
  try {
    const { region } = req.query;

    if (!region) {
      return res.status(400).json({
        message: "Thiếu region (vd: ?region=mien-bac)"
      });
    }

    const query = `
      SELECT 
        p.*,
        c.name AS category_name,
        c.slug AS category_slug,
        parent.name AS region_name,
        parent.slug AS parent_slug
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN categories parent ON c.parent_id = parent.id
      WHERE p.region = ?
      ORDER BY p.created_at ASC
    `;

    db.query(query, [region], (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.length === 0) {
        return res.json({
          message: "Không có bài viết cho miền này"
        });
      }

      // ✅ Lấy danh sách category theo thứ tự xuất hiện
      const categories = [...new Set(data.map(item => item.category_name))];

      // ✅ Gom bài theo category
      const result = categories.map(cate => ({
        group: cate,
        posts: data.filter(item => item.category_name === cate)
      }));

      res.json(result);
    });

  } catch (error) {
    res.status(500).json(error);
  }
};


// 👉 GET DETAIL
export const getPostDetail = (req, res) => {
  const { slug } = req.params;

  // 🔥 lấy IP thật (ưu tiên proxy)
  const rawIP =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  // 🔥 mã hóa IP
  const ip = crypto
    .createHash("sha256")
    .update(rawIP)
    .digest("hex");

  // 1. lấy bài viết
  const getPostSql = "SELECT * FROM posts WHERE slug = ?";

  db.query(getPostSql, [slug], (err, data) => {
    if (err) return res.status(500).json(err);

    const post = data[0];
    if (!post) return res.status(404).json({ message: "Bài viết không tồn tại" });

    // 2. check đã xem hôm nay chưa (dùng hashIP)
    const checkSql = `
      SELECT id FROM post_views
      WHERE post_id = ? AND ip = ?
      AND DATE(viewed_at) = CURDATE()
    `;

    db.query(checkSql, [post.id, ip], (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length === 0) {

        db.query(
          "UPDATE posts SET views = views + 1 WHERE id = ?",
          [post.id]
        );

        // lưu lịch sử view
        db.query(
          "INSERT INTO post_views (post_id, ip) VALUES (?, ?)",
          [post.id, ip]
        );
      }

      // trả dữ liệu bài viết
      res.json(post);
    });
  });
};


// 👉 CREATE POST
export const createPost = (req, res) => {
  const {
    name,
    summary,
    content,
    thumbnail,
    public_id_img,
    published_at,
    region,
    category_id,
    user_id
  } = req.body;

  const slug = slugify(name, { lower: true, strict: true });

  const sql = `
    INSERT INTO posts 
    (name, slug, summary, content, thumbnail, public_id_img, region, category_id, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, slug, summary, content, thumbnail, public_id_img, region, category_id, user_id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json("Tạo bài thành công");
    }
  );
};

export const updatePost = (req, res) => {
  const { slug } = req.params;
  const {
    name,
    summary,
    content,
    thumbnail,
    public_id_img,
    published_at,
    region,
    category_id
  } = req.body;

  const updateSlug = slugify(name, { lower: true, strict: true });
  const sql = `
    UPDATE posts
    SET name = ?, slug = ?, summary = ?, content = ?, thumbnail = ?, public_id_img = ?,  region = ?, category_id = ?
    WHERE slug = ?
  `;

  db.query(
    sql,
    [name, updateSlug, summary, content, thumbnail, public_id_img, region, category_id, slug],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json("Cập nhật bài thành công");
    }
  );
};

export const deletePost = (req, res) => {
  const { slug } = req.params;
  const sql = "DELETE FROM posts WHERE slug = ?";

  db.query(sql, [slug], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json("Xóa bài thành công");
  }
);
}