/* eslint-disable @typescript-eslint/no-explicit-any */
// Stub file — replaced automatically when `npx convex dev` runs.

import type { GenericDataModel } from "convex/server";

export type DataModel = GenericDataModel;
export type Id<T extends string = string> = string & { __tableName: T };
