import { generateStreamToken } from "../lib/stream.js";
import { catchAsync } from "../utils/errorHandler.js";
import { AppError } from "../utils/errorHandler.js";

export const getStreamToken = catchAsync(async (req, res, next) => {
  const token = generateStreamToken(req.user._id);
  
  if (!token) {
    return next(new AppError('Failed to generate stream token', 500));
  }

  res.status(200).json({ 
    success: true,
    token 
  });
});
