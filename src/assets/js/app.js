'use strict';

import $ from 'jquery';

console.log('Test');

let test = 'Test Let';
console.log(test);

$(function() {
  $('.content').click(function() {
    alert('Hello');
  });
});
