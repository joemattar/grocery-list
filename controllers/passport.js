const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/User");

require("dotenv").config();

module.exports = function (passport) {
  // Passport - Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        let user = await User.findOne({ googleID: profile.id });
        if (user) {
          // User exists in database - update fields from google if any changed
          user.displayName = profile.displayName;
          user.firstName = profile.name.givenName;
          user.lastName = profile.name.familyName;
          user.email = profile.email;
          user.image = profile.photos[0].value;

          // Save changes to user
          await user.save();
          return done(null, user);
        } else {
          // Create a new user based on user schema
          const newUser = new User({
            googleID: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.email,
            image: profile.photos[0].value,
          });
          // User does not exist in database, create user in database
          await newUser.save();
          return done(null, newUser);
        }
      }
    )
  );

  // Passport Serialize
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Passport De-Serialize
  passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });
};
