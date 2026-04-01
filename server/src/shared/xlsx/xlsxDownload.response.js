const sendXlsxBuffer = (res, { fileName, buffer }) => {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  return res.status(200).send(Buffer.from(buffer));
};

export { sendXlsxBuffer };
