const normalize = require('normalize-url');
// Load Profile Model
const Profile = require('../models/Profile');

//Load User Model
const User = require('../models/User');

//Load Validation
const {
  validateProfileInput,
  validateExperienceInput,
  validateEducationInput
} = require('../validator');

const getProfiles = (req, res) => {
  Profile.find()
    .populate('user', ['_id', 'name', 'email', 'created'])
    .then((profiles) => {
      if (!profiles) {
        
        return res.status(404).json({error: 'There are no profiles.'});
      }
      res.json(profiles);
    })
    .catch((err) => res.status(404).json({ profile: 'no profiles found.' }));
};

const getProfileByHandle = (req, res) => {
  console.log('HANDLE: ', req.params.handle);
  

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'email'])
    .then((profile) => {
      if (!profile) {
       
        return res.status(404).json({ error: 'There is no profile for this user',
      msg: 'No profile found.'});
      }

      res.status(200).json(profile);
    })
    .catch((err) => res.status(404).json({ profile: 'no profile found.' }));
};

const getProfileById = (req, res) => {
  console.log('UserId Handle: ', req.params.userId);
  

  Profile.findOne({ user: req.params.userId })
    .populate('user', ['name', 'email'])
    .then((profile) => {
      if (!profile) {
        return res.status(404).json({error: 'There is no profile for this user'});
      }

      res.status(200).json(profile);
    })
    .catch((err) =>
      res.status(404).json({ profile: 'There is no profile for this user' })
    );
};

const getCurrentUserProfile = (req, res) => {
  console.log('USER: ', req.user);
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'email'])
    .then((profile) => {
      if (!profile) {
        return res
          .status(404)
          .json({ error: 'There is no profile for this user' });
      }

      res.status(200).json(profile);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send('server error');
    });
};

const addExperience = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      console.log('GETTIN THE USER PROFILE: ', req.user);
      console.log('PROFILE: ', profile);
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //Add to exp array
      profile.experience.unshift(newExp);

      profile.save().then((profile) => res.json(profile));
    })
    .catch((err) =>
      res.status(404).json({ error: 'you do not have a profile created.' })
    );
};

const addEducation = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then((profile) => res.json(profile));
    })
    .catch((err) =>
      res.status(404).json({ error: 'you do not have a profile created.' })
    );
};

const deleteExperience = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      //Get remove index
      const removeIndex = profile.experience
        .map((item) => item.id)
        .indexOf(req.params.expId);

      //Splice out of array
      profile.experience.splice(removeIndex, 1);

      //Save
      profile.save().then((profile) =>
        res.json({
          profile,
          msg: 'Experience successfully deleted.'
        })
      );
    })
    .catch((err) =>
      res.status(404).json({
        error: 'You dont have the authority to delete experience.'
      })
    );
};

const deleteEducation = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      //Get remove index
      const removeIndex = profile.education
        .map((item) => item.id)
        .indexOf(req.params.eduId);

      //Splice out of array
      profile.education.splice(removeIndex, 1);

      //Save
      profile.save().then((profile) =>
        res.json({
          profile,
          msg: 'Education successfully deleted.'
        })
      );
    })
    .catch((err) =>
      res.status(404).json({
        error: 'You dont have the authority to delete education.'
      })
    );
};

const deleteProfile = (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id }).then(() => {
    User.findOneAndRemove({ _id: req.user.id }).then(() =>
      res.json({ success: true })
    );
  });
};

// const createProfile = (req, res) => {
//   const profile = new Profile(req.body);

//   profile.save().then((result) => {
//     res.status(200).json({
//       profile: result,
//     });
//   });
// };

const createAndUpdateUserProfile = (req, res) => {
  //Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.dob) profileFields.dob = req.body.dob;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.city) profileFields.city = req.body.city;
  if (req.body.country) profileFields.country = req.body.country;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;

  //Skills - Split into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  //Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.kingschat) profileFields.social.kingschat = req.body.kingschat;

  Profile.findOne({ user: req.user.id }).then((profile) => {
    if (profile) {
      //Update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then((profile) => {
        return res.json({ profile, msg: 'user profile successfully updated.' });
      });
    } else {
      //Create

      //Check if handle exists
      Profile.findOne({ handle: profileFields.handle }).then((profile) => {
        if (profile) {
          return res.status(400).json({error: 'That handle already exists.'});
        }

        //Save Profile
        new Profile(profileFields).save().then((profile) => res.json(profile));
      });
    }
  });
};

const createAndUpdateUserProfile2 = async (req, res) => {
  const {
    handle,
    city,
    country,
    location,
    bio,
    dob,
    skills,
    status,
    youtube,
    linkedin,
    facebook,
    kingschat
  } = req.body;

  const profileFields = {
    user: req.user.id,
    handle:
      handle && handle !== '' ? normalize(handle, { forceHttps: true }) : '',
    city,
    country,
    location,
    bio,
    dob,
    skills: Array.isArray(skills)
      ? skills
      : skills.split(',').map((skill) => ' ' + skill.trim()),
    status
  };

  // Build social object and add to profileFields
  const socialfields = { youtube, linkedin, facebook, kingschat };

  for (const [key, value] of Object.entries(socialfields)) {
    if (value && value.length > 0)
      socialfields[key] = normalize(value, { forceHttps: true });
  }
  profileFields.social = socialfields;

  try {
    // Using upsert option (creates new doc if no match is found):
    // let profile = await Profile.findOneAndUpdate(
    //   { user: req.user.id },
    //   { $set: profileFields },
    //   { new: true, upsert: true }
    // );
    // res.json(profile);

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        //Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => {
          return res.json({
            profile,
            msg: 'user profile successfully updated.'
          });
        });
      } else {
        //Create

        //Check if handle exists
        Profile.findOne({ handle: profileFields.handle })
          .then((profile) => {
            if (profile) {
              return res.status(400).json({
                error: 'That handle already exists.'
              });
            }

            //Save Profile
            new Profile(profileFields).save((err, profile) => {
              if (err) {
                return res
                  .status(401)
                  .json({ error: 'Error saving profile in the database.' });
              }

              return res.status(200).json({
                profile,
                msg: 'Profile saved successfully.'
              });
            });
          })
          .catch((err) => res.status(500).send(err));
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getProfiles,
  getProfileByHandle,
  getProfileById,
  addExperience,
  addEducation,
  deleteEducation,
  deleteExperience,
  deleteProfile,
  getCurrentUserProfile,
  createAndUpdateUserProfile,
  createAndUpdateUserProfile2
};
