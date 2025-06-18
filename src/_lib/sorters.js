export const sorters = {
  number(n1, n2) {
    return n1 - n2;
  },

  string(s1, s2) {
    return s1.localeCompare(s2);
  }
};
