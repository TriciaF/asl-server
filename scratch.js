const list = require('./linkedlist');

const newList = new list();

newList.insertLast({
  image: 'https://i.imgur.com/QVByr5l.png',
  answer: 'a'
});
newList.insertLast({
  image: 'https://i.imgur.com/tv4s5uF.png',
  answer: 'b'
});
newList.insertLast({
  image: 'https://i.imgur.com/649Jbp9.png',
  answer: 'c'
});

console.log(newList);