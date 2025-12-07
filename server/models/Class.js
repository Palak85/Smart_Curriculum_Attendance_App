// import mongoose from "mongoose";

// const SectionSchema = new mongoose.Schema({
//   name: { type: String, required: true }
// });

// const ClassSchema = new mongoose.Schema({
//   className: { type: String, required: true },
//   sections: [{ type: String }] // simple array of section names
// }, { timestamps: true });

// export default mongoose.model("Class", ClassSchema);


import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  className: { type: String, required: true, unique: true },
  sections: { type: [String], default: [] },
});

export default mongoose.model("Class", classSchema);
