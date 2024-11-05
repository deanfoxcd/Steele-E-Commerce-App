import { validationResult } from 'express-validator';

export const handleErrors = (templateFunc) => {
  return (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(templateFunc({ errors }));
    }

    next();
  };
};
