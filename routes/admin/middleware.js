import { validationResult } from 'express-validator';

export const handleErrors = (templateFunc, dataCB) => {
  return async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let data = {};
      if (dataCB) {
        data = await dataCB(req);
      }
      return res.send(templateFunc({ errors, ...data }));
    }

    next();
  };
};

export const handleSignedIn = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/signin');
  }
  next();
};
