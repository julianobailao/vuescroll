import Vue from 'vue';
import scrollMap from '../config/scrollMap'
/**
 * @description deepCopy a object.
 * 
 * @param {any} source 
 * @returns 
 */
export function deepCopy(source, target) {
    target = typeof target === 'object'&&target || {};
    for (var key in source) {
        target[key] = typeof source[key] === 'object' ? deepCopy(source[key], target[key] = {}) : source[key];
    }
    return target;
}

/**
 * 
 * @description deepMerge a object.
 * @param {any} from 
 * @param {any} to 
 */
export function deepMerge(from, to) {
    to = to || {};
    for (var key in from) {
        if (typeof from[key] === 'object') {
            if (!to[key]) {
                to[key] = {};
                deepCopy(from[key], to[key])
            } else {
                deepMerge(from[key], to[key]);
            }
        } else {
            if(!to[key])
            to[key] = from[key]
        }
    }
    return to;
}
/**
 * @description define a object reactive
 * @author wangyi
 * @export
 * @param {any} target 
 * @param {any} key 
 * @param {any} source 
 */
export function defineReactive(target, key, source, souceKey) {
    let getter = null;
    if(
        !source[key]
        && typeof source !== 'function'

    ) {
        return;
    }
    souceKey = souceKey || key;
    if(typeof source === 'function') {
        getter = source;
    }
    Object.defineProperty(target, key, {
        get: getter || function() {
            return source[souceKey];
        },
        configurable: true
    })
}

let scrollBarWidth;

export function getGutter() {
  /* istanbul ignore next */
  if (Vue.prototype.$isServer) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  getGutter.isUsed = false;

  return scrollBarWidth;
};

/**
 * @description render bar's style
 * @author wangyi
 * @export
 * @param {any} type vertical or horizontal
 * @param {any} posValue The position value
 */
export function renderTransform(type, posValue) {
    return {
        transform: `translate${scrollMap[type].axis}(${posValue}%)`,
        msTransform: `translate${scrollMap[type].axis}(${posValue}%)`,
        webkitTransform: `translate${scrollMap[type].axis}(${posValue}%)`
    }
}
/**
 * @description 
 * @author wangyi
 * @export
 * @param {any} dom 
 * @param {any} eventName 
 * @param {any} hander 
 * @param {boolean} [capture=false] 
 */
export function on(
    dom,
    eventName,
    hander,
    capture = false
) {
    dom.addEventListener(
        eventName,
        hander,
        capture
    );
}
/**
 * @description 
 * @author wangyi
 * @export
 * @param {any} dom 
 * @param {any} eventName 
 * @param {any} hander 
 * @param {boolean} [capture=false] 
 */
export function off(
    dom,
    eventName,
    hander,
    capture = false
) {
    dom.removeEventListener(
        eventName,
        hander,
        capture
    )
}
/**
 * Calculate the easing pattern
 * @link https://github.com/cferdinandi/smooth-scroll/blob/master/src/js/smooth-scroll.js
 * modified by wangyi7099
 * @param {String} type Easing pattern
 * @param {Number} time Time animation should take to complete
 * @returns {Number}
 */
export function easingPattern  (easing, time) {
    let pattern = null;

    // Default Easing Patterns
    if (easing === 'easeInQuad') pattern = time * time; // accelerating from zero velocity
    if (easing === 'easeOutQuad') pattern = time * (2 - time); // decelerating to zero velocity
    if (easing === 'easeInOutQuad') pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
    if (easing === 'easeInCubic') pattern = time * time * time; // accelerating from zero velocity
    if (easing === 'easeOutCubic') pattern = (--time) * time * time + 1; // decelerating to zero velocity
    if (easing === 'easeInOutCubic') pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
    if (easing === 'easeInQuart') pattern = time * time * time * time; // accelerating from zero velocity
    if (easing === 'easeOutQuart') pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
    if (easing === 'easeInOutQuart') pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
    if (easing === 'easeInQuint') pattern = time * time * time * time * time; // accelerating from zero velocity
    if (easing === 'easeOutQuint') pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
    if (easing === 'easeInOutQuint') pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration

    return pattern || time; // no easing, no acceleration
};


/**
 * 
 * 
 * @export
 * @param {any} elm 
 * @param {any} deltaX 
 * @param {any} deltaY 
 * @param {any} speed 
 * @param {any} easing 
 */
export function goScrolling(
    elm,
    deltaX,
    deltaY,
    speed, 
    easing
) {
    let start = null;
    let positionX = null;
    let positionY = null;
    const startLocationY = elm['scrollTop'];
    const startLocationX = elm['scrollLeft']
    const loopScroll = function(timeStamp) {
        if(!start) {
            start = timeStamp;
        }
        const deltaTime = timeStamp - start;
        let percentage = (deltaTime / speed > 1) ? 1 : deltaTime / speed;
        positionX = startLocationX + (deltaX * easingPattern(easing, percentage));
        positionY = startLocationY + (deltaY * easingPattern(easing, percentage));
        if(Math.abs(positionY - startLocationY) <= Math.abs(deltaY) || Math.abs(positionX - startLocationX) <= Math.abs(deltaX)) {  
             // set scrollTop or scrollLeft
            elm['scrollTop'] = Math.floor(positionY);
            elm['scrollLeft'] = Math.floor(positionX);
            if(percentage < 1) {
                requestAnimationFrame(loopScroll);
            }
        } else {
            start = null;
        }
    }
    requestAnimationFrame(loopScroll);
}   