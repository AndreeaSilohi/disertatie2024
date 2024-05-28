import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../modelss/userModel.js';
import {
  baseUrl,
  generateToken,
  isAdmin,
  isAuth,
  mailgunResetPassword,
} from '../utils.js';
import jwt from 'jsonwebtoken';

const userRouter = express.Router();

// userRouter.get(
//   '/',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const users = await User.find({});
//     res.send(users);
//   })
// );

//get users cu paginare
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const count = await User.countDocuments({});
    const totalPages = Math.ceil(count / pageSize);

    const users = await User.find({})
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.send({ users, pageSize, totalPages });
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);

// Endpoint to get user by ID
userRouter.get(
  '/profile/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'Utilizator actualizat', user: updatedUser });
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);

userRouter.put(
  '/update-photo/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.profilePhoto = req.body.profilePhoto || user.profilePhoto;
      const updatedUser = await user.save();
      res.send({ message: 'Fotografie de profil actualizată', user: updatedUser });
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Administratorul nu poate fi șters!' });
        return;
      }
      await user.deleteOne();
      res.send({ message: 'User deleted' });
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      profilePhoto: '', // Add an empty profilePhoto property
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

// userRouter.put(
//   "/profile",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {

//     const user = await User.findById(req.user._id);
//     console.log(user)
//     if (user) {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;

//       if (req.body.password) {
//         user.password = bcrypt.hashSync(req.body.password, 8);
//       }

//       const updatedUser = await user.save();

//       res.send({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         isAdmin: updatedUser.isAdmin,
//         token: generateToken(updatedUser),
//       });
//     } else {
//       res.status(404).send({ message: "User not found" });
//     }
//   })
// );

userRouter.put(
  '/edit/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    console.log(user);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);



// Add a new endpoint to fetch user by email
userRouter.get(
  '/currentById/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);

userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '3h',
      });
      user.resetToken = token;
      await user.save();
      console.log('token', token);
      //reset link
      console.log(`${baseUrl()}/reset-password/${token}`);

      mailgunResetPassword()
        .messages()
        .send(
          {
            from: 'honeyboutique@example.com',
            to: `${user.name} <${user.email}>`,
            subject: `Resetare parolă`,
            html: ` 
           <p>Dă click pe link-ul de mai jos pentru a-ți reseta parola:</p> 
           <a href="${baseUrl()}/reset-password/${token}"}>Resetare parolă</a>
           `,
          },
          (error, body) => {
            console.log('error:', error);
            console.log('body', body);
          }
        );
      res.send({
        message: 'Am trimis un link pe adresa dumneavoastră de mail.',
      });
    } else {
      res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
    }
  })
);

userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        req.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findOne({ resetToken: req.body.token });
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.send({
              message: 'Password reseted successfully',
            });
          }
        } else {
          res.status(404).send({ message: 'Utilizatorul nu a fost găsit' });
        }
      }
    });
  })
);

export default userRouter;
