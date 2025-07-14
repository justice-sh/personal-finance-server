import { Request, Response } from "express";
import { CookieOptions, Cookies } from "@/types/session";

export const cookies = (req: Request, res?: Response): Cookies => {
  return {
    get: (name: string) => {
      const value = req.cookies[name];
      if (value === undefined) return undefined;
      return { name, value };
    },

    set: (key: string, value: string, options?: CookieOptions) => {
      req.cookies[key] = value;
    },

    delete: (key: string) => {
      res?.clearCookie(key);
      // delete req.cookies[key];
    },
  };
};
