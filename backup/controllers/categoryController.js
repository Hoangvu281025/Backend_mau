
import db from "../config/db.js";



export const getCategories = (req, res) => {
  const sql = "SELECT * FROM categories WHERE parent_id IS NULL ORDER BY sort_order ASC, sort_order IS NULL";

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

export const getCateAdmin = (req, res) => {
  const sql = "SELECT * FROM categories WHERE slug NOT IN ('/', 'gioi-thieu', 'mien-bac');";

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};


// 👉 GET DETAIL
export const getcategoriesDetail = (req, res) => {
  const sql = "SELECT * FROM categories ";

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);

    const parents = data.filter((item) => item.parent_id === null);

    const resuft = parents.map((item) => ({
      id: item.id,
      name: item.name,
      Children: data.filter((child) => child.parent_id === item.id)
      .map((child) => ({
        id: child.id,
        name: child.name,
      })),
      
      
    }));
   

    res.json(resuft);
  });
};


// 👉 CREATE POST
export const createPost = (req, res) => {
  const {
    title,
    slug,
    summary,
    content,
    thumbnail,
    category_id
  } = req.body;

  const sql = `
    INSERT INTO posts 
    (title, slug, summary, content, thumbnail, category_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, slug, summary, content, thumbnail, category_id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json("Tạo bài thành công");
    }
  );
};