import { stringUtil } from "@/shared/utils/string";
import { TransactionSortBy } from "../enums/sort-by";

export const formatSortByLabel = (value: TransactionSortBy) => {
  switch (value) {
    case TransactionSortBy.A_TO_Z:
      return "A to Z";
    case TransactionSortBy.Z_TO_A:
      return "Z to A";
    default:
      return stringUtil.capitalize(value);
  }
};
