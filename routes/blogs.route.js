// import express from "express";
// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary  from "./cloudinary.config.js";

// import Blog from "../models/blog.model.js";

// // Configure Cloudinary

// const router = express.Router();

// // Configure Multer Storage with Cloudinary
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "blog-images", // Cloudinary folder name
//         allowed_formats: ["jpg", "jpeg", "png"], // Accepted file formats
//     },
// });

// const upload = multer({ storage });

// // Route to Upload Image and Save Blog Data
// router.post("/upload", upload.single("image"), async (req, res) => {
//     try {
//         const { title, author, summary } = req.body;

//         if (!title || !author || !summary) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const existingBlog = await Blog.findOne({ title });
//         if (existingBlog) {
//             return res.status(400).json({ message: "A blog with this title already exists" });
//         }

//         if (!req.file) {
//             return res.status(400).json({ message: "Image upload is required" });
//         }

//         // Extract image URL from uploaded image
//         const imageUrl = req.file.path;

//         // Save to MongoDB
//         const blog = new Blog({
//             title,
//             author,
//             date: new Date(), // Automatically set the date to now
//             summary,
//             image: imageUrl,
//         });

//         await blog.save();
//         res.status(201).json({ message: "Blog uploaded successfully", blog });
//     } catch (error) {
//         console.error("Error uploading blog:", error);
//         res.status(500).json({ message: "Server error", error });
//     }
// });

// export default router;

import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config.js";

import Blog from "../models/blogs.model.js";

const router = express.Router();

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog-images", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"], // Accepted file formats
  },
});

const upload = multer({ storage });

//Delete function from cloudinary
const deleteImage = async (imageUri) => {
  try {
    // Extract the public_id from the image URI
    const urlParts = imageUri.split("/");
    const versionIndex = urlParts.findIndex((part) => part.startsWith("v"));
    const publicIdWithExtension = urlParts.slice(versionIndex + 1).join("/");
    const publicId = publicIdWithExtension.split(".")[0]; // Remove the file extension

    // Call Cloudinary's API to delete the image
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// POST: Create a New Blog
router.post("/upload", async (req, res) => {
  try {
    const { title, author, summary, imageUrl } = req.body;

    if (!title || !author || !summary || !imageUrl) {
      return res
        .status(400)
        .json({ message: "All fields and image URL are required" });
    }

    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res
        .status(400)
        .json({ message: "A blog with this title already exists" });
    }

    // If the image is a URL, no need to upload it to Cloudinary.
    // Validate if the URL is a valid image URL (optional step)

    // Save to MongoDB
    const blog = new Blog({
      title,
      author,
      date: new Date(), // Automatically set the date to now
      summary,
      image: imageUrl, // Store the URL directly
    });

    await blog.save();
    res.status(201).json({ message: "Blog uploaded successfully", blog });
  } catch (error) {
    console.error("Error uploading blog:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET: Retrieve All Blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ message: "Blogs retrieved successfully", blogs });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET: Retrieve a Single Blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog retrieved successfully", blog });
  } catch (error) {
    console.error("Error retrieving blog:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// PUT: Update a Blog by ID
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, author, summary } = req.body;

    if (!title || !author || !summary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update fields
    blog.title = title;
    blog.author = author;
    blog.summary = summary;

    // If a new image is uploaded, replace the existing one
    if (req.file) {
      blog.image = req.file.path;
    }

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// DELETE: Delete a Blog by ID
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // deleteImage(blog.image);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
