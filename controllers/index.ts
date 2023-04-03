import { help, Rated, RatingController, welcome } from "./commonController";
import { StudentQuestion } from "./studentController";
import { TeacherQuestion } from "./teacherController";
export const Welcome = welcome;
export const Help = help;
export const TeacherQuestionnaire = TeacherQuestion;
export const StudentQuestionnaire = StudentQuestion;
export const Rating = RatingController;
export const RatedTeacher = Rated;
