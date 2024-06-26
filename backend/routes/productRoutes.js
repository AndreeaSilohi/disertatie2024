import express from "express";
import Product from "../modelss/productModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// productRouter.post(
//   "/",
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const {
//       name,
//       slug,
//       image,
//       price,
//       category,
//       stoc,
//       rating,
//       numReviews,
//       description,
//       additional,
//     } = req.body;

//     const newProduct = new Product({
//       name,
//       slug,
//       image,
//       price,
//       category,
//       stoc,
//       rating,
//       numReviews,
//       description,
//       additional,
//     });

//     const product = await newProduct.save();
//     res.status(201).send({ message: "Product Created", product });
//   })
// );


productRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const lastProduct = await Product.findOne().sort({ createdAt: -1 });
    let lastSlugNumericPart = 0;
    if (lastProduct) {
      // Extract the numeric part from the last product's slug
      const lastSlugParts = lastProduct.slug.split("-");
      lastSlugNumericPart = parseInt(lastSlugParts[lastSlugParts.length - 1]);
    }
    
    // Increment the numeric part by one
    const newSlugNumericPart = lastSlugNumericPart + 1;

    // Construct the new slug
    const newSlug = `${newSlugNumericPart}`;

    const {
      name,
      image,
      price,
      category,
      stoc,
      rating,
      numReviews,
      description,
      additional,
    } = req.body;

    const newProduct = new Product({
      name,
      slug: newSlug, // Assign the newly generated slug
      image,
      price,
      category,
      stoc,
      rating:0,
      numReviews:0,
      description,
      additional,
    });

    const product = await newProduct.save();
    res.status(201).send({ message: "Product Created", product });
  })
);

productRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      // product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.stoc = req.body.stoc;
      product.description = req.body.description;
      product.additional = req.body.additional;
      await product.save();

      res.send({ message: "Product updated" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.send({ message: "Product Deleted" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
);

productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submited a review" });
      }
      console.log(req.body);
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
        profilePhoto: req.body.profilePhoto,
      
      };
      console.log(review.profilePhoto)

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: "Review created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
);

const PAGE_SIZE = 8;
productRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    console.log(req)
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
            // 1-50
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);


productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    console.log(categories);
    res.send(categories);
  })
);

productRouter.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

productRouter.put(
  "/:slug/reduceStock",
  expressAsyncHandler(async (req, res) => {
    console.log(req.params.id)
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      product.stoc -= req.body.quantity;
      await product.save();
      res.send({ message: "Stock reduced successfully" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
);

export default productRouter;
