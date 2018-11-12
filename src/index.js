import _ from 'lodash';
import './style.css';
// import Icon from './img.png';
import printMe from './print.js';
import message from './message';


function component() {
  let element = document.createElement('div');
  var btn = document.createElement('button');

  // Lodash, currently included via a script, is required for this line to work
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  // element.classList.add('hello');

  // var myIcon = new Image();
  // myIcon.src = Icon;
  // element.appendChild(myIcon);

  element.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;
  element.appendChild(btn);
  return element;
}

const paragraph = document.createElement('p');
paragraph.innerHTML = message;
document.body.prepend(paragraph);

document.body.appendChild(component());
