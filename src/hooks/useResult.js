export const useResult = (type) => {
  const maxSkills = {
    TRA: 10,
    DMT: 2,
    TUM: 8,
  }[type];

  const skillFields = [
    ...Array(maxSkills)
      .fill(0)
      .map((_, i) => `s${i + 1}`),
    "lnd",
  ];

  const scoreFields = {
    TRA: ["exe", "diff", "time", "hd", "sum"],
    DMT: ["exe", "diff", "sum"],
    TUM: ["exe", "diff", "sum"],
  }[type];

  const headerWidth = {
    rank: "50px",
    rtn: "50px",
    name: "250px",
    skill: "30px",
    score: "70px",
    total: "70px",
  };

  return { maxSkills, skillFields, scoreFields, headerWidth };
};
