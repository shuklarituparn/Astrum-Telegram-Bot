import { Schema, model } from "mongoose";

const teacherSchema = new Schema({
  name: { type: String, default: "Учитель" },
  age: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  subject: [{ type: String }],
  date: { type: Date, default: Date.now },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  experience: { type: String },
  vacantplaces: { type: String },
  group_individual: {
    type: String
  },
  grade: [{ type: String }],
  photo: { type: String },
  rating: [{ type: Object }]
});

export const Teacher = model("Teacher", teacherSchema);
