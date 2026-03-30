const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";
const VIETNAM_UTC_OFFSET_IN_MS = 7 * 60 * 60 * 1000;

const createUtcDateBoundaryFromVietnamCalendarDay = (year, month, day) =>
  new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - VIETNAM_UTC_OFFSET_IN_MS);

const parseDateString = (dateString) => {
  const [year, month, day] = String(dateString).split("-").map(Number);
  return { year, month, day };
};

const getVietnamDateParts = (date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: VIETNAM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
};

const buildRangeFromQuery = ({ from, to }) => {
  const fromParts = parseDateString(from);
  const toParts = parseDateString(to);
  const start = createUtcDateBoundaryFromVietnamCalendarDay(
    fromParts.year,
    fromParts.month,
    fromParts.day,
  );
  const endExclusive = new Date(
    createUtcDateBoundaryFromVietnamCalendarDay(
      toParts.year,
      toParts.month,
      toParts.day,
    ).getTime() + ONE_DAY_IN_MS,
  );

  return {
    from,
    to,
    fromParts,
    toParts,
    start,
    endExclusive,
  };
};

export {
  ONE_DAY_IN_MS,
  VIETNAM_TIME_ZONE,
  buildRangeFromQuery,
  createUtcDateBoundaryFromVietnamCalendarDay,
  getVietnamDateParts,
  parseDateString,
};
