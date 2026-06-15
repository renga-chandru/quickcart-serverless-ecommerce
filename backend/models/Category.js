import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom ID matching frontend (e.g. 'electronics')
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: "" },
  count: { type: Number, default: 0 },
  image: { type: String, default: "" }
}, {
  timestamps: true
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
