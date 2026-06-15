import Category from "../models/Category.js";

const categoryService = {
  getCategories: async () => {
    return await Category.find({});
  }
};

export default categoryService;
