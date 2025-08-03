/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { ZodError } from "zod";
import { envVars } from "../config/env";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log unexpected errors in development
  if (envVars.NODE_ENV === "development") {
    console.error("Error ", {
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "failed",
      message: "Validation error",
      errors: err.issues.map(e => ({
        field: e.path.join('.') || 'unknown',
        message: e.message,
        code: e.code,
      }))
    });
  }

  // Handle custom AppErrors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      status: "failed",
      message: `Duplicate field value: ${field}. Please use another value`
    });
  }

  // Handle MongoDB validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      status: "failed",
      message: "Validation failed",
      errors
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "failed",
      message: "Invalid token. Please log in again"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "failed",
      message: "Token expired. Please log in again"
    });
  }

  // Handle all other errors
  console.error("UNEXPECTED ERROR 💥", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
};