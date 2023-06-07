const router = require('express').Router();
const { Restaurant } = require('../../models');
const sequelize = require('../../config/connection');
// const withAuth = require('../../utils/auth');

// get all restaurants
router.get('/', (req, res) => {
    console.log('======================');
    Restaurant.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'address',
        'restaurant_url',
        'created_at',
      //   [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
        order: [['created_at', 'DESC']], // newest post first
      include: [
        // include the Comment model here:
        // {
        //   model: Comment,
        //   attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        //   include: {
        //     model: User,
        //     attributes: ['username']
        //   }
        // },
        // {
        //   model: User,
        //   attributes: ['username']
        // }
      ]
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/:id', (req, res) => {
  Restaurant.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'name',
      'description',
      'address',
      'restaurant_url',
      'created_at',
      // [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      // {
      //   model: Comment,
      //   attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
      //   include: {
      //     model: User,
      //     attributes: ['username']
      //   }
      // },
      // {
      //   model: User,
      //   attributes: ['username']
      // }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// router.post('/', withAuth, (req, res) => {
router.post('/', (req, res) => {
    // expects {name: 'The Monkfish', description: 'Best restaurant ever', address: 'Cape Town, South Africa', restaurant_url: 'www.themonkfish.com'}
    Restaurant.create({
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        restaurant_url: req.body.restaurant_url
    })
      .then(dbRestaurantData => res.json(dbRestaurantData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


// PUT /api/posts/upvote
// router.put('/upvote', withAuth, (req, res) => {
//   // make sure the session exists first
//   if (req.session) {
//     // pass session id along with all destructured properties on req.body      // custom static method created in models/Post.js
//     Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
//       .then(updatedVoteData => res.json(updatedVoteData))
//       .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//       });
//   }
// });

// router.put('/:id', withAuth, (req, res) => {
router.put('/:id', (req, res) => {
    Restaurant.update(
      {
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        restaurant_url: req.body.restaurant_url
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// router.delete('/:id', withAuth, (req, res) => {
router.delete('/:id', (req, res) => {
    Restaurant.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports = router;