import { Context } from "telegraf";
import { globalAny } from "../main";
import { STUDENTQUEST } from "../questions/student";

export const StudentQuestion = async (ctx: Context) => {
  await ctx.telegram.sendMessage(ctx.chat?.id!, STUDENTQUEST[0]);
  globalAny.name = "Student";
  globalAny.j = 0;
  globalAny.answers_student = [];
};
