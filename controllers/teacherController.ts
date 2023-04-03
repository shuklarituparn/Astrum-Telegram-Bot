import { Context } from "telegraf";
import { globalAny } from "../main";
import { TEACHERQUEST } from "../questions/teacher";

export const TeacherQuestion = async (ctx: Context) => {
  await ctx.telegram.sendMessage(ctx.chat?.id!, TEACHERQUEST[0]);
  globalAny.name = "Teacher";
  globalAny.i = 0;
  globalAny.answers_teachers = [];
};
