export const parseRAWGDate = i_DateString => {
  const dateRegEx = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

  if (dateRegEx.test(i_DateString)) {
    const monthsShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];

    const date = i_DateString.split("-");
    const year = date[0];
    const month = monthsShort[parseInt(date[1]) - 1];
    const day = date[2];

    return `${month} ${day}, ${year}`;
  }
};
