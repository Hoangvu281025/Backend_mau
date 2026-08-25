import db from "../config/db.js";


// 👉 GET ALL BANNERS
export const getBanner = (req, res) => {
  const sql = "SELECT * FROM banners WHERE is_active = 1 ";

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

export const getBannerAdmin = (req, res) => {
  const sql = "SELECT * FROM banners ";

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};


  // // 👉 GET DETAIL
  // export const getPostDetail = (req, res) => {
  //   const { slug } = req.params;

  //   const sql = "SELECT * FROM posts WHERE slug = ?";

  //   db.query(sql, [slug], (err, data) => {
  //     if (err) return res.status(500).json(err);
  //     res.json(data[0]);
  //   });
  // };


// 👉 CREATE BANNER
export const createBanner = (req, res) => {
  const {image , public_id} = req.body;

  const sql = `
    INSERT INTO banners 
    (image , public_id)
    VALUES (?,?)
  `;

  db.query(
    sql,
    [image, public_id],
    (err, data) => {
      if (err) return res.status(500).json("Lỗi server");
      res.json("Tạo banner thành công");
    }
  );
};


export const updateBanner = (req, res) => {
  let {id, is_active } = req.body;

  // nếu bật 1 cái → tắt hết cái khác
  const resetSql = "UPDATE banners SET is_active = 0";
  const updateSql = "UPDATE banners SET is_active = ? WHERE id = ?";
// 1 là hoạt động 0 là off 
  if (is_active == 1) {
    db.query(resetSql, (err) => {
      if (err) return res.status(500).json("Lỗi reset");

      db.query(updateSql, [1, id], (err2) => {
        if (err2) return res.status(500).json("Lỗi update");

        return res.json("Đã kích hoạt banner này, các banner khác đã tắt");
      });
    });
  } else {
    // nếu tắt thì chỉ tắt riêng nó thôi
    db.query(updateSql, [0, id], (err) => {
      if (err) return res.status(500).json("Lỗi update");

      return res.json("Đã tắt banner");
    });
  }
};
// export const updateBanner = (req, res) => {
//   let {id, is_active } = req.body;
//   is_active === 1 ? is_active = 1 : is_active = 0;
//   const updateSql = "UPDATE banners SET is_active = ? WHERE id = ?";
  
//     db.query(updateSql, [is_active, id], (err) => {
//       if (err) return res.status(500).json("Lỗi update");

//       return res.json("Đã tắt banner");
//     });
//   };