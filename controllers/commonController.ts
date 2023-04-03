import { CronJob } from "cron";
import { Context } from "telegraf";
import { bot, globalAny } from "../main";
import { Student } from "../models/studentModel";
import { Teacher } from "../models/teacherModel";
import { STUDENTQUEST } from "../questions/student";
import { TEACHERQUEST } from "../questions/teacher";

export const welcome = async (ctx: Context) => {
  await ctx.telegram.sendPhoto(
    ctx.chat?.id!,
    `https://freeimage.host/i/HOHfPyl`,
    {
      caption: `
      Привет, ${ctx.from?.first_name}! 👋 Добро пожаловать в ASTRUM SCHOOL, динамично развивающееся сообщество, объединяющее учителей и учащихся из всех слоев общества.
    `
    }
  );
  await ctx.telegram.sendMessage(ctx.chat?.id!, `Вы учитель или ученик? ✨`);
  await ctx.telegram.sendMessage(
    ctx.chat?.id!,
    `Выберите один из вариантов ниже:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Учитель",
              callback_data: "teacher"
            },
            {
              text: "Ученик",
              callback_data: "student"
            }
          ]
        ]
      }
    }
  );
};

export const help = async (ctx: Context) => {
  await ctx.telegram.sendMessage(
    ctx.chat?.id!,
    `Вот несколько команд для вашей помощи\n\n/help - помощь\n\n/subscribe - подписаться на рассылку\n\n/unsubscribe - отписаться от рассылки\n\n/feedback - обратная связь\n\n/contacts - контакты\n\n/links - полезные ссылки\n\n/faq - часто задаваемые вопросы\n\n/teachers - список учителе�`
  );
};

export const TeacherSelect = async (ctx: any) => {
  const teacherName = ctx.update.callback_query.data.split(" ")[1];
  const studentName = ctx.update.callback_query.data.split(" ")[2];
  await PrintInfo(teacherName, ctx, studentName);
};

async function PrintInfo(name: string, ctx: Context, student_name: string) {
  Teacher.find({ name: { $regex: name } }).then(async (teacher) => {
    let message = `📞 Контактная информация\n\n📍 ${teacher[0]
      .address!}\n📱 ${teacher[0].phone!}\n📧 ${teacher[0].email!}`;
    await ctx.telegram.sendPhoto(ctx.chat?.id!, teacher[0].photo!, {
      caption: message,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Карты",
              url: `https://www.google.com/maps/search/${teacher[0].address!}`
            }
          ]
        ]
      }
    });
  });
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const month = date.getMonth();
  const dat = date.getDate();
  new CronJob(
    `${minutes} ${hours} ${new Date(
      date.getFullYear(),
      month,
      dat + 1
    ).getDate()} ${
      new Date(date.getFullYear(), month, dat + 1).getMonth() + 1
    } ${new Date(date.getFullYear(), month, dat + 1).getDay()}`,
    async () => {
      await ctx.telegram.sendMessage(
        ctx.chat?.id!,
        `📣 Внимание! Уважаемый ${student_name}! Довольны ли вы своим учителем?`
      );
      await ctx.telegram.sendMessage(
        ctx.chat?.id!,
        `Пожалуйста, выберите "Да" или "Нет"`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Да",
                  callback_data: `yes ${name} ${student_name}`
                },
                {
                  text: "Нет",
                  callback_data: "no"
                }
              ]
            ]
          }
        }
      );
    }
  );
}

export const RatingController = async function (ctx: any) {
  if (
    ctx.update.callback_query.data.split(" ").length > 2 &&
    ctx.update.callback_query.data.split(" ")[0] == "yes"
  ) {
    const teacherName = ctx.update.callback_query.data.split(" ")[1];
    const studentName = ctx.update.callback_query.data.split(" ")[2];
    Student.find({
      name: studentName
    })
      .then((student) => {
        Teacher.find({
          name: teacherName
        }).then((teacher) => {
          student[0].teacher = teacher?.[0]._id;
          student[0].save();
          teacher[0].students.push(student[0]._id);
          teacher[0].save();
        });
      })
      .catch((err) => {
        console.log(err);
      });
    await ctx.telegram.sendMessage(
      ctx.chat?.id!,
      `Спасибо вам за ваше ценное мнение! Желаю удачи в вашей учебе ✨`
    );
  } else {
    await ctx.telegram.sendMessage(
      ctx.chat?.id!,
      `Пожалуйста, дайте свою оценку учителю`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "1",
                callback_data: `1 ${
                  ctx.update.callback_query.data.split(" ")[1]
                } ${ctx.update.callback_query.data.split(" ")[2]}`
              },
              {
                text: "2",
                callback_data: `2 ${
                  ctx.update.callback_query.data.split(" ")[1]
                } ${ctx.update.callback_query.data.split(" ")[2]}`
              },
              {
                text: "3",
                callback_data: `3 ${
                  ctx.update.callback_query.data.split(" ")[1]
                } ${ctx.update.callback_query.data.split(" ")[2]}`
              },
              {
                text: "4",
                callback_data: `4 ${
                  ctx.update.callback_query.data.split(" ")[1]
                } ${ctx.update.callback_query.data.split(" ")[2]}`
              },
              {
                text: "5",
                callback_data: `5 ${
                  ctx.update.callback_query.data.split(" ")[1]
                } ${ctx.update.callback_query.data.split(" ")[2]}`
              }
            ]
          ]
        }
      }
    );
  }
};

export const Rated = async (ctx: any) => {
  const rating = ctx.update.callback_query.data.split(" ")[0];
  const teacherName = ctx.update.callback_query.data.split(" ")[1];
  const studentName = ctx.update.callback_query.data.split(" ")[2];
  Teacher.find({
    name: teacherName
  }).then((teacher) => {
    teacher[0].rating.push({
      student: studentName,
      rating: rating
    });
    teacher[0].save();
  });
};

export const HandleFunc = async (ctx: any) => {
  if (globalAny.name === "Teacher") {
    globalAny.answers_teachers.push(ctx.message?.text as string);
    globalAny.i = globalAny.i + 1;
    if (globalAny.i < TEACHERQUEST.length) {
      await ctx.telegram.sendMessage(ctx.chat?.id!, TEACHERQUEST[globalAny.i]);
    }
    if (globalAny.i == TEACHERQUEST.length - 1) {
      bot.on("photo", async (ctx: any) => {
        globalAny.answers_teachers.push(
          ctx.message?.photo[ctx.message?.photo.length - 1]["file_id"]
        );
        await ctx.telegram.sendMessage(ctx.chat?.id!, "Спасибо за ответы!");
        const teacher = new Teacher({
          name: globalAny.answers_teachers[0],
          age: globalAny.answers_teachers[1],
          address: globalAny.answers_teachers[2],
          phone: globalAny.answers_teachers[3],
          email: globalAny.answers_teachers[4],
          subject: globalAny.answers_teachers[5]
            .split(",")
            .map((item: string) => item.trim())
            .map((item: string) => item.toUpperCase()),
          students: [],
          experience: globalAny.answers_teachers[6],
          vacantplaces: globalAny.answers_teachers[7],
          group_individual: globalAny.answers_teachers[8],
          grade: globalAny.answers_teachers[9]
            .split(",")
            .map((item: string) => item.trim()),
          photo: globalAny.answers_teachers[10]
        });
        await teacher.save();
      });
    }
  }
  if (globalAny.name === "Student") {
    globalAny.answers_student.push(ctx.message?.text as string);
    globalAny.j = globalAny.j + 1;
    if (globalAny.j < STUDENTQUEST.length) {
      await ctx.telegram.sendMessage(ctx.chat?.id!, STUDENTQUEST[globalAny.j]);
    }
    if (globalAny.j == STUDENTQUEST.length) {
      await ctx.telegram.sendMessage(
        ctx.chat?.id!,
        `Эй ${globalAny.answers_student[0]}! 👋 Вот учителя, которые соответствуют вашим предпочтениям`
      );
      let message_id = (
        await ctx.telegram.sendMessage(ctx.chat?.id!, `Выборка данных....`)
      ).message_id;
      const student = new Student({
        name: globalAny.answers_student[0],
        grade: globalAny.answers_student[1],
        subjects: globalAny.answers_student[2]
          .split(",")
          .map((item: string) => item.trim())
          .map((item: string) => item.toUpperCase())
      });
      student.save();
      Teacher.find({
        subject: {
          $in: globalAny.answers_student[2]
            .split(",")
            .map((x: string) => x.trim())
            .map((x: string) => x.toUpperCase())
        },
        grade: { $in: [globalAny.answers_student[1]] }
      })
        .then(async (teachers) => {
          await beautify(
            teachers,
            ctx,
            message_id,
            globalAny.answers_student[0]
          );
        })
        .catch(async (err) => {
          console.log(err);
          await ctx.telegram.sendMessage(ctx.chat.id, "No Teachers Found!");
        });
    }
  }
};

async function beautify(
  teachers: any,
  ctx: Context,
  message_id: number,
  student_name: string
) {
  await ctx.deleteMessage(message_id);
  let i = 0;
  let message = `👨‍🏫Имя: ${teachers[i].name} \n📚Предметы: ${teachers[
    i
  ].subject.join(", ")} \n📝Класс: ${teachers[i].grade.join(", ")}\n🎓Опыт: ${
    teachers[i].experience
  } многолетний опыт работы`;
  await ctx.telegram.sendPhoto(ctx.chat?.id!, teachers[i].photo, {
    caption: message,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Выбрать",
            callback_data: `select ${teachers[i].name} ${student_name}`
          }
        ]
      ]
    }
  });
}
