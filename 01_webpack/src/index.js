import name from './name';
import './index.css';
import './less.less';
import './sass.scss';

import './base';

// 别名
import 'bootstrap';

if(PRODUCTION) {
    console.log('生产');
} else {
    console.log('开发');
}

console.log(VERSION,INFO);

import moment from 'moment';

console.log(moment());

/* document.querySelector('#root').innerHTML = name;

// 有可能返回一个新的文件路径(相对于输出目录)，也有可能返回 base64
import sm from './images/sm.png';
let img = new Image();
img.src = sm;
document.body.appendChild(img); */

// import 'style-loader!css-loader!./index.css';

// window.jQuery = 导入对象
// let $ = require('expose-loader?jQuery!jquery');

// console.log(_);

// 虽然可用，当前作用于并没有 jQuery ，语法不通过
// console.log($);

import jQuery from 'jquery';
console.log(jQuery);