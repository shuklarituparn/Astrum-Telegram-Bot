import { Telegraf } from "telegraf";
import {
  Help,
  RatedTeacher,
  Rating,
  StudentQuestionnaire,
  TeacherQuestionnaire,
  Welcome
} from "./controllers";
import { Configure } from "./config/config";
import { HandleFunc, TeacherSelect } from "./controllers/commonController";
Configure();
export const globalAny: any = global;
globalAny.name = "";
export const bot = new Telegraf(process.env.TOKEN as string);
bot.start(Welcome);
bot.help(Help);
bot.action("teacher", TeacherQuestionnaire);
bot.action("student", StudentQuestionnaire);
bot.action(/^select/, TeacherSelect);
bot.action(["yes", "no"], Rating);
bot.action(/^[0-9]/, RatedTeacher);
bot.on("text", HandleFunc);
bot
  .launch()
  .then(() => console.log("BOT IS UP!"))
  .catch((err) => console.log(err));
