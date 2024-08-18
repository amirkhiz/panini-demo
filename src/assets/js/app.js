'use strict';

import Swal from 'sweetalert2';

console.log('Hello World');

let test = 'Test Let';
console.log(test);

$(function () {
  $('.content').click(function () {
    Swal.fire({
      title: 'The Internet?',
      text: 'That thing is still around?',
      icon: 'question'
    });
  });
});
