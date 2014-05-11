'use strict';

// DTOs
var posts = {
  data: [
    {
      id: postDm3._id,
      from: { id: 2, name: 'Chuck Norris' },
      message: 'Hi there! Just wanted to say hey!',
      createdTime: now.subtractHours(28),
      to: { data: [
        { id: 1, name: 'Teoman Soygul' }
      ] }
    },
    {
      id: postDm2._id,
      from: { id: 1, name: 'Teoman Soygul' },
      message: '"Computers are useless. They can only give you answers." Pablo Picasso',
      createdTime: now.subtractHours(49),
      updatedTime: now.subtractHours(24),
      likes: {
        data: [
          { id: 2, name: 'Chuck Norris'}
        ],
        userLikes: false,
        count: 1
      }
    },
    {
      id: postDm1._id,
      from: { id: 1, name: 'Teoman Soygul' },
      message: 'Hi guys, I\'m traveling to Bolivia for the weekend!',
      createdTime: now.subtractHours(97),
      updatedTime: now.subtractHours(24),
      comments: {
        data: [
          {
            id: postDm1.comments[0]._id,
            from: { id: 2, name: 'Chuck Norris' },
            createdTime: now.subtractHours(26),
            message: 'Ola! This is a nice idea!',
            likes: {
              data: [
                { id: 1, name: 'Teoman Soygul' },
                { id: 3, name: 'Albert Einstein' }
              ],
              userLikes: true,
              count: 2
            }
          },
          {
            id: postDm1.comments[1]._id,
            from: { id: 3, name: 'Albert Einstein' },
            createdTime: now.subtractHours(25),
            message: 'Don\'t forget to bring back an iguana:)',
            likes: {
              data: [
                { id: 1, name: 'Teoman Soygul' }
              ],
              userLikes: true,
              count: 1
            }
          },
          {
            id: postDm1.comments[2]._id,
            from: { id: 1, name: 'Teoman Soygul' },
            createdTime: now.subtractHours(24),
            message: 'Thanks guys, I\'ll see you when I get back.'
          }
        ],
        count: 3
      },
      likes: {
        data: [
          { id: 2, name: 'Chuck Norris' },
          { id: 3, name: 'Albert Einstein' }
        ],
        userLikes: false,
        count: 2
      }
    }
  ],
  paging: {
    previous: '',
    next: ''
  }
};

var thread1 = {
  id: threadDm1._id,
  title: 'One-to-one conversation',
  createdTime: now.subtractHours(76),
  updateTime: now.subtractHours(71),
  messages: {
    data: [
      {createdTime: now.subtractHours(76), message: 'Hi there! How are you?', from: {id: 1, name: 'Teoman Soygul'}},
      {createdTime: now.subtractHours(71), message: 'Thanks I\'m fine. How about you?', from: {id: 2, name: 'Chuck Norris'}}
    ],
    count: 2,
    paging: {
      previous: '',
      next: ''
    }
  }
};

var chats = [
  {
    data: [
      {
        id: chatDms[0]._id,
        title: '',
        updatedTime: getTime(-71),
        picture: '',
        lastMessage: ''
      }
    ],
    paging: {
      previous: '',
      next: ''
    }
  }
];