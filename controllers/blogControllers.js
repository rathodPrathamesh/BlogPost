const  mongoose = require('mongoose');
const blogModel = require('../models/blogModel');
const userModel = require('../models/userModel');

// GET all blogs
exports.getAllBlogsController = async (req, res) => {
    try {
      const blogs = await blogModel.find({}).populate("user");
      if (!blogs) {
        return res.status(200).send({
          success: false,
          message: "No Blogs Found",
        });
      }
      return res.status(200).send({
        success: true,
        BlogCount: blogs.length,
        message: "All Blogs lists",
        blogs,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error While Getting Blogs",
        error,
      });
    }
  };


// GET Blog
exports.createBlogController = async (req, res) => {
    try {
      const { title, description, image, user } = req.body;
      //validation
      if (!title || !description || !image || !user) {
        return res.status(400).send({
          success: false,
          message: "Please Provide All Fields",
        });
      }
      const existingUser = await userModel.findById(user)
      // Validate
      if(!existingUser){
        return res.status(404).send({
          success:false,
          message:"unable to find user"
        })
      }

      const newBlog = new blogModel({title, description, image, user});
      const session = await mongoose.startSession();
      session.startTransaction();
      await newBlog.save({session});
      existingUser.blogs.push(newBlog);
      await existingUser.save({session});
      await session.commitTransaction();

      await newBlog.save();
      return res.status(201).send({
        success: true,
        message: "new blog creahed!",
        newBlog,
      });
    }
    catch(error){
        console.log(error)
        return res.status(400).send({
            success:false,
            message:"Error while creating a blog",
            error,
        })
    }
};
//Update Blog
exports.updateBlogController = async(req, res) => {
  try {
    const {id} = req.params;
    const { title, description, image } = req.body;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      {...req.body},
      {new: true}
    );
    return res.status(200).send({
      success:true,
      message:"Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success:false,
      message:"Error in updating blog",
      error,
    });
  }
};


// Single blog
exports.getBlogByIdController = async(req, res) => {
  try {
    const {id} = req.params
    const blog = await blogModel.findById(id)
    if(!blog){
      return res.status(404).send({
        success:false,
        messsage:"blog not found with this id",
      })
    }
    return res.status(200).send({
      success:true,
      message:"fetched single blog",
      blog,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      success:false,
      message:"Error while getting a single blog",
      error,
    })
  }
};

// Delete blog
exports.deleteBlogController = async(req,res) => {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success:true,
      message:"blog deleted successfully!",
    });
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      success:false,
      message:"Error while deleting the blog",
      error,
    });
  }
};

// GET USER BLOG
exports.userBlogController = async(req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate('blogs')
    if(!userBlog){
      return res.status(400).send({
        success:false,
        message:'blogs not found with this id',
      })
    }
    return res.status(200).send({
      success:true,
      message: "user blog",
      userBlog,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      success:false,
      messsage: "error in user blog",
      error,
    })
  }
};



