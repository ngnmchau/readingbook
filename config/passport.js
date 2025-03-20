const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy; // ✅ Thêm dòng này
const User = require('../models/User'); // Import model User

// 🟢 Cấu hình đăng nhập với Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/login/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// 🟢 Cấu hình đăng nhập với Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'emails']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });
        if (!user) {
          user = new User({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : null,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        if (!user.email && profile.emails) {
            user.email = profile.emails[0].value; // Nếu có email, cập nhật vào user
            await user.save();
          }
        return done(err, null);
      }
    }
  )
);

// 🟢 Serialize & Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
