import { startOfWeek, endOfWeek } from "date-fns";

export const dateFilterOptions = [
  "All",
  "Today",
  "This week",
  "Next week",
  "Next Month",
];

export const getDatePeriod = (option) => {
  switch (option) {
    case "Today":
      return convertToRequestFormat(getToday());
    case "This week":
      return convertToRequestFormat(getThisWeek());
    case "Next week":
      return convertToRequestFormat(getNextWeek());
    case "Next Month":
      return convertToRequestFormat(getNextMonth());
    default:
      return null;
  }
};

export const convertToRequestFormat = (period) => {
  const s = period[0].toISOString().split("T")[0];
  const e = period[1].toISOString().split("T")[0];
  return [s, e];
};

export const getToday = () => {
  const currentDate = new Date();
  return [currentDate, currentDate];
};

export const getThisWeek = () => {
  const currentDate = new Date();

  const startOfThisWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  const endOfThisWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

  return [startOfThisWeek, endOfThisWeek];
};

export const getNextWeek = () => {
  const currentDate = new Date();

  const startOfNextWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

  const endOfNextWeek = endOfWeek(startOfNextWeek, { weekStartsOn: 1 });

  return [startOfNextWeek, endOfNextWeek];
};

export const getNextMonth = () => {
  const currentDate = new Date();

  const startOfNextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  const endOfNextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    0
  );

  return [startOfNextMonth, endOfNextMonth];
};
