import { Schema, model } from "mongoose";

const studentSchema = new Schema({
  name: { type: String, default: "Студент" },
  grade: { type: String },
  date: { type: Date, default: Date.now },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
  subjects: [{ type: String }]
});

export const Student = model("Student", studentSchema);
